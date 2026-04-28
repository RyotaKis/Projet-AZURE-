import React, { useState } from 'react';
import { Users, Fingerprint, MapPin, Globe, ShieldOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const IdentityView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 'USR_982', name: 'Jean Dupont', risk: 'critical', location: 'Paris, FR', lastIp: '192.168.1.42', devices: 4, isBlocked: false },
    { id: 'USR_104', name: 'Alice Smith', risk: 'safe', location: 'London, UK', lastIp: '10.0.0.12', devices: 1, isBlocked: false },
    { id: 'USR_753', name: 'Carlos Gomez', risk: 'warning', location: 'Madrid, ES', lastIp: '172.16.0.4', devices: 2, isBlocked: false },
    { id: 'USR_221', name: 'Marie Curie', risk: 'critical', location: 'Berlin, DE', lastIp: '198.51.100.2', devices: 7, isBlocked: true },
  ];

  const handleAction = (id: string, action: string) => {
    toast.success(`Action "${action}" appliquée à ${id}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-bg-main)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0052FF]" />
            Identity & KYC Intelligence
          </h1>
          <p className="text-slate-400 text-xs">Suivi comportemental des utilisateurs et Device Fingerprinting.</p>
        </div>
        <input 
          type="text" 
          placeholder="Rechercher utilisateur, IP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2 text-[11px] text-white focus:ring-1 focus:ring-[#0052FF] outline-none"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-y-auto">
        {users.map(user => (
          <div key={user.id} className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-6 rounded-xl relative overflow-hidden group">
            {user.isBlocked && (
              <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                Compte Bloqué
              </div>
            )}
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-[var(--color-border-subtle)] text-slate-300 font-bold text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{user.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">{user.id}</span>
                </div>
              </div>
              <div className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                user.risk === 'critical' ? 'bg-rose-900/30 text-rose-500 border-rose-500/50' : 
                user.risk === 'warning' ? 'bg-amber-900/30 text-amber-500 border-amber-500/50' : 
                'bg-emerald-900/30 text-emerald-500 border-emerald-500/50'
              }`}>
                RISQUE: {user.risk}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {user.location}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                <Globe className="w-3.5 h-3.5 text-slate-500" /> {user.lastIp}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <Fingerprint className="w-3.5 h-3.5 text-slate-500" /> {user.devices} appareils liés
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleAction(user.id, 'Investigation KYC')}
                className="flex-1 bg-[var(--color-bg-main)] hover:bg-[#0052FF] text-slate-300 hover:text-white border border-[var(--color-border-subtle)] hover:border-[#0052FF] transition-colors py-2 rounded text-[10px] font-bold uppercase tracking-widest"
              >
                Auditer KYC
              </button>
              <button 
                onClick={() => handleAction(user.id, user.isBlocked ? 'Débloquer' : 'Bloquer')}
                className={`flex-1 flex items-center justify-center gap-2 border transition-colors py-2 rounded text-[10px] font-bold uppercase tracking-widest ${
                  user.isBlocked 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50 hover:bg-emerald-500 hover:text-white' 
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/50 hover:bg-rose-500 hover:text-white'
                }`}
              >
                {user.isBlocked ? <><CheckCircle2 className="w-3 h-3"/> Débloquer</> : <><ShieldOff className="w-3 h-3"/> Suspendre</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
