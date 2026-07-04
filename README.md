# KIRAN — Karnataka Intelligence and Response Analysis Network

> AI-powered Crime Intelligence Platform for Karnataka State Police CID  
> KSP CID Datathon 2026 Submission — Team KIRAN

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ksp--cid--intelligence.onslate.in-blue)](https://ksp-cid-intelligence.onslate.in)
[![GitHub](https://img.shields.io/badge/GitHub-KSP--CID--Crime--Intelligence--Platform-black)](https://github.com/afnansaifms/KSP-CID-Crime-Intelligence)

---

## What is KIRAN?

KIRAN (Karnataka Intelligence and Response Analysis Network) is a full-stack AI-powered crime intelligence platform that enables Karnataka State Police investigators, analysts, supervisors and policymakers to interact with the state crime database using natural language — in English or Kannada, by typing or speaking.

Instead of navigating complex database interfaces, officers simply ask questions like:
- *"Who is Nagesh M. Pai?"*
- *"What are the drug trafficking hotspots in Bengaluru?"*
- *"Show me all OPEN robbery cases in Koramangala"*
- *"ಬೆಂಗಳೂರಿನಲ್ಲಿ ಅಧಿಕ ಅಪಾಯದ ಆರೋಪಿಗಳನ್ನು ತೋರಿಸಿ"*

---

## Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Conversational AI — English + Kannada + Voice + PDF export | ✅ Live |
| 2 | Criminal Network Analysis — interactive graph visualization | ✅ Live |
| 3 | Crime Pattern & Trend Analytics — 12-month charts, district comparison | ✅ Live |
| 4 | Geographic Crime Heatmap — dark map with severity filters | ✅ Live |
| 5 | Criminology-Based Offender Profiling — risk scoring 0–100 | ✅ Live |
| 6 | Financial Crime & Transaction Analysis — money trail network | ✅ Live |
| 7 | Crime Forecasting & Early Warning — AI-driven projections | ✅ Live |
| 8 | Explainable AI — every response cites FIR numbers and confidence % | ✅ Live |
| 9 | Secure Role-Based Access — 4 roles, CID Chief approval workflow | ✅ Live |
| 10 | Multi-language, Multi-theme UI — English/Kannada, Dark/Light | ✅ Live |

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Charts | Recharts, Leaflet.js |
| AI / NLP | Groq API, Llama 3.3 70B |
| Voice | Web Speech API |
| Storage | Catalyst DataStore, IndexedDB |
| Deployment | Zoho Catalyst Slate |
| PDF Export | jsPDF |

---

## Architecture

```
Officer (Browser)
       │
       ▼
React Frontend (Catalyst Slate)
       │
       ├── Smart Local Search (instant name/FIR lookup)
       │
       └── Groq API (Llama 3.3 70B)
               │
               ▼
       Catalyst DataStore
       ├── CaseMaster (500 FIRs)
       ├── Accused (100 profiles)
       ├── Victim (60 records)
       ├── Unit (Police stations)
       └── Employee (Officers)
```

---

## Database Schema

Modeled on the **official Karnataka Police FIR ER Diagram**:

| Table | Description |
|-------|-------------|
| `CaseMaster` | FIR records — CrimeNo, district, PS, status, GPS coordinates |
| `Accused` | Accused profiles — risk score, MO, associates, warrant status |
| `Victim` | Victim records linked to FIRs |
| `Unit` | Police stations across 30 Karnataka districts |
| `Employee` | Investigating officers with rank and designation |

CrimeNo follows the official KSP format:  
`1 + DistrictID + StationID + Year + Serial` → e.g. `104430006202600001`

---

## Role-Based Access

| Role | Access |
|------|--------|
| **Investigator** | Chat, Network, Heatmap, Profiles, Financial |
| **Crime Analyst** | All modules + Analytics |
| **Supervisor** | All modules + Registration Approvals |
| **Policymaker** | Dashboard, Analytics, Heatmap, Forecast |

New officer registrations require **CID Chief approval** before access is granted.

**Demo credentials:**  
Email: `chief@ksp.gov.in` | Password: `KSP@Chief2024`

---

## Local Setup

### Prerequisites
- Node.js 20+
- npm 9+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

```bash
# Clone the repository
git https://github.com/afnansaifms/KSP-CID-Crime-Intelligence.git
cd KSP-CID-Crime-Intelligence-Platform

# Install dependencies
npm install
# Create environment file
echo "VITE_GROQ_API_KEY=your_groq_key_here" > .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## Deployment on Catalyst

This project is deployed on **Zoho Catalyst Slate** as required by the KSP CID Datathon 2026.

```bash
# Install Catalyst CLI
npm install -g zcatalyst-cli

# Login
catalyst login

# Build and deploy via Catalyst Slate (drag-and-drop dist/ folder)
npm run build
```

Then upload the `dist/` folder via Catalyst Console → Web Client Hosting → Upload.

---

## Seeding the Database

To populate Catalyst DataStore with 500 FIRs and 100 accused profiles:

```bash
# Install Python dependencies
pip install requests faker

# Add your Catalyst token to seed_catalyst.py
# CATALYST_TOKEN = '1000.xxxxxxxxxx.xxxxxxxxxx'

python seed_catalyst.py
```

---

## Project Structure

```
ksp-crime-intelligence/
├── src/
│   ├── context/
│   │   └── AppContext.tsx          # Theme + language state
│   ├── data/
│   │   └── mockData.ts             # 500 FIRs, 100 accused, 60 victims
│   ├── hooks/
│   │   └── useAuth.ts              # Auth + RBAC
│   ├── pages/
│   │   ├── Login.tsx               # Auth with CID Chief approval flow
│   │   ├── Dashboard.tsx           # Intelligence overview
│   │   ├── Chat.tsx                # KIRAN AI chatbot
│   │   ├── Network.tsx             # Criminal network graph
│   │   ├── Heatmap.tsx             # Crime geographic map
│   │   ├── Analytics.tsx           # Trend charts
│   │   ├── Profile.tsx             # Offender profiles
│   │   ├── Forecast.tsx            # Crime forecasting
│   │   ├── Financial.tsx           # Financial crime analysis
│   │   └── Admin.tsx               # CID Chief approval panel
│   ├── services/
│   │   ├── api.ts                  # Groq AI + smart local search
│   │   ├── authStorage.ts          # Registration system
│   │   └── chatStorage.ts          # IndexedDB chat history
│   └── components/
│       └── layout/
│           ├── Sidebar.tsx
│           ├── Header.tsx
│           └── AppLayout.tsx
├── public/
│   └── ksp-logo.svg
├── seed_catalyst.py                # Database seeding script
└── catalyst.json                   # Catalyst project config
```

---

## Links

| Resource | URL |
|----------|-----|
| Live Demo | https://ksp-cid-intelligence.onslate.in |
| GitHub | https://github.com/afnansaifms/KSP-CID-Crime-Intelligence |
| Demo Video | *[To be added]* |

---

## Team

**Team KIRAN** — KSP CID Datathon 2026  
Team Leader: Afnan Saif M S  
Team Size: 3

---

## License

Built for KSP CID Datathon 2026. All rights reserved.