import { NestFactory } from '@nestjs/core';
import { validateConfig } from '@lid/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Validate environment variables on startup
  validateConfig();

  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.INTEGRATION_PORT ?? 3007);
  app.enableCors();
  await app.listen(port);
  console.log(`[integration-service] listening on :${port}`);
}
bootstrap();
