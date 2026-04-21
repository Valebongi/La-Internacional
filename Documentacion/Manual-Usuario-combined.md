# Manual de Usuario — CRM La Internacional

---

# 01 — Introducción al CRM La Internacional

## ¿Qué es este sistema?

El **CRM La Internacional** es una plataforma centralizada diseñada para ayudarte a gestionar clientes, comunicaciones por WhatsApp e Instagram, difusiones masivas y seguimiento de ventas, todo en un solo lugar.

Reemplaza procesos manuales de seguimiento y organiza la información de tus clientes de forma eficiente, sin abandonar el sistema actual que la empresa ya utiliza.

---

## ¿Para quién es?

### 👩‍💼 Si eres una **asesora**

Usarás el CRM para:
- **Ver tus clientes:** accede a tu bandeja de clientes asignados, filtra por tipo, busca por nombre o teléfono
- **Revisar mensajes:** bandeja unificada de WhatsApp e Instagram en un solo lugar
- **Responder clientes:** chat integrado para mantener conversaciones fluidas
- **Marcar seguimientos:** indica el estado de cada cliente (validación, presupuestando, etc.)
- **Ver secuencias automáticas:** si tu empresa usa postventa automática, verás confirmación de envíos

### 👨‍💼 Si eres **administrador**

Tienes acceso a todas las funcionalidades más:
- **Importar clientes:** carga masiva desde CSV con detección automática de duplicados
- **Crear campañas:** envía difusiones masivas por WhatsApp a segmentos de clientes
- **Gestionar plantillas:** crea y revisa templates de Meta para mensajes
- **Ver analytics:** dashboards con tasas de conversión, costos por estado, desempeño de asesoras
- **Configurar credenciales:** conecta la cuenta de Meta, gestiona usuarios y configuraciones

---

## Roles y permisos

| Acción | Asesora | Admin |
|--------|---------|-------|
| Ver propios clientes | ✅ | ✅ (todos) |
| Ver propias conversaciones | ✅ | ✅ (todas) |
| Crear cliente | ✅ (limitado) | ✅ |
| Importar clientes (CSV) | ❌ | ✅ |
| Enviar difusión masiva | ❌ | ✅ |
| Crear plantilla | ❌ | ✅ |
| Ver analytics | ❌ | ✅ |
| Gestionar usuarios | ❌ | ✅ |
| Acceder a configuración | ❌ | ✅ |

---

## Estructura principal

El CRM está organizado en estas secciones:

### 📥 **Inbox**
Tu bandeja unificada de mensajes. Aquí ves todas las conversaciones de tus clientes por WhatsApp e Instagram en tiempo real. Es donde pasas más tiempo respondiendo.

### 👥 **Clientes**
Directorio de clientes asignados a ti (si eres asesora) o de toda la empresa (si eres admin). Busca, filtra, ve detalles de cada cliente y su historial.

### 📢 **Difusiones** (solo admin)
Envía mensajes masivos a segmentos de clientes (ej: "todos los cosmetólogos de Córdoba"). Puedes segmentar, vista previa y controlar cada envío.

### 📋 **Plantillas** (solo admin)
Gestiona las plantillas de Meta para usar en mensajes y difusiones. Aquí se crean nuevas plantillas, se suben imágenes de header, etc.

### 🎯 **Postventa** (solo admin)
Configura secuencias automáticas de mensajes 1:1 que se envían después de una compra (ej: agradecimiento, seguimiento de satisfacción).

### 📊 **Analytics** (solo admin)
Ve métricas: cuántos clientes en cada estado, tasas de conversión, costo promedio por estado, desempeño de asesoras.

### ⚙️ **Configuración** (solo admin)
Gestiona usuarios, credenciales de Meta, tipos de clientes, tags, y más.

---

## Conceptos clave

### Cliente
Es tu prospect o cliente. Tiene:
- **Nombre y teléfono** (para contactar por WhatsApp)
- **Tipo:** Cosmetóloga, Esteticista, Dermatóloga, Revendedora, etc. Determina a qué asesora se asigna.
- **Estado:** Recibido → Validación → Presupuestando → Sin comprobante → Agendado → Comprado
- **Tags:** marcas personalizadas (VIP, en seguimiento, etc.)
- **Asesora responsable:** la persona asignada

### Asesora
Es un usuario con rol de asesora. Cada asesora está responsable de ciertos **tipos de clientes**. Cuando ingresa un cliente nuevo del tipo X, se asigna automáticamente a la asesora de ese tipo.

### Conversación
Es el chat 1:1 con un cliente por un canal específico (WhatsApp o Instagram). Agrupa todos los mensajes en ese canal.

### Plantilla (Meta)
Es un mensaje predefinido en Meta Cloud API. Contiene:
- **Texto** con variables (ej: "Hola {{1}}, tu producto es {{2}}")
- **Imagen o video** (header, opcional)
- **Botones** (call-to-action, opcional)

Las plantillas deben ser aprobadas por Meta antes de usar en difusiones.

### Difusión
Es una campaña masiva. Seleccionas un segmento de clientes (ej: todas las cosmetólogas), una plantilla y las variables, y envías a todos de una vez.

### Postventa
Son secuencias de mensajes automáticos que se envían 1:1 a clientes después de un evento (compra, inactividad, cumpleaños, etc.). No son mensajes masivos, son personalizados.

---

## Flujo típico

### Para una asesora
1. Abro el CRM en mi móvil/tablet
2. Voy a **Inbox** → veo mensajes de mis clientes
3. Respondo las conversaciones activas
4. Si un cliente me pide presupuesto → voy a **Clientes**, busco al cliente, cambio su estado a "Presupuestando"
5. Si realiza una compra → cambio estado a "Comprado"

### Para el admin
1. Importo nuevos clientes vía **Clientes → Importar**
2. Reviso **Analytics** para ver cómo va el embudo
3. Creo una campaña: **Difusiones → Nueva** → selecciono segmento → elijo plantilla → envío
4. Reviso resultados en **Analytics**
5. Configuro nuevas secuencias de postventa en **Postventa**
6. Gestiono usuarios en **Configuración**

---

## Dispositivos recomendados

- **Admin:** Desktop o laptop (mucha información en pantalla)
- **Asesora:** Móvil o tablet (interfaz optimizada para touch, bandeja más importante)

---

## Seguridad

- Usa una **contraseña fuerte** (no compartas tu login)
- El CRM solo accede a clientes y conversaciones asignadas a ti según tu rol
- Todos los cambios son auditados (quién, cuándo, qué cambió)
- La sesión expira automáticamente si estás inactivo

---

## Próximos pasos

- Lee **[02-Login-Autenticacion](02-Login-Autenticacion.md)** para iniciar sesión
- Según tu rol, accede a la sección que más necesites (Asesora → [04-Inbox](04-Inbox-Conversaciones.md), Admin → [03-Clientes](03-Clientes.md))


---

# 02 — Login y Autenticación

## Acceso inicial

### Dirección
Abre tu navegador y ve a:
```
https://crm.lainternacional.com.ar
```

Automáticamente serás redirigido a la pantalla de login.

---

## Iniciar sesión

### Paso 1: Ingresa tu email
En el campo **Email**, escribe el email que el admin te proporcionó. Ejemplo:
```
asesora1@lainternacional.com.ar
```

### Paso 2: Ingresa tu contraseña
En el campo **Contraseña**, escribe la contraseña que creaste o que el admin te compartió.

> ⚠️ **Importante:** La contraseña es sensible a mayúsculas y minúsculas. Asegúrate de que Caps Lock esté apagado si lo necesitas.

### Paso 3: Haz clic en "Iniciar sesión"
Se validarán tus credenciales contra el sistema. Si son correctas, entrarás al CRM.

---

## Problemas de login

### "Usuario o contraseña incorrectos"
- Verifica que escribiste el email exactamente como te lo proporcionó el admin
- Verifica que la contraseña es correcta (sin espacios al inicio/final)
- Si olvidaste tu contraseña, contacta al administrador

### "Cuenta desactivada"
- Tu cuenta ha sido desactivada por el admin
- Contacta con tu administrador

### "El servidor no responde"
- Verifica tu conexión a internet
- Espera unos segundos e intenta de nuevo
- Si el problema persiste, el servidor puede estar en mantenimiento

---

## Después de iniciar sesión

Una vez logueado, verás:
- Tu nombre en la esquina superior derecha
- El menú del lado izquierdo con las opciones disponibles según tu rol
- Tu bandeja de inbox lista para revisar mensajes

### Navegación por rol

**Si eres asesora:**
- Inbox (bandeja de mensajes)
- Clientes (tus clientes asignados)

**Si eres administrador:**
- Inbox
- Clientes
- Difusiones
- Plantillas
- Postventa
- Analytics
- Configuración

---

## Cerrar sesión

### Método 1: Menú de usuario
1. Haz clic en tu nombre o avatar en la esquina superior derecha
2. Selecciona "Cerrar sesión"

### Método 2: Automático
Tu sesión expirará automáticamente si:
- Estás inactivo por más de **1 hora**
- Cierres tu navegador (depende de la configuración)
- Otro dispositivo inicia sesión con tu cuenta simultáneamente

---

## Cambiar contraseña

### En Configuración (solo admin)
1. Ve a **Configuración** → **Mi cuenta**
2. Haz clic en **Cambiar contraseña**
3. Ingresa tu contraseña actual
4. Ingresa la nueva contraseña (mínimo 8 caracteres)
5. Confirma la nueva contraseña
6. Haz clic en **Guardar**

### Para asesoras
Si necesitas cambiar tu contraseña, contacta con el administrador.

---

## Perfil y preferencias

### Ver tu perfil
1. Haz clic en tu nombre (esquina superior derecha)
2. Selecciona "Mi perfil"

Aquí puedes ver:
- Tu nombre completo
- Tu email
- Tu rol (Admin / Asesora)
- Tu teléfono asignado (si aplica)
- Fecha de creación de cuenta

---

## Tokens de acceso y seguridad

### ¿Qué es un token?
Después de iniciar sesión, el CRM guarda un "token" (código de seguridad temporal) en tu navegador. Este token te permite usar el CRM sin ingresar contraseña en cada página.

### Validez del token
- Un token normal dura **24 horas**
- Se renueva automáticamente mientras uses el CRM
- Si estás inactivo por **1 hora**, se invalida

### Logout seguro
Si cierras sesión:
- El token se elimina de tu navegador
- Debes volver a iniciar sesión para usar el CRM
- Otros dispositivos con tu cuenta no se ven afectados

---

## Acceso desde múltiples dispositivos

Puedes iniciar sesión en varios dispositivos simultáneamente (móvil, tablet, desktop). Cada dispositivo tiene su propia sesión. Si cierras sesión en uno, no afecta a los otros.

---

## Tips de seguridad

✅ **Haz:**
- Usa una contraseña fuerte (mezcla de letras, números, símbolos)
- Cierra sesión antes de abandonar una computadora compartida
- Revisa periódicamente tus permisos de account en Configuración

❌ **No hagas:**
- Compartas tu contraseña con otros
- Dejes sesión abierta en dispositivos públicos
- Guardes tu contraseña en un bloc de notas sin encriptar

---

## Problemas frecuentes

**P: Me olvié mi contraseña, ¿qué hago?**
R: Contacta al administrador del CRM. Él puede resetear tu contraseña temporalmente.

**P: ¿Puedo cambiar mi email?**
R: No desde el CRM. El admin debe cambiar tu email en la base de datos.

**P: ¿Qué pasa si me hackean la cuenta?**
R: Contacta inmediatamente al admin para cambiar contraseña. Todos los cambios en tu cuenta quedan registrados.

**P: ¿Cuál es mi teléfono de usuario?**
R: Si tienes rol de asesora, el admin te asignó un teléfono. Este aparece en tu perfil y se usa para postventa automática.

---

Vuelve a **[MANUAL-USUARIO](../MANUAL-USUARIO.md)** o accede a la siguiente sección: **[03-Clientes](03-Clientes.md)**.


---

# 03 — Gestión de Clientes

## Descripción general

La sección **Clientes** es tu directorio centralizado. Aquí ves todos los clientes asignados a ti (si eres asesora) o de toda la empresa (si eres admin). Puedes buscar, filtrar, crear nuevos clientes e importar desde CSV.

---

## Acceder a Clientes

1. Ve a **Clientes** en el menú izquierdo
2. Verás una lista con todos los clientes disponibles según tu rol

---

## Vista de lista

### Columnas principales
| Columna | Descripción |
|---------|-------------|
| **Nombre** | Nombre completo del cliente |
| **Teléfono** | Número WhatsApp (formato E.164) |
| **Tipo** | Categoría (Cosmetóloga, Esteticista, etc.) |
| **Asesora** | Persona responsable |
| **Estado** | Recibido, Validación, Presupuestando, etc. |
| **Última actividad** | Cuándo fue el último contacto |
| **Acción** | Botón para ver detalles |

### Búsqueda y filtros

#### Buscar por nombre o teléfono
1. En la barra de búsqueda, escribe:
   - Nombre (ej: "Juan García")
   - Teléfono (ej: "351" para córdoba)
   - Parte del nombre/teléfono

2. Los resultados se filtran en tiempo real

#### Filtrar por tipo de cliente
1. Haz clic en **Filtrar por tipo**
2. Selecciona uno o más tipos:
   - Cosmetóloga
   - Esteticista
   - Dermatóloga
   - Revendedora
   - Otros

3. Solo se mostrarán clientes de esos tipos

#### Filtrar por estado
1. Haz clic en **Filtrar por estado**
2. Selecciona:
   - Recibido
   - Validación
   - Presupuestando
   - Sin comprobante
   - Agendado
   - Comprado

3. Los resultados se actualizan

---

## Ver detalles de un cliente

### Acceder al perfil
1. Busca el cliente en la lista
2. Haz clic en el botón **Ver detalles** o en el nombre del cliente

### Pantalla de detalles

Aquí verás toda la información del cliente:

#### 👤 Información básica
- **Nombre completo**
- **Teléfono** (normalizado a formato E.164: +549XXXXXXXXX)
- **Email**
- **Ciudad y provincia**
- **Tipo de cliente** (Cosmetóloga, etc.)
- **Es profesional** (sí/no, con matrícula si aplica)

#### 📊 Estado del cliente
- **Estado actual** (Recibido, Presupuestando, etc.)
- **Historial de cambios** (quién cambió, cuándo)
- **Botón para cambiar estado** (si tienes permisos)

#### 🏷️ Tags
Etiquetas personalizadas asignadas al cliente:
- VIP
- En seguimiento
- Contacto directo
- Otras personalizadas

Para **agregar un tag:**
1. Haz clic en **+ Agregar tag**
2. Selecciona un tag existente o crea uno nuevo
3. Se guarda automáticamente

Para **quitar un tag:**
1. Haz clic en la **X** junto al tag
2. Se elimina

#### 📝 Notas
Espacio para añadir notas internas sobre el cliente:
- Preferencias
- Restricciones
- Historiales de contacto
- Cualquier cosa importante

Para editar:
1. Haz clic en **Editar notas**
2. Escribe tu nota
3. Haz clic en **Guardar**

#### 💬 Conversaciones recientes
Muestra los últimos mensajes con el cliente (última actividad por WhatsApp/Instagram).

---

## Cambiar estado del cliente

El estado representa dónde está el cliente en tu embudo de ventas:

```
Recibido → Validación → Presupuestando → Sin comprobante → Agendado → Comprado
```

### Cambiar estado manualmente
1. En el perfil del cliente, busca **Estado actual**
2. Haz clic en **Cambiar estado**
3. Selecciona el nuevo estado
4. Haz clic en **Guardar**

### Estados explicados
| Estado | Significa | Siguiente acción |
|--------|-----------|------------------|
| **Recibido** | Nuevo cliente, sin validar | Contactar para confirmar datos |
| **Validación** | Verificando si es cliente real | Esperar confirmación |
| **Presupuestando** | Mostró interés, pidió presupuesto | Enviar presupuesto |
| **Sin comprobante** | Compró pero no tiene comprobante | Esperar comprobante |
| **Agendado** | Tiene cita programada | Recordatorio antes de cita |
| **Comprado** | Venta concretada | Postventa automática (si aplica) |

---

## Crear un cliente nuevo

### Paso 1: Ir a crear cliente
1. En la página **Clientes**, haz clic en **+ Nuevo cliente**
2. O desde el menú: **Clientes → Crear nuevo**

### Paso 2: Completa el formulario

#### Datos obligatorios
- **Nombre completo** — ej: "María García"
- **Teléfono** — ej: "+549351672095" o "09351672095"
  - El sistema normaliza automáticamente a E.164
  - Debe ser un número argentino válido

#### Datos opcionales
- **Email** — ej: maria@ejemplo.com
- **Tipo de cliente** — selecciona: Cosmetóloga, Esteticista, etc.
  - La asesora se asigna automáticamente según el tipo
- **Ciudad**
- **Provincia**
- **Es profesional** — marca si tiene matrícula
  - Si sí, agrega número de matrícula
- **Notas** — agregá cualquier dato relevante
- **Tags** — asigna tags iniciales (VIP, en seguimiento, etc.)

### Paso 3: Guardar
1. Haz clic en **Guardar cliente**
2. Si todo es correcto, el cliente aparecerá en la lista
3. Si hay error (teléfono duplicado, datos inválidos), verás un mensaje de error

### Anti-duplicación automática
Si el teléfono ya existe en el sistema, el CRM te alertará:
- "Este teléfono ya pertenece a otro cliente"
- Te mostrará el cliente existente
- Puedes decidir si actualizar ese cliente o cancelar

---

## Importar clientes desde CSV

### Cuándo usar
- Tienes una lista grande de clientes (100+)
- Necesitas cargar datos de una hoja de cálculo
- Quieres evitar crear uno por uno

### Requisitos
- Archivo CSV (.csv)
- Columnas mínimas: `nombre`, `teléfono`
- Columnas opcionales: `email`, `tipo`, `ciudad`, `provincia`, `es_profesional`

### Paso 1: Preparar el CSV

Tu archivo debe verse así (ejemplo):

```
nombre,teléfono,tipo,ciudad,provincia
Juan García,+549351234567,Cosmetóloga,Córdoba,Córdoba
María López,+549351234568,Esteticista,Rosario,Santa Fe
Carlos Martínez,+549351234569,Revendedora,La Plata,Buenos Aires
```

**Puntos importantes:**
- Encabezados en la primera fila
- Teléfonos con `+54` (formato E.164)
- Tipos deben coincidir con los tipos definidos
- Sin líneas vacías en el medio

### Paso 2: Acceder a importar
1. Ve a **Clientes**
2. Haz clic en **Importar clientes**
3. Selecciona tu archivo CSV

### Paso 3: Revisar duplicados (detección automática)
El sistema analiza el CSV y te muestra:
- ✅ Clientes a importar (nuevos)
- ⚠️ **Duplicados potenciales** (ya existen)
  - Muestra el cliente existente vs. el que quieres importar
  - Puedes elegir: **Actualizar**, **Saltear** o **Crear duplicado**

Ejemplo de pantalla de duplicados:
```
⚠️ Duplicado encontrado:
   Teléfono: +549351234567
   Existente:  Juan García (tipo: Cosmetóloga)
   Nuevo:      J. García (tipo: Cosmetóloga)
   
   ○ Actualizar con datos nuevos
   ○ Saltear este cliente
   ○ Crear como cliente separado
```

### Paso 4: Confirmar importación
1. Revisa el resumen:
   - Nuevos a crear: N
   - Duplicados: M (elige acción para cada uno)
2. Haz clic en **Confirmar importación**
3. El sistema importa los clientes y muestra el resultado:
   - "Importación exitosa: N nuevos, M actualizados"

---

## Editar un cliente existente

### Desde la lista
1. Busca el cliente
2. Haz clic en **Ver detalles**

### Desde el perfil
1. Haz clic en **Editar**
2. Modifica los campos que quieras
3. Haz clic en **Guardar cambios**

### Campos editables
- Nombre
- Teléfono (cuidado, puede afectar conversaciones)
- Email
- Tipo
- Ciudad, provincia
- Es profesional / Matrícula
- Notas
- Tags

---

## Eliminar un cliente

⚠️ **Advertencia:** No se recomienda borrar clientes (se pierden conversaciones). Mejor desactivarlos con soft-delete.

Si realmente necesitas borrar:
1. En el perfil del cliente, haz clic en **⋮ Más opciones**
2. Selecciona **Eliminar cliente**
3. Confirma la acción
4. Se marca como eliminado (soft-delete): no aparece en listas normales, pero el historial se mantiene

---

## Asignación de clientes a asesoras

### Automática (por tipo)
- Cuando creas un cliente o importas uno
- El sistema busca el `ClientType` del cliente
- Asigna automáticamente a la asesora definida para ese tipo

### Manual (admin)
1. En el perfil del cliente, haz clic en **Cambiar asesora**
2. Selecciona una asesora de la lista
3. Haz clic en **Guardar**

---

## Visualización por rol

### Si eres asesora
- Solo ves clientes asignados a ti
- No puedes importar
- No puedes crear clientes (contacta al admin)
- Puedes cambiar datos de tus clientes (notas, tags, estado)

### Si eres admin
- Ves todos los clientes
- Puedes buscar por asesora
- Puedes importar, crear, editar, eliminar cualquier cliente
- Puedes reasignar clientes entre asesoras

---

## Tips y buenas prácticas

✅ **Haz:**
- Usa nombres claros y completos
- Mantén teléfonos en formato E.164 (+54...)
- Asigna tags consistentemente (VIP, etc.)
- Actualiza notas después de contactos importantes
- Revisa duplicados antes de importar

❌ **Evita:**
- Duplicar clientes intencionalmente
- Borrar clientes (mejor desactiva)
- Teléfonos incompletos o mal formateados
- Dejar clientes sin asignar a una asesora

---

## Troubleshooting

**P: Dice "Teléfono duplicado" pero no lo veo en la lista**
R: Busca con la secuencia de dígitos sin el +54. El cliente puede estar bajo otro nombre.

**P: No puedo cambiar el tipo de cliente**
R: Solo el admin puede cambiar tipos. Si necesitas, contacta al administrador.

**P: Los tags que creo no aparecen para otros clientes**
R: Los tags se crean automáticamente la primera vez. Todos los usuarios los verán disponibles para futuros clientes.

**P: ¿Puedo ver clientes de otras asesoras?**
R: Si eres asesora, no. Si eres admin, sí. Usa el filtro **Por asesora**.

---

Vuelve a **[MANUAL-USUARIO](../MANUAL-USUARIO.md)** o accede a la siguiente sección: **[04-Inbox-Conversaciones](04-Inbox-Conversaciones.md)**.


---

# 04 — Inbox y Conversaciones

## Descripción general

El **Inbox** es tu bandeja de mensajes unificada. Aquí ves todas las conversaciones activas de tus clientes por **WhatsApp e Instagram en un solo lugar**. Es el corazón del CRM donde pasas la mayoría del tiempo respondiendo.

---

## Acceder al Inbox

1. En el menú izquierdo, haz clic en **Inbox**
2. Se abre tu bandeja con todas las conversaciones

### Navegación automática
Si accedes a una conversación específica (ej: `/conversations/123`), te lleva directamente a ese chat.

---

## Vista de Inbox

La pantalla del Inbox se divide en tres áreas:

### 1️⃣ Panel de conversaciones (izquierda)
Lista de todas tus conversaciones activas. Cada fila muestra:
- **Avatar del cliente** (foto/iniciales)
- **Nombre del cliente**
- **Último mensaje** (preview de texto)
- **Hora del último mensaje** ("hace 5 min", "hace 1 hora", etc.)
- **Indicador de no leídos** (número rojo si hay mensajes sin leer)
- **Estado** (pequeño chip: Recibido, Validación, etc.)

### 2️⃣ Chat (centro)
Muestra la conversación completa con el cliente seleccionado:
- Historial de mensajes
- Timestamp de cada mensaje
- Indicadores de estado (enviado, entregado, leído)

### 3️⃣ Panel de cliente (derecha, opcional)
Información del cliente:
- Nombre, teléfono, tipo
- Asesora responsable
- Estado actual
- Acceso rápido a perfil

---

## Buscar conversaciones

### Buscar por nombre o teléfono
1. En la barra de búsqueda (arriba del panel izquierdo)
2. Escribe:
   - Nombre del cliente: "Juan", "María"
   - Teléfono: "351...", "9..."
3. Los resultados se filtran en tiempo real

### Filtrar por estado
1. Haz clic en **Filtrar por estado**
2. Selecciona: Recibido, Validación, Presupuestando, etc.
3. Solo verás conversaciones de clientes en ese estado

---

## Responder mensajes

### Paso 1: Selecciona la conversación
1. En el panel izquierdo, haz clic en el cliente que quieres responder
2. Su chat se abre en el centro

### Paso 2: Escribe el mensaje
1. En la barra de entrada (abajo del chat)
2. Escribe tu respuesta

### Paso 3: Envía el mensaje
1. Presiona **Enter** o haz clic en el botón **Enviar**
2. El mensaje se envía por WhatsApp o Instagram al cliente
3. Aparecerá en el chat con un check gris (enviado)

### Indicadores de estado del mensaje

| Indicador | Significado |
|-----------|------------|
| ✓ (gris) | Enviado (salió de nuestro servidor) |
| ✓✓ (gris) | Entregado (llegó al teléfono del cliente) |
| ✓✓ (azul) | Leído (el cliente lo leyó) |
| ⚠️ | Falló (no se pudo enviar) |

---

## Escribir mensajes

### Texto simple
Escribe normalmente y presiona Enter.

### Saltos de línea
Para saltar líneas sin enviar:
- **Mobil:** presiona Shift + Enter
- **Desktop:** presiona Shift + Enter o Ctrl + Enter (según navegador)

### Emojis
1. Usa el ícono 😊 (si está disponible)
2. O copia/pega emojis directamente
3. O en computadora, usa el atajo del SO

### Caracteres especiales
Todos los caracteres se soportan: ñ, acentos, símbolos, etc.

---

## Enviar media (imágenes, videos, etc.)

### Si el cliente tiene opt-in habilitado
1. En el chat, busca el ícono de **📎 Adjuntar**
2. Selecciona: Imagen, Video, Audio, Documento
3. Elige el archivo de tu computadora/teléfono
4. Se carga y envía al cliente

### Limitaciones
- Tamaño máximo por archivo: depende de Meta (típicamente 16 MB)
- Formatos soportados:
  - Imágenes: JPG, PNG, GIF, WebP
  - Videos: MP4, 3GP
  - Audio: MP3, OGG
  - Documentos: PDF, DOCX, XLS, etc.

---

## Cambiar estado del cliente desde el chat

Mientras estás en una conversación, puedes cambiar el estado del cliente sin salir del chat:

1. En el panel de cliente (derecha) o arriba del chat
2. Haz clic en **Estado actual**
3. Selecciona nuevo estado (Validación, Presupuestando, etc.)
4. Se actualiza en tiempo real

---

## Agregar tags desde el chat

1. En el panel de cliente (derecha)
2. Haz clic en **+ Agregar tag**
3. Selecciona o crea un tag
4. Se asigna al cliente

---

## Marcar como leído/no leído

### Marcar conversación como leída
1. En el panel izquierdo, busca la conversación con indicador de no leídos
2. Haz clic en ella (automáticamente se marca como leída)

### Marcar como no leído (para recordar después)
1. En la lista, mantén presionado (móvil) o haz clic derecho (desktop)
2. Selecciona **Marcar como no leído**
3. La conversación volverá a aparecer con el número rojo

---

## Silenciar/Notificaciones

### Silenciar una conversación
Si un cliente es muy activo y quieres evitar notificaciones:
1. En el panel izquierdo, busca la conversación
2. Mantén presionado (móvil) o haz clic derecho (desktop)
3. Selecciona **Silenciar notificaciones**
4. No recibirás alertas, pero seguirás viendo el chat

### Activar notificaciones nuevamente
1. Mismo proceso
2. Selecciona **Activar notificaciones**

---

## Ver historial de conversaciones archivadas

### Buscar conversaciones antiguas
1. Si no ves una conversación en el Inbox (porque es muy antigua)
2. Usa el buscador: escribe el nombre o teléfono
3. Aparecerá aunque sea archivada
4. Puedes continuar la conversación

---

## Elementos multimedia en el chat

### Visualizar imágenes
- Las imágenes se muestran directamente en el chat (thumbnail)
- Haz clic para ver tamaño completo

### Descargar archivos
- Documentos, imágenes, videos: haz clic en el ícono de descarga
- Se descarga a tu dispositivo

### Videos y audio
- Se reproducen en el chat (si soporta el navegador)
- Si no, hay un botón de descarga

---

## Gestión de conversaciones

### Bloquear cliente
Si un cliente es abusivo:
1. En el chat, haz clic en **⋮ Más opciones**
2. Selecciona **Bloquear cliente**
3. Ya no recibirás mensajes de este número
4. Puedes desbloquear después en Configuración

### Reportar cliente
Si el cliente envía spam o contenido inapropiado:
1. En el chat, haz clic en **⋮ Más opciones**
2. Selecciona **Reportar**
3. Se registra para que el admin lo revise

### Cerrar conversación
Si la venta fue concretada y no necesitas más contacto:
1. Cambia estado del cliente a **Comprado**
2. La conversación se archiva automáticamente
3. Si el cliente vuelve a escribir, se abre automáticamente

---

## Escritorio vs. Mobile

### Escritorio (admin)
- Panel de conversaciones (izquierda) + Chat (centro) + Detalles cliente (derecha)
- Más información visible
- Ideal para admin manejando múltiples clientes

### Mobile (asesora)
- Vista adaptada a pantalla chica
- Panel izquierdo: lista de conversaciones (desliza para ver más)
- Centro: el chat principal
- Detalles cliente: se abre en modal si toca el nombre

---

## Configuración de bandeja

### Ordenar conversaciones
Las conversaciones se ordenan por **última actividad** (más reciente arriba). No se puede cambiar este orden.

### Vista compacta vs. normal
El CRM detecta automáticamente el tamaño de pantalla. Adapta la interfaz según dispositivo.

---

## Acceso por rol

### Si eres asesora
- Ves solo tus conversaciones (clientes asignados a ti)
- Puedes responder, cambiar estado, agregar tags
- No puedes ver conversaciones de otras asesoras

### Si eres admin
- Ves todas las conversaciones de todos los clientes
- Puedes filtrar por asesora
- Puedes responder como si fueras la asesora (identificación visible)

---

## Tips y buenas prácticas

✅ **Haz:**
- Responde rápido (mejor en menos de 1 hora)
- Actualiza estado del cliente cuando cambia
- Usa tags para organizar seguimientos
- Adjunta documentos importantes (presupuestos, confirmaciones)
- Archiva conversaciones cuando termina el proceso

❌ **Evita:**
- Usar lenguaje inapropiado o grosero
- Hacer promesas que no puedas cumplir
- Dejar mensajes sin leer por mucho tiempo
- Enviar información confidencial de otros clientes

---

## Troubleshooting

**P: No veo un cliente que debería estar en mi Inbox**
R: Puede estar asignado a otra asesora. Si eres admin, busca por nombre. Si eres asesora, contacta al admin.

**P: El mensaje no se envía, ¿qué pasa?**
R: Verifica tu conexión a internet. Si persiste, el cliente puede estar bloqueado en WhatsApp o Meta puede estar en mantenimiento.

**P: ¿Cuánto tiempo se guarda el historial?**
R: Indefinidamente. Todos los mensajes quedan en la BD. Puedes buscar conversaciones de hace años.

**P: ¿Puedo recuperar un mensaje que envié por error?**
R: No hay función de "deshacer" en esta versión. El mensaje se envía inmediatamente. Envía un segundo mensaje corrigiendo el error.

---

Vuelve a **[MANUAL-USUARIO](../MANUAL-USUARIO.md)** o accede a la siguiente sección: **[05-Difusiones](05-Difusiones.md)**.


---

# 05 — Difusiones Masivas

> ⚠️ **Solo disponible para administradores**

---

## Descripción general

Las **difusiones** te permiten enviar mensajes masivos a segmentos de clientes (ej: todos los cosmetólogos de Córdoba) usando plantillas aprobadas por Meta. Es útil para campañas, recordatorios, promociones.

---

## ¿Qué es una difusión?

Una difusión es:
- **Mensaje enviado a múltiples clientes** en una sola acción
- **Desde una plantilla Meta** (pre-aprobada, con variables)
- **Con segmentación** (selecciona qué clientes reciben)
- **En modo test o producción** (test = todos van a un número de prueba)
- **Auditada** (se registra quién envió, cuándo, cuántos recibieron)

---

## Acceder a Difusiones

1. Ve a **Difusiones** en el menú izquierdo
2. Verás:
   - **Historial** (todas las difusiones pasadas)
   - Botón **+ Nueva difusión**

---

## Ver historial de difusiones

### Columnas
| Columna | Descripción |
|---------|-------------|
| **Fecha** | Cuándo se envió |
| **Plantilla** | Nombre de la template usada |
| **Segmento** | Tipo de cliente (Cosmetóloga, etc.) |
| **Enviados** | Cantidad de mensajes exitosos |
| **Fallidos** | Cantidad que no se entregaron |
| **Costo** | ARS total gastado en Meta |
| **Modo** | Test o Producción |
| **Enviado por** | Quién ejecutó la difusión |
| **Acción** | Ver detalles |

### Ver detalles de una difusión
1. Haz clic en el botón **Ver detalles**
2. Se abre un modal mostrando:
   - Parámetros de envío
   - Lista de destinatarios (nombre, teléfono, estado)
   - Información de costo y Meta

---

## Crear una nueva difusión (3 pasos)

### Acceder a crear difusión
1. Haz clic en **+ Nueva difusión**
2. Se abre el wizard de 3 pasos

---

## Paso 1: Seleccionar segmento

### ¿Qué es un segmento?
Un segmento es un grupo de clientes que comparten una característica (tipo, estado, etc.).

### Opciones de segmentación

#### Por tipo de cliente (recomendado)
1. Selecciona **Segmento por tipo**
2. Elige un tipo:
   - Cosmetóloga
   - Esteticista
   - Dermatóloga
   - Revendedora
   - Todos

3. Se muestra:
   - Cantidad de clientes que coinciden
   - Asesora responsable de ese tipo
   - Botón **Siguiente** para continuar

**Ejemplo:**
```
Tipo seleccionado: Cosmetóloga
Cantidad de clientes: 47
Asesora responsable: María García
```

#### Por estado (opcional)
Dentro del segmento elegido, puedes filtrar por estado:
- Recibido
- Validación
- Presupuestando
- Sin comprobante
- Agendado

**Combina:**
```
Tipo: Cosmetóloga
Estado: Presupuestando
Total: 12 clientes
```

#### Por tags (opcional)
Si necesitas segmento muy específico:
1. Selecciona clientes con tags específicos (VIP, en seguimiento, etc.)

### Resumen del segmento
Antes de continuar, se muestra:
- Cantidad final de destinatarios
- Advertencia si son muchos (>1000): "¿Seguro? Esto enviará X mensajes"
- Botón **Siguiente → Paso 2**

---

## Paso 2: Seleccionar plantilla

### Listar plantillas disponibles

Se muestran solo las plantillas **de tipo difusión** o **uso tanto difusión como postventa**:

| Columna | Info |
|---------|------|
| **Nombre** | Nombre de la template |
| **Categoría** | Marketing, Utility, Authentication |
| **Estado Meta** | APPROVED, PENDING, REJECTED |
| **Tipo de header** | Sin header, Texto, Imagen, Video |
| **Variables** | `{{1}}`, `{{2}}`, etc. |

### Filtrar plantillas
1. **Por categoría:** Marketing (promos), Utility (confirmaciones), Authentication (códigos)
2. **Por estado:** Solo APPROVED se pueden usar
3. **Por búsqueda:** Escribe el nombre

### Seleccionar plantilla
1. Haz clic en la plantilla
2. Se muestra **preview** con variables vacías
3. Botón **Seleccionar esta plantilla**

### Vista de preview de plantilla

```
┌─────────────────────────────────────┐
│ Plantilla: "Promoción Especial"      │
│                                     │
│ Header (Imagen):                    │
│ [preview de imagen]                 │
│                                     │
│ Cuerpo:                             │
│ "Hola {{1}}, tenemos oferta en      │
│  {{2}} especialmente para {{3}}"    │
│                                     │
│ Botones:                            │
│ [Ver catálogo]  [Más info]         │
└─────────────────────────────────────┘

Variables:
{{1}} = Nombre del cliente
{{2}} = Producto
{{3}} = Tipo de cliente
```

---

## Paso 3: Mapear variables y confirmar

### Mapeo de variables
Si la plantilla tiene variables ({{1}}, {{2}}, etc.), aquí las asocias con datos reales:

| Variable | Tu entrada | Resultado |
|----------|-----------|----------|
| `{{1}}` | Nombre del cliente | Se reemplaza automáticamente |
| `{{2}}` | Producto | (escribes el valor fijo para todos) |
| `{{3}}` | Tipo | Se reemplaza automáticamente |

### Variables automáticas
- `{{nombre}}` → se reemplaza con el nombre de cada cliente
- `{{tipo}}` → se reemplaza con el tipo del cliente
- `{{ciudad}}` → se reemplaza con la ciudad del cliente

### Variables manuales
- `{{2}} = "Cremas Anti-Edad"` → mismo valor para todos los clientes

### Entrada de variables
1. Para cada variable, ingresa:
   - Nombre/descripción (qué significa)
   - Valor (fijo o dinámico)

2. Ejemplo:
```
Variable {{1}}: nombre (automático del cliente)
Variable {{2}}: producto_categoria 
              → "Línea Premium"
Variable {{3}}: tipo (automático del cliente)
```

### Vista previa personalizada

Antes de enviar, ves ejemplos con datos reales:

```
Ejemplo 1 (Cliente: Juan García, Cosmetóloga):
"Hola Juan García, tenemos oferta en 
 Línea Premium especialmente para Cosmetóloga"

Ejemplo 2 (Cliente: María López, Esteticista):
"Hola María López, tenemos oferta en 
 Línea Premium especialmente para Esteticista"
```

### Confirmación final

Elige **modo de envío:**

#### Modo TEST
- Todos los mensajes van a un número de prueba (admin definido)
- No se gastan créditos de Meta
- Ideal para verificar antes de enviar masivo
- Se ve claramente: "TEST MODE"

**Límite:** hasta 20 mensajes en test

#### Modo PRODUCCIÓN
- Los mensajes se envían a los clientes reales
- Se gastan créditos Meta (ARS según tarifa)
- Se cobra por mensaje enviado (típicamente $10-20 ARS cada uno)
- Confirmación adicional: "¿Seguro enviar a 47 clientes?"

### Enviar difusión

1. Verifica:
   - Segmento: correcto
   - Plantilla: correcta
   - Variables: bien mapeadas
   - Modo: test o producción (según necesidad)

2. Haz clic en **Enviar difusión**

3. Progreso en vivo:
```
Enviando...
━━━━━━━━━━━━━━━━━━ 50%
Enviados: 23 / 47
Fallidos: 1
Costo: $230 ARS
```

4. Al terminar:
```
✅ Difusión completada
   - 46 enviados
   - 1 fallido (número bloqueado)
   - Costo total: $460 ARS
```

---

## Costos y Meta

### Tarifa Meta
Meta cobra por cada mensaje enviado según:
- **País:** Argentina
- **Tipo de template:** Marketing (más caro), Utility (más barato)
- **Volumen:** a mayor volumen, mejor tarifa

**Tarifa típica (sujeta a cambios):**
- Marketing: $20-30 ARS por mensaje
- Utility: $5-10 ARS por mensaje

### Detalles de costo
Cada difusión registra:
- Costo en ARS (según tipo de cambio USD→ARS)
- Costo en USD (según tarifa Meta)
- Fecha del cambio aplicado

### Ver costos en Analytics
Ve a **Analytics** para ver:
- Costo total gastado por período
- Costo promedio por estado
- ROI estimado por segmento

---

## Errores comunes en difusiones

### "Plantilla no aprobada"
- La plantilla está en estado PENDING o REJECTED
- Espera a que Meta la apruebe (típicamente 1-2 horas)
- O crea una nueva

### "Sin variable de nombre/personalizacion"
- Las difusiones mass deben tener al menos 1 variable personalizada
- Agrega `{{1}}` → nombre del cliente

### "No hay clientes en el segmento"
- El segmento seleccionado no tiene clientes
- Verifica: ¿hay clientes de ese tipo? ¿todos tienen opt-in?

### "Error de envío en Meta"
- Meta rechazó el mensaje (puede ser contenido)
- Verifica el contenido de la plantilla
- Contacta a Meta si persiste

### "Algunos mensajes fallaron"
- Es normal que 1-2% falle por:
  - Número bloqueado
  - Cliente sin WhatsApp activo
  - Errores de red temporales
- Se reintenta automáticamente 2-3 veces

---

## Opt-in y cumplimiento legal

### ¿Qué es opt-in?
El cliente marcó "sí" a recibir difusiones. En la BD:
- Campo `opt_in_broadcasts = true`
- El CRM **solo envía a clientes con opt-in**

### Desmarcar opt-in
1. Si un cliente se queja, ve a su perfil
2. Marca **Opt-out**
3. Ya no recibe difusiones (aunque esté en el segmento)

### Nota legal
- Cumplimos CAENE (Cámara Argentina de Ecommerce)
- Cada difusión incluye opción de desuscribirse (link footer)
- Registramos quién opt-out y cuándo

---

## Tips para difusiones exitosas

✅ **Haz:**
- Comienza con modo TEST para verificar
- Personaliza con variables (nombre, tipo, ciudad)
- Usa templates APPROVED de Meta
- Segmenta bien (tipos específicos, estados listos)
- Revisa costos antes de enviar masivo

❌ **Evita:**
- Enviar masivo sin test primero
- Usar templates no aprobadas
- Enviar a segmentos con opt-out
- Cambiar variables en último momento
- Enviar difusiones muy frecuentes (spam)

---

Vuelve a **[MANUAL-USUARIO](../MANUAL-USUARIO.md)** o accede a la siguiente sección: **[06-Plantillas](06-Plantillas.md)**.


---

# 06 — Plantillas Meta

> ⚠️ **Solo disponible para administradores**

---

## Descripción general

Las **plantillas** son mensajes preaprobados por Meta que usas para difusiones masivas y postventa. Aquí creas, editas, subes imágenes y gestiona las plantillas.

---

## ¿Qué es una plantilla Meta?

Una plantilla es un mensaje predefinido con:
- **Texto** con variables (ej: `Hola {{1}}, bienvenido a {{2}}`)
- **Encabezado** opcional (imagen, video o texto)
- **Botones** opcionales (call-to-action)
- **Estado de aprobación** (APPROVED, PENDING, REJECTED)
- **Categoría** (Marketing, Utility, Authentication)

Meta **debe aprobar** cada plantilla antes de usar. Típicamente tarda 1-2 horas.

---

## Acceder a Plantillas

1. Ve a **Plantillas** en el menú izquierdo
2. Verás:
   - **Listado** de todas tus plantillas
   - Botón **+ Nueva plantilla**

---

## Ver lista de plantillas

### Columnas principales

| Columna | Descripción |
|---------|------------|
| **Nombre** | ID de la plantilla |
| **Categoría** | Marketing, Utility, Authentication |
| **Estado** | 🟢 APPROVED, 🟡 PENDING, 🔴 REJECTED |
| **Tipo de header** | Sin header, Texto, Imagen, Video |
| **Variables** | Cantidad y nombres ({{1}}, {{2}}) |
| **Creada** | Fecha de creación |
| **Uso** | Difusión, Postventa, Ambas |
| **Acción** | Ver, Editar, Eliminar |

### Filtros

#### Por categoría
```
○ Todas
○ Marketing
○ Utility
○ Authentication
```

#### Por estado
```
○ Todas
○ Aprobadas (APPROVED)
○ Pendientes (PENDING)
○ Rechazadas (REJECTED)
```

#### Por tipo de uso
```
○ Todas
○ Difusión
○ Postventa
○ Ambas
```

#### Búsqueda
Escribe el nombre o parte del nombre para encontrar la plantilla.

---

## Ver detalles de una plantilla

### Acceder
1. En la lista, haz clic en la plantilla
2. Se abre una pantalla de detalles

### Información mostrada

```
┌─────────────────────────────────────┐
│ Nombre: "Promocion_2024"            │
│ Estado: 🟢 APPROVED                 │
│ Categoría: Marketing                │
│ Creada: 12/02/2024                  │
│                                     │
│ Encabezado:                         │
│ [Imagen: 1200x627 px]               │
│                                     │
│ Cuerpo del mensaje:                 │
│ "Hola {{1}}, te ofrecemos            │
│  descuento en {{2}}.                │
│  Válido hasta {{3}}"                │
│                                     │
│ Variables:                          │
│ {{1}} = nombre (automático)         │
│ {{2}} = producto (manual)           │
│ {{3}} = fecha_oferta (manual)       │
│                                     │
│ Botones:                            │
│ [Ver oferta] → https://...          │
│ [Contacto]  → https://...           │
│                                     │
│ Uso: Difusión, Postventa            │
└─────────────────────────────────────┘
```

---

## Crear una nueva plantilla

### Paso 1: Acceder a crear
1. Haz clic en **+ Nueva plantilla**
2. Se abre formulario vacío

### Paso 2: Información básica

#### Nombre
- Identificador único en Meta
- Solo letras, números, guiones, sin espacios
- Ej: `promocion_verano_2024`, `bienvenida_nuevo_cliente`
- Meta rechazará si el nombre ya existe

#### Categoría
Selecciona una:
- **Marketing** — promociones, ofertas, anuncios (más caro)
- **Utility** — confirmaciones, estado de pedido (más barato)
- **Authentication** — códigos de verificación (a veces gratis)

Elige según el propósito del mensaje.

#### Idioma
Selecciona: **Español Argentina** (es_AR)

---

### Paso 3: Encabezado (opcional)

Un encabezado puede ser:

#### Sin encabezado
Radio button: "Sin encabezado"
→ El mensaje comienza directo con el texto

#### Encabezado de texto
Radio button: "Texto"
→ Escribe texto que aparecerá arriba del cuerpo
→ Ej: "¡Oferta especial!"

#### Encabezado de imagen
Radio button: "Imagen"
→ Sube una imagen
→ Recomendaciones:
  - Tamaño: 1200x627 px
  - Formato: JPG, PNG
  - Peso: < 5 MB
  - Debe cumplir políticas Meta (sin texto spam, llamadas de atención)

**Cómo subir imagen:**
1. Haz clic en **Subir imagen**
2. Selecciona archivo de tu computadora
3. Se carga y se muestra preview
4. Si no te gusta, haz clic en **Cambiar imagen**

#### Encabezado de video (raro)
Radio button: "Video"
→ Se requiere video en formato específico
→ Contacta al admin si necesitas

---

### Paso 4: Cuerpo del mensaje

#### Escribir el texto
1. En el campo **Mensaje**, escribe el contenido
2. Puede incluir variables: `{{1}}`, `{{2}}`, etc.
3. Máximo 1024 caracteres

#### Variables
Las variables son placeholders que se reemplazan con datos reales:

```
Texto: "Hola {{1}}, tu {{2}} llegó a {{3}}"

Cliente 1:
Hola Juan, tu pedido llegó a Córdoba

Cliente 2:
Hola María, tu pedido llegó a Buenos Aires
```

**Cómo usar variables:**
- Escribe `{{` seguido del número
- Ej: `{{1}}`, `{{2}}`, `{{3}}`
- Meta acepta hasta 20 variables
- Típicamente usas 1-5

**Variables recomendadas:**
- `{{1}}` = nombre del cliente
- `{{2}}` = producto/servicio
- `{{3}}` = ciudad/tipo/fecha
- `{{4}}` en adelante = datos específicos del negocio

---

### Paso 5: Botones (opcional)

Los botones son call-to-action que el cliente ve al pie del mensaje.

#### Agregar botón
1. Haz clic en **+ Agregar botón**
2. Completa:
   - **Texto del botón** (ej: "Ver más", "Comprar", "Contacto")
   - **Tipo:**
     - Link: lleva a una URL
     - Teléfono: inicia llamada
     - Localización: abre ubicación

3. Según el tipo:
   - **Link:** ingresa URL (debe empezar con https://)
   - **Teléfono:** ingresa número
   - **Localización:** busca dirección o coordenadas

#### Límite de botones
Meta permite máximo 2 botones por plantilla.

#### Ejemplo de plantilla con botones
```
┌──────────────────────────────────────┐
│ Hola {{1}}, te ofrecemos descuento  │
│ en {{2}}. ¡No te lo pierdas!        │
│                                      │
│ [Ver oferta] [Contactarnos]         │
└──────────────────────────────────────┘
```

---

### Paso 6: Clasificación de uso (solo admin)

¿Para qué usarás esta plantilla?

| Opción | Significa |
|--------|----------|
| Difusión | Solo para campañas masivas |
| Postventa | Solo para secuencias automáticas |
| Ambas | Se puede usar en difusiones y postventa |

Esta clasificación es **local** (no afecta Meta, es solo para organizar).

---

### Paso 7: Guardar y enviar a Meta

1. Verifica todo:
   - Nombre válido
   - Texto sin errores
   - Encabezado (si aplica) subido
   - Botones configurados (si aplica)

2. Haz clic en **Crear plantilla**

3. El CRM:
   - Valida campos
   - Envía a Meta
   - Te muestra estado: "Enviado a Meta, esperando aprobación..."

4. Meta aprueba (típicamente 1-2 horas)
   - ✅ Si es aprobada → `APPROVED`
   - ❌ Si es rechazada → `REJECTED` (muestra motivo)

---

## Editar una plantilla

### Limitaciones
Meta **no permite editar plantillas ya aprobadas**. Si necesitas cambios:

#### Opción 1: Crear nueva plantilla
1. Crea una plantilla con el contenido corregido
2. Dale un nombre parecido (ej: `promocion_v2`)
3. Elimina la plantilla antigua

#### Opción 2: Si está REJECTED o PENDING
1. Haz clic en **Editar**
2. Modifica los campos
3. Haz clic en **Actualizar**
4. Se reenvía a Meta

---

## Eliminar una plantilla

### Eliminar plantilla local
1. En la lista, busca la plantilla
2. Haz clic en **⋮ Más opciones** → **Eliminar**
3. Confirma: "¿Eliminar esta plantilla?"
4. Se elimina del CRM pero **Meta conserva un registro**

### Considerar antes de eliminar
- ¿Hay difusiones que usan esta plantilla?
- ¿Se ha enviado a clientes con esta plantilla?
- Es mejor crear "archivada" que eliminar

---

## Resubir imagen de header

Si necesitas cambiar la imagen de una plantilla APPROVED:

### Proceso
1. Ve a la plantilla
2. En el encabezado de imagen, haz clic en **Cambiar imagen**
3. Sube nueva imagen
4. El CRM actualiza en Meta automáticamente

Esto **no requiere re-aprobación** (cambio de media sin cambiar estructura).

---

## Descarga de plantilla

Puedes descargar un JSON con la definición completa de la plantilla (útil para backup o compartir):

1. En la lista, haz clic en **⋮** → **Descargar**
2. Se descarga archivo `.json` con toda la info

---

## Estados de plantilla explicados

| Estado | Qué significa | Acción |
|--------|--------------|--------|
| 🟢 **APPROVED** | Meta la aprobó, lista para usar | Envía en difusiones/postventa |
| 🟡 **PENDING** | Meta la está revisando | Espera 1-2 horas |
| 🔴 **REJECTED** | Meta la rechazó | Lee motivo, edita, reenvía |

### ¿Por qué rechaza Meta?

Motivos comunes:
- **Spam:** texto con demasiadas MAYÚSCULAS o emojis
- **Política:** links sospechosos o contenido prohibido
- **Formato:** variables mal usadas
- **Lenguaje:** palabras vedadas o incitación

Revisa el motivo y reenvía corrigiendo.

---

## Ejemplos de plantillas

### Ejemplo 1: Bienvenida
```
Nombre: bienvenida_cliente
Categoría: Utility
Encabezado: Sin
Mensaje: "Hola {{1}}, ¡bienvenido a La Internacional! 
          Somos especialistas en {{2}} y estamos 
          listos para asesorarte."
Variables: {{1}} = nombre, {{2}} = categoría
Botones: [Explorar] [Contacto]
```

### Ejemplo 2: Promoción
```
Nombre: promocion_verano
Categoría: Marketing
Encabezado: [Imagen de productos]
Mensaje: "¡Oferta especial {{1}}! 
          Este verano disfruta 30% en {{2}}.
          Válido hasta {{3}}."
Variables: {{1}} = nombre, {{2}} = producto, {{3}} = fecha
Botones: [Ver ofertas]
```

### Ejemplo 3: Confirmación de orden
```
Nombre: confirmacion_pedido
Categoría: Utility (más barato)
Encabezado: Sin
Mensaje: "Tu pedido #{{1}} ha sido confirmado.
          Entrega estimada: {{2}} días.
          Tracking: {{3}}"
Variables: Automáticas de sistema
Botones: [Rastrear] [Contacto]
```

---

## Tips y buenas prácticas

✅ **Haz:**
- Nombres descriptivos y únicos
- Prueba el texto antes de enviar a Meta
- Usa variables para personalizar
- Mantén encabezados profesionales
- Clasifica correctamente por uso

❌ **Evita:**
- Nombres con espacios o caracteres especiales
- Spam (emojis excesivos, MAYÚSCULAS)
- Links sospechosos o acortados
- Editar plantillas ya aprobadas (crear nuevas)
- Cambios de última hora antes de difusión

---

## Troubleshooting

**P: Mi plantilla fue rechazada, ¿qué hago?**
R: Lee el motivo en la sección "Motivo de rechazo". Edita la plantilla, corrige el problema, y reenvía.

**P: ¿Cuánto tarda Meta en aprobar?**
R: Típicamente 1-2 horas. En casos especiales, hasta 24 horas.

**P: ¿Puedo usar links externos en botones?**
R: Sí, pero deben ser links seguros (https://). Meta rechaza links sospechosos.

**P: ¿Cuál es el máximo de variables?**
R: Meta permite hasta 20 variables por plantilla, pero recomendamos máximo 5 para simplicidad.

**P: ¿Puedo cambiar la imagen después de aprobada?**
R: Sí, cambios de media solo no requieren re-aprobación. Cambios estructurales (texto, variables, botones) sí requieren nueva aprobación.

---

Vuelve a **[MANUAL-USUARIO](../MANUAL-USUARIO.md)** o accede a la siguiente sección: **[07-Postventa](07-Postventa.md)**.


---

# 07 — Postventa y Secuencias Automáticas

> ⚠️ **Solo disponible para administradores**

---

## Descripción general

La **postventa** te permite automatizar mensajes 1:1 a clientes después de eventos clave (compra, inactividad, cumpleaños). No es spam masivo, es seguimiento inteligente y personalizado.

---

## ¿Qué es una secuencia de postventa?

Una secuencia de postventa es:
- **Automatizada:** se ejecuta sin intervención manual
- **Personalizada:** cada cliente recibe su propio mensaje 1:1
- **Basada en eventos:** se dispara por compra, inactividad, fecha, etc.
- **Auditada:** queda registro de quién recibió qué y cuándo
- **Desacoplada de Meta Cloud API:** se envía vía whatsapp-web.js (sesión privada, no sujeta a límites de difusión)

---

## ¿Por qué postventa aparte?

Meta Cloud API tiene restricciones para mensajes 1:1 personalizados en masa. La postventa usa **sesiones WhatsApp Web privadas** (una por asesora) para sortear esto sin violar ToS.

**Ventaja:** puedes enviar mensajes más flexibles, con contenido dinámico, sin esperar aprobación de Meta.

---

## Acceder a Postventa

1. Ve a **Postventa** en el menú izquierdo
2. Verás:
   - **Secuencias activas** (lista de automatizaciones en curso)
   - **Historial de envíos** (log de quién recibió qué)
   - Botón **+ Nueva secuencia**

---

## Ver secuencias activas

### Columnas

| Columna | Descripción |
|---------|------------|
| **Nombre** | Identificador de la secuencia |
| **Trigger** | Qué evento la dispara (compra, inactividad, etc.) |
| **Plantilla** | Nombre del template usado |
| **Activa** | Habilitada o pausada |
| **Enviadas este mes** | Cantidad de mensajes esta luna |
| **Último envío** | Cuándo fue el más reciente |
| **Acción** | Pausar, Editar, Ver logs |

---

## Crear una nueva secuencia

### Paso 1: Acceder a crear
1. Haz clic en **+ Nueva secuencia**
2. Se abre formulario

### Paso 2: Información básica

#### Nombre
- Identificador único
- Ej: `agradecimiento_post_compra`, `recordatorio_inactivos`

#### Estado
- Radio button: **Habilitada** o **Pausada**
- Por defecto: Habilitada
- Puedes pausar sin eliminar

---

### Paso 3: Definir el trigger (qué dispara la secuencia)

Un trigger es el evento que activa el envío automático.

#### Opciones de trigger

##### Post-compra
```
Trigger: "Post-compra"
Descripción: Se ejecuta cuando un cliente cambia 
             de estado a "Comprado"
Delay: opcional (ej: enviar después de 3 días)
```

Uso típico: Agradecimiento, encuesta de satisfacción, recomendación de productos.

##### Inactividad
```
Trigger: "Inactividad"
Descripción: Se ejecuta si el cliente no ha 
             interactuado en X días
Días configurables: 7, 14, 30 (defecto 30)
```

Uso típico: "¿Necesitas asesoramiento?", recordatorio de oferta.

##### Cumpleaños
```
Trigger: "Cumpleaños"
Descripción: Se ejecuta en la fecha de nacimiento 
             del cliente (si la tiene registrada)
Frecuencia: Una vez al año
```

Uso típico: Ofertas especiales de cumpleaños, saludos personalizados.

##### Días personalizados
```
Trigger: "Cada N días"
Descripción: Se repite cada X días
Días: configurable (ej: cada 7 días)
Límite: máximo 1 vez al mes para evitar spam
```

Uso típico: Seguimiento semanal a clientes en gestión.

---

### Paso 4: Configurar condiciones (filtros)

Opcionalmente, puedes restringir a qué clientes aplica:

#### Tipo de cliente
- Solo Cosmetólogas
- Solo Esteticistas
- Solo Revendedoras
- Todos

#### Asesora responsable
- Solo para una asesora específica
- Todas las asesoras

#### Rango de fecha
- Solo clientes creados después del: [fecha]
- Antes del: [fecha]

**Ejemplo:**
```
Secuencia: "Bienvenida nuevos"
Trigger: Post-compra
Condición: Solo clientes creados últimos 30 días
Resultado: Solo clientes nuevos reciben el mensaje
```

---

### Paso 5: Seleccionar plantilla

Elige la plantilla de texto para usar:

1. Selecciona **Plantilla**
2. Aparecen templates marcadas como "Postventa" o "Ambas"
3. Se muestra preview

**Nota:** Las plantillas en postventa no necesitan aprobación Meta (son 1:1), pero deben estar creadas.

---

### Paso 6: Mapear variables

Si la plantilla tiene variables, asocia con datos reales:

| Variable | Tipo | Valor |
|----------|------|-------|
| `{{1}}` | Automático | Nombre del cliente |
| `{{2}}` | Manual | "Descuento especial" |
| `{{3}}` | Automático | Ciudad del cliente |

---

### Paso 7: Guardar secuencia

1. Verifica:
   - Nombre único
   - Trigger claro
   - Plantilla seleccionada
   - Condiciones sensatas

2. Haz clic en **Crear secuencia**

3. Se activa inmediatamente si está habilitada
   - Comenzará a ejecutarse según el trigger configurado

---

## Gestionar secuencias

### Ver secuencia en detalle
1. En la lista, haz clic en el nombre
2. Se abre panel con:
   - Parámetros
   - Logs de ejecución (últimas 100)
   - Estadísticas

### Pausar secuencia
1. En la lista, haz clic en **Pausar**
2. Se detiene temporalmente
3. Puedes reactivar después sin perder historial

### Editar secuencia
1. Haz clic en **Editar**
2. Modifica: nombre, trigger, condiciones, plantilla
3. Haz clic en **Guardar cambios**

**Nota:** cambios se aplican a futuros envíos, no retroactivos.

### Eliminar secuencia
1. Haz clic en **⋮ Más opciones** → **Eliminar**
2. Confirma: "¿Eliminar secuencia?"
3. **Importante:** se conserva historial, solo se elimina la regla

---

## Historial de envíos (logs)

### Ver logs de una secuencia
1. Abre la secuencia
2. Baja a **Historial de envíos**
3. Se muestra tabla:

| Columna | Info |
|---------|------|
| **Fecha** | Cuándo se envió |
| **Cliente** | Nombre y teléfono |
| **Asesora** | Quién envió (nombre asesora) |
| **Mensaje** | Preview del contenido |
| **Estado** | Enviado, Entregado, Leído, Error |
| **Error (si aplica)** | Motivo si falló |

### Filtrar logs
- Por rango de fechas
- Por estado (éxito, error)
- Por cliente

### Descargar logs
1. Haz clic en **Descargar CSV**
2. Se descarga reporte con todos los envíos de la secuencia

---

## Estadísticas de postventa

### Por secuencia
```
Secuencia: "Agradecimiento post-compra"
Enviados este mes: 12
Entregados: 11 (92%)
Fallos: 1 (8%)
Tasa de lectura: 73% (8 de 11)
```

### Global
Desde el menú **Postventa → Dashboard** (si existe):
```
Total de secuencias: 5
Activas: 4
Pausadas: 1
Mensajes enviados (mes): 47
Tasa de éxito: 96%
Tasa de lectura promedio: 72%
```

---

## Manejo de errores

### Errores comunes en postventa

#### "Sesión WhatsApp Web no disponible"
- La sesión de una asesora está offline
- El CRM reinicia automáticamente después de 1 hora
- O el admin puede forzar reconexión en **Configuración**

#### "Cliente sin teléfono registrado"
- El cliente no tiene teléfono válido
- Se salta y continúa con el siguiente

#### "Número bloqueado"
- El cliente bloqueó el WhatsApp de la asesora
- El mensaje falla con estado "blocked"
- Se reintenta después de 7 días

#### "Rate limit de Meta"
- Se alcanzó el límite de mensajes 1:1 en corto tiempo
- El CRM espera y reintenta
- El log muestra "reintentando..."

---

## Casos de uso comunes

### 1. Agradecimiento post-compra
```
Nombre: agradecimiento_compra
Trigger: Post-compra
Delay: Inmediato
Plantilla: "Gracias {{1}}, tu compra de {{2}} 
           fue procesada. ¿Necesitas más ayuda?"
Condiciones: Ninguna (todos los que compran)
```

### 2. Recordatorio de inactividad
```
Nombre: recordatorio_30dias
Trigger: Inactividad (>30 días)
Plantilla: "¡Hola {{1}}! Hace tiempo no nos vemos.
           Tenemos nuevas {{2}} especiales para ti."
Condiciones: Solo tipo "Revendedora"
```

### 3. Mensaje de cumpleaños
```
Nombre: cumpleaños_descuento
Trigger: Cumpleaños
Plantilla: "¡Feliz cumpleaños {{1}}! 🎂
           Te ofrecemos 25% en toda la {{2}}"
Condiciones: Ninguna
```

### 4. Follow-up semanal
```
Nombre: seguimiento_semanal
Trigger: Cada 7 días
Plantilla: "Hola {{1}}, ¿cómo va todo?
           Podemos ayudarte con algo?"
Condiciones: Estado = "Presupuestando"
```

---

## Límites y consideraciones

### Límite de mensajes
- Máximo 20 mensajes 1:1 por sesión por hora
- Si una secuencia genera > 20, se encola y se procesa después

### Frecuencia máxima
- Una secuencia no envía al mismo cliente > 1 vez al mes
- Protege contra spam

### Horarios
- Los mensajes se envían en **horario comercial** (9 AM - 9 PM, hora Argentina)
- Fuera de ese rango se encolan

### Reintentós
- Si un envío falla, se reintenta 2-3 veces
- Espaciado en 5, 15, 60 minutos

---

## Monitoreo y alertas

### Estado de sesiones
Ve a **Configuración → Postventa → Estado de sesiones**:
```
Asesora 1 (María):  🟢 Conectada (última actividad: hace 5 min)
Asesora 2 (Laura):  🟡 Desconectada (reconectando...)
Asesora 3 (Paula):  🔴 Offline (última sesión: 23/02)
```

### Alertas importantes
El admin recibe notificación si:
- Una sesión está desconectada > 1 hora
- Tasa de fallos > 20% en una secuencia
- Un cliente bloqueó a la asesora (se requiere desbloqueo manual)

---

## Tips y buenas prácticas

✅ **Haz:**
- Crea secuencias específicas (no "todo para todos")
- Usa triggers claros (compra, inactividad, fechas)
- Prueba primero con pequeño segmento
- Monitorea logs para ver qué está funcionando
- Pausa si hay muchos errores

❌ **Evita:**
- Triggers muy frecuentes (spam)
- Mensajes genéricos sin personalización
- Condiciones demasiado restrictivas
- Cambios en triggers sin revisar impacto
- Múltiples secuencias al mismo cliente en corto tiempo

---

## Troubleshooting

**P: ¿Por qué algunos mensajes fallan?**
R: Causas comunes: cliente bloqueó, sin teléfono, sesión offline, número incorrecto. Revisa el log para el motivo específico.

**P: ¿Puedo modificar un mensaje ya enviado?**
R: No. El mensaje ya llegó. Envía un segundo mensaje corrigiendo.

**P: ¿A qué hora se envían?**
R: Dentro de 9 AM - 9 PM hora Argentina. Si programas fuera, se encola para el siguiente horario comercial.

**P: ¿Puedo pausar una secuencia sin eliminarla?**
R: Sí, haz clic en **Pausar**. Se congela sin eliminar el historial.

**P: ¿Puedo cambiar la plantilla de una secuencia activa?**
R: Sí, edita la secuencia. Cambios aplican a futuros envíos.

---

Vuelve a **[MANUAL-USUARIO](../MANUAL-USUARIO.md)** o accede a la siguiente sección: **[08-Analytics](08-Analytics.md)**.


---

# 08 — Analytics y Reportes

> ⚠️ **Solo disponible para administradores**

---

## Descripción general

**Analytics** te muestra métricas clave del negocio:
- **Embudo de ventas:** cuántos clientes en cada estado
- **Tasas de conversión:** porcentaje que avanza en el embudo
- **Costos por estado:** cuánto gastamos en Meta por cliente
- **Desempeño de asesoras:** quién está produciendo más
- **Análisis de campañas:** qué difusiones funcionan mejor

---

## Acceder a Analytics

1. Ve a **Analytics** en el menú izquierdo
2. Verás varios dashboards y gráficos

---

## 1. Embudo de ventas

### Visualización
Un gráfico en forma de embudo mostrando:

```
┌─────────────────────────────────┐
│ Recibido               150       │
├─────────────────────────────────┤
│ Validación             95 (63%)  │
├──────────────────────┐           │
│ Presupuestando   42 (28%)        │
├──────────────┐                   │
│ Sin cpt.  18 (43%)               │
├──────────┐                       │
│ Agendado 12 (67%)               │
├────────┐                         │
│ Comprado 10 (83%)               │
└─────────────────────────────────┘
```

### Qué significa
- **Eje izquierdo:** número absoluto de clientes
- **Porcentaje:** % que avanzó desde la etapa anterior
- **Ancho:** visual, proporcional a cantidad

### Filtros disponibles
- **Por rango de fecha:** última semana, mes, año, personalizado
- **Por asesora:** una específica o todas
- **Por tipo de cliente:** Cosmetóloga, Esteticista, etc.

### Interpretación
```
Recibido → Validación: 63% de nuevos clientes se validan
Validación → Presupuestando: 44% de validados piden presupuesto
Presupuestando → Compra: 24% de presupuestos se cierran
```

Si algún porcentaje es bajo, identifica el cuello de botella y ajusta la estrategia.

---

## 2. Tabla de conversión por estado

### Vista tabular del embudo

| Estado | Total | % del total | Conversión anterior |
|--------|-------|------------|----------------------|
| Recibido | 150 | 100% | — |
| Validación | 95 | 63% | 63% de nuevos |
| Presupuestando | 42 | 28% | 44% de validados |
| Sin comprobante | 18 | 12% | 43% de presupuestando |
| Agendado | 12 | 8% | 67% de sin cpt |
| Comprado | 10 | 6.7% | 83% de agendados |

### Cómo leerla
- **Total:** número de clientes en ese estado
- **% del total:** proporción sobre el universo
- **Conversión anterior:** qué % avanzó desde la etapa previa

### Usar para identificar problemas
- Si "Validación" es muy bajo → revisar proceso de validación
- Si "Presupuestando → Comprado" es bajo → ofertas no competitivas o asesoras no cerradoras

---

## 3. Costo promedio por estado

### Gráfico de barras

```
Recibido:        $50 ARS/cliente
Validación:      $45 ARS/cliente
Presupuestando:  $60 ARS/cliente
Sin comprobante: $80 ARS/cliente
Agendado:        $75 ARS/cliente
Comprado:        $120 ARS/cliente
```

### Interpretación
- El cliente "Comprado" costó $120 en difusiones de Meta
- Si el margen por venta es > $120, es rentable
- Si es < $120, revisar estrategia

### Cálculo
Costo promedio = (Gasto total en difusiones) / (Clientes en estado)

Ejemplo:
```
Difusión a Cosmetólogas:
- 50 mensajes enviados
- Costo: $500 ARS
- Costo promedio: $10 por mensaje

Si 5 pasaron a "Presupuestando":
- Costo por presupuesto: $100 ARS
```

---

## 4. Desempeño de asesoras

### Tabla de asesoras

| Asesora | Clientes | En seguimiento | Vendieron | Tasa de cierre |
|---------|----------|---|---|---|
| María | 42 | 15 | 8 | 19% |
| Laura | 38 | 8 | 7 | 18% |
| Paula | 35 | 18 | 4 | 11% |
| Ana | 40 | 12 | 6 | 15% |

### Métricas por asesora
- **Clientes:** total asignados
- **En seguimiento:** actualmente en estado Presupuestando
- **Vendieron:** pasaron a Comprado
- **Tasa de cierre:** % de sus clientes que compraron

### Usar para evaluar
- Quién tiene mejor desempeño
- Quién necesita capacitación
- Detectar problemas de asignación (una sobrecargada, otra con pocos)

### Acción
Si una asesora tiene baja tasa:
1. Verifica cantidad de clientes (¿tiene suficientes?)
2. Revisa tiempo de respuesta en Inbox (¿responde rápido?)
3. Ofrece coaching/mentoría

---

## 5. Historial de difusiones

### Tabla de campañas

| Fecha | Campaña | Segmento | Enviados | Costo | CTR* |
|-------|---------|----------|----------|-------|-----|
| 15/02 | Promo Verano | Cosmetólogas | 120 | $600 | 8% |
| 12/02 | Recordatorio | Revendedoras | 80 | $200 | 3% |
| 08/02 | Bienvenida | Nuevas | 50 | $100 | 12% |

*CTR = Click-Through Rate (clientes que interactuaron)

### Filtros
- Por rango de fechas
- Por tipo de plantilla
- Por éxito (>90% entregados) o fallos

### Análisis
- Compara costos vs. resultados
- Qué campañas funcionaron mejor
- Optimiza futuras difusiones

---

## 6. Gráfico de tendencias

### Evolución de clientes

```
Clientes por estado (últimos 30 días)

Comprado  ▄▆██▇▅▆▇█▅  Crecimiento constante
Agendado  ▄▅▄▆▄▇▅▄▆▆  Estable
Presupuestando ▆█▇█▆▇█▆▇▅ Activo
```

### Ver patrón
- ¿Compras crecen semana a semana?
- ¿Hay dias con más presupuestos?
- ¿Qué impulsó picos?

### Usar para planificación
```
Si viernes es pico de presupuestos:
→ Planifica difusiones para jueves
→ Asesoras listas para responder viernes
```

---

## 7. ROI por difusión

### Tabla de retorno

| Difusión | Invertido | Clientes adicionales | Valor estimado | ROI |
|----------|-----------|---|---|---|
| Promo Verano | $600 | 12 | $2,400 | 300% |
| Recordatorio | $200 | 2 | $400 | 100% |
| Bienvenida | $100 | 4 | $800 | 700% |

**Fórmula:**
```
ROI = ((Valor generado - Inversión) / Inversión) * 100%
```

### Considerar
- Valor por cliente asignado (promedio de ticket)
- Período de conversión (cuánto tarda convertirse)
- Retención (clientes repetidores)

---

## 8. Filtros globales de Analytics

### Rango de fecha
- **Últimos 7 días**
- **Últimos 30 días**
- **Este mes**
- **Mes pasado**
- **Este año**
- **Personalizado** (elige fechas)

### Por asesora
- Todas
- María
- Laura
- Paula
- Ana
- (cada asesora del equipo)

### Por tipo de cliente
- Todos
- Cosmetóloga
- Esteticista
- Dermatóloga
- Revendedora

### Por estado
- Todos
- Recibido
- Validación
- Presupuestando
- Sin comprobante
- Agendado
- Comprado

---

## Exportar reportes

### Descargar como CSV
1. En cualquier tabla, haz clic en **Descargar CSV**
2. Se abre archivo en Excel
3. Edita, presenta, archiva

### Descargar como PDF (futuro)
Próximamente: opción de generar PDF de dashboards

### Compartir reportes
1. Copia la URL actual (con filtros aplicados)
2. Envía a otro admin
3. Ese admin ve exactamente lo mismo

---

## Dashboards personalizados (si disponible)

### Crear dashboard personalizado
1. Haz clic en **+ Nuevo dashboard**
2. Nombre: "Métricas Cosmetólogas"
3. Selecciona gráficos que quieres
4. Filtra por tipos/asesoras
5. **Guardar dashboard**

### Acceder después
En el menú **Analytics → Dashboards** verás:
- Dashboard principal (por defecto)
- Tus dashboards personalizados

---

## Casos de uso comunes

### Caso 1: Revisar performance semanal
1. Abre **Embudo de ventas**
2. Filtra: últimos 7 días
3. Compara con semana anterior
4. Identifica cambios

### Caso 2: Evaluar una asesora
1. Ve a **Desempeño de asesoras**
2. Haz clic en el nombre de la asesora
3. Se filtra Analytics a solo sus datos
4. Revisa embudo, tendencias, ROI

### Caso 3: Justificar inversión en Meta
1. Ve a **ROI por difusión**
2. Selecciona mes completo
3. Suma ROI de todas las campañas
4. Comparte con liderazgo

### Caso 4: Detectar cuello de botella
1. **Embudo de ventas** muestra todos los porcentajes
2. Si porcentaje bajo en una etapa → ese es el problema
3. Investiga: proceso, asesoras, competencia, precio

---

## Interpretar métricas clave

| Métrica | Qué significa | Acción si es baja |
|---------|--------------|---|
| Tasa Recibido→Validación | % de nuevos clientes que validas | Revisar proceso de validación |
| Tasa Validación→Presupuestando | % de clientes que piden presupuesto | Mejorar oferta, tiempo de respuesta |
| Tasa de cierre | % final que compran | Capacitar asesoras, revisar precio |
| Costo por cliente | Gasto Meta / clientes | Reducir frecuencia de difusiones |
| ROI | Retorno en $ | Evaluar si vale la pena difundir |

---

## Tips para lectura de datos

✅ **Haz:**
- Revisa Analytics 1 vez por semana
- Compara semana vs. semana (no absoluto)
- Identifica tendencias, no fluctuaciones únicas
- Valida números contra sistema actual
- Documenta decisiones basadas en datos

❌ **Evita:**
- Tomar decisiones por 1 punto de dato
- Cambiar estrategia cada vez que baja
- Ignorar contexto externo (vacaciones, eventos, etc.)
- Comparar períodos diferentes sin justificación

---

## Troubleshooting

**P: Un número parece mal, ¿dónde checkeo?**
R: Ve a **Clientes**, filtra por estado → busca clientes en ese estado → cuenta manual. Si no coincide, hay un bug.

**P: ¿Puedo ver analytics de clientes específicos?**
R: Parcialmente. Filtra por asesora/tipo/estado. Para cliente específico, ve a **Clientes → Detalles**.

**P: Los números cambian cada vez que actualizo**
R: Puede haber envíos en tránsito (webhooks de Meta). Espera 5 minutos y recarga.

**P: ¿Cuánto atrás puedo ver datos?**
R: Toda la historia desde que el CRM comenzó. No hay límite.

---

Vuelve a **[MANUAL-USUARIO](../MANUAL-USUARIO.md)** o accede a la siguiente sección: **[09-Configuracion](09-Configuracion.md)**.


---

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


---

# 10 — FAQ y Solución de Problemas

---

## Preguntas frecuentes

### General

**P: ¿Qué es La Internacional CRM?**
R: Es una plataforma para gestionar clientes, mensajes de WhatsApp/Instagram, campañas masivas y seguimiento de ventas. Funciona en paralelo al sistema actual de la empresa.

**P: ¿Necesito instalar algo?**
R: No. Es una app web. Solo necesitas navegador moderno y conexión a internet.

**P: ¿Funciona en móvil?**
R: Sí. Está optimizado para desktop (admin) y mobile/tablet (asesoras).

**P: ¿Mis datos son seguros?**
R: Sí. Uso HTTPS, autenticación JWT, y se aloja en Railway (plataforma segura).

---

## Login y acceso

**P: Olvidé mi contraseña, ¿qué hago?**
R: Contacta al administrador. No hay botón de "Forgot password" (por seguridad). El admin puede resetear tu contraseña.

**P: ¿Puedo usar el mismo email en múltiples cuentas?**
R: No. El email es único. El admin debe crear un email nuevo para cada usuario.

**P: ¿Mi sesión expira?**
R: Sí. Inactividad > 1 hora = sesión expira. Debes loguearte de nuevo.

**P: ¿Puedo estar logueado en 2 dispositivos a la vez?**
R: Sí. Cada dispositivo tiene su propia sesión. Cerrar en uno no afecta el otro.

**P: ¿Qué hacer si otra persona usa mi login?**
R: Contacta al admin para cambiar tu contraseña inmediatamente. El admin puede ver en Logs quién accedió.

---

## Clientes

**P: ¿Cómo busco un cliente que no encuentro?**
R: Ve a **Clientes**, barra de búsqueda. Busca por:
- Nombre (completo o parcial)
- Teléfono (completo o primeros dígitos)
- Email

Si sigue sin aparecer: ¿el cliente está en otro estado? ¿está asignado a otra asesora?

**P: ¿Puedo crear un cliente desde móvil?**
R: Sí (si eres admin o asesora con permisos). Aunque es más fácil desde desktop.

**P: ¿Qué pasa si subo un cliente duplicado?**
R: El CRM detecta por teléfono. Te muestra advertencia y opción de:
- Actualizar cliente existente
- Saltear
- Crear duplicado (no recomendado)

**P: ¿Puedo cambiar el teléfono de un cliente?**
R: Sí, pero cuidado: afecta conversaciones. Si cambias el teléfono, el historial sigue en el viejo. Mejor: crea cliente nuevo y archiva el viejo.

**P: ¿Se sincroniza con el sistema actual?**
R: No automáticamente. El admin sincroniza manualmente coordinando con el otro sistema.

---

## Inbox y conversaciones

**P: ¿Por qué no veo una conversación?**
R: Posibles razones:
- Conversación muy antigua → búscala por nombre
- Cliente asignado a otra asesora → contacta admin
- Cliente eliminado → revisa logs
- Conversación archivada → busca el cliente en Clientes

**P: ¿Cómo me marca un cliente si no tengo WhatsApp?**
R: El cliente te escribe por WhatsApp o Instagram al número configurado. Llega al Inbox del CRM.

**P: ¿Puedo ver mensajes de otros asesoras?**
R: Si eres asesora: no (privacidad). Si eres admin: sí, todas las conversaciones.

**P: ¿Se guardan los mensajes?**
R: Sí, indefinidamente. Puedes buscar conversaciones de hace años.

**P: ¿Por qué algunos mensajes fallan?**
R: Causas comunes:
- Internet del cliente desconectado
- Cliente bloqueó tu número
- Problema con Meta temporario
- Número incorrecto o inactivo

El log muestra el motivo específico.

**P: ¿Puedo borrar un mensaje?**
R: No. Una vez enviado, queda. Si cometiste error, envía mensaje de corrección.

**P: ¿Puedo silenciar notificaciones de un cliente?**
R: Sí. En la lista de Inbox, haz clic derecho (desktop) o mantén presionado (mobile) → Silenciar notificaciones.

**P: ¿Puedo bloquear a un cliente abusivo?**
R: Sí. En el chat, **⋮ Más opciones** → **Bloquear cliente**. Ya no recibirás mensajes.

---

## Difusiones

**P: ¿Cuál es la diferencia entre test y producción?**
R: **Test:** todos los mensajes van a un número de prueba, sin gastar créditos. **Producción:** los mensajes se envían a clientes reales, se cobran a Meta.

**P: ¿Cuánto cuesta una difusión?**
R: Meta cobra por mensaje, típicamente $10-30 ARS dependiendo del tipo (Marketing más caro, Utility más barato).

**P: ¿Puedo enviar a clientes específicos?**
R: No selector individual en UI. Filtra por tipo/estado, eso es lo máximo. Para clientes específicos, crea un tag y segmenta por ese tag.

**P: ¿Cuál es el límite de clientes por difusión?**
R: No hay límite técnico. La UI mostrará advertencia si > 1000, pero procede igual.

**P: ¿Se pueden enviar URLs en difusiones?**
R: Sí, pero en el botón de call-to-action. El texto no puede tener links (Meta lo rechaza como spam).

**P: ¿Cuántas variables puede tener un mensaje?**
R: Hasta 20, pero recomendamos máximo 5 (variables automáticas: nombre, tipo, ciudad).

**P: ¿Qué pasa si el cliente bloqueó mi número?**
R: El mensaje falla. En el log aparece "blocked". Después de 7 días se reintenta.

---

## Plantillas Meta

**P: ¿Cuánto tarda Meta en aprobar una plantilla?**
R: Típicamente 1-2 horas. En casos raros, hasta 24 horas.

**P: ¿Por qué rechaza Meta mi plantilla?**
R: Motivos comunes:
- Spam: demasiadas MAYÚSCULAS, emojis, llamadas de atención
- Política: contenido vedado, links sospechosos
- Formato: variables mal usadas
- Lenguaje: palabras prohibidas

Revisa el motivo y reenvía corrigiendo.

**P: ¿Puedo editar una plantilla ya aprobada?**
R: No, Meta no lo permite. Opciones:
- Crea nueva plantilla (ej: `promo_v2`)
- Elimina la vieja (el registro permanece)

**P: ¿Qué diferencia hay entre categoría Marketing y Utility?**
R: Marketing es más caro (promociones, ofertas). Utility es más barato (confirmaciones, info). Elige según propósito.

**P: ¿Puedo subir video como header?**
R: Sí, pero es raro. Formato MP4, máximo tamaño. Contacta al admin si lo necesitas.

---

## Postventa

**P: ¿Cómo funciona postventa?**
R: Automatiza mensajes 1:1 cuando ocurren eventos (compra, inactividad, cumpleaños). Se envían por sesión WhatsApp Web privada, no Cloud API.

**P: ¿Por qué está separada de difusiones?**
R: Difusiones usan Meta Cloud API (masivo, aprobado). Postventa usa WhatsApp Web (1:1, flexible), para no violar ToS de Meta.

**P: ¿Qué pasa si la sesión de postventa se cae?**
R: La asesora debe reconectar escaneando QR. El admin puede forzar reconexión en Configuración.

**P: ¿Cuántos mensajes puedo enviar por hora?**
R: Máximo ~20 por sesión (Meta). Si más, se encolan y se procesan después.

**P: ¿Puedo programar un mensaje para mañana?**
R: No. Se envía cuando se cumpla el trigger (compra, inactividad, etc.).

**P: ¿Qué pasa si el cliente rechaza el mensaje?**
R: Se registra en los logs con estado "failed". Se reintenta días después.

---

## Analytics

**P: ¿Por qué los números no coinciden con el sistema actual?**
R: El CRM es paralelo. Datos pueden estar duplicados, omitidos, o con diferentes definiciones de "estado". Sincroniza manualmente con admin del otro sistema.

**P: ¿Puedo exportar reportes?**
R: Sí. En cualquier tabla, **Descargar CSV**. Se abre en Excel.

**P: ¿Qué significa ROI?**
R: Retorno on Investment. (Valor generado - Inversión) / Inversión × 100%. Si es >100%, valió la pena gastar.

**P: ¿Se incluye postventa en métricas?**
R: Parcialmente. Difusiones sí. Postventa todavía en construcción.

---

## Configuración

**P: ¿Cómo agregó una nueva asesora?**
R: Admin: **Configuración → Usuarios → + Nuevo usuario**. Completa datos, asigna teléfono, rol Asesora.

**P: ¿Mi teléfono es visible para los clientes?**
R: No. Tu teléfono aparece en el CRM solo para postventa automática (sesiones).

**P: ¿Cómo cambio mi contraseña?**
R: **Configuración → Mi cuenta → Cambiar contraseña**. (Solo admin). Asesoras contactan admin.

**P: ¿Dónde está el token de Meta?**
R: **Configuración → Credenciales Meta** (solo admin visible).

**P: ¿Qué pasa si el token de Meta expira?**
R: Difusiones/plantillas fallan con error 401. Admin debe actualizar el token en Configuración.

---

## Errores comunes

### Error 401 (Unauthorized)
**Síntoma:** Difusiones/plantillas fallan, dicen "401 Unauthorized"
**Causa:** Token de Meta expiró o es inválido
**Solución:** Admin va a **Configuración → Credenciales Meta** → Actualiza token

### Error 403 (Forbidden)
**Síntoma:** Acción rechazada (sin permiso)
**Causa:** Tu rol no tiene ese permiso
**Solución:** Si es necesario, contacta admin para elevar rol

### No se envía difusión
**Síntoma:** Difusión se queda en estado "enviando"
**Causa:** Puede ser internet, Meta, o sesión cerrada
**Solución:** 
- Espera 5 minutos
- Recarga página
- Si sigue, contacta admin

### Conversación no llega
**Síntoma:** Cliente escribe pero no ves el mensaje
**Causa:** Webhook de Meta tardío, o conexión lenta
**Solución:**
- Actualiza página (F5)
- Espera 30 segundos
- Si no llega, contacta admin (revisar logs de webhook)

### Cliente duplicado
**Síntoma:** Mismo cliente aparece 2 veces
**Causa:** Se creó manual + se importó, o error de importación
**Solución:** 
- Admin revisa en Clientes → teléfono duplicado
- Elimina uno, mantiene el activo

### Sesión expira constantemente
**Síntoma:** Vuelve a login cada poco
**Causa:** Inactividad > 1 hora, o problema de cookies
**Solución:**
- Mantente activo
- Limpia cookies del navegador (Ctrl+Shift+Del)
- Vuelve a loguearte

---

## Troubleshooting avanzado

### Mi bandeja está vacía, ¿dónde están mis clientes?
1. **Verifica rol:** ¿Eres asesora o admin?
2. **Verifica asignación:** ¿Clientes asignados a ti?
3. **Verifica estado:** ¿Clientes en estado "recibido"?
4. **Verifica opt-in:** ¿Clientes con opt_in_broadcasts = true?

Si todo lo anterior es sí, contacta admin.

### Las métricas no cuadran
1. Ingresa a **Clientes**, filtra por estado
2. Cuenta manualmente
3. Compara con Analytics
4. Si hay discrepancia, puede haber:
   - Webhooks de Meta retrasados (espera 5 min)
   - Clientes duplicados (busca por teléfono)
   - Cliente soft-deleted (no aparece en búsqueda normal)

### Plantilla rechazada, ¿por qué?
1. Lee motivo en detalles de plantilla
2. Causas típicas:
   - Texto con SPAM (muchas MAYÚSCULAS, emojis)
   - Variables mal usadas (ej: `{{0}}` en lugar de `{{1}}`)
   - Links sospechosos
   - Palabras prohibidas
3. Edita la plantilla y reenvía

### Diffusión tiene muchos fallos
1. Ve a **Historial de difusiones**
2. Abre la difusión
3. Busca "fallidos"
4. Click en un fallo → ver motivo (blocked, invalid number, etc.)
5. Si muchos "blocked": clientes rechazaron, considera nueva estrategia

---

## Contactar soporte

Si tu problema no está aquí:

1. **Describe:** qué intentabas hacer, qué pasó, qué error viste
2. **Captura pantalla:** si es visual
3. **Comparte logs:** admin puede revisar
4. **Pasos para reproducir:** paso a paso cómo llegaste al error

Contacta a: [correo del admin/soporte]

---

## Sugerencias y feedback

¿Encontraste un bug? ¿Tienes idea para mejorar el CRM?

Reporta aquí: [formulario/email de sugerencias]

Tu feedback nos ayuda a mejorar.

---

Fin del manual. Vuelve a **[MANUAL-USUARIO](../MANUAL-USUARIO.md)** o navega a cualquier sección.


---

