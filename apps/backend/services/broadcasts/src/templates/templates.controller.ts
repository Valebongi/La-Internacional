import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import type { CreateTemplateDto } from './dto/create-template.dto';

@Controller('api/v1/templates')
export class TemplatesController {
  constructor(private readonly svc: TemplatesService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Post()
  create(@Body() dto: CreateTemplateDto) {
    return this.svc.create(dto);
  }

  @Delete()
  remove(@Query('name') name: string) {
    return this.svc.remove(name);
  }
}
