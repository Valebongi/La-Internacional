# 01 — Estado actual del sistema

## Radiografía honesta del MVP

### ✅ Lo que funciona de verdad

| Qué | Dónde | Notas |
|-----|-------|-------|
| UI completa (16 páginas) | `apps/frontend/src/pages/` | Todas renderan con datos mock |
| Sistema de permisos (frontend) | `src/lib/permissions.ts` | Funciona, pero sin validación backend |
| Login por selector de email | `LoginPage.tsx` + `auth-context.tsx` | Token es un string base64 falso |
| Webhook Meta — recibir mensajes | `gateway/webhook/meta-webhook.controller.ts` | Parsea y emite SSE; no persiste nada |
| Templates Meta — listar/crear/borrar | `broadcasts/templates/templates.service.ts` | Únicas llamadas reales a Meta Graph API |
| Sidebar con roles | `Sidebar.tsx` | Muestra/oculta ítems según rol |
| SSE para mensajes en tiempo real | Gateway `/webhooks/meta/stream` | Emite al frontend; sin historial |
| Docker + Railway configurados | Dockerfiles + railway.toml | Deploy funciona, env vars mapeadas |

---

### ❌ Lo que es mock o no existe

| Qué | Estado | Impacto |
|-----|--------|---------|
| Autenticación real | Mock en localStorage | Cualquiera puede entrar poniendo un email |
| Base de datos | 2 DBs vacías, sin tablas | Cero persistencia de ningún dato |
| Clientes / asesoras | Hardcoded en `crm.store.ts` | Se pierden al limpiar localStorage |
| Conversaciones | Mock en stores | No vienen de BD, no se guardan |
| Oportunidades | Mock en stores | No vienen de BD |
| Broadcasts / difusiones | UI lista, sin backend real | No se envían ni trackean |
| Analytics | Números inventados | No reflejan nada real |
| Secuencias postventa | UI de toggle, sin lógica | No hace nada |
| Auth Service (puerto 3001) | Solo HealthModule | Sin login, sin JWT, sin nada |
| CRM Core (puerto 3002) | Solo HealthModule | Sin endpoints |
| Messaging (puerto 3003) | Solo HealthModule | Sin endpoints |
| Postsale (puerto 3005) | Solo HealthModule | Sin endpoints |
| Analytics (puerto 3006) | Solo HealthModule | Sin endpoints |
| Integration (puerto 3007) | Solo HealthModule + mock flag | Sin integración real |

---

### ⚠️ Lo que está parcialmente implementado

| Qué | % listo | Qué falta |
|-----|---------|-----------|
| Broadcasts service | 25% | Solo templates. Sin difusiones, sin scheduling, sin delivery tracking |
| Gateway webhook | 60% | Recibe y parsea bien. Falta persistir en BD y enrutar por canal |
| Variables de entorno | 80% | Todas definidas, validación centralizada. Falta multi-número |
| Sistema de roles frontend | 70% | Funciona en UI, sin validación en API |
| Dockerfiles | 90% | Listos. Falta ajustar variables multi-servicio en Railway |

---

### Deuda técnica crítica

```
1. Sin Prisma schemas → sin modelos → sin migrations → sin datos reales
2. Auth Service no existe funcionalmente → todos los endpoints son públicos
3. META_PHONE_NUMBER_ID es una sola variable → no escala a 4-5 números
4. Zustand stores como "base de datos" → datos volátiles, sin sincronización entre usuarios
5. Sin tests (unit, integration, e2e)
6. Sin logging estructurado (logs a consola solo)
7. Sin manejo de errores centralizado en la mayoría de servicios
```

---

### Inventario de servicios backend

```
services/
├── gateway/       Puerto 8080   [PARCIAL]  Webhook + config endpoint funcionan
├── auth/          Puerto 3001   [VACÍO]    Solo /health
├── crm-core/      Puerto 3002   [VACÍO]    Solo /health
├── messaging/     Puerto 3003   [VACÍO]    Solo /health
├── broadcasts/    Puerto 3004   [PARCIAL]  Solo templates API
├── postsale/      Puerto 3005   [VACÍO]    Solo /health
├── analytics/     Puerto 3006   [VACÍO]    Solo /health
└── integration/   Puerto 3007   [VACÍO]    Solo /health + mock flag
```

---

### Inventario de páginas frontend

```
pages/
├── LoginPage          [FUNCIONA con mock]
├── InboxPage          [UI lista, datos mock, admin only]
├── ConversationPage   [UI lista, sin mensajes reales de BD]
├── OpportunitiesPage  [UI lista, datos mock]
├── ClientsPage        [UI lista, datos mock]
├── ClientNewPage      [Formulario funciona, guarda en localStorage]
├── ClientImportPage   [UI lista, no conecta con BD]
├── ClientDetailPage   [UI lista, datos mock]
├── BroadcastsPage     [UI lista, datos mock]
├── BroadcastNewPage   [UI lista, no envía realmente]
├── TemplatesPage      [FUNCIONA — llama a Meta real]
├── TemplateNewPage    [FUNCIONA — crea en Meta real]
├── TemplateDetailPage [FUNCIONA — edita en Meta real]
├── PostsalePage       [UI lista, sin lógica real]
├── AnalyticsPage      [UI lista, datos inventados]
└── SettingsPage       [UI lista, sin backend]
```
