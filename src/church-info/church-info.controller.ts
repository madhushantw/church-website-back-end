import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { ChurchInfoService } from './church-info.service';
import { UpdateChurchInfoDto } from './dto/update-church-info.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

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
  update(@Body() data: UpdateChurchInfoDto) {
    return this.churchInfoService.update(data);
  }
}
