import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { extname } from 'node:path';
import { diskStorage } from 'multer';

import { ChurchInfoService } from './church-info.service';
import { UpdateChurchInfoDto } from './dto/update-church-info.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

const churchInfoUploadDirectory = './uploads/church-info';

mkdirSync(churchInfoUploadDirectory, { recursive: true });

@Controller('church-info')
export class ChurchInfoController {
  constructor(private readonly churchInfoService: ChurchInfoService) {}

  @Get()
  findOne() {
    return this.churchInfoService.findOne();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: churchInfoUploadDirectory,
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
    @UploadedFiles() files: Express.Multer.File[] | undefined,
    @Body() data: UpdateChurchInfoDto,
  ) {
    const uploadedImageUrls = (files ?? []).reduce<Record<string, string>>(
      (result, file) => {
        result[file.fieldname] = `/uploads/church-info/${file.filename}`;
        return result;
      },
      {},
    );

    return this.churchInfoService.update({
      ...data,
      ...uploadedImageUrls,
    });
  }
}
