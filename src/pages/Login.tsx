import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, BarChart3, Globe, Eye } from 'lucide-react';
import { useAuth, ROLE_CONFIGS } from '../hooks/useAuth';
import type { UserRole } from '../types';
import { KARNATAKA_DISTRICTS } from '../data/mockData';

const ROLE_ICONS: Record<UserRole, React.ElementType> = {
  investigator: Search,
  analyst: BarChart3,
  supervisor: Eye,
  policymaker: Globe,
};

export default function Login() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleLogin = async () => {
    if (!role || !name.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    login(name.trim(), role, district);
    nav('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background: '#040a14' }}>

      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        animation: 'gridMove 24s linear infinite',
      }} />

      {/* Center radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.07) 0%, transparent 70%)',
      }} />

      {/* Scanline */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.4) 50%, transparent 100%)',
          animation: 'scanDown 10s linear infinite',
        }} />
      </div>

      {/* Corner decorations */}
      {[
        'top-8 left-8 border-t border-l',
        'top-8 right-8 border-t border-r',
        'bottom-8 left-8 border-b border-l',
        'bottom-8 right-8 border-b border-r',
      ].map((cls, i) => (
        <div key={i} className={`absolute w-8 h-8 ${cls} opacity-20`}
             style={{ borderColor: '#2563eb' }} />
      ))}

      {/* Main content */}
      <div className={`relative z-10 w-full max-w-2xl px-6 transition-all duration-700 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>

        {/* Header / Logo */}
        <div className="text-center mb-8">

          {/* Logo with orbital rings */}
          <div className="relative inline-flex items-center justify-center mb-5">
            {/* Outer ring */}
            <div className="absolute w-32 h-32 rounded-full animate-spin-slow"
                 style={{ border: '1px solid rgba(37,99,235,0.1)' }} />
            {/* Inner ring */}
            <div className="absolute w-24 h-24 rounded-full animate-spin-slowr"
                 style={{ border: '1px dashed rgba(37,99,235,0.15)' }} />
            {/* KSP Logo box */}
            <div className="relative rounded-2xl overflow-hidden flex items-center justify-center"
                 style={{
                   width: '72px',
                   height: '55px',
                   background: 'rgba(235, 237, 242, 0.08)',
                   border: '3px solid rgba(37,99,235,0.4)',
                   boxShadow: '0 0 35px rgba(37,99,235,0.3), 0 0 70px rgba(37,99,235,0.1)',
                   animation: 'glowPulse 3s ease-in-out infinite',
                 }}>
              <img
                src="/ksp-logo.svg"
                alt="Karnataka State Police Logo"
                style={{
                  width: '90%',
                  height: '90%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  filter: 'drop-shadow(0 0 6px rgba(147,197,253,0.4))',
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl font-bold text-white"
              style={{ textShadow: '0 0 40px rgba(37,99,235,0.25)', letterSpacing: '0.02em' }}>
            Karnataka State Police
          </h1>

          {/* Subtitle divider */}
          <div className="flex items-center justify-center gap-3 mt-2.5">
            <div className="h-px flex-1 max-w-16"
                 style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.5))' }} />
            <span className="font-display font-semibold tracking-widest"
                  style={{ color: '#60a5fa', fontSize: '10px', letterSpacing: '0.15em' }}>
              CRIME INTELLIGENCE PLATFORM · CID
            </span>
            <div className="h-px flex-1 max-w-16"
                 style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.5), transparent)' }} />
          </div>

          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Authorised personnel only — select your access role
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {(Object.entries(ROLE_CONFIGS) as [UserRole, typeof ROLE_CONFIGS[UserRole]][]).map(([r, cfg]) => {
            const Icon = ROLE_ICONS[r];
            const isSelected = role === r;
            return (
              <button key={r} onClick={() => setRole(r)}
                className="text-left p-4 rounded-xl transition-all duration-200 relative overflow-hidden group"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${cfg.color}20, ${cfg.color}08)`
                    : 'rgba(8,15,30,0.8)',
                  border: `1px solid ${isSelected ? cfg.color + '60' : 'rgba(22,40,68,0.8)'}`,
                  boxShadow: isSelected
                    ? `0 0 28px ${cfg.color}22, inset 0 1px 0 ${cfg.color}15`
                    : 'none',
                  backdropFilter: 'blur(12px)',
                }}>

                {/* Hover shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: `radial-gradient(ellipse at 20% 50%, ${cfg.color}0a 0%, transparent 65%)` }} />

                <div className="relative flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                       style={{
                         background: `${cfg.color}18`,
                         border: `1px solid ${cfg.color}35`,
                         boxShadow: isSelected ? `0 0 12px ${cfg.color}25` : 'none',
                       }}>
                    <Icon size={16} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-sm leading-tight"
                         style={{ color: isSelected ? cfg.color : 'var(--text-primary)' }}>
                      {cfg.label}
                    </div>
                    <p className="text-xs mt-1 leading-relaxed"
                       style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      {cfg.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cfg.access.slice(0, 3).map(a => (
                        <span key={a} className="font-mono px-1.5 py-0.5 rounded"
                              style={{
                                background: `${cfg.color}10`,
                                color: cfg.color,
                                border: `1px solid ${cfg.color}25`,
                                fontSize: '9px',
                              }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected dot */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full"
                       style={{
                         background: cfg.color,
                         boxShadow: `0 0 8px ${cfg.color}, 0 0 16px ${cfg.color}80`,
                         animation: 'dotPulse 2s ease-in-out infinite',
                       }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Input form — appears after role selected */}
        {role && (
          <div className="rounded-xl p-4 mb-4 animate-fade-slide"
               style={{
                 background: 'rgba(8,15,30,0.9)',
                 border: '1px solid var(--border)',
                 backdropFilter: 'blur(12px)',
               }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-display tracking-widest mb-1.5"
                       style={{ color: 'var(--text-muted)', fontSize: '9px', letterSpacing: '0.15em' }}>
                  OFFICER NAME
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${name ? 'rgba(37,99,235,0.5)' : 'var(--border)'}`,
                    color: 'var(--text-primary)',
                    boxShadow: name ? '0 0 10px rgba(37,99,235,0.1)' : 'none',
                  }}
                />
              </div>
              <div>
                <label className="block font-display tracking-widest mb-1.5"
                       style={{ color: 'var(--text-muted)', fontSize: '9px', letterSpacing: '0.15em' }}>
                  DISTRICT
                </label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {KARNATAKA_DISTRICTS.map(d => (
                    <option key={d} value={d} style={{ background: '#0c1628' }}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleLogin}
          disabled={!role || !name.trim() || loading}
          className="w-full py-3.5 rounded-xl font-display font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2.5 transition-all duration-300"
          style={{
            background: role && name.trim()
              ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
              : 'rgba(37,99,235,0.06)',
            color: role && name.trim() ? 'white' : 'var(--text-muted)',
            border: `1px solid ${role && name.trim()
              ? 'rgba(37,99,235,0.7)'
              : 'rgba(37,99,235,0.15)'}`,
            boxShadow: role && name.trim()
              ? '0 0 35px rgba(37,99,235,0.35), 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
              : 'none',
            cursor: role && name.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2.5">
              <span className="w-4 h-4 border-2 rounded-full border-white border-t-transparent"
                    style={{ animation: 'spin 0.7s linear infinite' }} />
              Authenticating...
            </span>
          ) : (
            <>
              <img
                src="/ksp-logo.svg"
                alt=""
                style={{ width: '16px', height: '16px', objectFit: 'contain',
                         filter: 'brightness(0) invert(1)' }}
              />
              Access Intelligence System
              <ChevronRight size={14} />
            </>
          )}
        </button>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                style={{ animation: 'dotPulse 2.5s ease-in-out infinite' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            Karnataka State Police · CID · Restricted Access
          </span>
        </div>

      </div>
    </div>
  );
}