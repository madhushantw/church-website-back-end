import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum GalleryImageType {
  WORSHIP = 'worship',
  COMMUNITY = 'community',
  EVENTS = 'event',
}

@Entity('gallery')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ nullable: true })
  imageUrl!: string;

  @Column({
    type: 'enum',
    enum: GalleryImageType,
    nullable: true,
  })
  imageType!: GalleryImageType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
