import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Sun, Moon, Languages, AlertTriangle, X, Check } from 'lucide-react';
import { useAuth, ROLE_CONFIGS } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { getPendingRegistrations } from '../../services/authStorage';

const TICKER_ALERTS = [
  '🔴 WARRANT: Lokesh S. Gowda — Murder accused — Last sighted Tumakuru',
  '🟡 SURGE: Cybercrime +34% this week — Electronic City zone',
  '🔴 ALERT: Drug batch movement detected — NH-75 Goa corridor',
  '🟡 GANG: Coastal extortion network active — Mangaluru',
  '🔴 MISSING: Prakash B. Shetty — Suspected Dubai — Lookout issued',
  '🟡 TREND: Bengaluru Urban robbery ↑14% — MG Road corridor 21:00–01:00',
];

const NOTIFS = [
  { id:'n1', title:'Active Warrant Alert', msg:'Lokesh S. Gowda — murder accused — last sighted Tumakuru.', type:'danger' as const, time:'2h ago', read:false },
  { id:'n2', title:'Cybercrime Surge', msg:'34% increase in UPI fraud — Electronic City this week.', type:'warning' as const, time:'4h ago', read:false },
  { id:'n3', title:'Drug Intelligence', msg:'New batch expected via NH-75 Goa corridor. Enhanced checks recommended.', type:'danger' as const, time:'6h ago', read:true },
  { id:'n4', title:'Network Movement', msg:'Rajesh P. Kamath associates active in Mangaluru coastal.', type:'warning' as const, time:'10h ago', read:true },
];

const TYPE_STYLES = {
  danger:  { color:'#ef4444', bg:'rgba(239,68,68,.08)',  border:'rgba(239,68,68,.2)'  },
  warning: { color:'#f59e0b', bg:'rgba(245,158,11,.08)', border:'rgba(245,158,11,.2)' },
  info:    { color:'#818cf8', bg:'rgba(79,70,229,.08)',  border:'rgba(79,70,229,.2)'  },
  success: { color:'#10b981', bg:'rgba(16,185,129,.08)', border:'rgba(16,185,129,.2)' },
};

export default function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();
  const [notifs, setNotifs] = useState(NOTIFS);
  const [showBell, setShowBell] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const rc = ROLE_CONFIGS[user?.role || 'investigator'];
  const pending = getPendingRegistrations().length;

  const allNotifs = user?.role === 'supervisor' && pending > 0
    ? [{ id:'reg', title:`${pending} Pending Registrations`, msg:`${pending} officer registration(s) awaiting your approval.`, type:'info' as const, time:'Now', read:false }, ...notifs]
    : notifs;

  const totalUnread = allNotifs.filter(n => !n.read).length;

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (bellRef.current && !bellRef.current.contains(e.target as Node)) setShowBell(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const ticker = [...TICKER_ALERTS, ...TICKER_ALERTS].join('      ·      ');

  if (!user) return null;

  return (
    <div style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', flexShrink:0 }}>

      {/* Alert ticker */}
      <div style={{
        display:'flex', alignItems:'center', gap:12, padding:'0 20px', height:28,
        background:'rgba(239,68,68,0.05)',
        borderBottom:'1px solid rgba(239,68,68,0.12)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
          <AlertTriangle size={10} style={{ color:'#ef4444' }} />
          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600, color:'#ef4444', letterSpacing:'.12em' }}>
            LIVE INTEL
          </span>
        </div>
        <div style={{ width:1, alignSelf:'stretch', background:'rgba(239,68,68,0.2)', flexShrink:0 }} />
        <div className="ticker-track" style={{ flex:1 }}>
          <span className="ticker-content" style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'rgba(248,113,113,0.8)' }}>
            {ticker}
          </span>
        </div>
      </div>

      {/* Main header */}
      <header style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 20px', height:52,
        background:'var(--bg-surface)',
      }}>

        {/* Search */}
        <div style={{
          display:'flex', alignItems:'center', gap:10, flex:1, maxWidth:420,
          padding:'8px 14px', borderRadius:8,
          background:'var(--bg-elevated)',
          border:'1px solid var(--border-dim)',
        }}>
          <Search size={13} style={{ color:'var(--text-muted)', flexShrink:0 }} />
          <input
            placeholder={t('common.search')}
            style={{
              background:'transparent', border:'none', outline:'none',
              fontFamily:'var(--font-body)', fontSize:13, color:'var(--text-secondary)',
              width:'100%',
            }} />
          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-muted)', flexShrink:0, letterSpacing:'.04em' }}>
            /
          </span>
        </div>

        {/* Controls */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>

          {/* Language */}
          <button onClick={toggleLanguage} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'6px 12px', borderRadius:7, cursor:'pointer',
            background: language==='kn' ? 'rgba(245,158,11,.1)' : 'var(--bg-elevated)',
            border: `1px solid ${language==='kn' ? 'rgba(245,158,11,.3)' : 'var(--border-dim)'}`,
            transition:'all .15s',
          }}>
            <Languages size={12} style={{ color: language==='kn' ? '#f59e0b' : 'var(--text-muted)' }} />
            <div style={{ display:'flex', gap:2 }}>
              {['EN','ಕನ್ನಡ'].map((lbl, i) => {
                const on = i===0 ? language==='en' : language==='kn';
                return (
                  <span key={lbl} style={{
                    fontFamily:'var(--font-mono)', fontSize:9, padding:'2px 6px', borderRadius:4,
                    background: on ? (i===0 ? 'var(--accent)' : '#f59e0b') : 'transparent',
                    color: on ? '#fff' : 'var(--text-muted)',
                    transition:'all .15s',
                  }}>{lbl}</span>
                );
              })}
            </div>
          </button>

          {/* Theme */}
          <button onClick={toggleTheme} style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'6px 12px', borderRadius:7, cursor:'pointer',
            background:'var(--bg-elevated)', border:'1px solid var(--border-dim)',
          }}>
            {/* Slider track */}
            <div style={{
              position:'relative', width:34, height:18, borderRadius:99,
              background: theme==='dark' ? 'rgba(79,70,229,.3)' : 'rgba(245,158,11,.3)',
              border: `1px solid ${theme==='dark' ? 'rgba(79,70,229,.5)' : 'rgba(245,158,11,.5)'}`,
              transition:'all .25s',
            }}>
              <div style={{
                position:'absolute', top:2, width:14, height:14, borderRadius:'50%',
                background: theme==='dark' ? 'var(--accent)' : '#f59e0b',
                left: theme==='dark' ? 2 : 18,
                transition:'all .25s',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:`0 0 8px ${theme==='dark'?'rgba(79,70,229,.8)':'rgba(245,158,11,.8)'}`,
              }}>
                {theme==='dark'
                  ? <Moon size={8} style={{ color:'#fff' }} />
                  : <Sun size={8} style={{ color:'#fff' }} />}
              </div>
            </div>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-muted)', minWidth:26 }}>
              {theme==='dark' ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* Bell */}
          <div style={{ position:'relative' }} ref={bellRef}>
            <button onClick={() => setShowBell(p => !p)} style={{
              position:'relative', padding:'7px 9px', borderRadius:7, cursor:'pointer',
              background: showBell ? 'var(--accent-dim)' : 'var(--bg-elevated)',
              border: `1px solid ${showBell ? 'rgba(79,70,229,.4)' : 'var(--border-dim)'}`,
              transition:'all .15s',
            }}>
              <Bell size={14} style={{ color: totalUnread>0 ? '#f59e0b' : 'var(--text-secondary)', display:'block' }} />
              {totalUnread > 0 && (
                <span style={{
                  position:'absolute', top:-4, right:-4,
                  background:'#ef4444', color:'#fff',
                  fontFamily:'var(--font-mono)', fontSize:8, fontWeight:700,
                  width:16, height:16, borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  border:'2px solid var(--bg-surface)',
                }}>{totalUnread}</span>
              )}
            </button>

            {/* Notification panel */}
            {showBell && (
              <div style={{
                position:'absolute', top:'calc(100% + 8px)', right:0, zIndex:999,
                width:360, borderRadius:12, overflow:'hidden',
                background:'var(--bg-elevated)',
                border:'1px solid var(--border-mid)',
                boxShadow:'0 24px 64px rgba(0,0,0,0.6)',
              }} className="anim-fade-up">
                <div style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'14px 16px',
                  borderBottom:'1px solid var(--border-dim)',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <Bell size={13} style={{ color:'#f59e0b' }} />
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:13, color:'var(--text-primary)' }}>
                      Intelligence Alerts
                    </span>
                    {totalUnread > 0 && (
                      <span className="pill pill-red">{totalUnread} new</span>
                    )}
                  </div>
                  <button onClick={() => setNotifs(ns => ns.map(n => ({...n, read:true})))}
                    style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:'var(--text-muted)', fontSize:11, fontFamily:'var(--font-body)' }}>
                    <Check size={10} /> Mark read
                  </button>
                </div>

                <div style={{ maxHeight:340, overflowY:'auto' }}>
                  {allNotifs.map(n => {
                    const sty = TYPE_STYLES[n.type];
                    return (
                      <div key={n.id} style={{
                        display:'flex', gap:12, padding:'12px 16px',
                        borderBottom:'1px solid var(--border-dim)',
                        background: n.read ? 'transparent' : 'rgba(79,70,229,0.03)',
                        transition:'background .15s', cursor:'default',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(79,70,229,0.03)')}>
                        {!n.read && (
                          <div style={{
                            position:'absolute', left:8,
                            width:4, height:4, borderRadius:'50%', background:sty.color,
                            marginTop:6,
                          }} />
                        )}
                        <div style={{
                          width:32, height:32, borderRadius:8, flexShrink:0,
                          background:sty.bg, border:`1px solid ${sty.border}`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          <AlertTriangle size={13} style={{ color:sty.color }} />
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                            <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:12, color:'var(--text-primary)' }}>
                              {n.title}
                            </span>
                            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-muted)', flexShrink:0, marginLeft:8 }}>
                              {n.time}
                            </span>
                          </div>
                          <p style={{ fontFamily:'var(--font-body)', fontSize:11, color:'var(--text-muted)', margin:0, lineHeight:1.5 }}>
                            {n.msg}
                          </p>
                        </div>
                        <button onClick={() => setNotifs(ns => ns.filter(x => x.id !== n.id))}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:2, flexShrink:0, opacity:0, transition:'opacity .15s' }}
                          onMouseEnter={e => (e.currentTarget.style.opacity='1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity='0')}>
                          <X size={11} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding:'10px 16px', borderTop:'1px solid var(--border-dim)', textAlign:'center' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-muted)' }}>
                    Karnataka State Police · KIRAN Intelligence Feed
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User badge */}
          <div style={{
            display:'flex', alignItems:'center', gap:9,
            paddingLeft:12, borderLeft:'1px solid var(--border-dim)',
          }}>
            <div style={{
              width:30, height:30, borderRadius:8,
              background:`${rc.color}18`, color:rc.color,
              border:`1px solid ${rc.color}30`,
              fontFamily:'var(--font-display)', fontWeight:700, fontSize:12,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {user.name[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily:'var(--font-body)', fontWeight:500, fontSize:12, color:'var(--text-primary)', maxWidth:80, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:rc.color }}>
                {rc.label}
              </div>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}