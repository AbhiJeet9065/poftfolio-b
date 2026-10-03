import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // FRONTEND_ORIGIN: comma-separated allowed origins. An entry may contain `*` as a wildcard for
  // one hostname label chunk, e.g. https://poftfolio-*-abhijeet-khans-projects.vercel.app to allow
  // every Vercel preview deployment of the project.
  const allowed = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean)
    .map((o) => (o.includes('*') ? new RegExp(`^${o.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[a-z0-9-]+')}$`, 'i') : o));
  app.enableCors({
    origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => cb(null, !origin || allowed.some((a) => (typeof a === 'string' ? a === origin : a.test(origin)))),
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
await bootstrap();
