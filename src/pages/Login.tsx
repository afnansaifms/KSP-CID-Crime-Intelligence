import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, ArrowLeft, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth, ROLE_CONFIGS } from '../hooks/useAuth';
import type { UserRole } from '../types';
import { KARNATAKA_DISTRICTS } from '../data/mockData';
import { loginUser, submitRegistration, emailExists } from '../services/authStorage';

type View = 'home' | 'login' | 'register' | 'pending';


export default function Login() {
  const [view, setView]     = useState<View>('home');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');

  const [regName, setRegName]     = useState('');
  const [regEmail, setRegEmail]   = useState('');
  const [regPass, setRegPass]     = useState('');
  const [regRole, setRegRole]     = useState<UserRole>('investigator');
  const [regDistrict, setRegDistrict] = useState('Bengaluru Urban');
  const [regDept, setRegDept]     = useState('');
  const [regPhone, setRegPhone]   = useState('');

  const { login } = useAuth();
  const nav = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError('Enter email and password'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 700));
    const res = loginUser(email, password);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    login(res.user.name, res.user.role, res.user.district);
    nav('/dashboard');
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPass || !regDept || !regPhone) { setError('All fields required'); return; }
    if (regPass.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (emailExists(regEmail)) { setError('Email already registered'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 900));
    submitRegistration({ name:regName, email:regEmail, password:regPass, role:regRole, district:regDistrict, department:regDept, phone:regPhone, badgeNumber:'' });
    setLoading(false);
    setView('pending');
  };

  const inp = (val: string, set: (v:string)=>void, placeholder: string, type='text', extra?: React.ReactNode) => (
    <div style={{ position:'relative' }}>
      <input type={type} value={val} onChange={e => set(e.target.value)}
        placeholder={placeholder}
        onKeyDown={e => e.key==='Enter' && view==='login' && handleLogin()}
        style={{
          width:'100%', padding:'11px 14px', borderRadius:8, outline:'none',
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.08)',
          color:'#f1f5f9', fontFamily:'var(--font-body)', fontSize:13,
          transition:'border-color .15s, box-shadow .15s',
          boxSizing:'border-box',
        }}
        onFocus={e => { e.target.style.borderColor='rgba(79,70,229,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.12)'; }}
        onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }} />
      {extra}
    </div>
  );

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'#05080f', position:'relative', overflow:'hidden',
    }}>
      {/* Ambient background */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{
          position:'absolute', top:'-20%', left:'50%', transform:'translateX(-50%)',
          width:800, height:800, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 65%)',
        }} />
        <div style={{
          position:'absolute', bottom:'-10%', right:'-10%',
          width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)',
        }} />
        {/* Grid */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(79,70,229,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,0.04) 1px,transparent 1px)',
          backgroundSize:'48px 48px',
        }} />
        {/* Scanline */}
        <div style={{
          position:'absolute', left:0, right:0, height:2,
          background:'linear-gradient(90deg,transparent,rgba(79,70,229,0.5),transparent)',
          animation:'scan 8s linear infinite',
        }} />
      </div>

      {/* Corner marks */}
      {[
        {top:24,left:24,bt:'border-top',bl:'border-left'},
        {top:24,right:24,bt:'border-top',bl:'border-right'},
        {bottom:24,left:24,bt:'border-bottom',bl:'border-left'},
        {bottom:24,right:24,bt:'border-bottom',bl:'border-right'},
      ].map((pos,i) => (
        <div key={i} style={{
          position:'absolute', width:20, height:20,
          ...pos,
          borderTop: (pos.bt==='border-top') ? '1px solid rgba(79,70,229,0.3)' : 'none',
          borderBottom: (pos.bt==='border-bottom') ? '1px solid rgba(79,70,229,0.3)' : 'none',
          borderLeft: (pos.bl==='border-left') ? '1px solid rgba(79,70,229,0.3)' : 'none',
          borderRight: (pos.bl==='border-right') ? '1px solid rgba(79,70,229,0.3)' : 'none',
        }} />
      ))}

      <div style={{
        position:'relative', zIndex:10, width:'100%', maxWidth: view==='register' ? 640 : 440,
        padding:'0 24px',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)',
        transition:'opacity .6s ease, transform .6s ease',
      }}>

        {/* Logo section */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
            {/* Rings */}
            <div style={{
              position:'absolute', width:100, height:100, borderRadius:'50%',
              border:'1px solid rgba(79,70,229,0.1)',
              animation:'spin 20s linear infinite',
            }} />
            <div style={{
              position:'absolute', width:76, height:76, borderRadius:'50%',
              border:'1px dashed rgba(79,70,229,0.15)',
              animation:'spin 14s linear infinite reverse',
            }} />
            {/* Logo box */}
            <div style={{
              width:60, height:60, borderRadius:16,
              background:'rgba(79,70,229,0.12)',
              border:'1px solid rgba(79,70,229,0.45)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 32px rgba(79,70,229,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
              animation:'glow-pulse 3s ease-in-out infinite',
              position:'relative',
            }}>
              <img src="/ksp-logo.svg" alt="KSP"
                   style={{ width:42, height:42, objectFit:'contain' }}
                   onError={e => {
                     const el = e.target as HTMLImageElement;
                     el.style.display='none';
                     el.parentElement!.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
                   }} />
            </div>
          </div>

          <h1 style={{
            fontFamily:'var(--font-display)', fontWeight:700, fontSize:26,
            color:'#f1f5f9', letterSpacing:'.01em', margin:'0 0 8px',
          }}>
            Karnataka State Police
          </h1>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:8 }}>
            <div style={{ height:1, width:48, background:'linear-gradient(90deg,transparent,rgba(79,70,229,0.5))' }} />
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(129,140,248,0.8)', letterSpacing:'.18em' }}>
              CRIME INTELLIGENCE PLATFORM · CID
            </span>
            <div style={{ height:1, width:48, background:'linear-gradient(90deg,rgba(79,70,229,0.5),transparent)' }} />
          </div>
        </div>

        {/* HOME */}
        {view === 'home' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }} className="anim-fade-up">
            <p style={{ textAlign:'center', fontFamily:'var(--font-body)', fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:4 }}>
              Authorised Karnataka Police personnel only
            </p>
            <button onClick={() => setView('login')} style={{
              width:'100%', padding:'14px', borderRadius:10, cursor:'pointer',
              background:'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
              border:'none', color:'#fff',
              fontFamily:'var(--font-display)', fontWeight:700, fontSize:13,
              letterSpacing:'.06em',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow:'0 0 32px rgba(79,70,229,0.4), 0 4px 20px rgba(0,0,0,0.4)',
              transition:'all .15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 0 48px rgba(79,70,229,0.5), 0 8px 24px rgba(0,0,0,0.5)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='none'; (e.currentTarget as HTMLElement).style.boxShadow='0 0 32px rgba(79,70,229,0.4), 0 4px 20px rgba(0,0,0,0.4)'; }}>
              <LogIn size={15} /> SIGN IN TO KIRAN
            </button>

            <button onClick={() => setView('register')} style={{
              width:'100%', padding:'14px', borderRadius:10, cursor:'pointer',
              background:'rgba(79,70,229,0.08)',
              border:'1px solid rgba(79,70,229,0.2)', color:'rgba(129,140,248,0.8)',
              fontFamily:'var(--font-display)', fontWeight:600, fontSize:13, letterSpacing:'.06em',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              transition:'all .15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(79,70,229,0.14)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(79,70,229,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(79,70,229,0.08)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(79,70,229,0.2)'; }}>
              <UserPlus size={15} /> REQUEST ACCESS
            </button>

            <div style={{
              padding:'12px 14px', borderRadius:8, marginTop:4,
              background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.18)',
              display:'flex', gap:10, alignItems:'flex-start',
            }}>
              <AlertTriangle size={12} style={{ color:'#f59e0b', flexShrink:0, marginTop:1 }} />
              <p style={{ fontFamily:'var(--font-body)', fontSize:11, color:'rgba(245,158,11,0.7)', margin:0, lineHeight:1.5 }}>
                New registrations require CID Chief approval before access is granted.
              </p>
            </div>

            <p style={{ textAlign:'center', fontFamily:'var(--font-mono)', fontSize:14, color:'rgba(255,255,255,0.2)', marginTop:4 }}>
              Demo:{' '}
              <span style={{ color:'rgba(129,140,248,0.7)' }}>chief@ksp.gov.in</span>
              {' / '}
              <span style={{ color:'rgba(129,140,248,0.7)' }}>KSP@Chief2024</span>
            </p>
          </div>
        )}

        {/* LOGIN */}
        {view === 'login' && (
          <div className="anim-fade-up">
            <button onClick={() => { setView('home'); setError(''); }} style={{
              display:'flex', alignItems:'center', gap:6, marginBottom:20,
              background:'none', border:'none', cursor:'pointer',
              fontFamily:'var(--font-body)', fontSize:12, color:'rgba(255,255,255,0.3)',
              padding:0, transition:'color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color='#818cf8')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.3)')}>
              <ArrowLeft size={13} /> Back
            </button>

            <div style={{
              padding:28, borderRadius:16,
              background:'rgba(255,255,255,0.02)',
              border:'1px solid rgba(255,255,255,0.07)',
              backdropFilter:'blur(20px)',
            }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'#f1f5f9', margin:'0 0 6px' }}>
                Officer Sign In
              </h2>
              <p style={{ fontFamily:'var(--font-body)', fontSize:12, color:'rgba(255,255,255,0.3)', margin:'0 0 24px' }}>
                Sign in to access the intelligence platform
              </p>

              {error && (
                <div style={{
                  display:'flex', gap:8, padding:'10px 14px', borderRadius:8, marginBottom:16,
                  background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
                }}>
                  <AlertTriangle size={13} style={{ color:'#ef4444', flexShrink:0 }} />
                  <span style={{ fontFamily:'var(--font-body)', fontSize:12, color:'#fca5a5' }}>{error}</span>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'.14em', display:'block', marginBottom:7 }}>
                    EMAIL ADDRESS
                  </label>
                  {inp(email, setEmail, 'officer@ksp.gov.in', 'email')}
                </div>
                <div>
                  <label style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'.14em', display:'block', marginBottom:7 }}>
                    PASSWORD
                  </label>
                  {inp(password, setPassword, '••••••••', showPass ? 'text' : 'password',
                    <button onClick={() => setShowPass(p => !p)} style={{
                      position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', padding:0,
                    }}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>

                <button onClick={handleLogin} disabled={loading} style={{
                  width:'100%', padding:'13px', borderRadius:9, cursor:'pointer',
                  background:'linear-gradient(135deg,#4f46e5,#4338ca)',
                  border:'none', color:'#fff',
                  fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, letterSpacing:'.04em',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  boxShadow:'0 0 24px rgba(79,70,229,0.35)',
                  opacity: loading ? .7 : 1,
                  marginTop:4,
                }}>
                  {loading
                    ? <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite' }} /> Authenticating...</>
                    : <><LogIn size={14} /> ACCESS KIRAN</>}
                </button>
              </div>

              <p style={{ textAlign:'center', fontFamily:'var(--font-body)', fontSize:12, color:'rgba(255,255,255,0.25)', marginTop:20, marginBottom:0 }}>
                No access?{' '}
                <button onClick={() => { setView('register'); setError(''); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#818cf8', fontFamily:'var(--font-body)', fontSize:12, padding:0 }}>
                  Request registration
                </button>
              </p>
            </div>
          </div>
        )}

        {/* REGISTER */}
        {view === 'register' && (
          <div className="anim-fade-up">
            <button onClick={() => { setView('home'); setError(''); }} style={{
              display:'flex', alignItems:'center', gap:6, marginBottom:20,
              background:'none', border:'none', cursor:'pointer',
              fontFamily:'var(--font-body)', fontSize:12, color:'rgba(255,255,255,0.3)', padding:0,
            }}
            onMouseEnter={e => (e.currentTarget.style.color='#818cf8')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.3)')}>
              <ArrowLeft size={13} /> Back
            </button>

            <div style={{
              padding:28, borderRadius:16,
              background:'rgba(255,255,255,0.02)',
              border:'1px solid rgba(255,255,255,0.07)',
            }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'#f1f5f9', margin:'0 0 4px' }}>
                Request System Access
              </h2>
              <p style={{ fontFamily:'var(--font-body)', fontSize:12, color:'rgba(255,255,255,0.3)', margin:'0 0 24px' }}>
                Reviewed and approved by the CID Chief
              </p>

              {error && (
                <div style={{ display:'flex', gap:8, padding:'10px 14px', borderRadius:8, marginBottom:16, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
                  <AlertTriangle size={13} style={{ color:'#ef4444', flexShrink:0 }} />
                  <span style={{ fontFamily:'var(--font-body)', fontSize:12, color:'#fca5a5' }}>{error}</span>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[
                  { label:'FULL NAME', val:regName, set:setRegName, ph:'Officer full name' },
                  { label:'OFFICIAL EMAIL', val:regEmail, set:setRegEmail, ph:'officer@ksp.gov.in', type:'email' },
                  { label:'PASSWORD', val:regPass, set:setRegPass, ph:'Min 8 characters', type:'password' },
                  { label:'PHONE', val:regPhone, set:setRegPhone, ph:'9XXXXXXXXX' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'.14em', display:'block', marginBottom:7 }}>
                      {f.label}
                    </label>
                    <input type={f.type || 'text'} value={f.val} onChange={e => f.set(e.target.value)}
                      placeholder={f.ph}
                      style={{ width:'100%', padding:'10px 12px', borderRadius:7, outline:'none', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#f1f5f9', fontFamily:'var(--font-body)', fontSize:13, boxSizing:'border-box' }}
                      onFocus={e => { e.target.style.borderColor='rgba(79,70,229,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }} />
                  </div>
                ))}

                {[
                  { label:'ACCESS ROLE', val:regRole, set:setRegRole as any, options: Object.entries(ROLE_CONFIGS).map(([k,v]) => ({ value:k, label:v.label })) },
                  { label:'DISTRICT', val:regDistrict, set:setRegDistrict, options: KARNATAKA_DISTRICTS.map(d => ({ value:d, label:d })) },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'.14em', display:'block', marginBottom:7 }}>
                      {f.label}
                    </label>
                    <select value={f.val} onChange={e => f.set(e.target.value)}
                      style={{ width:'100%', padding:'10px 12px', borderRadius:7, outline:'none', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#f1f5f9', fontFamily:'var(--font-body)', fontSize:13, boxSizing:'border-box', cursor:'pointer' }}>
                      {f.options.map(o => <option key={o.value} value={o.value} style={{ background:'#0d1424' }}>{o.label}</option>)}
                    </select>
                  </div>
                ))}

                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'.14em', display:'block', marginBottom:7 }}>
                    DEPARTMENT / UNIT
                  </label>
                  <input value={regDept} onChange={e => setRegDept(e.target.value)}
                    placeholder="e.g. Crime Investigation Department, Cyber Crime Cell"
                    style={{ width:'100%', padding:'10px 12px', borderRadius:7, outline:'none', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#f1f5f9', fontFamily:'var(--font-body)', fontSize:13, boxSizing:'border-box' }}
                    onFocus={e => { e.target.style.borderColor='rgba(79,70,229,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }} />
                </div>
              </div>

              <button onClick={handleRegister} disabled={loading} style={{
                width:'100%', padding:'13px', borderRadius:9, cursor:'pointer', marginTop:20,
                background:'rgba(79,70,229,0.15)',
                border:'1px solid rgba(79,70,229,0.35)', color:'#818cf8',
                fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, letterSpacing:'.04em',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              }}>
                {loading
                  ? <><span style={{ width:14, height:14, border:'2px solid rgba(129,140,248,.3)', borderTopColor:'#818cf8', borderRadius:'50%', animation:'spin .7s linear infinite' }} /> Submitting...</>
                  : <><UserPlus size={14} /> SUBMIT REQUEST</>}
              </button>
            </div>
          </div>
        )}

        {/* PENDING */}
        {view === 'pending' && (
          <div className="anim-fade-up" style={{ textAlign:'center' }}>
            <div style={{
              width:64, height:64, borderRadius:'50%', margin:'0 auto 20px',
              background:'rgba(16,185,129,0.12)',
              border:'2px solid rgba(16,185,129,0.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 32px rgba(16,185,129,0.2)',
            }}>
              <Check size={28} style={{ color:'#10b981' }} />
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:22, color:'#f1f5f9', marginBottom:8 }}>
              Registration Submitted
            </h2>
            <p style={{ fontFamily:'var(--font-body)', fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>
              Your request has been sent to the CID Chief for review.
            </p>
            <div style={{ padding:20, borderRadius:12, background:'rgba(16,185,129,0.05)', border:'1px solid rgba(16,185,129,0.15)', marginBottom:20, textAlign:'left' }}>
              {[['Status','Pending CID Chief approval'],['Response','Within 24 hours'],['Contact','cid.chief@ksp.gov.in']].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(16,185,129,0.08)' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'rgba(255,255,255,0.3)' }}>{k}</span>
                  <span style={{ fontFamily:'var(--font-body)', fontSize:12, color:'#10b981' }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setView('login')} style={{
              width:'100%', padding:'13px', borderRadius:9, cursor:'pointer',
              background:'rgba(79,70,229,0.1)', border:'1px solid rgba(79,70,229,0.25)', color:'#818cf8',
              fontFamily:'var(--font-display)', fontWeight:600, fontSize:13,
            }}>
              Back to Sign In
            </button>
          </div>
        )}

        <p style={{ textAlign:'center', fontFamily:'var(--font-mono)', fontSize:10, color:'rgb(255, 0, 0)', marginTop:24, letterSpacing:'.06em' }}>
          KARNATAKA STATE POLICE · CID · RESTRICTED ACCESS
        </p>
      </div>
    </div>
  );
}