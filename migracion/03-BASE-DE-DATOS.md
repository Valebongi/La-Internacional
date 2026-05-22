# 03 — Base de datos

## Estrategia general

**2 bases de datos en PostgreSQL:**
- `lid_main` — todo el CRM, messaging, broadcasts, analytics, usuarios
- `lid_postsale` — secuencias de postventa (separado para poder escalar o aislar)

**ORM:** Prisma con migrations automáticas  
**Convención:** snake_case para tablas y columnas, UUID como PK

---

## Schema completo — `lid_main`

### Autenticación y usuarios

```prisma
// prisma/schema.prisma (lid_main)

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─────────────────────────────────────────
//  USUARIOS Y ROLES
// ─────────────────────────────────────────

enum UserRole {
  super_admin
  admin
  advisor
  postsale
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  passwordHash  String    @map("password_hash")
  role          UserRole  @default(advisor)
  active        Boolean   @default(true)
  avatarColor   String?   @map("avatar_color")   // hex color para UI
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  advisor       Advisor?  // relación 1:1 si el user es una asesora
  sessions      Session[]
  auditLogs     AuditLog[]

  @@map("users")
}

model Session {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  tokenHash   String   @map("token_hash")  // hash del refresh token
  expiresAt   DateTime @map("expires_at")
  createdAt   DateTime @default(now()) @map("created_at")
  revokedAt   DateTime? @map("revoked_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([tokenHash])
  @@map("sessions")
}
```

### Asesoras y canales WhatsApp

```prisma
// ─────────────────────────────────────────
//  ASESORAS Y CANALES
// ─────────────────────────────────────────

enum ClientType {
  A   // tipo de cliente por categoría del negocio
  B
  C
  mayorista
  minorista
}

model Advisor {
  id            String      @id @default(uuid())
  userId        String      @unique @map("user_id")
  name          String
  color         String      // hex para UI
  clientTypes   ClientType[] @map("client_types")  // tipos asignados a esta asesora
  active        Boolean     @default(true)
  createdAt     DateTime    @default(now()) @map("created_at")

  user          User        @relation(fields: [userId], references: [id])
  clients       Client[]
  conversations Conversation[]
  channelAdvisors ChannelAdvisor[]

  @@map("advisors")
}

enum ChannelType {
  whatsapp_cloud   // Meta Cloud API — números principales
  whatsapp_web     // Baileys — postventa
  instagram        // Instagram Business
}

model Channel {
  id            String      @id @default(uuid())
  name          String      // "WhatsApp Ventas 1", "WhatsApp Ventas 2"
  type          ChannelType
  identifier    String      @unique  // phone_number_id de Meta o account_id de IG
  phoneNumber   String?     @map("phone_number")  // número legible "+5493512345678"
  active        Boolean     @default(true)
  metadata      Json?       // config específica del canal (access_token propio si aplica)
  createdAt     DateTime    @default(now()) @map("created_at")

  conversations   Conversation[]
  broadcasts      Broadcast[]
  channelAdvisors ChannelAdvisor[]

  @@map("channels")
}

// Relación many-to-many: cada asesora puede operar en múltiples canales
// y cada canal puede tener múltiples asesoras
model ChannelAdvisor {
  channelId   String @map("channel_id")
  advisorId   String @map("advisor_id")
  isPrimary   Boolean @default(false) @map("is_primary")  // asesora principal del canal

  channel  Channel @relation(fields: [channelId], references: [id])
  advisor  Advisor @relation(fields: [advisorId], references: [id])

  @@id([channelId, advisorId])
  @@map("channel_advisors")
}
```

### CRM — Clientes y oportunidades

```prisma
// ─────────────────────────────────────────
//  CRM
// ─────────────────────────────────────────

enum ClientState {
  active
  inactive
  blocked
}

model Client {
  id              String      @id @default(uuid())
  name            String
  phone           String
  phoneNormalized String      @unique @map("phone_normalized")  // E.164 sin +
  type            ClientType?
  advisorId       String?     @map("advisor_id")
  state           ClientState @default(active)
  city            String?
  province        String?
  email           String?
  tags            String[]    @default([])
  notes           String?
  lastContactAt   DateTime?   @map("last_contact_at")
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  advisor         Advisor?    @relation(fields: [advisorId], references: [id])
  conversations   Conversation[]
  opportunities   Opportunity[]
  broadcastRecipients BroadcastRecipient[]

  @@index([advisorId])
  @@index([phoneNormalized])
  @@index([type])
  @@map("clients")
}

enum OpportunityStatus {
  new           // recién llegó
  contacted     // se inició conversación
  interested    // mostró interés
  negotiating   // en negociación
  won           // venta cerrada
  lost          // perdida
}

model Opportunity {
  id            String            @id @default(uuid())
  clientId      String            @map("client_id")
  advisorId     String?           @map("advisor_id")
  channelId     String?           @map("channel_id")
  status        OpportunityStatus @default(new)
  notes         String?
  value         Decimal?          // valor estimado de la venta
  lostReason    String?           @map("lost_reason")
  wonAt         DateTime?         @map("won_at")
  lostAt        DateTime?         @map("lost_at")
  createdAt     DateTime          @default(now()) @map("created_at")
  updatedAt     DateTime          @updatedAt @map("updated_at")

  client  Client @relation(fields: [clientId], references: [id])

  @@index([clientId])
  @@index([advisorId])
  @@index([status])
  @@map("opportunities")
}
```

### Messaging — Conversaciones y mensajes

```prisma
// ─────────────────────────────────────────
//  MESSAGING
// ─────────────────────────────────────────

enum ConversationState {
  open
  closed
  pending  // esperando respuesta del cliente
}

model Conversation {
  id            String            @id @default(uuid())
  clientId      String            @map("client_id")
  channelId     String            @map("channel_id")
  advisorId     String?           @map("advisor_id")
  state         ConversationState @default(open)
  lastMessageAt DateTime?         @map("last_message_at")
  lastMessageBody String?         @map("last_message_body")
  unreadCount   Int               @default(0) @map("unread_count")
  createdAt     DateTime          @default(now()) @map("created_at")
  updatedAt     DateTime          @updatedAt @map("updated_at")

  client    Client    @relation(fields: [clientId], references: [id])
  channel   Channel   @relation(fields: [channelId], references: [id])
  advisor   Advisor?  @relation(fields: [advisorId], references: [id])
  messages  Message[]

  @@unique([clientId, channelId])  // un cliente tiene una conv por canal
  @@index([channelId])
  @@index([advisorId])
  @@index([state])
  @@index([lastMessageAt])
  @@map("conversations")
}

enum MessageDirection {
  inbound   // cliente → nosotros
  outbound  // nosotros → cliente
}

enum MessageType {
  text
  image
  audio
  video
  document
  template
  sticker
  location
  reaction
}

enum MessageStatus {
  sent
  delivered
  read
  failed
}

model Message {
  id              String           @id @default(uuid())
  conversationId  String           @map("conversation_id")
  externalId      String?          @unique @map("external_id")  // wamid de Meta
  direction       MessageDirection
  type            MessageType      @default(text)
  body            String?
  mediaUrl        String?          @map("media_url")
  mediaId         String?          @map("media_id")   // media_id de Meta
  templateName    String?          @map("template_name")
  status          MessageStatus?   // solo para outbound
  sentAt          DateTime?        @map("sent_at")
  deliveredAt     DateTime?        @map("delivered_at")
  readAt          DateTime?        @map("read_at")
  failedReason    String?          @map("failed_reason")
  createdAt       DateTime         @default(now()) @map("created_at")

  conversation Conversation @relation(fields: [conversationId], references: [id])

  @@index([conversationId])
  @@index([externalId])
  @@index([createdAt])
  @@map("messages")
}

// Idempotencia de webhooks de Meta
model WebhookEvent {
  id              String    @id @default(uuid())
  source          String    // 'meta', 'instagram'
  externalEventId String    @unique @map("external_event_id")  // ID de Meta
  eventType       String    @map("event_type")  // 'message', 'status'
  payload         Json
  processedAt     DateTime? @map("processed_at")
  receivedAt      DateTime  @default(now()) @map("received_at")

  @@index([processedAt])
  @@map("webhook_events")
}
```

### Broadcasts — Difusiones y plantillas

```prisma
// ─────────────────────────────────────────
//  BROADCASTS
// ─────────────────────────────────────────

enum BroadcastStatus {
  draft
  scheduled
  sending
  sent
  failed
  cancelled
}

model Broadcast {
  id            String          @id @default(uuid())
  name          String
  channelId     String          @map("channel_id")  // desde qué número se envía
  templateName  String          @map("template_name")
  templateLang  String          @default("es") @map("template_lang")
  variables     Json?           // variables para el template
  status        BroadcastStatus @default(draft)
  scheduledAt   DateTime?       @map("scheduled_at")
  startedAt     DateTime?       @map("started_at")
  completedAt   DateTime?       @map("completed_at")
  totalCount    Int             @default(0) @map("total_count")
  sentCount     Int             @default(0) @map("sent_count")
  deliveredCount Int            @default(0) @map("delivered_count")
  readCount     Int             @default(0) @map("read_count")
  respondedCount Int            @default(0) @map("responded_count")
  failedCount   Int             @default(0) @map("failed_count")
  costUsd       Decimal?        @map("cost_usd")
  createdBy     String          @map("created_by")  // userId
  createdAt     DateTime        @default(now()) @map("created_at")
  updatedAt     DateTime        @updatedAt @map("updated_at")

  channel    Channel              @relation(fields: [channelId], references: [id])
  recipients BroadcastRecipient[]

  @@index([status])
  @@index([channelId])
  @@map("broadcasts")
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

model BroadcastRecipient {
  id                String          @id @default(uuid())
  broadcastId       String          @map("broadcast_id")
  clientId          String          @map("client_id")
  phoneNormalized   String          @map("phone_normalized")
  externalMessageId String?         @unique @map("external_message_id")  // wamid
  status            RecipientStatus @default(queued)
  sentAt            DateTime?       @map("sent_at")
  deliveredAt       DateTime?       @map("delivered_at")
  readAt            DateTime?       @map("read_at")
  respondedAt       DateTime?       @map("responded_at")
  failedReason      String?         @map("failed_reason")
  costUsd           Decimal?        @map("cost_usd")

  broadcast Broadcast @relation(fields: [broadcastId], references: [id])
  client    Client    @relation(fields: [clientId], references: [id])

  @@unique([broadcastId, clientId])
  @@index([broadcastId])
  @@index([status])
  @@map("broadcast_recipients")
}
```

### Analytics y auditoría

```prisma
// ─────────────────────────────────────────
//  ANALYTICS Y AUDITORÍA
// ─────────────────────────────────────────

// Eventos atómicos para analytics (append-only)
model AnalyticsEvent {
  id          String   @id @default(uuid())
  eventType   String   @map("event_type")  // 'message_sent', 'client_created', etc.
  advisorId   String?  @map("advisor_id")
  channelId   String?  @map("channel_id")
  clientId    String?  @map("client_id")
  metadata    Json?
  occurredAt  DateTime @default(now()) @map("occurred_at")

  @@index([eventType])
  @@index([advisorId])
  @@index([occurredAt])
  @@map("analytics_events")
}

// Snapshots diarios pre-calculados para no recalcular en cada request
model DailyMetric {
  id          String   @id @default(uuid())
  date        DateTime @db.Date
  advisorId   String?  @map("advisor_id")
  channelId   String?  @map("channel_id")
  metricKey   String   @map("metric_key")  // 'messages_sent', 'clients_added', etc.
  value       Int
  createdAt   DateTime @default(now()) @map("created_at")

  @@unique([date, advisorId, channelId, metricKey])
  @@index([date])
  @@map("daily_metrics")
}

model AuditLog {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  action      String   // 'client.created', 'broadcast.sent', etc.
  entityType  String?  @map("entity_type")
  entityId    String?  @map("entity_id")
  oldValue    Json?    @map("old_value")
  newValue    Json?    @map("new_value")
  ip          String?
  createdAt   DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## Schema completo — `lid_postsale`

```prisma
// prisma/postsale.schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("POSTSALE_DATABASE_URL")
}

// ─────────────────────────────────────────
//  SECUENCIAS DE POSTVENTA
// ─────────────────────────────────────────

enum TriggerType {
  purchase_confirmed    // compra confirmada por integration service
  manual               // disparada manualmente por una asesora
  anniversary          // aniversario de la compra (30d, 90d, 1y)
}

model Sequence {
  id          String       @id @default(uuid())
  name        String
  description String?
  triggerType TriggerType  @map("trigger_type")
  clientTypes String[]     @map("client_types")  // a qué tipos de cliente aplica
  active      Boolean      @default(true)
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  steps      SequenceStep[]
  executions SequenceExecution[]

  @@map("sequences")
}

model SequenceStep {
  id            String   @id @default(uuid())
  sequenceId    String   @map("sequence_id")
  order         Int      // 1, 2, 3...
  delayHours    Int      @map("delay_hours")  // horas desde el step anterior (o trigger)
  templateName  String   @map("template_name")
  variables     Json?    // variables estáticas para el template
  createdAt     DateTime @default(now()) @map("created_at")

  sequence Sequence @relation(fields: [sequenceId], references: [id])

  @@index([sequenceId])
  @@map("sequence_steps")
}

enum ExecutionStatus {
  running
  paused      // el cliente respondió → puede pausar la secuencia
  completed
  cancelled
  failed
}

model SequenceExecution {
  id            String          @id @default(uuid())
  sequenceId    String          @map("sequence_id")
  clientId      String          @map("client_id")  // FK lógica a lid_main.clients
  channelId     String          @map("channel_id")
  status        ExecutionStatus @default(running)
  currentStep   Int             @default(0) @map("current_step")
  triggeredBy   TriggerType     @map("triggered_by")
  startedAt     DateTime        @default(now()) @map("started_at")
  completedAt   DateTime?       @map("completed_at")

  sequence    Sequence @relation(fields: [sequenceId], references: [id])
  stepResults StepResult[]

  @@index([sequenceId])
  @@index([clientId])
  @@index([status])
  @@map("sequence_executions")
}

enum StepResultStatus {
  pending
  sent
  delivered
  read
  responded
  failed
  skipped
}

model StepResult {
  id              String          @id @default(uuid())
  executionId     String          @map("execution_id")
  stepOrder       Int             @map("step_order")
  status          StepResultStatus @default(pending)
  scheduledAt     DateTime        @map("scheduled_at")
  sentAt          DateTime?       @map("sent_at")
  externalId      String?         @map("external_id")  // wamid de Meta
  failedReason    String?         @map("failed_reason")

  execution SequenceExecution @relation(fields: [executionId], references: [id])

  @@index([executionId])
  @@index([scheduledAt])
  @@map("step_results")
}
```

---

## Migrations — orden de ejecución

```bash
# 1. Crear Prisma client para lid_main
cd apps/backend
npx prisma migrate dev --name init --schema prisma/schema.prisma

# 2. Crear Prisma client para lid_postsale
npx prisma migrate dev --name init --schema prisma/postsale.schema.prisma

# 3. Seed inicial (usuarios, asesoras, canales)
npx prisma db seed
```

---

## Seed inicial

```typescript
// prisma/seed.ts
async function main() {
  // 1. Super admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lainternacional.com.ar',
      name: 'Admin',
      passwordHash: await bcrypt.hash('CAMBIAR_EN_PRODUCCION', 12),
      role: 'super_admin',
      avatarColor: '#0F172A',
    },
  });

  // 2. Asesoras (una por una, con su User + Advisor)
  const asesoras = [
    { email: 'sofia@lainternacional.com.ar', name: 'Sofía', color: '#7C3AED', types: ['A', 'mayorista'] },
    { email: 'carla@lainternacional.com.ar', name: 'Carla', color: '#2563EB', types: ['B', 'minorista'] },
    { email: 'julia@lainternacional.com.ar', name: 'Julia', color: '#0EA5E9', types: ['C'] },
    { email: 'lu@lainternacional.com.ar',   name: 'Lu',    color: '#EC4899', types: ['A', 'B'] },
    { email: 'mica@lainternacional.com.ar', name: 'Mica',  color: '#10B981', types: ['C', 'minorista'] },
  ];

  for (const a of asesoras) {
    const user = await prisma.user.create({
      data: {
        email: a.email,
        name: a.name,
        passwordHash: await bcrypt.hash('CAMBIAR_EN_PRODUCCION', 12),
        role: 'advisor',
        avatarColor: a.color,
      },
    });
    await prisma.advisor.create({
      data: {
        userId: user.id,
        name: a.name,
        color: a.color,
        clientTypes: a.types as any,
      },
    });
  }

  // 3. Canales WhatsApp (se actualizan con los IDs reales de Meta)
  const canales = [
    { name: 'WhatsApp Ventas 1', type: 'whatsapp_cloud', identifier: 'PHONE_NUMBER_ID_1', phoneNumber: '+5493511111111' },
    { name: 'WhatsApp Ventas 2', type: 'whatsapp_cloud', identifier: 'PHONE_NUMBER_ID_2', phoneNumber: '+5493512222222' },
    { name: 'WhatsApp Ventas 3', type: 'whatsapp_cloud', identifier: 'PHONE_NUMBER_ID_3', phoneNumber: '+5493513333333' },
    { name: 'WhatsApp Ventas 4', type: 'whatsapp_cloud', identifier: 'PHONE_NUMBER_ID_4', phoneNumber: '+5493514444444' },
    { name: 'WhatsApp Ventas 5', type: 'whatsapp_cloud', identifier: 'PHONE_NUMBER_ID_5', phoneNumber: '+5493515555555' },
  ];

  for (const c of canales) {
    await prisma.channel.create({ data: c as any });
  }
}
```

---

## Índices críticos para performance

```sql
-- Búsqueda de clientes por teléfono (muy frecuente)
CREATE INDEX idx_clients_phone_normalized ON clients(phone_normalized);

-- Conversaciones por advisor (vista de asesora)
CREATE INDEX idx_conversations_advisor_state ON conversations(advisor_id, state);

-- Mensajes por conversación ordenados por tiempo
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC);

-- Broadcast recipients pendientes (worker los consume)
CREATE INDEX idx_broadcast_recipients_status ON broadcast_recipients(status) WHERE status = 'queued';

-- Analytics por período
CREATE INDEX idx_analytics_occurred_at ON analytics_events(occurred_at DESC);
CREATE INDEX idx_daily_metrics_date_advisor ON daily_metrics(date, advisor_id);
```
