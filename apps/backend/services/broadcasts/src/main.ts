import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
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
