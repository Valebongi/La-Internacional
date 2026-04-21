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
