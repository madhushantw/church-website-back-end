import { IsOptional, IsString } from 'class-validator';

export class UpdateHeroDto {
  @IsString()
  @IsOptional()
  welcomeText?: string;

  @IsString()
  @IsOptional()
  title1?: string;

  @IsString()
  @IsOptional()
  title2?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
