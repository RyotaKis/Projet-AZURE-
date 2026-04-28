import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsGateway } from './events.gateway';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Gateway')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get('health')
  @ApiOperation({ summary: "Vérifie l'état de la Gateway" })
  getHealth(): { status: string } {
    return { status: 'AZURE+ API Gateway Online' };
  }

  @Post('gateway/intercept')
  @ApiOperation({ summary: 'Intercepte et orchestre une nouvelle transaction entrante' })
  async interceptTransaction(@Body() rawTx: any) {
    this.logger.log(`Intercepting transaction: ${rawTx.amount} ${rawTx.currency || 'XOF'}`);
    
    // Diffusion temps réel de la transaction (SOC Dashboard)
    this.eventsGateway.broadcastTransaction(rawTx);

    // Simulation de l'orchestration vers le Fraud Engine et le Ledger
    // (Dans la version complète, ici on ferait des appels HTTP/RabbitMQ vers le port 8000 et 4000)
    
    const isMockFraud = rawTx.amount > 100000; // Logique bouchonnée simple pour le test du simulateur
    if (isMockFraud) {
       this.logger.warn(`Fraude détectée sur la transaction ! Diffusion de l'alerte.`);
       this.eventsGateway.broadcastAlert({
         alert_id: `ALT_${Date.now()}`,
         transaction_id: rawTx.id || `TX_${Date.now()}`,
         severity: 'critical',
         fraud_score: 85,
         rules_triggered: [{ rule: 'R01', name: 'Montant Anormal' }]
       });
    }

    return { 
      success: true, 
      action_taken: isMockFraud ? 'BLOCKED' : 'APPROVED', 
      transaction: rawTx 
    };
  }
}
