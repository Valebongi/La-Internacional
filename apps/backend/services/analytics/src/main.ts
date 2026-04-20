import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.ANALYTICS_PORT ?? 3006);
  app.enableCors();
  await app.listen(port);
  console.log(`[analytics-service] listening on :${port}`);
}
bootstrap();
