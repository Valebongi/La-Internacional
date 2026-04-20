import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@lid/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule.forService('crm-core-service'),
  ],
})
export class AppModule {}
