# CRM La Internacional — Contexto del Sistema

## Qué es este proyecto

CRM paralelo desarrollado para La Internacional Distribuidora, una empresa de distribución de productos de cosmética y estética. El sistema reemplaza procesos manuales de seguimiento de clientes y comunicación por WhatsApp con una plataforma centralizada, sin abandonar el sistema propietario existente que la empresa ya usa.

**El objetivo principal:** que las asesoras puedan gestionar clientes, enviar difusiones de WhatsApp, y hacer seguimiento postventa desde un solo lugar, con visibilidad total para el admin.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Vite 6 + React 18 + Ionic 8 + Zustand + TypeScript |
| Backend | NestJS 10 (monorepo con 1 gateway + 7 microservicios) |
| Base de datos | PostgreSQL vía Prisma 5 |
| Mensajería | WhatsApp Cloud API (Meta) |
| Deploy destino | Railway |
| Proxy API (dev) | Vite dev server con plugins custom |

---

## Monorepo — estructura

```
La-Internacional/
├── apps/
│   ├── frontend/          # Vite + React + Ionic
│   └── backend/           # NestJS monorepo
│       ├── services/
│       │   ├── gateway/         :8080
│       │   ├── auth/            :3001
│       │   ├── crm-core/        :3002
│       │   ├── messaging/       :3003
│       │   ├── broadcasts/      :3004
│       │   ├── postsale/        :3005
│       │   ├── analytics/       :3006
│       │   └── integration/     :3007
│       └── libs/
│           └── common/          # HealthModule compartido
└── Documentacion/               # Docs técnicas detalladas por área
```

---

## Estado actual del desarrollo

### Frontend
**Estado: funcional en modo mock.** Todas las páginas existen y son navegables. Los datos viven en `localStorage` via Zustand (sin backend real). La integración con la API de Meta está completamente operativa: templates, envío de mensajes, subida de imágenes, pricing.

### Backend
**Estado: skeleton.** El gateway levanta en `:8080` y responde `/health`. El único servicio con lógica real es `broadcasts-service` (CRUD de templates Meta). El resto de los servicios tienen estructura NestJS pero sin endpoints de negocio implementados.

---

## Frontend — detalle

### Rutas y páginas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/login` | `LoginPage` | Auth mock con emails de seed |
| `/inbox` | `InboxPage` | Bandeja unificada WhatsApp + Instagram |
| `/conversations/:id` | `ConversationPage` | Chat 1:1 con cliente |
| `/clients` | `ClientsPage` | Lista con búsqueda y filtros |
| `/clients/new` | `ClientNewPage` | Alta de cliente |
| `/clients/import` | `ClientImportPage` | Import CSV con detección de duplicados |
| `/clients/:id` | `ClientDetailPage` | Perfil, tags, historial de estado |
| `/broadcasts` | `BroadcastsPage` | Historial de difusiones (solo admin) |
| `/broadcasts/new` | `BroadcastNewPage` | Crear y enviar difusión en 3 pasos |
| `/templates` | `TemplatesPage` | Plantillas Meta con filtros por categoría, estado y uso |
| `/templates/new` | `TemplateNewPage` | Crear plantilla con preview live |
| `/templates/:id` | `TemplateDetailPage` | Detalle, estado Meta, eliminar |
| `/postsale` | `PostsalePage` | Secuencias automáticas de postventa |
| `/analytics` | `AnalyticsPage` | Dashboards (solo admin) |
| `/settings` | `SettingsPage` | Credenciales Meta, precios, usuarios |

### Stores Zustand (todos persisten en localStorage)

| Store | Key localStorage | Qué guarda |
|-------|-----------------|-----------|
| `users.store` | `lid-users-store` | Usuarios del sistema (admin + 5 asesoras, con seed) |
| `crm.store` | `lid-crm-store` | Clientes y asesoras |
| `pricing.store` | `lid-pricing-store` | Tarifas Meta en ARS, tipo de cambio USD→ARS |
| `audit.store` | `lid-audit-store` | Quién creó cada template, registro de difusiones |
| `dev-credentials.store` | `lid-dev-credentials` | Token Meta override para dev/testing |
| `template-meta.store` | `lid-template-meta` | Clasificación de templates: difusión / postventa / ambas |
| `sequences.store` | `lid-sequences-store` | Secuencias automáticas de postventa |

### Servicios HTTP (frontend → Meta vía proxy Vite)

**`templates.service.ts`** — CRUD de plantillas contra Meta Graph API
- `list()` → `GET /api/meta/{WABA_ID}/message_templates`
- `get(id)` → `GET /api/meta/{WABA_ID}/message_templates/{id}`
- `create(input)` → `POST /api/meta/{WABA_ID}/message_templates`
- `remove(name)` → `DELETE /api/meta/{WABA_ID}/message_templates?name=...`
- `uploadHeaderMedia(file)` → `POST /api/upload-header` (plugin Vite, Resumable Upload API)

**`messages.service.ts`** — Envío de mensajes con template
- `sendTemplate(input)` → `POST /api/meta/{PHONE_NUMBER_ID}/messages`
- `resendHeaderMedia(url)` → `POST /api/resend-media` (plugin Vite, descarga + re-sube imagen)

**`pricing.service.ts`** — Tarifas reales de Meta
- `fetchMetaPricing(days)` → `GET /api/meta/{WABA_ID}?fields=pricing_analytics...`

### Modelo de datos principal

**Cliente:**
```
id, name, phone (E.164 +549...), type (Cosmetóloga | Esteticista | Dermatóloga | Revendedora),
advisorId, tags[], city?, state, lastContact?, createdAt
```

**Estados del cliente:** `Recibido → En validación → Presupuestando → Sin comprobante → Agendado → Comprado`

**Asignación:** cada tipo de cliente tiene una asesora fija. Al importar/crear un cliente, se asigna automáticamente según su tipo.

**Template (Meta):**
```
id, name, category (MARKETING | UTILITY | AUTHENTICATION), language, status, components[]
```

**Clasificación local de templates:**
```
use: 'broadcast' | 'postsale' | 'ambas'   (guardado en template-meta.store, no en Meta)
```

**Secuencia de postventa:**
```
id, name, trigger (post_purchase | inactivity | birthday | custom_days + días),
templateName, active, createdByUserId, advisorId?, restrictToType?, sentThisMonth
```

---

## Integración Meta (WhatsApp Cloud API)

### Credenciales configuradas

| Credencial | Valor | Dónde vive |
|-----------|-------|-----------|
| WABA ID | `1894314254553697` | `VITE_META_WABA_ID` en `.env.local` |
| Phone Number ID | `1127647270424016` | `VITE_META_PHONE_NUMBER_ID` + `META_PHONE_NUMBER_ID` |
| Access Token | `EAAfuNRE...` | `META_ACCESS_TOKEN` en `.env.local` (no expuesto al browser) |
| Test phone | `543516720095` (`+54 351 672 0095`) | `VITE_META_TEST_PHONE` |

> **Importante:** el token de acceso de Meta expira periódicamente. Si las llamadas empiezan a fallar con 401, hay que renovarlo en Meta for Developers y actualizar `META_ACCESS_TOKEN` en `apps/frontend/.env.local`.

### Proxy Vite (desarrollo)

El frontend no llama directamente a `graph.facebook.com`. Todo pasa por el dev server de Vite:

```
Browser → /api/meta/* → Vite proxy → graph.facebook.com/{version}/*
                      ↗ inyecta Authorization: Bearer {token}
```

**Resolución del token:**
1. Si el usuario cargó un token en Settings → Credenciales, se manda como header `x-lid-meta-token`
2. El proxy lo lee y lo usa como Bearer token
3. Si no hay override, usa `META_ACCESS_TOKEN` del `.env.local`

**Plugins custom de Vite:**
- `metaResendMediaPlugin` → `/api/resend-media`: descarga una imagen desde Meta y la re-sube al endpoint `/media` del phone number, devolviendo un `media_id` estable para usar en envíos
- `metaUploadHeaderPlugin` → `/api/upload-header`: Resumable Upload API para imágenes de header de plantillas

### Formato de números de teléfono

- **Almacenamiento en CRM:** E.164 con 9 de móvil argentino → `+5493516720095`
- **Envío a Meta:** se stripea el `+` → `5493516720095`
- **Número de test:** registrado en Meta sin el 9 → `543516720095`
- **Meta sandbox:** solo acepta números explícitamente agregados en Meta for Developers → API Setup → Manage phone number list

### Templates disponibles (cuenta actual)

| Nombre | Estado | Tipo header | Variables |
|--------|--------|-------------|-----------|
| `prueba_imagen` | APPROVED | IMAGE | `{{1}}` nombre, `{{2}}` producto |
| `plantilla_de_testeo` | APPROVED | IMAGE | Ninguna |
| `hello_world` | APPROVED | TEXT | Ninguna |

---

## Módulo de difusiones

Flujo en 3 pasos desde `/broadcasts/new`:

1. **Segmento:** seleccioná tipo de cliente (Cosmetóloga, Esteticista, etc.) → auto-asigna asesora → muestra cantidad de matching
2. **Plantilla:** elegí una template APPROVED. Filtrable por uso = 'broadcast' o 'ambas'
3. **Confirmación:** modo test (todos los envíos van al número de test) o real, preview del mensaje, botón enviar con progreso en tiempo real

**Límite de seguridad:** máximo 20 envíos por ejecución (`MAX_SENDS_PER_RUN`).

**Variables automáticas por cliente:** `{{1}}` → nombre, `{{2}}` → tipo, `{{3}}` → ciudad.

**Header con imagen:** si la template tiene imagen, se re-sube primero via `/api/resend-media` para obtener un `media_id` estable, y se reutiliza en todo el batch.

---

## Módulo de postventa

El módulo usa **WhatsApp Cloud API oficial** (no Baileys/unofficial). Cada secuencia se dispara manualmente desde la UI por ahora.

### Secuencias disponibles

| Trigger | Criterio de clientes |
|---------|---------------------|
| `post_purchase` | Clientes con estado `Comprado` |
| `inactivity` | Clientes que no compraron y fueron captados hace más de X días |
| `birthday` | Todos los clientes (no hay campo de cumpleaños en el modelo actual) |
| `custom_days` | Clientes captados hace X días o más |

### Flujo de ejecución ("Enviar ahora")

1. Se abre `PostsaleRunModal` con la secuencia seleccionada
2. Carga la template de Meta en tiempo real
3. Filtra clientes según trigger + tipo opcional + asesora
4. Modo test disponible (manda todo al número de test)
5. Si la template tiene imagen → re-sube via resend-media
6. Envía mensaje por mensaje con progreso visible
7. Al terminar, incrementa el contador `sentThisMonth` de la secuencia

### Clasificación de templates para postventa

Al crear una template en `/templates/new`, se elige el uso:
- **Difusión:** aparece solo en `/broadcasts/new`
- **Post-Venta:** aparece solo en secuencias de postventa
- **Ambas:** aparece en ambos flujos

Esta clasificación es **local** (no se envía a Meta), guardada en `template-meta.store`.

---

## Backend — detalle de servicios

### Gateway (`:8080`)

Punto de entrada único. Valida JWT, enruta al servicio correcto, inyecta headers de identidad:
```
x-user-id, x-user-email, x-user-role, x-advisor-id, x-request-id
```

### Auth service (`:3001`)

Login email/password, generación de JWT, gestión de usuarios y roles (admin / advisor).

### CRM Core (`:3002`)

CRUD de clientes con validación anti-duplicado por teléfono (E.164). Asignación automática a asesoras por tipo. Tags y segmentación.

### Messaging service (`:3003`)

Bandeja unificada WhatsApp + Instagram. Historial de conversaciones 1:1. Estados de chat.

### Broadcasts service (`:3004`)

Gestión de plantillas Meta y envíos masivos. **Único servicio con lógica implementada** además del gateway:
- `GET /api/v1/templates` — lista
- `POST /api/v1/templates` — crea y manda a Meta
- `DELETE /api/v1/templates?name=...` — elimina

### Postsale service (`:3005`)

Postventa oficial via Cloud API. Base de datos **aislada** (`lid_postsale`) por separación de responsabilidades. Gestión de secuencias automáticas.

### Analytics service (`:3006`)

Embudos de conversión, tasas por estado del cliente, costo por difusión y costo por estado.

### Integration service (`:3007`)

Adapter REST al sistema propietario actual. Sincronización bidireccional, cruce de comprobantes. Cuando `EXTERNAL_SYSTEM_MOCK=true` devuelve datos ficticios.

---

## Variables de entorno

### Frontend (`apps/frontend/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=CRM La Internacional
VITE_POLL_INBOX_MS=15000
VITE_POLL_NOTIFICATIONS_MS=30000
VITE_POLL_CHAT_MS=5000
VITE_USE_MOCKS=true
VITE_META_WABA_ID=1894314254553697
VITE_META_PHONE_NUMBER_ID=1127647270424016
VITE_META_TEST_PHONE=543516720095
META_ACCESS_TOKEN=<token Meta — no tiene prefijo VITE_ para no exponerse al browser>
META_PHONE_NUMBER_ID=1127647270424016
```

### Backend (`apps/backend/.env`)

```env
NODE_ENV=development
GATEWAY_PORT=8080
# ... puertos de cada servicio (3001–3007)
DATABASE_URL=postgresql://...
POSTSALE_DATABASE_URL=postgresql://...
JWT_SECRET=...
META_PHONE_NUMBER_ID=1127647270424016
META_BUSINESS_ACCOUNT_ID=1894314254553697
META_ACCESS_TOKEN=<mismo token>
```

---

## Comandos de desarrollo

```bash
# Instalar todo
npm install                        # frontend (workspace raíz)
npm --prefix apps/backend install  # backend

# Levantar
npm run dev              # frontend en :5173
npm run dev:be:gateway   # gateway NestJS en :8080

# Instalar NestJS CLI (una sola vez)
npm install -g @nestjs/cli
```

---

## Usuarios seed (login)

| Email | Rol | Asesora | Tipos atendidos |
|-------|-----|---------|----------------|
| `admin@lid.com` | admin | — | Todos |
| `sofia@lid.com` | advisor | Sofía | Cosmetóloga |
| `carla@lid.com` | advisor | Carla | Esteticista |
| `julia@lid.com` | advisor | Julia | Dermatóloga |
| `lu@lid.com` | advisor | Lu | Revendedora |
| `mica@lid.com` | advisor | Mica | — |

> Cualquier contraseña funciona en modo mock.

---

## Documentación técnica detallada

La carpeta `Documentacion/` tiene la especificación completa por área:

| Archivo | Contenido |
|---------|-----------|
| `01-Arquitectura.md` | Diagrama general, topología Railway, decisiones de diseño |
| `02-Backend.md` | Spec completa de los 8 servicios NestJS |
| `03-Frontend.md` | Estructura, componentes, stores, flujos de UI |
| `04-Base-de-Datos.md` | Esquemas Prisma de cada servicio |
| `05-Requerimientos-Tecnicos.md` | Checklist de implementación pendiente |
| `LID - Requerimientos.md` | Requisitos de negocio originales |
