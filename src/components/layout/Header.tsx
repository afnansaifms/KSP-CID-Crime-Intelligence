import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Sun, Moon, Languages, AlertTriangle, X, Check } from 'lucide-react';
import { useAuth, ROLE_CONFIGS } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { getPendingRegistrations } from '../../services/authStorage';

const ALERTS_TICKER = [
  '🔴 WARRANT: Lokesh S. Gowda — Murder accused — Last sighted Tumakuru',
  '🟡 SURGE: Cybercrime +34% this week — Electronic City zone',
  '🔴 ALERT: Drug batch movement detected — NH-75 Goa corridor',
  '🟡 GANG: Coastal extortion network active — Mangaluru',
  '🔴 MISSING: Prakash B. Shetty — Suspected Dubai — Lookout issued',
];

interface NotifItem {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  time: string;
  read: boolean;
}

const STATIC_NOTIFS: NotifItem[] = [
  { id:'n1', title:'Active Warrant Alert', message:'Lokesh S. Gowda (acc_010) — murder accused — last sighted Tumakuru. Coordinate with district units.', type:'danger', time:'2h ago', read:false },
  { id:'n2', title:'Cybercrime Surge', message:'34% increase in UPI fraud complaints in Electronic City zone this week.', type:'warning', time:'4h ago', read:false },
  { id:'n3', title:'Drug Intelligence', message:'New synthetic drug batch expected via NH-75 Goa corridor. Enhanced checks recommended.', type:'danger', time:'6h ago', read:false },
  { id:'n4', title:'Network Movement', message:'Rajesh P. Kamath associates active in Mangaluru coastal area.', type:'warning', time:'10h ago', read:true },
  { id:'n5', title:'Case Update', message:'FIR BLR/KOR/2024/1847 — Charge sheet filed by SI Venkatesh Kumar.', type:'success', time:'1d ago', read:true },
];

const TYPE_COLOR = {
  danger:  { color:'#ef4444', bg:'rgba(239,68,68,0.1)',  border:'rgba(239,68,68,0.25)'  },
  warning: { color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.25)' },
  info:    { color:'#60a5fa', bg:'rgba(96,165,250,0.1)', border:'rgba(96,165,250,0.25)' },
  success: { color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.25)' },
};

export default function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();
  const [notifs, setNotifs]       = useState<NotifItem[]>(STATIC_NOTIFS);
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  if (!user) return null;

  const rc = ROLE_CONFIGS[user.role];
  const ticker = [...ALERTS_TICKER, ...ALERTS_TICKER].join('     ·     ');
  const pending = getPendingRegistrations().length;

  // Add pending registration notification for supervisors
  const allNotifs: NotifItem[] = user.role === 'supervisor' && pending > 0
    ? [{ id:'reg', title:`${pending} Pending Registrations`, message:`${pending} officer registration request(s) awaiting your approval.`, type:'info', time:'Now', read:false }, ...notifs]
    : notifs;

  const totalUnread = allNotifs.filter(n => !n.read).length;

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read:true })));
  const dismiss = (id: string) => setNotifs(ns => ns.filter(n => n.id !== id));

  return (
    <div style={{ borderBottom:'1px solid #0c2040' }}>

      {/* Ticker */}
      <div className="flex items-center gap-3 px-4"
           style={{ background:'rgba(220,38,38,0.06)', borderBottom:'1px solid rgba(220,38,38,0.15)', height:'28px' }}>
        <div className="flex items-center gap-1.5 shrink-0">
          <AlertTriangle size={10} style={{ color:'#ef4444' }} />
          <span className="font-mono font-bold" style={{ color:'#ef4444', fontSize:'9px', letterSpacing:'.1em' }}>LIVE ALERTS</span>
        </div>
        <div className="w-px self-stretch shrink-0" style={{ background:'rgba(220,38,38,0.3)' }} />
        <div className="ticker-wrap">
          <div className="ticker-inner font-mono" style={{ color:'#f87171', fontSize:'10px' }}>
            {ticker}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ticker}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="flex items-center justify-between px-5 shrink-0"
              style={{ height:'48px', background:'var(--bg-surface)' }}>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search size={13} style={{ color:'var(--text-muted)' }} />
          <input className="bg-transparent text-sm outline-none w-full"
                 placeholder={t('common.search')}
                 style={{ color:'var(--text-secondary)', fontFamily:'DM Sans' }} />
        </div>

        <div className="flex items-center gap-2">

          {/* Language toggle */}
          <button onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg transition-all"
            style={{ padding:'5px 10px',
                     background: language==='kn' ? 'rgba(245,158,11,0.1)' : 'var(--bg-elevated)',
                     border:`1px solid ${language==='kn' ? 'rgba(245,158,11,0.4)' : 'var(--border)'}` }}>
            <Languages size={12} style={{ color: language==='kn' ? '#f59e0b' : 'var(--text-muted)' }} />
            <div className="flex rounded overflow-hidden"
                 style={{ background:'rgba(0,0,0,0.2)', padding:'1px', gap:'1px' }}>
              {['EN','ಕನ್ನಡ'].map((lbl,i) => {
                const active = i===0 ? language==='en' : language==='kn';
                return (
                  <span key={lbl} className="font-mono transition-all"
                        style={{ fontSize:'9px', padding:'1px 5px', borderRadius:'2px',
                                 background: active ? (i===0?'#1a56db':'#f59e0b') : 'transparent',
                                 color: active ? 'white' : 'var(--text-muted)' }}>
                    {lbl}
                  </span>
                );
              })}
            </div>
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="flex items-center gap-2 rounded-lg transition-all"
            style={{ padding:'5px 10px', background:'var(--bg-elevated)', border:'1px solid var(--border)' }}>
            <div className="relative flex items-center rounded-full"
                 style={{ width:'36px', height:'18px', padding:'2px',
                          background: theme==='dark' ? 'rgba(26,86,219,0.3)' : 'rgba(245,158,11,0.3)',
                          border:`1px solid ${theme==='dark' ? 'rgba(26,86,219,0.5)' : 'rgba(245,158,11,0.5)'}` }}>
              <div className="absolute flex items-center justify-center rounded-full transition-all duration-300"
                   style={{ width:'14px', height:'14px',
                            background: theme==='dark' ? '#1a56db' : '#f59e0b',
                            left: theme==='dark' ? '2px' : '20px',
                            boxShadow:`0 0 6px ${theme==='dark'?'rgba(26,86,219,0.7)':'rgba(245,158,11,0.7)'}` }}>
                {theme==='dark' ? <Moon size={8} style={{ color:'white' }} />
                                : <Sun  size={8} style={{ color:'white' }} />}
              </div>
            </div>
            <span className="font-mono" style={{ fontSize:'10px', color:'var(--text-muted)', minWidth:'28px' }}>
              {theme==='dark' ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* Bell + notification panel */}
          <div className="relative" ref={panelRef}>
            <button onClick={() => setShowPanel(p => !p)}
              className="relative p-1.5 rounded-lg transition-all"
              style={{ border:`1px solid ${showPanel ? 'rgba(26,86,219,0.4)' : 'var(--border)'}`,
                       background: showPanel ? 'rgba(26,86,219,0.12)' : 'var(--bg-elevated)' }}>
              <Bell size={14} style={{ color: totalUnread > 0 ? '#f59e0b' : 'var(--text-secondary)' }} />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center font-mono"
                      style={{ fontSize:'8px' }}>
                  {totalUnread}
                </span>
              )}
            </button>

            {/* Dropdown panel */}
            {showPanel && (
              <div className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden animate-fade-up z-50"
                   style={{ width:'360px', background:'var(--bg-surface)',
                            border:'1px solid var(--border)',
                            boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>

                {/* Panel header */}
                <div className="flex items-center justify-between px-4 py-3"
                     style={{ borderBottom:'1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <Bell size={13} style={{ color:'#f59e0b' }} />
                    <span className="font-display font-semibold text-white text-sm">
                      Intelligence Alerts
                    </span>
                    {totalUnread > 0 && (
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                            style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444',
                                     border:'1px solid rgba(239,68,68,0.3)', fontSize:'9px' }}>
                        {totalUnread} NEW
                      </span>
                    )}
                  </div>
                  <button onClick={markAllRead}
                    className="text-xs flex items-center gap-1 transition-colors"
                    style={{ color:'var(--text-muted)' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#60a5fa')}
                    onMouseLeave={e=>(e.currentTarget.style.color='var(--text-muted)')}>
                    <Check size={10} /> Mark all read
                  </button>
                </div>

                {/* Notification list */}
                <div style={{ maxHeight:'380px', overflowY:'auto' }}>
                  {allNotifs.map(n => {
                    const sty = TYPE_COLOR[n.type];
                    return (
                      <div key={n.id}
                           className="flex gap-3 px-4 py-3 transition-colors relative"
                           style={{
                             borderBottom:'1px solid var(--border)',
                             background: n.read ? 'transparent' : 'rgba(26,86,219,0.04)',
                           }}
                           onMouseEnter={e=>(e.currentTarget.style.background='rgba(26,86,219,0.06)')}
                           onMouseLeave={e=>(e.currentTarget.style.background=n.read?'transparent':'rgba(26,86,219,0.04)')}>
                        {/* Unread dot */}
                        {!n.read && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                               style={{ background:sty.color }} />
                        )}
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                             style={{ background:sty.bg, border:`1px solid ${sty.border}` }}>
                          <AlertTriangle size={13} style={{ color:sty.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-display font-semibold text-white" style={{ fontSize:'12px' }}>
                              {n.title}
                            </span>
                            <span className="font-mono text-xs shrink-0 ml-2"
                                  style={{ color:'var(--text-muted)', fontSize:'9px' }}>
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color:'var(--text-muted)' }}>
                            {n.message}
                          </p>
                          {n.id === 'reg' && (
                            <a href="/admin"
                               className="inline-flex items-center gap-1 mt-1.5 text-xs transition-colors"
                               style={{ color:'#60a5fa' }}>
                              Review now →
                            </a>
                          )}
                        </div>
                        <button onClick={() => dismiss(n.id)}
                          className="shrink-0 p-0.5 rounded opacity-0 transition-opacity"
                          style={{ color:'var(--text-muted)' }}
                          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity='1'; (e.currentTarget as HTMLElement).style.color='#ef4444';}}
                          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity='0';}}>
                          <X size={11} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5" style={{ borderTop:'1px solid var(--border)' }}>
                  <p className="text-xs text-center" style={{ color:'var(--text-muted)' }}>
                    Karnataka State Police · Real-time intelligence feed
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User badge */}
          <div className="flex items-center gap-2 pl-3" style={{ borderLeft:'1px solid var(--border)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold"
                 style={{ background:`${rc.color}18`, color:rc.color,
                          border:`1px solid ${rc.color}30`, fontSize:'12px' }}>
              {user.name[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-xs truncate" style={{ color:'var(--text-primary)', maxWidth:'80px' }}>
                {user.name}
              </div>
              <div style={{ color:rc.color, fontSize:'9px', fontFamily:'JetBrains Mono' }}>{rc.label}</div>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}