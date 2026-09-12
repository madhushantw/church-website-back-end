import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Sermon, SermonPdfFile } from './entities/sermon.entity';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';

@Injectable()
export class SermonsService {
  constructor(
    @InjectRepository(Sermon)
    private readonly sermonRepository: Repository<Sermon>,
  ) {}

  async create(data: CreateSermonDto) {
    const sermon = this.sermonRepository.create(data);

    return this.sermonRepository.save(sermon);
  }

  async findAll() {
    return this.sermonRepository.find();
  }

  async findOne(id: string) {
    const sermon = await this.sermonRepository.findOne({
      where: { id },
    });

    if (!sermon) {
      throw new NotFoundException('Sermon not found');
    }

    return sermon;
  }

  async update(id: string, data: UpdateSermonDto) {
    const sermon = await this.findOne(id);

    Object.assign(sermon, data);

    return this.sermonRepository.save(sermon);
  }

  async addPdf(id: string, pdfFile: SermonPdfFile) {
    const sermon = await this.findOne(id);
    const existingPdf = sermon.pdfFiles.find(
      (existingFile) => existingFile.type === pdfFile.type,
    );

    sermon.pdfFiles = existingPdf
      ? sermon.pdfFiles.map((existingFile) =>
          existingFile.type === pdfFile.type ? pdfFile : existingFile,
        )
      : [...sermon.pdfFiles, pdfFile];

    const savedSermon = await this.sermonRepository.save(sermon);

    if (existingPdf && existingPdf.url !== pdfFile.url) {
      await this.removeLocalPdf(existingPdf.url);
    }

    return savedSermon;
  }

  private async removeLocalPdf(url: string) {
    const pathname = new URL(url, 'http://localhost').pathname;

    if (!pathname.startsWith('/uploads/sermons/')) {
      return;
    }

    try {
      await unlink(
        join(process.cwd(), 'uploads', 'sermons', basename(pathname)),
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async remove(id: string) {
    const sermon = await this.findOne(id);

    await Promise.all(
      sermon.pdfFiles.map((pdfFile) => this.removeLocalPdf(pdfFile.url)),
    );

    await this.sermonRepository.remove(sermon);

    return {
      message: 'Sermon deleted successfully',
    };
  }
}
