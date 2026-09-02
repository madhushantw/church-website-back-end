import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image!: string;
}
