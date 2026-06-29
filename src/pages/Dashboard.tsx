import type { FIRStatus, RiskLevel } from '../types';
import { firRecords, crimeTrendData, accusedRecords } from '../data/mockData';
import { getSystemStats } from '../services/api';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, AlertTriangle, FileText, Users, Clock, Shield } from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const STATUS_STYLE: Record<FIRStatus, string> = {
  OPEN:'status-open', UNDER_INVESTIGATION:'status-investigating',
  CHARGE_SHEET:'status-chargesheet', CLOSED:'status-closed',
};
const STATUS_LABEL: Record<FIRStatus, string> = {
  OPEN:'Open', UNDER_INVESTIGATION:'Investigating',
  CHARGE_SHEET:'Charge Sheet', CLOSED:'Closed',
};
const RISK_STYLE: Record<RiskLevel, string> = { HIGH:'risk-high', MEDIUM:'risk-medium', LOW:'risk-low' };

const PIE_DATA = [
  { name:'Theft',    value:0, color:'#3b82f6' },
  { name:'Cyber',    value:0, color:'#10b981' },
  { name:'Robbery',  value:0, color:'#ef4444' },
  { name:'Assault',  value:0, color:'#f59e0b' },
  { name:'Drug',     value:0, color:'#a78bfa' },
  { name:'Others',   value:0, color:'#475569' },
];

// Compute pie from real data
const cats = firRecords.reduce((acc, f) => {
  acc[f.crimeCategory] = (acc[f.crimeCategory] || 0) + 1; return acc;
}, {} as Record<string, number>);
PIE_DATA[0].value = cats['THEFT']           || 0;
PIE_DATA[1].value = cats['CYBERCRIME']      || 0;
PIE_DATA[2].value = cats['ROBBERY']         || 0;
PIE_DATA[3].value = cats['ASSAULT']         || 0;
PIE_DATA[4].value = cats['DRUG_TRAFFICKING']|| 0;
PIE_DATA[5].value = Object.entries(cats).filter(([k]) => !['THEFT','CYBERCRIME','ROBBERY','ASSAULT','DRUG_TRAFFICKING'].includes(k)).reduce((s,[,v])=>s+v,0);

const TIP = {
  contentStyle:{ background:'#071525', border:'1px solid #112d4e', borderRadius:'10px', fontSize:'11px' },
  labelStyle:{ color:'#8eafd4' },
};

function StatCard({ label, value, sub, icon:Icon, color, trend }:{
  label:string; value:string; sub:string; icon:React.ElementType; color:string; trend?:'up'|'down'|'stable';
}) {
  return (
    <div className="ksp-card p-5 transition-all duration-200 hover:-translate-y-0.5">
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
           style={{ background:`linear-gradient(90deg,${color},${color}00)` }} />
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
           style={{ background:color, opacity:.04, filter:'blur(20px)' }} />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="font-mono mb-2" style={{ color:'var(--text-muted)', fontSize:'9px', letterSpacing:'.14em' }}>
            {label.toUpperCase()}
          </p>
          <p className="font-display font-bold leading-none mb-1.5" style={{ color, fontSize:'36px' }}>{value}</p>
          <p className="text-xs flex items-center gap-1" style={{ color:'var(--text-muted)' }}>
            {trend==='up' && <TrendingUp size={10} style={{ color:'#ef4444' }} />}
            {trend==='down' && <TrendingDown size={10} style={{ color:'#10b981' }} />}
            {sub}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
             style={{ background:`${color}12`, border:`1px solid ${color}25`,
                      boxShadow:`0 0 16px ${color}14` }}>
          <Icon size={19} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useApp();
  const stats = getSystemStats();
  const recentFIRs = firRecords.slice(0, 7);
  const highRiskAcc = accusedRecords.filter(a => a.riskScore >= 80).slice(0, 5);

  return (
    <div className="animate-fade-up space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-white flex items-center gap-2" style={{ fontSize:'22px' }}>
            <Shield size={20} style={{ color:'#60a5fa' }} />
            {t('dash.title')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>{t('dash.subtitle')}</p>
        </div>
        <div className="font-mono text-xs px-3 py-1.5 rounded-lg"
             style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', color:'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label={t('stat.activeCases')} value={stats.totalActiveCases.toLocaleString()} sub="↑8.2% from last month" icon={FileText} color="#3b82f6" trend="up" />
        <StatCard label={t('stat.todayFIRs')}   value={String(stats.todayFIRs)} sub="+3 vs yesterday" icon={AlertTriangle} color="#f59e0b" />
        <StatCard label={t('stat.highRisk')}    value={String(stats.highRiskAccused)} sub="12 new this week" icon={Users} color="#ef4444" trend="up" />
        <StatCard label={t('stat.pending')}     value={String(stats.pendingReview)} sub="−14 from last week" icon={Clock} color="#10b981" trend="down" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Area trend */}
        <div className="col-span-2 ksp-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-white" style={{ fontSize:'13px' }}>{t('chart.trend')}</h3>
              <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{t('chart.subMajor')}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="font-mono" style={{ color:'#10b981', fontSize:'9px' }}>{t('common.live')}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={crimeTrendData}>
              <defs>
                {[['theft','#3b82f6'],['robbery','#ef4444'],['cyber','#10b981'],['drug','#a78bfa']].map(([k,c])=>(
                  <linearGradient key={k} id={`g_${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" tick={{ fill:'#3d6494', fontSize:9 }} />
              <YAxis tick={{ fill:'#3d6494', fontSize:9 }} />
              <Tooltip {...TIP} />
              <Legend wrapperStyle={{ fontSize:'11px', paddingTop:'8px' }} />
              <Area type="monotone" dataKey="theft"   stroke="#3b82f6" fill="url(#g_theft)"   strokeWidth={2} dot={false} name="Theft" />
              <Area type="monotone" dataKey="robbery" stroke="#ef4444" fill="url(#g_robbery)" strokeWidth={2} dot={false} name="Robbery" />
              <Area type="monotone" dataKey="cyber"   stroke="#10b981" fill="url(#g_cyber)"   strokeWidth={2} dot={false} name="Cybercrime" />
              <Area type="monotone" dataKey="drug"    stroke="#a78bfa" fill="url(#g_drug)"    strokeWidth={2} dot={false} name="Drug" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="ksp-card p-4">
          <h3 className="font-display font-semibold text-white mb-3" style={{ fontSize:'13px' }}>
            {t('chart.categories')}
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={65}
                   dataKey="value" paddingAngle={3} strokeWidth={0}>
                {PIE_DATA.map((e,i) => <Cell key={i} fill={e.color} opacity={.85} />)}
              </Pie>
              <Tooltip {...TIP} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
            {PIE_DATA.map(e => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs" style={{ color:'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background:e.color }} />
                <span>{e.name}</span>
                <span className="ml-auto font-mono" style={{ fontSize:'10px' }}>{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-3">
        {/* FIR table */}
        <div className="col-span-2 ksp-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5"
               style={{ borderBottom:'1px solid var(--border)' }}>
            <h3 className="font-display font-semibold text-white" style={{ fontSize:'13px' }}>
              {t('chart.recentFIRs')}
            </h3>
            <span className="font-mono text-xs" style={{ color:'var(--text-muted)' }}>{t('chart.latest')}</span>
          </div>
          {recentFIRs.map((fir, i) => (
            <div key={fir.id}
                 className="flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-colors"
                 style={{
                   borderBottom: i < recentFIRs.length-1 ? '1px solid var(--border)' : 'none',
                 }}
                 onMouseEnter={e => (e.currentTarget.style.background='rgba(26,86,219,0.05)')}
                 onMouseLeave={e => (e.currentTarget.style.background='')}>
              <span className={`text-xs px-1.5 py-0.5 rounded font-mono shrink-0 ${RISK_STYLE[fir.severity]}`}>
                {fir.severity}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-blue-400">{fir.firNumber}</div>
                <div className="text-xs truncate mt-0.5" style={{ color:'var(--text-muted)' }}>
                  {fir.description}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs mb-0.5" style={{ color:'var(--text-muted)' }}>{fir.policeStation}</div>
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${STATUS_STYLE[fir.status]}`}
                      style={{ fontSize:'9px' }}>
                  {STATUS_LABEL[fir.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* High-risk accused mini list */}
        <div className="ksp-card overflow-hidden">
          <div className="px-4 py-3.5" style={{ borderBottom:'1px solid var(--border)' }}>
            <h3 className="font-display font-semibold text-white" style={{ fontSize:'13px' }}>
              High-Risk Accused
            </h3>
          </div>
          {highRiskAcc.map((acc, i) => (
            <div key={acc.id}
                 className="flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer"
                 style={{ borderBottom: i < highRiskAcc.length-1 ? '1px solid var(--border)' : 'none' }}
                 onMouseEnter={e => (e.currentTarget.style.background='rgba(26,86,219,0.05)')}
                 onMouseLeave={e => (e.currentTarget.style.background='')}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold shrink-0"
                   style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444',
                            border:'1px solid rgba(239,68,68,0.25)', fontSize:'11px' }}>
                {acc.riskScore}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color:'var(--text-primary)' }}>
                  {acc.name}
                </div>
                <div className="text-xs truncate" style={{ color:'var(--text-muted)' }}>{acc.district}</div>
              </div>
              {acc.activeWarrant && (
                <span className="text-xs px-1.5 py-0.5 rounded font-mono risk-high shrink-0" style={{ fontSize:'8px' }}>
                  WARRANT
                </span>
              )}
            </div>
          ))}
          <div className="px-4 py-3" style={{ borderTop:'1px solid var(--border)' }}>
            <div className="text-xs" style={{ color:'var(--text-muted)' }}>
              {accusedRecords.filter(a=>a.riskScore>=80).length} total high-risk · {accusedRecords.filter(a=>a.activeWarrant).length} active warrants
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}