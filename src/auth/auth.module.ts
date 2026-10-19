import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { MailModule } from 'src/mail/mail.module';
import { PasswordResetOtp } from './entities/password-reset-otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordResetOtp]),
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, MailModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '3d',
        },
      }),
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
