import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { HeroService } from './hero.service';
import { UpdateHeroDto } from './dto/update-hero.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

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
}
