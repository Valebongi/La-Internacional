import { NestFactory } from '@nestjs/core';
import { validateConfig } from '@lid/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Validate environment variables on startup
  validateConfig();

  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.BROADCASTS_PORT ?? 3004);
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
  });
  await app.listen(port);
  console.log(`[broadcasts-service] listening on :${port}`);
}
bootstrap();
