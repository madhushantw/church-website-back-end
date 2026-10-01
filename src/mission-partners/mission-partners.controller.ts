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
} from '@nestjs/common';

import { MissionPartnersService } from './mission-partners.service';
import { CreateMissionPartnerDto } from './dto/create-mission-partner.dto';
import { UpdateMissionPartnerDto } from './dto/update-mission-partner.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
  create(@Body() data: CreateMissionPartnerDto) {
    return this.missionPartnersService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() data: UpdateMissionPartnerDto) {
    return this.missionPartnersService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.missionPartnersService.remove(id);
  }
}
