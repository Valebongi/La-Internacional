# 03 — Frontend

> Especificación de la app web del CRM de La Internacional. Stack: **Vite + React + Ionic React**. Una sola codebase para uso en desktop (admin) y mobile/tablet (asesoras).

Ver también [02-Backend.md](02-Backend.md) para los endpoints que consume y [01-Arquitectura.md](01-Arquitectura.md) para el contexto general.

---

## 1. Stack y por qué Ionic

| Tema | Decisión |
|---|---|
| Build | Vite |
| Framework | React 18+ |
| UI Kit | Ionic React 8+ |
| Routing | `@ionic/react-router` (sobre React Router v5) |
| State | Zustand (recomendado) o Context API; Redux Toolkit como alternativa si crece |
| HTTP | `fetch` envuelto en `lib/http.ts` (siguiendo patrón del Marketplace) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Ionicons (incluido en Ionic) |
| Lenguaje | TypeScript strict |
| Linting | ESLint + Prettier |

**Por qué Ionic React:**

- Las **asesoras trabajan mucho desde el celular** (es donde entran los WhatsApps). Ionic da componentes mobile-first listos: `IonModal`, `IonItem`, `IonList`, `IonInfiniteScroll`, `IonRefresher`, gestos nativos de swipe, etc.
- El **admin trabaja desde desktop** y Ionic responde bien con `IonSplitPane` (sidebar fija + contenido).
- Una sola codebase sirve **PWA instalable** y, a futuro, app nativa con Capacitor sin reescribir.
- Tema claro/oscuro built-in.

---

## 2. Estructura del proyecto

```
frontend/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
│   ├── icon.png
│   └── manifest.webmanifest
└── src/
    ├── main.tsx
    ├── App.tsx                     # IonApp + IonReactRouter + IonSplitPane
    ├── theme/
    │   ├── variables.css           # paleta La Internacional (custom CSS vars Ionic)
    │   └── global.css
    ├── lib/
    │   ├── http.ts                 # apiFetch base (token de localStorage)
    │   ├── auth-context.tsx        # AuthProvider + useAuth
    │   ├── theme-context.tsx       # claro/oscuro
    │   ├── notifications-context.tsx  # polling de notifs
    │   └── phone.ts                # normalización E.164
    ├── services/                   # capa HTTP (mismo patrón Marketplace)
    │   ├── auth.service.ts
    │   ├── clients.service.ts
    │   ├── conversations.service.ts
    │   ├── messages.service.ts
    │   ├── broadcasts.service.ts
    │   ├── templates.service.ts
    │   ├── postsale.service.ts
    │   ├── analytics.service.ts
    │   └── integration.service.ts
    ├── stores/                     # Zustand
    │   ├── conversations.store.ts
    │   ├── clients.store.ts
    │   └── ui.store.ts             # sidebar collapsed, modals, etc.
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.tsx        # IonSplitPane + Menu
    │   │   ├── Sidebar.tsx
    │   │   └── TopBar.tsx
    │   ├── conversations/
    │   │   ├── ConversationList.tsx
    │   │   ├── ConversationItem.tsx
    │   │   ├── ChatView.tsx
    │   │   ├── MessageBubble.tsx
    │   │   ├── MessageComposer.tsx
    │   │   └── StateChip.tsx
    │   ├── clients/
    │   │   ├── ClientList.tsx
    │   │   ├── ClientCard.tsx
    │   │   ├── ClientDetailPanel.tsx
    │   │   ├── ClientImporter.tsx       # CSV → muestra dups
    │   │   └── DuplicateBanner.tsx
    │   ├── broadcasts/
    │   │   ├── BroadcastList.tsx
    │   │   ├── BroadcastDesigner.tsx    # selector segmento + plantilla + preview
    │   │   ├── SegmentBuilder.tsx
    │   │   ├── TemplatePreview.tsx
    │   │   └── BroadcastStats.tsx
    │   ├── postsale/
    │   │   ├── SessionsPanel.tsx        # estado de cada sesión, QR
    │   │   ├── QRDisplay.tsx
    │   │   └── SequenceEditor.tsx
    │   ├── analytics/
    │   │   ├── FunnelChart.tsx
    │   │   ├── ConversionRatesTable.tsx
    │   │   ├── CostPerStateChart.tsx
    │   │   └── AdvisorPerformance.tsx
    │   └── shared/
    │       ├── Avatar.tsx
    │       ├── EmptyState.tsx
    │       ├── LoadingSpinner.tsx
    │       └── ErrorBanner.tsx
    └── pages/
        ├── LoginPage.tsx
        ├── InboxPage.tsx                # bandeja unificada
        ├── ConversationPage.tsx         # /conversations/:id
        ├── ClientsPage.tsx              # directorio
        ├── ClientDetailPage.tsx         # /clients/:id
        ├── ClientImportPage.tsx
        ├── BroadcastsPage.tsx
        ├── BroadcastDetailPage.tsx
        ├── BroadcastNewPage.tsx
        ├── PostsalePage.tsx             # sesiones + secuencias
        ├── AnalyticsPage.tsx
        ├── SettingsPage.tsx             # asesoras, tipos, tags, opt-out
        └── NotFoundPage.tsx
```

---

## 3. Routing

Usamos `IonReactRouter` con `IonRouterOutlet`. Las rutas con `requiresAuth` están envueltas en un guard que redirige a `/login` si no hay sesión.

```
/login                              → LoginPage
/                                   → redirect a /inbox
/inbox                              → InboxPage           (asesoras + admin)
/conversations/:id                  → ConversationPage    (asesoras + admin con scope)
/clients                            → ClientsPage         (asesoras: solo suyos / admin: todos *)
/clients/:id                        → ClientDetailPage
/clients/import                     → ClientImportPage    (admin)
/broadcasts                         → BroadcastsPage      (admin)
/broadcasts/new                     → BroadcastNewPage    (admin)
/broadcasts/:id                     → BroadcastDetailPage
/postsale                           → PostsalePage        (admin + asesora-self)
/analytics                          → AnalyticsPage       (admin)
/settings                           → SettingsPage        (admin)
```

\* La visibilidad de clientes para asesoras es **decisión pendiente** (ver [05-Requerimientos-Tecnicos.md](05-Requerimientos-Tecnicos.md)).

---

## 4. Páginas — detalle

### 4.1 LoginPage

- Form: email + password.
- POST `/auth/login` → guarda `lid_token` y `lid_user` en localStorage.
- Redirige a `/inbox`.

### 4.2 InboxPage (bandeja unificada)

Página principal. Layout:

- **Tabs/segmentos** por canal: `Todos | WA #1 | WA #2 | WA #3 | WA #4 | WA #5 | Instagram`
- **Lista de conversaciones** (`IonList`) con:
  - Avatar (inicial o foto si la tenemos)
  - Nombre del cliente o teléfono
  - Último mensaje (preview)
  - Timestamp relativo
  - Chip de estado (Recibido / En validación / Presupuestando / Sin comprobante / Agendado)
  - Badge de unread
  - Indicador del canal de origen
- **Filtros** (en `IonModal` o sheet): por estado, por asesora (admin), por tag, por rango de fecha.
- **Polling** cada 15s para refrescar (en el prototipo; WebSocket más adelante).
- **Pull-to-refresh** con `IonRefresher`.
- **Click** → navega a `/conversations/:id`.

Si rol = `advisor`, la lista se filtra automáticamente del lado del backend (gateway inyecta `x-advisor-id`). Si rol = `admin`, ve todas y puede filtrar por asesora.

### 4.3 ConversationPage

Layout en desktop: panel izquierdo con lista de conversaciones, panel central con el chat, panel derecho con datos del cliente. Usa `IonSplitPane` anidado.

En mobile: solo el chat, datos del cliente en `IonModal` accesible vía botón.

- **ChatView:** scroll inverso, `MessageBubble` por mensaje, separadores por día.
- **MessageComposer:** textarea + botón enviar. Detecta si el cliente acepta mensajes (24h window de WA), y si no, sugiere usar plantilla.
- **StateChip** (arriba): permite cambiar el estado de la conversación con un menú.
- **Panel del cliente:** nombre, teléfono, asesora, tipo, tags, historial de comprobantes (vía integration), últimas 3 conversaciones.

### 4.4 ClientsPage

- Tabla/lista paginada (`IonList` + `IonInfiniteScroll`).
- Búsqueda por nombre/teléfono (debounced).
- Filtros: tipo, asesora (admin), tag, último contacto.
- Botón "Importar" (admin) → `ClientImportPage`.
- Click → `ClientDetailPage`.

### 4.5 ClientImportPage (clave: anti-duplicación)

**El requerimiento más explícito del documento original.**

- Drop zone para CSV o pegar lista de teléfonos.
- Vista previa de filas parseadas.
- Botón "Validar" → llama `POST /clients/import` (con `dryRun: true`).
- Resultado en dos secciones visuales:
  - **Nuevos:** lista de teléfonos que se crearán.
  - **Duplicados:** lista de teléfonos ya existentes, con info de a qué asesora pertenecen y desde cuándo. **Esto es lo que les ahorra el chequeo manual.**
- Botón "Confirmar import" → llama de nuevo sin `dryRun`. Solo crea los nuevos.

### 4.6 ClientDetailPage

- Header: nombre, teléfono, badges (tipo, tags).
- Tabs:
  - **Conversaciones:** historial de chats.
  - **Comprobantes:** del sistema actual vía `integration-service`.
  - **Postventa:** secuencias programadas para este cliente.
- Acciones: cambiar asesora (admin), agregar tag, marcar opt-out.

### 4.7 BroadcastsPage + BroadcastNewPage

Reemplaza el armado manual de listas de 250 contactos.

**BroadcastsPage:** lista de difusiones con stats (enviados, entregados, leídos, respondidos, costo).

**BroadcastNewPage:** wizard de 3 pasos:

1. **Segmento:** `SegmentBuilder` con filtros visuales (tipo, tag, última compra, opt-in). Muestra contador en vivo de cuántos clientes matchean.
2. **Plantilla:** selector de `templates` aprobadas en Meta. Preview con variables sustituidas.
3. **Confirmación:** muestra costo estimado y botón "Enviar ahora" o "Programar".

### 4.8 BroadcastDetailPage

- Stats: barra de progreso (sent/delivered/read/responded).
- Lista de recipients con su estado individual.
- Costo total y costo por cliente convertido (si aplica).

### 4.9 PostsalePage

- **SessionsPanel:** una card por asesora con:
  - Estado (`disconnected` / `qr-required` / `connected`)
  - Si `qr-required` → muestra QR escaneable
  - Botón conectar/desconectar
  - Última actividad
- **SequenceEditor:** lista de secuencias automáticas configuradas.
  - Trigger (post-compra 7d, inactivo 45d)
  - Plantilla del mensaje (puede usar variables `{{nombre}}`, `{{ultima_compra}}`)
  - Toggle activo/pausado

### 4.10 AnalyticsPage

Dashboard con tarjetas y gráficos:

- **FunnelChart:** embudo visual (Recibido → ... → Comprado).
- **ConversionRatesTable:** % de clientes que pasan de un estado al siguiente.
- **CostPerStateChart:** costo de llegar a cada estado.
- **AdvisorPerformance:** comparación entre asesoras (envíos, conversiones, costo).
- Filtros globales: rango de fecha, asesora, difusión específica.

### 4.11 SettingsPage

Sub-navegación interna (segments):

- **Asesoras:** alta, edición, asignación de teléfono propio.
- **Tipos de cliente:** alta, edición, asignación a asesora (mapping `type → advisor`).
- **Tags:** alta, edición, color.
- **Estados:** definición de los estados del lifecycle del cliente.
- **Opt-out:** lista de teléfonos que pidieron no recibir difusiones.
- **Canales:** los 5 WA + IG, conexión con Cloud API.

---

## 5. State management

**Zustand** por simplicidad. Stores chicos por dominio:

- `conversations.store.ts` — lista actual, filtros activos, conversación abierta.
- `clients.store.ts` — cache de clientes recientes.
- `ui.store.ts` — sidebar collapsed, modals abiertos, toasts.

**Auth y notificaciones** van por Context API (siguiendo patrón Marketplace) porque se inicializan al login y necesitan provider tree:

- `AuthProvider` / `useAuth()` — `{ user, token, login, logout, isAuthenticated }`.
- `NotificationsProvider` / `useNotifications()` — polling cada 30s.
- `ThemeProvider` / `useTheme()` — claro/oscuro.

Stack de providers en `App.tsx`:

```tsx
<IonApp>
  <ThemeProvider>
    <AuthProvider>
      <NotificationsProvider>
        <IonReactRouter>...</IonReactRouter>
      </NotificationsProvider>
    </AuthProvider>
  </ThemeProvider>
</IonApp>
```

---

## 6. Capa HTTP (`services/`)

Patrón heredado del Marketplace: cada dominio tiene su `*.service.ts` exportando funciones tipadas.

```ts
// services/clients.service.ts (ejemplo)
import { apiFetch } from '@/lib/http';

export interface Client { id: string; phone: string; name?: string; advisorId?: string; ... }
export interface ImportResult { created: Client[]; duplicates: { phone: string; existingClientId: string; advisorId?: string }[]; }

export const clientsService = {
  list: (params?: { type?: string; advisorId?: string; tag?: string; q?: string; page?: number }) =>
    apiFetch<{ data: Client[]; total: number; page: number; limit: number; totalPages: number }>('/api/v1/clients', { params }),

  get: (id: string) => apiFetch<Client>(`/api/v1/clients/${id}`),

  create: (data: Partial<Client>) => apiFetch<Client>('/api/v1/clients', { method: 'POST', body: data }),

  import: (phones: string[], dryRun = true) =>
    apiFetch<ImportResult>('/api/v1/clients/import', { method: 'POST', body: { phones, dryRun } }),
  // ...
};
```

`lib/http.ts`:

```ts
export async function apiFetch<T>(path: string, opts: { method?: string; body?: unknown; params?: Record<string, any> } = {}): Promise<T> {
  const token = localStorage.getItem('lid_token');
  const url = new URL(path, import.meta.env.VITE_API_BASE_URL);
  if (opts.params) Object.entries(opts.params).forEach(([k, v]) => v != null && url.searchParams.set(k, String(v)));
  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw await res.json().catch(() => ({ message: res.statusText }));
  if (res.status === 204) return undefined as T;
  return res.json();
}
```

---

## 7. Realtime: polling vs WebSocket

Para el prototipo: **polling**. Es simple, predecible y no agrega infra.

- Conversaciones: cada 15s en `InboxPage`.
- Notificaciones: cada 30s globalmente.
- Mensajes dentro de un chat abierto: cada 5s mientras la pestaña está activa, pausa al salir.

Post-prototipo: WebSocket en el gateway (Socket.IO) con rooms por `advisorId`.

---

## 8. Theming y branding

Ionic permite custom theme via CSS variables. En `theme/variables.css`:

```css
:root {
  --ion-color-primary: #...;          /* color principal La Internacional */
  --ion-color-primary-rgb: ...;
  --ion-color-secondary: #...;
  --ion-color-tertiary: #...;
  /* ... */
  --ion-font-family: 'Inter', system-ui, sans-serif;
}

@media (prefers-color-scheme: dark) {
  body {
    --ion-background-color: #0d1117;
    /* ... */
  }
}
```

**Pendiente del cliente:** logo, paleta exacta, tipografía. Listado en [05-Requerimientos-Tecnicos.md](05-Requerimientos-Tecnicos.md).

---

## 9. Variables de entorno (Vite)

Vite expone solo las que empiecen con `VITE_`:

```
VITE_API_BASE_URL=https://api.lainternacional.com.ar       # gateway URL
VITE_APP_NAME=CRM La Internacional
VITE_POLL_INBOX_MS=15000
VITE_POLL_NOTIFICATIONS_MS=30000
VITE_POLL_CHAT_MS=5000
```

En Railway se inyectan en build time.

---

## 10. Build y despliegue en Railway

- Build: `npm run build` → genera `dist/` estático.
- Servido por `serve` o por Caddy (Railway template). Config simple:

```dockerfile
# si optamos por imagen propia
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
```

`Caddyfile`:
```
:8080 {
  root * /usr/share/caddy
  try_files {path} /index.html
  file_server
  encode gzip
}
```

El `try_files ... /index.html` es crítico para que el routing client-side funcione en refresh.

---

## 11. Convenciones que aplican (heredadas)

- Componentes funcionales, hooks, no clases.
- Cada componente que use estado o efectos vive en un `.tsx` con default export nombrado.
- Props tipadas explícitamente (no `React.FC` deprecated).
- Archivos cortos: si un componente pasa 200 líneas, partirlo.
- No comments salvo cuando el "por qué" no es obvio.

---

## 12. Páginas → endpoints (cobertura)

| Página | Servicios consumidos |
|---|---|
| LoginPage | `auth-service` |
| InboxPage | `messaging-service` (conversations), `auth-service` (advisors) |
| ConversationPage | `messaging-service`, `crm-core-service`, `integration-service` |
| ClientsPage | `crm-core-service` |
| ClientImportPage | `crm-core-service` |
| ClientDetailPage | `crm-core-service`, `messaging-service`, `integration-service`, `postsale-service` |
| BroadcastsPage | `broadcasts-service`, `analytics-service` |
| BroadcastNewPage | `broadcasts-service`, `crm-core-service` (segmento preview) |
| BroadcastDetailPage | `broadcasts-service`, `analytics-service` |
| PostsalePage | `postsale-service`, `auth-service` |
| AnalyticsPage | `analytics-service` |
| SettingsPage | `auth-service`, `crm-core-service`, `broadcasts-service` (opt-out) |

Cobertura cruzada con [02-Backend.md](02-Backend.md).
