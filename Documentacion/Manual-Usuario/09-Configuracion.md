# 09 — Configuración (Administrador)

> ⚠️ **Solo disponible para administradores**

---

## Descripción general

La sección **Configuración** es el panel de control del sistema. Aquí gesionas usuarios, tipos de clientes, credenciales de Meta, y otros ajustes globales.

---

## Acceder a Configuración

1. Ve a **Configuración** en el menú izquierdo (solo admin)
2. Verás una lista de opciones de configuración

---

## 1. Gestión de usuarios

### Ver lista de usuarios
1. En Configuración, haz clic en **Usuarios**
2. Se muestra tabla con todos los usuarios

| Columna | Info |
|---------|------|
| **Nombre** | Nombre completo |
| **Email** | Email de login |
| **Rol** | Admin o Asesora |
| **Estado** | Activo / Inactivo |
| **Teléfono** | Teléfono asignado (para postventa) |
| **Creado** | Fecha de creación |
| **Acción** | Editar, Desactivar, Eliminar |

### Crear usuario nuevo
1. Haz clic en **+ Nuevo usuario**
2. Completa formulario:
   - **Nombre completo** (ej: María García)
   - **Email** (ej: maria.garcia@lainternacional.com.ar)
   - **Rol:** Admin o Asesora
   - **Teléfono:** (obligatorio si es asesora, para postventa)
   - **Contraseña temporal**

3. Haz clic en **Crear usuario**
4. El usuario recibe email con contraseña temporal
5. Primera vez que abre el CRM, debe cambiar contraseña

### Editar usuario
1. En la tabla, haz clic en el nombre del usuario
2. Modifica:
   - Nombre
   - Email (cuidado, afecta login)
   - Rol
   - Teléfono
   - Estado (activo/inactivo)

3. Haz clic en **Guardar cambios**

### Desactivar usuario
Sin borrar (conserva historial):
1. Haz clic en **Desactivar**
2. Confirmación: "¿Desactivar usuario?"
3. El usuario no puede loguearse
4. Sus datos y conversaciones se conservan
5. Puedes reactivar después

### Eliminar usuario
Borrado completo (soft-delete):
1. Haz clic en **⋮** → **Eliminar**
2. Confirmación: "¿Eliminar usuario?"
3. Se borra pero el historial (conversaciones, difusiones) se mantiene para auditoría

---

## 2. Tipos de clientes

### Ver tipos
1. En Configuración, haz clic en **Tipos de clientes**
2. Se muestra lista de categorías:
   - Cosmetóloga
   - Esteticista
   - Dermatóloga
   - Revendedora
   - Otros

### Crear tipo nuevo
1. Haz clic en **+ Nuevo tipo**
2. Completa:
   - **Nombre:** "Maquilladora", "Coach de belleza"
   - **Descripción:** (opcional)
   - **Asesora por defecto:** (opcional) quién debe atender este tipo

3. Haz clic en **Crear**

### Editar tipo
1. En la lista, haz clic en el nombre
2. Modifica nombre, descripción, asesora por defecto
3. Haz clic en **Guardar cambios**

### Eliminar tipo
⚠️ **Cuidado:** si hay clientes de este tipo, la opción está deshabilitada. Primero cambia esos clientes a otro tipo.

1. Haz clic en **Eliminar**
2. Confirmación
3. Se elimina el tipo

---

## 3. Tags personalizados

### Ver tags
1. En Configuración, haz clic en **Tags**
2. Se muestra lista:

| Tag | Color | Clientes | Creado |
|-----|-------|----------|--------|
| VIP | 🔴 Rojo | 8 | 10/01 |
| En seguimiento | 🟡 Amarillo | 15 | 15/01 |
| Contacto directo | 🟢 Verde | 3 | 20/01 |

### Crear tag
1. Haz clic en **+ Nuevo tag**
2. Completa:
   - **Nombre:** "Oferta especial", "A revisar", etc.
   - **Color:** selecciona de paleta (RGB o hex)

3. Haz clic en **Crear**

### Editar tag
1. Haz clic en el tag
2. Modifica nombre y color
3. Haz clic en **Guardar**

### Eliminar tag
⚠️ Si hay clientes con este tag, puedes:
- Opción 1: Remover tag de todos los clientes, luego eliminar
- Opción 2: Renombrar tag (más seguro)

1. Haz clic en **Eliminar**
2. Si hay clientes, se muestra advertencia
3. Confirma

---

## 4. Credenciales de Meta

### Dónde están mis credenciales
1. En Configuración, haz clic en **Credenciales Meta**
2. Se muestra sección con:

```
WABA ID (WhatsApp Business Account)
│ Identificador: 1894314254553697

Phone Number ID
│ Identificador: 1127647270424016
│ Teléfono: +54 351 672 0095

Access Token
│ 🔐 Visible solo para admin
│ Última actualización: 12/02/2024
│ Expira: 12/03/2024 (renovar)
```

### Actualizar Access Token
**Cuándo:** Meta puede revocar el token por seguridad, o tú lo rotaste. El CRM comenzará a fallar con errores 401.

1. En Meta for Developers:
   - Ve a tu app Meta
   - Settings → Business integrations (o Apps y sitios web)
   - Busca "Access Token" o "Tokens"
   - Copia token nuevo

2. Vuelve a CRM → Configuración → Credenciales Meta
3. Haz clic en **Cambiar token de acceso**
4. Pega token nuevo
5. Haz clic en **Validar y guardar**
6. El CRM valida contra Meta
7. Si es válido: "✅ Token actualizado"
8. Si es inválido: "❌ Token rechazado por Meta"

### Número de prueba (test)
El número donde van los envíos en modo TEST.

1. Haz clic en **Cambiar número de prueba**
2. Ingresa número en E.164: `+549351234567`
3. Haz clic en **Guardar**

> Nota: El número de prueba debe estar agregado en Meta for Developers.

---

## 5. Estadísticas de uso

### Consumo de Meta
```
Período: Últimos 30 días

Mensajes enviados: 347
Costo: $3,470 ARS (USD 23)

Desglose:
- Difusiones: 300 mensajes ($3,000)
- Postventa: 47 mensajes ($470)

Tarifa promedio: $10 ARS por mensaje
```

### Clientes
```
Total: 492
Nuevos este mes: 47
Activos: 380 (últimos 30 días)
Con opt-in: 450 (91%)
Opt-out: 42 (9%)
```

### Asesoras
```
Activas: 5
Sesiones WhatsApp Web (postventa): 5/5 conectadas
```

---

## 6. Preferencias del sistema

### Idioma
- Español (Argentina)
- (Futuro: inglés, portugués)

### Zona horaria
- America/Argentina/Buenos_Aires (configurado por defecto)

### Moneda
- ARS (peso argentino)

### Tema
- Claro / Oscuro (por preferencia de usuario)

---

## 7. Backup y datos

### Exportar datos de clientes
1. Haz clic en **Exportar datos**
2. Selecciona formato:
   - CSV (compatible con Excel)
   - JSON (técnico)

3. Selecciona qué incluir:
   - Solo clientes activos / todos
   - Solo con conversaciones
   - Período de tiempo

4. Haz clic en **Descargar**
5. Se descarga archivo

### Importar datos (migración)
Si necesitas migrar desde otro sistema:
1. Haz clic en **Importar datos**
2. Sube archivo CSV o JSON
3. El CRM mapea campos
4. Muestra preguntas sobre duplicados
5. Completa importación

---

## 8. Logs y auditoría

### Ver logs de sistema
1. Haz clic en **Logs**
2. Muestra tabla con eventos:

| Hora | Usuario | Acción | Recurso | Resultado |
|------|---------|--------|---------|-----------|
| 14:30 | María | Login | users.auth | éxito |
| 14:35 | María | Crear cliente | clients | éxito |
| 14:40 | Admin | Cambiar rol | users | éxito |

### Filtrar logs
- Por rango de fecha
- Por usuario
- Por tipo de acción (create, update, delete, login, etc.)
- Por recurso (clients, conversations, etc.)

### Buscar evento específico
Barra de búsqueda: escribe nombre usuario, cliente, email, etc.

### Descargar logs
1. Haz clic en **Descargar CSV**
2. Se exporta table actual con filtros aplicados

---

## 9. Gestión de permisos

### Opciones de rol

#### Admin
- Acceso completo a todas las secciones
- Puede crear/editar/eliminar usuarios
- Puede cambiar settings globales

#### Asesora
- Acceso solo a:
  - Inbox (bandeja de conversaciones)
  - Clientes (solo los suyos)
  - Perfil personal
- No ve: Difusiones, Plantillas, Analytics, Configuración

### Cambiar permisos a usuario
1. En **Usuarios**, selecciona usuario
2. Modifica **Rol**
3. Haz clic en **Guardar cambios**

> Cambio es inmediato. Si el usuario estaba logueado, se le revoca acceso a secciones al siguiente request.

---

## 10. Notificaciones y alertas

### Configurar alertas
1. En Configuración, haz clic en **Alertas**
2. Selecciona qué alertas recibir por email:

```
☑️ Difusión completada (éxito o error)
☑️ Plantilla rechazada por Meta
☑️ Sesión WhatsApp desconectada (postventa)
☑️ Tasa de error > 20% en campaña
☑️ Token de Meta próximo a expirar
☐ Nuevo cliente importado
☐ Cliente cambió de estado
```

3. Haz clic en **Guardar preferencias**

---

## 11. Integración con sistema actual

### Sincronización (futuro)
Si la empresa usa un sistema actual, esta sección permitiría:
- **Mapeo de campos:** qué datos sincronizan
- **Frecuencia:** cada cuánto se sincroniza
- **Test de conexión:** verifica que el sistema actual esté online
- **Historial de sync:** quién se sincronizó, cuándo, qué falló

Por ahora: funcionalidad manual, coordinada con el freelance del sistema actual.

---

## 12. API y webhooks (para desarrolladores)

### Keys de API
Si necesitas integrar con sistemas externos:
1. Haz clic en **API Keys**
2. Se muestra clave privada (oculta)
3. Opción **Regenerar** (revoca clave actual)

### Webhooks
Configuración de endpoints que Meta notifica:
- URL de webhook
- Verify token
- Status del endpoint
- Logs de webhooks recibidos

---

## Procedimientos comunes en Configuración

### Agregar una nueva asesora
1. Ve a **Usuarios** → **+ Nuevo usuario**
2. Nombre, email, rol **Asesora**
3. Teléfono: ej "+549351234567" (para postventa)
4. Crear usuario
5. Email se envía al nuevo usuario con contraseña temporal
6. Opcionalmente: ve a **Tipos de clientes**, asigna esta asesora a ciertos tipos

### Cambiar asesora de un cliente
1. Ve a **Clientes**
2. Busca cliente
3. En detalles, **Cambiar asesora**
4. Selecciona asesora
5. Guardas

O en **Usuarios**, ve a la asesora → clientes asignados → editar ahí.

### Refrescar credenciales de Meta
1. Ve a **Credenciales Meta**
2. Token vence próximamente
3. Haz clic en **Cambiar token**
4. Ve a Meta for Developers, copia token nuevo
5. Pega en CRM, valida
6. Listo

### Revisar quién accedió y qué hizo
1. Ve a **Logs**
2. Filtra por usuario: "María"
3. Filtra por acción: "Login"
4. Ves historial de accesos
5. Haz clic en evento para detalles

---

## Tips para administrador

✅ **Haz:**
- Revisa **Logs** semanalmente (auditoría)
- Actualiza **Token de Meta** antes de que expire
- Responda tickets de asesoras rápido (configuración técnica)
- Documente cambios en tipos de clientes, tags, usuarios
- Haz backups periódicos (descarga datos)

❌ **Evita:**
- Cambiar configuración sin testing previo
- Borrar usuarios sin archivar conversaciones
- Shared tokens (cada admin su token propio)
- Ignorar alertas de sistemas (token expirando, sesiones offline)

---

Vuelve a **[MANUAL-USUARIO](../MANUAL-USUARIO.md)** o accede a la siguiente sección: **[10-FAQ-Troubleshooting](10-FAQ-Troubleshooting.md)**.
