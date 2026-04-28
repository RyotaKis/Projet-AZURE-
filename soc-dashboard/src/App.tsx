import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

const GATEWAY_URL = 'http://localhost:3000';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string>('Déconnecté');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io(GATEWAY_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => setStatus('Connecté 🟢'));
    newSocket.on('disconnect', () => setStatus('Déconnecté 🔴'));

    newSocket.on('INIT', (data) => {
      console.log('INIT event:', data);
    });

    newSocket.on('ALERT_NEW', (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    newSocket.on('TRANSACTION_FLOW', (tx) => {
      setTransactions(prev => [tx, ...prev].slice(0, 50)); // Keep last 50
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="soc-container" style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh', boxSizing: 'border-box' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: '#3b82f6' }}>AZURE+ SOC War Room</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#888' }}>Statut Gateway : {status}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px' }}>
          <h2 style={{ color: '#ef4444', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>🚨 Alertes Récentes ({alerts.length})</h2>
          {alerts.length === 0 ? <p style={{ color: '#666' }}>Aucune alerte critique.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {alerts.map((a, i) => (
                <li key={i} style={{ padding: '0.75rem', backgroundColor: '#2d1b1b', marginBottom: '0.5rem', borderRadius: '4px', borderLeft: '4px solid #ef4444' }}>
                  Alerte : {JSON.stringify(a)}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '8px' }}>
          <h2 style={{ color: '#10b981', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>💸 Flux Transactions ({transactions.length})</h2>
          {transactions.length === 0 ? <p style={{ color: '#666' }}>En attente de transactions...</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {transactions.map((tx, i) => (
                <li key={i} style={{ padding: '0.75rem', backgroundColor: '#1b2d24', marginBottom: '0.5rem', borderRadius: '4px', borderLeft: '4px solid #10b981' }}>
                  TX : {JSON.stringify(tx)}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
