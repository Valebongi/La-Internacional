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
