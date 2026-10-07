import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { Repository } from 'typeorm';

import { Hero } from './entities/hero.entity';
import { UpdateHeroDto } from './dto/update-hero.dto';

const heroUploadDirectory = resolve(process.cwd(), 'uploads', 'hero');
const heroUploadUrlPrefix = '/uploads/hero/';

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
        images: data.images || [],
      });
    } else {
      Object.assign(hero, data);
    }

    return this.heroRepository.save(hero);
  }

  async addImages(imageUrls: string[]) {
    let hero = await this.heroRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });

    if (!hero) {
      hero = this.heroRepository.create({
        welcomeText: '',
        title1: '',
        title2: '',
        subtitle: '',
        images: [],
      });
    }

    hero.images = [...hero.images, ...imageUrls];

    return this.heroRepository.save(hero);
  }

  async removeImage(
    imageUrl: string,
  ): Promise<{ message: string; images: string[] }> {
    const hero = await this.heroRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });

    if (!hero) {
      throw new NotFoundException('Hero not found');
    }

    if (!hero.images.includes(imageUrl)) {
      throw new NotFoundException('Hero image not found');
    }

    let uploadedFilename: string | undefined;
    if (imageUrl.startsWith(heroUploadUrlPrefix)) {
      uploadedFilename = imageUrl.slice(heroUploadUrlPrefix.length);

      if (
        !uploadedFilename ||
        basename(uploadedFilename) !== uploadedFilename
      ) {
        throw new BadRequestException('Invalid hero image URL');
      }
    }

    hero.images = hero.images.filter((image) => image !== imageUrl);
    await this.heroRepository.save(hero);

    if (uploadedFilename) {
      try {
        await unlink(resolve(heroUploadDirectory, uploadedFilename));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
      }
    }

    return { message: 'Hero image deleted successfully', images: hero.images };
  }
}
