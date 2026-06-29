import { firRecords, accusedRecords, crimeStats } from '../data/mockData';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// ── Build COMPACT system prompt (avoid context overflow) ──────────────────
const buildSystemPrompt = () => {
  // Send only top 30 FIRs by severity to avoid token limit
  const topFIRs = firRecords
    .filter(f => f.severity === 'HIGH')
    .slice(0, 30)
    .map(f =>
      `FIR ${f.firNumber}: ${f.crimeCategory} at ${f.policeStation}, ${f.district} on ${f.dateOfCrime}. Status: ${f.status}. IPC: ${f.ipcSection}. Accused: ${f.accusedIds.join(', ')}. ${f.description}`
    ).join('\n');

  // All accused — compact format
  const accusedSummary = accusedRecords
    .sort((a, b) => b.riskScore - a.riskScore)
    .map(a =>
      `[${a.id}] ${a.name}${a.alias ? ` aka ${a.alias}` : ''}, ${a.age}y, ${a.district}. Risk:${a.riskScore}. Crimes:${a.crimeHistory.join('/')}. MO:${a.modusOperandi[0]}. Warrant:${a.activeWarrant}. Associates:${a.associateIds.join(',')}.${a.lastKnownLocation ? ` Last:${a.lastKnownLocation}` : ''}`
    ).join('\n');

  const districtSummary = crimeStats
    .slice(0, 15)
    .map(d => `${d.district}: ${d.count} crimes, ${d.trend}`)
    .join(' | ');

  return `You are KIRAN (Karnataka Intelligence and Response Analysis Network), the AI crime intelligence assistant for Karnataka State Police CID.

CRIME DATABASE:
FIR RECORDS (top HIGH severity cases):
${topFIRs}

ACCUSED PROFILES (${accusedRecords.length} total, sorted by risk):
${accusedSummary}

DISTRICT STATS: ${districtSummary}

STRICT RULES:
1. ONLY answer Karnataka State Police crime intelligence queries
2. For ANY person name query — search the ACCUSED PROFILES list above and return their exact data
3. If asked about a person not in the database, say clearly they are not in the Karnataka crime database
4. Always cite accused ID (e.g. acc_001), FIR numbers, risk scores from the data above
5. Format with **bold headers**, bullet points, tables where useful
6. End every response: **Confidence: X%** | **Sources: [data used]**
7. For Kannada queries, respond in Kannada first then English
8. Reject non-crime queries: "KIRAN is restricted to Karnataka crime intelligence only"
9. Always add **Recommended Action** for investigation queries
10. Context-aware: remember previous messages in this conversation`;
};

// ── Conversation history ──────────────────────────────────────────────────
let conversationHistory: { role: string; content: string }[] = [];

// ── Main chat function ────────────────────────────────────────────────────
export const queryChat = async (message: string): Promise<string> => {
  // Always try smart local search first for name queries
  const localResult = smartLocalSearch(message);
  if (localResult) return localResult;

  if (!GROQ_API_KEY) {
    return fallbackResponse(message);
  }

  if (conversationHistory.length > 16) {
    conversationHistory = conversationHistory.slice(-16);
  }
  conversationHistory.push({ role: 'user', content: message });

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...conversationHistory,
        ],
        temperature: 0.2,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Groq error:', response.status, err);
      throw new Error(`Groq ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'Unable to process query.';
    conversationHistory.push({ role: 'assistant', content: reply });
    return reply;

  } catch (error: any) {
    console.error('Chat error:', error.message);
    return fallbackResponse(message);
  }
};

// ── Smart local search — runs BEFORE Groq for name/FIR queries ───────────
const smartLocalSearch = (query: string): string | null => {
  const q = query.toLowerCase().trim();

  // ── Search by accused NAME ──────────────────────────────────────────────
  // Extract meaningful words (3+ chars, not common words)
  const stopWords = new Set(['who','is','the','are','about','show','me','tell','give','what','find','search','profile','accused','suspect','person','criminal']);
  const words = q.split(/\s+/).filter(w => w.length >= 3 && !stopWords.has(w));

  const nameMatches = accusedRecords.filter(a => {
    const fullName  = a.name.toLowerCase();
    const aliasName = (a.alias || '').toLowerCase();
    const id        = a.id.toLowerCase();
    return words.some(w =>
      fullName.includes(w) || aliasName.includes(w) || id.includes(w)
    );
  });

  if (nameMatches.length === 1) {
    return formatAccusedProfile(nameMatches[0]);
  }
  if (nameMatches.length > 1 && nameMatches.length <= 5) {
    return formatMultipleAccused(nameMatches, query);
  }

  // ── Search by FIR number ────────────────────────────────────────────────
  const firMatch = firRecords.find(f =>
    f.firNumber.toLowerCase().includes(q) ||
    q.includes(f.firNumber.toLowerCase())
  );
  if (firMatch) return formatFIR(firMatch);

  // ── District-specific query ─────────────────────────────────────────────
  const districtMatch = crimeStats.find(d =>
    q.includes(d.district.toLowerCase().split(' ')[0])
  );
  if (districtMatch && (q.includes('crime') || q.includes('rate') || q.includes('stat') || q.includes('district'))) {
    return formatDistrictStats(districtMatch);
  }

  return null; // Let Groq handle it
};

// ── Format accused profile ────────────────────────────────────────────────
const formatAccusedProfile = (a: typeof accusedRecords[0]): string => {
  const riskLabel = a.riskScore >= 80 ? '🔴 CRITICAL' : a.riskScore >= 60 ? '🟡 HIGH' : '🟢 MEDIUM';
  const assocNames = a.associateIds
    .map(id => accusedRecords.find(x => x.id === id)?.name || id)
    .join(', ');

  const relatedFIRs = firRecords
    .filter(f => f.accusedIds.includes(a.id))
    .slice(0, 4);

  return `**Accused Profile — ${a.name}** ${a.alias ? `(alias: *${a.alias}*)` : ''}

**Risk Score: ${a.riskScore}/100 — ${riskLabel}**

| Attribute | Detail |
|-----------|--------|
| Accused ID | ${a.id} |
| Age / Gender | ${a.age} / ${a.gender === 'M' ? 'Male' : 'Female'} |
| District | ${a.district} |
| Address | ${a.address} |
| Occupation | ${a.occupation} |
| Education | ${a.education} |
| Active Warrant | ${a.activeWarrant ? '✅ YES — Immediate action required' : '❌ No'} |
| Financial Links | ${a.financialLinks ? '⚠ Suspicious transactions detected' : 'None detected'} |
| Prior Offences | ${a.priorOffences} |
| Last Location | ${a.lastKnownLocation || 'Unknown'} |

**Crime History:** ${a.crimeHistory.map(c => c.replace('_', ' ')).join(', ')}

**Modus Operandi:**
${a.modusOperandi.map(mo => `• ${mo}`).join('\n')}

${a.associateIds.length > 0 ? `**Known Associates (${a.associateIds.length}):** ${assocNames}` : ''}

${relatedFIRs.length > 0 ? `**Linked FIR Records:**\n${relatedFIRs.map(f => `• \`${f.firNumber}\` — ${f.crimeCategory} — ${f.status}`).join('\n')}` : ''}

**Recommended Action:** ${a.activeWarrant
  ? `Issue immediate BOLO. Coordinate with ${a.district} district units. Check last known location: ${a.lastKnownLocation || 'Unknown'}.`
  : `Maintain surveillance. Monitor associate network.`}

**Confidence:** 98% | **Sources:** Karnataka accused database, FIR records`;
};

// ── Format multiple accused matches ──────────────────────────────────────
const formatMultipleAccused = (matches: typeof accusedRecords, query: string): string => {
  return `**Multiple Accused Found — Search: "${query}"**

${matches.map((a, i) =>
  `${i+1}. **${a.name}**${a.alias ? ` (${a.alias})` : ''} — Risk: ${a.riskScore}/100 — ${a.district}${a.activeWarrant ? ' ⚠ WARRANT' : ''}\n   ID: ${a.id} | Crimes: ${a.crimeHistory.slice(0,2).map(c=>c.replace('_',' ')).join(', ')}`
).join('\n\n')}

Type the full name or accused ID for detailed profile.

**Confidence:** 97% | **Sources:** Accused database`;
};

// ── Format FIR record ─────────────────────────────────────────────────────
const formatFIR = (f: typeof firRecords[0]): string => {
  const accusedNames = f.accusedIds
    .map(id => accusedRecords.find(a => a.id === id)?.name || id)
    .join(', ');

  return `**FIR Record — ${f.firNumber}**

| Field | Detail |
|-------|--------|
| Police Station | ${f.policeStation}, ${f.district} |
| Date of Crime | ${f.dateOfCrime} |
| Crime Category | ${f.crimeCategory.replace('_', ' ')} |
| IPC Section | ${f.ipcSection} |
| Status | **${f.status.replace('_', ' ')}** |
| Severity | ${f.severity} |
| Officer In Charge | ${f.officerInCharge} |

**Description:** ${f.description}

**Accused (${f.accusedIds.length}):** ${accusedNames || 'Under investigation'}
**Victims:** ${f.victimIds.length} victim(s) registered

**Recommended Action:** ${
  f.status === 'OPEN' ? 'Assign investigating officer immediately. Collect initial evidence.' :
  f.status === 'UNDER_INVESTIGATION' ? 'Review investigation progress. Escalate if no accused identified.' :
  'Case proceeding — monitor charge sheet timeline.'
}

**Confidence:** 99% | **Sources:** FIR database`;
};

// ── Format district stats ─────────────────────────────────────────────────
const formatDistrictStats = (d: typeof crimeStats[0]): string => {
  const districtFIRs = firRecords.filter(f => f.district === d.district);
  const topCrimes = Object.entries(
    districtFIRs.reduce((acc, f) => {
      acc[f.crimeCategory] = (acc[f.crimeCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort(([,a],[,b]) => b-a).slice(0, 4);

  const highRiskAcc = accusedRecords
    .filter(a => a.district === d.district && a.riskScore >= 70)
    .length;

  return `**Crime Statistics — ${d.district}**

**Overall Crime Rate:** ${d.count} reported cases — Trend: **${d.trend}** (${d.changePercent > 0 ? '+' : ''}${d.changePercent}%)

**Top Crime Categories:**
${topCrimes.map(([cat, count]) => `• ${cat.replace('_', ' ')}: ${count} cases`).join('\n')}

**Accused Intelligence:**
- Total accused from district: ${accusedRecords.filter(a => a.district === d.district).length}
- High-risk (70+): ${highRiskAcc}
- Active warrants: ${accusedRecords.filter(a => a.district === d.district && a.activeWarrant).length}

**Active FIRs:** ${districtFIRs.filter(f => f.status !== 'CLOSED').length} of ${districtFIRs.length} total cases

**Recommended Action:** ${
  d.trend === 'UP'
    ? `Increase patrol presence. Focus on ${topCrimes[0]?.[0].replace('_',' ') || 'street crime'} hotspots.`
    : `Maintain current deployment. Review closed cases for patterns.`
}

**Confidence:** 96% | **Sources:** District crime database, FIR records`;
};

// ── Fallback when Groq unavailable ────────────────────────────────────────
const fallbackResponse = (query: string): string => {
  const q = query.toLowerCase();

  if (q.includes('risk') || q.includes('high') || q.includes('dangerous') || q.includes('warrant')) {
    const top = accusedRecords.sort((a,b) => b.riskScore-a.riskScore).slice(0,5);
    return `**Top High-Risk Accused — Karnataka**\n\n${
      top.map((a,i) => `${i+1}. **${a.name}** (${a.id}) — Risk: ${a.riskScore}/100 — ${a.district}${a.activeWarrant?' ⚠ WARRANT':''}`)
         .join('\n')
    }\n\n**Confidence:** 95% | **Sources:** Accused database`;
  }

  if (q.includes('fir') || q.includes('case') || q.includes('robbery') || q.includes('crime')) {
    return `**Recent FIR Records — Karnataka**\n\n${
      firRecords.filter(f=>f.severity==='HIGH').slice(0,6)
        .map(f => `• \`${f.firNumber}\` — ${f.crimeCategory} — ${f.policeStation} — **${f.status}**`)
        .join('\n')
    }\n\n**Confidence:** 98% | **Sources:** FIR database`;
  }

  if (q.includes('forecast') || q.includes('predict') || q.includes('trend')) {
    const trending = crimeStats.filter(d=>d.trend==='UP').slice(0,3);
    return `**Crime Forecast — Karnataka**\n\nDistricts showing upward trend:\n${
      trending.map(d=>`• **${d.district}**: +${d.changePercent}% — ${d.count} cases`).join('\n')
    }\n\nRecommend enhanced deployment in these districts.\n\n**Confidence:** 82% | **Sources:** District trend data`;
  }

  return `**KIRAN — Karnataka Crime Intelligence System**\n\nI can answer:\n- Officer/accused profiles by name (e.g. "Profile of Ravi Kumar")\n- FIR records by number or location\n- Crime statistics by district\n- Risk assessments and hotspot analysis\n- Network and gang intelligence\n\n**System:** ${firRecords.length} FIRs | ${accusedRecords.length} accused | ${crimeStats.length} districts | Groq AI${GROQ_API_KEY ? ' Active' : ' — API key missing'}`;
};

export const getSystemStats = () => ({
  totalActiveCases: firRecords.filter(f => f.status !== 'CLOSED').length,
  todayFIRs: 23,
  highRiskAccused: accusedRecords.filter(a => a.riskScore >= 80).length,
  pendingReview: firRecords.filter(f => f.status === 'UNDER_INVESTIGATION').length,
});

export const clearChatHistory = () => { conversationHistory = []; };