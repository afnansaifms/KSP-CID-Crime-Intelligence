const catalyst = require('catalyst-sdk');
const fetch = require('node-fetch');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ── ZCQL queries ──────────────────────────────────────────────────────────
const query = async (app, zcql) => {
  try {
    const result = await app.zcql().executeZCQLQuery(zcql);
    return result || [];
  } catch (e) {
    console.error('ZCQL error:', e.message);
    return [];
  }
};

// ── Search accused by name ────────────────────────────────────────────────
const searchAccused = async (app, name) => {
  const rows = await query(app,
    `SELECT AccusedName, Alias, AgeYear, GenderID, District, Occupation, 
     RiskScore, PriorOffences, CrimeHistory, ModusOperandi, 
     AssociateIds, FinancialLinks, ActiveWarrant, LastKnownLocation, ROWID
     FROM Accused 
     WHERE AccusedName LIKE '%${name}%' 
     OR Alias LIKE '%${name}%'
     LIMIT 10`
  );
  return rows.map(r => r.Accused || r);
};

// ── Get FIRs by district ──────────────────────────────────────────────────
const getFIRsByDistrict = async (app, district, limit = 20) => {
  const rows = await query(app,
    `SELECT CrimeNo, CrimeRegisteredDate, PoliceStation, District,
     CaseStatus, CrimeCategory, GravityOffence, IpcSection,
     Latitude, Longitude, BriefFacts, OfficerInCharge, Severity, ROWID
     FROM CaseMaster
     WHERE District LIKE '%${district}%'
     ORDER BY CrimeRegisteredDate DESC
     LIMIT ${limit}`
  );
  return rows.map(r => r.CaseMaster || r);
};

// ── Get high risk accused ─────────────────────────────────────────────────
const getHighRiskAccused = async (app, limit = 20) => {
  const rows = await query(app,
    `SELECT AccusedName, Alias, District, RiskScore, 
     ActiveWarrant, CrimeHistory, LastKnownLocation, ROWID
     FROM Accused
     ORDER BY RiskScore DESC
     LIMIT ${limit}`
  );
  return rows.map(r => r.Accused || r);
};

// ── Get crime stats per district ──────────────────────────────────────────
const getDistrictStats = async (app) => {
  const rows = await query(app,
    `SELECT District, CrimeCategory, Severity, CaseStatus
     FROM CaseMaster
     LIMIT 500`
  );
  const data = rows.map(r => r.CaseMaster || r);

  // Group by district
  const stats = {};
  data.forEach(r => {
    const d = r.District || 'Unknown';
    if (!stats[d]) stats[d] = { district: d, count: 0, categories: {} };
    stats[d].count++;
    const cat = r.CrimeCategory || 'OTHER';
    stats[d].categories[cat] = (stats[d].categories[cat] || 0) + 1;
  });

  return Object.values(stats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
};

// ── Get recent FIRs ───────────────────────────────────────────────────────
const getRecentFIRs = async (app, limit = 20) => {
  const rows = await query(app,
    `SELECT CrimeNo, PoliceStation, District, CaseStatus,
     CrimeCategory, Severity, BriefFacts, OfficerInCharge, ROWID
     FROM CaseMaster
     ORDER BY CrimeRegisteredDate DESC
     LIMIT ${limit}`
  );
  return rows.map(r => r.CaseMaster || r);
};

// ── Smart search — detect intent from query ───────────────────────────────
const detectIntent = (message) => {
  const q = message.toLowerCase();
  const stopWords = new Set(['who','is','the','are','about','show','me','tell',
    'give','what','find','search','profile','accused','suspect','person',
    'criminal','please','can','you','i','want','need']);

  const words = q.split(/\s+/)
    .filter(w => w.length >= 3 && !stopWords.has(w));

  // Name query
  if (q.includes('profile') || q.includes('who is') || q.includes('accused') ||
      q.includes('suspect') || words.some(w => /^[a-z]{3,}$/.test(w))) {
    const nameWords = words.filter(w =>
      !['high','risk','crime','fir','case','district','stat',
        'hotspot','forecast','network','gang'].includes(w)
    );
    if (nameWords.length > 0) {
      return { intent: 'ACCUSED_SEARCH', term: nameWords.join(' ') };
    }
  }

  if (q.includes('high risk') || q.includes('dangerous') || q.includes('warrant') ||
      q.includes('top accused') || q.includes('most wanted')) {
    return { intent: 'HIGH_RISK' };
  }

  if (q.includes('district') || q.includes('hotspot') || q.includes('where') ||
      q.includes('location') || q.includes('area')) {
    const districts = ['bengaluru','mysuru','mangaluru','hubballi','belagavi',
      'kalaburagi','shivamogga','udupi','tumakuru','raichur','ballari',
      'bidar','hassan','chitradurga','dakshina','uttara','haveri'];
    const found = districts.find(d => q.includes(d));
    return { intent: 'DISTRICT_STATS', district: found || '' };
  }

  if (q.includes('fir') || q.includes('case') || q.includes('recent') ||
      q.includes('latest') || q.includes('robbery') || q.includes('crime rate')) {
    return { intent: 'RECENT_FIRS' };
  }

  if (q.includes('forecast') || q.includes('predict') || q.includes('trend') ||
      q.includes('next month') || q.includes('future')) {
    return { intent: 'FORECAST' };
  }

  return { intent: 'GENERAL' };
};

// ── Build Groq prompt with live data ─────────────────────────────────────
const buildPrompt = (intent, data, message) => {
  let context = '';

  if (intent.intent === 'ACCUSED_SEARCH' && data.length > 0) {
    context = `ACCUSED DATABASE RESULTS for "${intent.term}":\n` +
      data.map(a =>
        `- ${a.AccusedName}${a.Alias ? ` (alias: ${a.Alias})` : ''}, Age ${a.AgeYear}, ${a.District}. ` +
        `Risk: ${a.RiskScore}/100. Crimes: ${a.CrimeHistory}. MO: ${a.ModusOperandi}. ` +
        `Warrant: ${a.ActiveWarrant}. Financial: ${a.FinancialLinks}. ` +
        `Last location: ${a.LastKnownLocation || 'Unknown'}.`
      ).join('\n');
  } else if (intent.intent === 'HIGH_RISK' && data.length > 0) {
    context = `TOP HIGH-RISK ACCUSED:\n` +
      data.slice(0, 10).map((a, i) =>
        `${i+1}. ${a.AccusedName} — Risk: ${a.RiskScore}/100 — ${a.District}` +
        `${a.ActiveWarrant === 'Yes' ? ' ⚠ WARRANT' : ''} — ${a.CrimeHistory}`
      ).join('\n');
  } else if (intent.intent === 'DISTRICT_STATS' && data.length > 0) {
    context = `DISTRICT CRIME STATISTICS:\n` +
      data.map(d =>
        `${d.district}: ${d.count} total cases. Top crimes: ` +
        Object.entries(d.categories)
          .sort(([,a],[,b]) => b-a)
          .slice(0, 3)
          .map(([cat, n]) => `${cat}(${n})`)
          .join(', ')
      ).join('\n');
  } else if (intent.intent === 'RECENT_FIRS' && data.length > 0) {
    context = `RECENT FIR RECORDS:\n` +
      data.slice(0, 15).map(f =>
        `FIR ${f.CrimeNo}: ${f.CrimeCategory} at ${f.PoliceStation}, ${f.District}. ` +
        `Status: ${f.CaseStatus}. Severity: ${f.Severity}. Officer: ${f.OfficerInCharge}.`
      ).join('\n');
  } else if (intent.intent === 'FORECAST' && data.length > 0) {
    context = `DISTRICT TREND DATA FOR FORECASTING:\n` +
      data.map(d => `${d.district}: ${d.count} cases`).join('\n');
  }

  return `You are KIRAN (Karnataka Intelligence and Response Analysis Network), 
the AI crime intelligence assistant for Karnataka State Police CID.

LIVE DATABASE RESULTS:
${context || 'No specific records found for this query.'}

STRICT RULES:
1. Answer ONLY Karnataka Police crime intelligence queries
2. Use the live database results above to answer specifically
3. Format with **bold headers**, bullet points
4. Cite specific names, FIR numbers, risk scores from the data
5. End with: **Confidence: X%** | **Sources: Live Karnataka DataStore**
6. Add **Recommended Action** for investigation queries
7. Reject non-crime queries politely

User query: ${message}`;
};

// ── Cors headers ──────────────────────────────────────────────────────────
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// ── Main handler ──────────────────────────────────────────────────────────
module.exports = async (context, basicIO) => {
  const req = basicIO.getRequest();
  const res = basicIO.getResponse();

  // Handle preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
    res.setStatusCode(200);
    res.setBody('OK');
    basicIO.done();
    return;
  }

  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  try {
    const app = catalyst.initialize(context);
    const body = req.body ? JSON.parse(req.body) : {};
    const { message, endpoint } = body;
    const urlPath = req.url || '';

    // ── Route: /api/chat ───────────────────────────────────────────────
    if (urlPath.includes('/chat') || endpoint === 'chat') {
      if (!message) {
        res.setStatusCode(400);
        res.setBody(JSON.stringify({ error: 'message required' }));
        basicIO.done();
        return;
      }

      const intent = detectIntent(message);
      let data = [];

      // Fetch relevant data based on intent
      switch (intent.intent) {
        case 'ACCUSED_SEARCH':
          data = await searchAccused(app, intent.term);
          break;
        case 'HIGH_RISK':
          data = await getHighRiskAccused(app, 15);
          break;
        case 'DISTRICT_STATS':
          data = await getDistrictStats(app);
          break;
        case 'RECENT_FIRS':
          data = await getRecentFIRs(app, 20);
          break;
        case 'FORECAST':
          data = await getDistrictStats(app);
          break;
        default:
          data = await getRecentFIRs(app, 5);
      }

      // Call Groq with live data context
      if (!GROQ_API_KEY) {
        res.setStatusCode(500);
        res.setBody(JSON.stringify({ error: 'GROQ_API_KEY not configured' }));
        basicIO.done();
        return;
      }

      const prompt = buildPrompt(intent, data, message);
      const groqRes = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 1024,
        }),
      });

      const groqData = await groqRes.json();
      const reply = groqData.choices?.[0]?.message?.content || 'Unable to process query.';

      res.setStatusCode(200);
      res.setBody(JSON.stringify({ reply, intent: intent.intent, records: data.length }));
      basicIO.done();
      return;
    }

    // ── Route: /api/accused/search ─────────────────────────────────────
    if (urlPath.includes('/accused') || endpoint === 'accused') {
      const name = body.name || message || '';
      const data = await searchAccused(app, name);
      res.setStatusCode(200);
      res.setBody(JSON.stringify({ data }));
      basicIO.done();
      return;
    }

    // ── Route: /api/firs ───────────────────────────────────────────────
    if (urlPath.includes('/firs') || endpoint === 'firs') {
      const district = body.district || '';
      const data = district
        ? await getFIRsByDistrict(app, district)
        : await getRecentFIRs(app, 30);
      res.setStatusCode(200);
      res.setBody(JSON.stringify({ data }));
      basicIO.done();
      return;
    }

    // ── Route: /api/stats ──────────────────────────────────────────────
    if (urlPath.includes('/stats') || endpoint === 'stats') {
      const data = await getDistrictStats(app);
      res.setStatusCode(200);
      res.setBody(JSON.stringify({ data }));
      basicIO.done();
      return;
    }

    // ── Route: /api/highrisk ───────────────────────────────────────────
    if (urlPath.includes('/highrisk') || endpoint === 'highrisk') {
      const data = await getHighRiskAccused(app, 20);
      res.setStatusCode(200);
      res.setBody(JSON.stringify({ data }));
      basicIO.done();
      return;
    }

    // Default
    res.setStatusCode(200);
    res.setBody(JSON.stringify({ status: 'KIRAN API active', endpoints: ['/chat', '/accused', '/firs', '/stats', '/highrisk'] }));
    basicIO.done();

  } catch (err) {
    console.error('Function error:', err);
    res.setStatusCode(500);
    res.setBody(JSON.stringify({ error: err.message }));
    basicIO.done();
  }
};