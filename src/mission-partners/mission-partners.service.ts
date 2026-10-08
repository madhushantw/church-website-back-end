import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'node:path';
import { Repository } from 'typeorm';

import { removeUploadedFile } from '../common/utils/remove-uploaded-file';
import { MissionPartner } from './entities/mission-partner.entity';
import { CreateMissionPartnerDto } from './dto/create-mission-partner.dto';
import { UpdateMissionPartnerDto } from './dto/update-mission-partner.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const missionPartnerUploadDirectory = resolve(
  process.cwd(),
  'uploads',
  'mission-partners',
);
const missionPartnerImageUrlPrefix = '/uploads/mission-partners/';

@Injectable()
export class MissionPartnersService {
  constructor(
    @InjectRepository(MissionPartner)
    private readonly missionPartnerRepository: Repository<MissionPartner>,
  ) {}

  async create(data: CreateMissionPartnerDto) {
    const missionPartner = this.missionPartnerRepository.create(data);

    return this.missionPartnerRepository.save(missionPartner);
  }

  async findAll({ page, limit }: PaginationDto) {
    const [items, total] = await this.missionPartnerRepository.findAndCount({
      order: {
        title: 'ASC',
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
    const missionPartner = await this.missionPartnerRepository.findOne({
      where: { id },
    });

    if (!missionPartner) {
      throw new NotFoundException('Mission partner not found');
    }

    return missionPartner;
  }

  async update(id: string, data: UpdateMissionPartnerDto) {
    const missionPartner = await this.findOne(id);
    const previousImage = missionPartner.image;

    Object.assign(missionPartner, data);

    const updatedMissionPartner =
      await this.missionPartnerRepository.save(missionPartner);

    if (previousImage && previousImage !== updatedMissionPartner.image) {
      await removeUploadedFile(
        previousImage,
        missionPartnerImageUrlPrefix,
        missionPartnerUploadDirectory,
      );
    }

    return updatedMissionPartner;
  }

  async remove(id: string) {
    const missionPartner = await this.findOne(id);

    await this.missionPartnerRepository.remove(missionPartner);

    if (missionPartner.image) {
      await removeUploadedFile(
        missionPartner.image,
        missionPartnerImageUrlPrefix,
        missionPartnerUploadDirectory,
      );
    }

    return {
      message: 'Mission partner deleted successfully',
    };
  }
}
