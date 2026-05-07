import { NestFactory } from '@nestjs/core';
import { validateConfig } from '@lid/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Validate environment variables on startup
  validateConfig();

  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.AUTH_PORT ?? 3001);
  app.enableCors();
  await app.listen(port);
  console.log(`[auth-service] listening on :${port}`);
}
bootstrap();
