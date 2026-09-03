import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hero } from './entities/hero.entity';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>,
  ) {}

  async findOne() {
    const hero = await this.heroRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });

    if (!hero) {
      throw new NotFoundException('Hero not found');
    }

    return hero;
  }

  async update(data: UpdateHeroDto) {
    let hero = await this.heroRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });

    if (!hero) {
      hero = this.heroRepository.create({
        welcomeText: data.welcomeText || '',
        title1: data.title1 || '',
        title2: data.title2 || '',
        subtitle: data.subtitle || '',
        image: data.image || '',
      });
    } else {
      Object.assign(hero, data);
    }

    return this.heroRepository.save(hero);
  }
}
