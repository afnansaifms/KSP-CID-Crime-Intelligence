import type { FIRStatus, RiskLevel } from '../types';
import { firRecords, crimeTrendData, crimeStats } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { TrendingUp, AlertTriangle, FileText, Users, Clock, Activity } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const STATUS_STYLE: Record<FIRStatus, string> = {
  OPEN: 'status-open',
  UNDER_INVESTIGATION: 'status-investigating',
  CHARGE_SHEET: 'status-chargesheet',
  CLOSED: 'status-closed',
};
const STATUS_LABEL: Record<FIRStatus, string> = {
  OPEN: 'Open', UNDER_INVESTIGATION: 'Investigating',
  CHARGE_SHEET: 'Charge Sheet', CLOSED: 'Closed',
};
const RISK_STYLE: Record<RiskLevel, string> = {
  HIGH: 'risk-high', MEDIUM: 'risk-medium', LOW: 'risk-low',
};
const PIE_DATA = [
  { name: 'Theft',   value: 295, color: '#3b82f6' },
  { name: 'Cyber',   value: 247, color: '#34d399' },
  { name: 'Robbery', value: 127, color: '#ef4444' },
  { name: 'Assault', value: 91,  color: '#f59e0b' },
  { name: 'Drug',    value: 82,  color: '#a78bfa' },
  { name: 'Others',  value: 156, color: '#475569' },
];
const TIP = {
  contentStyle: { background: '#0c1628', border: '1px solid #162844', borderRadius: '10px', fontSize: '12px' },
  labelStyle: { color: '#94a3b8' },
};

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="rounded-xl p-5 relative overflow-hidden transition-all duration-200"
         style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
           style={{ background: `linear-gradient(90deg, ${color}, ${color}00)` }} />
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
           style={{ background: color, opacity: 0.05, filter: 'blur(16px)' }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display tracking-widest mb-2"
             style={{ color: 'var(--text-muted)', fontSize: '9px', letterSpacing: '0.15em' }}>
            {label}
          </p>
          <p className="font-display font-bold text-4xl leading-none mb-1.5" style={{ color }}>
            {value}
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <TrendingUp size={10} style={{ color: '#22c55e' }} />{sub}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: `${color}12`, border: `1px solid ${color}28` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useApp();
  const recentFIRs = firRecords.slice(0, 6);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Activity size={20} className="text-blue-400" />
            {t('dash.title')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t('dash.subtitle')}
          </p>
        </div>
        <div className="font-mono text-xs px-3 py-1.5 rounded-lg"
             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label={t('stat.activeCases')} value="1,247" sub="↑8.2% from last month" icon={FileText}     color="#3b82f6" />
        <StatCard label={t('stat.todayFIRs')}   value="23"    sub="+3 vs yesterday"        icon={AlertTriangle} color="#f59e0b" />
        <StatCard label={t('stat.highRisk')}     value="89"    sub="12 new this week"       icon={Users}         color="#ef4444" />
        <StatCard label={t('stat.pending')}      value="156"   sub="−14 from last week"     icon={Clock}         color="#22c55e" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 rounded-xl overflow-hidden"
             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b"
               style={{ borderColor: 'var(--border)' }}>
            <div>
              <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {t('chart.trend')}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t('chart.subMajor')}</p>
            </div>
            <span className="font-mono text-xs text-emerald-400 px-2 py-0.5 rounded"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
              {t('common.live')}
            </span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={crimeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} />
                <Tooltip {...TIP} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="theft"   stroke="#3b82f6" strokeWidth={2} dot={false} name="Theft" />
                <Line type="monotone" dataKey="robbery" stroke="#ef4444" strokeWidth={2} dot={false} name="Robbery" />
                <Line type="monotone" dataKey="cyber"   stroke="#34d399" strokeWidth={2} dot={false} name="Cybercrime" />
                <Line type="monotone" dataKey="drug"    stroke="#a78bfa" strokeWidth={2} dot={false} name="Drug" />
                <Line type="monotone" dataKey="assault" stroke="#f59e0b" strokeWidth={2} dot={false} name="Assault" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden"
             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {t('chart.categories')}
            </h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                     dataKey="value" paddingAngle={3}>
                  {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...TIP} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-1">
              {PIE_DATA.map(e => (
                <div key={e.name} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
                  <span>{e.name}</span>
                  <span className="ml-auto font-mono" style={{ fontSize: '10px' }}>{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl overflow-hidden"
             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b"
               style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {t('chart.recentFIRs')}
            </h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('chart.latest')}</span>
          </div>
          {recentFIRs.map((fir, i) => (
            <div key={fir.id}
                 className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
                 style={{ borderBottom: i < recentFIRs.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className={`text-xs px-2 py-0.5 rounded font-mono shrink-0 ${RISK_STYLE[fir.severity]}`}>
                {fir.severity}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-blue-300">{fir.firNumber}</div>
                <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{fir.description}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{fir.policeStation}</div>
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${STATUS_STYLE[fir.status]}`}
                      style={{ fontSize: '9px' }}>
                  {STATUS_LABEL[fir.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden"
             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {t('chart.topDistricts')}
            </h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={crimeStats.slice(0, 6)} layout="vertical">
                <XAxis type="number" tick={{ fill: '#475569', fontSize: 9 }} />
                <YAxis type="category" dataKey="district" tick={{ fill: '#94a3b8', fontSize: 9 }} width={85} />
                <Tooltip {...TIP} formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : value ?? '-', 'Cases']} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {crimeStats.slice(0, 6).map((e, i) => (
                    <Cell key={i} fill={e.trend === 'UP' ? '#ef4444' : e.trend === 'DOWN' ? '#22c55e' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}