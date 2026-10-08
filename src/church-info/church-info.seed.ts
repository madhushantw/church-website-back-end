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
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      foundedYear: 2000,
      facebookUrl: '',
      youtubeUrl: '',
      instagramUrl: '',
      aboutUsTitle: '',
      aboutUsSubTitle: '',
      aboutUsImage: null,
      aboutHeroImage: null,
      giveHeroImage: null,
      eventHeroImage: null,
      galleryHeroImage: null,
      ministryHeroImage: null,
      sermonsHeroImage: null,
      aboutUs: '',
      pastorName: '',
      pastorTitle1: '',
      pastorTitle2: '',
      pastorMessage1: '',
      pastorMessage2: '',
      pastorAvatar: '',
      video1: '',
      video2: '',
      bankAccountName: '',
      bank: '',
      accountNumber: '',
      routingNumber: '',
    });

    await this.churchInfoRepository.save(churchInfo);

    console.log('Church info seeded successfully');
  }
}
