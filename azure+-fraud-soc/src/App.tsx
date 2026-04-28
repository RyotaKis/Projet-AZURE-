import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { KPIStrip } from './components/KPIStrip';
import { TransactionFeed } from './components/TransactionFeed';
import { AlertsPanel } from './components/AlertsPanel';
import { AnalyticsGrid } from './components/AnalyticsGrid';
import { FraudMap } from './components/FraudMap';
import { useSimulation } from './hooks/useSimulation';

export default function App() {
  const { transactions, alerts, stats } = useSimulation();

  return (
    <div className="h-screen bg-[var(--color-bg-main)] flex flex-row overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 ml-16 flex flex-col min-w-0">
        <Topbar stats={stats} />
        
        <main className="flex-1 mt-14 overflow-hidden flex flex-col">
          {/* KPI STRIP - Global Header */}
          <KPIStrip stats={stats} />

          <div className="flex-1 flex overflow-hidden">
            {/* Left Column: Transaction Feed (High Density) */}
            <section className="w-[320px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-hidden">
              <TransactionFeed transactions={transactions} />
            </section>

            {/* Main Area: Map & Charts */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
              <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                <div className="flex-[1.5] h-full">
                  <FraudMap />
                </div>
                <div className="flex-1 h-full min-w-[340px]">
                  <AlertsPanel alerts={alerts} />
                </div>
              </div>

              {/* Bottom Analytics */}
              <div className="h-[300px] p-4 pt-0 overflow-hidden">
                <AnalyticsGrid />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
