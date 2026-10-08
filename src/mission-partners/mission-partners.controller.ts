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

import { MissionPartnersService } from './mission-partners.service';
import { CreateMissionPartnerDto } from './dto/create-mission-partner.dto';
import { UpdateMissionPartnerDto } from './dto/update-mission-partner.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const missionPartnerUploadDirectory = resolve(
  process.cwd(),
  'uploads',
  'mission-partners',
);

@Controller('mission-partners')
export class MissionPartnersController {
  constructor(
    private readonly missionPartnersService: MissionPartnersService,
  ) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.missionPartnersService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionPartnersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          mkdir(missionPartnerUploadDirectory, { recursive: true }, (error) => {
            callback(error, missionPartnerUploadDirectory);
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
    @Body() data: CreateMissionPartnerDto,
  ) {
    return this.missionPartnersService.create({
      ...data,
      ...(file && { image: `/uploads/mission-partners/${file.filename}` }),
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          mkdir(missionPartnerUploadDirectory, { recursive: true }, (error) => {
            callback(error, missionPartnerUploadDirectory);
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
    @Body() data: UpdateMissionPartnerDto,
  ) {
    return this.missionPartnersService.update(id, {
      ...data,
      ...(file && { image: `/uploads/mission-partners/${file.filename}` }),
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.missionPartnersService.remove(id);
  }
}
