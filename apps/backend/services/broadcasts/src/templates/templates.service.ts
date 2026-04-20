import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);

  constructor(private readonly config: ConfigService) {}

  private endpoint(): string {
    const version = this.config.get<string>('META_GRAPH_VERSION', 'v25.0');
    const wabaId = this.config.get<string>('META_WHATSAPP_BUSINESS_ACCOUNT_ID');
    if (!wabaId) {
      throw new HttpException('META_WHATSAPP_BUSINESS_ACCOUNT_ID no configurado', 500);
    }
    return `https://graph.facebook.com/${version}/${wabaId}/message_templates`;
  }

  private authHeader(): string {
    const token = this.config.get<string>('META_ACCESS_TOKEN');
    if (!token) throw new HttpException('META_ACCESS_TOKEN no configurado', 500);
    return `Bearer ${token}`;
  }

  private async metaFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authHeader(),
        ...(init.headers ?? {}),
      },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = body?.error?.message ?? body?.error?.error_user_msg ?? res.statusText;
      this.logger.error(`Meta API error: ${msg}`, body?.error);
      throw new HttpException({ message: msg, meta: body?.error ?? null }, res.status);
    }
    return body as T;
  }

  list() {
    const url = `${this.endpoint()}?limit=100&fields=id,name,category,language,status,components,rejected_reason`;
    return this.metaFetch(url);
  }

  create(dto: CreateTemplateDto) {
    return this.metaFetch(this.endpoint(), { method: 'POST', body: JSON.stringify(dto) });
  }

  remove(name: string) {
    const url = `${this.endpoint()}?name=${encodeURIComponent(name)}`;
    return this.metaFetch(url, { method: 'DELETE' });
  }
}
