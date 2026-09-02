import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersSeed {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async run() {
    const rootExists = await this.userRepository.findOne({
      where: {
        role: UserRole.ROOT,
      },
    });

    if (rootExists) {
      console.log('ROOT user already exists');
      return;
    }

    const password = await bcrypt.hash(process.env.ROOT_PASSWORD!, 10);

    const root = this.userRepository.create({
      name: process.env.ROOT_NAME!,
      email: process.env.ROOT_EMAIL!,
      password,
      role: UserRole.ROOT,
    });

    await this.userRepository.save(root);

    console.log('ROOT user created');
  }
}
