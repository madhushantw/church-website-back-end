import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChurchInfo } from './entities/church-info.entity';
import { UpdateChurchInfoDto } from './dto/update-church-info.dto';

@Injectable()
export class ChurchInfoService {
  constructor(
    @InjectRepository(ChurchInfo)
    private readonly churchInfoRepository: Repository<ChurchInfo>,
  ) {}

  async findOne() {
    let churchInfo = await this.churchInfoRepository.findOne({
      order: { createdAt: 'ASC' },
    });

    if (!churchInfo) {
      throw new NotFoundException('Church info not found');
    }

    return churchInfo;
  }

  async update(data: UpdateChurchInfoDto) {
    let churchInfo = await this.churchInfoRepository.findOne({
      order: { createdAt: 'ASC' },
    });

    if (!churchInfo) {
      churchInfo = this.churchInfoRepository.create({
        name: data.name || 'Church Name',
        ...data,
      });
    } else {
      Object.assign(churchInfo, data);
    }

    return this.churchInfoRepository.save(churchInfo);
  }
}
