import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink } from 'node:fs/promises';
import { basename } from 'node:path';

import { Gallery } from './entities/gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  async create(data: CreateGalleryDto, imageUrl: string) {
    const gallery = this.galleryRepository.create({
      title: data.title,
      description: data.description,
      imageUrl,
      imageType: data.type,
    });

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

  async remove(id: string) {
    const gallery = await this.findOne(id);
    const filename = basename(new URL(gallery.imageUrl).pathname);
    await unlink(`./uploads/gallery/${filename}`).catch(() => {});
    await this.galleryRepository.remove(gallery);
    return {
      message: 'Gallery item deleted successfully',
    };
  }
}
