import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly eventsGateway: EventsGateway) {}

  onModuleInit() {
    this.logger.log('Starting Background Traffic Generator...');
    
    // Génère un trafic réaliste (Safe + Fraude) toutes les 3 secondes
    setInterval(() => {
      const isSuspect = Math.random() > 0.8; // 20% de chance d'être une fraude !
      const score = isSuspect ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 25);
      
      const tx = {
        id: `TX_LIVE_${Date.now()}`,
        amount: isSuspect ? Math.floor(Math.random() * 5000) + 1000 : Math.floor(Math.random() * 50) + 5,
        currency: 'EUR',
        user: `User_${Math.floor(Math.random() * 1000)}`,
        country_txn: isSuspect ? (Math.random() > 0.5 ? 'RU' : 'CN') : 'FR',
        fraud_score: score,
        status: score > 40 ? 'blocked' : 'approved',
        created_at: new Date().toISOString()
      };
      
      this.eventsGateway.broadcastTransaction(tx);
      
      if (score > 40) {
        this.eventsGateway.broadcastAlert({
           alert_id: `ALT_AUTO_${Date.now()}`,
           transaction_id: tx.id,
           severity: score > 80 ? 'critical' : 'warning',
           fraud_score: score,
           user: tx.user,
           amount: tx.amount,
           rules_triggered: [{ rule: 'AUTO_01', name: 'Détection Automatique (Bruit de fond)' }]
         });
      }
    }, 4000);
  }

  getHello(): string {
    return 'AZURE+ API Gateway Online';
  }
}
