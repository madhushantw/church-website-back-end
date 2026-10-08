import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChurchInfoDto {
  @IsString()
  @IsOptional()
  name?: string | null;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  address?: string | null;

  @IsString()
  @IsOptional()
  phone?: string | null;

  @IsString()
  @IsOptional()
  email?: string | null;

  @IsString()
  @IsOptional()
  website?: string | null;

  @IsNumber()
  @IsOptional()
  foundedYear?: number | null;

  @IsString()
  @IsOptional()
  facebookUrl?: string | null;

  @IsString()
  @IsOptional()
  youtubeUrl?: string | null;

  @IsString()
  @IsOptional()
  instagramUrl?: string | null;

  @IsString()
  @IsOptional()
  aboutUsTitle?: string | null;

  @IsString()
  @IsOptional()
  aboutUsSubTitle?: string | null;

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
  aboutUs?: string | null;

  @IsString()
  @IsOptional()
  pastorName?: string | null;

  @IsString()
  @IsOptional()
  pastorTitle1?: string | null;

  @IsString()
  @IsOptional()
  pastorTitle2?: string | null;

  @IsString()
  @IsOptional()
  pastorMessage1?: string | null;

  @IsString()
  @IsOptional()
  pastorMessage2?: string | null;

  @IsString()
  @IsOptional()
  pastorAvatar?: string | null;

  @IsString()
  @IsOptional()
  video1?: string | null;

  @IsString()
  @IsOptional()
  video2?: string | null;

  @IsString()
  @IsOptional()
  bankAccountName?: string | null;

  @IsString()
  @IsOptional()
  bank?: string | null;

  @IsString()
  @IsOptional()
  accountNumber?: string | null;

  @IsString()
  @IsOptional()
  routingNumber?: string | null;
}
