**La Internacional Distribuidora**  
**Documento de Presupuesto Técnico-Comercial**  
**Versión 1.0**

---

## 1. RESUMEN EJECUTIVO

Este documento detalla los costos asociados a la implementación y operación de una plataforma CRM integrada diseñada específicamente para La Internacional. La solución centraliza la gestión de clientes, automatiza comunicaciones por WhatsApp e Instagram, y proporciona visibilidad total sobre el desempeño comercial de cada asesora.

La plataforma está estructurada en componentes funcionales independientes, permitiendo que cada parte del negocio sea medible, monitoreable y escalable. Los costos se dividen en dos categorías:

- **Costos de Desarrollo e Implementación** — inversión única al inicio del proyecto
- **Costos Operacionales Variables** — asociados directamente al uso real del sistema

---

## 2. COMPONENTES FUNCIONALES DEL SISTEMA

### 2.1 Módulo de Recepción y Gestión de Contacto (Bandeja Unificada)

**Qué incluye:**
- Integración centralizada de 5 líneas de WhatsApp actuales
- Integración de mensajes directos de Instagram
- Interfaz única desde la cual ver todos los contactos entrantes
- Asignación automática de clientes a asesoras según tipo de cliente (Cosmetóloga, Esteticista, Dermatóloga, Revendedora)
- Eliminación manual de búsqueda de números — el sistema valida automáticamente si el teléfono ya existe

**Por qué importa:**
Reduce el tiempo de triaje y evita duplicación de esfuerzos. Las asesoras no pierden tiempo verificando manualmente si un cliente ya está en el sistema.

**Costo estimado de desarrollo:** `[PLACEHOLDER]`

---

### 2.2 Módulo de Gestión de Clientes (CRM Core)

**Qué incluye:**
- Base de datos centralizada de clientes anti-duplicidad
- Búsqueda por teléfono, nombre, ciudad, tipo de profesión
- Historial completo de interacciones por cliente (mensajes, estado, fecha de último contacto)
- Sistema de estados — cada cliente progresa por: Recibido → En validación → Presupuestando → Sin comprobante → Agendado → Comprado
- Etiquetado flexible para segmentación y priorización
- Filtrado por asesora, tipo de cliente, o estado específico

**Por qué importa:**
Es el corazón del sistema. Toda decisión comercial se toma a partir de datos de clientes. La visibilidad centralizada evita que clientes "se pierdan" entre sistemas.

**Costo estimado de desarrollo:** `[PLACEHOLDER]`

---

### 2.3 Módulo de Difusiones Masivas (Motor de Envíos)

**Qué incluye:**
- Integración nativa con WhatsApp Business API (Meta Cloud API) — 100% legal y seguro
- Gestor de plantillas aprobadas por Meta (se crea/aprueba una vez, se reutiliza N veces)
- Segmentación dinámica — filtrar clientes por tipo, asesora, estado, ciudad
- Límites de seguridad integrados (máximo 20 envíos por ejecución, para evitar sobrecarga de API)
- Modo "test" — validar antes de enviar a toda la audiencia
- Imágenes en headers — subida y reutilización de media files

**Por qué importa:**
Reemplaza el proceso manual de "armar lista de 250 contactos, copiar en WhatsApp Web, etc.". Un click dispara a todos. Ahorra horas de trabajo operativo por difusión.

**Costo estimado de desarrollo:** `[PLACEHOLDER]`

---

### 2.4 Módulo de Postventa Automatizada

**Qué incluye:**
- Secuencias automáticas de seguimiento post-compra (ej. "día 7 después de compra")
- Triggers personalizables: post-compra, inactividad (X días sin compras), cumpleaños, días personalizados
- Mensajes puntuales 1:1 a cada cliente (no masivos) — camuflado, sin facturación de plantilla
- Restricción por tipo de cliente u asesora específica
- Contador de "enviados este mes" para auditoría
- Microservicio aislado — si algo falla en postventa, el resto del sistema sigue funcionando

**Por qué importa:**
Mantiene clientes activos sin intervención manual. Un cliente con baja actividad recibe un recordatorio automático. Post-compra, un "gracias por tu compra" aumenta la retención.

**Costo estimado de desarrollo:** `[PLACEHOLDER]`

---

### 2.5 Módulo de Analítica y Reportes

**Qué incluye:**
- Dashboard ejecutivo de tasas de conversión (clientes nuevos → clientes que compraron)
- Análisis por etapa — ¿dónde abandonan los clientes? (ej. post-presupuesto)
- Costo por difusión vs. resultado comercial — si se gastaron $100 en una difusión, ¿cuánto ingreso generó?
- Costo por estado — para que un cliente llegue del estado "Presupuestando" al estado "Comprado", ¿cuál fue la inversión media en difusiones?
- Reportes por asesora — rendimiento individual, clientes atendidos, cierre de ventas
- Embudos visuales — ver la progresión de clientes a través de cada etapa

**Por qué importa:**
Sin datos, es imposible optimizar. Este módulo responde: "¿estamos invirtiendo bien en difusiones?" y "¿quién es la asesora más efectiva?"

**Costo estimado de desarrollo:** `[PLACEHOLDER]`

---

### 2.6 Plataforma Frontend y Acceso

**Qué incluye:**
- Interfaz web responsive (funciona en desktop y tablets)
- Acceso para Admin (ve todo, gestiona usuarios, ve reportes)
- Acceso para Asesoras (ve sus clientes, bandeja propia, historial)
- Autenticación segura con contraseña (JWT)
- No requiere instalación — funciona desde cualquier navegador
- Diseño intuitivo, sin necesidad de capacitación compleja

**Por qué importa:**
Es la puerta de entrada. Si es complicado de usar, la adopción falla.

**Costo estimado de desarrollo:** `[PLACEHOLDER]`

---

### 2.7 Infraestructura, Hosting y Deployment

**Qué incluye:**
- Servidor en la nube (Railway) — disponibilidad 24/7
- Base de datos PostgreSQL (escalable, confiable, estándar industria)
- Monitoreo de salud del sistema (alertas si algo cae)
- Respaldos automáticos diarios
- Certificado SSL (HTTPS seguro)
- Configuración de múltiples bases de datos lógicas (aislamiento por servicio, por seguridad)

**Por qué importa:**
La plataforma debe estar disponible cuando lo necesitan. No es "instalar en una computadora". Está en la nube, disponible desde cualquier lugar.

**Costo estimado de desarrollo:** `[PLACEHOLDER]`

---

## 3. ESTRUCTURA DE COSTOS

### 3.1 Costos de Desarrollo e Implementación (Inversión Inicial)

A continuación, detallamos los componentes principales y sus costos asociados:

| Componente | Descripción | Costo |
|-----------|-------------|-------|
| **Módulo Recepción y Gestión de Contacto** | Integración WhatsApp + Instagram, bandeja unificada, asignación automática | `[PLACEHOLDER]` |
| **Módulo CRM Core** | Base de datos clientes, anti-duplicidad, segmentación, estados | `[PLACEHOLDER]` |
| **Módulo Difusiones Masivas** | Integración Meta Cloud API, gestor de plantillas, segmentación dinámica | `[PLACEHOLDER]` |
| **Módulo Postventa Automatizada** | Secuencias automáticas, microservicio aislado, triggers configurables | `[PLACEHOLDER]` |
| **Módulo Analítica** | Dashboard, embudos, tasas de conversión, reportes por asesora | `[PLACEHOLDER]` |
| **Plataforma Frontend** | Interfaz web responsive, autenticación, gestión de usuarios | `[PLACEHOLDER]` |
| **Infraestructura y Hosting** | Servidor Railway, BD PostgreSQL, monitoreo, respaldos, SSL | `[PLACEHOLDER]` |
| | | |
| **TOTAL DESARROLLO E IMPLEMENTACIÓN** | | `[PLACEHOLDER]` |

---

### 3.2 Costos Operacionales Variables (Costo por Uso)

La plataforma genera costos variables **únicamente por mensajes enviados a través de WhatsApp Cloud API** (Meta). Estos costos están directamente vinculados a:

- **Difusiones masivas** — cada template dispuesta a N clientes
- **Postventa automatizada** — cada secuencia que envía mensajes 1:1

**Nota importante:** No hay costo variable por:
- Cantidad de clientes en la base de datos
- Cantidad de mensajes recibidos
- Cantidad de consultas a reportes
- Cantidad de usuarios del sistema
- Hosting o infraestructura

#### Tabla de Precios Meta para WhatsApp Cloud API

Los precios varían según la plantilla, la región y la fecha. A continuación se proporciona una estructura de referencia:

**Por tipo de plantilla:**

| Tipo de Mensaje | Categoría Meta | Precio por envío* | Notas |
|----------------|----------------|-----------------|-------|
| **Únicamente texto** | UTILITY | `[PLACEHOLDER USD]` | Seguimientos, confirmaciones |
| **Texto + imagen/video** | UTILITY | `[PLACEHOLDER USD]` | Promociones con visual |
| **Texto con botones interactivos** | UTILITY | `[PLACEHOLDER USD]` | Llamadas a acción (CTA) |
| **Difusiones generales** | MARKETING | `[PLACEHOLDER USD]` | Novedades, listas de precios |

*Los precios están denominados en USD. El costo final en ARS dependerá del tipo de cambio vigente en la fecha del envío.

---

#### Ejemplo de Cálculo de Costos Operacionales

**Caso A: Difusión semanal a todas las cosmetólogas**

Supongamos:
- 250 cosmetólogas registradas
- 1 plantilla de MARKETING con texto + imagen
- Precio unitario: `[PLACEHOLDER USD]`

**Costo por difusión:** 250 × `[PLACEHOLDER USD]` = `[PLACEHOLDER USD]`  
**Costo mensual (4 difusiones):** `[PLACEHOLDER USD]`  
**Costo anual (52 difusiones):** `[PLACEHOLDER USD]`

---

**Caso B: Postventa automática post-compra**

Supongamos:
- 50 clientes compraron este mes
- 1 mensaje UTILITY de seguimiento por cliente
- Precio unitario: `[PLACEHOLDER USD]`

**Costo por envío:** 50 × `[PLACEHOLDER USD]` = `[PLACEHOLDER USD]`  
**Costo mensual:** `[PLACEHOLDER USD]` (varía según compras)  
**Costo anual estimado:** `[PLACEHOLDER USD]` (base en histórico de compras)

---

#### Control de Costos

El sistema incluye mecanismos de control integrados:

1. **Límites de seguridad** — máximo 20 envíos simultáneos, para prevenir sobrecargas
2. **Modo test** — antes de enviar a toda la audiencia, se valida con un número de prueba
3. **Auditoría completa** — cada difusión queda registrada: quién la envió, cuándo, a cuántos, costo aproximado
4. **Reportes de costo** — dashboard que muestra gasto acumulado en mensajes vs. ingresos generados

---

## 4. TIMELINE DE IMPLEMENTACIÓN

| Fase | Duración Estimada | Hitos |
|------|-------------------|-------|
| **Fase 1: Planificación y Setup** | 1-2 semanas | Acceso a credenciales Meta, definición final de requisitos, setup de infraestructura |
| **Fase 2: Desarrollo Core** | 4-6 semanas | Módulos CRM, Recepción, Backend base |
| **Fase 3: Integración Meta** | 2-3 semanas | Difusiones, postventa, sincronización de templates |
| **Fase 4: Analítica e Integración Sistema Actual** | 2-3 semanas | Dashboard, reportes, sincronización bidireccional |
| **Fase 5: Testing, Capacitación y Go-Live** | 1-2 semanas | QA completo, capacitación de usuarios, migración de datos históricos |

**Total estimado:** 10-17 semanas (incluye buffers para ajustes)

---

## 5. GARANTÍAS Y SOPORTE POST-LANZAMIENTO

Una vez implementada la plataforma, se incluye:

- **30 días de soporte intensivo** — resolución de bugs críticos, ajustes de flujos, capacitación adicional
- **Documentación completa** — manual de usuario, guía de administración, video tutoriales
- **Sesiones de capacitación** — 1 sesión en vivo con todo el equipo (admin + asesoras)
- **Escalabilidad garantizada** — la infraestructura soporta crecimiento a 50,000+ contactos sin degradación

---

## 6. CONSIDERACIONES TÉCNICAS Y LIMITACIONES CONOCIDAS

### 6.1 Dependencias Externas

- **Meta Cloud API** — La plataforma depende de que Meta mantenga disponibilidad y estabilidad. Meta tiene SLA del 99.9%, pero ocasionalmente hay interrupciones. No está en nuestras manos, pero sí monitoreamos.

### 6.2 Privacidad y Cumplimiento Normativo

- Todos los datos se almacenan encriptados en tránsito (HTTPS) y en reposo (en la base de datos)
- La plataforma cumple con GDPR y las políticas de Meta respecto a privacidad
- Se requiere consentimiento de clientes para recibir mensajes (opt-in), especialmente para difusiones

---

**Preparado por:** DAX
**Fecha:** [Fecha del documento]  
**Versión:** 1.0  
**Válido hasta:** [Fecha de vigencia - ej. 30 días]

---

### Anexo: Glosario de Términos Técnicos

**CRM:** Customer Relationship Management. Sistema de gestión de relaciones con clientes.

**WhatsApp Cloud API (Meta):** Acceso oficial a WhatsApp a través de servidores de Meta. Es la forma legal de automatizar envíos masivos.

**Template (Plantilla Meta):** Mensaje preformateado aprobado por Meta. Puede incluir texto, variables, imágenes o botones interactivos. Una vez aprobada, se puede reutilizar sin esperar nuevamente.

**Webhook:** Notificación automática que Meta envía a nuestro servidor cada vez que ocurre algo (ej. "cliente leyó el mensaje", "cliente respondió").

**Microservicio:** Componente de software independiente que puede fallar sin afectar al resto del sistema. En este caso, la postventa está en un microservicio aislado por seguridad.

**JWT (Token):** Credencial segura que los usuarios obtienen al hacer login. Permite que la plataforma sepa quién eres sin requerir contraseña en cada petición.

**PostgreSQL:** Base de datos confiable, escalable, estándar en la industria. Similar a SQL Server pero open-source.

**Railway:** Plataforma de hosting en la nube. Aloja el servidor, la BD, y garantiza disponibilidad 24/7.

**API REST:** Forma estándar de que dos sistemas se comuniquen. Nuestro CRM "habla" con Meta y con el sistema actual a través de APIs.

---

