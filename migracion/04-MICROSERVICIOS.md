# 04 — Implementación de microservicios

## Resumen del estado objetivo por servicio

| Servicio | Puerto | Estado actual | Estado objetivo |
|---------|--------|--------------|----------------|
| Gateway | 8080 | 60% | 90% (agregar proxy + auth validation) |
| Auth | 3001 | 0% skeleton | 100% |
| CRM Core | 3002 | 0% skeleton | 100% |
| Messaging | 3003 | 0% skeleton | 100% |
| Broadcasts | 3004 | 25% | 100% |
| Postsale | 3005 | 0% skeleton | 100% |
| Analytics | 3006 | 0% skeleton | 80% |
| Integration | 3007 | 0% skeleton | 60% |

---

## 1. Gateway (Puerto 8080)

### Qué hace
Único punto de entrada público. Valida JWT, hace proxy a los servicios internos, recibe webhooks de Meta, emite SSE.

### Lo que hay que agregar

**Proxy hacia servicios internos:**
```typescript
// gateway/src/proxy/proxy.module.ts
// Para cada ruta /api/auth/*, /api/crm/*, etc.
// usa HttpService para forwardear la request al servicio correspondiente
// inyectando los headers de contexto (x-user-id, x-user-role, x-advisor-id)
```

**Validación JWT en cada request:**
```typescript
// gateway/src/guards/jwt.guard.ts
@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    const payload = this.jwtService.verify(token);
    // Inyecta contexto en headers para los servicios downstream
    request.headers['x-user-id'] = payload.sub;
    request.headers['x-user-role'] = payload.role;
    request.headers['x-advisor-id'] = payload.advisorId ?? '';
    return true;
  }
}
```

**Rutas del proxy:**
```
/api/auth/*       → http://localhost:3001/*
/api/crm/*        → http://localhost:3002/*
/api/messaging/*  → http://localhost:3003/*
/api/broadcasts/* → http://localhost:3004/*
/api/postsale/*   → http://localhost:3005/*
/api/analytics/*  → http://localhost:3006/*
/api/integration/* → http://localhost:3007/*
/webhooks/meta/*  → handler local (no proxy)
/api/config/*     → handler local (no proxy)
```

**Excepciones al JWT (rutas públicas):**
```
POST /api/auth/login
POST /api/auth/refresh
GET  /webhooks/meta (verificación Meta)
POST /webhooks/meta (webhook Meta — validado por HMAC, no JWT)
GET  /api/config/public
GET  /health
```

---

## 2. Auth Service (Puerto 3001)

### Qué hace
Gestiona usuarios, autenticación JWT, refresh tokens, y cambio de contraseñas.

### Endpoints a implementar

```
POST   /auth/login              → { accessToken, refreshToken, user }
POST   /auth/refresh            → { accessToken, refreshToken }
POST   /auth/logout             → revoca session
GET    /auth/me                 → { user }
PUT    /auth/me/password        → cambiar contraseña propia

// Solo admin/super_admin:
GET    /users                   → lista de usuarios
POST   /users                   → crear usuario
GET    /users/:id               → detalle
PUT    /users/:id               → editar (nombre, rol, activo)
DELETE /users/:id               → desactivar (soft delete)
POST   /users/:id/reset-password → generar contraseña temporal
```

### Implementación clave

```typescript
// auth/src/auth/auth.service.ts

async login(email: string, password: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) throw new UnauthorizedException();
  
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new UnauthorizedException();

  const accessToken = this.jwt.sign(
    { sub: user.id, role: user.role, advisorId: user.advisor?.id },
    { expiresIn: '15m' }  // corto — se renueva con refresh
  );
  
  const refreshToken = crypto.randomUUID();
  await this.prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: addDays(new Date(), 30),
    },
  });

  return { accessToken, refreshToken, user: this.toPublicUser(user) };
}

async refresh(refreshToken: string) {
  // Busca sessions activas, verifica hash, genera nuevo par de tokens
  // Invalida el token usado (rotación de tokens)
}
```

### Consideraciones de seguridad
- Access token: 15 minutos (corto para reducir ventana de compromiso)
- Refresh token: 30 días, rotación en cada uso
- Refresh token solo en cookie httpOnly, no en localStorage
- Máximo 5 sesiones activas por usuario (la 6ta invalida la más vieja)
- Bloqueo temporal después de 5 intentos fallidos de login

---

## 3. CRM Core (Puerto 3002)

### Qué hace
CRUD completo de clientes, asesoras, oportunidades. Es la fuente de verdad del negocio.

### Endpoints a implementar

```
// CLIENTES
GET    /clients                 → lista con filtros (advisorId, type, state, search)
POST   /clients                 → crear cliente
POST   /clients/import          → importar CSV/Excel (hasta 500 registros)
GET    /clients/:id             → detalle + historial básico
PUT    /clients/:id             → editar
DELETE /clients/:id             → soft delete (state: inactive)
POST   /clients/:id/reassign    → reasignar asesora (solo admin)
GET    /clients/validate-phones → validar lista antes de importar

// ASESORAS
GET    /advisors                → lista (solo admin)
GET    /advisors/:id/stats      → métricas de una asesora

// OPORTUNIDADES
GET    /opportunities           → lista con filtros
POST   /opportunities           → crear
PUT    /opportunities/:id       → actualizar status/notas
```

### Lógica de scoping por rol

```typescript
// crm-core/src/clients/clients.service.ts

async findAll(filters: ClientFilters, userContext: UserContext) {
  const where: Prisma.ClientWhereInput = {};

  // Advisors solo ven sus clientes
  if (userContext.role === 'advisor') {
    where.advisorId = userContext.advisorId;
  }

  // Admin puede filtrar por cualquier asesora
  if (filters.advisorId && userContext.role !== 'advisor') {
    where.advisorId = filters.advisorId;
  }

  if (filters.type) where.type = filters.type;
  if (filters.state) where.state = filters.state;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return this.prisma.client.findMany({
    where,
    orderBy: { lastContactAt: 'desc' },
    take: filters.limit ?? 50,
    skip: filters.offset ?? 0,
    include: { advisor: { select: { name: true, color: true } } },
  });
}
```

### Importación de clientes (CSV)
```typescript
// Validaciones antes de importar:
// 1. Normalizar teléfonos a E.164
// 2. Detectar duplicados en el archivo
// 3. Detectar duplicados contra BD (por phoneNormalized)
// 4. Retornar reporte: { valid: [], duplicates: [], invalid: [] }
// 5. Solo crear los válidos en transacción
```

---

## 4. Messaging Service (Puerto 3003)

### Qué hace
Gestiona conversaciones, mensajes, historial. Consume los webhooks de Meta desde Redis y los persiste. Envía mensajes individuales.

### Endpoints a implementar

```
// CONVERSACIONES
GET    /conversations           → lista (con filtros: state, advisorId, channelId)
GET    /conversations/:id       → detalle + mensajes paginados
PUT    /conversations/:id       → actualizar state, assignar asesora
POST   /conversations/:id/assign → asignar a asesora

// MENSAJES
GET    /conversations/:id/messages → historial paginado
POST   /conversations/:id/messages → enviar mensaje de texto libre
POST   /conversations/:id/templates → enviar template

// CANALES
GET    /channels                → lista de canales activos
POST   /channels                → crear canal (solo admin)
PUT    /channels/:id            → editar canal
```

### Worker — consumir cola de Meta

```typescript
// messaging/src/workers/meta-inbound.worker.ts

@Processor('messaging:inbound')
export class MetaInboundWorker {

  @Process()
  async handleInbound(job: Job<InboundMsg>) {
    const { from, phoneNumberId, body, type, messageId, timestamp } = job.data;

    // 1. Idempotencia
    const exists = await this.prisma.webhookEvent.findUnique({
      where: { externalEventId: messageId }
    });
    if (exists) return; // ya procesado

    await this.prisma.webhookEvent.create({
      data: { source: 'meta', externalEventId: messageId, eventType: 'message', payload: job.data }
    });

    // 2. Resolver canal
    const channel = await this.prisma.channel.findUnique({
      where: { identifier: phoneNumberId }
    });
    if (!channel) throw new Error(`Canal no encontrado: ${phoneNumberId}`);

    // 3. Resolver cliente (o crear)
    const phoneNormalized = normalizePhone(from);
    let client = await this.prisma.client.findUnique({
      where: { phoneNormalized }
    });
    if (!client) {
      // Cliente nuevo — crear sin asesora asignada
      client = await this.prisma.client.create({
        data: { name: from, phone: from, phoneNormalized }
      });
    }

    // 4. Resolver conversación (o crear)
    let conversation = await this.prisma.conversation.findUnique({
      where: { clientId_channelId: { clientId: client.id, channelId: channel.id } }
    });
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { clientId: client.id, channelId: channel.id, state: 'open' }
      });
    }

    // 5. Persistir mensaje
    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        externalId: messageId,
        direction: 'inbound',
        type: type as any,
        body,
        createdAt: new Date(timestamp),
      }
    });

    // 6. Actualizar last message en conversación
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(timestamp),
        lastMessageBody: body?.slice(0, 100),
        unreadCount: { increment: 1 },
        state: 'open',
      }
    });

    // 7. Emitir evento SSE al frontend (via Redis pub/sub → Gateway)
    await this.redis.publish('sse:inbox', JSON.stringify({
      type: 'new_message',
      conversationId: conversation.id,
      advisorId: conversation.advisorId,
      preview: body?.slice(0, 80),
    }));
  }
}
```

### Envío de mensaje individual

```typescript
// messaging/src/messages/messages.service.ts

async sendText(conversationId: string, body: string, userContext: UserContext) {
  const conv = await this.getConversation(conversationId, userContext);
  const channel = await this.prisma.channel.findUnique({ where: { id: conv.channelId } });

  // Llama a Meta Graph API
  const result = await this.metaClient.sendText({
    phoneNumberId: channel.identifier,
    to: conv.client.phoneNormalized,
    body,
  });

  // Persiste mensaje outbound
  await this.prisma.message.create({
    data: {
      conversationId,
      externalId: result.messages[0].id,
      direction: 'outbound',
      type: 'text',
      body,
      status: 'sent',
      sentAt: new Date(),
    }
  });
}
```

---

## 5. Broadcasts Service (Puerto 3004)

### Qué hace
Crea y ejecuta difusiones masivas via templates de Meta. Trackea delivery, read, y respuestas.

### Endpoints a implementar

```
// TEMPLATES (ya existen parcialmente)
GET    /templates               → lista desde Meta API
POST   /templates               → crear en Meta API
DELETE /templates               → eliminar en Meta API

// DIFUSIONES
GET    /broadcasts              → lista (con filtros)
GET    /broadcasts/:id          → detalle + métricas
POST   /broadcasts              → crear (draft o programar)
POST   /broadcasts/:id/send     → disparar envío inmediato
POST   /broadcasts/:id/cancel   → cancelar si está en progreso
GET    /broadcasts/:id/recipients → lista de destinatarios con status
```

### Worker — envío masivo

```typescript
// broadcasts/src/workers/send.worker.ts
// Procesa cola: broadcasts:send
// Respeta rate limit de Meta: ~80 mensajes/segundo por número (tier 1)
// Usa BullMQ con concurrencia = 1 por canal (para no sobrepasar límite)

@Process({ concurrency: 1 })
async handleSend(job: Job<{ broadcastId: string; recipientId: string }>) {
  const recipient = await this.prisma.broadcastRecipient.findUnique({
    where: { id: job.data.recipientId },
    include: { broadcast: { include: { channel: true } } },
  });

  try {
    const result = await this.metaClient.sendTemplate({
      phoneNumberId: recipient.broadcast.channel.identifier,
      to: recipient.phoneNormalized,
      templateName: recipient.broadcast.templateName,
      language: recipient.broadcast.templateLang,
      variables: recipient.broadcast.variables as any,
    });

    await this.prisma.broadcastRecipient.update({
      where: { id: recipient.id },
      data: {
        status: 'sent',
        externalMessageId: result.messages[0].id,
        sentAt: new Date(),
      }
    });

    // Actualizar contador del broadcast
    await this.prisma.broadcast.update({
      where: { id: recipient.broadcastId },
      data: { sentCount: { increment: 1 } },
    });
  } catch (err) {
    await this.prisma.broadcastRecipient.update({
      where: { id: recipient.id },
      data: { status: 'failed', failedReason: err.message },
    });
  }
}
```

---

## 6. Postsale Service (Puerto 3005)

### Qué hace
Define y ejecuta secuencias automatizadas de seguimiento postventa. Usa su propia BD (`lid_postsale`).

### Endpoints a implementar

```
// SECUENCIAS (admin)
GET    /sequences               → lista de secuencias configuradas
POST   /sequences               → crear secuencia
PUT    /sequences/:id           → editar
PUT    /sequences/:id/toggle    → activar/desactivar
DELETE /sequences/:id           → eliminar

// STEPS de secuencia
GET    /sequences/:id/steps     → pasos de la secuencia
POST   /sequences/:id/steps     → agregar paso
PUT    /sequences/:id/steps/:order → editar paso
DELETE /sequences/:id/steps/:order → eliminar paso

// EJECUCIONES
GET    /executions              → lista (con filtros)
POST   /executions              → disparar manualmente para un cliente
PUT    /executions/:id/pause    → pausar
PUT    /executions/:id/resume   → reanudar
PUT    /executions/:id/cancel   → cancelar
```

### Integración con Messaging para cortar secuencias

Cuando un cliente responde, Messaging emite un evento a Redis. Postsale lo escucha y pausa la ejecución si está configurado para hacerlo:

```typescript
// postsale/src/workers/pause-on-reply.worker.ts
// Escucha Redis canal: 'postsale:client_replied'
// Si hay ejecución activa para ese clientId → la pausa
```

---

## 7. Analytics Service (Puerto 3006)

### Qué hace
Expone métricas del negocio: conversiones, tiempos de respuesta, difusiones, actividad por asesora.

### Endpoints a implementar

```
GET    /analytics/overview          → KPIs globales (admin)
GET    /analytics/advisors          → métricas por asesora (admin)
GET    /analytics/advisors/:id      → métricas de una asesora
GET    /analytics/channels          → métricas por canal WhatsApp
GET    /analytics/broadcasts        → eficacia de difusiones
GET    /analytics/opportunities     → funnel de conversión

// Parámetros estándar: ?from=2024-01-01&to=2024-01-31&advisorId=x
```

### Consultas clave

```typescript
// analytics/src/analytics.service.ts

// Mensajes por asesora en el período
async messagesByAdvisor(from: Date, to: Date) {
  return this.prisma.$queryRaw`
    SELECT 
      a.name as advisor_name,
      COUNT(m.id) FILTER (WHERE m.direction = 'outbound') as sent,
      COUNT(m.id) FILTER (WHERE m.direction = 'inbound') as received,
      AVG(EXTRACT(EPOCH FROM (m.created_at - prev_m.created_at))/60) as avg_response_minutes
    FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    JOIN advisors a ON a.id = c.advisor_id
    WHERE m.created_at BETWEEN ${from} AND ${to}
    GROUP BY a.id, a.name
    ORDER BY sent DESC
  `;
}

// Tasa de conversión del período
async conversionFunnel(from: Date, to: Date) {
  return {
    total: await this.prisma.opportunity.count({ where: { createdAt: { gte: from, lte: to } } }),
    contacted: await this.prisma.opportunity.count({ where: { status: { in: ['contacted', 'interested', 'negotiating', 'won'] }, createdAt: { gte: from, lte: to } } }),
    won: await this.prisma.opportunity.count({ where: { status: 'won', wonAt: { gte: from, lte: to } } }),
    lost: await this.prisma.opportunity.count({ where: { status: 'lost', lostAt: { gte: from, lte: to } } }),
  };
}
```

---

## 8. Integration Service (Puerto 3007)

### Qué hace
Conecta con el sistema legacy de La Internacional. Sincroniza compras confirmadas, precios, y datos de clientes.

### Endpoints a implementar

```
GET    /integration/status          → estado de conexión con sistema legacy
POST   /integration/sync/clients    → sincronizar clientes desde legacy
POST   /integration/sync/prices     → sincronizar precios
GET    /integration/prices          → precios actuales (cache)

// Webhook entrante del sistema legacy:
POST   /integration/webhooks/purchase → compra confirmada → dispara postsale
```

### Modo mock

Mientras el sistema legacy no tiene la integración lista, el servicio responde con datos simulados. Se controla con `EXTERNAL_SYSTEM_MOCK=true` en el env (ya está implementado el toggle).

---

## Patrón común a todos los servicios

### Estructura de carpetas por servicio
```
services/{nombre}/
├── src/
│   ├── {nombre}.module.ts       # Módulo raíz
│   ├── main.ts                  # Bootstrap
│   ├── {feature}/               # Por cada feature
│   │   ├── {feature}.module.ts
│   │   ├── {feature}.controller.ts
│   │   ├── {feature}.service.ts
│   │   ├── dto/
│   │   │   ├── create-{feature}.dto.ts
│   │   │   └── update-{feature}.dto.ts
│   │   └── {feature}.repository.ts  # Opcional, para queries complejas
│   ├── workers/                 # BullMQ processors
│   ├── guards/                  # Guards locales
│   └── prisma/                  # PrismaService
├── prisma/                      # Schema y migrations
└── test/
```

### Context headers (del Gateway)
Todos los servicios leen el contexto de usuario de los headers:
```typescript
// libs/common/src/decorators/user-context.decorator.ts
export const UserContext = createParamDecorator(
  (_, ctx: ExecutionContext): UserCtx => {
    const req = ctx.switchToHttp().getRequest();
    return {
      userId:    req.headers['x-user-id'],
      role:      req.headers['x-user-role'],
      advisorId: req.headers['x-advisor-id'] || null,
    };
  },
);
```

### Respuesta de errores estandarizada
```typescript
// Todos los servicios usan el mismo formato de error:
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Cliente no encontrado"
}
```
