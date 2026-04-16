# 04 — Base de Datos

> Esquema de datos del CRM de La Internacional. PostgreSQL, ORM Prisma. Una BD lógica por servicio en el mismo cluster Postgres de Railway, salvo `lid_postsale` que va en cluster aparte por aislamiento.

Ver [02-Backend.md](02-Backend.md) para qué servicio usa cada esquema, y [01-Arquitectura.md](01-Arquitectura.md) para el rationale de la división.

---

## 1. Estrategia general

### 1.1 BD por servicio

| BD lógica | Servicio | Cluster |
|---|---|---|
| `lid_auth` | auth-service | Postgres principal |
| `lid_crm` | crm-core-service | Postgres principal |
| `lid_messaging` | messaging-service | Postgres principal |
| `lid_broadcasts` | broadcasts-service | Postgres principal |
| `lid_analytics` | analytics-service | Postgres principal |
| `lid_integration` | integration-service | Postgres principal |
| `lid_postsale` | postsale-service | **Postgres aparte** (aislamiento) |

**Por qué BD por servicio:** cada servicio es dueño de sus datos. Si necesita datos de otro, los pide por API. Esto evita acoplamientos por joins SQL y permite escalar/migrar cada uno sin coordinar.

**Por qué `lid_postsale` aparte:** ese servicio puede caerse, ser reiniciado o tener problemas de performance (sesiones WhatsApp Web). No queremos que su carga afecte al resto.

**Duplicación intencional:** algunos campos (ej. `phone` del cliente) viven en varios servicios. Eso está OK; el `crm-core-service` es la fuente de verdad y los demás cachean lo que necesitan.

### 1.2 Convenciones globales

- **IDs:** `uuid` (v4), generados por la BD con `gen_random_uuid()`.
- **Timestamps:** `timestamptz` siempre. Campos `createdAt`, `updatedAt`, `deletedAt` (soft-delete donde aplique).
- **Strings de teléfono:** se guardan dos columnas: `phone_raw` (como entró) y `phone_normalized` (E.164, ej. `+5493511234567`). Las búsquedas y unique constraints van por `phone_normalized`.
- **Money:** `decimal(12,2)` para montos en moneda; columna `currency` (char(3)) cuando aplique.
- **Enums:** se modelan con tablas de catálogo cuando son negocio mutable (estados, tipos), o como Prisma enum cuando son inmutables (roles).
- **Soft-delete:** columna `deleted_at` nullable. Las queries filtran por defecto.
- **Auditoría:** `created_by_user_id` y `updated_by_user_id` nullable en tablas de negocio.

---

## 2. `lid_auth` — usuarios y autenticación

```prisma
// schema.prisma

model User {
  id           String   @id @default(uuid()) @db.Uuid
  email        String   @unique
  passwordHash String   @map("password_hash")
  displayName  String   @map("display_name")
  role         Role
  phoneRaw     String?  @map("phone_raw")
  phoneNormalized String? @unique @map("phone_normalized")  // teléfono propio de la asesora
  active       Boolean  @default(true)
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt    DateTime @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt    DateTime? @map("deleted_at") @db.Timestamptz

  refreshTokens RefreshToken[]

  @@map("users")
  @@index([role])
}

enum Role {
  admin
  advisor
}

model RefreshToken {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  tokenHash String   @unique @map("token_hash")
  expiresAt DateTime @map("expires_at") @db.Timestamptz
  revokedAt DateTime? @map("revoked_at") @db.Timestamptz
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
  @@index([userId])
}
```

**Notas:**
- `phone_normalized` es **unique** porque es el teléfono propio de la asesora (usado por `postsale-service`). Una asesora = un teléfono.
- No guardamos passwords en claro nunca; `passwordHash` con bcrypt cost 12.

---

## 3. `lid_crm` — clientes y CRM core

```prisma
model Client {
  id              String   @id @default(uuid()) @db.Uuid
  phoneRaw        String   @map("phone_raw")
  phoneNormalized String   @unique @map("phone_normalized")  // anti-duplicación
  name            String?
  email           String?
  professionalCredential String? @map("professional_credential")  // matrícula

  typeId          String?  @map("type_id") @db.Uuid
  type            ClientType? @relation(fields: [typeId], references: [id])

  advisorId       String?  @map("advisor_id") @db.Uuid           // FK lógica al user de auth
  assignedAt      DateTime? @map("assigned_at") @db.Timestamptz

  city            String?
  province        String?
  isProfessional  Boolean  @default(false) @map("is_professional")

  optInBroadcasts Boolean  @default(true) @map("opt_in_broadcasts")
  optOutAt        DateTime? @map("opt_out_at") @db.Timestamptz

  notes           String?

  firstSeenAt     DateTime @default(now()) @map("first_seen_at") @db.Timestamptz
  lastActivityAt  DateTime? @map("last_activity_at") @db.Timestamptz
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt       DateTime? @map("deleted_at") @db.Timestamptz

  tags            ClientTag[]

  @@map("clients")
  @@index([advisorId])
  @@index([typeId])
  @@index([lastActivityAt])
  @@index([city, province])
}

model ClientType {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @unique         // ej. "Cosmetóloga Córdoba", "Esteticista Interior"
  description String?
  defaultAdvisorId String? @map("default_advisor_id") @db.Uuid  // mapping tipo → asesora
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz

  clients     Client[]

  @@map("client_types")
}

model Tag {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @unique
  color     String?  // hex
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  clients   ClientTag[]

  @@map("tags")
}

model ClientTag {
  clientId  String   @map("client_id") @db.Uuid
  tagId     String   @map("tag_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  client    Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([clientId, tagId])
  @@map("client_tags")
}

model ClientStateHistory {
  id           String   @id @default(uuid()) @db.Uuid
  clientId     String   @map("client_id") @db.Uuid
  conversationId String? @map("conversation_id") @db.Uuid    // FK lógica a messaging
  previousState String? @map("previous_state")
  newState     String   @map("new_state")
  changedBy    String?  @map("changed_by") @db.Uuid
  changedAt    DateTime @default(now()) @map("changed_at") @db.Timestamptz

  @@map("client_state_history")
  @@index([clientId])
  @@index([changedAt])
}
```

**Decisiones clave:**

- `phone_normalized` con **unique** garantiza la anti-duplicación a nivel de BD; el servicio normaliza con `libphonenumber-js` antes de insertar.
- `advisor_id` es FK lógica (no constraint) porque vive en `lid_auth`. El servicio valida la existencia consultando `auth-service` cuando hace falta.
- `ClientStateHistory` permite reconstruir el embudo en `analytics-service` (consume los eventos `client.state.changed`).
- `firstSeenAt` y `lastActivityAt` permiten cálculo de inactividad para `postsale-service`.

---

## 4. `lid_messaging` — bandeja, conversaciones, mensajes

```prisma
model Channel {
  id            String   @id @default(uuid()) @db.Uuid
  name          String                          // "WhatsApp Asesora 1", "Instagram Oficial"
  type          ChannelType
  identifier    String   @unique                // phone_number_id de Meta o IG account id
  active        Boolean  @default(true)
  metadata      Json?
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz

  conversations Conversation[]

  @@map("channels")
}

enum ChannelType {
  whatsapp_cloud
  instagram
  whatsapp_web   // las del postsale, registradas también acá para vista unificada
}

model Conversation {
  id              String   @id @default(uuid()) @db.Uuid
  clientId        String   @map("client_id") @db.Uuid       // FK lógica a crm
  channelId       String   @map("channel_id") @db.Uuid
  advisorId       String?  @map("advisor_id") @db.Uuid      // FK lógica a auth
  state           String   @default("recibido")             // ver tabla de estados (lid_crm) o catálogo separado
  lastMessageAt   DateTime? @map("last_message_at") @db.Timestamptz
  unreadCount     Int      @default(0) @map("unread_count")
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime @updatedAt @map("updated_at") @db.Timestamptz

  channel         Channel  @relation(fields: [channelId], references: [id])
  messages        Message[]
  conversationTags ConversationTag[]

  @@map("conversations")
  @@index([clientId])
  @@index([advisorId])
  @@index([channelId])
  @@index([state])
  @@index([lastMessageAt])
}

model Message {
  id              String   @id @default(uuid()) @db.Uuid
  conversationId  String   @map("conversation_id") @db.Uuid
  externalId      String?  @unique @map("external_id")   // wamid de Meta o id de IG
  direction       MessageDirection
  content         String?
  mediaUrl        String?  @map("media_url")
  mediaType       String?  @map("media_type")            // image, video, audio, document
  fromUserId      String?  @map("from_user_id") @db.Uuid // si direction=outbound, qué asesora
  status          MessageStatus @default(sent)
  sentAt          DateTime @default(now()) @map("sent_at") @db.Timestamptz
  deliveredAt     DateTime? @map("delivered_at") @db.Timestamptz
  readAt          DateTime? @map("read_at") @db.Timestamptz

  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@map("messages")
  @@index([conversationId, sentAt])
  @@index([externalId])
}

enum MessageDirection {
  inbound
  outbound
}

enum MessageStatus {
  sent
  delivered
  read
  failed
}

model ConversationTag {
  conversationId String @map("conversation_id") @db.Uuid
  tagId          String @map("tag_id") @db.Uuid           // FK lógica a tags en crm

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@id([conversationId, tagId])
  @@map("conversation_tags")
}

model WebhookEvent {
  id           String   @id @default(uuid()) @db.Uuid
  source       String                                     // 'meta', 'instagram', etc.
  externalEventId String @unique @map("external_event_id")
  eventType    String   @map("event_type")
  payload      Json
  processedAt  DateTime? @map("processed_at") @db.Timestamptz
  receivedAt   DateTime @default(now()) @map("received_at") @db.Timestamptz

  @@map("webhook_events")
  @@index([processedAt])
}
```

**Notas:**
- `external_id` con unique = idempotencia para no duplicar mensajes si Meta reenvía.
- `WebhookEvent` con `external_event_id` unique = idempotencia a nivel de webhook.
- `state` se modela como string para flexibilidad (los estados los define el negocio en runtime); ver pregunta abierta sobre si conviene una tabla `client_states` catálogo.

---

## 5. `lid_broadcasts` — difusiones y plantillas

```prisma
model Template {
  id              String   @id @default(uuid()) @db.Uuid
  externalId      String   @unique @map("external_id")    // id en Meta
  name            String
  language        String                                   // 'es_AR', 'es', etc.
  category        TemplateCategory
  status          TemplateStatus
  components      Json                                     // body, header, buttons (estructura Meta)
  variableCount   Int      @default(0) @map("variable_count")
  estimatedCostUsd Decimal? @map("estimated_cost_usd") @db.Decimal(10, 6)
  syncedAt        DateTime @default(now()) @map("synced_at") @db.Timestamptz

  broadcasts      Broadcast[]

  @@map("templates")
  @@index([status])
}

enum TemplateCategory {
  marketing
  utility
  authentication
}

enum TemplateStatus {
  approved
  pending
  rejected
  paused
}

model Broadcast {
  id              String   @id @default(uuid()) @db.Uuid
  name            String
  templateId      String   @map("template_id") @db.Uuid
  segmentFilter   Json     @map("segment_filter")          // snapshot del filtro
  variables       Json?                                    // valores por defecto de variables
  scheduledAt     DateTime? @map("scheduled_at") @db.Timestamptz
  startedAt       DateTime? @map("started_at") @db.Timestamptz
  completedAt     DateTime? @map("completed_at") @db.Timestamptz
  status          BroadcastStatus @default(draft)
  recipientCount  Int      @default(0) @map("recipient_count")
  totalCostUsd    Decimal? @map("total_cost_usd") @db.Decimal(10, 4)
  createdBy       String   @map("created_by") @db.Uuid
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz

  template        Template @relation(fields: [templateId], references: [id])
  recipients      BroadcastRecipient[]

  @@map("broadcasts")
  @@index([status])
  @@index([scheduledAt])
}

enum BroadcastStatus {
  draft
  scheduled
  sending
  completed
  failed
  cancelled
}

model BroadcastRecipient {
  id            String   @id @default(uuid()) @db.Uuid
  broadcastId   String   @map("broadcast_id") @db.Uuid
  clientId      String   @map("client_id") @db.Uuid          // FK lógica a crm
  phoneNormalized String @map("phone_normalized")            // duplicado a propósito
  externalMessageId String? @map("external_message_id")      // wamid

  status        RecipientStatus @default(queued)
  sentAt        DateTime? @map("sent_at") @db.Timestamptz
  deliveredAt   DateTime? @map("delivered_at") @db.Timestamptz
  readAt        DateTime? @map("read_at") @db.Timestamptz
  respondedAt   DateTime? @map("responded_at") @db.Timestamptz
  failedReason  String?   @map("failed_reason")
  costUsd       Decimal?  @map("cost_usd") @db.Decimal(10, 6)

  broadcast     Broadcast @relation(fields: [broadcastId], references: [id], onDelete: Cascade)

  @@map("broadcast_recipients")
  @@unique([broadcastId, clientId])
  @@index([clientId])
  @@index([status])
}

enum RecipientStatus {
  queued
  sent
  delivered
  read
  responded
  failed
  opted_out
}

model OptOut {
  phoneNormalized String   @id @map("phone_normalized")
  clientId        String?  @map("client_id") @db.Uuid
  source          String                                    // 'user', 'meta-webhook', 'admin'
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@map("opt_outs")
}
```

**Notas:**
- `BroadcastRecipient` duplica `phoneNormalized` y `clientId` a propósito: permite analizar cohortes históricas aún si el cliente se borra.
- `costUsd` en cada recipient porque Meta cobra por destinatario y el costo cambia por país y categoría.
- `segmentFilter` se persiste como JSON snapshot del filtro al momento del envío (ej. `{type:"cosmetologa", city:"Cordoba"}`).

---

## 6. `lid_postsale` — sesiones y secuencias (BD aislada)

```prisma
model Session {
  id              String   @id @default(uuid()) @db.Uuid
  advisorId       String   @unique @map("advisor_id") @db.Uuid    // 1 sesión por asesora
  advisorPhone    String   @map("advisor_phone")
  status          SessionStatus @default(disconnected)
  qrPayload       String?  @map("qr_payload")
  lastConnectedAt DateTime? @map("last_connected_at") @db.Timestamptz
  lastDisconnectedAt DateTime? @map("last_disconnected_at") @db.Timestamptz
  disconnectReason String? @map("disconnect_reason")
  storagePath     String   @map("storage_path")               // ruta en Volume Railway
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime @updatedAt @map("updated_at") @db.Timestamptz

  outboundMessages PostsaleMessage[]

  @@map("sessions")
}

enum SessionStatus {
  disconnected
  qr_required
  connecting
  connected
  banned
}

model Sequence {
  id              String   @id @default(uuid()) @db.Uuid
  name            String
  trigger         SequenceTrigger
  delayDays       Int      @map("delay_days")
  messageTemplate String   @map("message_template")           // texto con placeholders {{nombre}}, {{ultima_compra}}
  active          Boolean  @default(true)
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz

  scheduledJobs   SequenceJob[]

  @@map("sequences")
}

enum SequenceTrigger {
  invoice_matched         // a los N días de cerrar venta
  client_inactive         // a los N días sin actividad
}

model SequenceJob {
  id            String   @id @default(uuid()) @db.Uuid
  sequenceId    String   @map("sequence_id") @db.Uuid
  clientId      String   @map("client_id") @db.Uuid           // FK lógica
  advisorId     String   @map("advisor_id") @db.Uuid          // FK lógica
  scheduledFor  DateTime @map("scheduled_for") @db.Timestamptz
  status        JobStatus @default(pending)
  attempts      Int      @default(0)
  lastAttemptAt DateTime? @map("last_attempt_at") @db.Timestamptz
  sentMessageId String?  @map("sent_message_id") @db.Uuid
  cancelReason  String?  @map("cancel_reason")
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz

  sequence      Sequence @relation(fields: [sequenceId], references: [id])

  @@map("sequence_jobs")
  @@index([scheduledFor, status])
  @@index([clientId])
}

enum JobStatus {
  pending
  sent
  cancelled
  failed
}

model PostsaleMessage {
  id            String   @id @default(uuid()) @db.Uuid
  sessionId     String   @map("session_id") @db.Uuid
  clientId      String   @map("client_id") @db.Uuid
  clientPhone   String   @map("client_phone")
  content       String
  sentAt        DateTime @default(now()) @map("sent_at") @db.Timestamptz
  externalMessageId String? @map("external_message_id")
  status        String   @default("sent")
  failedReason  String?  @map("failed_reason")
  jobId         String?  @map("job_id") @db.Uuid

  session       Session  @relation(fields: [sessionId], references: [id])

  @@map("postsale_messages")
  @@index([sessionId, sentAt])
  @@index([clientId])
}
```

**Notas:**
- El `storagePath` apunta al directorio donde Baileys/whatsapp-web.js serializa la sesión (ej. `/data/sessions/<advisorId>/`).
- `SequenceJob` tiene cron interno que cada minuto consulta `WHERE status='pending' AND scheduledFor <= NOW()`.
- Antes de ejecutar un job, valida: cliente sigue inactivo (en el caso de reactivación) y la asesora sigue siendo dueña.

---

## 7. `lid_analytics` — agregaciones

```prisma
model EventLog {
  id          String   @id @default(uuid()) @db.Uuid
  eventName   String   @map("event_name")             // 'client.state.changed', etc.
  payload     Json
  occurredAt  DateTime @map("occurred_at") @db.Timestamptz
  receivedAt  DateTime @default(now()) @map("received_at") @db.Timestamptz

  @@map("event_logs")
  @@index([eventName, occurredAt])
}

model ClientLifecycle {
  clientId       String   @id @map("client_id") @db.Uuid
  firstContactAt DateTime? @map("first_contact_at") @db.Timestamptz
  firstBroadcastId String? @map("first_broadcast_id") @db.Uuid    // primer touch
  currentState   String?  @map("current_state")
  reachedReceived DateTime? @map("reached_received") @db.Timestamptz
  reachedValidation DateTime? @map("reached_validation") @db.Timestamptz
  reachedQuoting DateTime? @map("reached_quoting") @db.Timestamptz
  reachedScheduled DateTime? @map("reached_scheduled") @db.Timestamptz
  reachedClosed  DateTime? @map("reached_closed") @db.Timestamptz
  totalSpentUsd  Decimal? @map("total_spent_usd") @db.Decimal(12, 2)
  advisorId      String?  @map("advisor_id") @db.Uuid

  @@map("client_lifecycles")
  @@index([currentState])
  @@index([advisorId])
  @@index([firstBroadcastId])
}

model BroadcastROI {
  broadcastId        String  @id @map("broadcast_id") @db.Uuid
  totalCostUsd       Decimal @map("total_cost_usd") @db.Decimal(10, 4)
  recipientCount     Int     @map("recipient_count")
  responsesCount     Int     @map("responses_count")
  conversionsCount   Int     @map("conversions_count")
  totalRevenueUsd    Decimal @map("total_revenue_usd") @db.Decimal(12, 2)
  costPerResponseUsd Decimal @map("cost_per_response_usd") @db.Decimal(10, 4)
  costPerConversionUsd Decimal @map("cost_per_conversion_usd") @db.Decimal(10, 4)
  computedAt         DateTime @default(now()) @map("computed_at") @db.Timestamptz

  @@map("broadcast_roi")
}
```

**Notas:**
- `EventLog` es event sourcing crudo (todos los eventos pub/sub se persisten acá).
- `ClientLifecycle` y `BroadcastROI` son **proyecciones** (vistas materializadas) actualizadas por el consumidor de eventos. Permiten queries rápidas para los dashboards.
- Los nombres de columnas `reached_*` asumen los estados del documento original; si el cliente define otros, se ajustan.

---

## 8. `lid_integration` — sistema externo

```prisma
model ExternalInvoice {
  id              String   @id @default(uuid()) @db.Uuid
  externalInvoiceId String @unique @map("external_invoice_id")  // id en sistema actual
  clientPhone     String   @map("client_phone")
  clientId        String?  @map("client_id") @db.Uuid           // resuelto vs crm
  totalUsd        Decimal? @map("total_usd") @db.Decimal(12, 2)
  totalLocal      Decimal? @map("total_local") @db.Decimal(12, 2)
  currency        String?  @db.Char(3)
  items           Json
  status          String?                                       // si el sistema actual lo provee
  issuedAt        DateTime @map("issued_at") @db.Timestamptz
  fetchedAt       DateTime @default(now()) @map("fetched_at") @db.Timestamptz

  matchedConversationId String? @map("matched_conversation_id") @db.Uuid
  matchStatus     MatchStatus @default(pending)
  matchedAt       DateTime? @map("matched_at") @db.Timestamptz
  matchCandidates Json?    @map("match_candidates")             // si quedó ambiguo

  @@map("external_invoices")
  @@index([clientId])
  @@index([clientPhone])
  @@index([matchStatus])
}

enum MatchStatus {
  pending
  matched
  ambiguous
  no_match
  manual_match
}

model SyncCheckpoint {
  id            String   @id @default(uuid()) @db.Uuid
  resource      String   @unique                              // 'invoices', 'products'
  lastSyncedAt  DateTime @map("last_synced_at") @db.Timestamptz
  lastSyncedId  String?  @map("last_synced_id")
  updatedAt     DateTime @updatedAt @map("updated_at") @db.Timestamptz

  @@map("sync_checkpoints")
}

model ProductCache {
  id            String   @id @default(uuid()) @db.Uuid
  externalSku   String   @unique @map("external_sku")
  name          String
  description   String?
  variantsJson  Json?    @map("variants_json")               // colores, lotes
  stockJson     Json?    @map("stock_json")                  // por variante
  priceUsd      Decimal? @map("price_usd") @db.Decimal(12, 2)
  cachedAt      DateTime @default(now()) @map("cached_at") @db.Timestamptz

  @@map("product_cache")
}
```

**Notas:**
- `external_invoices` guarda **todos** los comprobantes que vienen del sistema externo, ya matcheados o no. El campo `matchStatus` permite a los admins revisar los `ambiguous`.
- `ProductCache` permite consultas rápidas de stock desde el chat sin pegarle constantemente al sistema externo. TTL configurable.

---

## 9. Convenciones técnicas

### 9.1 Normalización de teléfonos

Helper compartido en `packages/shared-utils/`:

```ts
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function normalizePhone(input: string, defaultCountry = 'AR'): string | null {
  const parsed = parsePhoneNumberFromString(input, defaultCountry as any);
  if (!parsed?.isValid()) return null;
  return parsed.format('E.164');
}
```

**Regla:** todo phone que entre por API o por webhook se normaliza antes de tocar la BD.

### 9.2 Índices

Los índices más críticos:

- `clients.phone_normalized` (unique) — anti-duplicación.
- `users.phone_normalized` (unique) — teléfono de asesora.
- `messages.external_id` (unique) — idempotencia Meta.
- `webhook_events.external_event_id` (unique) — idempotencia Meta a nivel webhook.
- `conversations.last_message_at` — orden de bandeja.
- `clients.last_activity_at` — detección de inactividad.

### 9.3 Migraciones (Prisma)

Cada servicio mantiene sus migraciones bajo `prisma/migrations/`. Comando para crearlas:

```
npx prisma migrate dev --name <nombre>
```

En Railway, el deploy ejecuta `npx prisma migrate deploy` antes del start.

### 9.4 Seeds

Cada servicio tiene `prisma/seed.ts`. Para el prototipo:

- `lid_auth`: 1 admin + 5 asesoras con teléfonos de prueba.
- `lid_crm`: ~10 tipos de cliente, ~20 tags, ~50 clientes ficticios distribuidos entre asesoras.
- `lid_messaging`: 5 channels (4 WA Cloud + 1 IG) + ~100 mensajes ficticios.
- `lid_broadcasts`: ~3 plantillas demo, ~2 difusiones históricas.
- `lid_postsale`: 5 sesiones inicializadas en `disconnected`, 2 secuencias demo.
- `lid_analytics`: vacío al inicio (se llena con eventos).
- `lid_integration`: cargar 5-10 productos demo y 10 comprobantes (para probar matching).

---

## 10. Vista cruzada: cobertura de servicios → tablas

| Servicio | BD | Tablas principales |
|---|---|---|
| auth-service | `lid_auth` | `users`, `refresh_tokens` |
| crm-core-service | `lid_crm` | `clients`, `client_types`, `tags`, `client_tags`, `client_state_history` |
| messaging-service | `lid_messaging` | `channels`, `conversations`, `messages`, `conversation_tags`, `webhook_events` |
| broadcasts-service | `lid_broadcasts` | `templates`, `broadcasts`, `broadcast_recipients`, `opt_outs` |
| postsale-service | `lid_postsale` | `sessions`, `sequences`, `sequence_jobs`, `postsale_messages` |
| analytics-service | `lid_analytics` | `event_logs`, `client_lifecycles`, `broadcast_roi` |
| integration-service | `lid_integration` | `external_invoices`, `sync_checkpoints`, `product_cache` |

---

## 11. Preparación para e-commerce (S2 2025)

El esquema ya contempla:

- `clients` tiene `email`, `city`, `province`, `professional_credential` → suficiente para checkout B2B.
- `Channel` con tipo extensible → sumar `web` cuando exista la tienda.
- `ProductCache` puede actuar como base del catálogo público.
- Los eventos de venta (`invoice.matched`) son agnósticos del canal de origen.

No se necesitan migraciones disruptivas para arrancar la tienda online; se suman tablas auxiliares (carrito, sesión web, etc.) en el momento.

---

## 12. Decisiones abiertas relativas a BD

- **Estados como tabla catálogo vs string:** definir si los estados del lifecycle del cliente vivirán en una tabla `client_states` (con orden, color, descripción) o como string libre. Recomendación: catálogo, una vez que el cliente confirme la lista.
- **Visibilidad asesora ↔ clientes:** afecta la lógica de queries (¿agregamos `WHERE advisor_id = ?` siempre o solo en algunas vistas?). Ver [05-Requerimientos-Tecnicos.md](05-Requerimientos-Tecnicos.md).
- **Estados de comprobantes externos:** depende de si el sistema actual los expone como tales o como colorcitos.
