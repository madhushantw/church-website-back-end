import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { UsersSeed } from './users/users.seed';
import { ChurchInfoSeed } from './church-info/church-info.seed';
import { HeroSeed } from './hero/hero.seed';
import { TransformInterceptor } from './utils/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalInterceptors(new TransformInterceptor());

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

bootstrap();
