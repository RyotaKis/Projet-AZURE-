import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { useRealTimeData } from './hooks/useRealTimeData';
import { DashboardView } from './pages/DashboardView';
import { AlertsView } from './pages/AlertsView';
import { TransactionsView } from './pages/TransactionsView';
import { GeoWatchView } from './pages/GeoWatchView';
import { AnalyticsView } from './pages/AnalyticsView';
import { IdentityView } from './pages/IdentityView';
import { LogsView } from './pages/LogsView';

export default function App() {
  const data = useRealTimeData();

  return (
    <Router>
      <Toaster theme="dark" position="top-right" />
      <div className="h-screen bg-[var(--color-bg-main)] flex flex-row overflow-hidden text-[var(--color-text-main)]">
        <Sidebar />
        
        <div className="flex-1 ml-16 flex flex-col min-w-0">
          <Topbar stats={data.stats} />
          
          <main className="flex-1 mt-14 overflow-hidden flex flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardView data={data} />} />
              <Route path="/alerts" element={<AlertsView data={data} />} />
              <Route path="/transactions" element={<TransactionsView data={data} />} />
              <Route path="/geo-watch" element={<GeoWatchView data={data} />} />
              <Route path="/analytics" element={<AnalyticsView />} />
              <Route path="/identity" element={<IdentityView />} />
              <Route path="/logs" element={<LogsView />} />
              <Route path="*" element={<div className="p-8 flex items-center justify-center h-full text-[var(--color-text-muted)]">Vue introuvable.</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
