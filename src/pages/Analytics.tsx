import { useApp } from '../context/AppContext';
import { crimeTrendData, crimeStats } from '../data/mockData';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const TIP = {
  contentStyle: { background: '#0c1628', border: '1px solid #162844', borderRadius: '8px', fontSize: '12px' },
  labelStyle: { color: '#94a3b8' },
};
const PIE_DATA = [
  { name: 'Theft',           value: 295, color: '#3b82f6' },
  { name: 'Cybercrime',      value: 247, color: '#34d399' },
  { name: 'Robbery',         value: 127, color: '#ef4444' },
  { name: 'Assault',         value: 91,  color: '#f59e0b' },
  { name: 'Drug Trafficking',value: 82,  color: '#a78bfa' },
  { name: 'Fraud',           value: 73,  color: '#f97316' },
  { name: 'Others',          value: 148, color: '#475569' },
];
const HOUR_DATA = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h.toString().padStart(2, '0')}:00`,
  incidents: h >= 21 || h <= 1 ? 80 + Math.floor(Math.random() * 60)
    : h >= 8 && h <= 18 ? 30 + Math.floor(Math.random() * 30)
    : 15 + Math.floor(Math.random() * 20),
}));

export default function Analytics() {
  const { t } = useApp();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {t('ana.title')}
      </h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{t('ana.subtitle')}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('ana.trend')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={crimeTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} />
              <Tooltip {...TIP} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="theft"   stroke="#3b82f6" strokeWidth={2} dot={false} name="Theft" />
              <Line type="monotone" dataKey="robbery" stroke="#ef4444" strokeWidth={2} dot={false} name="Robbery" />
              <Line type="monotone" dataKey="cyber"   stroke="#34d399" strokeWidth={2} dot={false} name="Cybercrime" />
              <Line type="monotone" dataKey="drug"    stroke="#a78bfa" strokeWidth={2} dot={false} name="Drug" />
              <Line type="monotone" dataKey="assault" stroke="#f59e0b" strokeWidth={2} dot={false} name="Assault" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('ana.catDist')}</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                     dataKey="value" paddingAngle={2}>
                  {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...TIP} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {PIE_DATA.map(e => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />{e.name}
                  </span>
                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('ana.dist')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={crimeStats} layout="vertical">
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 9 }} />
              <YAxis type="category" dataKey="district" tick={{ fill: '#94a3b8', fontSize: 9 }} width={110} />
              <Tooltip {...TIP} formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : value ?? '-', 'Cases']} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {crimeStats.map((e, i) => (
                  <Cell key={i} fill={e.trend === 'UP' ? '#ef4444' : e.trend === 'DOWN' ? '#22c55e' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="font-display font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('ana.hour')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={HOUR_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 8 }}
                     tickFormatter={h => h.slice(0, 2)} interval={2} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} />
              <Tooltip {...TIP} />
              <Bar dataKey="incidents" radius={[3, 3, 0, 0]} name="Incidents">
                {HOUR_DATA.map((e, i) => (
                  <Cell key={i} fill={e.incidents > 100 ? '#ef4444' : e.incidents > 60 ? '#f59e0b' : '#2563eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}