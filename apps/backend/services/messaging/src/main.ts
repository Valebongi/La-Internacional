import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.MESSAGING_PORT ?? 3003);
  app.enableCors();
  await app.listen(port);
  console.log(`[messaging-service] listening on :${port}`);
}
bootstrap();
