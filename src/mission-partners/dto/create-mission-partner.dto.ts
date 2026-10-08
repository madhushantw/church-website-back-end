import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMissionPartnerDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  link!: string;

  @IsString()
  @IsOptional()
  image?: string;
}
