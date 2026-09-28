import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entites/contact.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(dto: CreateContactDto) {
    const contact = this.contactRepository.create(dto);

    return this.contactRepository.save(contact);
  }

  async findAll({ page, limit }: PaginationDto) {
    const [items, total] = await this.contactRepository.findAndCount({
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
  async markAsRead(id: string) {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    contact.isRead = true;

    return this.contactRepository.save(contact);
  }

  async delete(id: string) {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact message not found');
    }

    await this.contactRepository.remove(contact);

    return contact;
  }
}
