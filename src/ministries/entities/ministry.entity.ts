import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MinistryType {
  GENERAL = 'general',
  CHILDREN = 'children',
  YOUTH = 'youth',
  WOMEN = 'women',
  MEN = 'men',
  WORSHIP = 'worship',
  OUTREACH = 'outreach',
  PRAYER = 'prayer',
  MEDIA = 'media',
}

@Entity('ministries')
export class Ministry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: MinistryType,
    default: MinistryType.GENERAL,
  })
  type!: MinistryType;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  image!: string | null;

  @Column({ type: 'text', nullable: true })
  leader!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
