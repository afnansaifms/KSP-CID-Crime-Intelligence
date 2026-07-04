import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Network, Map,
  BarChart3, UserSearch, TrendingUp, LogOut,
  ChevronRight, DollarSign, ShieldCheck,
} from 'lucide-react';
import { useAuth, ROLE_CONFIGS } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';

const NAV = [
  { to:'/dashboard', icon:LayoutDashboard, key:'nav.overview',  label:'Overview',          roles:['investigator','analyst','supervisor','policymaker'] },
  { to:'/chat',      icon:MessageSquare,   key:'nav.chat',       label:'Chat Intelligence', roles:['investigator','analyst','supervisor'] },
  { to:'/network',   icon:Network,         key:'nav.network',    label:'Criminal Networks', roles:['investigator','analyst','supervisor'] },
  { to:'/heatmap',   icon:Map,             key:'nav.heatmap',    label:'Crime Heatmap',     roles:['investigator','analyst','supervisor','policymaker'] },
  { to:'/analytics', icon:BarChart3,       key:'nav.analytics',  label:'Analytics',         roles:['investigator','analyst','supervisor','policymaker'] },
  { to:'/profile',   icon:UserSearch,      key:'nav.profile',    label:'Offender Profiles', roles:['investigator','analyst','supervisor'] },
  { to:'/forecast',  icon:TrendingUp,      key:'nav.forecast',   label:'Forecast',          roles:['analyst','supervisor','policymaker'] },
  { to:'/financial', icon:DollarSign,      key:'nav.financial',  label:'Financial Crime',   roles:['investigator','analyst','supervisor'] },
  { to:'/admin',     icon:ShieldCheck,     key:'nav.admin',      label:'Approvals',         roles:['supervisor'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useApp();
  if (!user) return null;
  const rc = ROLE_CONFIGS[user.role];
  const allowed = NAV.filter(n => n.roles.includes(user.role));

  return (
    <aside style={{
      width: '228px', flexShrink: 0, height: '100vh',
      background: '#050810',
      borderRight: '1px solid rgba(255,255,255,0.04)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Logo */}
      <div style={{
        padding: '20px 18px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
          background: 'rgba(79,70,229,0.15)',
          border: '1px solid rgba(79,70,229,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(79,70,229,0.2)',
        }}>
          <img src="/ksp-logo.svg" alt="KSP"
               style={{ width: 28, height: 28, objectFit: 'contain' }}
               onError={e => {
                 (e.target as HTMLImageElement).style.display = 'none';
                 (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
               }} />
        </div>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'#f1f5f9', letterSpacing:'.04em' }}>
            KSP · CID
          </div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(79,70,229,0.7)', letterSpacing:'.16em', marginTop:1 }}>
            KIRAN SYSTEM
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
        <div className="section-label" style={{ padding:'4px 10px 10px', color:'rgba(255,255,255,0.2)' }}>
          {t('nav.modules')}
        </div>
        {allowed.map(({ to, icon: Icon, key, label }) => (
          <NavLink key={to} to={to} style={{ textDecoration:'none', display:'block', marginBottom:2 }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                background: isActive ? 'rgba(79,70,229,0.18)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(79,70,229,0.35)' : 'transparent'}`,
                transition: 'all .15s',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                {isActive && (
                  <div style={{
                    position:'absolute', left:0, top:6, bottom:6, width:3,
                    background:'linear-gradient(180deg,#4f46e5,#06b6d4)',
                    borderRadius:'0 2px 2px 0',
                    boxShadow:'0 0 8px rgba(79,70,229,0.6)',
                  }} />
                )}
                <Icon size={15} style={{ color: isActive ? '#818cf8' : 'rgba(255,255,255,0.3)', flexShrink:0 }} />
                <span style={{
                  fontFamily:'var(--font-body)', fontSize:13, fontWeight:isActive?500:400,
                  color: isActive ? '#c7d2fe' : 'rgba(255,255,255,0.4)',
                }}>
                  {t(key) || label}
                </span>
                {isActive && <ChevronRight size={11} style={{ marginLeft:'auto', color:'rgba(129,140,248,0.5)' }} />}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System status */}
      <div style={{ padding:'10px 14px', margin:'0 10px 8px' }}>
        <div style={{
          padding:'10px 12px', borderRadius:8,
          background:'rgba(16,185,129,0.06)',
          border:'1px solid rgba(16,185,129,0.15)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4 }}>
            <span className="live-dot" style={{ width:6, height:6 }} />
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--green)', letterSpacing:'.1em' }}>
              SYSTEM ACTIVE
            </span>
          </div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.2)' }}>
            KIRAN · Llama 3.3 70B
          </div>
        </div>
      </div>

      {/* User */}
      <div style={{ padding:'10px 10px 14px', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{
          padding:'10px 12px', borderRadius:8,
          background:`${rc.color}0d`,
          border:`1px solid ${rc.color}22`,
          marginBottom:6,
        }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:rc.color, letterSpacing:'.1em', marginBottom:4 }}>
            {rc.label.toUpperCase()}
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:13, color:'#f1f5f9', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {user.name}
          </div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.2)', marginTop:2 }}>
            {user.badgeNumber}
          </div>
        </div>
        <button onClick={logout} style={{
          display:'flex', alignItems:'center', gap:7, width:'100%',
          padding:'7px 12px', borderRadius:6, border:'none', cursor:'pointer',
          background:'transparent', color:'rgba(255,255,255,0.25)',
          fontFamily:'var(--font-body)', fontSize:12,
          transition:'color .15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
          <LogOut size={12} /> {t('nav.signout')}
        </button>
      </div>
    </aside>
  );
} 