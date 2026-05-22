# 06 — WhatsApp multi-número

## Arquitectura en Meta

```
Tu cuenta Meta Business
  └── Una sola App Meta (mantener la actual)
        └── Una sola WABA (WhatsApp Business Account)
              ├── Phone Number ID: aaa111  → "+5493511111111"  (Ventas 1)
              ├── Phone Number ID: bbb222  → "+5493512222222"  (Ventas 2)
              ├── Phone Number ID: ccc333  → "+5493513333333"  (Ventas 3)
              ├── Phone Number ID: ddd444  → "+5493514444444"  (Ventas 4)
              └── Phone Number ID: eee555  → "+5493515555555"  (Ventas 5)

Un solo webhook URL para todos los números.
Un solo Access Token (System User) para todos los números.
Las plantillas son compartidas a nivel WABA.
```

---

## Cambios necesarios en el código

### 1. Eliminar `META_PHONE_NUMBER_ID` del env

Esta variable actualmente limita el sistema a un número. Hay que eliminarla del env y leer siempre de la tabla `channels` en BD.

```typescript
// ANTES — hardcodeado en env:
const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

// DESPUÉS — dinámico desde BD:
const channel = await this.prisma.channel.findFirst({
  where: { identifier: phoneNumberId, active: true }
});
```

### 2. Variables de entorno que quedan para Meta

```env
# Estas sí se mantienen:
META_APP_ID=
META_APP_SECRET=          # Para validar HMAC de webhooks
META_ACCESS_TOKEN=        # System User token — cubre todos los números
META_VERIFY_TOKEN=        # Para verificar el webhook endpoint
META_GRAPH_VERSION=v25.0
META_WHATSAPP_BUSINESS_ACCOUNT_ID=  # Para templates (nivel WABA)

# Esta desaparece:
# META_PHONE_NUMBER_ID=  ← ELIMINAR
```

### 3. MetaClient — servicio compartido en libs/common

```typescript
// libs/common/src/meta/meta.client.ts

@Injectable()
export class MetaClient {
  private readonly baseUrl: string;
  private readonly accessToken: string;

  constructor(private config: ConfigService) {
    const version = config.get('META_GRAPH_VERSION', 'v25.0');
    this.baseUrl = `https://graph.facebook.com/${version}`;
    this.accessToken = config.get('META_ACCESS_TOKEN');
  }

  // Enviar texto libre (solo dentro de ventana de 24hs)
  async sendText(params: { phoneNumberId: string; to: string; body: string }) {
    return this.post(`/${params.phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      to: params.to,
      type: 'text',
      text: { body: params.body },
    });
  }

  // Enviar template (para outbound fuera de la ventana)
  async sendTemplate(params: {
    phoneNumberId: string;
    to: string;
    templateName: string;
    language: string;
    components?: any[];
  }) {
    return this.post(`/${params.phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      to: params.to,
      type: 'template',
      template: {
        name: params.templateName,
        language: { code: params.language },
        components: params.components ?? [],
      },
    });
  }

  // Marcar mensajes como leídos
  async markRead(phoneNumberId: string, messageId: string) {
    return this.post(`/${phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    });
  }

  // Obtener info del número
  async getPhoneNumberInfo(phoneNumberId: string) {
    return this.get(`/${phoneNumberId}?fields=display_phone_number,verified_name,quality_rating,account_mode`);
  }

  private async post(path: string, body: any) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Meta API error: ${JSON.stringify(err)}`);
    }
    return res.json();
  }

  private async get(path: string) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
    });
    return res.json();
  }
}
```

### 4. Webhook — identificar canal por phoneNumberId

```typescript
// gateway/src/webhook/meta-webhook.controller.ts
// CAMBIO: agregar phoneNumberId al evento encolado

for (const msg of value?.messages ?? []) {
  const inbound: InboundMsg = {
    from: msg.from,
    phoneNumberId,      // ← Ya está. Worker lo usa para buscar el Channel en BD
    body: msg.text?.body ?? `[${msg.type}]`,
    type: msg.type,
    timestamp: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
    messageId: msg.id,
    contactName,
  };
  // Encolar en Redis → messaging:inbound
  await this.queue.add('inbound', inbound);
}
```

### 5. Broadcasts — especificar canal emisor

```typescript
// Al crear un broadcast, se elige desde qué canal sale:
// POST /api/broadcasts
{
  "name": "Promo Invierno 2024",
  "channelId": "uuid-del-canal",    // ← nuevo campo obligatorio
  "templateName": "promo_invierno",
  "templateLang": "es",
  "clientIds": ["uuid1", "uuid2", "..."]
}
```

---

## Asignación de asesoras a canales

Cada asesora tiene uno o más canales asignados. Cuando el sistema necesita enviar un mensaje de una asesora, usa el canal asignado a ella.

```typescript
// Tabla channel_advisors (ya en el schema):
// channelId + advisorId + isPrimary

// Para obtener el canal de una asesora:
async getChannelForAdvisor(advisorId: string): Promise<Channel> {
  const assignment = await this.prisma.channelAdvisor.findFirst({
    where: { advisorId, isPrimary: true },
    include: { channel: true },
  });
  return assignment?.channel ?? await this.getDefaultChannel();
}
```

**Lógica de asignación:**
- Cada asesora tiene un canal primario (`isPrimary: true`)
- Si no tiene primario, usa el canal por defecto del sistema
- Una asesora puede operar en múltiples canales (ej: Sofía puede atender desde Ventas 1 y Ventas 2)

---

## Límites y rate limiting por número

### Tiers de Meta por número
```
Tier 1 (inicial): 1.000 conversaciones únicas / 24hs / número
Tier 2 (automático): 10.000 conv / 24hs (se sube con uso y calidad)
Tier 3: 100.000 conv / 24hs
```

Con 250 clientes por número, Tier 1 es más que suficiente.

### Rate limiting de envío de mensajes
```
Meta permite: ~80 mensajes/segundo por número en Tier 1
Para broadcasts: usar delay entre mensajes

// BullMQ config para broadcasts:
{
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
  limiter: { max: 60, duration: 1000 }  // 60 mensajes/segundo máximo (margen de seguridad)
}
```

### Ventana de 24 horas
```
Regla Meta: Si el cliente escribió en las últimas 24hs → podés responder con texto libre
            Si no → SOLO podés enviar mensajes de template (pre-aprobados)

El sistema debe trackear lastMessageAt (inbound) por conversación para saber qué tipo de mensaje se puede enviar.
```

---

## Plantillas — todo lo que hay que saber

### Las plantillas son de la WABA, no del número
Una sola plantilla aprobada sirve para los 4-5 números. No hay que duplicar ni hacer nada especial.

### Categorías de plantillas y costos (Argentina, ref. 2024)
```
MARKETING:    ~$0.0620 USD / conversación iniciada
UTILITY:      ~$0.0140 USD / conversación iniciada
AUTHENTICATION: ~$0.0400 USD
SERVICE:      Gratis (respuestas a mensajes del cliente dentro de 24hs)
```

### Tipos de plantillas que necesitamos crear
```
1. Saludo inicial / primer contacto           → MARKETING
2. Seguimiento de oportunidad                 → MARKETING
3. Confirmación de pedido                     → UTILITY
4. Recordatorio de pago                       → UTILITY
5. Postventa - encuesta de satisfacción       → UTILITY
6. Postventa - seguimiento 30 días            → MARKETING
7. Reactivación de cliente inactivo           → MARKETING
8. Promo / difusión general                   → MARKETING
```

---

## Pasos en Meta Business Console para producción

### Paso 1 — Verificar el negocio
```
Meta Business Suite → Configuración → Centro de seguridad → Verificación del negocio
Documentos: 
  - Constancia de AFIP / CUIT
  - Documentación comercial
Tiempo: 1-5 días hábiles
```

### Paso 2 — Crear System User
```
Meta Business Suite → Configuración → Usuarios del sistema
1. Crear usuario: "La Internacional CRM Bot"
2. Rol: Administrador
3. Asignar activos: la WABA y todos los números
4. Permisos: whatsapp_business_management, whatsapp_business_messaging
5. Generar token de acceso: nunca expira (token de sistema)
6. Guardar el token → va a META_ACCESS_TOKEN en Railway
```

### Paso 3 — Agregar números reales
```
Por cada número nuevo:
1. Meta Business Suite → WhatsApp → Números de teléfono → Agregar número
2. El número NO puede estar en WhatsApp personal o Business app
   (si está, hay que eliminarlo del celular primero → perdes el historial)
3. Verificar por SMS o llamada
4. El número recibe su Phone Number ID
5. Agregar ese Phone Number ID a la tabla channels en BD
```

### Paso 4 — Registrar el webhook
```
1. Asegurarse de que el Gateway esté deployado y respondiendo en /webhooks/meta
2. Meta Business Suite → WhatsApp → Configuración → Webhooks
3. URL: https://tu-dominio.up.railway.app/webhooks/meta
4. Verify Token: el valor de META_VERIFY_TOKEN
5. Suscribirse a: messages, message_status_updates, messaging_postbacks
6. El mismo webhook recibe eventos de todos los números de la WABA
```

### Paso 5 — Poner App en modo Live
```
Meta Developers → Tu App → App Mode: Live
(En modo Development solo puedes mandar a números verificados manualmente)
```

---

## Consideraciones importantes

### Número no puede estar activo en WhatsApp
El número de teléfono que agregás a la Cloud API **no puede tener una sesión de WhatsApp activa**. Si lo tiene, hay que:
1. Abrir WhatsApp en el celular
2. Ir a Configuración → Cuenta → Eliminar cuenta
3. Confirmar eliminación (pierden el historial del celular, no hay vuelta)
4. Recién entonces se puede agregar a Meta Business

### Opt-out
Meta exige que tengas un mecanismo de opt-out. El sistema debe:
- Detectar si un cliente responde "STOP", "No quiero recibir mensajes", etc.
- Marcar al cliente como `opted_out: true`
- No volver a enviarle difusiones

### Quality Rating
Cada número tiene un quality rating en Meta. Si mandás muchas difusiones y la gente las reporta como spam, el rating baja y podés perder el número. Cuidar:
- Solo mandar a gente que realmente quiere recibir el mensaje
- Personalizar los mensajes con el nombre del cliente
- No mandar más de 1-2 mensajes por semana por cliente
