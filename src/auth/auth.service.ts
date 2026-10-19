import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, IsNull } from 'typeorm';
import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetOtp } from './entities/password-reset-otp.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(PasswordResetOtp)
    private readonly otpRepository: Repository<PasswordResetOtp>,

    private readonly jwtService: JwtService,

    private readonly mailService: MailService,
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  private verifyOtp(otp: string, otpHash: string): boolean {
    const providedHash = Buffer.from(this.hashOtp(otp), 'hex');
    const storedHash = Buffer.from(otpHash, 'hex');

    return (
      providedHash.length === storedHash.length &&
      timingSafeEqual(providedHash, storedHash)
    );
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: this.normalizeEmail(data.email),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(data.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async loginWithAccessToken(accessToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
      }>(accessToken);

      const user = await this.userRepository.findOne({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid access token');
      }

      return {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const email = this.normalizeEmail(data.email);

    const genericResponse = {
      message: 'If the account exists, a reset code will be sent.',
    };

    const user = await this.userRepository.findOne({
      where: { email },
    });

    // Do not reveal whether the email exists.
    if (!user) {
      return genericResponse;
    }

    const otp = randomInt(100000, 1000000).toString();
    const now = new Date();

    // Invalidate previous unused OTPs for this email.
    await this.otpRepository.update(
      { email, usedAt: IsNull() },
      { usedAt: now },
    );

    const resetOtp = this.otpRepository.create({
      email,
      otpHash: this.hashOtp(otp),
      expiresAt: new Date(now.getTime() + 10 * 60 * 1000),
      attempts: 0,
      usedAt: null,
    });

    const savedOtp = await this.otpRepository.save(resetOtp);

    try {
      // Implement this method in your existing MailService.
      await this.mailService.sendPasswordResetOtp(email, otp);
    } catch {
      // Invalidate the OTP if email delivery fails.
      savedOtp.usedAt = new Date();
      await this.otpRepository.save(savedOtp);

      throw new InternalServerErrorException(
        'Unable to send the reset email. Please try again.',
      );
    }

    return genericResponse;
  }

  async resetPassword(data: ResetPasswordDto) {
    const email = this.normalizeEmail(data.email);

    const resetOtp = await this.otpRepository.findOne({
      where: {
        email,
        usedAt: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!resetOtp || resetOtp.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (resetOtp.attempts >= 5) {
      throw new BadRequestException('Too many attempts. Request a new OTP.');
    }

    if (!this.verifyOtp(data.otp, resetOtp.otpHash)) {
      resetOtp.attempts += 1;
      await this.otpRepository.save(resetOtp);

      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.password = await bcrypt.hash(data.newPassword, 10);
    resetOtp.usedAt = new Date();

    // Save the password and consume the OTP together.
    await this.userRepository.manager.transaction(async (manager) => {
      await manager.save(User, user);
      await manager.save(PasswordResetOtp, resetOtp);
    });

    return {
      message: 'Password reset successfully.',
    };
  }
}
