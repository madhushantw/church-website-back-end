import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sermons')
export class Sermon {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  image!: string | null;

  @Column()
  preacher!: string;

  @Column({ type: 'timestamptz' })
  sermonDate!: Date;

  @Column({ type: 'text', nullable: true })
  videoUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  audioUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  bibleReference!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
