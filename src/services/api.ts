import { firRecords, accusedRecords, crimeStats } from '../data/mockData';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const buildSystemPrompt = () => {
  const firSummary = firRecords.map(f =>
    `FIR ${f.firNumber}: ${f.crimeCategory} at ${f.policeStation}, ${f.district} on ${f.dateOfCrime}. Status: ${f.status}. Severity: ${f.severity}. IPC: ${f.ipcSection}. Accused: ${f.accusedIds.join(', ')}. Description: ${f.description}`
  ).join('\n');

  const accusedSummary = accusedRecords.map(a =>
    `Accused ${a.id}: ${a.name}${a.alias ? ` (alias: ${a.alias})` : ''}, Age ${a.age}, ${a.district}. Risk Score: ${a.riskScore}/100. Prior offences: ${a.priorOffences}. Crimes: ${a.crimeHistory.join(', ')}. MO: ${a.modusOperandi.join('; ')}. Active warrant: ${a.activeWarrant}. Financial links: ${a.financialLinks}. Associates: ${a.associateIds.join(', ')}.${a.lastKnownLocation ? ` Last location: ${a.lastKnownLocation}` : ''}`
  ).join('\n');

  const districtSummary = crimeStats.map(d =>
    `${d.district}: ${d.count} crimes, trend ${d.trend} (${d.changePercent > 0 ? '+' : ''}${d.changePercent}%)`
  ).join('\n');

  return `You are KIRAN (Karnataka Intelligence and Response Analysis Network), an AI-powered Crime Intelligence Assistant exclusively for Karnataka State Police CID (Crime Investigation Department).

## CRIME DATABASE ACCESS:

### FIR RECORDS (${firRecords.length} active cases):
${firSummary}

### ACCUSED PROFILES (${accusedRecords.length} persons):
${accusedSummary}

### DISTRICT CRIME STATISTICS:
${districtSummary}

### CRIME TRENDS:
Monthly data May 2023 to April 2024 — robbery, theft, assault, drug trafficking, cybercrime.

## YOUR IDENTITY AND SCOPE:
You are KIRAN, a restricted law enforcement AI. You ONLY answer questions about:
- Karnataka State crime records, FIRs, case investigations
- Accused profiles, criminal networks, offender risk assessment
- Crime patterns, hotspots, trends, geographic analysis
- Drug trafficking, financial crime, gang intelligence
- Crime forecasting and early warning for Karnataka
- Criminology, investigation techniques, law enforcement strategy
- IPC sections, NDPS Act, Karnataka Police Act
- Kannada language queries about the above topics

## STRICT RESTRICTIONS:
- If asked about ANY topic outside law enforcement and Karnataka crime — celebrities, businesses, sports, entertainment, general knowledge, world events, other states — respond with: "I am KIRAN, restricted to Karnataka State Police crime intelligence only. Please ask about FIRs, accused profiles, crime patterns, hotspots, or investigation matters."
- Never answer questions about specific public figures, politicians, or celebrities
- Never provide general world knowledge or opinions
- Never make up FIR numbers or accused names not in the database above
- If data is not in the database, clearly state that and suggest what additional data would help

## RESPONSE FORMAT RULES:
1. Always start with a clear **header** identifying the query type
2. Cite specific FIR numbers (e.g., BLR/KOR/2024/1847) and accused IDs (e.g., acc_001) from the database
3. Use **bold** for names, FIR numbers, risk scores
4. Use bullet points for lists
5. For Kannada queries (containing ಕನ್ನಡ script), respond in Kannada first, then English
6. Always end with: **Confidence: X%** | **Sources: [specific data used]**
7. Always include **Recommended Action** for investigation queries
8. Keep responses professional, concise and actionable for law enforcement

## CONTEXT AWARENESS:
Remember previous messages in this conversation. When user asks follow-up questions like "tell me more about him" or "what about the second case" — refer back to what was discussed earlier.`;
};

let conversationHistory: { role: string; content: string }[] = [];

export const queryChat = async (message: string): Promise<string> => {
  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
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
      const error = await response.json();
      console.error('Groq API error:', error);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || 'Unable to process query.';
    conversationHistory.push({ role: 'assistant', content: assistantMessage });
    return assistantMessage;

  } catch (error: any) {
    console.error('Chat error:', error.message);
    return fallbackResponse(message);
  }
};

const fallbackResponse = (query: string): string => {
  const q = query.toLowerCase();

  if (q.includes('risk') || q.includes('high') || q.includes('dangerous')) {
    return `**High-Risk Accused — Karnataka Database**\n\nGroq AI temporarily unavailable. Local data:\n\n${
      accusedRecords
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5)
        .map((a, i) => `${i + 1}. **${a.name}** (${a.id}) — Risk: ${a.riskScore}/100 — ${a.district}${a.activeWarrant ? ' ⚠ ACTIVE WARRANT' : ''}`)
        .join('\n')
    }\n\n**Confidence:** 95% | **Sources:** Accused database`;
  }

  if (q.includes('fir') || q.includes('case') || q.includes('robbery') || q.includes('crime')) {
    return `**Recent FIR Records — Karnataka**\n\n${
      firRecords.slice(0, 5).map(f =>
        `• \`${f.firNumber}\` — ${f.crimeCategory} — ${f.policeStation} — **${f.status}**`
      ).join('\n')
    }\n\n**Confidence:** 98% | **Sources:** FIR database`;
  }

  if (q.includes('accused') || q.includes('profile') || q.includes('suspect')) {
    return `**Accused Profiles — Karnataka Database**\n\n${
      accusedRecords.slice(0, 5).map(a =>
        `• **${a.name}** — Risk: ${a.riskScore}/100 — ${a.crimeHistory.join(', ')} — ${a.district}`
      ).join('\n')
    }\n\n**Confidence:** 97% | **Sources:** Accused profiles database`;
  }

  if (q.includes('district') || q.includes('hotspot') || q.includes('where')) {
    return `**District Crime Statistics — Karnataka**\n\n${
      crimeStats
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(d => `• **${d.district}**: ${d.count.toLocaleString()} crimes — Trend: ${d.trend} (${d.changePercent > 0 ? '+' : ''}${d.changePercent}%)`)
        .join('\n')
    }\n\n**Confidence:** 96% | **Sources:** District crime statistics`;
  }

  return `**KIRAN — Karnataka Crime Intelligence System**\n\nGroq AI temporarily unavailable. System is online with local data.\n\nAvailable queries:\n- FIR records and case status\n- Accused profiles and risk scores  \n- Crime hotspots and district analysis\n- Network and gang intelligence\n- Crime forecasting\n\n**System:** ${firRecords.length} FIRs | ${accusedRecords.length} accused | ${crimeStats.length} districts | Llama 3.3 70B`;
};

export const getSystemStats = () => ({
  totalActiveCases: firRecords.filter(f => f.status !== 'CLOSED').length,
  todayFIRs: 7,
  highRiskAccused: accusedRecords.filter(a => a.riskScore >= 80).length,
  pendingReview: firRecords.filter(f => f.status === 'UNDER_INVESTIGATION').length,
});

export const clearChatHistory = () => {
  conversationHistory = [];
};