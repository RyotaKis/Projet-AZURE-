import { useState, useEffect, useCallback } from 'react';
import { Transaction, Alert, RiskLevel } from '../types';

const COUNTRIES = ['USA', 'GBR', 'FRA', 'DEU', 'JPN', 'CHN', 'BRA', 'CAN', 'AUS', 'IND'];
const USERS = ['J. Doe', 'A. Smith', 'M. Ross', 'L. Chen', 'S. Gupta', 'P. Silva', 'F. Müller', 'E. Dubois'];
const FRAUD_TYPES = ['Identity Theft', 'Account Takeover', 'Card Cloning', 'Wire Fraud', 'Money Laundering'];

export function useSimulation() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({
    tps: 142,
    fraudRate: 0.24,
    activeAlerts: 12,
    blocked: 1420,
    latency: 42
  });

  const generateTransaction = useCallback((): Transaction => {
    const riskScore = Math.floor(Math.random() * 101);
    let status: RiskLevel = 'safe';
    if (riskScore > 85) status = 'critical';
    else if (riskScore > 60) status = 'warning';

    return {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date(),
      user: USERS[Math.floor(Math.random() * USERS.length)],
      country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
      amount: parseFloat((Math.random() * 5000 + 10).toFixed(2)),
      currency: 'EUR',
      riskScore,
      status
    };
  }, []);

  const generateAlert = useCallback((tx: Transaction): Alert => {
    return {
      id: `ALRT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      user: tx.user,
      type: FRAUD_TYPES[Math.floor(Math.random() * FRAUD_TYPES.length)],
      amount: tx.amount,
      aiScore: tx.riskScore,
      severity: tx.status,
      timestamp: new Date()
    };
  }, []);

  useEffect(() => {
    // Initial data
    const initialTxs = Array.from({ length: 15 }, () => generateTransaction());
    setTransactions(initialTxs);

    const interval = setInterval(() => {
      const newTx = generateTransaction();
      setTransactions(prev => [newTx, ...prev.slice(0, 49)]);

      if (newTx.status === 'critical' || (newTx.status === 'warning' && Math.random() > 0.7)) {
        const newAlert = generateAlert(newTx);
        setAlerts(prev => [newAlert, ...prev].sort((a, b) => {
          const priority = { critical: 0, warning: 1, safe: 2 };
          return priority[a.severity] - priority[b.severity];
        }).slice(0, 20));
      }

      // Update stats randomly
      setStats(prev => ({
        tps: Math.floor(130 + Math.random() * 30),
        fraudRate: parseFloat((0.2 + Math.random() * 0.1).toFixed(2)),
        activeAlerts: prev.activeAlerts + (Math.random() > 0.8 ? 1 : Math.random() > 0.85 ? -1 : 0),
        blocked: prev.blocked + (newTx.status === 'critical' ? 1 : 0),
        latency: Math.floor(38 + Math.random() * 10)
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [generateTransaction, generateAlert]);

  return { transactions, alerts, stats };
}
