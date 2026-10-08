import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('church_info')
export class ChurchInfo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: true })
  name!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ type: 'text', nullable: true })
  phone!: string | null;

  @Column({ type: 'text', nullable: true })
  email!: string | null;

  @Column({ type: 'text', nullable: true })
  website!: string | null;

  @Column({ type: 'int', nullable: true })
  foundedYear!: number | null;

  @Column({ type: 'text', nullable: true })
  facebookUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  youtubeUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  instagramUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  aboutUsTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  aboutUsSubTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  aboutUsImage!: string | null;

  @Column({ type: 'text', nullable: true })
  aboutHeroImage!: string | null;

  @Column({ type: 'text', nullable: true })
  giveHeroImage!: string | null;

  @Column({ type: 'text', nullable: true })
  eventHeroImage!: string | null;

  @Column({ type: 'text', nullable: true })
  galleryHeroImage!: string | null;

  @Column({ type: 'text', nullable: true })
  ministryHeroImage!: string | null;

  @Column({ type: 'text', nullable: true })
  sermonsHeroImage!: string | null;

  @Column({ type: 'text', nullable: true })
  aboutUs!: string | null;

  @Column({ type: 'text', nullable: true })
  pastorName!: string | null;

  @Column({ type: 'text', nullable: true })
  pastorTitle1!: string | null;

  @Column({ type: 'text', nullable: true })
  pastorTitle2!: string | null;

  @Column({ type: 'text', nullable: true })
  pastorMessage1!: string | null;

  @Column({ type: 'text', nullable: true })
  pastorMessage2!: string | null;

  @Column({ type: 'text', nullable: true })
  pastorAvatar!: string | null;

  @Column({ type: 'text', nullable: true })
  video1!: string | null;

  @Column({ type: 'text', nullable: true })
  video2!: string | null;

  @Column({ type: 'text', nullable: true })
  bankAccountName!: string | null;

  @Column({ type: 'text', nullable: true })
  bank!: string | null;

  @Column({ type: 'text', nullable: true })
  accountNumber!: string | null;

  @Column({ type: 'text', nullable: true })
  routingNumber!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
