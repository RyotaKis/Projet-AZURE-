import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Transaction, Alert, RiskLevel } from '../types';

const GATEWAY_URL = 'http://localhost:3000';

export function useRealTimeData() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({
    tps: 0,
    fraudRate: 0,
    activeAlerts: 0,
    blocked: 0,
    latency: 12
  });

  useEffect(() => {
    const newSocket = io(GATEWAY_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      // Fetch initial state if possible or just wait
    });

    newSocket.on('TRANSACTION_FLOW', (tx) => {
      const formattedTx: Transaction = {
        id: tx.id || Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date(),
        user: tx.user || 'Unknown',
        country: 'FRA', // mock if not provided
        amount: tx.amount,
        currency: tx.currency || 'XOF',
        riskScore: tx.fraud_score || 0,
        status: (tx.fraud_score >= 80 ? 'critical' : tx.fraud_score >= 40 ? 'warning' : 'safe') as RiskLevel
      };

      setTransactions(prev => [formattedTx, ...prev].slice(0, 50));
      setStats(prev => ({ ...prev, tps: prev.tps + 1 }));
    });

    newSocket.on('ALERT_NEW', (alertData) => {
      const formattedAlert: Alert = {
        id: `ALRT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        user: 'Unknown',
        type: alertData.rules_triggered?.[0]?.name || 'Anomalie Détectée',
        amount: 0,
        aiScore: alertData.fraud_score,
        severity: alertData.fraud_score >= 80 ? 'critical' : 'warning',
        timestamp: new Date()
      };

      setAlerts(prev => {
        const updated = [formattedAlert, ...prev].slice(0, 20);
        return updated.sort((a, b) => {
          const priority = { critical: 0, warning: 1, safe: 2 };
          return priority[a.severity] - priority[b.severity];
        });
      });

      setStats(prev => ({
        ...prev,
        activeAlerts: prev.activeAlerts + 1,
        blocked: alertData.fraud_score >= 80 ? prev.blocked + 1 : prev.blocked
      }));
    });

    // Ping mechanism for latency mock
    const pingInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        latency: Math.floor(Math.random() * 20) + 10,
        tps: Math.max(0, prev.tps - 1) // Decay TPS slowly
      }));
    }, 2000);

    return () => {
      clearInterval(pingInterval);
      newSocket.close();
    };
  }, []);

  return { transactions, alerts, stats };
}
