import { Bell, Search, Sun, Moon, Languages } from 'lucide-react';
import { useAuth, ROLE_CONFIGS } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();
  if (!user) return null;
  const rc = ROLE_CONFIGS[user.role];

  return (
    <header
      className="flex items-center justify-between px-6 border-b shrink-0 transition-colors duration-300"
      style={{ height: '52px', borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
    >
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-sm">
        <Search size={13} style={{ color: 'var(--text-muted)' }} />
        <input
          className="bg-transparent text-sm outline-none w-full"
          placeholder={t('common.search')}
          style={{ color: 'var(--text-secondary)' }}
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">

        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          title="Toggle language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
          className="flex items-center gap-1.5 rounded-lg transition-all duration-200"
          style={{
            padding: '5px 10px',
            background: language === 'kn' ? 'rgba(245,158,11,0.12)' : 'var(--bg-elevated)',
            border: `1px solid ${language === 'kn' ? 'rgba(245,158,11,0.45)' : 'var(--border)'}`,
            color: language === 'kn' ? '#f59e0b' : 'var(--text-secondary)',
          }}
        >
          <Languages size={13} />
          {/* EN / KN pill slider */}
          <div
            className="flex rounded overflow-hidden"
            style={{
              background: 'rgba(0,0,0,0.2)',
              padding: '1px',
              gap: '1px',
            }}
          >
            <span
              className="font-mono transition-all duration-200"
              style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '3px',
                background: language === 'en' ? '#2563eb' : 'transparent',
                color: language === 'en' ? 'white' : 'var(--text-muted)',
              }}
            >
              EN
            </span>
            <span
              className="font-mono transition-all duration-200"
              style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '3px',
                background: language === 'kn' ? '#f59e0b' : 'transparent',
                color: language === 'kn' ? 'white' : 'var(--text-muted)',
              }}
            >
              ಕನ್ನಡ
            </span>
          </div>
        </button>

        {/* Theme toggle slider */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="flex items-center gap-2 rounded-lg transition-all duration-200"
          style={{
            padding: '5px 10px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          {/* Sliding pill track */}
          <div
            className="relative flex items-center rounded-full transition-all duration-300"
            style={{
              width: '40px',
              height: '20px',
              background: theme === 'dark' ? 'rgba(37,99,235,0.35)' : 'rgba(245,158,11,0.35)',
              border: `1px solid ${theme === 'dark' ? 'rgba(37,99,235,0.6)' : 'rgba(245,158,11,0.6)'}`,
              padding: '2px',
            }}
          >
            {/* Thumb */}
            <div
              className="absolute flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: '16px',
                height: '16px',
                background: theme === 'dark' ? '#2563eb' : '#f59e0b',
                left: theme === 'dark' ? '2px' : '22px',
                boxShadow: `0 0 6px ${theme === 'dark' ? 'rgba(37,99,235,0.7)' : 'rgba(245,158,11,0.7)'}`,
              }}
            >
              {theme === 'dark'
                ? <Moon size={8} style={{ color: 'white' }} />
                : <Sun size={8} style={{ color: 'white' }} />
              }
            </div>
          </div>
          <span style={{ fontSize: '11px', minWidth: '28px' }}>
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Bell */}
        <button
          className="relative p-1.5 rounded-lg"
          style={{ border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
        >
          <Bell size={14} style={{ color: 'var(--text-secondary)' }} />
          <span
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center font-mono"
            style={{ fontSize: '8px' }}
          >
            3
          </span>
        </button>

        {/* User badge */}
        <div
          className="flex items-center gap-2 pl-3 border-l"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold"
            style={{ background: rc.bgColor, color: rc.color, fontSize: '13px' }}
          >
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-medium truncate max-w-20" style={{ color: 'var(--text-primary)' }}>
              {user.name}
            </div>
            <div style={{ color: rc.color, fontSize: '10px' }}>{rc.label}</div>
          </div>
        </div>
      </div>
    </header>
  );
}