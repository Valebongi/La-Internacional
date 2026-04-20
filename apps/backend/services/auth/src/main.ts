import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.AUTH_PORT ?? 3001);
  app.enableCors();
  await app.listen(port);
  console.log(`[auth-service] listening on :${port}`);
}
bootstrap();
