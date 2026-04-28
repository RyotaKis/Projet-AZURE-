import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldAlert, Ban, Clock, Percent } from 'lucide-react';

interface KPIStripProps {
  stats: {
    tps: number;
    fraudRate: number;
    activeAlerts: number;
    blocked: number;
    latency: number;
  };
}

export const KPIStrip: React.FC<KPIStripProps> = ({ stats }) => {
  const items = [
    { label: 'Trans/Min', value: stats.tps * 60, format: (v: number) => v.toLocaleString(), trend: '+2.4%' },
    { label: 'Taux Fraude', value: stats.fraudRate, format: (v: number) => `${v}%`, subtext: 'moy 24h' },
    { label: 'Alertes Actives', value: stats.activeAlerts, format: (v: number) => v, isAlert: true },
    { label: 'BloquÃ©s 1H', value: stats.blocked, format: (v: number) => v.toLocaleString() },
    { label: 'Latence Nette', value: stats.latency, format: (v: number) => `${v}ms`, isSuccess: true },
  ];

  return (
    <div className="h-20 bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] flex items-center px-6 -mx-8 flex-shrink-0 transition-colors">
      {items.map((item, idx) => (
        <div key={item.label} className={`flex-1 ${idx !== items.length - 1 ? 'border-r border-[var(--color-border-subtle)]' : ''}`}>
          <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${item.isAlert ? 'text-rose-500' : 'text-slate-400'}`}>
            {item.label}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold font-mono tracking-tight ${
              item.isAlert ? 'text-rose-600' : 
              item.isSuccess ? 'text-emerald-500' : 'text-white'
            }`}>
              {item.format(item.value)}
            </span>
            {item.trend && <span className="text-[10px] text-emerald-500 font-bold">{item.trend}</span>}
            {item.subtext && <span className="text-[10px] text-slate-500 font-medium lowercase tracking-normal">{item.subtext}</span>}
            {item.isAlert && item.value > 0 && (
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-1" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
