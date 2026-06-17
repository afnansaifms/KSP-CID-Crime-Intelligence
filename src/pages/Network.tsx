import { useState } from 'react';
import { networkNodes, networkEdges, accusedRecords } from '../data/mockData';
import { useApp } from '../context/AppContext';

const RISK_COLOR = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' };
const TYPE_R = { accused: 22, location: 14, crime: 12, organization: 20 };
const TYPE_C = { accused: '#ef4444', location: '#3b82f6', crime: '#f59e0b', organization: '#f97316' };

export default function Network() {
  const [selected, setSelected] = useState<string | null>(null);
  const { t } = useApp();
  const acc = selected ? accusedRecords.find(a => a.id === selected) : null;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {t('net.title')}
      </h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{t('net.subtitle')}</p>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl overflow-hidden"
             style={{ background: '#080f1e', border: '1px solid #162844' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#162844' }}>
            <span className="font-display font-semibold text-white">{t('net.graphTitle')}</span>
            <div className="flex items-center gap-3 text-xs" style={{ color: '#475569' }}>
              {Object.entries(TYPE_C).map(([type, color]) => (
                <span key={type} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} /> {type}
                </span>
              ))}
            </div>
          </div>

          <svg width="100%" height="430" viewBox="0 0 760 430" style={{ background: '#080f1e' }}>
            {networkEdges.map(e => {
              const f = networkNodes.find(n => n.id === e.from);
              const to = networkNodes.find(n => n.id === e.to);
              if (!f?.x || !f?.y || !to?.x || !to?.y) return null;
              return (
                <g key={e.id}>
                  <line x1={f.x} y1={f.y} x2={to.x} y2={to.y}
                    stroke={`rgba(255,255,255,${e.strength * 0.12})`}
                    strokeWidth={e.strength * 2}
                    strokeDasharray={e.label === 'associate' ? '5 5' : 'none'} />
                  <text x={(f.x + to.x) / 2} y={(f.y + to.y) / 2 - 5}
                    fill="rgba(255,255,255,0.25)" fontSize="8"
                    textAnchor="middle" fontFamily="JetBrains Mono">
                    {e.label}
                  </text>
                </g>
              );
            })}
            {networkNodes.map(n => {
              if (!n.x || !n.y) return null;
              const r = TYPE_R[n.type];
              const c = n.riskLevel ? RISK_COLOR[n.riskLevel] : TYPE_C[n.type];
              const isSel = selected === n.id;
              return (
                <g key={n.id} style={{ cursor: 'pointer' }}
                   onClick={() => setSelected(n.id === selected ? null : n.id)}>
                  {(isSel || n.riskLevel === 'HIGH') && (
                    <circle cx={n.x} cy={n.y} r={r + 14} fill={c} opacity={isSel ? 0.2 : 0.07} />
                  )}
                  <circle cx={n.x} cy={n.y} r={r}
                    fill={`${c}20`} stroke={c} strokeWidth={isSel ? 2.5 : 1.5} />
                  {n.type === 'accused' && (() => {
                    const a = accusedRecords.find(x => x.id === n.id);
                    return a ? (
                      <text x={n.x} y={n.y + 4} fill="white" fontSize="9"
                            textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">
                        {a.riskScore}
                      </text>
                    ) : null;
                  })()}
                  {n.label.split('\n').map((ln, i) => (
                    <text key={i} x={n.x} y={(n.y ?? 0) + r + 13 + i * 11}
                      fill="rgba(255,255,255,0.7)" fontSize="9.5"
                      textAnchor="middle" fontFamily="DM Sans">{ln}</text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {acc ? t('net.profile') : t('net.stats')}
          </h3>

          {acc ? (
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>{acc.name}</div>
                {acc.alias && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>alias: {acc.alias}</div>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded font-mono risk-${acc.riskScore >= 80 ? 'high' : acc.riskScore >= 60 ? 'medium' : 'low'}`}>
                    RISK {acc.riskScore}/100
                  </span>
                  {acc.activeWarrant && (
                    <span className="text-xs px-2 py-0.5 rounded font-mono risk-high">{t('common.warrant')}</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('pro.priorOff')}</div>
                <div className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>{acc.priorOffences}</div>
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('pro.history')}</div>
                <div className="flex flex-wrap gap-1">
                  {acc.crimeHistory.map(c => (
                    <span key={c} className="text-xs px-1.5 py-0.5 rounded font-mono"
                          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: '10px' }}>
                      {c.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('pro.modus')}</div>
                {acc.modusOperandi.map((mo, i) => (
                  <div key={i} className="text-xs py-0.5" style={{ color: 'var(--text-secondary)' }}>• {mo}</div>
                ))}
              </div>
              {acc.lastKnownLocation && (
                <div className="p-2 rounded" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('pro.lastLoc')}</div>
                  <div className="text-sm mt-0.5" style={{ color: '#fca5a5' }}>{acc.lastKnownLocation}</div>
                </div>
              )}
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('pro.fin')}</div>
                <div className={acc.financialLinks ? 'text-amber-400 text-sm' : 'text-slate-500 text-sm'}>
                  {acc.financialLinks ? t('pro.finYes') : t('pro.finNo')}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: t('net.totalNodes'),  value: networkNodes.length,                              color: '#60a5fa' },
                { label: t('net.highRisk'),     value: networkNodes.filter(n => n.riskLevel === 'HIGH').length, color: '#ef4444' },
                { label: t('net.warrants'),     value: accusedRecords.filter(a => a.activeWarrant).length,     color: '#f59e0b' },
                { label: t('net.connections'),  value: networkEdges.length,                              color: '#a78bfa' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-lg"
                     style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span className="font-display font-bold text-xl" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
              <p className="text-xs pt-2" style={{ color: 'var(--text-muted)' }}>{t('net.clickHint')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}