import React from 'react';
import { Search, User, Wifi } from 'lucide-react';
import { toast } from 'sonner';

interface TopbarProps {
  stats: {
    latency: number;
  };
}

export const Topbar: React.FC<TopbarProps> = ({ stats }) => {
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = e.currentTarget.value;
      if (val) {
        toast.success(`Recherche lancée pour: ${val}`);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <header className="fixed top-0 left-16 right-0 h-14 bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] flex items-center justify-between px-6 z-40 transition-colors">
      <div className="flex items-center gap-4">
        <img src="/LOGO WHITE.png" alt="AZUR+ Logo" className="h-6 object-contain" />
        <h1 className="font-bold text-lg tracking-tight hidden md:block text-white">AZUR<span className="text-[#0052FF] font-black">+</span> <span className="text-[10px] font-normal text-slate-400 ml-2 uppercase tracking-widest leading-none">Centre de Commandement</span></h1>
        <div className="h-4 w-[1px] bg-[var(--color-border-subtle)] mx-2 hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SYSTÈME OPÉRATIONNEL 
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#0052FF] transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher transactions, utilisateurs... (Entrée)" 
            onKeyDown={handleSearch}
            className="bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] rounded-md px-10 py-1.5 text-[10px] w-64 focus:ring-1 focus:ring-[#0052FF] focus:bg-[var(--color-surface)] transition-all outline-none text-slate-300 placeholder-slate-600"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-mono font-bold text-slate-400">{stats.latency}ms</span>
          </div>
          <div className="flex items-center gap-2 border-l border-[var(--color-border-subtle)] pl-4">
            <div className="w-7 h-7 rounded-full bg-[var(--color-bg-main)] flex items-center justify-center text-slate-400 border border-[var(--color-border-subtle)]">
              <User className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight hidden lg:block text-slate-300">Opérateur Principal</span>
          </div>
        </div>
      </div>
    </header>
  );
};
