import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Sse,
  HttpCode,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Observable, Subject, map } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

interface InboundMsg {
  from: string;
  contactName: string;
  body: string;
  type: string;
  timestamp: string;
  messageId: string;
  phoneNumberId: string;
}

@Controller('webhooks/meta')
export class MetaWebhookController {
  private readonly logger = new Logger(MetaWebhookController.name);
  private readonly stream$ = new Subject<InboundMsg>();

  // Meta llama a este GET para verificar el webhook al registrarlo
  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
  ): string {
    const expected = process.env.META_VERIFY_TOKEN || 'lid-webhook-token';
    if (mode === 'subscribe' && verifyToken === expected) {
      this.logger.log('Meta webhook verified successfully');
      return challenge;
    }
    this.logger.warn('Webhook verify failed — token mismatch');
    throw new ForbiddenException('Invalid verify token');
  }

  // Meta postea acá cada vez que llega un mensaje al número
  @Post()
  @HttpCode(200)
  handleEvent(@Body() body: any): { status: string } {
    try {
      for (const entry of body?.entry ?? []) {
        for (const change of entry?.changes ?? []) {
          if (change.field !== 'messages') continue;

          const value = change.value;
          const phoneNumberId: string = value?.metadata?.phone_number_id ?? '';
          const contactName: string = value?.contacts?.[0]?.profile?.name ?? '';

          for (const msg of value?.messages ?? []) {
            const inbound: InboundMsg = {
              from: msg.from ?? '',
              contactName,
              body: msg.text?.body ?? `[${msg.type ?? 'media'}]`,
              type: msg.type ?? 'unknown',
              timestamp: new Date(
                (parseInt(msg.timestamp, 10) || Math.floor(Date.now() / 1000)) * 1000,
              ).toISOString(),
              messageId: msg.id ?? `msg_${Date.now()}`,
              phoneNumberId,
            };
            this.logger.log(`Inbound message from +${inbound.from}: "${inbound.body}"`);
            this.stream$.next(inbound);
          }
        }
      }
    } catch (err) {
      // Nunca lanzamos error — Meta reintenta si no recibe 200
      this.logger.error('Error parsing webhook payload', err);
    }
    return { status: 'ok' };
  }

  // El frontend se suscribe acá via Server-Sent Events para recibir mensajes en tiempo real
  @Sse('stream')
  sseStream(): Observable<MessageEvent> {
    return this.stream$.asObservable().pipe(
      map((msg) => ({ data: msg }) as MessageEvent),
    );
  }
}
