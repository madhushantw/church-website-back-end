import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('password_reset_otps')
export class PasswordResetOtp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  email!: string;

  @Column()
  otpHash!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ default: 0 })
  attempts!: number;

  @Column({ type: 'timestamp', nullable: true })
  usedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
