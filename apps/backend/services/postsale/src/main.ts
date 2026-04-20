import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.POSTSALE_PORT ?? 3005);
  app.enableCors();
  await app.listen(port);
  console.log(`[postsale-service] listening on :${port}`);
}
bootstrap();
