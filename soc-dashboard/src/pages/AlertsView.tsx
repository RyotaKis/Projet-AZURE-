import React, { useState } from 'react';
import type { Alert } from '../types';
import { ShieldAlert, AlertTriangle, User, Search, ShieldOff, CheckCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AlertsViewProps {
  data: {
    alerts: Alert[];
  };
}

export const AlertsView: React.FC<AlertsViewProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [investigationNotes, setInvestigationNotes] = useState('');

  // Remove duplicate/dismissed management for now, just show all active from hook
  const filteredAlerts = data.alerts.filter(a => 
    a.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAlert = data.alerts.find(a => a.id === selectedAlertId) || filteredAlerts[0];

  const handleAction = (action: string) => {
    if (!selectedAlert) return;
    toast.success(`Action "${action}" appliquée sur l'alerte ${selectedAlert.id}`);
    setInvestigationNotes('');
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left List */}
      <div className="w-[400px] border-r border-[var(--color-border-subtle)] flex flex-col bg-[var(--color-surface)]">
        <div className="p-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Centre de Triage
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filtrer par type ou utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] rounded-md pl-10 pr-4 py-2 text-[11px] text-white focus:ring-1 focus:ring-[#0052FF] outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-[11px]">Aucune alerte correspondante.</div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id}
                onClick={() => setSelectedAlertId(alert.id)}
                className={`p-4 border-b border-[var(--color-border-subtle)] cursor-pointer transition-colors ${
                  selectedAlert?.id === alert.id ? 'bg-[#0052FF]/10 border-l-2 border-l-[#0052FF]' : 'hover:bg-slate-800/30 border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[11px] font-bold text-white">{alert.type}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${alert.severity === 'critical' ? 'bg-rose-900/50 text-rose-400' : 'bg-amber-900/50 text-amber-400'}`}>
                    Score: {alert.aiScore}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3" /> {alert.user}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Detail */}
      <div className="flex-1 bg-[var(--color-bg-main)] flex flex-col overflow-hidden">
        {selectedAlert ? (
          <>
            <div className="p-8 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{selectedAlert.type}</h1>
                  <p className="text-slate-400 text-sm">ID Alerte: {selectedAlert.id} • {new Date(selectedAlert.timestamp).toLocaleString()}</p>
                </div>
                <div className={`text-xl font-bold font-mono px-4 py-2 rounded-lg ${selectedAlert.severity === 'critical' ? 'bg-rose-900/30 text-rose-500 border border-rose-500/50' : 'bg-amber-900/30 text-amber-500 border border-amber-500/50'}`}>
                  RISQUE IA : {selectedAlert.aiScore}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Utilisateur</span>
                  <span className="text-white font-medium">{selectedAlert.user}</span>
                </div>
                <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Montant en jeu</span>
                  <span className="text-white font-medium">${selectedAlert.amount.toLocaleString()}</span>
                </div>
                <div className="bg-[var(--color-bg-main)] p-4 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Sévérité</span>
                  <span className={selectedAlert.severity === 'critical' ? 'text-rose-500 font-bold uppercase' : 'text-amber-500 font-bold uppercase'}>
                    {selectedAlert.severity}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Rapport d'Investigation
              </h3>
              <textarea 
                className="w-full h-32 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-lg p-4 text-sm text-slate-300 focus:ring-1 focus:ring-[#0052FF] outline-none mb-6 resize-none"
                placeholder="Entrez vos notes d'investigation ici..."
                value={investigationNotes}
                onChange={(e) => setInvestigationNotes(e.target.value)}
              />

              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Actions Requises</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleAction('Bloquer Utilisateur')}
                  className="flex items-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/50 hover:bg-rose-500 hover:text-white transition-colors px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wide"
                >
                  <ShieldOff className="w-4 h-4" /> Bloquer Utilisateur
                </button>
                <button 
                  onClick={() => handleAction('Demander OTP')}
                  className="flex items-center gap-2 bg-blue-500/10 text-blue-500 border border-blue-500/50 hover:bg-blue-500 hover:text-white transition-colors px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wide"
                >
                  <AlertTriangle className="w-4 h-4" /> Exiger OTP
                </button>
                <button 
                  onClick={() => handleAction('Marquer comme Faux Positif')}
                  className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500 hover:text-white transition-colors px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wide"
                >
                  <CheckCircle className="w-4 h-4" /> Faux Positif (Ignorer)
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Sélectionnez une alerte pour voir les détails
          </div>
        )}
      </div>
    </div>
  );
};
