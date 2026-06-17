import { useApp } from '../context/AppContext';
import { crimeTrendData } from '../data/mockData';
import { TrendingUp, TrendingDown, AlertTriangle, Bell } from 'lucide-react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const FORECASTS = [
  { period: 'May 2024',  change: +14, category: 'Cybercrime',      reason: 'Post-IPL betting cycle + internship scam season', color: '#34d399' },
  { period: 'May 2024',  change: +18, category: 'Street Robbery',  reason: 'Pre-summer festival crowds, increased foot traffic', color: '#ef4444' },
  { period: 'May 2024',  change: +12, category: 'Vehicle Theft',   reason: 'Historically elevated May–June. Target: IT corridors', color: '#f59e0b' },
  { period: 'May 2024',  change: -8,  category: 'Burglary',        reason: 'School holidays end — increased residential occupancy', color: '#22c55e' },
  { period: 'June 2024', change: +22, category: 'Extortion',       reason: 'Pre-election period — historical +22% correlation', color: '#f97316' },
  { period: 'June 2024', change: +9,  category: 'Drug Trafficking', reason: 'New supply batch expected via NH-75 Goa corridor', color: '#a78bfa' },
];

const ALERTS = [
  { id: 1, level: 'HIGH',   title: 'New Drug Batch — NH-75 Corridor',       desc: 'Intelligence indicates synthetic drug batch inbound via Goa route. Enhanced checks recommended.', time: '2h ago' },
  { id: 2, level: 'HIGH',   title: 'Absconding Accused — Lokesh S. Gowda',  desc: 'Murder accused last sighted near Tumakuru. BOLO issued. Coordinate with district units.', time: '4h ago' },
  { id: 3, level: 'MEDIUM', title: 'Cybercrime Surge — Electronic City',     desc: '34% increase in UPI fraud complaints vs last week. Linked to active scam network acc_003.', time: '6h ago' },
  { id: 4, level: 'MEDIUM', title: 'Gang Movement — Coastal Zone',           desc: 'Rajesh P. Kamath (acc_008) associates active in Mangaluru. Monitor closely.', time: '12h ago' },
];

const LEVEL_STYLE = {
  HIGH:   { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  color: '#ef4444' },
  MEDIUM: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', color: '#f59e0b' },
  LOW:    { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  color: '#22c55e' },
};

const TIP = {
  contentStyle: { background: '#0c1628', border: '1px solid #162844', borderRadius: '8px', fontSize: '12px' },
  labelStyle: { color: '#94a3b8' },
};

const PROJECTED = [
  ...crimeTrendData.slice(-4),
  { month: "May'24",  robbery: 138, theft: 318, assault: 95, drug: 89, cyber: 274 },
  { month: "Jun'24",  robbery: 145, theft: 325, assault: 98, drug: 94, cyber: 289 },
];

export default function Forecast() {
  const { t } = useApp();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {t('fore.title')}
      </h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{t('fore.subtitle')}</p>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {FORECASTS.map((f, i) => {
          const Icon = f.change > 0 ? TrendingUp : TrendingDown;
          return (
            <div key={i} className="rounded-xl p-4"
                 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-mono text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{f.period}</div>
                  <div className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{f.category}</div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded font-display font-bold text-sm"
                     style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}33` }}>
                  <Icon size={13} />{f.change > 0 ? '+' : ''}{f.change}%
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.reason}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t('fore.chart')}</h3>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Dashed = projected values based on 12-month pattern analysis.
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={PROJECTED}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} />
              <Tooltip {...TIP} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="cyber" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth={1} name="Cybercrime" />
              <Line type="monotone" dataKey="robbery" stroke="#ef4444" strokeWidth={2} dot={false} name="Robbery" />
              <Line type="monotone" dataKey="theft"   stroke="#3b82f6" strokeWidth={2} dot={false} name="Theft" />
              <Line type="monotone" dataKey="cyber"   stroke="#34d399" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Cyber proj." />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <Bell size={14} className="text-amber-400" />
            <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {t('fore.warnings')}
            </h3>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto" style={{ maxHeight: '300px' }}>
            {ALERTS.map(a => {
              const sty = LEVEL_STYLE[a.level as keyof typeof LEVEL_STYLE];
              return (
                <div key={a.id} className="p-3 rounded-lg"
                     style={{ background: sty.bg, border: `1px solid ${sty.border}` }}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle size={11} style={{ color: sty.color }} />
                      <span className="font-mono text-xs font-bold" style={{ color: sty.color }}>{a.level}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.time}</span>
                  </div>
                  <div className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}