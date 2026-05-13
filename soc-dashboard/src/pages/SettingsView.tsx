import React from 'react';
import { Settings, Shield, Bell, User, Database, Globe } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsView: React.FC = () => {
  const handleSave = () => {
    toast.success('Paramètres sauvegardés avec succès !');
  };

  return (
    <div className="flex-1 p-6 bg-[var(--color-bg-main)] overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#0052FF]" />
          Paramètres du Système
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4" /> Sécurité & Règles
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Seuil d'Alerte Critique (Score ML)</label>
                <input type="number" defaultValue={80} className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] rounded px-3 py-2 text-slate-900 outline-none" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Blocage auto. si Score &gt; 90</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0052FF]" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2 mb-4">
              <Database className="w-4 h-4" /> Intégration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">URL Apache Fineract</label>
                <input type="text" defaultValue="https://fineract-server.local/api/v1" className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] rounded px-3 py-2 text-slate-900 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Clé API Fraud Engine</label>
                <input type="password" defaultValue="****************" className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] rounded px-3 py-2 text-slate-900 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-[#0052FF] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Sauvegarder les Paramètres
          </button>
        </div>
      </div>
    </div>
  );
};
