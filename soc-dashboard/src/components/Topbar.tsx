import React from 'react';
import { Search, Bell, User, Cpu, Activity, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

interface TopbarProps {
  stats: {
    tps: number;
    fraudRate: number;
    latency: number;
  };
}

export const Topbar: React.FC<TopbarProps> = ({ stats }) => {
  return (
    <header className="fixed top-0 left-16 right-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-4">
        <img src="/LOGO DARK.png" alt="AZUR+ Logo" className="h-6 object-contain" />
        <h1 className="font-bold text-lg tracking-tight hidden md:block">AZUR<span className="text-[#0052FF] font-black">+</span> <span className="text-[10px] font-normal text-slate-400 ml-2 uppercase tracking-widest leading-none">Centre de Commandement</span></h1>
        <div className="h-4 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SYSTÃˆME OPÃ‰RATIONNEL 
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher transactions, utilisateurs..." 
            className="bg-slate-100/50 border-none rounded-md px-10 py-1.5 text-[10px] w-64 focus:ring-1 focus:ring-[#0052FF] focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-mono font-bold text-slate-500">{stats.latency}ms</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
              <User className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight hidden lg:block">OpÃ©rateur Principal</span>
          </div>
        </div>
      </div>
    </header>
  );
};
