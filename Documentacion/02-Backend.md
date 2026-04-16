# 02 — Backend

> Especificación de los servicios NestJS del CRM de La Internacional. Cada servicio es un proyecto independiente del monorepo y se despliega como un proceso Railway separado.

Para la vista de sistema completa (cómo encaja todo), ver [01-Arquitectura.md](01-Arquitectura.md). Para el esquema de datos, ver [04-Base-de-Datos.md](04-Base-de-Datos.md).

---

## 1. Stack y convenciones

| Tema | Decisión |
|---|---|
| Lenguaje | TypeScript (strict) |
| Framework | NestJS 10+ |
| ORM | Prisma 5+ (un schema por servicio) |
| Validación | class-validator + class-transformer en DTOs |
| Logging | Pino (`nestjs-pino`) en JSON estructurado |
| Testing | Jest unit + Supertest e2e con BD real (no mocks; lección aprendida de proyectos previos) |
| Pub/sub | Redis Pub/Sub para eventos volátiles, BullMQ para colas persistentes |
| Estilo | ESLint + Prettier; convenciones del Marketplace de Da Vinci |

### Convenciones de respuesta API

Mismo patrón que el Marketplace, así el frontend reusa el cliente HTTP ya conocido:

- **List endpoints:** `{ data: [...], total, page, limit, totalPages }`
- **Single resource:** objeto Prisma directo (sin wrapper)
- **Errores:** `{ statusCode, message, error }` (formato NestJS por defecto)
- **Códigos:** 200/201/204 éxito; 400 validación; 401 sin auth; 403 sin permiso; 404 no existe; 409 conflicto; 500 error interno

### Headers que el gateway inyecta a los servicios downstream

Todos los servicios confían en estos headers (no validan JWT por su cuenta):

```
x-user-id: <uuid>
x-user-email: <string>
x-user-role: admin | advisor
x-advisor-id: <uuid>      // solo si role=advisor
x-request-id: <uuid>      // para trazabilidad
```

---

## 2. Estructura del monorepo

```
backend/
├── package.json                    # workspaces
├── tsconfig.base.json
├── docker-compose.yml              # solo dev local: postgres + redis
├── .env.example
├── packages/
│   ├── shared-types/               # DTOs y tipos compartidos
│   ├── shared-utils/               # helpers (phone normalization, etc.)
│   └── shared-events/              # contratos de eventos pub/sub
└── services/
    ├── gateway/
    ├── auth-service/
    ├── crm-core-service/
    ├── messaging-service/
    ├── broadcasts-service/
    ├── postsale-service/
    ├── analytics-service/
    └── integration-service/
```

Cada servicio es un proyecto NestJS estándar:

```
services/<service-name>/
├── package.json
├── tsconfig.json
├── nest-cli.json
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── modules/<feature>/
│   │   ├── <feature>.controller.ts
│   │   ├── <feature>.service.ts
│   │   ├── <feature>.module.ts
│   │   └── dto/
│   ├── common/                     # guards, interceptors, filters
│   └── prisma/                     # PrismaService
└── test/
    └── <feature>.e2e-spec.ts
```

---

## 3. Servicios

### 3.1 `gateway` (puerto 8080, expuesto público)

**Responsabilidades:**
- Validar JWT (con `auth-service` o local con secret compartido)
- Inyectar headers de identidad
- Forwardear a servicios internos vía URL `http://<service>.railway.internal:<port>`
- Recibir webhooks de Meta (verificación HMAC + encolado)
- Rate limiting global
- CORS

**Endpoints clave:**

| Método | Ruta | Acción |
|---|---|---|
| `POST` | `/auth/login` | Forward → auth-service (sin JWT) |
| `POST` | `/auth/register` | Forward → auth-service (sin JWT) |
| `*` | `/api/v1/clients/**` | Forward → crm-core-service |
| `*` | `/api/v1/conversations/**` | Forward → messaging-service |
| `*` | `/api/v1/messages/**` | Forward → messaging-service |
| `*` | `/api/v1/broadcasts/**` | Forward → broadcasts-service |
| `*` | `/api/v1/postsale/**` | Forward → postsale-service (con circuit breaker) |
| `*` | `/api/v1/analytics/**` | Forward → analytics-service |
| `*` | `/api/v1/integration/**` | Forward → integration-service |
| `GET` | `/webhooks/meta` | Handshake Meta (verify_token) |
| `POST` | `/webhooks/meta` | Validar HMAC + encolar |
| `GET` | `/health` | Health check |

**Variables de entorno:**
```
PORT=8080
JWT_SECRET=...
META_VERIFY_TOKEN=...
META_APP_SECRET=...
REDIS_URL=...
AUTH_SERVICE_URL=http://auth-service.railway.internal:3001
CRM_CORE_SERVICE_URL=http://crm-core-service.railway.internal:3002
MESSAGING_SERVICE_URL=http://messaging-service.railway.internal:3003
BROADCASTS_SERVICE_URL=http://broadcasts-service.railway.internal:3004
POSTSALE_SERVICE_URL=http://postsale-service.railway.internal:3005
ANALYTICS_SERVICE_URL=http://analytics-service.railway.internal:3006
INTEGRATION_SERVICE_URL=http://integration-service.railway.internal:3007
ALLOWED_ORIGINS=https://crm.lainternacional.com.ar
RATE_LIMIT_PER_MINUTE=100
```

---

### 3.2 `auth-service` (puerto 3001, BD `lid_auth`)

**Responsabilidades:**
- Usuarios admin/asesoras
- Login (bcrypt + JWT)
- Roles
- Mapping asesora↔teléfono propio (crítico para postventa)

**Endpoints:**

| Método | Ruta | Acción | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Crear usuario (solo admin después) | sí (admin) |
| `POST` | `/auth/login` | Login → JWT | no |
| `POST` | `/auth/refresh` | Refresh token | sí |
| `GET` | `/users/me` | Perfil propio | sí |
| `GET` | `/users` | Listar usuarios (admin) | sí (admin) |
| `GET` | `/users/:id` | Ver usuario | sí (admin u owner) |
| `PATCH` | `/users/:id` | Editar (incluye `phone`) | sí (admin u owner) |
| `DELETE` | `/users/:id` | Soft delete | sí (admin) |
| `GET` | `/advisors` | Listar asesoras (para asignación) | sí |
| `GET` | `/advisors/:id/phone` | Devuelve phone de la asesora (consumido por postsale) | sí (interno) |

**DTOs principales:**
```ts
LoginDto         { email, password }
RegisterUserDto  { email, password, displayName, role, phone? }
UpdateUserDto    { displayName?, phone?, role? }
```

**Variables de entorno:**
```
PORT=3001
DATABASE_URL=postgresql://.../lid_auth
JWT_SECRET=...
JWT_EXPIRES_IN=8h
REFRESH_SECRET=...
REFRESH_EXPIRES_IN=30d
BCRYPT_COST=12
```

---

### 3.3 `crm-core-service` (puerto 3002, BD `lid_crm`)

**Responsabilidades:**
- Clientes (CRUD + anti-duplicación por `phone_normalized`)
- Tipos de cliente y mapping tipo→asesora
- Asignación automática y manual
- Segmentación y tags
- Importador masivo de números (con detección de duplicados visible)

**Endpoints:**

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/clients` | Listar (filtros: `?phone=...`, `?type=...`, `?advisorId=...`, `?tag=...`) |
| `POST` | `/clients` | Crear cliente (anti-dup automática: si phone ya existe → 409 con info del existente) |
| `GET` | `/clients/:id` | Ver cliente |
| `PATCH` | `/clients/:id` | Editar |
| `DELETE` | `/clients/:id` | Soft delete |
| `POST` | `/clients/import` | Importar CSV/array; devuelve `{ created, duplicates: [{phone, existingClientId, advisorId}] }` |
| `POST` | `/clients/:id/assign` | Asignar manualmente a asesora |
| `GET` | `/clients/:id/history` | Historial unificado (consume messaging) |
| `GET` | `/client-types` | Listar tipos |
| `POST` | `/client-types` | Crear tipo + mapping a asesora |
| `PATCH` | `/client-types/:id` | Editar tipo / cambiar asesora |
| `GET` | `/tags` | Listar tags |
| `POST` | `/tags` | Crear tag |
| `POST` | `/clients/:id/tags` | Etiquetar |
| `DELETE` | `/clients/:id/tags/:tagId` | Desetiquetar |

**Lógica clave:**

- **Anti-duplicación:** se normaliza el phone con `libphonenumber-js` a E.164 antes de persistir e indexar. La query `?phone=...` también normaliza el input.
- **Asignación automática:** al crear cliente, si tiene `typeId` y existe mapping `type→advisor`, se asigna automáticamente. Si no, queda `advisorId=null` para revisión del admin.
- **Scope por rol:** si `x-user-role=advisor`, los queries filtran por `x-advisor-id`. Si es `admin`, ve todo. (**Decisión pendiente**: ver pregunta abierta en [05-Requerimientos-Tecnicos.md](05-Requerimientos-Tecnicos.md))

**Eventos publicados:**
- `client.created` — payload: `{ clientId, phone, advisorId? }`
- `client.assigned` — payload: `{ clientId, advisorId, previousAdvisorId? }`
- `client.tagged` — payload: `{ clientId, tagId }`

**Variables de entorno:**
```
PORT=3002
DATABASE_URL=postgresql://.../lid_crm
REDIS_URL=...
DEFAULT_COUNTRY_CODE=AR
```

---

### 3.4 `messaging-service` (puerto 3003, BD `lid_messaging`)

**Responsabilidades:**
- Bandeja unificada de canales (5 WhatsApp + IG)
- Conversaciones y mensajes
- Estados de chat (lifecycle: Recibido → En validación → Presupuestando → Sin comprobante → Agendado, o lo que defina el cliente)
- Etiquetas de conversación
- Procesamiento de eventos Meta encolados por el gateway

**Endpoints:**

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/conversations` | Listar (filtros: `?channelId=...`, `?advisorId=...`, `?state=...`, `?clientId=...`) |
| `GET` | `/conversations/:id` | Ver conversación con últimos N mensajes |
| `PATCH` | `/conversations/:id/state` | Cambiar estado |
| `POST` | `/conversations/:id/messages` | Enviar mensaje (vía Cloud API si aplica) |
| `GET` | `/conversations/:id/messages` | Listar mensajes (paginado) |
| `POST` | `/conversations/:id/tags` | Etiquetar conversación |
| `GET` | `/channels` | Listar canales (5 WA + IG) |
| `POST` | `/channels` | Registrar canal nuevo |
| `POST` | `/internal/events/meta` | Endpoint interno: consumir eventos encolados (no expuesto por gateway) |

**Lógica clave:**

- **Anti-duplicación de cliente al recibir mensaje:** consulta `crm-core` por phone antes de crear conversación. Si no existe el cliente, lo crea allá (publica `client.created`) y luego crea la conversación apuntando al `clientId`.
- **Cambio de estado:** registra timestamp en `client_states_history` (consumido por `analytics-service` para calcular tiempo entre estados).
- **Envío de mensaje:** decide canal según `conversation.channelType`:
  - WhatsApp → llama Cloud API
  - Instagram → llama Graph API
  - Para envío "camuflado" 1:1 → publica evento `postsale.send.requested` (lo consume `postsale-service`)

**Eventos publicados:**
- `message.received` — `{ conversationId, messageId, clientId, channelId }`
- `message.sent` — `{ conversationId, messageId, fromUserId, channelId }`
- `client.state.changed` — `{ clientId, previousState, newState, conversationId }`

**Eventos consumidos:**
- `client.created` (de crm-core) → puede crear conversación huérfana si vino de import
- `client.assigned` → notifica al advisor en frontend (vía polling)

**Variables de entorno:**
```
PORT=3003
DATABASE_URL=postgresql://.../lid_messaging
REDIS_URL=...
CRM_CORE_SERVICE_URL=...
META_GRAPH_API_VERSION=v20.0
WHATSAPP_CLOUD_API_TOKEN=...      # token global de la BSP
INSTAGRAM_PAGE_ACCESS_TOKEN=...
```

---

### 3.5 `broadcasts-service` (puerto 3004, BD `lid_broadcasts`)

**Responsabilidades:**
- Listas dinámicas (filtro por segmento)
- Plantillas Meta-aprobadas (sync con Cloud API)
- Envíos masivos vía BullMQ (respetando rate limits de Meta)
- Opt-in / Opt-out por cliente
- Tracking de costo por envío

**Endpoints:**

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/templates` | Listar plantillas (sync con Meta) |
| `POST` | `/templates/sync` | Forzar resync con Meta |
| `GET` | `/segments/preview` | Preview de cuántos clientes matchean un filtro (`?type=...&tag=...`) |
| `POST` | `/broadcasts` | Crear difusión `{ name, templateId, segmentFilter, scheduledAt? }` |
| `GET` | `/broadcasts` | Listar |
| `GET` | `/broadcasts/:id` | Detalle (incluye recipients y outcomes) |
| `POST` | `/broadcasts/:id/send` | Disparar envío (encola en BullMQ) |
| `GET` | `/broadcasts/:id/stats` | Stats: enviados, entregados, leídos, respondidos |
| `POST` | `/optout/:phone` | Marcar opt-out |
| `POST` | `/optin/:phone` | Marcar opt-in |
| `GET` | `/optout` | Listar opt-outs |

**Lógica clave:**

- **Plantillas:** se sincronizan desde Meta (`GET /v20.0/{waba_id}/message_templates`). Solo plantillas `APPROVED` son enviables.
- **Segmento → recipients:** consulta `crm-core` con el filtro. Excluye phones en lista opt-out. Persiste snapshot del segmento al momento del envío.
- **Cola de envíos:** BullMQ con concurrency configurable. Cada job es un mensaje; respeta rate limit de Meta (250 msg/seg para WABA tier alto, ajustable por env).
- **Costo:** cada plantilla tiene categoría (`MARKETING` / `UTILITY` / `AUTHENTICATION`) y país destino → costo conocido. Se persiste por envío para alimentar `analytics`.
- **Opt-out:** Meta lo informa por webhook (`messages > status > recipient_opted_out`). El gateway lo encola; este servicio lo consume y persiste.

**Eventos publicados:**
- `broadcast.sent` — `{ broadcastId, recipientCount, totalCost }`
- `broadcast.recipient.delivered` — `{ broadcastId, clientId, deliveredAt }`
- `broadcast.recipient.read` — `{ broadcastId, clientId, readAt }`
- `broadcast.recipient.responded` — `{ broadcastId, clientId, respondedAt }`

**Variables de entorno:**
```
PORT=3004
DATABASE_URL=postgresql://.../lid_broadcasts
REDIS_URL=...
CRM_CORE_SERVICE_URL=...
WHATSAPP_BUSINESS_ACCOUNT_ID=...
WHATSAPP_CLOUD_API_TOKEN=...
META_GRAPH_API_VERSION=v20.0
BULLMQ_CONCURRENCY=10
```

---

### 3.6 `postsale-service` (puerto 3005, BD `lid_postsale`, **aislado**)

**Responsabilidades:**
- Gestionar 1 sesión Baileys (o whatsapp-web.js) por asesora
- Enviar mensajes 1:1 "camuflados" (no usa plantillas, no es masivo)
- Secuencias de seguimiento postventa (7d post compra)
- Reactivación de inactivos

**Por qué está aparte:** ToS de Meta lo prohíbe. Hay riesgo real de baneo del número. Si se cae, no rompe nada del CRM principal.

**Endpoints:**

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/sessions` | Listar sesiones por asesora (status: `disconnected` / `qr-required` / `connected`) |
| `POST` | `/sessions/:advisorId/start` | Inicializar sesión (devuelve QR si hace falta) |
| `GET` | `/sessions/:advisorId/qr` | Obtener QR actual |
| `POST` | `/sessions/:advisorId/stop` | Cerrar sesión |
| `POST` | `/send` | `{ advisorId, clientPhone, message }` → envía y persiste |
| `GET` | `/sequences` | Listar secuencias automáticas configuradas |
| `POST` | `/sequences` | Crear secuencia (trigger + template + delay) |
| `PATCH` | `/sequences/:id` | Editar |
| `POST` | `/sequences/:id/toggle` | Activar/pausar |
| `GET` | `/health` | Health (incluye estado de cada sesión) |

**Lógica clave:**

- **Sesiones persistidas:** estado de Baileys serializado en Volume de Railway montado en `/data/sessions/<advisorId>/`. Permite recuperar sin re-escanear QR.
- **Envío seguro:** rate limit propio (max 30 msg/hora por asesora) para no levantar sospecha de Meta.
- **Secuencias:** BullMQ programa jobs con delay (`7d` para seguimiento, `30d` para reactivación). Cada job consulta condiciones (cliente sigue inactivo, asesora sigue asignada) antes de enviar.
- **Triggers que lo activan:**
  - `invoice.matched` (de integration) → programa secuencia de seguimiento
  - `client.inactive` (calculado interno cada noche por cron) → programa reactivación
- **Failover:** si la sesión cae, marca `status=disconnected`, encola los envíos pendientes y notifica al admin (frontend lo refleja en panel de configuración).

**Eventos consumidos:**
- `invoice.matched`
- `client.inactive` (interno, generado por cron del propio servicio)

**Eventos publicados:**
- `postsale.sent` — `{ advisorId, clientId, messageContent, channel: 'web-api' }`
- `postsale.session.disconnected` — `{ advisorId, reason }`

**Variables de entorno:**
```
PORT=3005
DATABASE_URL=postgresql://.../lid_postsale
REDIS_URL=...
SESSION_STORAGE_PATH=/data/sessions
WA_ENGINE=baileys                    # o whatsapp-web-js
MAX_MESSAGES_PER_HOUR_PER_SESSION=30
INACTIVE_DAYS_THRESHOLD=45
AUTH_SERVICE_URL=...                 # para resolver advisor → phone
CRM_CORE_SERVICE_URL=...
```

---

### 3.7 `analytics-service` (puerto 3006, BD `lid_analytics` o vista materializada)

**Responsabilidades:**
- Embudo de conversión global y por asesora
- Tasa de conversión por estado
- Costo por estado (gasto en difusiones / clientes que llegaron al estado)
- Identificación de etapas con caída (abandono post-presupuesto, etc.)

**Endpoints:**

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/funnel` | Embudo global (`?from=...&to=...&advisorId=...`) |
| `GET` | `/funnel/by-advisor` | Embudo desagregado |
| `GET` | `/conversion-rates` | Tasas por transición de estado |
| `GET` | `/cost-per-state` | Costo de llegar a cada estado (`?broadcastId=...` opcional) |
| `GET` | `/broadcasts/:id/roi` | ROI de una difusión específica |
| `GET` | `/advisors/:id/performance` | Performance por asesora |
| `GET` | `/dropoff` | Dónde se caen las ventas |

**Lógica clave:**

- **Fuente de datos:** consume eventos `client.state.changed`, `broadcast.sent`, `broadcast.recipient.*`, `invoice.matched` y los persiste en su BD propia (event sourcing simple).
- **Costo por estado:** para cada cliente, se rastrea qué difusión lo originó (primer touch). Se calcula `costo_difusión / clientes_que_llegaron_al_estado_X`.
- **Cache:** queries pesadas se cachean en Redis con TTL de 5 min.
- **Vista del usuario:** dashboard con gráficos (frontend usa Chart.js/Recharts; ver [03-Frontend.md](03-Frontend.md)).

**Eventos consumidos:** prácticamente todos los del sistema (es el sink analítico).

**Variables de entorno:**
```
PORT=3006
DATABASE_URL=postgresql://.../lid_analytics
REDIS_URL=...
CACHE_TTL_SECONDS=300
```

---

### 3.8 `integration-service` (puerto 3007, BD `lid_integration`)

**Responsabilidades:**
- Adapter al sistema propietario actual de La Internacional
- Polling/webhook de comprobantes nuevos
- Cruce de comprobantes con conversaciones
- Consulta de stock por colores/lotes

**Endpoints (hacia adentro):**

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/external/stock/:sku` | Consultar stock de un SKU (con colores/lotes) |
| `GET` | `/external/products` | Listar productos |
| `GET` | `/external/invoices` | Listar comprobantes (filtros) |
| `GET` | `/external/invoices/:id` | Ver comprobante |
| `POST` | `/external/quotations` | Enviar cotización al sistema actual |
| `POST` | `/internal/webhook/invoice` | Recibe webhook del sistema actual cuando se crea comprobante (si lo permite) |
| `POST` | `/internal/poll/invoices` | Endpoint usado por cron para polling de comprobantes nuevos |

**Lógica clave:**

- **Adapter:** clase `ExternalSystemAdapter` con interface estable; implementación inicial es `MockExternalSystemAdapter` (usa data simulada). Cuando tengamos info del freelance, agregamos `RealExternalSystemAdapter`. Selección por env var `EXTERNAL_SYSTEM_ADAPTER=mock|real`.
- **Cruce de comprobantes:**
  1. Recibe (vía polling o webhook) comprobante con `{ phone, total, items, createdAt }`.
  2. Llama a `crm-core` por `phone` → obtiene `clientId`.
  3. Llama a `messaging` para conversaciones activas de ese cliente en ventana ±48hs.
  4. Si match único → publica `invoice.matched`.
  5. Si ambiguo → publica `invoice.match.pending` (frontend lo muestra al admin).
- **Cron interno:** cada 5 min hace polling al sistema actual por comprobantes nuevos (si no hay webhook).

**Eventos publicados:**
- `invoice.matched` — `{ invoiceId, clientId, conversationId, total, advisorId }`
- `invoice.match.pending` — `{ invoiceId, candidateClientIds }`

**Variables de entorno:**
```
PORT=3007
DATABASE_URL=postgresql://.../lid_integration
REDIS_URL=...
EXTERNAL_SYSTEM_ADAPTER=mock
EXTERNAL_SYSTEM_BASE_URL=...        # cuando lo sepamos
EXTERNAL_SYSTEM_API_KEY=...
INVOICE_POLL_CRON=*/5 * * * *
INVOICE_MATCH_WINDOW_HOURS=48
CRM_CORE_SERVICE_URL=...
MESSAGING_SERVICE_URL=...
```

---

## 4. Eventos pub/sub: vista consolidada

| Evento | Publica | Consume | Payload (resumen) |
|---|---|---|---|
| `client.created` | crm-core | messaging, analytics | `{ clientId, phone, advisorId? }` |
| `client.assigned` | crm-core | messaging, postsale | `{ clientId, advisorId, previousAdvisorId? }` |
| `client.tagged` | crm-core | analytics | `{ clientId, tagId }` |
| `client.state.changed` | messaging | analytics | `{ clientId, previousState, newState }` |
| `client.inactive` | postsale (cron) | postsale | `{ clientId, lastActivityAt }` |
| `message.received` | messaging | crm-core, analytics | `{ conversationId, messageId, clientId }` |
| `message.sent` | messaging | analytics | `{ conversationId, messageId, fromUserId }` |
| `broadcast.sent` | broadcasts | analytics | `{ broadcastId, recipientCount, totalCost }` |
| `broadcast.recipient.delivered` | broadcasts | analytics | `{ broadcastId, clientId, deliveredAt }` |
| `broadcast.recipient.read` | broadcasts | analytics | `{ broadcastId, clientId, readAt }` |
| `broadcast.recipient.responded` | broadcasts | analytics | `{ broadcastId, clientId, respondedAt }` |
| `postsale.send.requested` | messaging | postsale | `{ advisorId, clientId, message }` |
| `postsale.sent` | postsale | analytics | `{ advisorId, clientId, channel }` |
| `postsale.session.disconnected` | postsale | (notif admin) | `{ advisorId, reason }` |
| `invoice.matched` | integration | crm-core, analytics, postsale | `{ invoiceId, clientId, conversationId, total }` |
| `invoice.match.pending` | integration | (notif admin) | `{ invoiceId, candidateClientIds }` |

Los contratos exactos viven en `packages/shared-events/`.

---

## 5. Webhooks de Meta — manejo detallado

El gateway recibe `POST /webhooks/meta`. Flujo:

```ts
// pseudocódigo
1. Validar header X-Hub-Signature-256 con META_APP_SECRET
2. Para cada entry/change en el payload:
   a. Calcular eventId único (combinar messages.id, statuses.id, etc.)
   b. Intentar INSERT en webhook_events (unique constraint en eventId)
   c. Si conflict → ya procesado, skip
   d. Si insertado → push a Redis queue 'meta-events'
3. Responder 200 OK a Meta (siempre)
```

El `messaging-service` consume `meta-events`:
- `messages` (entrante) → resolver cliente, persistir mensaje, publicar `message.received`
- `statuses` (delivery, read) → actualizar `broadcast_recipients` o `messages` según corresponda
- Errores → logging + dead letter queue

---

## 6. Testing

Lección heredada: **integration tests con BD real, no mocks**. El docker-compose local levanta postgres + redis aislados de prod.

- **Unit:** servicios puros, helpers, mappers.
- **e2e:** Supertest contra la app NestJS levantada con BD de test (`lid_<service>_test`). Cada test corre dentro de una transacción que hace rollback al final.
- **Contract tests:** los eventos publicados por cada servicio se validan contra los schemas en `shared-events/`.
- **Smoke tests post-deploy:** un workflow simple que pega `/health` de cada servicio en Railway tras cada deploy.

---

## 7. Variables de entorno globales (compartidas)

| Variable | Notas |
|---|---|
| `NODE_ENV` | `development` / `production` |
| `LOG_LEVEL` | `debug` / `info` / `warn` / `error` |
| `JWT_SECRET` | compartido entre `gateway` y `auth-service` |
| `REDIS_URL` | provisto por Railway plugin |
| `DATABASE_URL` | una por servicio, distinta DB lógica |
| `META_APP_SECRET` | para validar webhooks |

Lista completa por servicio: ver sección de cada servicio. Lista de qué pedir al cliente: [05-Requerimientos-Tecnicos.md](05-Requerimientos-Tecnicos.md).

---

## 8. Convenciones de carpetas en cada servicio

```
src/
├── main.ts                   # bootstrap NestJS
├── app.module.ts
├── modules/
│   ├── clients/
│   │   ├── clients.controller.ts
│   │   ├── clients.service.ts
│   │   ├── clients.module.ts
│   │   └── dto/
│   │       ├── create-client.dto.ts
│   │       └── update-client.dto.ts
│   └── ...
├── common/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   └── decorators/
└── prisma/
    └── prisma.service.ts
```

Para esquemas de tablas, índices y migraciones detalladas ver [04-Base-de-Datos.md](04-Base-de-Datos.md).
