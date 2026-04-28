import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Transaction } from '../types';
import { Globe, User, Clock } from 'lucide-react';

interface TransactionFeedProps {
  transactions: Transaction[];
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ transactions }) => {
  return (
    <div className="bg-white border border-slate-200 overflow-hidden flex flex-col h-full rounded shadow-sm">
      <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Flux de Transactions Live
        </h3>
        <span className="text-[9px] bg-slate-200 px-2 py-0.5 rounded uppercase font-bold text-slate-500">Données Brutes</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative terminal-overlay">
        <div className="absolute inset-0 overflow-y-auto font-mono text-[10px]">
          <AnimatePresence initial={false}>
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 border-b border-slate-50 transition-colors hover:bg-slate-50/80 ${
                  tx.status === 'Critique' ? 'bg-rose-50/30' : 
                  tx.status === 'warning' ? 'bg-amber-50/30' : ''
                }`}
              >
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-400">{tx.id}</span>
                  <span className={
                    tx.status === 'Critique' ? 'text-rose-600' : 
                    tx.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                  }>
                    {tx.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 mb-2">
                  <span className="truncate max-w-[120px]">{tx.user} ({tx.country})</span>
                  <span className="font-bold text-slate-700">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {tx.riskScore > 30 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${tx.riskScore}%` }}
                        className={`h-full ${tx.status === 'Critique' ? 'bg-rose-500' : 'bg-amber-500'}`}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">{tx.riskScore}%</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
