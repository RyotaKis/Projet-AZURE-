import React from 'react';
import { NavLink } from 'react-router-dom';
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
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: ShieldAlert, label: 'Alerts', path: '/alerts', badge: 12 },
  { icon: History, label: 'Transactions', path: '/transactions' },
  { icon: MapIcon, label: 'Geo-Watch', path: '/geo-watch' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'Identity', path: '/identity' },
  { icon: Database, label: 'Logs', path: '/logs' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-[var(--color-sidebar-bg)] flex flex-col items-center py-6 gap-8 z-50 flex-shrink-0 border-r border-[var(--color-border-subtle)]">
      <div className="w-12 h-12 flex items-center justify-center">
        <img src="/LOGO DARK.png" alt="Logo" className="w-full h-full object-contain" />
      </div>

      <nav className="flex flex-col gap-6 w-full items-center">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            title={item.label}
            className={({ isActive }) => 
              `relative cursor-pointer transition-colors p-2 rounded-md ${
                isActive ? 'text-[#0052FF] bg-[var(--color-surface)]' : 'text-slate-500 hover:text-slate-900 hover:bg-[var(--color-surface)]'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            {item.badge && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto mb-4 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors p-2 hover:bg-[var(--color-surface)] rounded-md">
        <Settings className="w-6 h-6" />
      </div>
    </aside>
  );
};
