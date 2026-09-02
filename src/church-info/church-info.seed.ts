import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChurchInfo } from './entities/church-info.entity';

@Injectable()
export class ChurchInfoSeed {
  constructor(
    @InjectRepository(ChurchInfo)
    private readonly churchInfoRepository: Repository<ChurchInfo>,
  ) {}

  async run() {
    const churchInfoExists = await this.churchInfoRepository.findOneBy({});

    if (churchInfoExists) {
      console.log('Church info already exists');
      return;
    }

    const churchInfo = this.churchInfoRepository.create({
      name: 'Your Church Name',
      description: 'Church description',
      address: '123 Main St, City, State 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@church.com',
      website: 'https://church.com',
      foundedYear: 2000,
      facebookUrl: 'https://facebook.com/church',
      youtubeUrl: 'https://youtube.com/church',
      instagramUrl: 'https://instagram.com/church',
    });

    await this.churchInfoRepository.save(churchInfo);

    console.log('Church info seeded successfully');
  }
}
