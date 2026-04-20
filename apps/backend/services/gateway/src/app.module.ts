import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@lid/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule.forService('gateway-service'),
  ],
})
export class AppModule {}
