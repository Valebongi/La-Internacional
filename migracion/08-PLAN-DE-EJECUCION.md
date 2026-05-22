# 08 — Plan de ejecución

## Criterio de priorización

Un bloque no empieza hasta que sus dependencias están terminadas y testeadas. El orden respeta dependencias duras (no se puede implementar messaging sin BD, no se puede implementar auth sin BD, etc.).

---

## FASE 1 — Cimientos (bloqueante para todo lo demás)
**Objetivo:** Sistema con BD real, auth funcional, y el primer microservicio productivo.

### Bloque 1.1 — Base de datos
**Dependencias:** Ninguna  
**Quién lo hace:** Backend

```
[ ] Instalar Prisma en apps/backend: npm install @prisma/client prisma
[ ] Crear prisma/schema.prisma con todos los modelos del doc 03
[ ] npx prisma migrate dev --name init
[ ] Crear prisma/seed.ts con usuarios y canales iniciales
[ ] npx prisma db seed
[ ] Verificar que las tablas se crean correctamente en Railway
[ ] Agregar PrismaService a libs/common para compartir entre servicios
```

**Resultado esperado:** PostgreSQL con todas las tablas creadas y seed de usuarios/asesoras/canales.

---

### Bloque 1.2 — Auth Service real
**Dependencias:** 1.1 (BD)  
**Quién lo hace:** Backend

```
[ ] Instalar: @nestjs/jwt, @nestjs/passport, passport-jwt, bcrypt, @types/bcrypt
[ ] Implementar auth/src/auth/auth.service.ts:
    [ ] login(email, password) → { accessToken, refreshToken, user }
    [ ] refresh(refreshToken) → { accessToken, refreshToken }
    [ ] logout(sessionId) → void
[ ] Implementar auth/src/users/users.service.ts:
    [ ] findAll() — solo para admin
    [ ] create(dto)
    [ ] update(id, dto)
    [ ] resetPassword(id)
[ ] Implementar auth/src/auth/auth.controller.ts:
    [ ] POST /auth/login
    [ ] POST /auth/refresh
    [ ] POST /auth/logout
    [ ] GET /auth/me
    [ ] PUT /auth/me/password
[ ] Agregar JwtModule a auth/src/auth/auth.module.ts
[ ] Tests unitarios: login con credenciales correctas, login con credenciales incorrectas
```

**Resultado esperado:** Login funciona con email + contraseña reales. JWT válido. Refresh token en cookie httpOnly.

---

### Bloque 1.3 — Gateway: JWT guard + proxy
**Dependencias:** 1.2 (Auth Service)  
**Quién lo hace:** Backend

```
[ ] Implementar gateway/src/guards/jwt.guard.ts:
    [ ] Extraer token del header Authorization
    [ ] Verificar con JWT_SECRET
    [ ] Inyectar x-user-id, x-user-role, x-advisor-id en headers
[ ] Implementar gateway/src/proxy/proxy.service.ts:
    [ ] Forward HTTP a cada servicio interno
    [ ] Propagar headers de contexto
    [ ] Propagar headers de autenticación
[ ] Configurar rutas públicas (whitelist sin JWT):
    [ ] POST /api/auth/login
    [ ] POST /api/auth/refresh
    [ ] GET/POST /webhooks/meta
    [ ] GET /api/config/public
    [ ] GET /health
[ ] Tests de integración: request sin token → 401, request con token válido → pasa
```

**Resultado esperado:** Cualquier request a `/api/*` (excepto auth) requiere JWT válido.

---

### Bloque 1.4 — Frontend: auth real
**Dependencias:** 1.3 (Gateway con JWT)  
**Quién lo hace:** Frontend

```
[ ] Modificar LoginPage.tsx:
    [ ] Cambiar selector de usuario por formulario email + contraseña
    [ ] Agregar campo de contraseña (IonInput type="password")
    [ ] Llamar POST /api/auth/login
[ ] Modificar auth-context.tsx:
    [ ] Reemplazar token mock por accessToken real en memoria (no localStorage)
    [ ] Guardar solo { user } en Zustand (sin token)
    [ ] Implementar refresh automático al recibir 401
[ ] Modificar lib/http.ts:
    [ ] Agregar Authorization header en cada request
    [ ] Interceptor para 401 → refresh → retry
[ ] Eliminar usuarios hardcoded de users.store.ts
[ ] Agregar página /change-password para primer login
[ ] Tests manuales: login correcto, login incorrecto, expiración de token, refresh
```

**Resultado esperado:** Login real. Tokens reales. Sin datos mock en el sistema de auth.

---

## FASE 2 — CRM Core y Messaging
**Objetivo:** Clientes, conversaciones y mensajes en BD real. La funcionalidad más crítica del día a día.

### Bloque 2.1 — CRM Core Service
**Dependencias:** 1.3 (Gateway), 1.1 (BD)

```
[ ] crm-core/src/clients/clients.service.ts:
    [ ] findAll(filters, userContext) — con scoping por rol
    [ ] findById(id, userContext)
    [ ] create(dto, userContext)
    [ ] update(id, dto, userContext)
    [ ] softDelete(id, userContext)
    [ ] importBatch(records) — con validación y deduplicación
    [ ] validatePhones(phones) — normalización E.164
    [ ] reassign(id, newAdvisorId) — solo admin
[ ] crm-core/src/clients/clients.controller.ts:
    [ ] GET /clients
    [ ] POST /clients
    [ ] POST /clients/import
    [ ] POST /clients/validate-phones
    [ ] GET /clients/:id
    [ ] PUT /clients/:id
    [ ] DELETE /clients/:id
    [ ] POST /clients/:id/reassign
[ ] crm-core/src/opportunities/opportunities.service.ts + controller.ts:
    [ ] CRUD completo de oportunidades
    [ ] Scoping por rol (advisor ve solo las suyas)
[ ] crm-core/src/advisors/advisors.service.ts + controller.ts:
    [ ] findAll() — solo admin
    [ ] findById(id)
    [ ] getStats(id, dateRange)
```

---

### Bloque 2.2 — Messaging Service (persistencia)
**Dependencias:** 2.1 (CRM), Bloque 1.1 (BD), Redis

```
[ ] Instalar Redis en Railway (agregar servicio)
[ ] Instalar BullMQ: npm install bullmq @nestjs/bullmq
[ ] Implementar worker meta-inbound.worker.ts:
    [ ] Consumir cola messaging:inbound
    [ ] Resolver canal por phoneNumberId
    [ ] Resolver/crear cliente por teléfono
    [ ] Resolver/crear conversación
    [ ] Persistir mensaje en BD
    [ ] Actualizar lastMessage en conversación
    [ ] Publicar evento a Redis para SSE
[ ] Implementar messaging/src/conversations/conversations.service.ts:
    [ ] findAll(filters, userContext)
    [ ] findById(id, userContext)
    [ ] getMessages(conversationId, pagination)
    [ ] assign(id, advisorId) — solo admin
    [ ] close(id)
[ ] Implementar messaging/src/messages/messages.service.ts:
    [ ] sendText(conversationId, body, userContext)
    [ ] sendTemplate(conversationId, template, variables, userContext)
[ ] Actualizar Gateway webhook para encolar en Redis en vez de emitir SSE directo
[ ] Actualizar Gateway SSE para leer de Redis pub/sub
```

---

### Bloque 2.3 — Frontend: conectar a BD real
**Dependencias:** 2.1, 2.2

```
[ ] crm.store.ts → reemplazar mock data por fetch a /api/crm/clients
[ ] opportunities.store.ts → fetch a /api/crm/opportunities
[ ] inbox.store.ts → SSE real desde /webhooks/meta/stream (que ahora viene de Redis)
[ ] ConversationPage → cargar mensajes desde /api/messaging/conversations/:id/messages
[ ] ClientImportPage → llamar a /api/crm/clients/import
[ ] Eliminar todos los datos seed hardcodeados de los stores
```

---

## FASE 3 — WhatsApp multi-número
**Objetivo:** Sistema funcionando con 4-5 números reales de Meta.

### Bloque 3.1 — Infraestructura Meta
**Dependencias:** 2.2 (Messaging funcionando), 1.1 (BD con tabla channels)

```
[ ] En Meta Business Console:
    [ ] Verificar negocio (documentos AFIP/comerciales)
    [ ] Crear System User "La Internacional CRM Bot"
    [ ] Agregar los números reales uno a uno
    [ ] Obtener Phone Number ID de cada uno
    [ ] Generar token de acceso permanente del System User
    [ ] Registrar webhook: tu-dominio.up.railway.app/webhooks/meta
    [ ] Poner App en modo Live
[ ] Actualizar seed: insertar Phone Number IDs reales en tabla channels
[ ] Eliminar META_PHONE_NUMBER_ID del .env y de env.validator.ts
[ ] Verificar que webhook recibe mensajes de todos los números
```

---

### Bloque 3.2 — Asignación asesoras a canales
**Dependencias:** 3.1

```
[ ] Crear endpoint PUT /settings/channels/:id/advisors (solo super_admin)
[ ] Implementar lógica de getChannelForAdvisor en Messaging Service
[ ] Crear vista en Settings → Canales con selector de asesoras
[ ] Configurar isPrimary para cada asesora
```

---

## FASE 4 — Broadcasts
**Objetivo:** Difusiones masivas reales con tracking completo.

```
[ ] broadcasts/src/broadcasts/broadcasts.service.ts:
    [ ] create(dto) — validar canal, template, lista de destinatarios
    [ ] send(id) — encolar jobs en BullMQ
    [ ] cancel(id)
    [ ] getStats(id)
[ ] Implementar worker send.worker.ts con rate limiting (60 msg/seg)
[ ] Worker para procesar status updates (delivered/read) de Meta
[ ] Frontend: BroadcastNewPage → conectar a API real (hoy es mock)
[ ] Frontend: BroadcastsPage → métricas reales de BD
[ ] Tests: envío a 10 contactos reales, verificar delivery tracking
```

---

## FASE 5 — Postventa y Analytics
**Objetivo:** Secuencias automatizadas y métricas reales.

### Postventa
```
[ ] Implementar CRUD de sequences y steps
[ ] Implementar worker de ejecución de secuencias (con delays)
[ ] Implementar listener para pausar secuencias cuando el cliente responde
[ ] Frontend: PostsalePage → CRUD real de secuencias
[ ] Frontend: toggle activar/desactivar conectado a API
```

### Analytics
```
[ ] Implementar endpoints de métricas con queries a BD
[ ] Implementar cálculo de DailyMetrics (job diario a medianoche)
[ ] Frontend: AnalyticsPage y MyAnalyticsPage con datos reales
[ ] Frontend: Dashboard con KPIs reales
```

---

## FASE 6 — Calidad y producción
**Objetivo:** Sistema robusto, monitoreado, con tests.

```
[ ] Tests unitarios en Auth Service (mínimo: login, refresh, validate)
[ ] Tests de integración en CRM Core (mínimo: CRUD clientes con scoping)
[ ] Tests de integración en Messaging (mínimo: procesar webhook, persistir mensaje)
[ ] Logging estructurado con pino (reemplazar console.log en todos los servicios)
[ ] Centralizar logs en Railway (o agregar servicio de logging)
[ ] Health checks funcionales en todos los servicios
[ ] Alertas: si el webhook de Meta no recibe mensajes en X tiempo → notificar
[ ] Documentación OpenAPI/Swagger en cada servicio
[ ] Review de seguridad: CORS, rate limiting, inputs validation
[ ] Backup automático de PostgreSQL (Railway lo tiene como opción)
[ ] Runbook de operaciones (cómo rotar el token de Meta, cómo agregar un número, etc.)
```

---

## Resumen de fases y duración estimada

| Fase | Qué | Estimación |
|------|-----|-----------|
| **Fase 1** | BD + Auth + Gateway JWT + Frontend auth real | 2-3 semanas |
| **Fase 2** | CRM Core + Messaging + Frontend conectado a BD | 3-4 semanas |
| **Fase 3** | WhatsApp multi-número en Meta + asignaciones | 1-2 semanas |
| **Fase 4** | Broadcasts completos con tracking | 1-2 semanas |
| **Fase 5** | Postventa + Analytics reales | 2-3 semanas |
| **Fase 6** | Tests + Logging + Producción | 1-2 semanas |
| **Total** | | **10-16 semanas** |

Estimaciones para un desarrollador trabajando en el proyecto. Con dos desarrolladores en paralelo (uno frontend, uno backend) se puede reducir a 6-10 semanas.

---

## Reglas para la migración

**No romper el MVP mientras se migra**
- Las fases se desarrollan en ramas de feature
- El MVP en `main` sigue funcionando (con mocks) durante toda la migración
- Cada fase se mergea a `main` solo cuando está completa y probada

**Feature flags para transición gradual**
- `VITE_USE_MOCKS=true` mantiene el comportamiento actual
- Ir cambiando a `false` servicio por servicio a medida que los backends están listos
- Esto permite testear en producción sin tirar el sistema

**Nunca persistir datos reales en el MVP mock**
- Si el usuario importa clientes mientras `VITE_USE_MOCKS=true`, los datos van a localStorage y se perderán
- Comunicar claramente cuándo cada feature está "lista para datos reales"
