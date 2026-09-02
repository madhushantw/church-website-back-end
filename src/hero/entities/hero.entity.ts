import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('hero')
export class Hero {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  welcomeText!: string;

  @Column({ type: 'text' })
  title1!: string;

  @Column({ type: 'text' })
  title2!: string;

  @Column({ type: 'text' })
  subtitle!: string;

  @Column({ type: 'text' })
  image!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
