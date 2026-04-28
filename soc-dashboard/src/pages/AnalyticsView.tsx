import React from 'react';
import { AnalyticsGrid } from '../components/AnalyticsGrid';
import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';

export const AnalyticsView: React.FC = () => {
  const attackTypes = [
    { name: 'Account Takeover', value: 400, color: '#0052FF' },
    { name: 'Card Testing', value: 300, color: '#F59E0B' },
    { name: 'Synthetic Identity', value: 300, color: '#10B981' },
    { name: 'Phishing', value: 200, color: '#8B5CF6' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg-main)]">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#0052FF]" />
          Analytique & Rapports
        </h1>
        <p className="text-slate-400 text-xs">Aperçu détaillé des tendances de fraude et des performances du modèle IA.</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><ShieldCheck className="w-4 h-4 text-emerald-500" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taux de Précision IA</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">99.94%</div>
          <div className="text-[10px] font-bold text-emerald-500 mt-1">+0.02% vs hier</div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-500/10 rounded-lg"><AlertTriangle className="w-4 h-4 text-rose-500" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Faux Positifs</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">0.06%</div>
          <div className="text-[10px] font-bold text-emerald-500 mt-1">-0.01% vs hier</div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg"><TrendingUp className="w-4 h-4 text-blue-500" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temps Rép. Moyen</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">124ms</div>
          <div className="text-[10px] font-bold text-emerald-500 mt-1">Optimum</div>
        </div>
        <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg"><BarChart3 className="w-4 h-4 text-amber-500" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Montant Préservé</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">$4.2M</div>
          <div className="text-[10px] font-bold text-slate-500 mt-1">Ce mois-ci</div>
        </div>
      </div>

      {/* Main Grid (reusing component) */}
      <div className="mb-6">
        <AnalyticsGrid />
      </div>

      {/* Extra Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border-subtle)] h-[300px] flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Typologie des Attaques Bloquées</h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attackTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attackTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border-subtle)] h-[300px] flex flex-col items-center justify-center text-center">
           <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Rapport Automatisé SHAP</h4>
           <p className="text-[11px] text-slate-500 mb-6 max-w-sm">Génération de rapports explicatifs d'IA pour les autorités de régulation financière (ACPR).</p>
           <button className="bg-[#0052FF] text-white px-6 py-2 rounded uppercase font-bold text-[10px] tracking-widest hover:bg-blue-700 transition-colors">
             Générer le Rapport Mensuel PDF
           </button>
        </div>
      </div>
    </div>
  );
};
