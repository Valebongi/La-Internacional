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
