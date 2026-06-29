import { useState, useEffect } from 'react';
import { Check, X, Clock, Users, ShieldCheck } from 'lucide-react';
import { getAllRegistrations, approveRegistration, rejectRegistration } from '../services/authStorage';
import type { UserRegistration } from '../types';
import { useAuth } from '../hooks/useAuth';

export default function Admin() {
  const { user } = useAuth();
  const [regs, setRegs]         = useState<UserRegistration[]>([]);
  const [selected, setSelected] = useState<UserRegistration | null>(null);
  const [note, setNote]         = useState('');
  const [filter, setFilter]     = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  useEffect(() => { loadRegs(); }, []);

  const loadRegs = () => setRegs(getAllRegistrations().reverse());

  const handleApprove = (id: string) => {
    approveRegistration(id, note || 'Approved by CID Chief');
    setSelected(null); setNote('');
    loadRegs();
  };

  const handleReject = (id: string) => {
    if (!note) { alert('Please provide a rejection reason'); return; }
    rejectRegistration(id, note);
    setSelected(null); setNote('');
    loadRegs();
  };

  const filtered = regs.filter(r => filter === 'ALL' || r.status === filter);
  const pending  = regs.filter(r => r.status === 'PENDING').length;
  const approved = regs.filter(r => r.status === 'APPROVED').length;
  const rejected = regs.filter(r => r.status === 'REJECTED').length;

  const STATUS_STYLE = {
    PENDING:  { color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.25)' },
    APPROVED: { color:'#10b981', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.25)' },
    REJECTED: { color:'#ef4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.25)'  },
  };

  if (user?.role !== 'supervisor') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldCheck size={40} className="mx-auto mb-3 opacity-30" style={{ color:'#ef4444' }} />
          <p style={{ color:'var(--text-muted)' }}>Access restricted to CID Chief / Supervisor only</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1">
        Registration Approvals
      </h1>
      <p className="text-sm mb-5" style={{ color:'var(--text-muted)' }}>
        Review and approve officer access requests — CID Chief panel
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label:'Pending Review', value:pending,  icon:Clock,     color:'#f59e0b' },
          { label:'Approved',       value:approved, icon:Check,     color:'#10b981' },
          { label:'Rejected',       value:rejected, icon:X,         color:'#ef4444' },
        ].map(s => (
          <div key={s.label} className="ksp-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background:`${s.color}12`, border:`1px solid ${s.color}25` }}>
              <s.icon size={18} style={{ color:s.color }} />
            </div>
            <div>
              <div className="font-display font-bold text-white" style={{ fontSize:'24px' }}>{s.value}</div>
              <div className="text-xs" style={{ color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['PENDING','APPROVED','REJECTED','ALL'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-lg font-mono text-xs transition-all"
            style={{
              background: filter===f ? 'rgba(26,86,219,0.2)' : 'var(--bg-elevated)',
              border: `1px solid ${filter===f ? 'rgba(26,86,219,0.4)' : 'var(--border)'}`,
              color: filter===f ? '#93c5fd' : 'var(--text-muted)',
            }}>
            {f} {f!=='ALL' && `(${regs.filter(r=>r.status===f).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* List */}
        <div className="col-span-2 ksp-card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p style={{ color:'var(--text-muted)' }}>No {filter.toLowerCase()} registrations</p>
            </div>
          ) : (
            filtered.map((reg, i) => {
              const sty = STATUS_STYLE[reg.status];
              return (
                <div key={reg.id}
                     onClick={() => setSelected(reg)}
                     className="flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors"
                     style={{
                       borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none',
                       background: selected?.id===reg.id ? 'rgba(26,86,219,0.08)' : '',
                     }}
                     onMouseEnter={e=>(e.currentTarget.style.background='rgba(26,86,219,0.05)')}
                     onMouseLeave={e=>(e.currentTarget.style.background=selected?.id===reg.id?'rgba(26,86,219,0.08)':'')}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold shrink-0"
                       style={{ background:`${sty.color}15`, color:sty.color,
                                border:`1px solid ${sty.border}`, fontSize:'12px' }}>
                    {reg.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm" style={{ color:'var(--text-primary)' }}>
                        {reg.name}
                      </span>
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                            style={{ background:sty.bg, color:sty.color,
                                     border:`1px solid ${sty.border}`, fontSize:'9px' }}>
                        {reg.status}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color:'var(--text-muted)' }}>
                      {reg.email} · {reg.department}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>
                      {reg.role} · {reg.district} · {new Date(reg.submittedAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        <div className="ksp-card p-4">
          {selected ? (
            <div>
              <h3 className="font-display font-semibold text-white mb-3">Review Request</h3>
              <div className="space-y-2 mb-4">
                {[
                  ['Name',        selected.name],
                  ['Email',       selected.email],
                  ['Role',        selected.role],
                  ['District',    selected.district],
                  ['Department',  selected.department],
                  ['Phone',       selected.phone],
                  ['Submitted',   new Date(selected.submittedAt).toLocaleDateString('en-IN')],
                  ...(selected.reviewedAt ? [['Reviewed', new Date(selected.reviewedAt).toLocaleDateString('en-IN')]] : []),
                  ...(selected.reviewNote ? [['Note', selected.reviewNote]] : []),
                ].map(([k,v]) => (
                  <div key={k}>
                    <div className="font-mono" style={{ color:'var(--text-muted)', fontSize:'9px', letterSpacing:'.1em' }}>
                      {k.toUpperCase()}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color:'var(--text-primary)' }}>{v}</div>
                  </div>
                ))}
              </div>

              {selected.status === 'PENDING' && (
                <>
                  <div className="mb-3">
                    <label className="font-mono block mb-1.5"
                           style={{ color:'var(--text-muted)', fontSize:'9px', letterSpacing:'.1em' }}>
                      REVIEW NOTE (required for rejection)
                    </label>
                    <textarea value={note} onChange={e=>setNote(e.target.value)}
                      rows={3} placeholder="Add a note..."
                      className="w-full text-sm outline-none resize-none rounded-lg p-2.5"
                      style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)',
                               color:'var(--text-primary)', fontFamily:'DM Sans' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleApprove(selected.id)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display font-bold text-xs transition-all"
                      style={{ background:'rgba(5,150,105,0.15)', color:'#10b981',
                               border:'1px solid rgba(5,150,105,0.35)' }}>
                      <Check size={13} /> APPROVE
                    </button>
                    <button onClick={() => handleReject(selected.id)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display font-bold text-xs transition-all"
                      style={{ background:'rgba(220,38,38,0.1)', color:'#ef4444',
                               border:'1px solid rgba(220,38,38,0.3)' }}>
                      <X size={13} /> REJECT
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Users size={28} className="mx-auto mb-2 opacity-30" style={{ color:'var(--text-muted)' }} />
                <p className="text-xs" style={{ color:'var(--text-muted)' }}>Select a registration to review</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}