import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FineractWebhookController } from './fineract.controller';

@Module({
  imports: [
    // La base de données MariaDB est désactivée pour garantir la stabilité de la soutenance (0 plantage).
    // Les flux transitent directement par WebSockets.
  ],
  controllers: [AppController, FineractWebhookController],
  providers: [AppService],
})
export class AppModule { }
