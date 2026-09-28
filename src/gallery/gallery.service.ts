import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { unlink } from 'node:fs/promises';
import { basename } from 'node:path';

import { Gallery, GalleryImageType } from './entities/gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
  async findAll({ page, limit }: PaginationDto, type?: GalleryImageType) {
    const [items, total] = await this.galleryRepository.findAndCount({
      where: type ? { imageType: type } : undefined,
      order: {
        createdAt: 'DESC',
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
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery item not found');
    }

    return gallery;
  }

  async remove(ids: string[]) {
    const galleries = await this.galleryRepository.findBy({
      id: In(ids),
    });

    await Promise.all(
      galleries.map(async (gallery) => {
        const filename = basename(gallery.imageUrl);

        await unlink(`./uploads/gallery/${filename}`).catch(() => {});
      }),
    );

    await this.galleryRepository.remove(galleries);

    return {
      message: 'Gallery items deleted successfully',
    };
  }
}
