import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { SermonsModule } from './sermons/sermons.module';
import { GalleryModule } from './gallery/gallery.module';
import { MinistriesModule } from './ministries/ministries.module';
import { ChurchInfoModule } from './church-info/church-info.module';
import { HeroModule } from './hero/hero.module';
import { ContactModule } from './contact/contact.module';
import { MissionPartnersModule } from './mission-partners/mission-partners.module';
import { TeamMembersModule } from './team-members/team-members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    UsersModule,
    AuthModule,
    EventsModule,
    SermonsModule,
    GalleryModule,
    MinistriesModule,
    ChurchInfoModule,
    HeroModule,
    ContactModule,
    MissionPartnersModule,
    TeamMembersModule,
  ],
})
export class AppModule {}
