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
