import React, { useState } from 'react';
import type { Transaction } from '../types';
import { History, Search, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionsViewProps {
  data: {
    transactions: Transaction[];
  };
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTxs = data.transactions.filter(tx => 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    toast.success('Export CSV généré avec succès.');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-bg-main)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <History className="w-5 h-5 text-[#0052FF]" />
            Registre des Transactions
          </h1>
          <p className="text-slate-400 text-xs">Historique complet des flux financiers et scores IA associés.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher ID, Utilisateur, Pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-lg pl-10 pr-4 py-2 text-[11px] text-white focus:ring-1 focus:ring-[#0052FF] outline-none"
            />
          </div>
          <button className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-slate-300 px-4 py-2 rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" /> Filtres
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#0052FF] text-white px-4 py-2 rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#05080f] sticky top-0 z-10 shadow-sm border-b border-[var(--color-border-subtle)]">
              <tr>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">ID Transaction</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date & Heure</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Utilisateur</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Montant</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Localisation</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Score IA</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.length > 0 ? filteredTxs.map((tx) => (
                <tr key={tx.id} className="border-b border-[var(--color-border-subtle)] hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono text-[11px] text-slate-300">{tx.id}</td>
                  <td className="p-4 text-[11px] text-slate-400">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-[11px] font-bold text-white">{tx.user}</td>
                  <td className="p-4 text-[11px] font-mono text-slate-300">
                    {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {tx.currency}
                  </td>
                  <td className="p-4 text-[11px] text-slate-400">{tx.country}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-300">{tx.riskScore}%</span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${tx.status === 'critical' ? 'bg-rose-500' : tx.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${tx.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                      tx.status === 'critical' ? 'bg-rose-900/50 text-rose-400 border border-rose-500/30' :
                      tx.status === 'warning' ? 'bg-amber-900/50 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                    Aucune transaction trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between bg-[#05080f]">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Affichage de {filteredTxs.length} résultats</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded text-[10px] text-slate-400 hover:text-white transition-colors disabled:opacity-50">Précédent</button>
            <button className="px-3 py-1 bg-[#0052FF] text-white rounded text-[10px] font-bold">1</button>
            <button className="px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded text-[10px] text-slate-400 hover:text-white transition-colors disabled:opacity-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
};
