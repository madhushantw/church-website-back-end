import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

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

  findAll() {
    return this.eventRepository.find({
      order: {
        startDate: 'ASC',
      },
    });
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

    Object.assign(event, {
      ...data,
      ...(data.startDate && {
        startDate: new Date(data.startDate),
      }),
      ...(data.endDate && {
        endDate: new Date(data.endDate),
      }),
    });

    return this.eventRepository.save(event);
  }

  async remove(id: string) {
    const event = await this.findOne(id);

    await this.eventRepository.remove(event);

    return {
      message: 'Event deleted successfully',
    };
  }
}
