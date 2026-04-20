import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.INTEGRATION_PORT ?? 3007);
  app.enableCors();
  await app.listen(port);
  console.log(`[integration-service] listening on :${port}`);
}
bootstrap();
