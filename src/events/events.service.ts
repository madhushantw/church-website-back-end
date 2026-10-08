import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'node:path';
import { Repository } from 'typeorm';

import { removeUploadedFile } from '../common/utils/remove-uploaded-file';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const eventUploadDirectory = resolve(process.cwd(), 'uploads', 'events');
const eventImageUrlPrefix = '/uploads/events/';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(data: CreateEventDto) {
    const event = this.eventRepository.create({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });

    return this.eventRepository.save(event);
  }

  async findAll({ page, limit }: PaginationDto) {
    const [items, total] = await this.eventRepository.findAndCount({
      order: {
        startDate: 'ASC',
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
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, data: UpdateEventDto) {
    const event = await this.findOne(id);
    const previousImage = event.image;

    Object.assign(event, {
      ...data,
      ...(data.startDate && {
        startDate: new Date(data.startDate),
      }),
      ...(data.endDate && {
        endDate: new Date(data.endDate),
      }),
    });

    const updatedEvent = await this.eventRepository.save(event);

    if (previousImage && previousImage !== updatedEvent.image) {
      await removeUploadedFile(
        previousImage,
        eventImageUrlPrefix,
        eventUploadDirectory,
      );
    }

    return updatedEvent;
  }

  async remove(id: string) {
    const event = await this.findOne(id);

    await this.eventRepository.remove(event);

    if (event.image) {
      await removeUploadedFile(
        event.image,
        eventImageUrlPrefix,
        eventUploadDirectory,
      );
    }

    return {
      message: 'Event deleted successfully',
    };
  }
}
