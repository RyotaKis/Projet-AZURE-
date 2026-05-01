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
  @ApiOperation({ summary: 'Reçoit une transaction évaluée par le Transaction Service' })
  async interceptTransaction(@Body() rawTx: any) {
    this.logger.log(`Received evaluated transaction: ${rawTx.amount} ${rawTx.currency || 'XOF'} (Score: ${rawTx.fraud_score})`);
    
    // Diffusion de la transaction au SOC Dashboard
    this.eventsGateway.broadcastTransaction(rawTx);

    // Si le score dépasse 40, on diffuse une alerte critique
    if (rawTx.fraud_score >= 40) {
       this.logger.warn(`Alerte transmise au SOC ! Score: ${rawTx.fraud_score}`);
       this.eventsGateway.broadcastAlert({
         alert_id: `ALT_${Date.now()}`,
         transaction_id: rawTx.id || rawTx.resourceId || `TX_${Date.now()}`,
         severity: rawTx.fraud_score >= 80 ? 'critical' : 'warning',
         fraud_score: rawTx.fraud_score,
         user: rawTx.user_id || rawTx.user || "Inconnu",
         amount: rawTx.amount || 0,
         rules_triggered: rawTx.rules_triggered || []
       });
    }

    return { success: true, broadcasted: true };
  }
}
