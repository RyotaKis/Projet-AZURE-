import React from 'react';
import { FraudMap } from '../components/FraudMap';
import { Map, Activity, MapPin } from 'lucide-react';
import type { Alert } from '../types';

interface GeoWatchViewProps {
  data: {
    alerts: Alert[];
  };
}

export const GeoWatchView: React.FC<GeoWatchViewProps> = ({ data }) => {
  // We mock a list of locations for active alerts
  const geoAlerts = data.alerts.map((a, i) => ({
    ...a,
    location: ['New York, US', 'Paris, FR', 'Tokyo, JP', 'London, UK', 'São Paulo, BR'][i % 5]
  }));

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel: Geo Events Feed */}
      <div className="w-[320px] border-r border-[var(--color-border-subtle)] flex flex-col bg-[var(--color-surface)]">
        <div className="p-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2 mb-1">
            <Map className="w-5 h-5 text-blue-500" />
            Live Geo-Watch
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Surveillance planétaire</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {geoAlerts.map(alert => (
            <div key={alert.id} className="p-3 bg-[var(--color-bg-main)] rounded border border-[var(--color-border-subtle)]">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${alert.severity === 'critical' ? 'bg-rose-900/50 text-rose-400' : 'bg-amber-900/50 text-amber-400'}`}>
                  {alert.severity}
                </span>
                <span className="text-[9px] text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-[11px] font-bold text-white mb-1">{alert.type}</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-500" /> {alert.location}
              </div>
            </div>
          ))}
          
          {geoAlerts.length === 0 && (
            <div className="text-center py-8 text-[11px] text-slate-500">Aucun événement localisé.</div>
          )}
        </div>
      </div>

      {/* Main Panel: Map */}
      <div className="flex-1 p-4 bg-[#0a0f18] relative">
        <div className="absolute top-8 left-8 z-10 bg-[var(--color-surface)]/80 backdrop-blur border border-[var(--color-border-subtle)] rounded-lg p-4 shadow-2xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            Statut Réseau Global
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between gap-8 text-[10px] font-bold">
              <span className="text-slate-400">Nœuds Actifs</span>
              <span className="text-white">1,204</span>
            </div>
            <div className="flex justify-between gap-8 text-[10px] font-bold">
              <span className="text-slate-400">Taux de Risque Global</span>
              <span className="text-amber-500">3.2%</span>
            </div>
            <div className="flex justify-between gap-8 text-[10px] font-bold">
              <span className="text-slate-400">Menaces Bloquées (1h)</span>
              <span className="text-emerald-500">842</span>
            </div>
          </div>
        </div>

        <FraudMap />
      </div>
    </div>
  );
};
