import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  fineract_txn_id: string;

  @Column()
  type: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ default: 'XOF' })
  currency: string;

  @Column({ nullable: true })
  beneficiary_id: string;

  @Column({ nullable: true })
  beneficiary_name: string;

  @Column()
  channel: string;

  @Column({ nullable: true })
  device_id: string;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lng: number;

  @Column({ nullable: true })
  country_txn: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 0 })
  fraud_score: number;

  @Column({ default: 'clean' })
  fraud_label: string;

  @Column({ default: false })
  is_from_simulator: boolean;

  @ManyToOne(() => Account, account => account.transactions)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
