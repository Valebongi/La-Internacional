import { NestFactory } from '@nestjs/core';
import { validateConfig } from '@lid/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Validate environment variables on startup
  validateConfig();

  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.ANALYTICS_PORT ?? 3006);
  app.enableCors();
  await app.listen(port);
  console.log(`[analytics-service] listening on :${port}`);
}
bootstrap();
