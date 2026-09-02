import { IsOptional, IsString, IsNumber, IsUrl } from 'class-validator';

export class UpdateChurchInfoDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsNumber()
  @IsOptional()
  foundedYear?: number;

  @IsUrl()
  @IsOptional()
  facebookUrl?: string;

  @IsUrl()
  @IsOptional()
  youtubeUrl?: string;

  @IsUrl()
  @IsOptional()
  instagramUrl?: string;
}
