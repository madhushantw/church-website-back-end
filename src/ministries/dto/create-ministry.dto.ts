import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { MinistryType } from '../entities/ministry.entity';

export class CreateMinistryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(MinistryType)
  @IsNotEmpty()
  type!: MinistryType;

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
