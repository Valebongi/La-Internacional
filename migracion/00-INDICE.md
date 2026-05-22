# Migración: MVP → Producción — La Internacional CRM

## Índice de documentos

| Doc | Título | Qué responde |
|-----|--------|--------------|
| [01](./01-ESTADO-ACTUAL.md) | Estado actual del sistema | Qué funciona, qué es mock, qué falta |
| [02](./02-ARQUITECTURA-OBJETIVO.md) | Arquitectura objetivo | Cómo debe quedar el sistema completo |
| [03](./03-BASE-DE-DATOS.md) | Esquemas de base de datos | Todos los modelos Prisma para producción |
| [04](./04-MICROSERVICIOS.md) | Implementación de microservicios | Qué hace cada servicio, endpoints, contratos |
| [05](./05-AUTENTICACION-ROLES.md) | Autenticación y roles | JWT, roles, permisos, guards |
| [06](./06-WHATSAPP-MULTI-NUMERO.md) | WhatsApp multi-número | Arquitectura Meta, 5 emisores, 250 receptores |
| [07](./07-FRONTEND-VISTAS-POR-ROL.md) | Frontend y vistas por rol | Qué ve cada usuario, navegación, componentes |
| [08](./08-PLAN-DE-EJECUCION.md) | Plan de ejecución | Fases, prioridades, dependencias, estimaciones |

---

## Contexto rápido

**Proyecto:** La Internacional CRM (sistema paralelo al legacy)  
**Stack:** NestJS monorepo + React/Vite/Ionic + PostgreSQL + Railway  
**Estado actual:** MVP funcional con datos mock — UI completa, backend skeleton  
**Objetivo:** Sistema productivo para 5 asesoras + administración, 4-5 líneas WhatsApp, ~1.250 clientes activos

## Los tres cambios más importantes

1. **Auth real** — JWT, bcrypt, roles en BD. Hoy todo es mock en localStorage.
2. **Base de datos real** — Prisma schemas + migrations. Hoy no hay ninguna tabla creada.
3. **WhatsApp multi-número** — 4-5 Phone Number IDs, canal por asesora, tabla `channels`.

Sin estos tres bloques, nada más se puede mover a producción.
