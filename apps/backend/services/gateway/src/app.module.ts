import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@lid/common';
import { MetaWebhookModule } from './webhook/meta-webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule.forService('gateway-service'),
    MetaWebhookModule,
  ],
})
export class AppModule {}
