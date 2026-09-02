import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm/dist/typeorm.module';
import { SermonsController } from './sermons.controller';
import { SermonsService } from './sermons.service';
import { Sermon } from './entities/sermon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sermon])],
  controllers: [SermonsController],
  providers: [SermonsService],
})
export class SermonsModule {}
