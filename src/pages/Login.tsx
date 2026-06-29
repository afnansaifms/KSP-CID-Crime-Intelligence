import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, LogIn, ArrowLeft, Shield, Check, AlertTriangle,
} from 'lucide-react';
import { useAuth, ROLE_CONFIGS } from '../hooks/useAuth';
import type { UserRole } from '../types';
import { KARNATAKA_DISTRICTS } from '../data/mockData';
import { loginUser, submitRegistration, emailExists } from '../services/authStorage';


type View = 'home' | 'login' | 'register' | 'pending';

export default function Login() {
  const [view, setView]       = useState<View>('home');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [] = useState('');

  // Login fields
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regName, setRegName]       = useState('');
  const [regEmail, setRegEmail]     = useState('');
  const [regPass, setRegPass]       = useState('');
  const [regRole, setRegRole]       = useState<UserRole>('investigator');
  const [regDistrict, setRegDistrict] = useState('Bengaluru Urban');
  const [regDept, setRegDept]       = useState('');
  const [regPhone, setRegPhone]     = useState('');

  const { login } = useAuth();
  const nav = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter email and password'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));
    const result = loginUser(email, password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    const u = result.user;
    login(u.name, u.role, u.district);
    nav('/dashboard');
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPass || !regDept || !regPhone) {
      setError('All fields are required'); return;
    }
    if (regPass.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (emailExists(regEmail)) { setError('This email is already registered'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 800));
    submitRegistration({
      name: regName, email: regEmail, password: regPass,
      role: regRole, district: regDistrict,
      department: regDept, phone: regPhone,
      badgeNumber: '',
    });
    setLoading(false);
    setView('pending');
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(26,86,219,0.25)',
    color: 'var(--text-primary)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
  };

  const labelStyle = {
    color: 'var(--text-muted)',
    fontSize: '9px',
    fontFamily: 'JetBrains Mono',
    letterSpacing: '.14em',
    display: 'block',
    marginBottom: '6px',
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background:'#040d1a' }}>

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`linear-gradient(rgba(26,86,219,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,219,0.05) 1px,transparent 1px)`,
        backgroundSize:'40px 40px',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(26,86,219,0.07) 0%,transparent 70%)',
      }} />

      {/* Scanline */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position:'absolute',left:0,right:0,height:'2px',
          background:'linear-gradient(90deg,transparent,rgba(26,86,219,0.5),transparent)',
          animation:'scanLine 8s linear infinite',
        }} />
      </div>

      {/* Corner marks */}
      {['top-6 left-6 border-t border-l','top-6 right-6 border-t border-r',
        'bottom-6 left-6 border-b border-l','bottom-6 right-6 border-b border-r'].map((cls,i)=>(
        <div key={i} className={`absolute w-6 h-6 ${cls} opacity-20`}
             style={{ borderColor:'#1a56db' }} />
      ))}

      <div className={`relative z-10 w-full px-6 transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`} style={{ maxWidth: view==='register' ? '680px' : '480px' }}>

        {/* Logo always visible */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute w-28 h-28 rounded-full animate-spin-slow"
                 style={{ border:'1px solid rgba(26,86,219,0.1)' }} />
            <div className="absolute w-20 h-20 rounded-full animate-spin-slowr"
                 style={{ border:'1px dashed rgba(26,86,219,0.15)' }} />
            <div className="relative rounded-2xl overflow-hidden flex items-center justify-center"
                 style={{ width:'64px',height:'64px',background:'rgba(26,86,219,0.08)',
                          border:'1px solid rgba(26,86,219,0.4)',
                          boxShadow:'0 0 30px rgba(26,86,219,0.3)',
                          animation:'glowPulse 3s ease-in-out infinite' }}>
              <img src="/ksp-logo.svg" alt="KSP"
                   style={{ width:'90%',height:'90%',objectFit:'contain',
                            filter:'drop-shadow(0 0 6px rgba(96,165,250,0.4))' }} />
            </div>
          </div>
          <h1 className="font-display font-bold text-white" style={{ fontSize:'26px',letterSpacing:'.02em' }}>
            Karnataka State Police
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px flex-1 max-w-12" style={{ background:'linear-gradient(90deg,transparent,rgba(26,86,219,0.5))' }} />
            <span className="font-mono font-semibold" style={{ color:'#60a5fa',fontSize:'9px',letterSpacing:'.15em' }}>
              CRIME INTELLIGENCE PLATFORM · CID
            </span>
            <div className="h-px flex-1 max-w-12" style={{ background:'linear-gradient(90deg,rgba(26,86,219,0.5),transparent)' }} />
          </div>
        </div>

        {/* ── HOME VIEW ── */}
        {view === 'home' && (
          <div className="space-y-3 animate-fade-up">
            <p className="text-center text-sm mb-4" style={{ color:'var(--text-muted)' }}>
              Authorised Karnataka Police personnel only
            </p>
            <button onClick={() => setView('login')}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-display font-bold tracking-wider uppercase text-sm transition-all"
              style={{ background:'linear-gradient(135deg,#1a56db,#1344b0)',
                       color:'white', border:'1px solid rgba(26,86,219,0.5)',
                       boxShadow:'0 0 30px rgba(26,86,219,0.3)',fontSize:'13px',letterSpacing:'.06em' }}>
              <LogIn size={16} /> Sign In to KIRAN
            </button>
            <button onClick={() => setView('register')}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-display font-bold tracking-wider uppercase text-sm transition-all"
              style={{ background:'rgba(26,86,219,0.08)', color:'#8eafd4',
                       border:'1px solid rgba(26,86,219,0.2)', fontSize:'13px', letterSpacing:'.06em' }}>
              <UserPlus size={16} /> Request Access
            </button>
            <div className="flex items-center gap-2 mt-4 p-3 rounded-xl"
                 style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)' }}>
              <AlertTriangle size={12} style={{ color: '#f59e0b' }}/>
              <p className="text-xs" style={{ color:'#92680a' }}>
                New registrations require approval from the CID Chief before access is granted.
              </p>
            </div>
            <p className="text-center text-xs mt-3" style={{ color:'var(--text-muted)' }}>
              Demo: <span className="font-mono" style={{ color:'#60a5fa' }}>chief@ksp.gov.in</span> / <span className="font-mono" style={{ color:'#60a5fa' }}>KSP@Chief2024</span>
            </p>
          </div>
        )}

        {/* ── LOGIN VIEW ── */}
        {view === 'login' && (
          <div className="animate-fade-up">
            <button onClick={() => { setView('home'); setError(''); }}
              className="flex items-center gap-1.5 text-xs mb-5 transition-colors"
              style={{ color:'var(--text-muted)' }}
              onMouseEnter={e=>(e.currentTarget.style.color='#60a5fa')}
              onMouseLeave={e=>(e.currentTarget.style.color='var(--text-muted)')}>
              <ArrowLeft size={12} /> Back
            </button>

            <div className="rounded-2xl p-6 space-y-4"
                 style={{ background:'rgba(7,21,37,0.9)', border:'1px solid rgba(26,86,219,0.2)',
                          backdropFilter:'blur(16px)' }}>
              <h2 className="font-display font-bold text-white" style={{ fontSize:'18px' }}>
                Officer Sign In
              </h2>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg"
                     style={{ background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.25)' }}>
                  <AlertTriangle size={13} style={{ color:'#ef4444' }} />
                  <span className="text-sm" style={{ color:'#fca5a5' }}>{error}</span>
                </div>
              )}

              <div>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="officer@ksp.gov.in" style={inputStyle}
                  onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
              </div>
              <div>
                <label style={labelStyle}>PASSWORD</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••" style={inputStyle}
                  onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
              </div>

              <button onClick={handleLogin} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold transition-all"
                style={{ background:'linear-gradient(135deg,#1a56db,#1344b0)', color:'white',
                         border:'1px solid rgba(26,86,219,0.5)',
                         boxShadow:'0 0 24px rgba(26,86,219,0.3)', fontSize:'13px',
                         letterSpacing:'.06em', cursor:loading?'not-allowed':'pointer' }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 rounded-full border-white border-t-transparent" style={{ animation:'spin .7s linear infinite' }}/> Authenticating...</>
                  : <><LogIn size={14}/> ACCESS KIRAN SYSTEM</>}
              </button>

              <p className="text-center text-xs" style={{ color:'var(--text-muted)' }}>
                Don't have access?{' '}
                <button onClick={() => { setView('register'); setError(''); }}
                  className="transition-colors" style={{ color:'#60a5fa' }}>
                  Request registration
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ── REGISTER VIEW ── */}
        {view === 'register' && (
          <div className="animate-fade-up">
            <button onClick={() => { setView('home'); setError(''); }}
              className="flex items-center gap-1.5 text-xs mb-5 transition-colors"
              style={{ color:'var(--text-muted)' }}
              onMouseEnter={e=>(e.currentTarget.style.color='#60a5fa')}
              onMouseLeave={e=>(e.currentTarget.style.color='var(--text-muted)')}>
              <ArrowLeft size={12} /> Back
            </button>

            <div className="rounded-2xl p-6"
                 style={{ background:'rgba(7,21,37,0.9)', border:'1px solid rgba(26,86,219,0.2)',
                          backdropFilter:'blur(16px)' }}>
              <h2 className="font-display font-bold text-white mb-1" style={{ fontSize:'18px' }}>
                Request System Access
              </h2>
              <p className="text-xs mb-5" style={{ color:'var(--text-muted)' }}>
                Your registration will be reviewed and approved by the CID Chief
              </p>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg mb-4"
                     style={{ background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.25)' }}>
                  <AlertTriangle size={13} style={{ color:'#ef4444' }} />
                  <span className="text-sm" style={{ color:'#fca5a5' }}>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>FULL NAME</label>
                  <input value={regName} onChange={e=>setRegName(e.target.value)}
                    placeholder="Officer full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>OFFICIAL EMAIL</label>
                  <input type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)}
                    placeholder="officer@ksp.gov.in" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>PASSWORD</label>
                  <input type="password" value={regPass} onChange={e=>setRegPass(e.target.value)}
                    placeholder="Min 8 characters" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>PHONE NUMBER</label>
                  <input value={regPhone} onChange={e=>setRegPhone(e.target.value)}
                    placeholder="9XXXXXXXXX" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>ACCESS ROLE</label>
                  <select value={regRole} onChange={e=>setRegRole(e.target.value as UserRole)}
                    style={{ ...inputStyle, cursor:'pointer' }}>
                    {Object.entries(ROLE_CONFIGS).map(([r,cfg])=>(
                      <option key={r} value={r} style={{ background:'#071525' }}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>DISTRICT</label>
                  <select value={regDistrict} onChange={e=>setRegDistrict(e.target.value)}
                    style={{ ...inputStyle, cursor:'pointer' }}>
                    {KARNATAKA_DISTRICTS.map(d=>(
                      <option key={d} value={d} style={{ background:'#071525' }}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label style={labelStyle}>DEPARTMENT / UNIT</label>
                  <input value={regDept} onChange={e=>setRegDept(e.target.value)}
                    placeholder="e.g. Crime Investigation Department, Cyber Crime Cell"
                    style={inputStyle} />
                </div>
              </div>

              <div className="flex items-start gap-2 mt-4 p-3 rounded-xl"
                   style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.18)' }}>
                <Shield size={12} style={{ color:'#f59e0b', marginTop:'1px', flexShrink:0 }} />
                <p className="text-xs" style={{ color:'#92680a' }}>
                  All registrations are subject to verification by the CID Chief. False information will result in disciplinary action.
                </p>
              </div>

              <button onClick={handleRegister} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold mt-4 transition-all"
                style={{ background:'rgba(26,86,219,0.15)', color:'#93c5fd',
                         border:'1px solid rgba(26,86,219,0.35)', fontSize:'13px',
                         letterSpacing:'.06em', cursor:loading?'not-allowed':'pointer' }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 rounded-full border-blue-400 border-t-transparent" style={{ animation:'spin .7s linear infinite' }}/> Submitting...</>
                  : <><UserPlus size={14}/> SUBMIT REGISTRATION REQUEST</>}
              </button>
            </div>
          </div>
        )}

        {/* ── PENDING VIEW ── */}
        {view === 'pending' && (
          <div className="animate-fade-up text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background:'rgba(5,150,105,0.15)', border:'2px solid rgba(5,150,105,0.4)' }}>
              <Check size={28} style={{ color:'#10b981' }} />
            </div>
            <h2 className="font-display font-bold text-white mb-2" style={{ fontSize:'20px' }}>
              Registration Submitted
            </h2>
            <p className="text-sm mb-6" style={{ color:'var(--text-muted)' }}>
              Your request has been sent to the CID Chief for review. You will be notified once your access is approved.
            </p>
            <div className="rounded-xl p-4 mb-5 text-left"
                 style={{ background:'rgba(5,150,105,0.06)', border:'1px solid rgba(5,150,105,0.2)' }}>
              {[
                ['Status','Pending CID Chief approval'],
                ['Next Step','Chief will review within 24 hours'],
                ['Contact','cid.chief@ksp.gov.in'],
              ].map(([k,v])=>(
                <div key={k} className="flex justify-between text-sm py-1.5"
                     style={{ borderBottom:'1px solid rgba(5,150,105,0.1)' }}>
                  <span style={{ color:'var(--text-muted)' }}>{k}</span>
                  <span style={{ color:'#10b981' }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setView('login')}
              className="w-full py-3 rounded-xl font-display font-bold transition-all"
              style={{ background:'rgba(26,86,219,0.1)', color:'#93c5fd',
                       border:'1px solid rgba(26,86,219,0.3)', fontSize:'13px', letterSpacing:'.06em' }}>
              Back to Sign In
            </button>
          </div>
        )}

        <p className="text-center mt-5 text-xs" style={{ color:'var(--text-muted)' }}>
          Karnataka State Police · CID · Restricted Access · Unauthorized use is an offence
        </p>
      </div>
    </div>
  );
}