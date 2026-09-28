import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  subject!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
