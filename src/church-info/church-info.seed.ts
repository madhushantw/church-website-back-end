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
      aboutUsTitle: 'About us',
      aboutUsSubTitle: 'Welcome to our church',
      aboutUsImage: null,
      aboutHeroImage: null,
      giveHeroImage: null,
      eventHeroImage: null,
      galleryHeroImage: null,
      ministryHeroImage: null,
      sermonsHeroImage: null,
      aboutUs:
        'We are a loving church community serving God and our neighbors.',
      pastorName: 'Pastor Name',
      pastorTitle1: 'Senior Pastor',
      pastorTitle2: 'Community Leader',
      pastorMessage1:
        'We believe in prayer, worship, and serving our community.',
      pastorMessage2: 'Together we can make a difference in the lives of many.',
      pastorAvatar: '/uploads/church-info/pastor.jpg',
      video1: 'https://www.youtube.com/watch?v=your-video-1',
      video2: 'https://www.youtube.com/watch?v=your-video-2',
      bankAccountName: 'Church Giving Fund',
      bank: 'First National Bank',
      accountNumber: '123456789',
      routingNumber: '021000021',
    });

    await this.churchInfoRepository.save(churchInfo);

    console.log('Church info seeded successfully');
  }
}
