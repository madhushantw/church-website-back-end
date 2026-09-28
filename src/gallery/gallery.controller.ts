import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { mkdirSync } from 'node:fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GalleryImageType } from './entities/gallery.entity';

const galleryUploadDirectory = './uploads/gallery';

mkdirSync(galleryUploadDirectory, { recursive: true });

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query('type') type?: GalleryImageType,
  ) {
    return this.galleryService.findAll(pagination, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: galleryUploadDirectory,
        filename: (_req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;

          callback(null, filename);
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
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateGalleryDto,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = `/uploads/gallery/${file.filename}`;

    return this.galleryService.create(data, imageUrl);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(@Body('ids') ids: string[]) {
    return this.galleryService.remove(ids);
  }
}
