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

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const eventUploadDirectory = resolve(process.cwd(), 'uploads', 'events');

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.eventsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          mkdir(eventUploadDirectory, { recursive: true }, (error) => {
            callback(error, eventUploadDirectory);
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
    @Body() data: CreateEventDto,
  ) {
    return this.eventsService.create({
      ...data,
      ...(file && { image: `/uploads/events/${file.filename}` }),
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          mkdir(eventUploadDirectory, { recursive: true }, (error) => {
            callback(error, eventUploadDirectory);
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
    @Body() data: UpdateEventDto,
  ) {
    return this.eventsService.update(id, {
      ...data,
      ...(file && { image: `/uploads/events/${file.filename}` }),
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
