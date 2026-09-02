import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gallery } from './entities/gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  async create(data: CreateGalleryDto) {
    const gallery = this.galleryRepository.create(data);

    return this.galleryRepository.save(gallery);
  }

  async findAll() {
    return this.galleryRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery item not found');
    }

    return gallery;
  }

  async update(id: string, data: UpdateGalleryDto) {
    const gallery = await this.findOne(id);

    Object.assign(gallery, data);

    return this.galleryRepository.save(gallery);
  }

  async remove(id: string) {
    const gallery = await this.findOne(id);

    await this.galleryRepository.remove(gallery);

    return {
      message: 'Gallery item deleted successfully',
    };
  }
}
