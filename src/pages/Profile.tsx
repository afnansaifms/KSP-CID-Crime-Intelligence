import { useState } from 'react';
import { accusedRecords } from '../data/mockData';
import type { Accused } from '../types';
import { useApp } from '../context/AppContext';
import { Search, AlertTriangle, Wifi } from 'lucide-react';

function RiskGauge({ score }: { score: number }) {
  const c = 2 * Math.PI * 40;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? '#ef4444' : score >= 60 ? '#f59e0b' : '#22c55e';
  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-2xl" style={{ color }}>{score}</span>
        <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>/100</span>
      </div>
    </div>
  );
}

export default function Profile() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Accused | null>(accusedRecords[0]);
  const { t } = useApp();

  const filtered = accusedRecords.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.alias?.toLowerCase().includes(search.toLowerCase())) ||
    a.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {t('pro.title')}
      </h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{t('pro.subtitle')}</p>

      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-160px)]">
        {/* List */}
        <div className="rounded-xl overflow-hidden flex flex-col"
             style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                 style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <Search size={13} style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('pro.search')}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {filtered.map(a => {
              const riskClass = a.riskScore >= 80 ? 'risk-high' : a.riskScore >= 60 ? 'risk-medium' : 'risk-low';
              return (
                <div key={a.id} onClick={() => setSelected(a)}
                  className="p-3 rounded-lg cursor-pointer transition-all mb-2"
                  style={{
                    background: selected?.id === a.id ? 'var(--primary-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${selected?.id === a.id ? 'rgba(37,99,235,0.4)' : 'var(--border)'}`,
                  }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{a.name}</div>
                      {a.alias && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>alias: {a.alias}</div>}
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{a.district}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded font-mono ${riskClass}`}>{a.riskScore}</span>
                      {a.activeWarrant && <div className="text-xs mt-1" style={{ color: '#ef4444' }}>⚠ {t('common.warrant')}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <div className="col-span-2 rounded-xl p-5 overflow-y-auto"
               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-5 mb-5 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <RiskGauge score={selected.riskScore} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>{selected.name}</h2>
                  {selected.alias && (
                    <span className="text-sm px-2 py-0.5 rounded font-mono"
                          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {selected.alias}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {selected.activeWarrant && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded risk-high font-mono">
                      <AlertTriangle size={11} /> {t('common.activeWarrant')}
                    </span>
                  )}
                  {selected.financialLinks && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded risk-medium font-mono">
                      <Wifi size={11} /> {t('common.financialLinks')}
                    </span>
                  )}
                  <span className="text-xs px-2 py-1 rounded font-mono"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {selected.priorOffences} {t('pro.priorOff').toLowerCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[
                    ['Age / Gender', `${selected.age} / ${selected.gender === 'M' ? 'Male' : 'Female'}`],
                    ['District', selected.district],
                    ['Occupation', selected.occupation],
                    ['Education', selected.education],
                    ['Address', selected.address],
                    [t('pro.lastLoc'), selected.lastKnownLocation ?? 'Unknown'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{k}</div>
                      <div className="text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <h4 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  {t('pro.history')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.crimeHistory.map(c => (
                    <span key={c} className="text-xs px-2 py-1 rounded font-mono"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                      {c.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <h4 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  {t('pro.modus')}
                </h4>
                {selected.modusOperandi.map((mo, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm mb-1.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span style={{ color: 'var(--text-secondary)' }}>{mo}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('pro.fin')}</div>
              <div className={selected.financialLinks ? 'text-amber-400 text-sm' : 'text-slate-500 text-sm'}>
                {selected.financialLinks ? t('pro.finYes') : t('pro.finNo')}
              </div>
            </div>

            {selected.associateIds.length > 0 && (
              <div className="p-4 rounded-lg mt-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <h4 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  {t('pro.assoc')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selected.associateIds.map(id => {
                    const a = accusedRecords.find(x => x.id === id);
                    return a ? (
                      <button key={id} onClick={() => setSelected(a)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:text-white"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                        {a.name}
                        <span className="ml-1.5 font-mono"
                              style={{ color: a.riskScore >= 80 ? '#ef4444' : a.riskScore >= 60 ? '#f59e0b' : '#22c55e' }}>
                          {a.riskScore}
                        </span>
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="col-span-2 rounded-xl flex items-center justify-center"
               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="text-center" style={{ color: 'var(--text-muted)' }}>
              <Search size={32} className="mx-auto mb-2 opacity-40" />
              <p>{t('pro.search')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}