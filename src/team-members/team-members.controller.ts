import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { extname } from 'node:path';
import { diskStorage } from 'multer';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UserRole } from '../users/entities/user.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMembersService } from './team-members.service';

const teamMemberUploadDirectory = './uploads/team-members';

mkdirSync(teamMemberUploadDirectory, { recursive: true });

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.teamMembersService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: teamMemberUploadDirectory,
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
    @Body() data: CreateTeamMemberDto,
  ) {
    const photo = file ? `/uploads/team-members/${file.filename}` : data.photo;

    if (!photo) {
      throw new BadRequestException('Photo file is required');
    }

    return this.teamMembersService.create({ ...data, photo });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: teamMemberUploadDirectory,
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
    @Body() data: UpdateTeamMemberDto,
  ) {
    const updateData = file
      ? { ...data, photo: `/uploads/team-members/${file.filename}` }
      : data;

    return this.teamMembersService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  remove(@Param('id') id: string) {
    return this.teamMembersService.remove(id);
  }
}
