import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly eventsGateway: EventsGateway) {}

  onModuleInit() {
    this.logger.log('Starting Background Traffic Generator...');
    
    const firstNames = ['Marie', 'Luc', 'Sophie', 'Thomas', 'Julie', 'Nicolas', 'Camille', 'Antoine', 'Léa', 'Hugo', 'Sarah', 'Paul'];
    const lastNames = ['Dubois', 'Martin', 'Bernard', 'Petit', 'Robert', 'Richard', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre'];

    // Génère un flux de transactions continu
    setInterval(() => {
      const isSuspect = Math.random() > 0.85; // 15% de chance d'être suspect
      const score = isSuspect ? Math.floor(Math.random() * 85) + 15 : Math.floor(Math.random() * 15);
      
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomName = `${randomFirstName} ${randomLastName}`;

      const tx = {
        id: `TX_LIVE_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        amount: isSuspect ? Math.floor(Math.random() * 3000) + 500 : Math.floor(Math.random() * 200) + 5,
        currency: 'EUR',
        user: randomName,
        country_txn: isSuspect ? (Math.random() > 0.5 ? 'RU' : 'CN') : 'FR',
        fraud_score: score,
        status: score > 80 ? 'critical' : score > 40 ? 'warning' : 'safe',
        created_at: new Date().toISOString()
      };
      
      this.eventsGateway.broadcastTransaction(tx);

      // Diffuser une alerte uniquement si le score est très élevé pour ne pas polluer
      if (score > 80) {
        this.eventsGateway.broadcastAlert({
           alert_id: `ALT_AUTO_${Date.now()}`,
           transaction_id: tx.id,
           severity: 'critical',
           fraud_score: score,
           user: tx.user,
           amount: tx.amount,
           rules_triggered: [{ rule: 'AUTO_02', name: 'Comportement Inhabituel (Auto)' }]
         });
      }
    }, 2000);
  }

  getHello(): string {
    return 'AZURE+ API Gateway Online';
  }
}
