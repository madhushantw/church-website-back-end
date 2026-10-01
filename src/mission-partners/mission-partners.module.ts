import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MissionPartnersController } from './mission-partners.controller';
import { MissionPartnersService } from './mission-partners.service';
import { MissionPartner } from './entities/mission-partner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MissionPartner])],
  controllers: [MissionPartnersController],
  providers: [MissionPartnersService],
})
export class MissionPartnersModule {}
