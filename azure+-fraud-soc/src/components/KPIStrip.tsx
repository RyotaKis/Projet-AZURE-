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
    { label: 'Fraud Rate', value: stats.fraudRate, format: (v: number) => `${v}%`, subtext: 'avg 24h' },
    { label: 'Active Alerts', value: stats.activeAlerts, format: (v: number) => v, isAlert: true },
    { label: 'Blocked 1H', value: stats.blocked, format: (v: number) => v.toLocaleString() },
    { label: 'Net Latency', value: stats.latency, format: (v: number) => `${v}ms`, isSuccess: true },
  ];

  return (
    <div className="h-20 bg-white border-b border-slate-200 flex items-center px-6 -mx-8 flex-shrink-0">
      {items.map((item, idx) => (
        <div key={item.label} className={`flex-1 ${idx !== items.length - 1 ? 'border-r border-slate-100' : ''}`}>
          <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${item.isAlert ? 'text-rose-500' : 'text-slate-400'}`}>
            {item.label}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold font-mono tracking-tight ${
              item.isAlert ? 'text-rose-600' : 
              item.isSuccess ? 'text-emerald-600' : 'text-slate-900'
            }`}>
              {item.format(item.value)}
            </span>
            {item.trend && <span className="text-[10px] text-emerald-500 font-bold">{item.trend}</span>}
            {item.subtext && <span className="text-[10px] text-slate-400 font-medium lowercase tracking-normal">{item.subtext}</span>}
            {item.isAlert && item.value > 0 && (
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-1" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
