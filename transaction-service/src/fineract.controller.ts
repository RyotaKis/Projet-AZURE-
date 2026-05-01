import { Controller, Post, Body, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Fineract Webhook')
@Controller('api/webhook')
export class FineractWebhookController {
  private readonly logger = new Logger(FineractWebhookController.name);

  @Post('fineract')
  @ApiOperation({ summary: "Simule la réception d'un événement de transaction depuis Apache Fineract" })
  @ApiResponse({ status: 200, description: 'Transaction reçue et transmise au Fraud Engine' })
  handleFineractEvent(@Headers('x-fineract-signature') signature: string, @Body() payload: any) {
    this.logger.log('Receiving incoming Fineract Webhook event');
    
    // Simulation basique de vérification de signature HMAC
    if (!signature) {
       this.logger.warn('Fineract Webhook: Missing signature');
       // En production on bloquerait : throw new UnauthorizedException('Invalid Signature');
    }

    if (payload?.eventType === 'TRANSACTION_CREATED') {
      this.logger.log(`Processing new transaction: ${payload.resourceId} for client ${payload.clientId}`);
      // Fraud Engine attend un champ 'id', mais Fineract envoie 'resourceId'
      const enginePayload = { 
        ...payload, 
        id: payload.resourceId || `TXN_${Date.now()}`,
        ip_address: payload.ip_address || "192.168.1.1",
        country_code: payload.country_code || payload.country_txn || "FR",
        hour_of_day: payload.hour_of_day || new Date().getHours()
      };

      // Appel natif vers Fraud Engine (Port 8000)
      fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enginePayload)
      })
      .then(res => res.json())
      .then(data => {
         let computedScore = data.fraud_score !== undefined 
            ? data.fraud_score 
            : (data.risk_score !== undefined ? data.risk_score * 100 : 0);
            
         // S'assurer que les explications soient un tableau
         let rules = data.explanations || data.explanation || [];
         if (typeof rules === 'string') rules = [{ rule: 'ML_01', name: rules }];
         else if (Array.isArray(rules) && typeof rules[0] === 'string') rules = rules.map(r => ({ rule: 'ML', name: r }));

         this.logger.log(`Fraud Score computed: ${computedScore} (Original: ${JSON.stringify(data)})`);
         
         // Broadcast à l'API Gateway (Port 3000)
         fetch('http://localhost:3000/gateway/intercept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, fraud_score: computedScore, rules_triggered: rules })
         }).catch(e => this.logger.error('Failed to notify Gateway', e));
      })
      .catch(e => this.logger.error('Error calling Fraud Engine', e));
    }

    return { status: 'Received', eventId: payload.resourceId };
  }
}
