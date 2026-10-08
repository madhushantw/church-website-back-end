import { IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsString()
  @IsOptional()
  facebookUrl?: string;

  @IsString()
  @IsOptional()
  youtubeUrl?: string;

  @IsString()
  @IsOptional()
  instagramUrl?: string;

  @IsString()
  @IsOptional()
  aboutUsTitle?: string;

  @IsString()
  @IsOptional()
  aboutUsSubTitle?: string;

  @IsString()
  @IsOptional()
  aboutUsImage?: string | null;

  @IsString()
  @IsOptional()
  aboutHeroImage?: string | null;

  @IsString()
  @IsOptional()
  giveHeroImage?: string | null;

  @IsString()
  @IsOptional()
  eventHeroImage?: string | null;

  @IsString()
  @IsOptional()
  galleryHeroImage?: string | null;

  @IsString()
  @IsOptional()
  ministryHeroImage?: string | null;

  @IsString()
  @IsOptional()
  sermonsHeroImage?: string | null;

  @IsString()
  @IsOptional()
  aboutUs?: string;

  @IsString()
  @IsOptional()
  pastorName?: string;

  @IsString()
  @IsOptional()
  pastorTitle1?: string;

  @IsString()
  @IsOptional()
  pastorTitle2?: string;

  @IsString()
  @IsOptional()
  pastorMessage1?: string;

  @IsString()
  @IsOptional()
  pastorMessage2?: string;

  @IsString()
  @IsOptional()
  pastorAvatar?: string | null;

  @IsString()
  @IsOptional()
  video1?: string;

  @IsString()
  @IsOptional()
  video2?: string;

  @IsString()
  @IsOptional()
  bankAccountName?: string;

  @IsString()
  @IsOptional()
  bank?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  routingNumber?: string;
}
