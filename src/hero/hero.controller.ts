import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';
import { HeroService } from './hero.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

const heroUploadDirectory = join(process.cwd(), 'uploads', 'hero');

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  findOne() {
    return this.heroService.findOne();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  update(@Body() data: UpdateHeroDto) {
    return this.heroService.update(data);
  }

  @Post('images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          mkdir(heroUploadDirectory, { recursive: true }, (error) => {
            callback(error, heroUploadDirectory);
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
  uploadImages(@UploadedFiles() files: Express.Multer.File[] | undefined) {
    if (!files?.length) {
      throw new BadRequestException('At least one image file is required');
    }

    const imageUrls = files.map((file) => `/uploads/hero/${file.filename}`);

    return this.heroService.addImages(imageUrls);
  }

  @Delete('images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  removeImage(@Body('imageUrl') imageUrl: string) {
    if (!imageUrl) {
      throw new BadRequestException('Image URL is required');
    }

    return this.heroService.removeImage(imageUrl);
  }
}
