# 07 — Frontend y vistas por rol

## Navegación por rol

### super_admin
```
Sidebar completo:
├── 📊 Dashboard (overview global)
├── 💬 Inbox (todas las conversaciones)
├── 🎯 Oportunidades (todas)
├── 👥 Clientes (todos)
├── 📢 Difusiones
├── 📋 Plantillas
├── 🔄 Postventa
├── 📈 Analytics
└── ⚙️  Configuración
      ├── Usuarios y roles
      ├── Canales WhatsApp
      ├── Asignación asesoras
      └── Sistema
```

### admin / supervisor
```
Sidebar:
├── 📊 Dashboard
├── 💬 Inbox (todas las conversaciones)
├── 🎯 Oportunidades (todas)
├── 👥 Clientes (todos + filtro por asesora)
├── 📢 Difusiones (crear y gestionar)
├── 📋 Plantillas
├── 🔄 Postventa (configurar)
└── 📈 Analytics
    (sin Configuración de sistema/usuarios)
```

### advisor (asesora)
```
Sidebar:
├── 🎯 Mis Oportunidades
├── 👥 Mis Clientes
├── 💬 Mis Conversaciones
└── 📈 Mis Métricas
    (sin Inbox global, sin Difusiones, sin Plantillas, sin Postventa config)
```

### postsale
```
Sidebar:
├── 👥 Clientes (solo lectura)
├── 💬 Conversaciones (solo sus asignadas)
└── 🔄 Postventa (ejecutar secuencias, no configurar)
```

---

## Vistas detalladas por página

### Dashboard — admin/super_admin

**Qué muestra:**
```
┌─────────────────────────────────────────────────────────┐
│  KPIs de hoy          [📅 Hoy] [Esta semana] [Este mes] │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Mensajes │ │ Clientes │ │  Ventas  │ │   Open   │  │
│  │  recibidos│ │ nuevos   │ │ cerradas │ │  conv.   │  │
│  │   142    │ │    8     │ │    3     │ │    24    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  Actividad por asesora          Conversiones (funnel)   │
│  [gráfico de barras]            [gráfico embudo]        │
│                                                         │
│  Conversaciones sin responder hace +2hs                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Cliente X  — "Quiero saber el precio del..."    │   │
│  │ Cliente Y  — "Hola, consulta..."                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Datos de BD:** mensajes (count), clients (count/day), opportunities (won), conversations (open + sin respuesta > 2hs)

---

### Inbox — admin/super_admin ONLY

**Qué muestra:** todas las conversaciones abiertas, de todos los canales y asesoras.

```
┌──────────────────────────────────────────────────────────────┐
│  Inbox Global                    [🔍 Buscar] [Filtros ▼]    │
│                                                              │
│  Filtros: [Todas] [Sin asignar] [Canal 1▼] [Asesora▼]       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🟢 María García   │ Ventas 1  │ Sofía  │ hace 2min  │    │
│  │ "quiero saber si tienen..."                         │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ 🔴 Juan López     │ Ventas 2  │ sin asignar│ 3hs   │    │  ← sin respuesta
│  │ "buenas, consulta sobre..."                         │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

**Diferencia con vista de asesora:** la asesora solo ve sus conversaciones, sin filtro de canal ni de otra asesora.

---

### Mis Oportunidades — advisor

**Qué muestra:** solo oportunidades donde `advisorId === user.advisorId`

```
┌──────────────────────────────────────────────────────────────┐
│  Mis Oportunidades         [+ Nueva]          [🔍 Buscar]   │
│                                                              │
│  [Nuevos (4)] [En contacto (8)] [Interesados (3)] [Ganados] │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  María García                              hace 10min │   │
│  │  "Me interesa el modelo X"                           │   │
│  │  [Marcar interesada] [Abrir chat] [Marcar ganada]    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**vs. Oportunidades del admin:** el admin ve todas y puede filtrar por asesora. También puede reasignar.

---

### Conversación — todos los roles (con diferencias)

```
┌────────────────────────────────────────────────────────┐
│  ← Volver   María García   +549351...   [Sofía] [⋮]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [  Hola, quiero saber el precio del modelo X      ]  │  ← inbound
│                                                        │
│    [ Hola María! El precio es $45.000 🙌 ]            │  ← outbound
│                                                        │
├────────────────────────────────────────────────────────┤
│  💬 Escribir mensaje...                     [Enviar]   │
│  [📋 Template] [📎 Adjunto]  ←→ solo si está en 24hs  │
└────────────────────────────────────────────────────────┘
```

**Diferencias por rol:**
- **admin:** puede reasignar la conversación a otra asesora (botón en header)
- **advisor:** solo puede responder, no reasignar
- **Template button:** visible si el cliente no escribió en las últimas 24hs (fuera de ventana)
- **Text libre:** solo disponible si el cliente escribió en las últimas 24hs

---

### Clientes — diferencias por rol

**admin ve:**
```
┌──────────────────────────────────────────────────────────┐
│  Clientes (1.248)  [+ Nuevo] [📥 Importar] [🔍 Buscar]  │
│                                                          │
│  Filtros: [Todos] [Asesora▼] [Tipo▼] [Estado▼]          │
│                                                          │
│  Nombre       │ Teléfono    │ Asesora │ Tipo  │ Último   │
│  María García │ +5493512... │ Sofía   │ A     │ hace 2d  │
│  Juan López   │ +5493511... │ Carla   │ B     │ hace 5d  │
└──────────────────────────────────────────────────────────┘
```

**advisor ve:**
```
┌──────────────────────────────────────────────────────────┐
│  Mis Clientes (247)       [+ Nuevo] [🔍 Buscar]          │
│                                                          │
│  Filtros: [Todos] [Tipo▼] [Estado▼]   ← sin filtro asesora │
│                                                          │
│  Nombre       │ Teléfono    │ Tipo  │ Último contacto    │
│  María García │ +5493512... │ A     │ hace 2d            │
└──────────────────────────────────────────────────────────┘
```

---

### Mis Métricas — advisor

Vista que solo muestra datos propios de la asesora:

```
┌──────────────────────────────────────────────────────────┐
│  Mis Métricas          [Esta semana ▼]                   │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Mensajes │ │ Respuesta│ │Conversión│ │ Clientes │   │
│  │ enviados │ │ promedio │ │   (won)  │ │ nuevos   │   │
│  │    48    │ │  18 min  │ │    5     │ │    3     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  Mis conversaciones activas (12)                         │
│  Actividad de la semana [gráfico línea]                  │
└──────────────────────────────────────────────────────────┘
```

---

### Configuración — solo super_admin

Nueva página con sub-secciones:

#### Sub-sección: Usuarios y roles
```
┌──────────────────────────────────────────────────────────┐
│  Usuarios                                [+ Nuevo]       │
│                                                          │
│  Nombre    │ Email              │ Rol       │ Estado      │
│  Admin     │ admin@...          │ super_admin│ Activo     │
│  Sofía     │ sofia@...          │ advisor   │ Activa      │
│  Carla     │ carla@...          │ advisor   │ Activa      │
│  [Editar] [Resetear contraseña] [Desactivar]             │
└──────────────────────────────────────────────────────────┘
```

#### Sub-sección: Canales WhatsApp
```
┌──────────────────────────────────────────────────────────┐
│  Canales WhatsApp                        [+ Agregar]     │
│                                                          │
│  WhatsApp Ventas 1 │ +549351... │ 🟢 Activo │ Sofía/Carla│
│  WhatsApp Ventas 2 │ +549352... │ 🟢 Activo │ Julia/Lu   │
│  WhatsApp Ventas 3 │ +549353... │ 🔴 Inactivo│ —         │
│                                                          │
│  [Editar asignación de asesoras] [Ver stats del canal]   │
└──────────────────────────────────────────────────────────┘
```

#### Sub-sección: Asignación de tipos de cliente
```
┌──────────────────────────────────────────────────────────┐
│  Asignación por tipo de cliente                          │
│                                                          │
│  Tipo A (Mayoristas)    → Sofía, Lu                      │
│  Tipo B (Minoristas)    → Carla, Mica                    │
│  Tipo C (Nuevos)        → Julia                          │
│  [Editar asignaciones]                                   │
└──────────────────────────────────────────────────────────┘
```

---

## Cambios en el sistema de permisos del frontend

### Estado actual
```typescript
// src/lib/permissions.ts — funciona con 2 roles
// Hay que expandirlo a 4 roles
```

### Estado objetivo
```typescript
// permissions.ts

export type UserRole = 'super_admin' | 'admin' | 'advisor' | 'postsale';

export type Permission =
  | 'viewAllClients'
  | 'importClients'
  | 'reassignClients'
  | 'viewAllConversations'
  | 'viewInbox'
  | 'sendMessages'
  | 'createBroadcasts'
  | 'manageBroadcasts'
  | 'manageTemplates'
  | 'viewAllAnalytics'
  | 'viewOwnAnalytics'
  | 'configureSequences'
  | 'executeSequences'
  | 'manageUsers'
  | 'manageChannels'
  | 'manageSettings';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'viewAllClients', 'importClients', 'reassignClients',
    'viewAllConversations', 'viewInbox', 'sendMessages',
    'createBroadcasts', 'manageBroadcasts', 'manageTemplates',
    'viewAllAnalytics', 'viewOwnAnalytics',
    'configureSequences', 'executeSequences',
    'manageUsers', 'manageChannels', 'manageSettings',
  ],
  admin: [
    'viewAllClients', 'importClients', 'reassignClients',
    'viewAllConversations', 'viewInbox', 'sendMessages',
    'createBroadcasts', 'manageBroadcasts', 'manageTemplates',
    'viewAllAnalytics', 'viewOwnAnalytics',
    'configureSequences', 'executeSequences',
  ],
  advisor: [
    'sendMessages',
    'viewOwnAnalytics',
    'executeSequences',  // solo para sus propios clientes
  ],
  postsale: [
    'sendMessages',
    'executeSequences',
  ],
};

export function can(user: User | null, perm: Permission): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(perm) ?? false;
}
```

---

## Sidebar — control de visibilidad

```typescript
// components/layout/Sidebar.tsx

const navItems = [
  { label: 'Dashboard',       icon: 'grid',     path: '/dashboard',     permission: 'viewAllAnalytics' },
  { label: 'Inbox',           icon: 'chatbubbles', path: '/inbox',      permission: 'viewInbox' },
  { label: 'Oportunidades',   icon: 'trophy',   path: '/opportunities', permission: null },  // todos
  { label: 'Clientes',        icon: 'people',   path: '/clients',       permission: null },  // todos
  { label: 'Difusiones',      icon: 'megaphone',path: '/broadcasts',    permission: 'manageBroadcasts' },
  { label: 'Plantillas',      icon: 'document', path: '/templates',     permission: 'manageTemplates' },
  { label: 'Postventa',       icon: 'refresh',  path: '/postsale',      permission: 'configureSequences' },
  { label: 'Analytics',       icon: 'analytics',path: '/analytics',     permission: 'viewAllAnalytics' },
  { label: 'Mis Métricas',    icon: 'stats',    path: '/my-analytics',  permission: 'viewOwnAnalytics',
    hideIf: 'viewAllAnalytics' },  // ocultar para quien ya ve analytics global
  { label: 'Configuración',   icon: 'settings', path: '/settings',      permission: 'manageSettings' },
];

// En el template:
{navItems
  .filter(item => {
    if (item.hideIf && can(user, item.hideIf)) return false;
    if (!item.permission) return true;
    return can(user, item.permission);
  })
  .map(item => <NavItem key={item.path} {...item} />)
}
```

---

## Conexión frontend → backend real

### Eliminar datos mock de los stores

El plan es migrar store por store, no todo de golpe:

```
Orden de migración de stores:
1. users.store.ts       → /api/auth/* (primer bloque de la Fase 1)
2. crm.store.ts         → /api/crm/clients, /api/crm/advisors
3. opportunities.store.ts → /api/crm/opportunities
4. inbox.store.ts       → /api/messaging/conversations (SSE real)
5. pricing.store.ts     → /api/integration/prices
6. postsale-config.store.ts → /api/postsale/sequences
```

### Patrón para reemplazar un store mock

```typescript
// ANTES — crm.store.ts con datos hardcoded:
const clients: Client[] = [
  { id: 'c1', name: 'María García', phone: '...', ... },
  { id: 'c2', name: 'Juan López', ... },
];

// DESPUÉS — fetch a la API:
const useClientsStore = create(() => ({
  clients: [] as Client[],
  loading: false,
  error: null as string | null,

  fetchClients: async (filters = {}) => {
    set({ loading: true });
    try {
      const data = await apiFetch('/api/crm/clients?' + new URLSearchParams(filters));
      set({ clients: data.items, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  addClient: async (input: CreateClientInput) => {
    const client = await apiFetch('/api/crm/clients', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    set(state => ({ clients: [client, ...state.clients] }));
    return client;
  },
}));
```

---

## Nuevas páginas a crear

| Página | Ruta | Quién la ve |
|--------|------|-------------|
| Dashboard/Overview | `/dashboard` | admin, super_admin |
| Mis Métricas | `/my-analytics` | advisor |
| Config → Usuarios | `/settings/users` | super_admin |
| Config → Canales | `/settings/channels` | super_admin |
| Config → Asignaciones | `/settings/assignments` | super_admin |
| Cambiar contraseña | `/change-password` | todos (forzado en primer login) |

---

## Redirect por rol al login

```typescript
// auth-context.tsx — después de login exitoso:

function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/dashboard';
    case 'advisor':
      return '/opportunities';
    case 'postsale':
      return '/postsale';
    default:
      return '/opportunities';
  }
}
```
