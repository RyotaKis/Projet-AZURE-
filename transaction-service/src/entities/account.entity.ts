import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  fineract_account_id: string;

  @Column({ unique: true })
  account_number: string;

  @Column({ default: 'savings' })
  account_type: string;

  @Column({ default: 'XOF' })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 500000 })
  daily_limit: number;

  @Column({ default: false })
  is_frozen: boolean;

  @ManyToOne(() => User, user => user.accounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];

  @CreateDateColumn()
  created_at: Date;
}
