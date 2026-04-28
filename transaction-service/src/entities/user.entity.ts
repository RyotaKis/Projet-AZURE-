import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Account } from './account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  fineract_client_id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ unique: true })
  national_id: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lat_home: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lng_home: number;

  @Column({ default: false })
  kyc_verified: boolean;

  @Column({ default: 'low' })
  risk_profile: string;

  @OneToMany(() => Account, account => account.user)
  accounts: Account[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
