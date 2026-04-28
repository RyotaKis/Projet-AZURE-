import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './index.css'; // Make sure styles are loaded

const GATEWAY_URL = 'http://localhost:3000';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string>('DÉCONNECTÉ');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io(GATEWAY_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => setStatus('OPERATIONAL'));
    newSocket.on('disconnect', () => setStatus('CONNECTION LOST'));

    newSocket.on('INIT', (data) => {
      console.log('INIT event:', data);
    });

    newSocket.on('ALERT_NEW', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 10)); // Keep top 10
    });

    newSocket.on('TRANSACTION_FLOW', (tx) => {
      setTransactions(prev => [tx, ...prev].slice(0, 50)); // Keep last 50
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container antialiased h-screen overflow-hidden flex flex-col">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#0c1321] border-b border-[#00E5FF]/10 shadow-[0_0_20px_rgba(0,229,255,0.04)] font-['Space_Grotesk'] tracking-tight">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-[#00E5FF]">HYPER-VISOR</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="text-[#00E5FF] border-b-2 border-[#00E5FF] pb-1 hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 transition-colors duration-150" href="#">Network</a>
            <a className="text-[#dce2f6]/60 hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 transition-colors duration-150" href="#">Assets</a>
            <a className="text-[#dce2f6]/60 hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 transition-colors duration-150" href="#">Logs</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4 px-4 border-r border-outline-variant/30">
            <span className="material-symbols-outlined text-[#00E5FF] cursor-pointer hover:opacity-80">monitor_heart</span>
            <span className="material-symbols-outlined text-[#00E5FF] cursor-pointer hover:opacity-80">settings</span>
            <span className="material-symbols-outlined text-[#00E5FF] cursor-pointer hover:opacity-80">notifications</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-primary/20 bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-xs text-primary">person</span>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col z-40 bg-[#0c1321]/80 backdrop-blur-md border-r border-[#00E5FF]/10 font-['Inter']">
        <div className="p-6 border-b border-[#00E5FF]/5">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${status === 'OPERATIONAL' ? 'bg-secondary pulse-ring' : 'bg-error'}`}></div>
            <div>
              <div className="text-[#dce2f6] font-black tracking-widest text-xs">NODE_ALPHA</div>
              <div className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">{status}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4">
          <div className="px-3 mb-2 text-[10px] uppercase tracking-widest text-[#dce2f6]/40 font-bold">Command Center</div>
          <a className="flex items-center gap-3 px-6 py-3 bg-[#00E5FF]/10 text-[#00E5FF] border-r-4 border-[#00E5FF] transition-transform duration-200 translate-x-1" href="#">
            <span className="material-symbols-outlined text-lg">security</span>
            <span className="text-[10px] uppercase tracking-widest">Threat Matrix</span>
          </a>
          <a className="flex items-center gap-3 px-6 py-3 text-[#dce2f6]/40 hover:bg-[#00E5FF]/5 hover:text-[#dce2f6] transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">waterfall_chart</span>
            <span className="text-[10px] uppercase tracking-widest">Transaction Flow</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6 flex-1 flex flex-col gap-6 overflow-hidden">
        {/* ROW 1: Pulse Indicators */}
        <section className="grid grid-cols-4 gap-6 shrink-0">
          <div className="glass-card p-4 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Total Volume</span>
              <span className="material-symbols-outlined text-secondary text-sm">analytics</span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-headline font-bold text-on-surface leading-none tabular-nums">{transactions.length} TXs</div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Threats Deflected</span>
              <span className="material-symbols-outlined text-error text-sm">security_update_warning</span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-headline font-bold text-on-surface leading-none tabular-nums">{alerts.length} ALTs</div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-outline-variant/10 flex flex-col justify-between bg-surface-container-low">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">System Latency</span>
              <span className="material-symbols-outlined text-secondary text-sm">podium</span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-headline font-bold text-secondary leading-none tabular-nums">14ms</div>
            </div>
          </div>
        </section>

        {/* ROW 2: Transaction Waterfall & Alerts */}
        <section className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          
          {/* Transaction Waterfall */}
          <div className="col-span-8 glass-card rounded-xl border border-outline-variant/10 flex flex-col h-full overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-outline-variant/5 shrink-0">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">database</span>
                <h2 className="text-xs font-black uppercase tracking-widest">Interactive Transaction Waterfall</h2>
              </div>
              <span className="text-[10px] font-mono text-on-surface-variant/40">LIVE STREAM</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-separate border-spacing-y-1 px-4">
                <thead className="sticky top-0 bg-surface-container-low z-10">
                  <tr className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant/60">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="bg-surface-container-lowest/40 hover:bg-surface-container-highest/40 group transition-colors">
                      <td className="py-3 px-4 text-on-surface-variant/60">{new Date().toLocaleTimeString()}</td>
                      <td className="py-3 px-4 text-primary">#{tx.id || `TX-${idx}`}</td>
                      <td className="py-3 px-4 text-on-surface">{tx.amount} {tx.currency}</td>
                      <td className="py-3 px-4">
                         <span className="text-secondary font-bold text-[10px] tracking-widest uppercase">PROCESSED</span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-on-surface-variant/40 italic">Waiting for transactions...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Priority Intelligence Queue */}
          <div className="col-span-4 glass-card rounded-xl border border-outline-variant/10 flex flex-col h-full overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-outline-variant/5 shrink-0">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error">priority_high</span>
                <h2 className="text-xs font-black uppercase tracking-widest text-error">Priority Intelligence Queue</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {alerts.map((alert, idx) => (
                <div key={idx} className="bg-surface-container-highest/40 p-3 border border-error/20 hover:border-error/50 transition-all cursor-pointer rounded-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-error-container text-on-error-container text-[8px] px-1.5 py-0.5 font-black uppercase tracking-tighter">Critical Risk</span>
                    <span className="text-[9px] font-['JetBrains_Mono'] text-[#dce2f6]/40">Score: {alert.fraud_score}</span>
                  </div>
                  <div className="text-xs font-bold mb-1">TX: {alert.transaction_id}</div>
                  <div className="text-[10px] text-on-surface-variant font-['JetBrains_Mono']">Rules: {alert.rules_triggered?.map((r:any) => r.name).join(', ')}</div>
                </div>
              ))}
              {alerts.length === 0 && (
                 <div className="text-center text-on-surface-variant/40 text-[10px] mt-10">No critical alerts detected.</div>
              )}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

export default App;
