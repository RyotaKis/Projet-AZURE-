import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, ShieldAlert, Smartphone, MapPin, 
  Terminal, X, Play, ShieldCheck, Database, 
  Zap, Cpu, Globe
} from 'lucide-react';
import './App.css';

const TRANSACTION_SERVICE_URL = import.meta.env.VITE_TRANSACTION_SERVICE_URL || 'https://azur-transaction-service.onrender.com';

const SCENARIOS = [
  {
    id: 1,
    name: 'Transaction Normale',
    desc: 'Comportement d\'achat standard',
    icon: ShieldCheck,
    riskBadge: 'risk-low',
    riskScore: '12/100',
    color: '#10b981',
    payload: {
      eventType: 'TRANSACTION_CREATED',
      clientId: 'CUST_1001',
      amount: 45000,
      currency: 'FCFA',
      account_id: 'ACC_001',
      user_id: 'Sena Dossou',
      device_id: 'DEV_IPHONE_12',
      country_txn: 'FR',
      avg_txn_amount: 50000,
      known_devices: ['DEV_IPHONE_12', 'DEV_MACBOOK'],
      known_countries: ['FR', 'BE'],
      recent_tx_count_10min: 0
    }
  },
  {
    id: 2,
    name: 'Fraude au Montant',
    desc: 'High Amount Anomaly',
    icon: Activity,
    riskBadge: 'risk-high',
    riskScore: '94/100',
    color: '#ef4444',
    payload: {
      eventType: 'TRANSACTION_CREATED',
      clientId: 'CUST_1002',
      amount: 3500000,
      currency: 'FCFA',
      account_id: 'ACC_002',
      user_id: 'Sena Dossou',
      device_id: 'DEV_HACKER',
      country_txn: 'RU',
      avg_txn_amount: 120000,
      known_devices: ['DEV_SAMSUNG_S21'],
      known_countries: ['FR'],
      recent_tx_count_10min: 6
    }
  },
  {
    id: 3,
    name: 'Fraude Localisation',
    desc: 'Impossible Travel Anomaly',
    icon: MapPin,
    riskBadge: 'risk-high',
    riskScore: '88/100',
    color: '#f59e0b',
    payload: {
      eventType: 'TRANSACTION_CREATED',
      clientId: 'CUST_1003',
      amount: 150000,
      currency: 'FCFA',
      account_id: 'ACC_003',
      user_id: 'Sena Dossou',
      device_id: 'DEV_NEW_IPHONE',
      country_txn: 'RU',
      avg_txn_amount: 120000,
      known_devices: ['DEV_IPHONE_12'],
      known_countries: ['FR', 'UK'],
      recent_tx_count_10min: 8
    }
  },
  {
    id: 4,
    name: 'Usurpation Appareil',
    desc: 'Unknown Device Anomaly',
    icon: Smartphone,
    riskBadge: 'risk-high',
    riskScore: '91/100',
    color: '#8b5cf6',
    payload: {
      eventType: 'TRANSACTION_CREATED',
      clientId: 'CUST_1004',
      amount: 1800000,
      currency: 'FCFA',
      account_id: 'ACC_004',
      user_id: 'Sena Dossou',
      device_id: 'DEV_HACKER_LINUX',
      country_txn: 'FR',
      avg_txn_amount: 300000,
      known_devices: ['DEV_IPHONE_14'],
      known_countries: ['FR'],
      recent_tx_count_10min: 0
    }
  }
];

type LogEntry = { time: string; badge: string; msg: string; type: string };

function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectSuccess, setInjectSuccess] = useState(false);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (badge: string, msg: string, type: string) => {
    const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    setLogs(prev => [...prev, { time, badge, msg, type }].slice(-100)); // Garder les 100 derniers
  };

  const handleFireScenario = async () => {
    if (!selectedScenario) return;
    setIsInjecting(true);
    setInjectSuccess(false);
    
    addLog('INFO', `Payload injected: ${selectedScenario.name}`, 'INFO');
    
    try {
      const res = await fetch(`${TRANSACTION_SERVICE_URL}/api/webhook/fineract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...selectedScenario.payload,
           resourceId: `TXN_${Date.now()}`
        })
      });
      const data = await res.json();
      
      addLog('SUCCESS', `Fraud Engine responded : OK`, 'SUCCESS');
      addLog('SCORE', `Fraud Score Expected : ~${selectedScenario.riskScore.split('/')[0]}`, 'SCORE');
      addLog('INFO', `WS EVENT 'ALERT_NEW' emitted via API Gateway`, 'INFO');
      
      setInjectSuccess(true);
      setTimeout(() => {
        setIsInjecting(false);
        setInjectSuccess(false);
        setSelectedScenario(null); // Fermer le drawer
      }, 1500);

    } catch (err: any) {
      addLog('ERROR', `Connection Failed: ${err.message}`, 'ERROR');
      setIsInjecting(false);
    }
  };

  const formatJson = (obj: any) => {
    const jsonStr = JSON.stringify(obj, null, 2);
    return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) cls = 'json-key';
        else cls = 'json-string';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  return (
    <div className="cyber-app">
      {/* 1. LIVE ENGINE STATUS BAR */}
      <header className="live-status-bar">
        <div className="status-brand">
          <ShieldAlert size={20} />
          AZUR+ <span>| Injecteur</span>
        </div>
        <div className="status-badges">
          <div className="status-item"><div className="dot online"></div> API Gateway : ONLINE</div>
          <div className="status-item"><div className="dot online"></div> Fraud Engine : ONLINE</div>
          <div className="status-item"><div className="dot online"></div> Core Ledger : ONLINE</div>
          <div className="status-item"><div className="dot online"></div> WebSocket : CONNECTED</div>
        </div>
      </header>

      <main className="main-content">
        <div className="page-header">
          <h1>Console d'Ingénierie</h1>
          <p>Simulation de payloads déterministes pour validation du modèle Machine Learning.</p>
        </div>

        {/* 2. SCENARIO CARDS GRID */}
        <div className="scenario-grid">
          {SCENARIOS.map((s) => (
            <div key={s.id} className="scenario-card" onClick={() => setSelectedScenario(s)}>
              <div className="card-header">
                <div className="icon-wrapper" style={{ color: s.color }}>
                  <s.icon size={24} />
                </div>
                <span className={`risk-badge ${s.riskBadge}`}>Risk: {s.riskScore}</span>
              </div>
              <div className="card-body">
                <h3 style={{ color: s.color }}>{s.name}</h3>
                <p>{s.desc}</p>
                
                <div className="payload-preview">
                  <div className="preview-row">
                    <span className="preview-label">User :</span>
                    <span className="preview-value">{s.payload.user_id}</span>
                  </div>
                  <div className="preview-row">
                    <span className="preview-label">Amount :</span>
                    <span className="preview-value">{s.payload.amount} FCFA</span>
                  </div>
                  <div className="preview-row">
                    <span className="preview-label">Country :</span>
                    <span className="preview-value">{s.payload.country_txn}</span>
                  </div>
                </div>
              </div>
              <button className="btn-inject" onClick={(e) => { e.stopPropagation(); setSelectedScenario(s); }}>
                Inspecter le payload <Play size={16} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>

        {/* 3. CYBER PREMIUM TERMINAL */}
        <div className="cyber-terminal-container">
          <div className="terminal-header">
            <div className="terminal-title">
              <Terminal size={16} /> azur-soc-terminal ~ root@gateway
            </div>
            <div className="terminal-actions">
              <div className="circle red"></div>
              <div className="circle yellow"></div>
              <div className="circle green"></div>
            </div>
          </div>
          <div className="terminal-logs">
            {logs.map((l, i) => (
              <div key={i} className={`log-line ${l.type}`}>
                <span className="log-time">[{l.time}]</span>
                <span className={`log-badge ${l.badge}`}>{l.badge.padEnd(8)}</span>
                <span className="log-msg">{l.msg}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </main>

      {/* 4. PAYLOAD INSPECTOR (LATERAL DRAWER) */}
      {selectedScenario && (
        <div className="drawer-overlay" onClick={() => !isInjecting && setSelectedScenario(null)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h2><Cpu size={24} color="#0ea5e9" /> Payload Inspector</h2>
              <button className="btn-close" onClick={() => !isInjecting && setSelectedScenario(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="drawer-content">
              <div>
                <span className="drawer-section-title">Métadonnées de Simulation</span>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                    Target: Transaction Service
                  </div>
                  <div style={{ padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                    Method: POST
                  </div>
                </div>
              </div>

              <div>
                <span className="drawer-section-title">Raw JSON Payload</span>
                <pre className="json-block" dangerouslySetInnerHTML={{ __html: formatJson(selectedScenario.payload) }} />
              </div>
            </div>

            <div className="drawer-footer">
              <button 
                className={`btn-fire ${isInjecting ? 'loading' : ''} ${injectSuccess ? 'success' : ''}`}
                onClick={handleFireScenario}
                disabled={isInjecting || injectSuccess}
              >
                {isInjecting ? (
                   <><Zap className="spin" size={20} /> Injection en cours...</>
                ) : injectSuccess ? (
                   <><ShieldCheck size={20} /> Succès !</>
                ) : (
                   <><Play size={20} fill="currentColor" /> Confirmer l'Injection</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
