import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Expone configuración pública del frontend que debe ser dinámica.
 * Variables VITE_* se sustituyen en tiempo de build en Vite,
 * pero algunas configuraciones (como WABA_ID) necesitan ser dinámicas
 * para cambiarlas sin rebuildar en Railway.
 */
@Controller('api/config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get('public')
  getPublicConfig() {
    return {
      // Meta WhatsApp Business Account ID
      // No es secreto, se puede exponer al frontend
      metaWabaId: this.configService.get('META_BUSINESS_ACCOUNT_ID'),
      metaPhoneNumberId: this.configService.get('META_PHONE_NUMBER_ID'),
      metaAppId: this.configService.get('META_APP_ID'),
      metaGraphVersion: this.configService.get('META_GRAPH_VERSION', 'v25.0'),

      // Frontend config
      appName: this.configService.get('VITE_APP_NAME', 'CRM La Internacional'),
      pollChatMs: this.configService.get('VITE_POLL_CHAT_MS', '5000'),
      pollInboxMs: this.configService.get('VITE_POLL_INBOX_MS', '15000'),
      pollNotificationsMs: this.configService.get('VITE_POLL_NOTIFICATIONS_MS', '30000'),
      useMocks: this.configService.get('VITE_USE_MOCKS', 'false') === 'true',
    };
  }
}
