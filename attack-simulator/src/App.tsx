import React, { useState } from 'react';
import './App.css';

const SCENARIOS = [
  {
    name: 'Transaction Normale',
    payload: {
      eventType: 'TRANSACTION_CREATED',
      resourceId: `TXN_${Date.now()}`,
      clientId: 'CUST_1001',
      amount: 45,
      currency: 'EUR',
      account_id: 'ACC_001',
      user_id: 'Jean Dupont',
      device_id: 'DEV_IPHONE_12',
      country_txn: 'FR',
      avg_txn_amount: 50,
      known_devices: ['DEV_IPHONE_12', 'DEV_MACBOOK'],
      known_countries: ['FR', 'BE'],
      recent_tx_count_10min: 0
    }
  },
  {
    name: 'Fraude au Montant',
    payload: {
      eventType: 'TRANSACTION_CREATED',
      resourceId: `TXN_${Date.now()}`,
      clientId: 'CUST_1002',
      amount: 5000,
      currency: 'EUR',
      account_id: 'ACC_002',
      user_id: 'Jean Dupont',
      device_id: 'DEV_HACKER',
      country_txn: 'RU',
      avg_txn_amount: 120,
      known_devices: ['DEV_SAMSUNG_S21'],
      known_countries: ['FR'],
      recent_tx_count_10min: 6
    }
  },
  {
    name: 'Fraude Localisation (Impossible Travel)',
    payload: {
      eventType: 'TRANSACTION_CREATED',
      resourceId: `TXN_${Date.now()}`,
      clientId: 'CUST_1003',
      amount: 150,
      currency: 'EUR',
      account_id: 'ACC_003',
      user_id: 'Jean Dupont',
      device_id: 'DEV_NEW_IPHONE',
      country_txn: 'RU',
      avg_txn_amount: 20,
      known_devices: ['DEV_IPHONE_12'],
      known_countries: ['FR', 'UK'],
      recent_tx_count_10min: 8
    }
  },
  {
    name: 'Usurpation Appareil Inconnu',
    payload: {
      eventType: 'TRANSACTION_CREATED',
      resourceId: `TXN_${Date.now()}`,
      clientId: 'CUST_1004',
      amount: 1800,
      currency: 'EUR',
      account_id: 'ACC_004',
      user_id: 'Jean Dupont',
      device_id: 'DEV_HACKER_LINUX',
      country_txn: 'FR',
      avg_txn_amount: 300,
      known_devices: ['DEV_IPHONE_14'],
      known_countries: ['FR'],
      recent_tx_count_10min: 0
    }
  }
];

const TRANSACTION_SERVICE_URL = import.meta.env.VITE_TRANSACTION_SERVICE_URL || 'http://localhost:4000';

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const fireScenario = async (scenario: any) => {
    setLoading(true);
    const newLog = `[${new Date().toLocaleTimeString()}] Injection Payload: ${scenario.name}...`;
    setLogs(prev => [newLog, ...prev].slice(0, 50));
    try {
      const res = await fetch(`${TRANSACTION_SERVICE_URL}/api/webhook/fineract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...scenario.payload,
           resourceId: `TXN_${Date.now()}` // Dynamic ID
        })
      });
      const data = await res.json();
      addLog(`Success: ${JSON.stringify(data)}`);
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#f8fafc', color: '#0f172a', minHeight: '100vh' }}>
      <h1 style={{ color: '#0284c7' }}>AZURE+ Injecteur de Flux Métier</h1>
      <p style={{ color: '#475569' }}>Console d'injection de payloads vers le Transaction Service (Port 4000).</p>
      
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '2rem' }}>
        {SCENARIOS.map((s, i) => (
          <button 
            key={i} 
            onClick={() => fireScenario(s)}
            disabled={loading}
            style={{ padding: '1rem', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '2rem', background: '#ffffff', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', minHeight: '200px', maxHeight: '400px', overflowY: 'auto', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#64748b', marginTop: 0 }}>Terminal Logs</h3>
        {logs.map((l, i) => <div key={i} style={{ borderBottom: '1px solid #f1f5f9', padding: '4px 0', color: '#334155' }}>{l}</div>)}
      </div>
    </div>
  );
}

export default App;
