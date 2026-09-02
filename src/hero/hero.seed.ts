import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hero } from './entities/hero.entity';

@Injectable()
export class HeroSeed {
  constructor(
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>,
  ) {}

  async run() {
    const heroExists = await this.heroRepository.findOneBy({});

    if (heroExists) {
      console.log('Hero already exists');
      return;
    }

    const hero = this.heroRepository.create({
      welcomeText: 'Welcome to our church',
      title1: 'A place to',
      title2: 'belong',
      subtitle: 'Growing together in faith, hope, and love.',
      image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b',
    });

    await this.heroRepository.save(hero);

    console.log('Hero seeded successfully');
  }
}
