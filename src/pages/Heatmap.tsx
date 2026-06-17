import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { firRecords, crimeStats } from '../data/mockData';
import { useApp } from '../context/AppContext';
import type { CrimeCategory, RiskLevel } from '../types';

const SEV_COLOR: Record<RiskLevel, string> = {
  HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e',
};

export default function Heatmap() {
  const [filter, setFilter] = useState<CrimeCategory | 'ALL'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const { t } = useApp();

  const filtered = firRecords.filter(f =>
    (filter === 'ALL' || f.crimeCategory === filter) &&
    (severityFilter === 'ALL' || f.severity === severityFilter)
  );

  const categories: (CrimeCategory | 'ALL')[] = [
    'ALL','ROBBERY','THEFT','ASSAULT','DRUG_TRAFFICKING',
    'CYBERCRIME','FRAUD','EXTORTION','MURDER',
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {t('map.title')}
      </h1>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{t('map.subtitle')}</p>

      <div className="grid grid-cols-4 gap-4">
        {/* Filters */}
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              {t('map.filters')}
            </h3>
            <div className="mb-3">
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{t('map.crimeType')}</div>
              <div className="space-y-1">
                {categories.map(c => (
                  <button key={c} onClick={() => setFilter(c)}
                    className="w-full text-left text-xs px-2 py-1.5 rounded transition-all"
                    style={{
                      background: filter === c ? 'rgba(37,99,235,0.15)' : 'transparent',
                      color: filter === c ? '#93c5fd' : 'var(--text-muted)',
                      border: `1px solid ${filter === c ? 'rgba(37,99,235,0.3)' : 'transparent'}`,
                    }}>
                    {c.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{t('map.severity')}</div>
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(s => (
                <button key={s} onClick={() => setSeverityFilter(s)}
                  className="w-full text-left text-xs px-2 py-1.5 rounded transition-all mb-1"
                  style={{
                    background: severityFilter === s ? 'rgba(255,255,255,0.05)' : 'transparent',
                    color: s === 'ALL' ? 'var(--text-secondary)' : SEV_COLOR[s as RiskLevel] ?? 'var(--text-secondary)',
                    border: `1px solid ${severityFilter === s ? 'var(--border)' : 'transparent'}`,
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              {t('map.distStats')}
            </h3>
            <div className="space-y-2">
              {crimeStats.slice(0, 5).map(s => (
                <div key={s.district}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span style={{ color: 'var(--text-secondary)' }}>{s.district.split(' ')[0]}</span>
                    <span className="font-mono"
                          style={{ color: s.trend === 'UP' ? '#ef4444' : s.trend === 'DOWN' ? '#22c55e' : '#94a3b8' }}>
                      {s.trend === 'UP' ? '↑' : s.trend === 'DOWN' ? '↓' : '→'} {Math.abs(s.changePercent)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
                    <div className="h-full rounded-full"
                         style={{ width: `${(s.count / 4821) * 100}%`, background: s.trend === 'UP' ? '#ef4444' : '#2563eb' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="col-span-3 rounded-xl overflow-hidden"
             style={{ border: '1px solid var(--border)', height: '520px' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b"
               style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {t('map.mapTitle')}
            </span>
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} {t('map.shown')}
            </span>
          </div>
          <MapContainer center={[14.5, 75.7]} zoom={7}
            style={{ height: 'calc(100% - 40px)', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; CartoDB'
            />
            {filtered.map(fir => (
              <CircleMarker key={fir.id}
                center={[fir.latitude, fir.longitude]}
                radius={fir.severity === 'HIGH' ? 12 : fir.severity === 'MEDIUM' ? 9 : 6}
                fillColor={SEV_COLOR[fir.severity]}
                color={SEV_COLOR[fir.severity]}
                weight={1.5} opacity={0.9} fillOpacity={0.45}>
                <Popup>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '12px', minWidth: '180px' }}>
                    <strong style={{ color: '#1e40af' }}>{fir.firNumber}</strong>
                    <p style={{ margin: '4px 0 2px' }}>{fir.policeStation}, {fir.district}</p>
                    <p style={{ color: '#666', marginBottom: '4px' }}>{fir.description}</p>
                    <span style={{
                      background: fir.severity === 'HIGH' ? '#fee2e2' : fir.severity === 'MEDIUM' ? '#fef3c7' : '#d1fae5',
                      color: fir.severity === 'HIGH' ? '#dc2626' : fir.severity === 'MEDIUM' ? '#d97706' : '#059669',
                      padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '600',
                    }}>
                      {fir.severity} · {fir.status.replace('_', ' ')}
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}