import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // FRONTEND_ORIGIN may list several origins, comma-separated (e.g. production + a custom domain).
  const origins = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000').split(',').map((o) => o.trim().replace(/\/$/, ''));
  app.enableCors({ origin: origins });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
await bootstrap();
