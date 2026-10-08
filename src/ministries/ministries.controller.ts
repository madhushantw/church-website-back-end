import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs';
import { extname, resolve } from 'node:path';
import { diskStorage } from 'multer';

import { MinistriesService } from './ministries.service';
import { CreateMinistryDto } from './dto/create-ministry.dto';
import { UpdateMinistryDto } from './dto/update-ministry.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const ministryUploadDirectory = resolve(process.cwd(), 'uploads', 'ministries');

@Controller('ministries')
export class MinistriesController {
  constructor(private readonly ministriesService: MinistriesService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.ministriesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ministriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          mkdir(ministryUploadDirectory, { recursive: true }, (error) => {
            callback(error, ministryUploadDirectory);
          });
        },
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() data: CreateMinistryDto,
  ) {
    return this.ministriesService.create({
      ...data,
      ...(file && { image: `/uploads/ministries/${file.filename}` }),
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          mkdir(ministryUploadDirectory, { recursive: true }, (error) => {
            callback(error, ministryUploadDirectory);
          });
        },
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() data: UpdateMinistryDto,
  ) {
    return this.ministriesService.update(id, {
      ...data,
      ...(file && { image: `/uploads/ministries/${file.filename}` }),
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.ministriesService.remove(id);
  }
}
