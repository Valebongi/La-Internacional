import { metaFetch } from "@/lib/meta-fetch";
import type { MetaTemplate, TemplateComponent } from './templates.service';

const PHONE_NUMBER_ID = import.meta.env.VITE_META_PHONE_NUMBER_ID;

export interface SendTemplateInput {
  to: string;
  template: MetaTemplate;
  variables?: string[];
  /** Media ID obtenido de /api/resend-media. Preferido sobre headerImageLink. */
  headerMediaId?: string;
  /** Fallback: URL pública del header image. Meta debe poder refetchearla. */
  headerImageLink?: string;
}

export interface SendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
  raw?: unknown;
}

/**
 * Construye el payload de template message respetando el shape de Meta:
 * - components.body.parameters si hay variables en BODY.
 * - components.header con imagen si aplica.
 */
function buildTemplatePayload({ to, template, variables = [], headerMediaId, headerImageLink }: SendTemplateInput) {
  const components: Array<Record<string, unknown>> = [];

  const header = template.components?.find((c) => c.type === 'HEADER');
  const body = template.components?.find((c) => c.type === 'BODY');

  if (header?.format === 'IMAGE') {
    // Preferimos mediaId (id de /media) porque Meta garantiza delivery.
    // Caemos a link solo si no hay id — pero URLs de scontent.whatsapp.net
    // pueden dropearse silencioso; el caller debería usar resend-media antes.
    let imageParam: Record<string, string> | null = null;
    if (headerMediaId) {
      imageParam = { id: headerMediaId };
    } else {
      const link = headerImageLink ?? header.example?.header_handle?.[0];
      if (link) imageParam = { link };
    }
    if (imageParam) {
      components.push({
        type: 'header',
        parameters: [{ type: 'image', image: imageParam }],
      });
    }
  } else if (header?.format === 'TEXT') {
    const headerVars = header.example?.header_text ?? [];
    if (headerVars.length > 0) {
      components.push({
        type: 'header',
        parameters: headerVars.map((v) => ({ type: 'text', text: v })),
      });
    }
  }

  const bodyVarCount = extractVarCount(body?.text ?? '');
  if (bodyVarCount > 0) {
    const vars: string[] = [];
    for (let i = 0; i < bodyVarCount; i++) {
      vars.push(variables[i] ?? body?.example?.body_text?.[0]?.[i] ?? '—');
    }
    components.push({
      type: 'body',
      parameters: vars.map((v) => ({ type: 'text', text: v })),
    });
  }

  return {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: template.name,
      language: { code: template.language },
      ...(components.length > 0 ? { components } : {}),
    },
  };
}

function extractVarCount(text: string): number {
  const matches = text.match(/\{\{(\d+)\}\}/g) ?? [];
  const nums = matches.map((m) => parseInt(m.slice(2, -2), 10));
  return nums.length ? Math.max(...nums) : 0;
}

export interface ResendMediaResult {
  ok: boolean;
  mediaId?: string;
  error?: string;
}

export const messagesService = {
  /**
   * Sube la imagen del header (fetcheando la URL server-side) al endpoint /media
   * del phone number, y devuelve el media_id para usar en sends del batch.
   * Media IDs viven ~30 días — perfecto para una difusión entera.
   */
  async resendHeaderMedia(url: string): Promise<ResendMediaResult> {
    try {
      const res = await metaFetch('/api/resend-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.mediaId) {
        return { ok: false, error: body?.error ?? `HTTP ${res.status}` };
      }
      return { ok: true, mediaId: body.mediaId };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  },

  async sendTemplate(input: SendTemplateInput): Promise<SendResult> {
    if (!PHONE_NUMBER_ID) {
      return { ok: false, error: 'VITE_META_PHONE_NUMBER_ID no configurado' };
    }
    const payload = buildTemplatePayload(input);
    try {
      const res = await metaFetch(`/api/meta/${PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          body?.error?.error_user_msg ??
          body?.error?.message ??
          `HTTP ${res.status}`;
        return { ok: false, error: msg, raw: body };
      }
      const messageId: string | undefined = body?.messages?.[0]?.id;
      return { ok: true, messageId, raw: body };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  },
};

/** Re-export helpers usados por la UI. */
export function countBodyVars(template: MetaTemplate): number {
  const body = template.components?.find((c: TemplateComponent) => c.type === 'BODY');
  return extractVarCount(body?.text ?? '');
}
