import { NestFactory } from '@nestjs/core';
import { validateConfig } from '@lid/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Validate environment variables on startup
  validateConfig();

  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? process.env.GATEWAY_PORT ?? 8080);
  app.enableCors();
  await app.listen(port);
  console.log(`[gateway-service] listening on :${port}`);
}
bootstrap();
