import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Transaction } from '../types';
import { Globe, User, Clock } from 'lucide-react';

interface TransactionFeedProps {
  transactions: Transaction[];
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ transactions }) => {
  return (
    <div className="bg-[var(--color-surface)] border-none overflow-hidden flex flex-col h-full rounded-none">
      <div className="p-3 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-[var(--color-bg-main)]">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Flux de Transactions Live
        </h3>
        <span className="text-[9px] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2 py-0.5 rounded uppercase font-bold text-slate-400">Données Brutes</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative terminal-overlay">
        <div className="absolute inset-0 overflow-y-auto font-mono text-[10px]">
          <AnimatePresence initial={false}>
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 border-b border-slate-800/50 transition-colors hover:bg-slate-800/30 ${
                  tx.status === 'critical' ? 'bg-rose-900/20' : 
                  tx.status === 'warning' ? 'bg-amber-900/20' : ''
                }`}
              >
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-500">{tx.id}</span>
                  <span className={
                    tx.status === 'critical' ? 'text-rose-500' : 
                    tx.status === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                  }>
                    {tx.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 mb-2">
                  <span className="truncate max-w-[120px]">{tx.user} ({tx.country})</span>
                  <span className="font-bold text-slate-300">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {tx.riskScore > 30 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${tx.riskScore}%` }}
                        className={`h-full ${tx.status === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500">{tx.riskScore}%</span>
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
