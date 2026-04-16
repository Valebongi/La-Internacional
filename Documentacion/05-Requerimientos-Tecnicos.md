# 05 — Requerimientos Técnicos (lo que necesito que me proporciones)

> Checklist de todo lo que el equipo necesita conseguir antes (y durante) el desarrollo del prototipo del CRM de La Internacional. Pensado para que lo uses como tracker: marcá cada ítem cuando lo tengas resuelto.

Para entender el porqué de cada ítem, ver [01-Arquitectura.md](01-Arquitectura.md), [02-Backend.md](02-Backend.md), [03-Frontend.md](03-Frontend.md) y [04-Base-de-Datos.md](04-Base-de-Datos.md).

---

## 1. Cuentas y accesos a Meta (WhatsApp + Instagram)

| # | Ítem | Estado | Notas |
|---|---|---|---|
| 1.1 | **Meta Business Account** activa | ☐ | Se accede desde [business.facebook.com](https://business.facebook.com) |
| 1.2 | **WhatsApp Business Account ID (WABA)** | ☐ | Necesario para Cloud API |
| 1.3 | **Phone Number ID** de cada uno de los 5 números | ☐ | Uno por línea de WhatsApp |
| 1.4 | **Tokens permanentes** (System User Access Token con permisos `whatsapp_business_messaging`, `whatsapp_business_management`) | ☐ | No usar tokens temporales (24h) |
| 1.5 | **Verify Token** para webhooks | ☐ | String que vos definas; lo configurás en Meta y en nuestra env var |
| 1.6 | **App Secret** de la app de Meta | ☐ | Para validar HMAC de webhooks |
| 1.7 | URL pública del webhook configurada en Meta | ☐ | Será `https://<gateway>.up.railway.app/webhooks/meta`, se define al desplegar |
| 1.8 | **Plantillas (Templates)** ya aprobadas o en cola | ☐ | Si hay actuales, exportar lista; si no, conviene definir 3-5 para arrancar |
| 1.9 | Permisos de **Instagram Messaging** en Meta Business Suite | ☐ | Asociar cuenta de Instagram + dar permisos `instagram_basic`, `pages_messaging`, `instagram_manage_messages` |
| 1.10 | **Page Access Token** de la página de Facebook vinculada a Instagram | ☐ | Para leer/responder DMs de Instagram |

---

## 2. Números secundarios para postventa

> El módulo de postventa usa whatsapp-web.js / Baileys, que **viola los ToS de Meta**. Si baneamos los números reales, se rompe el negocio. Por eso necesitamos sandbox.

| # | Ítem | Estado | Notas |
|---|---|---|---|
| 2.1 | 5 chips/líneas **secundarias** (uno por asesora) | ☐ | Pueden ser SIM nuevas a su nombre, o un servicio tipo eSIM. **No usar los reales** durante el prototipo |
| 2.2 | Acceso físico/remoto para escanear QR de cada número | ☐ | El primer login pide QR; después la sesión se persiste |
| 2.3 | Decisión final: **Baileys** vs whatsapp-web.js | ☐ | Recomendamos Baileys (más liviano, no usa Chromium, multi-device nativo) |

---

## 3. Cuenta y configuración Railway

| # | Ítem | Estado | Notas |
|---|---|---|---|
| 3.1 | **Cuenta Railway** con plan que soporte ~9 servicios + 2 Postgres + 1 Redis | ☐ | Railway plan Pro arranca en USD 20/mes; para prototipo Hobby puede alcanzar pero monitorear consumo |
| 3.2 | Equipo agregado al proyecto Railway | ☐ | Que cada dev tenga acceso |
| 3.3 | Branch policy en GitHub conectado a Railway (auto-deploy de `main` o `staging`) | ☐ | Definir en kickoff técnico |
| 3.4 | Custom domain (opcional) o uso de subdominio `*.up.railway.app` | ☐ | Ver pregunta 7.5 |
| 3.5 | **Volume** asignado al `postsale-service` para persistir sesiones de Baileys | ☐ | Path interno `/data/sessions/`, ~1 GB suficiente |

---

## 4. Sistema propietario actual de La Internacional

> Marcado en el documento original como _"queda por discutir"_, _"importante averiguar"_, etc. Sin estos datos diseñamos contra un mock pero la integración real queda colgada.

| # | Ítem | Estado | Notas |
|---|---|---|---|
| 4.1 | **Contacto del ingeniero freelance** que mantiene el sistema (email/WhatsApp) | ☐ | Necesitamos al menos una sesión de descubrimiento |
| 4.2 | ¿El sistema tiene **API REST** ya expuesta? | ☐ | Si sí: documentación / Postman / OpenAPI. Si no: discutir cómo exponerla mínimamente |
| 4.3 | **Esquema de comprobantes**: qué campos tiene, qué identifica al cliente (¿teléfono? ¿documento?) | ☐ | Crítico para el cruce |
| 4.4 | **¿Los comprobantes tienen estados o son colorcitos?** | ☐ | Pregunta literal del doc original. Define si seguimos lifecycle o solo evento de creación |
| 4.5 | ¿Posibilidad de **webhook** desde el sistema actual hacia el nuestro? | ☐ | Si sí, mejor que polling. Si no, polling cada 5 min |
| 4.6 | Esquema de **stock** (productos, colores, lotes) — endpoint o estructura | ☐ | Para consulta desde el chat |
| 4.7 | Ejemplo real **anonimizado** de 5-10 comprobantes (JSON o screenshot) | ☐ | Para diseñar el matching |
| 4.8 | Ejemplo real **anonimizado** de 5-10 fichas de cliente del sistema actual | ☐ | Para diseñar la duplicación intencional |
| 4.9 | Lista de **SKUs típicos** y cómo se nombran las variantes (color/lote) | ☐ | Para `ProductCache` |

---

## 5. Información de negocio (definir con La Internacional)

| # | Ítem | Estado | Notas |
|---|---|---|---|
| 5.1 | Lista de **"tipos" de cliente** y a qué asesora va cada tipo | ☐ | Ej. `Cosmetóloga Córdoba → Asesora 1`, `Esteticista Interior → Asesora 2`, etc. |
| 5.2 | Lista mínima de **estados del lifecycle** del cliente | ☐ | Doc sugiere: Recibido / En validación / Presupuestando / Sin comprobante / Agendado. Confirmar |
| 5.3 | **Decisión visibilidad:** ¿asesoras ven solo sus clientes o todos? | ☐ | Marcado como "queda por discutir". Afecta scoping del backend |
| 5.4 | **Lista de tags** preexistentes que quieran trasladar | ☐ | Ej. VIP, Inactivo, Mayorista, etc. |
| 5.5 | **Volumen actual** estimado: mensajes/día, clientes activos/mes | ☐ | Para dimensionar Railway y rate limits |
| 5.6 | Lista de **teléfonos actuales de cada asesora** (los reales) | ☐ | Para mapping `User.phone_normalized` |
| 5.7 | **Reglas de negocio** específicas para asignación cuando un cliente entra sin tipo claro | ☐ | ¿Round-robin? ¿Cae en cola del admin? |
| 5.8 | **Definición del "cliente inactivo"** — ¿cuántos días sin pedido? | ☐ | Default propuesto: 45 días |
| 5.9 | **Período de seguimiento postventa** | ☐ | Default propuesto: 7 días después del comprobante |
| 5.10 | **Política de opt-out**: ¿basta con que el cliente pida no recibir, o hay un proceso? | ☐ | Define UX en `SettingsPage` |

---

## 6. Datos de prueba (para el prototipo)

| # | Ítem | Estado | Notas |
|---|---|---|---|
| 6.1 | **CSV con ~100 clientes** anonimizados o ficticios (con phone realista) | ☐ | Para probar anti-duplicación con volumen mínimo realista |
| 6.2 | **CSV de números mezclados** (existentes + nuevos) para test del importador | ☐ | Demo del feature crítico de anti-duplicación |
| 6.3 | **3-5 conversaciones ejemplo** (texto) para seedear | ☐ | Para que el frontend tenga contenido en demo |
| 6.4 | **Casos de uso para demo** (qué flujos quieren mostrarle al cliente final) | ☐ | Determina dónde poner foco visual |

---

## 7. Branding y dominio

| # | Ítem | Estado | Notas |
|---|---|---|---|
| 7.1 | **Logo** en SVG (preferido) o PNG transparente alta resolución | ☐ | Para login, sidebar, favicon |
| 7.2 | **Paleta de colores** oficial (al menos primary + secondary + accent) | ☐ | Se mapea a CSS vars de Ionic |
| 7.3 | **Tipografía** preferida | ☐ | Si no hay, usamos Inter por defecto |
| 7.4 | **Tono de comunicación** del producto (formal, cercano, profesional) | ☐ | Afecta copywriting de UI |
| 7.5 | **Dominio propio** (ej. `crm.lainternacional.com.ar`) o aceptan subdominio Railway | ☐ | Si dominio propio: necesitamos acceso al DNS para CNAME |
| 7.6 | Política de **modo oscuro** (forzar claro / dejar elegir / seguir sistema) | ☐ | Default: seguir sistema |

---

## 8. Decisiones de equipo (interno)

> Estos los decidís vos con tus amigos del equipo de desarrollo.

| # | Ítem | Estado | Notas |
|---|---|---|---|
| 8.1 | **Repo Git**: monorepo único (front + back) o repos separados | ☐ | Recomendación: dos repos (`la-internacional-frontend`, `la-internacional-backend`). El backend es ya un monorepo de servicios |
| 8.2 | **Branching**: trunk-based, GitFlow, etc. | ☐ | Recomendación: trunk con PRs cortos para prototipo |
| 8.3 | Quién es **owner** de cada módulo del backend | ☐ | Distribuir los 8 servicios entre el equipo |
| 8.4 | Owner del **frontend** | ☐ | Idealmente 1-2 personas dedicadas |
| 8.5 | Owner del **DevOps / Railway** | ☐ | Quien provisiona servicios y env vars |
| 8.6 | **Cadencia de standup / review** | ☐ | Para coordinar dependencias entre servicios |

---

## 9. Otros

| # | Ítem | Estado | Notas |
|---|---|---|---|
| 9.1 | ¿Quieren conectar **Slack/Discord/email** para notificaciones críticas (sesión postventa caída, fallos de webhook)? | ☐ | Out-of-scope estricto del prototipo, pero útil definir |
| 9.2 | ¿Preferencia por algún proveedor de **monitoreo** futuro? (Sentry, Logtail, Better Stack) | ☐ | Para post-prototipo |
| 9.3 | ¿Hay algún **compliance / privacidad** específico (Argentina Ley 25.326, Habeas Data)? | ☐ | Por los datos personales que manejamos |
| 9.4 | **Backup policy** de la BD | ☐ | Railway Postgres tiene backups; definir frecuencia y retención |

---

## 10. Resumen ejecutivo: bloqueantes del Día 1

Para arrancar a codear el primer día, lo mínimo indispensable es:

- [ ] **3.1** Cuenta Railway lista
- [ ] **8.1** Repos creados
- [ ] **8.3** y **8.4** Asignación de owners
- [ ] **5.1, 5.2, 5.6** Tipos de cliente, estados, teléfonos de asesoras (para seeds realistas)

Para arrancar la integración con WhatsApp:

- [ ] **1.1 a 1.7** Toda la sección Meta básica
- [ ] **2.1** Números secundarios para postventa

Para arrancar la integración con sistema actual:

- [ ] **4.1** Contacto del freelance
- [ ] **4.7, 4.8** Ejemplos de comprobantes y clientes

Todo lo demás puede ir resolviéndose en paralelo durante las primeras semanas sin bloquear el avance.

---

## 11. Cómo usar este documento

1. Imprimirlo o pasarlo a una herramienta de tracking (Trello, Linear, Notion).
2. Marcar cada ítem cuando esté resuelto, agregando el dato en "Notas".
3. Al finalizar el sprint 0 (kickoff técnico), todos los ítems de la sección 10 deberían estar verdes.
4. Volver acá cada sprint review para chequear que no quede nada bloqueante.
