import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.GATEWAY_PORT ?? 8080);
  app.enableCors();
  await app.listen(port);
  console.log(`[gateway-service] listening on :${port}`);
}
bootstrap();
