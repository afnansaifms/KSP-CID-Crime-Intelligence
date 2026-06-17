import { useApp } from '../context/AppContext';
import { AlertTriangle, TrendingUp, DollarSign, Link } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, 
} from 'recharts';

const TRANSACTIONS = [
  { id:'TXN001', from:'Prakash B. Shetty (acc_007)', to:'Unknown Account MH-4421', amount:240000, type:'HAWALA', date:'2024-04-01', flagged:true },
  { id:'TXN002', from:'Ravi Kumar G. (acc_001)',     to:'Nagawara Cash Agent',      amount:85000,  type:'CASH_DEPOSIT', date:'2024-04-03', flagged:true },
  { id:'TXN003', from:'Mohammad Salim Q. (acc_003)', to:'Victim Arun K. Hegde',     amount:420000, type:'UPI_FRAUD', date:'2024-03-18', flagged:true },
  { id:'TXN004', from:'Naveen K. Patil (acc_011)',   to:'Cricket Betting Portal',   amount:155000, type:'ONLINE_TRANSFER', date:'2024-03-30', flagged:true },
  { id:'TXN005', from:'Rajesh P. Kamath (acc_008)',  to:'Shell Co. DK-Coastal',     amount:380000, type:'HAWALA', date:'2024-03-22', flagged:true },
  { id:'TXN006', from:'Farhan A. Sheikh (acc_013)',  to:'Fake Job Portal Account',  amount:1200000,type:'FRAUD_COLLECTION', date:'2024-04-20', flagged:true },
];

const MONTHLY = [
  { month:"Jan'24", hawala:420, fraud:310, cash:180 },
  { month:"Feb'24", hawala:380, fraud:290, cash:210 },
  { month:"Mar'24", hawala:510, fraud:480, cash:240 },
  { month:"Apr'24", hawala:620, fraud:590, cash:290 },
];

const TYPE_COLOR: Record<string, string> = {
  HAWALA: '#ef4444',
  CASH_DEPOSIT: '#f59e0b',
  UPI_FRAUD: '#a78bfa',
  ONLINE_TRANSFER: '#3b82f6',
  FRAUD_COLLECTION: '#f97316',
};

const TIP = {
  contentStyle: { background:'#0c1628', border:'1px solid #162844', borderRadius:'8px', fontSize:'12px' },
  labelStyle: { color:'#94a3b8' },
};

const NETWORK_NODES = [
  { id:'n1', label:'Prakash B.\nShetty',  x:310, y:80,  color:'#ef4444', r:22 },
  { id:'n2', label:'Ravi Kumar\nG.',       x:160, y:200, color:'#ef4444', r:18 },
  { id:'n3', label:'Rajesh P.\nKamath',   x:460, y:200, color:'#ef4444', r:18 },
  { id:'n4', label:'Hawala\nAgent MH',    x:120, y:330, color:'#f59e0b', r:14 },
  { id:'n5', label:'Shell Co.\nDK',       x:500, y:330, color:'#f59e0b', r:14 },
  { id:'n6', label:'Betting\nPortal',     x:310, y:310, color:'#a78bfa', r:14 },
  { id:'n7', label:'Fraud\nFront Acc.',   x:310, y:200, color:'#f97316', r:14 },
];
const NETWORK_EDGES = [
  { from:'n1', to:'n2', label:'₹2.4L', color:'#ef4444' },
  { from:'n1', to:'n3', label:'₹3.8L', color:'#ef4444' },
  { from:'n1', to:'n6', label:'₹1.2L', color:'#a78bfa' },
  { from:'n2', to:'n4', label:'₹0.85L', color:'#f59e0b' },
  { from:'n3', to:'n5', label:'₹3.8L', color:'#f59e0b' },
  { from:'n7', to:'n6', label:'₹12L', color:'#f97316' },
];

function getNode(id: string) { return NETWORK_NODES.find(n => n.id === id)!; }

export default function Financial() {
  useApp();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1" style={{ color:'var(--text-primary)' }}>
        Financial Crime & Transaction Analysis
      </h1>
      <p className="text-sm mb-5" style={{ color:'var(--text-muted)' }}>
        Money trails, suspicious transactions and hawala network detection — Karnataka 2024
      </p>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label:'Flagged Transactions', value:'₹24.8L', sub:'6 cases active',    icon:AlertTriangle, color:'#ef4444' },
          { label:'Hawala Volume',        value:'₹10.4L', sub:'Cross-state links', icon:Link,          color:'#f59e0b' },
          { label:'Fraud Collections',    value:'₹12.0L', sub:'3 accused linked',  icon:DollarSign,    color:'#a78bfa' },
          { label:'MoM Increase',         value:'+34%',   sub:'vs March 2024',     icon:TrendingUp,    color:'#22c55e' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 relative overflow-hidden"
               style={{ background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5"
                 style={{ background:`linear-gradient(90deg,${s.color},${s.color}00)` }} />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display tracking-widest mb-1.5"
                   style={{ color:'var(--text-muted)', fontSize:'9px' }}>
                  {s.label.toUpperCase()}
                </p>
                <p className="font-display font-bold text-2xl" style={{ color:s.color }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>{s.sub}</p>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                   style={{ background:`${s.color}12`, border:`1px solid ${s.color}28` }}>
                <s.icon size={16} style={{ color:s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Money trail SVG network */}
        <div className="col-span-2 rounded-xl overflow-hidden"
             style={{ background:'#080f1e', border:'1px solid #162844' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between"
               style={{ borderColor:'#162844' }}>
            <span className="font-display font-semibold text-white text-sm">Money Trail Network</span>
            <div className="flex items-center gap-3 text-xs" style={{ color:'#475569' }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Accused</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Agent/Shell</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Portal</span>
            </div>
          </div>
          <svg width="100%" height="380" viewBox="0 0 580 380" style={{ background:'#080f1e' }}>
            {/* Edges */}
            {NETWORK_EDGES.map((e, i) => {
              const f = getNode(e.from); const t = getNode(e.to);
              const mx = (f.x + t.x) / 2; const my = (f.y + t.y) / 2;
              return (
                <g key={i}>
                  <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                        stroke={e.color} strokeWidth="1.5" opacity="0.4" strokeDasharray="5 3" />
                  <text x={mx} y={my-6} fill="rgba(255,255,255,0.5)" fontSize="9"
                        textAnchor="middle" fontFamily="JetBrains Mono">{e.label}</text>
                </g>
              );
            })}
            {/* Nodes */}
            {NETWORK_NODES.map(n => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={n.r + 10} fill={n.color} opacity="0.06" />
                <circle cx={n.x} cy={n.y} r={n.r} fill={`${n.color}25`}
                        stroke={n.color} strokeWidth="1.5" />
                {n.label.split('\n').map((ln, i) => (
                  <text key={i} x={n.x} y={n.y + n.r + 12 + i * 11}
                        fill="rgba(255,255,255,0.75)" fontSize="9"
                        textAnchor="middle" fontFamily="DM Sans">{ln}</text>
                ))}
              </g>
            ))}
          </svg>
        </div>

        {/* Monthly volume chart */}
        <div className="rounded-xl p-4" style={{ background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
          <h3 className="font-display font-semibold text-sm mb-3" style={{ color:'var(--text-primary)' }}>
            Monthly Suspicious Volume (₹K)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill:'#475569', fontSize:9 }} />
              <YAxis tick={{ fill:'#475569', fontSize:9 }} />
              <Tooltip {...TIP} />
              <Bar dataKey="hawala" fill="#ef4444" radius={[3,3,0,0]} name="Hawala" stackId="a" />
              <Bar dataKey="fraud"  fill="#a78bfa" radius={[3,3,0,0]} name="Fraud"  stackId="a" />
              <Bar dataKey="cash"   fill="#f59e0b" radius={[3,3,0,0]} name="Cash"   stackId="a" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-3">
            {[['Hawala','#ef4444'],['Fraud','#a78bfa'],['Cash deposit','#f59e0b']].map(([l,c]) => (
              <div key={l} className="flex items-center gap-2 text-xs" style={{ color:'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background:c }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction table */}
      <div className="rounded-xl overflow-hidden"
           style={{ background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b"
             style={{ borderColor:'var(--border)' }}>
          <h3 className="font-display font-semibold text-sm" style={{ color:'var(--text-primary)' }}>
            Flagged Transactions
          </h3>
          <span className="font-mono text-xs text-red-400 px-2 py-0.5 rounded"
                style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)' }}>
            6 FLAGGED
          </span>
        </div>
        <div>
          {TRANSACTIONS.map((tx, i) => (
            <div key={tx.id}
                 className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                 style={{ borderBottom: i < TRANSACTIONS.length-1 ? '1px solid var(--border)' : 'none' }}>
              <div className="font-mono text-xs text-blue-300 shrink-0 w-20">{tx.id}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate" style={{ color:'var(--text-primary)' }}>
                  {tx.from}
                </div>
                <div className="text-xs mt-0.5 truncate" style={{ color:'var(--text-muted)' }}>
                  → {tx.to}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-sm font-bold" style={{ color:'#ef4444' }}>
                  ₹{(tx.amount/100000).toFixed(2)}L
                </div>
                <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{tx.date}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-mono shrink-0"
                    style={{
                      background:`${TYPE_COLOR[tx.type]}15`,
                      color: TYPE_COLOR[tx.type],
                      border:`1px solid ${TYPE_COLOR[tx.type]}30`,
                      fontSize:'9px',
                    }}>
                {tx.type.replace('_',' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}