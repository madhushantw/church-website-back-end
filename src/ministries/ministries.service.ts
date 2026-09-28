import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ministry } from './entities/ministry.entity';
import { CreateMinistryDto } from './dto/create-ministry.dto';
import { UpdateMinistryDto } from './dto/update-ministry.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MinistriesService {
  constructor(
    @InjectRepository(Ministry)
    private readonly ministryRepository: Repository<Ministry>,
  ) {}

  async create(data: CreateMinistryDto) {
    const ministry = this.ministryRepository.create(data);

    return this.ministryRepository.save(ministry);
  }

  async findAll({ page, limit }: PaginationDto) {
    const [items, total] = await this.ministryRepository.findAndCount({
      order: {
        name: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const ministry = await this.ministryRepository.findOne({
      where: { id },
    });

    if (!ministry) {
      throw new NotFoundException('Ministry not found');
    }

    return ministry;
  }

  async update(id: string, data: UpdateMinistryDto) {
    const ministry = await this.findOne(id);

    Object.assign(ministry, data);

    return this.ministryRepository.save(ministry);
  }

  async remove(id: string) {
    const ministry = await this.findOne(id);

    await this.ministryRepository.remove(ministry);

    return {
      message: 'Ministry deleted successfully',
    };
  }
}
