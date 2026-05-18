import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, CreditCard, User, ShieldAlert, Lock, Fingerprint, 
  LogOut, Wallet, CheckCircle,  
  Bell, MapPin, Smartphone, Activity, Zap, ShieldCheck
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './App.css';

const CORRECT_PIN = "1234";
const TARGET_USER = "Sena Dossou";
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'https://azur-api-gateway.onrender.com';

// --- Composant PIN PAD Sécurisé ---
const PinPad = ({ onPinComplete, error, label }: { onPinComplete: (pin: string) => void, error: boolean, label: string }) => {
  const [pin, setPin] = useState("");
  
  const handleKey = (d: string) => {
    if (pin.length < 4) {
      const newPin = pin + d;
      setPin(newPin);
      if (newPin.length === 4) {
        onPinComplete(newPin);
        setTimeout(() => setPin(""), 500); // reset for next time or error
      }
    }
  };

  return (
    <div className="pin-pad-container">
      <div className="alert-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb', animation: 'none' }}>
        <Fingerprint size={32} />
      </div>
      <h3 style={{ margin: 0 }}>{label}</h3>
      <div className={`pin-dots ${error ? 'error-shake' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''}`} />
        ))}
      </div>
      <div className="pin-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <button key={d} className="pin-key" onClick={() => handleKey(d.toString())}>{d}</button>
        ))}
        <div />
        <button className="pin-key" onClick={() => handleKey("0")}>0</button>
        <div />
      </div>
    </div>
  );
};

// --- Composant Carte 3D ---
const Card3D = ({ isBlocked }: { isBlocked: boolean }) => {
  return (
    <motion.div 
      className={`credit-card-3d ${isBlocked ? 'card-blocked' : ''}`}
      whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {isBlocked && <div className="blocked-badge">BLOQUÉE</div>}
      <div className="card-top">
        <div className="chip"></div>
        <div style={{ fontWeight: 800, fontSize: '1.2rem', fontStyle: 'italic' }}>VISA</div>
      </div>
      <div className="card-number">
        **** **** **** 1420
      </div>
      <div className="card-bottom">
        <div>
          <div className="card-label">Card Holder</div>
          <div className="card-value">{TARGET_USER.toUpperCase()}</div>
        </div>
        <div>
          <div className="card-label">Expires</div>
          <div className="card-value">12/28</div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Composant Dashboard & Analytics ---
const AIConfidenceGauge = ({ score }: { score: number }) => {
  const data = [{ name: 'Score', value: score, fill: score > 80 ? '#ef4444' : '#10b981' }];
  return (
    <div className="ai-score-container">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8} data={data} startAngle={90} endAngle={-270}>
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className={`ai-score-value ${score > 80 ? 'suspect' : ''}`}>{score}</div>
    </div>
  );
};

const ExpenseChart = () => {
  const data = [
    { name: 'Lun', val: 40 }, { name: 'Mar', val: 30 }, { name: 'Mer', val: 80 },
    { name: 'Jeu', val: 45 }, { name: 'Ven', val: 120 }, { name: 'Sam', val: 20 }, { name: 'Dim', val: 60 }
  ];
  return (
    <div style={{ height: '60px', width: '100%', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="val" stroke="#2563eb" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Composant Principal ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [balance, setBalance] = useState(4520.00);
  
  const [alerts, setAlerts] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);
  
  const [pendingAction, setPendingAction] = useState<'APPROVE' | 'BLOCK' | null>(null);
  const [pendingAlertId, setPendingAlertId] = useState<string | null>(null);
  const [showPinPad, setShowPinPad] = useState(false);
  
  const [isCardBlocked, setIsCardBlocked] = useState(false);
  const [toastAlert, setToastAlert] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<{title: string, message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    // Demande de permission pour Web Push API
    if ('Notification' in window) Notification.requestPermission();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

    const script = document.createElement('script');
    script.src = "https://cdn.socket.io/4.7.4/socket.io.min.js";
    script.onload = () => {
      const ioSocket = (window as any).io(GATEWAY_URL);
      
      ioSocket.on('connect', () => console.log('✅ Connecté au Gateway'));
      
      ioSocket.on('ALERT_NEW', (data: any) => {
        if (data.user === TARGET_USER || data.user_id === TARGET_USER) {
          
          // Simulation de mise à jour du solde si l'alerte est une transaction passée
          setBalance(prev => prev - data.amount);

          // Niveau 1: Toast in-app
          setToastAlert(data);
          
          // Niveau 2: Overlay dramatique
          setAlerts(prev => [data, ...prev]);

          // Push Notification Réelle (Niveau OS)
          if ('Notification' in window && Notification.permission === 'granted') {
             new Notification('🚨 AZUR+ Security', {
               body: `Tentative suspecte de ${data.amount} FCFA à ${data.country || data.country_txn}. Score IA: ${Math.round(data.fraud_score)}/100`,
             });
          }
        }
      });
      
      ioSocket.on('SOC_ACTION_BROADCAST', (data: any) => {
        // Pour la fluidité de la soutenance, la PWA réagit à toutes les actions SOC 
        // (Simulant que c'est le tel de l'utilisateur ciblé)
        if (data.action === 'REQUIRE_OTP') {
           setPendingAction('APPROVE'); // OTP est pour valider la transaction
           setPendingAlertId(data.alertId);
           setShowPinPad(true);
        } else if (data.action === 'ADMIN_BLOCK') {
           setIsCardBlocked(true);
           setAlerts(prev => prev.filter(a => a.alert_id !== data.alertId && a.id !== data.alertId));
           setShowPinPad(false);
           setSuccessMessage({ title: 'Sécurité AZUR+', message: 'Votre carte a été bloquée par votre banque suite à une activité suspecte.', type: 'error' });
        } else if (data.action === 'ADMIN_VALIDATE') {
           setAlerts(prev => prev.filter(a => a.alert_id !== data.alertId && a.id !== data.alertId));
           setShowPinPad(false);
           setSuccessMessage({ title: 'Transaction Validée', message: 'Votre banque a confirmé la sécurité de votre transaction.', type: 'success' });
        }
      });

      setSocket(ioSocket);
    };
    document.body.appendChild(script);
  }, []);

  // Nettoyer le toast après 5s
  useEffect(() => {
    if (toastAlert) {
      const timer = setTimeout(() => setToastAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastAlert]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleLoginComplete = (pin: string) => {
    if (pin === CORRECT_PIN) setIsLoggedIn(true);
    else setPinError(true);
  };

  const handleActionPinComplete = (pin: string) => {
    if (pin === CORRECT_PIN) {
      if (socket && pendingAlertId) {
        socket.emit('USER_ACTION', {
           alertId: pendingAlertId,
           action: pendingAction === 'BLOCK' ? 'BLOCKED' : 'VERIFIED'
        });
      }
      
      if (pendingAction === 'BLOCK') {
         setIsCardBlocked(true);
         setSuccessMessage({ title: 'Carte Bloquée', message: 'Vous avez bloqué votre carte avec succès.', type: 'error' });
      } else {
         setSuccessMessage({ title: 'Identité Vérifiée', message: 'Transaction validée par OTP avec succès.', type: 'success' });
      }
      
      setAlerts(prev => prev.filter(a => a.alert_id !== pendingAlertId && a.id !== pendingAlertId));
      setShowPinPad(false);
      setPendingAction(null);
      setPendingAlertId(null);
    } else {
      setPinError(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mobile-app-container" style={{ background: 'white' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', margin: 0, letterSpacing: '-1px' }}>
              test<span style={{ color: 'var(--text-primary)' }}>BANK</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Sécurité propulsée par AZUR+</p>
          </div>
          <PinPad onPinComplete={handleLoginComplete} error={pinError} label="Entrez votre code secret" />
        </div>
      </div>
    );
  }

  const activeAlert = alerts[0];
  const hasAlert = !!activeAlert;

  return (
    <div className="mobile-app-container">
      {/* 🔴 LEVEL 1 : TOAST NOTIFICATION 🔴 */}
      <AnimatePresence>
        {toastAlert && !hasAlert && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="toast-in-app"
          >
            <ShieldAlert color="var(--danger)" />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger)' }}>Activité Inhabituelle</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Analyse en cours...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 MESSAGE DE SUCCES OVERLAY 🟢 */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 9999,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center'
            }}
          >
            {successMessage.type === 'success' ? <CheckCircle size={64} color="#10b981" /> : <ShieldOff size={64} color="#ef4444" />}
            <h2 style={{ color: 'var(--primary)', marginTop: '1rem' }}>{successMessage.title}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{successMessage.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔴 LEVEL 2 : DRAMATIC OVERLAY 🔴 */}
      <AnimatePresence>
        {hasAlert && !showPinPad && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="overlay-dramatic"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="alert-modal-cyber"
            >
              <div className="alert-header">
                <div className="alert-icon-wrapper">
                  <ShieldAlert size={32} />
                </div>
                <h2>Activité Suspecte Détectée</h2>
                <p>AZUR+ a bloqué temporairement cette transaction. Confirmez-vous en être l'auteur ?</p>
              </div>

              <div className="fraud-details-box">
                <div className="fd-row">
                  <span className="fd-label"><Wallet size={14}/> Montant</span>
                  <span className="fd-value" style={{ fontSize: '1.2rem' }}>{activeAlert.amount} FCFA</span>
                </div>
                <div className="fd-row">
                  <span className="fd-label"><MapPin size={14}/> Localisation</span>
                  <span className="fd-value high-risk">{activeAlert.country || activeAlert.country_txn}</span>
                </div>
                <div className="fd-row">
                  <span className="fd-label"><Smartphone size={14}/> Appareil</span>
                  <span className="fd-value">{activeAlert.device_id}</span>
                </div>
                <div className="fd-row" style={{ borderTop: '1px solid #fecaca', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <span className="fd-label"><Activity size={14}/> AZUR+ Risk Score</span>
                  <span className="fd-value high-risk" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {Math.round(activeAlert.fraud_score)}/100 <Zap size={14} fill="currentColor"/>
                  </span>
                </div>
              </div>

              <div className="alert-actions">
                <button className="btn-cyber-safe" onClick={() => { setPendingAction('APPROVE'); setShowPinPad(true); }}>
                  <CheckCircle size={20} /> Oui, c'est moi (Autoriser)
                </button>
                <button className="btn-cyber-danger" onClick={() => { setPendingAction('BLOCK'); setShowPinPad(true); }}>
                  <Lock size={20} /> Non, Bloquer la carte
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔐 PIN PAD VALIDATION 🔐 */}
      <AnimatePresence>
        {showPinPad && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="overlay-dramatic" style={{ justifyContent: 'center' }}
          >
            <div className="alert-modal-cyber" style={{ borderRadius: '32px', margin: '2rem' }}>
               <PinPad onPinComplete={handleActionPinComplete} error={pinError} label="Validez l'opération (PIN)" />
               <button onClick={() => setShowPinPad(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', marginTop: '1rem', cursor: 'pointer' }}>Annuler</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          CONTENU PRINCIPAL (HOME)
      ========================================= */}
      <div className={`app-content ${(hasAlert || showPinPad) ? 'blurred' : ''}`}>
        
        {/* HEADER */}
        <header className="app-header">
          <div className="profile-section">
            <div className="avatar"><User size={24} /></div>
            <div className="greeting">
              <p>Bonjour 👋</p>
              <h2>{TARGET_USER.split(' ')[0]}</h2>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={20} /></button>
          </div>
        </header>

        {/* 3D CARD */}
        <section className="card-section">
          <Card3D isBlocked={isCardBlocked} />
        </section>

        {/* BALANCE */}
        <section className="balance-section">
          <div className="balance-title">Solde Total</div>
          <div className="balance-amount">
            {balance.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>FCFA</span>
          </div>
        </section>

        {/* ANALYTICS LIVE SECURITY */}
        <section className="analytics-section">
          <h3 className="section-title">Security Center</h3>
          <div className="monitoring-card">
             <AIConfidenceGauge score={isCardBlocked ? 94 : 12} />
             <div className="monitoring-details">
               <h4>Indice Comportemental</h4>
               <div className="mon-row"><MapPin size={12}/> Actif à : Cotonou, BJ</div>
               <div className="mon-row"><Smartphone size={12}/> Appareil : iPhone 14 Pro</div>
               <div className={`mon-status ${isCardBlocked ? 'warn' : 'safe'}`}>
                 <ShieldCheck size={12}/> {isCardBlocked ? 'Menace Isolée' : 'Sécurité Maximale'}
               </div>
             </div>
          </div>
          <ExpenseChart />
        </section>

        {/* TRANSACTIONS */}
        <section className="transactions-section">
          <h3 className="section-title">Activité Récente</h3>
          <div className="tx-list">
             {/* Transaction mockée */}
             <div className="tx-item">
               <div className="tx-icon-wrapper" style={{ background: '#fef2f2', color: '#ef4444' }}><Activity size={20} /></div>
               <div className="tx-info">
                 <div className="tx-merchant">Netflix <div className="shield-badge safe"><CheckCircle size={10}/></div></div>
                 <div className="tx-meta">Hier • Divertissement</div>
               </div>
               <div className="tx-amount out">-15 900 FCFA</div>
             </div>

             <div className="tx-item">
               <div className="tx-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}><Zap size={20} /></div>
               <div className="tx-info">
                 <div className="tx-merchant">Virement Salaire <div className="shield-badge safe"><CheckCircle size={10}/></div></div>
                 <div className="tx-meta">Le 05/05 • Dépôt</div>
               </div>
               <div className="tx-amount in">+285 000 FCFA</div>
             </div>
          </div>
        </section>

        {/* BOTTOM NAV */}
        <nav className="bottom-nav">
          <div className="nav-item active"><Home size={24} /><span className="nav-label">Home</span></div>
          <div className="nav-item"><CreditCard size={24} /><span className="nav-label">Cartes</span></div>
          <div className="nav-item" style={{ color: 'var(--primary)', transform: 'translateY(-10px)' }}>
             <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(37,99,235,0.3)' }}>
               <ShieldAlert size={24} />
             </div>
          </div>
          <div className="nav-item"><Activity size={24} /><span className="nav-label">Analytics</span></div>
          <div className="nav-item" onClick={() => setIsLoggedIn(false)}><LogOut size={24} /><span className="nav-label">Quitter</span></div>
        </nav>
        
      </div>
    </div>
  );
}
