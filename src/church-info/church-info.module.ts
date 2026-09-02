import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChurchInfoController } from './church-info.controller';
import { ChurchInfoService } from './church-info.service';
import { ChurchInfo } from './entities/church-info.entity';
import { ChurchInfoSeed } from './church-info.seed';

@Module({
  imports: [TypeOrmModule.forFeature([ChurchInfo])],
  controllers: [ChurchInfoController],
  providers: [ChurchInfoService, ChurchInfoSeed],
})
export class ChurchInfoModule {}
