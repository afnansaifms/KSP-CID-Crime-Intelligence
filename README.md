# KSP Crime Intelligence Platform

> **Real-time Crime Intelligence & Analytics Dashboard for Karnataka State Police (KSP) Crime Investigation Department (CID)**

A modern, bilingual (English & Kannada) web platform designed for law enforcement agencies to analyze, track, and forecast crime patterns with AI-driven insights.

## 🎯 Overview

KSP Crime Intelligence Platform is a comprehensive dashboard that empowers law enforcement officers with data-driven intelligence tools for crime investigation, network analysis, and predictive analytics. Built with cutting-edge web technologies, it provides a user-friendly interface for querying FIR databases, analyzing criminal networks, and generating actionable intelligence reports.

## ✨ Key Features

### 📊 **Dashboard & Analytics**
- Real-time crime statistics and KPIs (active cases, today's FIRs, high-risk offenders)
- 12-month crime trend analysis with multi-category breakdown
- District-wise crime comparison and heatmaps
- Crime distribution by category and time of day
- Live status indicators and recent case summaries

### 💬 **AI-Powered Chat Intelligence**
- Natural language queries for crime data (FIRs, accused, locations, hotspots)
- Bilingual support: English and Kannada with speech recognition
- Context-aware responses with confidence scoring
- Quick query suggestions for common searches
- PDF export capability for chat conversations
- System integration showing indexed data metrics (10,247 FIRs, 2,156 accused profiles)

### 🕸️ **Criminal Network Analysis**
- Interactive network graph visualization
- Node-based relationship mapping (accused, locations, organizations)
- Risk level indicators and connection strength metrics
- Cluster detection and gang member associations
- Real-time network statistics

### 🗺️ **Geographic Crime Heatmap**
- Interactive Leaflet-based map of Karnataka
- Crime incident distribution by location
- Filterable by crime type and severity level
- District statistics and hotspot identification
- Real-time incident tracking

### 👤 **Offender Profiles**
- Comprehensive accused information with risk scoring (0-100)
- Criminal history and modus operandi patterns
- Known associates and connections
- Active warrant status tracking
- Financial links detection and suspicious transaction alerts
- Last known location tracking

### 📈 **Predictive Analytics & Forecasting**
- 30-60 day crime trend predictions
- Early warning system for emerging crime patterns
- Seasonal and temporal analysis
- Historical vs. projected trend comparison
- Risk escalation alerts

### 💰 **Financial Crime & Transaction Analysis**
- Suspicious transaction flagging (₹ amount tracking)
- Hawala network detection and analysis
- Money trail visualization
- Cross-state financial link identification
- Fraud network mapping

### 🔐 **Role-Based Access Control**
- **Investigator** - Case queries, accused profiles, hotspot analysis
- **Crime Analyst** - Deep pattern analysis, forecasting, network mapping
- **Supervisor** - Full access with team oversight and priority alerts
- **Policymaker** - Dashboard insights and strategic reporting

### 🌐 **Bilingual Support**
- English and Kannada (ಕನ್ನದ) interfaces
- Theme toggle (Light/Dark mode)
- Localization for all content and UI elements

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 19.2.6 + TypeScript |
| **Build Tool** | Vite 8.0.12 |
| **State Management** | React Context API |
| **Routing** | React Router DOM 7.17 |
| **UI Components** | Custom Components + Lucide React Icons |
| **Charts & Visualization** | Recharts 3.8.1 |
| **Maps** | Leaflet 1.9.4 + React-Leaflet 5.0 |
| **Styling** | Tailwind CSS 3.4.19 |
| **Export** | jsPDF 4.2.1 + html2canvas 1.4.1 |
| **Language** | TypeScript 6.0.2 |
| **Code Quality** | ESLint + TypeScript ESLint |

## 📁 Project Structure

```
src/
├── components/
│   └── layout/
│       ├── AppLayout.tsx      # Main application wrapper
│       ├── Header.tsx         # Top navigation bar
│       └── Sidebar.tsx        # Navigation sidebar with role-based menu
├── pages/
│   ├── Dashboard.tsx          # Home dashboard with KPIs
│   ├── Chat.tsx              # AI chat interface
│   ├── Network.tsx           # Criminal network visualization
│   ├── Heatmap.tsx           # Geographic crime map
│   ├── Analytics.tsx         # Pattern analysis & reports
│   ├── Profile.tsx           # Offender profile search
│   ├── Forecast.tsx          # Predictive analytics
│   ├── Financial.tsx         # Financial crime analysis
│   └── Login.tsx             # Authentication interface
├── context/
│   └── AppContext.tsx        # Global app state (theme, language, auth)
├── hooks/
│   └── useAuth.ts           # Authentication hook & role configs
├── services/
│   └── api.ts               # Backend API integration layer
├── data/
│   ├── mockData.ts          # Sample/mock database
│   └── translations.ts      # i18n strings (EN & KN)
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Root component
├── main.tsx                 # Application entry point
└── index.css / App.css      # Global & component styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ksp-crime-intelligence.git
cd ksp-crime-intelligence

# Install dependencies
npm install

# Start development server
npm run dev
# App will be available at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm lint
```

## 📊 Data Models

### Core Types
- **User** - Authenticated officer with role and badge number
- **FIR** - First Information Report with crime details, status, and location
- **Accused** - Criminal profile with risk score and associations
- **Victim** - Victim information for case management
- **ChatMessage** - Conversational AI messages with citations
- **NetworkNode/Edge** - Graph elements for relationship mapping
- **CrimeCategory** - 13 crime types (robbery, theft, assault, cybercrime, etc.)

## 🔐 Authentication & Roles

The platform uses role-based access control with 4 user profiles:

| Role | Permissions | Access Level |
|------|-----------|--------------|
| **Investigator** | Query FIRs, profiles, networks | 5 modules |
| **Crime Analyst** | All investigator + forecasting | 6 modules |
| **Supervisor** | Full access + team oversight | All modules |
| **Policymaker** | Dashboard, analytics, reports | 4 modules |

## 🎨 UI/UX Features

- **Dark Theme by Default** - Eye-friendly design for extended viewing
- **Responsive Layout** - Optimized for desktop with sidebar navigation
- **Real-time Updates** - Live data indicators and status badges
- **Interactive Charts** - Recharts with hover tooltips and legends
- **Export Options** - PDF reports and chat transcript downloads
- **Accessibility** - ARIA labels, keyboard navigation, high contrast

## 📋 Sample Data

The platform includes mock data representing:
- **10,247** indexed FIRs across Karnataka
- **2,156** accused profiles with criminal histories
- **30 districts** with crime statistics
- **7 crime categories** with trend data
- **Multi-language support** with 100+ localization strings

## 🔄 API Integration

The `services/api.ts` layer provides abstraction for:
- FIR database queries (search, filter, sort)
- Accused profile lookups
- Location-based heatmap data
- Chat query processing (AI backend integration)
- Network graph data generation
- Forecasting predictions

*Note: Currently uses mock data. Replace with backend API endpoints as needed.*

## 🌍 Internationalization

The app supports two languages:
- **English (en)** - Default interface language
- **Kannada (kn)** - ಕನ್ನದ regional language support

Switch languages using the theme toggle in the top navigation. All strings are centralized in `context/AppContext.tsx`.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Performance

- **Build Size**: ~1.3MB (JS) + 32KB (CSS) after minification
- **Initial Load**: <2s on modern connections
- **Chunk Splitting**: Code-split by route for optimal loading
- **Tree Shaking**: Enabled for production builds

> Note: Consider implementing dynamic imports for further optimization

## 🔧 Development Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # TypeScript check + Vite build
npm run preview   # Preview production build
npm lint          # Run ESLint
```

## 📝 Key Components

### Pages
- **Dashboard.tsx** - KPI cards, trend charts, recent cases, top districts
- **Chat.tsx** - Chat interface with voice input, suggestions, PDF export
- **Network.tsx** - Interactive criminal network graph visualization
- **Heatmap.tsx** - Leaflet map with crime incident markers
- **Analytics.tsx** - Multi-chart analysis (trends, distribution, hourly)
- **Profile.tsx** - Searchable accused database with detailed profiles
- **Forecast.tsx** - Predictive charts and early warning alerts
- **Financial.tsx** - Transaction flow network and suspicious activity mapping

### Layout Components
- **AppLayout.tsx** - Root wrapper with sidebar + main content
- **Header.tsx** - Top bar with title, user info, theme/language toggles
- **Sidebar.tsx** - Navigation menu with role-based filtering

## 🎯 Future Enhancements

- [ ] Backend API integration (replace mock data)
- [ ] Real-time WebSocket updates
- [ ] Advanced geospatial analysis (clustering, density mapping)
- [ ] Custom report builder
- [ ] Machine learning model integration for risk scoring
- [ ] Mobile-responsive design
- [ ] Advanced audit logging
- [ ] Notification system for alerts
- [ ] Multi-language expansion (Marathi, Tamil, Telugu)

## 📄 License

[Specify your license - MIT, Apache 2.0, etc.]

## 👥 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support & Contact

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact: [Your Email/Contact Info]

## 🙏 Acknowledgments

- Karnataka State Police for crime data structure
- React and open-source community
- Lucide React for icons
- Recharts for visualization library

---

**Built with ❤️ for Law Enforcement Intelligence**

Last Updated: 2024
