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
