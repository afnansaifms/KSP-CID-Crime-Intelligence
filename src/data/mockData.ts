
import type { FIR, Accused, Victim, CrimeStats, NetworkNode, NetworkEdge } from '../types';
export const KARNATAKA_DISTRICTS = [
  'Bengaluru Urban','Bengaluru Rural','Mysuru','Mangaluru',
  'Hubballi-Dharwad','Belagavi','Kalaburagi','Shivamogga',
  'Vijayapura','Tumakuru','Dakshina Kannada','Hassan','Udupi','Chitradurga','Raichur',
];

export const firRecords: FIR[] = [
  { id:'fir_001', firNumber:'BLR/KOR/2024/1847', policeStation:'Koramangala', district:'Bengaluru Urban',
    dateOfCrime:'2024-03-12', dateFiled:'2024-03-12', crimeCategory:'ROBBERY', ipcSection:'IPC 392/397',
    description:'Armed chain snatching near Forum Mall. Two suspects on motorcycle.',
    status:'UNDER_INVESTIGATION', latitude:12.9352, longitude:77.6245,
    officerInCharge:'SI Venkatesh Kumar', accusedIds:['acc_001','acc_002'], victimIds:['vic_001'], severity:'HIGH' },
  { id:'fir_002', firNumber:'BLR/HSR/2024/2103', policeStation:'HSR Layout', district:'Bengaluru Urban',
    dateOfCrime:'2024-03-18', dateFiled:'2024-03-18', crimeCategory:'CYBERCRIME', ipcSection:'IT Act 66C/IPC 419',
    description:'Online investment fraud via WhatsApp. Victim lost ₹4.2 lakhs.',
    status:'UNDER_INVESTIGATION', latitude:12.9116, longitude:77.6389,
    officerInCharge:'SI Rekha Nair', accusedIds:['acc_003'], victimIds:['vic_002'], severity:'MEDIUM' },
  { id:'fir_003', firNumber:'MYS/VJN/2024/0891', policeStation:'Vijayanagar', district:'Mysuru',
    dateOfCrime:'2024-02-28', dateFiled:'2024-03-01', crimeCategory:'ASSAULT', ipcSection:'IPC 307',
    description:'Attempt to murder. Victim hospitalised with stab injuries.',
    status:'CHARGE_SHEET', latitude:12.3167, longitude:76.6524,
    officerInCharge:'PI Shashidhar BN', accusedIds:['acc_004','acc_005'], victimIds:['vic_003'], severity:'HIGH' },
  { id:'fir_004', firNumber:'BLR/WFD/2024/3412', policeStation:'Whitefield', district:'Bengaluru Urban',
    dateOfCrime:'2024-04-05', dateFiled:'2024-04-05', crimeCategory:'THEFT', ipcSection:'IPC 379',
    description:'Vehicle theft from Prestige Tech Park. Honda City — KA-05-MH-9321.',
    status:'OPEN', latitude:12.9698, longitude:77.7499,
    officerInCharge:'HC Mahesh Gowda', accusedIds:[], victimIds:['vic_004'], severity:'LOW' },
  { id:'fir_005', firNumber:'BLR/IND/2024/1156', policeStation:'Indiranagar', district:'Bengaluru Urban',
    dateOfCrime:'2024-04-10', dateFiled:'2024-04-10', crimeCategory:'DRUG_TRAFFICKING', ipcSection:'NDPS 20(b)(ii)(C)',
    description:'Seizure of 2.3 kg ganja at 100 Feet Road. Inter-state network suspected.',
    status:'UNDER_INVESTIGATION', latitude:12.9784, longitude:77.6408,
    officerInCharge:'DSP Arjun Reddy', accusedIds:['acc_001','acc_006','acc_007'], victimIds:[], severity:'HIGH' },
  { id:'fir_006', firNumber:'MNG/PND/2024/0534', policeStation:'Pandeshwar', district:'Mangaluru',
    dateOfCrime:'2024-03-22', dateFiled:'2024-03-22', crimeCategory:'EXTORTION', ipcSection:'IPC 384/506',
    description:'Extortion demand from business owner. Coastal gang with prior history.',
    status:'UNDER_INVESTIGATION', latitude:12.8658, longitude:74.8426,
    officerInCharge:'SI Harish Shetty', accusedIds:['acc_008','acc_009'], victimIds:['vic_005'], severity:'HIGH' },
  { id:'fir_007', firNumber:'BLR/YLK/2024/2891', policeStation:'Yelahanka', district:'Bengaluru Urban',
    dateOfCrime:'2024-04-15', dateFiled:'2024-04-15', crimeCategory:'MURDER', ipcSection:'IPC 302',
    description:'Homicide — property dispute related. Primary suspect absconding.',
    status:'UNDER_INVESTIGATION', latitude:13.1004, longitude:77.5963,
    officerInCharge:'ACP Nagendra Rao', accusedIds:['acc_010'], victimIds:['vic_006'], severity:'HIGH' },
  { id:'fir_008', firNumber:'BLR/JPN/2024/1034', policeStation:'JP Nagar', district:'Bengaluru Urban',
    dateOfCrime:'2024-04-18', dateFiled:'2024-04-19', crimeCategory:'BURGLARY', ipcSection:'IPC 457/380',
    description:'House breaking and theft. Jewellery worth ₹8 lakhs stolen.',
    status:'OPEN', latitude:12.9091, longitude:77.5832,
    officerInCharge:'SI Priya Menon', accusedIds:['acc_002'], victimIds:['vic_007'], severity:'MEDIUM' },
  { id:'fir_009', firNumber:'HBL/KSP/2024/0712', policeStation:'Keshwapur', district:'Hubballi-Dharwad',
    dateOfCrime:'2024-03-30', dateFiled:'2024-03-30', crimeCategory:'GAMBLING', ipcSection:'KPA 87',
    description:'Online cricket betting ring busted. 14 persons detained.',
    status:'CHARGE_SHEET', latitude:15.3647, longitude:75.1240,
    officerInCharge:'PI Basavraj Patil', accusedIds:['acc_011','acc_012'], victimIds:[], severity:'MEDIUM' },
  { id:'fir_010', firNumber:'BLR/ELC/2024/3891', policeStation:'Electronic City', district:'Bengaluru Urban',
    dateOfCrime:'2024-04-20', dateFiled:'2024-04-21', crimeCategory:'FRAUD', ipcSection:'IPC 420/406',
    description:'IT employee defrauded of ₹12 lakhs via fake job scam.',
    status:'UNDER_INVESTIGATION', latitude:12.8399, longitude:77.6770,
    officerInCharge:'SI Anita Sharma', accusedIds:['acc_003','acc_013'], victimIds:['vic_008'], severity:'HIGH' },
];

export const accusedRecords: Accused[] = [
  { id:'acc_001', name:'Ravi Kumar G.', alias:'KG Ravi', age:32, gender:'M',
    address:'14th Cross, Srinivaspura, Bengaluru North', district:'Bengaluru Urban',
    occupation:'Auto Driver (stated)', education:'SSLC', riskScore:94, priorOffences:8,
    crimeHistory:['ROBBERY','ASSAULT','DRUG_TRAFFICKING','THEFT'],
    modusOperandi:['ATM robbery 22:00–01:00 hrs','Two-wheeler chain snatching','Drug courier'],
    associateIds:['acc_002','acc_006','acc_007'], financialLinks:true, activeWarrant:true,
    lastKnownLocation:'Hebbal flyover area' },
  { id:'acc_002', name:'Suresh P. Naik', age:28, gender:'M',
    address:'Nagawara, Bengaluru', district:'Bengaluru Urban',
    occupation:'Mechanic (stated)', education:'PUC', riskScore:78, priorOffences:5,
    crimeHistory:['ROBBERY','BURGLARY','THEFT'],
    modusOperandi:['House breaking','Lock picking','CCTV disabling'],
    associateIds:['acc_001','acc_010'], financialLinks:false, activeWarrant:false },
  { id:'acc_003', name:'Mohammad Salim Q.', alias:'Q Bhai', age:35, gender:'M',
    address:'Shivajinagar, Bengaluru', district:'Bengaluru Urban',
    occupation:'Unemployed', education:'Graduate', riskScore:87, priorOffences:6,
    crimeHistory:['CYBERCRIME','FRAUD','CHEATING'],
    modusOperandi:['WhatsApp investment scam','SIM swap fraud','Fake job portal'],
    associateIds:['acc_013'], financialLinks:true, activeWarrant:true,
    lastKnownLocation:'Last traced Hyderabad' },
  { id:'acc_004', name:'Basappa M. Hiremath', age:24, gender:'M',
    address:'Vijayanagar, Mysuru', district:'Mysuru',
    occupation:'Daily wage labour', education:'Class 8', riskScore:71, priorOffences:3,
    crimeHistory:['ASSAULT','ROBBERY'],
    modusOperandi:['Gang assault','Knife attack'],
    associateIds:['acc_005'], financialLinks:false, activeWarrant:false },
  { id:'acc_005', name:'Chetan K. Deshpande', age:26, gender:'M',
    address:'N.R. Mohalla, Mysuru', district:'Mysuru',
    occupation:'Vegetable vendor', education:'SSLC', riskScore:65, priorOffences:2,
    crimeHistory:['ASSAULT'], modusOperandi:['Gang assault'],
    associateIds:['acc_004'], financialLinks:false, activeWarrant:false },
  { id:'acc_006', name:'Dinesh Raj T.', alias:'T-Dinesh', age:29, gender:'M',
    address:'Kadugodi, Bengaluru East', district:'Bengaluru Urban',
    occupation:'Courier rider (cover)', education:'PUC', riskScore:82, priorOffences:4,
    crimeHistory:['DRUG_TRAFFICKING','ROBBERY'],
    modusOperandi:['Drug courier inter-city','Bike-borne crime'],
    associateIds:['acc_001','acc_007'], financialLinks:true, activeWarrant:true,
    lastKnownLocation:'Marathahalli area' },
  { id:'acc_007', name:'Prakash B. Shetty', age:41, gender:'M',
    address:'Peenya Industrial Area, Bengaluru', district:'Bengaluru Urban',
    occupation:'Businessman (cover)', education:'Diploma', riskScore:91, priorOffences:9,
    crimeHistory:['DRUG_TRAFFICKING','EXTORTION','GAMBLING'],
    modusOperandi:['Drug supply chain organiser','Money laundering via hawala'],
    associateIds:['acc_001','acc_006','acc_008'], financialLinks:true, activeWarrant:true,
    lastKnownLocation:'Suspected Dubai' },
  { id:'acc_008', name:'Rajesh P. Kamath', alias:'Kamath Anna', age:37, gender:'M',
    address:'Pandeshwar, Mangaluru', district:'Dakshina Kannada',
    occupation:'Real estate (cover)', education:'Graduate', riskScore:88, priorOffences:7,
    crimeHistory:['EXTORTION','MURDER','ASSAULT'],
    modusOperandi:['Extortion through gang','Land grabbing'],
    associateIds:['acc_007','acc_009'], financialLinks:true, activeWarrant:true,
    lastKnownLocation:'Mangaluru coastal area' },
  { id:'acc_009', name:'Ashok D. Poojary', age:31, gender:'M',
    address:'Ullal, Mangaluru', district:'Dakshina Kannada',
    occupation:'Fisherman (stated)', education:'Class 7', riskScore:58, priorOffences:2,
    crimeHistory:['EXTORTION','ASSAULT'], modusOperandi:['Muscle man for gang'],
    associateIds:['acc_008'], financialLinks:false, activeWarrant:false },
  { id:'acc_010', name:'Lokesh S. Gowda', age:45, gender:'M',
    address:'Yelahanka New Town, Bengaluru', district:'Bengaluru Urban',
    occupation:'Contractor', education:'PUC', riskScore:76, priorOffences:3,
    crimeHistory:['MURDER','ASSAULT','EXTORTION'],
    modusOperandi:['Property dispute violence','Contract killing'],
    associateIds:['acc_002'], financialLinks:true, activeWarrant:true,
    lastKnownLocation:'Absconding — Tumakuru suspected' },
  { id:'acc_011', name:'Naveen K. Patil', age:33, gender:'M',
    address:'Keshwapur, Hubballi', district:'Hubballi-Dharwad',
    occupation:'Café owner (cover)', education:'Graduate', riskScore:55, priorOffences:2,
    crimeHistory:['GAMBLING','CHEATING'], modusOperandi:['Online betting ring operator'],
    associateIds:['acc_012'], financialLinks:true, activeWarrant:false },
  { id:'acc_012', name:'Santosh R. Kattimani', age:27, gender:'M',
    address:'Dharwad City', district:'Hubballi-Dharwad',
    occupation:'Tech support', education:'Graduate', riskScore:48, priorOffences:1,
    crimeHistory:['GAMBLING'], modusOperandi:['Betting app backend'],
    associateIds:['acc_011'], financialLinks:false, activeWarrant:false },
  { id:'acc_013', name:'Farhan A. Sheikh', age:30, gender:'M',
    address:'Fraser Town, Bengaluru', district:'Bengaluru Urban',
    occupation:'Call centre agent (cover)', education:'Graduate', riskScore:73, priorOffences:3,
    crimeHistory:['FRAUD','CYBERCRIME','CHEATING'],
    modusOperandi:['Fake call centre scam','KYC fraud'],
    associateIds:['acc_003'], financialLinks:true, activeWarrant:false },
];

export const victimRecords: Victim[] = [
  { id:'vic_001', name:'Meena S. Pillai',    age:52, gender:'F', district:'Bengaluru Urban',  occupation:'Retired teacher' },
  { id:'vic_002', name:'Arun K. Hegde',      age:34, gender:'M', district:'Bengaluru Urban',  occupation:'IT Engineer' },
  { id:'vic_003', name:'Jayaraju T.',        age:38, gender:'M', district:'Mysuru',           occupation:'Shop owner' },
  { id:'vic_004', name:'Sangeeta R. Murthy', age:29, gender:'F', district:'Bengaluru Urban',  occupation:'Software developer' },
  { id:'vic_005', name:'Govind P. Rao',      age:55, gender:'M', district:'Dakshina Kannada', occupation:'Hotelier' },
  { id:'vic_006', name:'Ramaiah C.',         age:60, gender:'M', district:'Bengaluru Urban',  occupation:'Landlord' },
  { id:'vic_007', name:'Shanthi K. Srinivas',age:47, gender:'F', district:'Bengaluru Urban',  occupation:'Homemaker' },
  { id:'vic_008', name:'Nikhil A. Sharma',   age:25, gender:'M', district:'Bengaluru Urban',  occupation:'IT Fresher' },
];

export const crimeStats: CrimeStats[] = [
  { district:'Bengaluru Urban',  count:4821, trend:'UP',     changePercent:8.2,   coordinates:[12.9716, 77.5946] },
  { district:'Mysuru',           count:1234, trend:'DOWN',   changePercent:-3.1,  coordinates:[12.2958, 76.6394] },
  { district:'Mangaluru',        count:891,  trend:'STABLE', changePercent:0.4,   coordinates:[12.9141, 74.8560] },
  { district:'Hubballi-Dharwad', count:743,  trend:'UP',     changePercent:5.6,   coordinates:[15.3647, 75.1240] },
  { district:'Belagavi',         count:612,  trend:'DOWN',   changePercent:-2.3,  coordinates:[15.8497, 74.4977] },
  { district:'Kalaburagi',       count:589,  trend:'UP',     changePercent:11.4,  coordinates:[17.3297, 76.8343] },
  { district:'Shivamogga',       count:498,  trend:'STABLE', changePercent:1.1,   coordinates:[13.9299, 75.5681] },
  { district:'Vijayapura',       count:423,  trend:'DOWN',   changePercent:-4.7,  coordinates:[16.8302, 75.7100] },
  { district:'Tumakuru',         count:387,  trend:'UP',     changePercent:3.9,   coordinates:[13.3409, 77.1010] },
  { district:'Dakshina Kannada', count:356,  trend:'STABLE', changePercent:-0.8,  coordinates:[12.8438, 75.2479] },
];

export const crimeTrendData = [
  { month:"May'23", robbery:89,  theft:234, assault:67, drug:45, cyber:112 },
  { month:"Jun'23", robbery:95,  theft:219, assault:72, drug:52, cyber:128 },
  { month:"Jul'23", robbery:78,  theft:198, assault:58, drug:41, cyber:145 },
  { month:"Aug'23", robbery:102, theft:241, assault:81, drug:63, cyber:167 },
  { month:"Sep'23", robbery:88,  theft:212, assault:74, drug:58, cyber:189 },
  { month:"Oct'23", robbery:113, theft:267, assault:89, drug:71, cyber:201 },
  { month:"Nov'23", robbery:97,  theft:223, assault:65, drug:66, cyber:178 },
  { month:"Dec'23", robbery:121, theft:289, assault:94, drug:79, cyber:156 },
  { month:"Jan'24", robbery:108, theft:256, assault:77, drug:68, cyber:198 },
  { month:"Feb'24", robbery:93,  theft:231, assault:70, drug:55, cyber:213 },
  { month:"Mar'24", robbery:118, theft:278, assault:86, drug:74, cyber:234 },
  { month:"Apr'24", robbery:127, theft:295, assault:91, drug:82, cyber:247 },
];

export const networkNodes: NetworkNode[] = [
  { id:'acc_001', label:'Ravi Kumar G.',     type:'accused',      riskLevel:'HIGH',   x:320, y:210 },
  { id:'acc_002', label:'Suresh P. Naik',    type:'accused',      riskLevel:'HIGH',   x:170, y:310 },
  { id:'acc_006', label:'Dinesh Raj T.',     type:'accused',      riskLevel:'HIGH',   x:470, y:300 },
  { id:'acc_007', label:'Prakash B. Shetty', type:'accused',      riskLevel:'HIGH',   x:420, y:150 },
  { id:'acc_008', label:'Rajesh P. Kamath',  type:'accused',      riskLevel:'HIGH',   x:580, y:200 },
  { id:'acc_009', label:'Ashok D. Poojary',  type:'accused',      riskLevel:'MEDIUM', x:650, y:310 },
  { id:'acc_010', label:'Lokesh S. Gowda',   type:'accused',      riskLevel:'HIGH',   x:140, y:170 },
  { id:'loc_hbl', label:'Hebbal Zone',        type:'location',                         x:260, y:100 },
  { id:'loc_ind', label:'Indiranagar Hub',    type:'location',                         x:500, y:390 },
  { id:'org_001', label:'Drug Network',       type:'organization',                     x:370, y:360 },
];

export const networkEdges: NetworkEdge[] = [
  { id:'e1',  from:'acc_001', to:'acc_002', label:'co-offender', strength:0.9  },
  { id:'e2',  from:'acc_001', to:'acc_006', label:'co-offender', strength:0.85 },
  { id:'e3',  from:'acc_001', to:'acc_007', label:'associate',   strength:0.75 },
  { id:'e4',  from:'acc_006', to:'acc_007', label:'co-offender', strength:0.9  },
  { id:'e5',  from:'acc_007', to:'acc_008', label:'gang link',   strength:0.7  },
  { id:'e6',  from:'acc_008', to:'acc_009', label:'co-offender', strength:0.8  },
  { id:'e7',  from:'acc_001', to:'org_001', label:'member',      strength:0.9  },
  { id:'e8',  from:'acc_006', to:'org_001', label:'member',      strength:0.85 },
  { id:'e9',  from:'acc_007', to:'org_001', label:'organiser',   strength:0.95 },
  { id:'e10', from:'acc_001', to:'loc_hbl', label:'operates',    strength:0.8  },
  { id:'e11', from:'acc_006', to:'loc_ind', label:'operates',    strength:0.75 },
  { id:'e12', from:'acc_002', to:'acc_010', label:'associate',   strength:0.5  },
];

export const getMockResponse = (query: string): string => {
  const q = query.toLowerCase();

  if (q.includes('risk') && (q.includes('top') || q.includes('high') || q.includes('score'))) {
    return `**Top 5 High-Risk Accused — Bengaluru Urban (2024)**

| Rank | Name | Risk Score | Prior Cases | Status |
|------|------|-----------|-------------|--------|
| 1 | Ravi Kumar G. (acc_001) | 94/100 | 8 | Active Warrant |
| 2 | Prakash B. Shetty (acc_007) | 91/100 | 9 | Absconding |
| 3 | Rajesh P. Kamath (acc_008) | 88/100 | 7 | Surveillance |
| 4 | Mohammad Salim Q. (acc_003) | 87/100 | 6 | Last traced Hyd |
| 5 | Dinesh Raj T. (acc_006) | 82/100 | 4 | Active Warrant |

**Risk Factors:** Financial links to drug network detected for acc_001, acc_007 and acc_008. Ravi Kumar G. suspected of cross-district movement. Coordinated surveillance recommended.

**Confidence:** 89% | **Sources:** FIR records 2024, Accused database, Network analysis`;
  }

  if (q.includes('fir') || q.includes('case') || q.includes('robbery')) {
    return `**FIR Query Results — Robbery / Street Crime (2024)**

Found **12 FIRs** matching query in Bengaluru Urban:

\`BLR/KOR/2024/1847\` — Koramangala — 12 Mar — UNDER INVESTIGATION
\`BLR/YLK/2024/2891\` — Yelahanka — 15 Apr — UNDER INVESTIGATION
\`BLR/IND/2024/0923\` — Indiranagar — 08 Mar — CHARGE SHEET FILED
\`BLR/JPN/2024/1034\` — JP Nagar — 18 Apr — OPEN
\`BLR/HSR/2024/0812\` — HSR Layout — 22 Feb — CLOSED
\`+ 7 more cases\`

**Pattern Detected:** 8 of 12 involve two-wheeler borne accused. Primary hotspot: MG Road–Koramangala corridor, 21:00–23:30 hrs.

**Linked Accused:** Ravi Kumar G. (acc_001) appears in 3 cases with co-offender Suresh P. Naik (acc_002).

**Confidence:** 94% | **Sources:** BLR Urban FIR database 2024`;
  }

  if (q.includes('hotspot') || q.includes('heatmap') || q.includes('area') || q.includes('location') || q.includes('where')) {
    return `**Crime Hotspot Analysis — Karnataka (April 2024)**

**High Intensity Zones:**
1. **MG Road–Koramangala Corridor** — 127 incidents/month, ↑14% vs Q1
2. **Indiranagar–Hebbal Belt** — Drug trafficking nexus, 89 incidents
3. **Mangaluru Coastal Zone** — Extortion activity, 63 incidents

**Emerging Clusters:**
4. **Electronic City Phase 2** — Cybercrime surge (+34% MoM), 47 incidents
5. **Kalaburagi City Centre** — Rising property crimes, ↑11.4% YTD

**Time Patterns:**
- Peak window: 21:00–01:00 hrs (street crime)
- Weekend rate: 22% higher than weekdays
- Festival periods: avg. +31% spike

**Recommendation:** Additional patrolling in MG Road–Koramangala zone between 20:00–02:00 hrs. Plain-clothes surveillance near Electronic City IT parks recommended.

**Confidence:** 91% | **Sources:** Heatmap analysis, FIR geo-data, Historical patterns`;
  }

  if (q.includes('drug') || q.includes('ndps') || q.includes('trafficking')) {
    return `**Drug Trafficking Intelligence — Bengaluru Network**

Active network mapped across 3 nodes (FIR BLR/IND/2024/1156):

\`\`\`
Prakash B. Shetty (acc_007) — Organiser
    ↓ Supply chain
Ravi Kumar G. (acc_001) — Distribution
    ↓ Street retail
Dinesh Raj T. (acc_006) — Courier
\`\`\`

**Seizures YTD 2024:** 12 cases | 8.7 kg ganja | 340g cocaine | ₹14.2L cash seized
**Inter-state Links:** Hyderabad and Goa supply routes suspected
**Financial:** Hawala transactions linked to acc_007 — FIU reference pending

**NDPS Sections:** 20(b)(ii)(C), 20(b)(ii)(B), 29 (conspiracy)

**Alert:** Supplier Prakash B. Shetty suspected to have departed for UAE. Lookout notice recommended.

**Confidence:** 87% | **Sources:** NDPS case files, Network analysis, Financial intelligence`;
  }

  if (q.includes('network') || q.includes('gang') || q.includes('associate') || q.includes('connection')) {
    return `**Criminal Network Analysis — Karnataka**

**Network A — Bengaluru Drug + Robbery Ring (7 members)**
Core: Prakash B. Shetty → Ravi Kumar G. → Dinesh Raj T.
Extended: 4 additional associates under monitoring
Risk Level: Very High | Active warrants: 3 of 7 members

**Network B — Coastal Extortion Gang (3 members)**
Core: Rajesh P. Kamath (Mangaluru) + coastal associates
Linked to Bengaluru network via Prakash B. Shetty
Risk Level: High | Under surveillance

**Network C — Cyber Fraud Cell (2 confirmed + suspected more)**
Core: Mohammad Salim Q. + Farhan A. Sheikh
MO: WhatsApp scam → Hawala transfer chain
Risk Level: High | Cross-state network

**Recommendation:** Network A requires priority interdiction. Joint operation with Narcotics Bureau recommended for Q2.

**Confidence:** 85% | **Sources:** FIR cross-reference, Association graph, Intelligence inputs`;
  }

  if (q.includes('accused') || q.includes('suspect') || q.includes('profile') || q.includes('ravi')) {
    return `**Offender Profile — Ravi Kumar G. (acc_001)**

**Risk Score: 94/100 — CRITICAL**

| Attribute | Detail |
|-----------|--------|
| Full Name | Ravi Kumar G. (alias: KG Ravi) |
| Age / Gender | 32 / Male |
| Address | 14th Cross, Srinivaspura, Bengaluru North |
| Occupation | Auto Driver (stated cover) |
| Active Warrant | Yes — FIR BLR/IND/2024/1156 |
| Last Location | Hebbal flyover area (Apr 18 sighting) |

**Criminal History — 8 offences:**
3× Robbery (IPC 392/397) | 2× Drug trafficking (NDPS) | 2× Assault (IPC 324) | 1× Theft (IPC 379)

**MO:** ATM robberies between 22:00–01:00 hrs, two-member team on motorcycle. Switches bikes frequently.

**Associates:** Suresh P. Naik, Dinesh Raj T., Prakash B. Shetty (organiser)

**Financial:** ₹2.1L suspicious cash deposits detected — FIU reference pending

**Confidence:** 96% | **Sources:** Accused database, 8 FIR records, Surveillance log`;
  }

  if (q.includes('forecast') || q.includes('predict') || q.includes('next') || q.includes('upcoming')) {
    return `**Crime Forecast — Next 30 Days (May 2024)**

**Expected Increase:**
- **Cybercrime** (+28%) — Post-IPL betting season, internship scam cycle
- **Street robbery** (+18%) — Pre-summer festival crowd patterns in BLR Urban
- **Vehicle theft** (+12%) — Historically elevated in May–June

**Expected Stable:**
- Drug trafficking (network under active monitoring)
- Assault cases (no seasonal triggers identified)

**Expected Decrease:**
- Burglary (−8%) — School holidays end, increased residential occupancy

**Early Warning Flags:**
1. Intelligence: New synthetic drug batch expected via Goa route (NH-75)
2. Arrested acc_003 associate network still active — fraud cases may increase
3. Approaching election period — historical +22% in extortion cases

**Recommendation:** Increase cyber cell capacity. Enhanced border check at NH-75.

**Model Confidence:** 82% | Predictions are probabilistic, not deterministic`;
  }

  if (/[\u0C80-\u0CFF]/.test(query)) {
    return `**ಪ್ರಶ್ನೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ — Kannada Query Received**

ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...

**ಕರ್ನಾಟಕ ಅಪರಾಧ ದತ್ತಾಂಶ — ಇತ್ತೀಚಿನ 30 ದಿನಗಳು:**

- ಕಳ್ಳತನ: **295 ಪ್ರಕರಣಗಳು** (↑8%)
- ದರೋಡೆ: **127 ಪ್ರಕರಣಗಳು** (↑14%)
- ಸೈಬರ್ ಅಪರಾಧ: **247 ಪ್ರಕರಣಗಳು** (↑34%)
- ಹಲ್ಲೆ: **91 ಪ್ರಕರಣಗಳು**

ಬೆಂಗಳೂರು ನಗರ ಅತಿ ಹೆಚ್ಚು ಅಪರಾಧ ಪ್ರಕರಣಗಳನ್ನು ದಾಖಲಿಸಿದ ಜಿಲ್ಲೆ (4,821 ಪ್ರಕರಣಗಳು).

**ವಿಶ್ವಾಸಾರ್ಹತೆ:** 88% | **ಮೂಲ:** ಅಪರಾಧ ದಾಖಲೆಗಳು 2024`;
  }

  return `**Query Received — KSP Crime Intelligence System**

I can help you with:
- **FIR queries** — Search by location, crime type, date, accused, status
- **Offender profiles** — Risk scores, criminal history, associations
- **Crime hotspots** — Geographic analysis and emerging clusters
- **Network analysis** — Criminal gangs and co-offender links
- **Drug intelligence** — Trafficking networks, NDPS cases
- **Crime forecasting** — 30-day predictions and early warnings
- **Daily summary** — Today's activity and active alerts

Try: *"Show top 5 high-risk accused in Bengaluru"*
Try: *"What are the robbery hotspots in 2024?"*
Try: *"Analyse drug trafficking network"*
Try: *"ಬೆಂಗಳೂರಿನಲ್ಲಿ ಅಪರಾಧ ಸ್ಥಿತಿ ಏನು?"* (Kannada supported)

**System:** 10,247 FIRs indexed | 2,156 accused profiles | 30 districts | Live`;
};