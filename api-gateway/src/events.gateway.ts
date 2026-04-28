import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Envoi de l'état initial (mock)
    client.emit('INIT', { status: 'Connected to AZURE+ SOC', activeAlerts: 0 });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Permet au backend de diffuser une alerte globalement
  broadcastAlert(alertData: any) {
    this.server.emit('ALERT_NEW', alertData);
    this.logger.log(`Broadcasting new alert: ${alertData.alert_id}`);
  }

  // Permet au backend de diffuser le flux de transactions
  broadcastTransaction(txData: any) {
    this.server.emit('TRANSACTION_FLOW', txData);
  }

  // Écoute des requêtes depuis le simulateur ou le dashboard
  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    return 'pong from AZURE+ Gateway';
  }
}
