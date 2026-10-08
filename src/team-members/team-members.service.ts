import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMember } from './entities/team-member.entity';

const teamMemberUploadDirectory = resolve(
  process.cwd(),
  'uploads',
  'team-members',
);
const teamMemberUploadUrlPrefix = '/uploads/team-members/';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
  ) {}

  async create(data: CreateTeamMemberDto) {
    const teamMember = this.teamMemberRepository.create(data);

    return this.teamMemberRepository.save(teamMember);
  }

  async findAll({ page, limit }: PaginationDto) {
    const [items, total] = await this.teamMemberRepository.findAndCount({
      order: { name: 'ASC' },
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
    const teamMember = await this.teamMemberRepository.findOne({
      where: { id },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }

    return teamMember;
  }

  async update(id: string, data: UpdateTeamMemberDto) {
    const teamMember = await this.findOne(id);
    const previousPhoto = teamMember.photo;

    Object.assign(teamMember, data);

    const updatedTeamMember = await this.teamMemberRepository.save(teamMember);

    if (previousPhoto !== updatedTeamMember.photo) {
      await this.removeUploadedPhoto(previousPhoto);
    }

    return updatedTeamMember;
  }

  async remove(id: string) {
    const teamMember = await this.findOne(id);

    await this.removeUploadedPhoto(teamMember.photo);

    await this.teamMemberRepository.remove(teamMember);

    return { message: 'Team member deleted successfully' };
  }

  private async removeUploadedPhoto(photo: string) {
    if (!photo.startsWith(teamMemberUploadUrlPrefix)) {
      return;
    }

    const filename = photo.slice(teamMemberUploadUrlPrefix.length);

    if (!filename || basename(filename) !== filename) {
      return;
    }

    try {
      await unlink(resolve(teamMemberUploadDirectory, filename));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
