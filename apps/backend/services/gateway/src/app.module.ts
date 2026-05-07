import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@lid/common';
import { MetaWebhookModule } from './webhook/meta-webhook.module';
import { ConfigController } from './config.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule.forService('gateway-service'),
    MetaWebhookModule,
  ],
  controllers: [ConfigController],
})
export class AppModule {}
