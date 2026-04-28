import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  History, 
  BarChart3, 
  Map as MapIcon, 
  Settings, 
  Users, 
  Database,
  Lock
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', Actives: true },
  { icon: ShieldAlert, label: 'Alerts', badge: 12 },
  { icon: History, label: 'Transactions' },
  { icon: MapIcon, label: 'Geo-Watch' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Users, label: 'Identity' },
  { icon: Database, label: 'Logs' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-[#0F172A] flex flex-col items-center py-6 gap-8 z-50 flex-shrink-0 transition-all duration-300">
      <div className="w-10 h-10 bg-[#0052FF] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
        A+
      </div>

      <nav className="flex flex-col gap-6 text-slate-400">
        <div className="text-[#0052FF] cursor-pointer hover:text-white transition-colors">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div className="hover:text-white cursor-pointer transition-colors relative">
          <ShieldAlert className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </div>
        <div className="hover:text-white cursor-pointer transition-colors">
          <History className="w-6 h-6" />
        </div>
        <div className="hover:text-white cursor-pointer transition-colors">
          <MapIcon className="w-6 h-6" />
        </div>
        <div className="hover:text-white cursor-pointer transition-colors">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div className="hover:text-white cursor-pointer transition-colors">
          <Users className="w-6 h-6" />
        </div>
      </nav>

      <div className="mt-auto mb-4 text-slate-500 hover:text-white cursor-pointer transition-colors">
        <Settings className="w-6 h-6" />
      </div>
    </aside>
  );
};
