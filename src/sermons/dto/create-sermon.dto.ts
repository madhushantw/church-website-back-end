import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SermonPdfType } from '../entities/sermon.entity';

export class SermonPdfFileDto {
  @IsEnum(SermonPdfType)
  type!: SermonPdfType;

  @IsString()
  @IsNotEmpty()
  url!: string;
}

export class CreateSermonDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  reflection?: string;

  @IsString()
  @IsNotEmpty()
  preacher!: string;

  @IsDateString()
  sermonDate!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SermonPdfFileDto)
  @IsOptional()
  pdfFiles?: SermonPdfFileDto[];
}
