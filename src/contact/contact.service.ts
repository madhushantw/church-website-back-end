import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entites/contact.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly mailer: Transporter;

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {
    this.mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  private async sendMail(contact: Contact): Promise<void> {
    try {
      const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL;

      if (!notificationEmail) {
        throw new Error('CONTACT_NOTIFICATION_EMAIL is not configured');
      }

      await this.mailer.sendMail({
        from: {
          name: 'St Luke’s Church Website',
          address: process.env.SMTP_USER!,
        },
        to: notificationEmail,
        replyTo: contact.email,
        subject: `New Contact Us message: ${contact.subject}`,
        text: [
          'A new message has been submitted through the church website.',
          '',
          `Name: ${contact.name}`,
          `Email: ${contact.email}`,
          `Subject: ${contact.subject}`,
          '',
          'Message:',
          contact.message,
          '',
          `Contact ID: ${contact.id}`,
        ].join('\n'),
      });

      this.logger.log(`Contact notification sent for contact ${contact.id}`);
    } catch (error: unknown) {
      this.logger.error(
        `Contact ${contact.id} was saved, but its email notification failed.`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  async create(dto: CreateContactDto) {
    const contact = this.contactRepository.create(dto);
    const savedContact = await this.contactRepository.save(contact);
    await this.sendMail(savedContact);
    return savedContact;
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
