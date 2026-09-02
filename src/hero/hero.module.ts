import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';
import { Hero } from './entities/hero.entity';
import { HeroSeed } from './hero.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Hero])],
  controllers: [HeroController],
  providers: [HeroService, HeroSeed],
})
export class HeroModule {}
