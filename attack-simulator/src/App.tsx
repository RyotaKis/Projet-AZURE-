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

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const fireScenario = async (scenario: any) => {
    setLoading(true);
    addLog(`Firing: ${scenario.name}...`);
    try {
      const res = await fetch('http://localhost:4000/api/webhook/fineract', {
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
    <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0f172a', color: '#e2e8f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#38bdf8' }}>AZURE+ Attack Simulator</h1>
      <p>Injecte directement des payloads vers le Transaction Service (Port 4000).</p>
      
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '2rem' }}>
        {SCENARIOS.map((s, i) => (
          <button 
            key={i} 
            onClick={() => fireScenario(s)}
            disabled={loading}
            style={{ padding: '1rem', background: '#1e293b', border: '1px solid #334155', color: '#fff', cursor: 'pointer', borderRadius: '8px' }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '2rem', background: '#020617', padding: '1rem', borderRadius: '8px', minHeight: '200px', maxHeight: '400px', overflowY: 'auto' }}>
        <h3 style={{ color: '#94a3b8', marginTop: 0 }}>Terminal Logs</h3>
        {logs.map((l, i) => <div key={i} style={{ borderBottom: '1px solid #1e293b', padding: '4px 0' }}>{l}</div>)}
      </div>
    </div>
  );
}

export default App;
