import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@lid/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule.forService('messaging-service'),
  ],
})
export class AppModule {}
