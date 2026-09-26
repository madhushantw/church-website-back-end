import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { GalleryImageType } from '../entities/gallery.entity';

export class CreateGalleryDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(GalleryImageType)
  type!: GalleryImageType;
}
