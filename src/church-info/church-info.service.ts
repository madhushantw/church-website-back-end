import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { Repository } from 'typeorm';

import { ChurchInfo } from './entities/church-info.entity';
import { UpdateChurchInfoDto } from './dto/update-church-info.dto';

const churchInfoUploadDirectory = resolve(
  process.cwd(),
  'uploads',
  'church-info',
);
const churchInfoUploadUrlPrefix = '/uploads/church-info/';
const imageFields = [
  'aboutUsImage',
  'aboutHeroImage',
  'giveHeroImage',
  'eventHeroImage',
  'galleryHeroImage',
  'ministryHeroImage',
  'sermonsHeroImage',
  'pastorAvatar',
] as const;

@Injectable()
export class ChurchInfoService {
  constructor(
    @InjectRepository(ChurchInfo)
    private readonly churchInfoRepository: Repository<ChurchInfo>,
  ) {}

  private async removeUploadedImageIfNeeded(
    currentValue: string | null | undefined,
    nextValue: string | null | undefined,
  ) {
    if (
      !currentValue ||
      currentValue === nextValue ||
      !currentValue.startsWith(churchInfoUploadUrlPrefix)
    ) {
      return;
    }

    const filename = currentValue.slice(churchInfoUploadUrlPrefix.length);

    if (!filename || basename(filename) !== filename) {
      return;
    }

    try {
      await unlink(resolve(churchInfoUploadDirectory, filename));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async findOne() {
    const churchInfo = await this.churchInfoRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });

    if (!churchInfo) {
      throw new NotFoundException('Church info not found');
    }

    return churchInfo;
  }

  async update(data: UpdateChurchInfoDto) {
    let churchInfo = await this.churchInfoRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });

    if (!churchInfo) {
      churchInfo = this.churchInfoRepository.create({
        name: data.name || 'Church Name',
        ...data,
      });
    } else {
      const record = churchInfo as unknown as Record<
        string,
        string | null | undefined
      >;
      const dataRecord = data as Record<string, string | null | undefined>;
      const providedFieldNames = new Set(Object.keys(dataRecord));

      for (const field of imageFields) {
        const hasFieldValue = providedFieldNames.has(field);
        const nextValue = hasFieldValue ? dataRecord[field] : record[field];

        await this.removeUploadedImageIfNeeded(record[field], nextValue);
      }

      Object.assign(churchInfo, data);
    }

    return this.churchInfoRepository.save(churchInfo);
  }
}
