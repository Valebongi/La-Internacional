import { DynamicModule, Module } from '@nestjs/common';
import { HealthController, SERVICE_NAME } from './health.controller';

@Module({})
export class HealthModule {
  static forService(name: string): DynamicModule {
    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [{ provide: SERVICE_NAME, useValue: name }],
    };
  }
}
