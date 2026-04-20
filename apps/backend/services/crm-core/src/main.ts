import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.CRM_CORE_PORT ?? 3002);
  app.enableCors();
  await app.listen(port);
  console.log(`[crm-core-service] listening on :${port}`);
}
bootstrap();
