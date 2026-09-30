import { IsArray, IsOptional, IsString } from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
