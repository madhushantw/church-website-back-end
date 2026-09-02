import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sermon } from './entities/sermon.entity';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';

@Injectable()
export class SermonsService {
  constructor(
    @InjectRepository(Sermon)
    private readonly sermonRepository: Repository<Sermon>,
  ) {}

  async create(data: CreateSermonDto) {
    const sermon = this.sermonRepository.create(data);

    return this.sermonRepository.save(sermon);
  }

  async findAll() {
    return this.sermonRepository.find();
  }

  async findOne(id: string) {
    const sermon = await this.sermonRepository.findOne({
      where: { id },
    });

    if (!sermon) {
      throw new NotFoundException('Sermon not found');
    }

    return sermon;
  }

  async update(id: string, data: UpdateSermonDto) {
    const sermon = await this.findOne(id);

    Object.assign(sermon, data);

    return this.sermonRepository.save(sermon);
  }

  async remove(id: string) {
    const sermon = await this.findOne(id);

    await this.sermonRepository.remove(sermon);

    return {
      message: 'Sermon deleted successfully',
    };
  }
}
