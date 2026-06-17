import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Language = 'en' | 'kn';

const EN: Record<string, string> = {
  'nav.overview': 'Overview',
  'nav.financial': 'Financial Crime',
  'nav.chat': 'Chat Intelligence',
  'nav.network': 'Criminal Networks',
  'nav.heatmap': 'Crime Heatmap',
  'nav.analytics': 'Analytics',
  'nav.profile': 'Offender Profiles',
  'nav.forecast': 'Forecast & Alerts',
  'nav.signout': 'Sign Out',
  'nav.modules': 'MODULES',
  'dash.title': 'Intelligence Overview',
  'dash.subtitle': 'Karnataka State · Real-time crime intelligence dashboard',
  'stat.activeCases': 'Active Cases',
  'stat.todayFIRs': "Today's FIRs",
  'stat.highRisk': 'High Risk',
  'stat.pending': 'Pending Review',
  'chart.trend': 'Crime Trend — 12 Months',
  'chart.categories': 'Crime Categories',
  'chart.recentFIRs': 'Recent FIRs',
  'chart.topDistricts': 'Top Districts',
  'chart.latest': 'Latest 6',
  'chart.subMajor': 'Major categories',
  'net.title': 'Criminal Network Analysis',
  'net.subtitle': 'Relationship graph of accused, locations and organizations',
  'net.graphTitle': 'Network Graph — Bengaluru Cluster',
  'net.stats': 'Network Stats',
  'net.totalNodes': 'Total Nodes',
  'net.highRisk': 'High Risk',
  'net.warrants': 'Active Warrants',
  'net.connections': 'Active Connections',
  'net.clickHint': 'Click any node to view the full accused profile.',
  'net.profile': 'Profile',
  'map.title': 'Crime Heatmap',
  'map.subtitle': 'Geographic distribution of crime incidents across Karnataka',
  'map.filters': 'Filters',
  'map.crimeType': 'Crime Type',
  'map.severity': 'Severity',
  'map.mapTitle': 'Karnataka — Crime Incident Map',
  'map.distStats': 'District Stats',
  'map.shown': 'incidents shown',
  'pro.title': 'Offender Profiles',
  'pro.subtitle': 'Accused profiles, risk scores and criminal history',
  'pro.search': 'Search by name, alias, district...',
  'pro.history': 'Crime History',
  'pro.modus': 'Modus Operandi',
  'pro.assoc': 'Known Associates',
  'pro.priorOff': 'Prior Offences',
  'pro.fin': 'Financial Links',
  'pro.finYes': '⚠ Suspicious transactions detected',
  'pro.finNo': 'None detected',
  'pro.lastLoc': 'Last Known Location',
  'ana.title': 'Crime Analytics',
  'ana.subtitle': 'Pattern analysis, trend reports — Karnataka 2023–24',
  'ana.trend': '12-Month Crime Trend',
  'ana.dist': 'District Comparison — Crime Count',
  'ana.hour': 'Crime Incidents by Hour of Day',
  'ana.catDist': 'Crime Distribution by Category',
  'fore.title': 'Crime Forecast & Early Warning',
  'fore.subtitle': 'AI-driven predictions — next 30–60 days',
  'fore.chart': 'Historical vs Projected Trend',
  'fore.warnings': 'Early Warnings',
  'chat.title': 'Crime Intelligence Chat',
  'chat.placeholder': 'Ask anything about crimes, accused, hotspots...',
  'chat.quickQueries': 'Quick Queries',
  'chat.system': 'System',
  'common.live': 'LIVE',
  'common.search': 'Search FIRs, accused, locations, IPC sections...',
  'common.warrant': 'WARRANT',
  'common.activeWarrant': 'ACTIVE WARRANT',
  'common.financialLinks': 'FINANCIAL LINKS',
};

const KN: Record<string, string> = {
  'nav.overview': 'ಅವಲೋಕನ',
  'nav.chat': 'ಚಾಟ್ ಬುದ್ಧಿಮತ್ತೆ',
  'nav.network': 'ಅಪರಾಧಿ ಜಾಲ',
  'nav.heatmap': 'ಅಪರಾಧ ಶಾಖ ನಕ್ಷೆ',
  'nav.analytics': 'ವಿಶ್ಲೇಷಣೆ',
  'nav.profile': 'ಅಪರಾಧಿ ಪ್ರೊಫೈಲ್',
  'nav.forecast': 'ಮುನ್ಸೂಚನೆ ಮತ್ತು ಎಚ್ಚರಿಕೆ',
  'nav.signout': 'ಸೈನ್ ಔಟ್',
  'nav.modules': 'ಮಾಡ್ಯೂಲ್‌ಗಳು',
  'dash.title': 'ಬುದ್ಧಿಮತ್ತೆ ಅವಲೋಕನ',
  'dash.subtitle': 'ಕರ್ನಾಟಕ ರಾಜ್ಯ · ರಿಯಲ್-ಟೈಮ್ ಅಪರಾಧ ಮಾಹಿತಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
  'stat.activeCases': 'ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು',
  'stat.todayFIRs': 'ಇಂದಿನ ಎಫ್‌ಐಆರ್',
  'stat.highRisk': 'ಅಧಿಕ ಅಪಾಯ',
  'stat.pending': 'ಪರಿಶೀಲನೆ ಬಾಕಿ',
  'chart.trend': 'ಅಪರಾಧ ಪ್ರವೃತ್ತಿ — 12 ತಿಂಗಳು',
  'chart.categories': 'ಅಪರಾಧ ವರ್ಗಗಳು',
  'chart.recentFIRs': 'ಇತ್ತೀಚಿನ ಎಫ್‌ಐಆರ್',
  'chart.topDistricts': 'ಮುಖ್ಯ ಜಿಲ್ಲೆಗಳು',
  'chart.latest': 'ಕೊನೆಯ 6',
  'chart.subMajor': 'ಪ್ರಮುಖ ವರ್ಗಗಳು',
  'net.title': 'ಅಪರಾಧಿ ಜಾಲ ವಿಶ್ಲೇಷಣೆ',
  'net.subtitle': 'ಆರೋಪಿಗಳು, ಸ್ಥಳಗಳು ಮತ್ತು ಸಂಘಟನೆಗಳ ಸಂಬಂಧ ನಕ್ಷೆ',
  'net.graphTitle': 'ಜಾಲ ಗ್ರಾಫ್ — ಬೆಂಗಳೂರು ಕ್ಲಸ್ಟರ್',
  'net.stats': 'ಜಾಲ ಅಂಕಿಅಂಶ',
  'net.totalNodes': 'ಒಟ್ಟು ನೋಡ್‌ಗಳು',
  'net.highRisk': 'ಅಧಿಕ ಅಪಾಯ',
  'net.warrants': 'ಸಕ್ರಿಯ ವಾರಂಟ್',
  'nav.financial': 'ಆರ್ಥಿಕ ಅಪರಾಧ',
  'net.connections': 'ಸಕ್ರಿಯ ಸಂಪರ್ಕಗಳು',
  'net.clickHint': 'ಪ್ರೊಫೈಲ್ ನೋಡಲು ಯಾವುದೇ ನೋಡ್ ಕ್ಲಿಕ್ ಮಾಡಿ.',
  'net.profile': 'ಪ್ರೊಫೈಲ್',
  'map.title': 'ಅಪರಾಧ ಶಾಖ ನಕ್ಷೆ',
  'map.subtitle': 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಅಪರಾಧ ಘಟನೆಗಳ ಭೌಗೋಳಿಕ ವಿತರಣೆ',
  'map.filters': 'ಫಿಲ್ಟರ್‌ಗಳು',
  'map.crimeType': 'ಅಪರಾಧ ವಿಧ',
  'map.severity': 'ತೀವ್ರತೆ',
  'map.mapTitle': 'ಕರ್ನಾಟಕ — ಅಪರಾಧ ನಕ್ಷೆ',
  'map.distStats': 'ಜಿಲ್ಲಾ ಅಂಕಿಅಂಶ',
  'map.shown': 'ಘಟನೆಗಳು ತೋರಿಸಲಾಗಿದೆ',
  'pro.title': 'ಅಪರಾಧಿ ಪ್ರೊಫೈಲ್‌ಗಳು',
  'pro.subtitle': 'ಆರೋಪಿ ಪ್ರೊಫೈಲ್, ಅಪಾಯ ಅಂಕ ಮತ್ತು ಅಪರಾಧ ಇತಿಹಾಸ',
  'pro.search': 'ಹೆಸರು, ಅಡ್ಡಹೆಸರು ಅಥವಾ ಜಿಲ್ಲೆಯಿಂದ ಹುಡುಕಿ...',
  'pro.history': 'ಅಪರಾಧ ಇತಿಹಾಸ',
  'pro.modus': 'ಮೋಡಸ್ ಆಪರೇಂಡಿ',
  'pro.assoc': 'ತಿಳಿದ ಸಹಚರರು',
  'pro.priorOff': 'ಹಿಂದಿನ ಅಪರಾಧಗಳು',
  'pro.fin': 'ಆರ್ಥಿಕ ಸಂಪರ್ಕಗಳು',
  'pro.finYes': '⚠ ಅನುಮಾನಾಸ್ಪದ ವಹಿವಾಟು ಪತ್ತೆ',
  'pro.finNo': 'ಯಾವುದೂ ಪತ್ತೆಯಾಗಿಲ್ಲ',
  'pro.lastLoc': 'ಕೊನೆಯ ತಿಳಿದ ಸ್ಥಳ',
  'ana.title': 'ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆ',
  'ana.subtitle': 'ಅಪರಾಧ ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ — ಕರ್ನಾಟಕ 2023–24',
  'ana.trend': '12-ತಿಂಗಳ ಅಪರಾಧ ಪ್ರವೃತ್ತಿ',
  'ana.dist': 'ಜಿಲ್ಲಾ ಹೋಲಿಕೆ — ಅಪರಾಧ ಸಂಖ್ಯೆ',
  'ana.hour': 'ಗಂಟೆಯ ಅನ್ವಯ ಅಪರಾಧ ಘಟನೆಗಳು',
  'ana.catDist': 'ವರ್ಗದ ಪ್ರಕಾರ ಅಪರಾಧ ವಿತರಣೆ',
  'fore.title': 'ಅಪರಾಧ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಆರಂಭಿಕ ಎಚ್ಚರಿಕೆ',
  'fore.subtitle': 'AI ಆಧಾರಿತ ಭವಿಷ್ಯವಾಣಿ — ಮುಂದಿನ 30–60 ದಿನಗಳು',
  'fore.chart': 'ಐತಿಹಾಸಿಕ ಮತ್ತು ಅಂದಾಜು ಪ್ರವೃತ್ತಿ',
  'fore.warnings': 'ಆರಂಭಿಕ ಎಚ್ಚರಿಕೆಗಳು',
  'chat.title': 'ಅಪರಾಧ ಬುದ್ಧಿಮತ್ತೆ ಚಾಟ್',
  'chat.placeholder': 'ಅಪರಾಧಗಳ ಬಗ್ಗೆ ಕೇಳಿ, ಆರೋಪಿ, ಹಾಟ್‌ಸ್ಪಾಟ್...',
  'chat.quickQueries': 'ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು',
  'chat.system': 'ವ್ಯವಸ್ಥೆ',
  'common.live': 'ನೇರ',
  'common.search': 'ಎಫ್‌ಐಆರ್, ಆರೋಪಿ, ಸ್ಥಳ ಹುಡುಕಿ...',
  'common.warrant': 'ವಾರಂಟ್',
  'common.activeWarrant': 'ಸಕ್ರಿಯ ವಾರಂಟ್',
  'common.financialLinks': 'ಆರ್ಥಿಕ ಸಂಪರ್ಕ',
};

interface AppContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('ksp_theme') as Theme) || 'dark'
  );
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem('ksp_lang') as Language) || 'en'
  );

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('ksp_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ksp_lang', language);
  }, [language]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(l => l === 'en' ? 'kn' : 'en');
  const t = (key: string) => (language === 'kn' ? KN[key] : EN[key]) ?? key;

  return (
    <AppContext.Provider value={{ theme, language, toggleTheme, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}