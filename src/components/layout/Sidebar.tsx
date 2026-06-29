import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Network, Map,
  BarChart3, UserSearch, TrendingUp, LogOut,
  ChevronRight, DollarSign,
} from 'lucide-react';
import { useAuth, ROLE_CONFIGS } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { ShieldCheck } from 'lucide-react'; 

const NAV = [
  { to:'/dashboard', icon:LayoutDashboard, key:'nav.overview',  roles:['investigator','analyst','supervisor','policymaker'] },
  { to:'/chat',      icon:MessageSquare,   key:'nav.chat',       roles:['investigator','analyst','supervisor'] },
  { to:'/network',   icon:Network,         key:'nav.network',    roles:['investigator','analyst','supervisor'] },
  { to:'/heatmap',   icon:Map,             key:'nav.heatmap',    roles:['investigator','analyst','supervisor','policymaker'] },
  { to:'/analytics', icon:BarChart3,       key:'nav.analytics',  roles:['investigator','analyst','supervisor','policymaker'] },
  { to:'/profile',   icon:UserSearch,      key:'nav.profile',    roles:['investigator','analyst','supervisor'] },
  { to:'/forecast',  icon:TrendingUp,      key:'nav.forecast',   roles:['analyst','supervisor','policymaker'] },
  { to:'/financial', icon:DollarSign,      key:'nav.financial',  roles:['investigator','analyst','supervisor'] },
  { to:'/admin', icon:ShieldCheck, key:'nav.admin', roles:['supervisor'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useApp();
  if (!user) return null;
  const rc = ROLE_CONFIGS[user.role];
  const allowed = NAV.filter(n => n.roles.includes(user.role));

  return (
    <aside className="flex flex-col shrink-0 h-screen"
           style={{ width:'220px', background:'#020a16', borderRight:'1px solid #0c2040' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 shrink-0"
           style={{ borderBottom:'1px solid #0c2040' }}>
        <div className="relative shrink-0" style={{ width:36, height:36 }}>
          <div className="absolute inset-0 rounded-xl"
               style={{ background:'rgba(26,86,219,0.15)', border:'1px solid rgba(26,86,219,0.45)' }} />
          <img src="/ksp-logo.svg" alt="KSP"
               style={{ width:'100%', height:'100%', objectFit:'contain', padding:'3px', position:'relative', zIndex:1 }} />
        </div>
        <div>
          <div className="font-display font-bold text-white" style={{ fontSize:'13px', letterSpacing:'.06em' }}>
            KSP · CID
          </div>
          <div className="font-mono" style={{ color:'#1e4a6e', fontSize:'8px', letterSpacing:'.12em' }}>
            INTELLIGENCE SYSTEM
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="font-mono px-2 pb-2" style={{ color:'#1e4a6e', fontSize:'8px', letterSpacing:'.14em' }}>
          {t('nav.modules')}
        </div>
        {allowed.map(({ to, icon:Icon, key }) => (
          <NavLink key={to} to={to}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 transition-all duration-150 group"
            style={({ isActive }) => ({
              background: isActive ? 'rgba(26,86,219,0.2)' : 'transparent',
              border: isActive ? '1px solid rgba(26,86,219,0.35)' : '1px solid transparent',
              boxShadow: isActive ? '0 0 12px rgba(26,86,219,0.12)' : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={14}
                      style={{ color: isActive ? '#60a5fa' : '#2a5a8a',
                               transition:'color .15s' }}
                      className={!isActive ? 'group-hover:!text-blue-400' : ''} />
                <span className="font-body text-sm transition-colors"
                      style={{ color: isActive ? '#93c5fd' : '#3d6494' }}
                      onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.color = '#8eafd4'; }}
                      onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.color = '#3d6494'; }}>
                  {t(key)}
                </span>
                {isActive && <ChevronRight size={10} className="ml-auto text-blue-400 opacity-50" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status indicator */}
      <div className="mx-3 mb-3 px-3 py-2 rounded-xl"
           style={{ background:'rgba(5,150,105,0.08)', border:'1px solid rgba(5,150,105,0.2)' }}>
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="font-mono" style={{ color:'#10b981', fontSize:'9px', letterSpacing:'.08em' }}>
            SYSTEM ACTIVE
          </span>
        </div>
        <div className="font-mono mt-1" style={{ color:'#1e4a6e', fontSize:'8px' }}>
          KIRAN AI · Llama 3.3 70B
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4 shrink-0" style={{ borderTop:'1px solid #0c2040', paddingTop:'12px' }}>
        <div className="px-3 py-2.5 rounded-xl mb-2"
             style={{ background:`${rc.color}0f`, border:`1px solid ${rc.color}28` }}>
          <div className="font-display font-bold text-xs tracking-widest"
               style={{ color:rc.color, fontSize:'9px' }}>
            {rc.label.toUpperCase()}
          </div>
          <div className="font-medium text-sm text-white mt-0.5 truncate">{user.name}</div>
          <div className="font-mono" style={{ color:'#1e4a6e', fontSize:'9px', marginTop:'1px' }}>
            {user.badgeNumber}
          </div>
        </div>
        <button onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs transition-colors"
          style={{ color:'#1e4a6e' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={e => (e.currentTarget.style.color = '#1e4a6e')}>
          <LogOut size={11} /> {t('nav.signout')}
          
        </button>
      </div>
    </aside>
  );
}