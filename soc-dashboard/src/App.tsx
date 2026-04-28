import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, Activity, Database, AlertOctagon, CheckCircle2 } from 'lucide-react';
import './index.css';

const GATEWAY_URL = 'http://localhost:3000';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string>('DÉCONNECTÉ');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Fake data for the initial chart
  const [chartData, setChartData] = useState<any[]>([
    { time: '10:00', volume: 120, fraud: 5 },
    { time: '10:05', volume: 210, fraud: 8 },
    { time: '10:10', volume: 180, fraud: 15 },
    { time: '10:15', volume: 300, fraud: 12 },
    { time: '10:20', volume: 250, fraud: 40 },
    { time: '10:25', volume: 190, fraud: 9 }
  ]);

  useEffect(() => {
    const newSocket = io(GATEWAY_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => setStatus('OPÉRATIONNEL'));
    newSocket.on('disconnect', () => setStatus('PERTE DE CONNEXION'));

    newSocket.on('ALERT_NEW', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 20));
      // Update chart dynamically
      setChartData(prev => {
        const newData = [...prev.slice(1), { time: new Date().toLocaleTimeString().substring(0, 5), volume: Math.floor(Math.random() * 200) + 100, fraud: prev[prev.length - 1].fraud + 5 }];
        return newData;
      });
    });

    newSocket.on('TRANSACTION_FLOW', (tx) => {
      setTransactions(prev => [tx, ...prev].slice(0, 50));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-fraud';
    if (score >= 40) return 'text-suspect';
    return 'text-safe';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-fraud/10 border-fraud/30';
    if (score >= 40) return 'bg-suspect/10 border-suspect/30';
    return 'bg-safe/10 border-safe/30';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 bg-surface border-b border-border-line flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <img src="/LOGO WHITE.png" alt="AZUR+ Logo" className="h-8 object-contain" />
          <div className="h-6 w-px bg-border-line mx-2"></div>
          <h1 className="text-lg font-semibold tracking-wide">AZUR+</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">Status Gateway:</span>
            <div className={`flex items-center gap-2 text-xs font-mono px-2 py-1 rounded border ${status === 'OPÉRATIONNEL' ? 'bg-safe/10 text-safe border-safe/20' : 'bg-fraud/10 text-fraud border-fraud/20'}`}>
              <div className={`w-2 h-2 rounded-full ${status === 'OPÉRATIONNEL' ? 'bg-safe animate-pulse' : 'bg-fraud'}`}></div>
              {status}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Column: Analytics & Queue */}
        <section className="w-1/3 flex flex-col gap-4 min-w-[350px]">
          {/* Analytics Chart */}
          <div className="bg-surface border border-border-line rounded-lg p-4 h-1/3 flex flex-col shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Volume d'Anomalies (Temps Réel)</h2>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#374151" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#374151" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#151b23', border: '1px solid #374151', borderRadius: '4px' }} />
                  <Area type="monotone" dataKey="fraud" stroke="#ef4444" fillOpacity={1} fill="url(#colorFraud)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Queue */}
          <div className="bg-surface border border-border-line rounded-lg p-4 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-fraud" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">File d'Attente des Menaces</h2>
              </div>
              <span className="text-xs bg-fraud/20 text-fraud px-2 py-0.5 rounded font-mono border border-fraud/30">
                {alerts.length} ALERTES
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {alerts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted/50 gap-2">
                  <CheckCircle2 className="w-8 h-8" />
                  <span className="text-sm">Aucune menace critique active.</span>
                </div>
              ) : (
                alerts.map((alert, idx) => (
                  <div key={idx} className="p-3 bg-background border border-fraud/20 rounded hover:border-fraud/50 transition-colors cursor-pointer border-l-4 border-l-fraud">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs text-text-muted">{alert.transaction_id || `ALT-${idx}`}</span>
                      <span className="font-mono text-xs font-bold text-fraud">Score: {alert.fraud_score}</span>
                    </div>
                    <div className="text-sm font-medium mb-1">Investigation Requise</div>
                    <div className="text-xs text-text-muted">
                      Règles: {alert.rules_triggered?.map((r:any) => r.rule || r.name).join(', ') || 'Modèle ML'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Transaction Waterfall */}
        <section className="flex-1 bg-surface border border-border-line rounded-lg flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 border-b border-border-line flex justify-between items-center shrink-0 bg-surface">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Flux de Transactions Live</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-mono text-text-muted">ECOUTE ACTIVE</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-background sticky top-0 z-10 shadow-sm">
                <tr className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-4 font-normal">Timestamp</th>
                  <th className="py-3 px-4 font-normal">ID Transaction</th>
                  <th className="py-3 px-4 font-normal text-right">Montant</th>
                  <th className="py-3 px-4 font-normal text-center">Score Risque</th>
                  <th className="py-3 px-4 font-normal text-center">Décision</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm divide-y divide-border-line/50">
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-text-muted/50 italic text-xs font-sans">
                      En attente de nouvelles transactions...
                    </td>
                  </tr>
                )}
                {transactions.map((tx, idx) => {
                  const score = tx.fraud_score || Math.floor(Math.random() * 100); // Simulate score if not provided yet
                  return (
                    <tr key={idx} className="hover:bg-surface-hover transition-colors">
                      <td className="py-3 px-4 text-text-muted text-xs">{new Date().toLocaleTimeString()}</td>
                      <td className="py-3 px-4 font-medium">{tx.id || `TX-${Math.floor(Math.random()*10000)}`}</td>
                      <td className="py-3 px-4 text-right">{tx.amount.toLocaleString()} {tx.currency || 'XOF'}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-1 text-xs rounded border ${getScoreBg(score)}`}>
                          {score >= 80 ? 'BLOCAGE' : score >= 40 ? 'SUSPECT' : 'VALIDÉ'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
