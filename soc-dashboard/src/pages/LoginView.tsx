import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@azur.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'une requête réseau
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@azur.com' && password === '123456') {
        toast.success('Authentification réussie');
        onLogin();
      } else {
        toast.error('Identifiants incorrects');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-main)] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#0052FF]/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#0052FF]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#0052FF]/20">
            <Shield className="w-8 h-8 text-[#0052FF]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            AZUR<span className="text-[#0052FF] font-black">+</span>
          </h1>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">Centre de Commandement SOC</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Adresse Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 focus:ring-1 focus:ring-[#0052FF] outline-none transition-shadow"
                placeholder="Entrez votre email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 focus:ring-1 focus:ring-[#0052FF] outline-none transition-shadow"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0052FF] text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <span className="animate-pulse">Vérification...</span>
            ) : (
              <>Se Connecter <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[var(--color-border-subtle)] pt-6">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Accès Sécurisé Réservé au Personnel Autorisé
          </p>
        </div>
      </div>
    </div>
  );
};
