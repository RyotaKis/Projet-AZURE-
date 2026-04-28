import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';
import { Account } from './account.entity';

@Entity('fraud_alerts')
export class FraudAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  alert_type: string;

  @Column()
  severity: string;

  @Column({ default: 0 })
  fraud_score: number;

  @Column({ type: 'json' })
  rules_triggered: any;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  ml_score: number;

  @Column({ default: 'open' })
  status: string;

  @Column({ nullable: true })
  user_responded_at: Date;

  @Column({ nullable: true })
  analyst_id: string;

  @Column({ type: 'text', nullable: true })
  analyst_note: string;

  @Column({ nullable: true })
  resolved_at: Date;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @CreateDateColumn()
  created_at: Date;
}
