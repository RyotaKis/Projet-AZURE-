import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Alert } from '../types';
import { ShieldAlert, ExternalLink, AlertTriangle, AlertCircle } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="bg-white rounded border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          File d'Attente des Menaces
        </h3>
        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">
          {alerts.length} Actives
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border-l-2 pl-4 py-2 transition-all relative group ${
                alert.severity === 'Critique' 
                  ? 'border-rose-500 bg-rose-50/10' 
                  : 'border-amber-500 bg-amber-50/10'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="text-[10px] font-bold tracking-tight text-slate-800">
                  {alert.type} <span className="text-slate-400">â€” {alert.user}</span>
                </div>
                <div className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  alert.severity === 'Critique' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {alert.aiScore}%
                </div>
              </div>
              
              <div className="text-[9px] text-slate-500 leading-relaxed mb-3">
                Anomalie détectée pour {alert.id}. 
                Intervention requise.
              </div>

              <div className="flex items-center gap-2">
                <button className="bg-[#0052FF] text-white text-[9px] px-3 py-1.5 rounded uppercase font-black tracking-widest hover:bg-blue-700 transition-colors">
                  Analyser
                </button>
                <button className="bg-slate-100 text-slate-600 text-[9px] px-3 py-1.5 rounded uppercase font-black tracking-widest hover:bg-slate-200 transition-colors">
                  Mettre en attente
                </button>
              </div>

              {alert.severity === 'Critique' && (
                <div className="absolute top-2 right-2">
                   <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {alerts.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2 opacity-50 py-20">
            <ShieldCheck className="w-10 h-10" />
            <p className="text-[9px] font-bold uppercase tracking-widest">État Nominal</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal icon helpers for AlertsPanel
import { User, ShieldCheck } from 'lucide-react';
