import React, { useState, useEffect, useRef } from 'react';
import { Database, Terminal, Pause, Play, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const LogsView: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    
    const messages = [
      '[GATEWAY] INCOMING HTTP POST /gateway/intercept',
      '[AUTH] Validating JWT Token from client_id=srv_payment',
      '[RULES_ENGINE] Evaluating rule #45 (velocity_check_30m)',
      '[ML_PIPELINE] Invoking FraudTensorModel(v2.1) for TX_ID',
      '[SHAP] Generating explainability payload...',
      '[WEBSOCKET] Emitting ALERT_NEW to room soc_admin',
      '[DATABASE] Persisting transaction record to PostgreSQL'
    ];

    const interval = setInterval(() => {
      const ts = new Date().toISOString();
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const colorCode = msg.includes('ALERT') ? '\x1b[31m' : msg.includes('ML_') ? '\x1b[34m' : '\x1b[32m';
      
      setLogs(prev => [...prev.slice(-200), `${ts} ${colorCode}${msg}\x1b[0m`]);
    }, 800);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  const handleClear = () => {
    setLogs([]);
    toast('Terminal vidé.');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-bg-main)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#0052FF]" />
            Logs Systèmes & WebSockets
          </h1>
          <p className="text-slate-400 text-xs">Accès bas niveau aux flux de données du backend NestJS.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-slate-300 px-4 py-2 rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-colors"
          >
            {isPaused ? <><Play className="w-4 h-4"/> Reprendre</> : <><Pause className="w-4 h-4"/> Suspendre</>}
          </button>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-lg text-[11px] font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Vider
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#05080f] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden flex flex-col font-mono text-[11px] relative shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2 z-10">
          <Terminal className="w-3 h-3 text-slate-500" />
          <span className="text-slate-400 font-bold">root@azur-gateway-prod ~ tail -f /var/log/nestjs/app.log</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 pt-12 space-y-1 text-slate-300">
          {logs.map((log, i) => {
            // Very simple ANSI color parse simulation for rendering
            const isRed = log.includes('\x1b[31m');
            const isBlue = log.includes('\x1b[34m');
            const isGreen = log.includes('\x1b[32m');
            const cleanText = log.replace(/\x1b\[\d+m/g, '');
            
            return (
              <div key={i} className={`whitespace-pre-wrap ${
                isRed ? 'text-rose-400 font-bold' : 
                isBlue ? 'text-blue-400' : 
                isGreen ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {cleanText}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05080f] opacity-20"></div>
      </div>
    </div>
  );
};
