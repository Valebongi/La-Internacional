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
