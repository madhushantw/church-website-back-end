import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SermonsService } from './sermons.service';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';
import { SermonPdfType } from './entities/sermon.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync } from 'node:fs';
import { extname } from 'node:path';
import type { Request } from 'express';

const sermonUploadDirectory = './uploads/sermons';
mkdirSync(sermonUploadDirectory, { recursive: true });

@Controller('sermons')
export class SermonsController {
  constructor(private readonly sermonsService: SermonsService) {}
  @Get()
  findAll() {
    return this.sermonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sermonsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateSermonDto) {
    return this.sermonsService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() data: UpdateSermonDto) {
    return this.sermonsService.update(id, data);
  }

  @Post(':id/pdf')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: sermonUploadDirectory,
        filename: (_req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(
            new BadRequestException('Only PDF files are allowed'),
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
  uploadPdf(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: SermonPdfType,
    @Req() request: Request,
  ) {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    return this.sermonsService.addPdf(id, {
      type,
      url: `${request.protocol}://${request.get('host')}/uploads/sermons/${file.filename}`,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.sermonsService.remove(id);
  }
}
