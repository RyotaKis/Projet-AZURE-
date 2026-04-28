import { Controller, Post, Body, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Fineract Webhook')
@Controller('api/webhook')
export class FineractWebhookController {
  private readonly logger = new Logger(FineractWebhookController.name);

  @Post('fineract')
  @ApiOperation({ summary: 'Simule la réception d\\'un événement de transaction depuis Apache Fineract' })
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
      // TODO: Envoyer cette transaction au moteur de fraude (RabbitMQ / HTTP)
    }

    return { status: 'Received', eventId: payload.resourceId };
  }
}
