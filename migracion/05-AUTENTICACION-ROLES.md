# 05 — Autenticación y roles

## Estado actual vs objetivo

| Aspecto | Hoy | Objetivo |
|---------|-----|---------|
| Login | Selector de email, sin contraseña | Email + contraseña, JWT |
| Token | String base64 falso en localStorage | Access token 15min + Refresh token 30d |
| Validación | Solo en frontend (permissions.ts) | Guard en Gateway, headers de contexto |
| Contraseñas | No existen | bcrypt rounds=12 |
| Sesiones | localStorage, 1 por usuario | BD, múltiples dispositivos |
| Roles | 2 roles (admin/advisor) | 4 roles (super_admin/admin/advisor/postsale) |

---

## Flujo de autenticación completo

```
USUARIO
  │
  │ POST /api/auth/login { email, password }
  ▼
GATEWAY
  │ (ruta pública, sin JWT guard)
  │ forward →
  ▼
AUTH SERVICE
  │ 1. Busca user por email en BD
  │ 2. Verifica bcrypt hash
  │ 3. Genera accessToken (JWT, 15min)
  │ 4. Genera refreshToken (uuid, guarda hash en sessions)
  │ 5. Retorna ambos tokens
  ▼
GATEWAY
  │ retorna al frontend:
  │   { accessToken, user: { id, name, email, role, advisorId, avatarColor } }
  │   Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
  ▼
FRONTEND
  │ Guarda accessToken en memoria (NO localStorage — seguridad)
  │ Almacena user en Zustand store (sin persistir token)
  │ Cada request HTTP incluye: Authorization: Bearer {accessToken}
  │
  │ Cuando el accessToken expira (401):
  │   → POST /api/auth/refresh (envía cookie automáticamente)
  │   → Recibe nuevo accessToken
  │   → Reintenta request original
```

---

## JWT payload

```typescript
interface JwtPayload {
  sub: string;        // userId
  role: UserRole;     // 'super_admin' | 'admin' | 'advisor' | 'postsale'
  advisorId?: string; // solo si role === 'advisor'
  iat: number;        // issued at
  exp: number;        // expira en 15 minutos
}
```

---

## Roles y permisos — tabla completa

| Permiso | super_admin | admin | advisor | postsale |
|---------|:-----------:|:-----:|:-------:|:--------:|
| Ver TODOS los clientes | ✅ | ✅ | ❌ (solo propios) | ❌ |
| Crear clientes | ✅ | ✅ | ✅ | ❌ |
| Importar clientes | ✅ | ✅ | ❌ | ❌ |
| Reasignar clientes | ✅ | ✅ | ❌ | ❌ |
| Ver TODAS las conversaciones | ✅ | ✅ | ❌ (solo propias) | ❌ |
| Enviar mensajes | ✅ | ✅ | ✅ | ✅ |
| Crear difusiones | ✅ | ✅ | ❌ | ❌ |
| Ver analytics global | ✅ | ✅ | ❌ (solo propias) | ❌ |
| Configurar secuencias | ✅ | ✅ | ❌ | ❌ |
| Ejecutar secuencias manual | ✅ | ✅ | ❌ | ✅ |
| Gestionar plantillas Meta | ✅ | ✅ | ❌ | ❌ |
| Gestionar canales WhatsApp | ✅ | ❌ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ | ❌ |
| Configuración del sistema | ✅ | ❌ | ❌ | ❌ |
| Ver Inbox global (todas las convers.) | ✅ | ✅ | ❌ | ❌ |

---

## Guards en el Gateway

```typescript
// gateway/src/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) return true; // sin restricción de rol

    const request = context.switchToHttp().getRequest();
    const userRole = request.headers['x-user-role'] as UserRole;
    
    return requiredRoles.includes(userRole);
  }
}

// Decorador para usarlo en controladores:
// @Roles('admin', 'super_admin')
// @Get('/broadcasts')
// findAll() { ... }
```

---

## Scoping por advisorId — patrón en servicios

Los servicios internos no usan guards de rol — reciben el contexto del Gateway y aplican scoping en las queries:

```typescript
// Patrón estándar en services:
async findClients(filters: any, ctx: UserCtx) {
  const where: any = { ...buildFilters(filters) };
  
  // Si es advisor, forzar scope a sus propios clientes
  if (ctx.role === 'advisor') {
    where.advisorId = ctx.advisorId;
  }
  
  // Si es admin filtrando por asesora específica
  if (filters.advisorId && ctx.role !== 'advisor') {
    where.advisorId = filters.advisorId;
  }

  return this.prisma.client.findMany({ where });
}
```

---

## Cambios en el frontend

### Cambio 1: Persistencia del token
```typescript
// ANTES (inseguro):
localStorage.setItem('lid_token', token);

// DESPUÉS: access token solo en memoria (variable de módulo)
// El refresh token viaja solo en cookie HttpOnly

// auth-context.tsx
let inMemoryToken: string | null = null;

function setToken(token: string) {
  inMemoryToken = token;
}

function getToken(): string | null {
  return inMemoryToken;
}
```

### Cambio 2: Login real
```typescript
// ANTES:
async function login(email: string) {
  const user = users.find(u => u.email === email);
  if (user) setAuth(user, `mock.${btoa(user.id)}.token`);
}

// DESPUÉS:
async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // para que la cookie se guarde
  });
  const { accessToken, user } = await res.json();
  setToken(accessToken);
  setUser(user);
}
```

### Cambio 3: Interceptor de 401
```typescript
// lib/http.ts — interceptor para renovar token automáticamente

async function apiFetch(url: string, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
  });

  if (res.status === 401) {
    // Intentar refresh
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      setToken(accessToken);
      // Reintentar request original
      return apiFetch(url, options);
    } else {
      // Refresh también falló → logout
      clearAuth();
      window.location.href = '/login';
    }
  }

  return res;
}
```

### Cambio 4: LoginPage — agregar campo contraseña
```typescript
// ANTES: selector de email sin contraseña
// DESPUÉS: formulario estándar email + contraseña
// La página de login actual (LoginPage.tsx) muestra tarjetas de usuario
// → reemplazar por formulario con IonInput email + IonInput password type="password"
```

---

## Configuración de contraseñas en producción

Al hacer el seed inicial, se crean usuarios con contraseñas temporales. En el primer login, el sistema debe pedir cambio de contraseña:

```typescript
// En User model: agregar campo 'mustChangePassword: Boolean @default(true)'
// En login response: incluir 'mustChangePassword'
// En frontend: si mustChangePassword === true, redirigir a /change-password antes de entrar
```

**Contraseñas temporales del seed:**
Nunca hardcodear en el código. Generarlas con `openssl rand -base64 16` y pasarlas como variable de entorno al seed.

```bash
SEED_DEFAULT_PASSWORD=temporalABC123 npx prisma db seed
```
