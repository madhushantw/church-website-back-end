import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMinistryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  leader?: string;
}
