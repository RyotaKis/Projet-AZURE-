import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FineractWebhookController } from './fineract.controller';
import { User } from './entities/user.entity';
import { Account } from './entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { FraudAlert } from './entities/fraud-alert.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USER || 'azur_core',
      password: process.env.DB_PASSWORD || 'azur_core_pass',
      database: process.env.DB_NAME || 'azur_cbs_ledger',
      entities: [User, Account, Transaction, FraudAlert],
      synchronize: true, // true pour le dev uniquement
    }),
    TypeOrmModule.forFeature([User, Account, Transaction, FraudAlert]),
  ],
  controllers: [AppController, FineractWebhookController],
  providers: [AppService],
})
export class AppModule {}
