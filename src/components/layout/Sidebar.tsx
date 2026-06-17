import { NavLink, useNavigate } from 'react-router-dom'; // 1. Added useNavigate here
import {
  LayoutDashboard, MessageSquare, Network, Map,
  BarChart3, UserSearch, TrendingUp, LogOut, ChevronRight,
} from 'lucide-react';
import { useAuth, ROLE_CONFIGS } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { DollarSign } from 'lucide-react';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'nav.overview',  roles: ['investigator','analyst','supervisor','policymaker'] },
  { to: '/chat',      icon: MessageSquare,   key: 'nav.chat',       roles: ['investigator','analyst','supervisor'] },
  { to: '/network',   icon: Network,         key: 'nav.network',    roles: ['investigator','analyst','supervisor'] },
  { to: '/heatmap',   icon: Map,             key: 'nav.heatmap',    roles: ['investigator','analyst','supervisor','policymaker'] },
  { to: '/analytics', icon: BarChart3,       key: 'nav.analytics',  roles: ['investigator','analyst','supervisor','policymaker'] },
  { to: '/profile',   icon: UserSearch,      key: 'nav.profile',    roles: ['investigator','analyst','supervisor'] },
  { to: '/forecast',  icon: TrendingUp,      key: 'nav.forecast',   roles: ['analyst','supervisor','policymaker'] },
  { to:'/financial', icon:DollarSign, key:'nav.financial', roles:['investigator','analyst','supervisor'] },
];

export default function Sidebar() {
  const navigate = useNavigate(); // 2. Initialized navigate hook here
  const { user, logout } = useAuth();
  const { t } = useApp();
  if (!user) return null;
  const rc = ROLE_CONFIGS[user.role];
  const allowed = NAV.filter(n => n.roles.includes(user.role));

  // 3. Created a handleLogout function to call logout and then redirect
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="flex flex-col w-56 shrink-0 h-screen border-r"
           style={{ background: '#060c1a', borderColor: '#162844' }}>

      {/* Logo */}
<div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#162844' }}>
  <div className="shrink-0 rounded-lg overflow-hidden"
       style={{ width: '36px', height: '36px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.3)' }}>
    <img
      src="/ksp-logo.svg"
      alt="KSP Logo"
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
    />
  </div>
  <div>
    <div className="font-display font-bold text-sm text-white tracking-wide">KSP · CID</div>
    <div className="font-mono" style={{ color: '#475569', fontSize: '9px', letterSpacing: '0.1em' }}>
      CRIME INTELLIGENCE
    </div>
  </div>
</div>
      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        <p className="font-display tracking-widest px-3 pb-2 pt-1"
           style={{ fontSize: '30px', color: '#1b4b8d' }}>
          {t('nav.modules')}
        </p>
        {allowed.map(({ to, icon: Icon, key }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all duration-150 group ${
                isActive ? '' : 'text-slate-400 hover:text-slate-200'
              }`
            }
            style={({ isActive }) => isActive
              ? { background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.3)', color: '#93c5fd' }
              : { border: '1px solid transparent' }
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="font-body text-sm">{t(key)}</span>
                {isActive && <ChevronRight size={11} className="ml-auto text-blue-400 opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: '#162844' }}>
        <div className="rounded-lg px-3 py-2 mb-2"
             style={{ background: rc.bgColor, border: `1px solid ${rc.color}33` }}>
          <div className="font-display tracking-wide text-xs" style={{ color: rc.color }}>
            {rc.label.toUpperCase()}
          </div>
          <div className="text-white text-sm font-medium mt-0.5 truncate">{user.name}</div>
          <div className="font-mono text-xs mt-0.5" style={{ color: '#475569' }}>{user.badgeNumber}</div>
        </div>
        {/* 4. Updated onClick to use handleLogout */}
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-1.5 rounded text-xs transition-colors hover:text-red-400"
          style={{ color: '#475569' }}>
          <LogOut size={12} /> {t('nav.signout')}
        </button>
      </div>
    </aside>
  );
}
