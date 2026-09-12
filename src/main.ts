import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { UsersSeed } from './users/users.seed';
import { ChurchInfoSeed } from './church-info/church-info.seed';
import { HeroSeed } from './hero/hero.seed';
import { TransformInterceptor } from './utils/transform.interceptor';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  const usersSeed = app.get(UsersSeed);
  await usersSeed.run();

  const churchInfoSeed = app.get(ChurchInfoSeed);
  await churchInfoSeed.run();

  const heroSeed = app.get(HeroSeed);
  await heroSeed.run();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3030);
}

void bootstrap();
