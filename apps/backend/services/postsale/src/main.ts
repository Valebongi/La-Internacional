import { NestFactory } from '@nestjs/core';
import { validateConfig } from '@lid/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Validate environment variables on startup
  validateConfig();

  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.POSTSALE_PORT ?? 3005);
  app.enableCors();
  await app.listen(port);
  console.log(`[postsale-service] listening on :${port}`);
}
bootstrap();
