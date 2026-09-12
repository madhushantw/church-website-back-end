import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SermonPdfType {
  PEWSHEET = 'Pewsheet',
  READINGS = 'Readings',
  SERMON = 'sermon',
}

export interface SermonPdfFile {
  type: SermonPdfType;
  url: string;
}

@Entity('sermons')
export class Sermon {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  reflection!: string | null;

  @Column()
  preacher!: string;

  @Column({ type: 'timestamptz' })
  sermonDate!: Date;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  pdfFiles!: SermonPdfFile[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
