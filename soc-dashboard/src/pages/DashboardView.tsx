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
  };
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <KPIStrip stats={data.stats} />
      <div className="flex-1 flex overflow-hidden">
        <section className="w-[320px] bg-[var(--color-surface)] border-r border-[var(--color-border-subtle)] flex flex-col flex-shrink-0 overflow-hidden">
          <TransactionFeed transactions={data.transactions} />
        </section>
        <div className="flex-1 flex flex-col overflow-hidden bg-[var(--color-bg-main)]">
          <div className="flex-1 flex gap-4 p-4 overflow-hidden">
            <div className="flex-[1.5] h-full">
              <FraudMap />
            </div>
            <div className="flex-1 h-full min-w-[340px]">
              <AlertsPanel alerts={data.alerts} />
            </div>
          </div>
          <div className="h-[300px] p-4 pt-0 overflow-hidden">
            <AnalyticsGrid />
          </div>
        </div>
      </div>
    </div>
  );
};
