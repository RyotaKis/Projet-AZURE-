import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Alert } from '../types';
import { ShieldAlert, ExternalLink, AlertTriangle, AlertCircle, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const activeAlerts = alerts.filter(a => !dismissed.has(a.id));

  const handleAnalyze = (id: string) => {
    toast.info(`Analyse approfondie de ${id}...`);
    setTimeout(() => {
      toast.success(`Menace ${id} neutralisée automatiquement.`);
      setDismissed(prev => new Set(prev).add(id));
    }, 1500);
  };

  const handleQueue = (id: string) => {
    toast('Alerte mise en attente.');
    setDismissed(prev => new Set(prev).add(id));
  };

  return (
    <div className="bg-[var(--color-surface)] rounded border border-[var(--color-border-subtle)] overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-bg-main)]">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          File d'Attente des Menaces
        </h3>
        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">
          {activeAlerts.length} Actives
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {activeAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border-l-2 pl-4 py-2 transition-all relative group ${
                alert.severity === 'critical' 
                  ? 'border-rose-500 bg-rose-900/10' 
                  : 'border-amber-500 bg-amber-900/10'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="text-[10px] font-bold tracking-tight text-white">
                  {alert.type} <span className="text-slate-500">— {alert.user}</span>
                </div>
                <div className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  alert.severity === 'critical' ? 'bg-rose-900/50 text-rose-400' : 'bg-amber-900/50 text-amber-400'
                }`}>
                  {alert.aiScore}%
                </div>
              </div>
              
              <div className="text-[9px] text-slate-400 leading-relaxed mb-3">
                Anomalie détectée pour {alert.id}. Intervention requise.
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleAnalyze(alert.id)}
                  className="bg-[#0052FF] text-white text-[9px] px-3 py-1.5 rounded uppercase font-black tracking-widest hover:bg-blue-700 transition-colors"
                >
                  Analyser
                </button>
                <button 
                  onClick={() => handleQueue(alert.id)}
                  className="bg-[var(--color-bg-main)] text-slate-400 border border-[var(--color-border-subtle)] text-[9px] px-3 py-1.5 rounded uppercase font-black tracking-widest hover:text-white transition-colors"
                >
                  Mettre en attente
                </button>
              </div>

              {alert.severity === 'critical' && (
                <div className="absolute top-2 right-2">
                   <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activeAlerts.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 opacity-50 py-20">
            <ShieldCheck className="w-10 h-10" />
            <p className="text-[9px] font-bold uppercase tracking-widest">État Nominal</p>
          </div>
        )}
      </div>
    </div>
  );
};
