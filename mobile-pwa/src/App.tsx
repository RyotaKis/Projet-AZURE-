import React, { useEffect, useState } from 'react';
import { Home, CreditCard, Send, User, Bell, ChevronRight, ShieldAlert, Lock, Fingerprint, LogOut, Wallet, MoreHorizontal, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import './App.css';

const CORRECT_PIN = "1234";
const TARGET_USER = "Jean Dupont";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPin, setLoginPin] = useState("");
  
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeAlert, setActiveAlert] = useState<any>(null);
  
  // PIN Pad for Alert Verification
  const [showPinPad, setShowPinPad] = useState(false);
  const [verificationPin, setVerificationPin] = useState("");
  const [pendingAction, setPendingAction] = useState<'APPROVE' | 'BLOCK' | null>(null);
  const [pinError, setPinError] = useState(false);

  // Nouvelles Vues après action
  const [cardSuspended, setCardSuspended] = useState(false);
  const [transactionApproved, setTransactionApproved] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed', err));
    }

    if ('Notification' in window) {
      Notification.requestPermission();
    }

    const script = document.createElement('script');
    script.src = "https://cdn.socket.io/4.7.4/socket.io.min.js";
    script.onload = () => {
      const socket = (window as any).io('http://localhost:3000');
      socket.on('connect', () => console.log('Connected to Gateway'));
      socket.on('ALERT_NEW', (data: any) => {
        
        // FILTRAGE INTELLIGENT : On n'affiche l'alerte sur le mobile QUE si elle est pour Jean Dupont
        if (data.user === TARGET_USER) {
           setAlerts(prev => [data, ...prev]);

           if ('Notification' in window && Notification.permission === 'granted') {
             navigator.serviceWorker.ready.then(registration => {
               registration.showNotification('testBANK Sécurité ⚠️', {
                 body: `Opération suspecte de ${Math.round(data.fraud_score)}/100 bloquée.`,
                 icon: 'https://cdn-icons-png.flaticon.com/512/1008/1008928.png',
               });
             }).catch(() => {
               new Notification('testBANK Sécurité ⚠️', {
                 body: `Opération suspecte de ${Math.round(data.fraud_score)}/100 bloquée.`,
               });
             });
           }
        } else {
           console.log(`[IGNORE] Background Noise fraud for ${data.user} intercepted but hidden from mobile UI.`);
        }
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleLogin = (digit: string) => {
    if (loginPin.length < 4) {
      const newPin = loginPin + digit;
      setLoginPin(newPin);
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          setIsLoggedIn(true);
        } else {
          setPinError(true);
          setTimeout(() => {
            setLoginPin("");
            setPinError(false);
          }, 500);
        }
      }
    }
  };

  const handleAlertAction = (alert: any, action: 'APPROVE' | 'BLOCK') => {
    // Les DEUX actions requièrent maintenant le PIN pour sécurité maximale
    setActiveAlert(alert);
    setPendingAction(action);
    setShowPinPad(true);
    setVerificationPin("");
  };

  const handleVerificationPin = (digit: string) => {
    if (verificationPin.length < 4) {
      const newPin = verificationPin + digit;
      setVerificationPin(newPin);
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          
          // Action Post-PIN selon le choix
          if (pendingAction === 'BLOCK') {
             // Afficher l'écran "Carte Suspendue"
             setCardSuspended(true);
          } else if (pendingAction === 'APPROVE') {
             // Afficher l'écran de validation
             setTransactionApproved(true);
             // Dans 3 secondes, on retourne à l'accueil
             setTimeout(() => {
                setTransactionApproved(false);
             }, 3000);
          }

          // Nettoyer l'alerte traitée
          setAlerts(prev => prev.filter(a => a.alert_id !== activeAlert.alert_id));
          setShowPinPad(false);
          setActiveAlert(null);
          setPendingAction(null);

        } else {
          setPinError(true);
          setTimeout(() => {
            setVerificationPin("");
            setPinError(false);
          }, 500);
        }
      }
    }
  };

  const renderPinDots = (pin: string) => {
    return (
      <div className={`pin-dots ${pinError ? 'error-shake' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`dot ${pin.length > i ? 'filled' : ''}`}></div>
        ))}
      </div>
    );
  };

  const renderKeypad = (onKeyPress: (d: string) => void, onClear: () => void) => {
    return (
      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <button key={d} className="key" onClick={() => onKeyPress(d.toString())}>{d}</button>
        ))}
        <button className="key icon-key"><Fingerprint size={28} /></button>
        <button className="key" onClick={() => onKeyPress("0")}>0</button>
        <button className="key clear-key" onClick={onClear}>C</button>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-logo-container">
           <h1 className="uba-clone-logo">test<span>BANK</span></h1>
           <p>Mobile Banking App</p>
        </div>
        
        <div className="login-user-profile">
           <div className="avatar-circle">
             <User size={30} color="#0f4c81" />
           </div>
           <h3>Hello, Jean</h3>
           <p>Veuillez entrer votre PIN bancaire</p>
        </div>

        {renderPinDots(loginPin)}
        {renderKeypad(handleLogin, () => setLoginPin(""))}
        
        <div className="login-footer">
           <span>Problème de connexion ?</span>
        </div>
      </div>
    );
  }

  // Si la carte est suspendue après un BLOCAGE
  if (cardSuspended) {
    return (
      <div className="mobile-app-container">
        <div className="suspended-screen">
          <div className="suspended-icon">
            <AlertTriangle size={60} color="#ef4444" />
          </div>
          <h2>Opération Annulée</h2>
          <div className="suspended-card-visual">
             <CreditCard size={50} color="#ffffff" />
             <div className="scv-text">CARTE DÉSACTIVÉE</div>
          </div>
          <p className="suspended-desc">
            Pour votre sécurité, la carte bancaire associée à cette tentative de fraude a été <strong>suspendue temporairement</strong>. <br/><br/>
            Votre compte bancaire reste accessible pour vos prélèvements.
          </p>

          <button className="btn-order-card" onClick={() => setCardSuspended(false)}>
            Commander une nouvelle carte
          </button>
          <button className="btn-contact-advisor">
            Contacter un conseiller
          </button>
        </div>
      </div>
    );
  }

  // Animation Succès après APPROBATION
  if (transactionApproved) {
     return (
      <div className="mobile-app-container">
        <div className="approved-screen">
           <div className="approved-icon">
              <CheckCircle size={80} color="#8cc63f" />
           </div>
           <h2>Opération Validée</h2>
           <p>Merci pour votre confirmation. La transaction est en cours de traitement.</p>
        </div>
      </div>
     );
  }

  const hasAlerts = alerts.length > 0;
  const currentAlert = hasAlerts ? alerts[0] : null;

  return (
    <div className="mobile-app-container">
      
      {/* 🔴 PUSH NOTIFICATION OVERLAY (UNIQUE) 🔴 */}
      {hasAlerts && currentAlert && !showPinPad && (
        <div className="alert-overlay">
            <div className="alert-modal">
              <div className="alert-icon-circle">
                <ShieldAlert size={32} color="#fff" />
              </div>
              <h2 className="alert-title">Alerte Sécurité testBANK</h2>
              <p className="alert-desc">
                Une opération de <strong>{currentAlert.amount || 'Inconnu'} EUR</strong> a été bloquée. (Score: {Math.round(currentAlert.fraud_score)}/100). S'agit-il bien de vous ?
              </p>
              
              <div className="alert-actions">
                <button className="btn-approve" onClick={() => handleAlertAction(currentAlert, 'APPROVE')}>
                  OUI, C'EST MOI
                </button>
                <button className="btn-block" onClick={() => handleAlertAction(currentAlert, 'BLOCK')}>
                  NON, BLOQUER LA CARTE
                </button>
              </div>
            </div>
        </div>
      )}

      {/* 🔐 PIN PAD POUR VERIFICATION D'ALERTE 🔐 */}
      {showPinPad && (
         <div className="alert-overlay verification-overlay">
            <div className="verification-modal">
              <div className="auth-icon-top"><Lock size={24} color="#0f4c81" /></div>
              <h3>Validation Requise</h3>
              <p>Entrez votre PIN testBANK pour confirmer l'ordre de {pendingAction === 'BLOCK' ? 'blocage de carte' : 'validation'}.</p>
              {renderPinDots(verificationPin)}
              {renderKeypad(handleVerificationPin, () => setVerificationPin(""))}
              <button className="btn-cancel" onClick={() => setShowPinPad(false)}>Annuler</button>
            </div>
         </div>
      )}

      {/* 🔵 INTERFACE UBA CLONE (testBANK) 🔵 */}
      <div className={`app-content ${(hasAlerts || showPinPad) ? 'blurred' : ''}`}>
        
        <header className="uba-header">
          <div className="header-top">
            <div className="uba-profile">
               <div className="uba-avatar"><User size={20} color="#0f4c81" /></div>
               <div className="uba-greeting">
                  <span className="greet">Hello,</span>
                  <span className="name">Jean Dupont</span>
               </div>
            </div>
            <div className="uba-header-icons">
               <HelpCircle size={22} color="#fff" />
               <button className="notification-btn" onClick={() => setIsLoggedIn(false)}>
                 <LogOut size={22} color="#fff" />
               </button>
            </div>
          </div>
        </header>

        <section className="uba-balance-section">
          <div className="uba-balance-card">
            <div className="card-top-row">
              <span className="account-type">COMPTE COURANT</span>
              <span className="account-number">202154****14</span>
            </div>
            <div className="balance-row">
               <span className="currency">EUR</span>
               <h1 className="balance-amount">4,520.00</h1>
               <div className="hide-eye">👁️</div>
            </div>
            <div className="card-bottom-row">
               <span>Total Balance</span>
            </div>
          </div>
        </section>

        <section className="uba-quick-actions">
           <div className="uba-action-item">
              <div className="bubble transfer"><Send size={22} color="#0f4c81" /></div>
              <span>Transfer</span>
           </div>
           <div className="uba-action-item">
              <div className="bubble bills"><CreditCard size={22} color="#0f4c81" /></div>
              <span>Pay Bills</span>
           </div>
           <div className="uba-action-item">
              <div className="bubble airtime"><Wallet size={22} color="#0f4c81" /></div>
              <span>Airtime</span>
           </div>
           <div className="uba-action-item">
              <div className="bubble more"><MoreHorizontal size={22} color="#0f4c81" /></div>
              <span>More</span>
           </div>
        </section>

        <section className="uba-transactions">
          <div className="uba-section-header">
            <h3>Recent Transactions</h3>
            <span className="view-all">View All</span>
          </div>
          
          <div className="uba-tx-list">
            <div className="uba-tx-item">
              <div className="uba-tx-icon out"><Send size={16} color="#ef4444" /></div>
              <div className="uba-tx-details">
                <p className="tx-title">Paiement Marchand</p>
                <p className="tx-date">14:30 • Transfer</p>
              </div>
              <div className="uba-tx-amount negative">- €49.90</div>
            </div>

            <div className="uba-tx-item">
              <div className="uba-tx-icon in"><Send size={16} color="#10b981" /></div>
              <div className="uba-tx-details">
                <p className="tx-title">Dépôt Agence</p>
                <p className="tx-date">09:15 • Deposit</p>
              </div>
              <div className="uba-tx-amount positive">+ €285.00</div>
            </div>

            <div className="uba-tx-item">
              <div className="uba-tx-icon out"><Send size={16} color="#ef4444" /></div>
              <div className="uba-tx-details">
                <p className="tx-title">Netflix Subscription</p>
                <p className="tx-date">Yesterday • Bills</p>
              </div>
              <div className="uba-tx-amount negative">- €15.99</div>
            </div>
            
          </div>
        </section>

        <nav className="uba-bottom-nav">
          <div className="uba-nav-item active">
            <Home size={22} />
            <span>Home</span>
          </div>
          <div className="uba-nav-item">
            <CreditCard size={22} />
            <span>Cards</span>
          </div>
          <div className="uba-nav-center-item">
            <div className="center-btn">
               <ShieldAlert size={28} color="#fff" />
            </div>
          </div>
          <div className="uba-nav-item">
            <Wallet size={22} />
            <span>Lifestyle</span>
          </div>
          <div className="uba-nav-item">
            <User size={22} />
            <span>Profile</span>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;
