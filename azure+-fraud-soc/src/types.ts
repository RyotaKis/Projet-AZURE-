export type RiskLevel = 'safe' | 'warning' | 'critical';

export interface Transaction {
  id: string;
  timestamp: Date;
  user: string;
  country: string;
  amount: number;
  currency: string;
  riskScore: number; // 0-100
  status: RiskLevel;
}

export interface Alert {
  id: string;
  user: string;
  type: string;
  amount: number;
  aiScore: number;
  severity: RiskLevel;
  timestamp: Date;
}

export interface AnalyticsData {
  time: string;
  fraud: number;
  volume: number;
}
