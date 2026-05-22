# 02 — Arquitectura objetivo

## Visión general

```
                        INTERNET
                           │
                    ┌──────▼──────┐
                    │   Nginx     │  (Railway — Frontend service)
                    │  :443/80    │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
        /index.html               /api/* (proxy)
              │                         │
     ┌────────▼────────┐      ┌─────────▼─────────┐
     │  React SPA      │      │    API Gateway     │  Puerto 8080
     │  Vite + Ionic   │      │    (NestJS)        │
     └────────┬────────┘      └──────┬─────────────┘
              │  SSE / REST          │
              └──────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────────┐
              │                      │                           │
    ┌─────────▼──────┐   ┌──────────▼──────┐   ┌──────────────▼───────┐
    │  Auth Service  │   │  CRM Core        │   │  Messaging Service   │
    │  Puerto 3001   │   │  Puerto 3002     │   │  Puerto 3003         │
    │  JWT, bcrypt   │   │  Clientes, oport.│   │  Conversaciones,     │
    │  roles, users  │   │  asesoras        │   │  mensajes, historial │
    └────────────────┘   └────────┬─────────┘   └──────────────────────┘
                                  │
              ┌───────────────────┼────────────────────────────┐
              │                   │                            │
    ┌─────────▼──────┐  ┌────────▼──────────┐  ┌────────────▼──────────┐
    │  Broadcasts    │  │  Postsale Service  │  │  Analytics Service    │
    │  Puerto 3004   │  │  Puerto 3005       │  │  Puerto 3006          │
    │  Difusiones,   │  │  Secuencias auto   │  │  Métricas, reportes   │
    │  templates,    │  │  postventa         │  │  por asesora/canal    │
    │  scheduling    │  │  scheduling        │  │                       │
    └────────────────┘  └────────────────────┘  └───────────────────────┘
              │
    ┌─────────▼──────┐
    │  Integration   │
    │  Puerto 3007   │
    │  Sistema       │
    │  legacy        │
    └────────────────┘

                    ┌───────────────────────────────┐
                    │         PostgreSQL 16          │
                    │   DB: lid_main                 │
                    │   DB: lid_postsale             │
                    │   (Railway managed)            │
                    └───────────────────────────────┘

                    ┌───────────────────────────────┐
                    │         Redis                  │
                    │   Queues (BullMQ)              │
                    │   Cache                        │
                    │   Sessions                     │
                    └───────────────────────────────┘

                    ┌───────────────────────────────┐
                    │      Meta Graph API            │
                    │   WhatsApp Cloud API v25.0     │
                    │   1 WABA, 4-5 Phone Numbers    │
                    └───────────────────────────────┘
```

---

## Principios de la arquitectura objetivo

### 1. Gateway como único punto público
El Gateway es el único servicio expuesto a internet. Todos los demás servicios son internos en la red de Railway (`*.railway.internal`). El Gateway:
- Valida JWT en cada request antes de forward
- Hace proxy hacia el servicio correcto según el path
- Maneja rate limiting global
- Recibe webhooks de Meta
- Emite SSE al frontend

### 2. Cada microservicio con su propia responsabilidad
Ningún servicio llama directamente a la BD de otro. Si Messaging necesita datos de un cliente, llama a CRM Core por HTTP interno, no accede a su BD directamente.

### 3. Comunicación interna síncrona (HTTP) + asíncrona (Redis/BullMQ)
- **HTTP interno:** Cuando necesitás la respuesta inmediata (resolver un cliente, verificar un usuario)
- **Colas BullMQ:** Para todo lo que puede procesarse después (envío de difusiones, secuencias postventa, analytics events)

### 4. Un Redis compartido para colas y cache
Todos los servicios acceden al mismo Redis. Los jobs de BullMQ tienen nombres de queue diferenciados por servicio:
```
queue:broadcasts:send
queue:postsale:sequence
queue:messaging:inbound
queue:analytics:event
```

### 5. Autenticación centralizada en Auth Service
El Gateway valida el JWT y hace forward del user context (userId, role, advisorId) como headers internos a cada servicio. Los servicios confían en esos headers — no vuelven a consultar la BD de usuarios en cada request.

---

## Roles del sistema

```
┌─────────────────────────────────────────────────┐
│  super_admin                                    │
│  - Gestión de usuarios y roles                  │
│  - Configuración de canales WhatsApp            │
│  - Configuración del sistema                    │
│  - Todo lo de admin                             │
└─────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────┐
│  admin / supervisor                             │
│  - Ve todos los clientes y conversaciones       │
│  - Crea y gestiona difusiones                   │
│  - Ve analytics de todo el equipo               │
│  - Configura secuencias postventa               │
│  - Reasigna clientes entre asesoras             │
│  - Gestiona plantillas Meta                     │
└─────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────┐
│  advisor (asesora)                              │
│  - Ve solo sus clientes asignados               │
│  - Ve solo sus conversaciones                   │
│  - Puede enviar mensajes y templates            │
│  - Ve sus propias métricas                      │
│  - No puede crear difusiones masivas            │
│  - No ve datos de otras asesoras               │
└─────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────┐
│  postsale (rol futuro)                          │
│  - Vista específica de postventa                │
│  - Gestiona secuencias de seguimiento           │
│  - Ve historial post-compra de clientes         │
└─────────────────────────────────────────────────┘
```

---

## Flujo de datos principal

### Mensaje entrante de WhatsApp
```
Meta → POST /webhooks/meta
  → Gateway valida HMAC (X-Hub-Signature-256)
  → Gateway identifica phoneNumberId → busca Channel en BD
  → Gateway publica en queue: messaging:inbound
  → Messaging Service consume queue:
      → Busca o crea Client por teléfono
      → Busca o crea Conversation (client + channel)
      → Persiste Message en BD
      → Publica evento SSE al frontend
  → Frontend actualiza conversación en tiempo real
```

### Difusión masiva
```
Admin crea Broadcast → POST /api/broadcasts
  → Broadcasts Service crea registro en BD
  → Valida lista de destinatarios
  → Crea BroadcastRecipients (status: queued)
  → Encola jobs en BullMQ (queue:broadcasts:send)
  → Worker procesa jobs:
      → Para cada recipient: POST Meta API /messages (template)
      → Actualiza status: sent
  → Webhook Meta entrega status updates:
      → Gateway → queue:messaging:inbound (type: status)
      → Messaging actualiza: delivered / read / responded
```

### Secuencia postventa
```
Compra confirmada (evento de Integration Service)
  → Postsale Service recibe evento
  → Busca secuencia configurada para el tipo de cliente
  → Crea SequenceExecution en BD
  → Encola jobs escalonados en BullMQ con delay:
      → +24h: mensaje 1
      → +72h: mensaje 2
      → +7d: mensaje 3
  → Workers envían mensajes en tiempo y forma
  → Trackea respuestas para cortar secuencia si el cliente responde
```

---

## Stack objetivo completo

| Componente | Tecnología | Por qué |
|-----------|-----------|---------|
| Frontend | React + Vite + Ionic | Ya está, continuar |
| Backend | NestJS monorepo | Ya está, expandir |
| ORM | Prisma | Type-safe, migrations, relaciones |
| BD principal | PostgreSQL 16 | Ya está en Railway |
| Cache + Queues | Redis (Railway) | BullMQ, sessions, pub/sub |
| Auth | JWT + bcrypt | Estándar, stateless |
| Process manager | PM2 (Railway) | Ya está configurado |
| Web server | Nginx | Ya está configurado |
| Deploy | Railway | Ya está |
| Meta API | WhatsApp Cloud API v25.0 | Ya integrada |
| Monitoring | Logs estructurados (pino) | A implementar |

---

## Cambios de infraestructura a hacer en Railway

### Agregar Redis
Railway tiene Redis como servicio nativo. Se agrega un servicio Redis al proyecto, y todos los backends reciben `REDIS_URL` como variable de entorno.

### Variables de entorno por servicio
Hoy todos los servicios comparten las mismas env vars en Railway. Para producción cada servicio debería tener solo las vars que necesita:

```
Gateway:        JWT_SECRET, META_*, REDIS_URL, internal URLs
Auth:           JWT_SECRET, DATABASE_URL, REDIS_URL, bcrypt rounds
CRM Core:       DATABASE_URL, JWT_SECRET (para validar context headers)
Messaging:      DATABASE_URL, REDIS_URL, META_*
Broadcasts:     DATABASE_URL, REDIS_URL, META_*
Postsale:       POSTSALE_DATABASE_URL, REDIS_URL, META_*
Analytics:      DATABASE_URL, REDIS_URL
Integration:    DATABASE_URL, EXTERNAL_SYSTEM_*
```

### Separar builds en Railway
Actualmente hay un solo Dockerfile.backend que construye los 8 servicios juntos y PM2 los levanta todos. Para Railway esto está bien por ahora — el costo de separar en 8 servicios Railway independientes no vale la pena en esta etapa. Se mantiene el enfoque actual: un servicio Railway con PM2.
