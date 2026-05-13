import React from 'react';
import { KPIStrip } from '../components/KPIStrip';
import { TransactionFeed } from '../components/TransactionFeed';
import { AlertsPanel } from '../components/AlertsPanel';
import { AnalyticsGrid } from '../components/AnalyticsGrid';
import { FraudMap } from '../components/FraudMap';
import type { Transaction, Alert } from '../types';

interface DashboardViewProps {
  data: {
    transactions: Transaction[];
    alerts: Alert[];
    stats: any;
    socket?: any;
    setAlerts?: React.Dispatch<React.SetStateAction<Alert[]>>;
  };
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--color-bg-main)] p-6 gap-6">
      <KPIStrip stats={data.stats} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Colonne de gauche: Carte + Analytiques (très grand) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="h-[600px] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden shadow-sm relative">
            <FraudMap />
          </div>
          <div className="h-[400px] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden p-6 shadow-sm">
            <AnalyticsGrid />
          </div>
        </div>

        {/* Colonne de droite: Alertes + Flux */}
        <div className="flex flex-col gap-6">
          <div className="h-[450px] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden shadow-sm">
            <AlertsPanel alerts={data.alerts} setAlerts={data.setAlerts} socket={data.socket} />
          </div>
          <div className="h-[550px] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden shadow-sm">
            <TransactionFeed transactions={data.transactions} />
          </div>
        </div>

      </div>
    </div>
  );
};
