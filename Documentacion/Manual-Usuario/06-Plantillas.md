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
