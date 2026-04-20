import { Controller, Get, Inject } from '@nestjs/common';

export const SERVICE_NAME = 'SERVICE_NAME';

@Controller('health')
export class HealthController {
  constructor(@Inject(SERVICE_NAME) private readonly service: string) {}

  @Get()
  health() {
    return { ok: true, service: this.service, ts: new Date().toISOString() };
  }
}
