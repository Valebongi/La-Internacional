# Backend — La Internacional CRM

NestJS monorepo. 1 gateway + 7 servicios + 1 librería compartida.

## Estructura

```
services/
├── gateway/              :8080   BFF, auth injection, rate limit
├── auth/                 :3001   Login, usuarios, asesoras, JWT
├── crm-core/             :3002   Clientes, tags, tipos, segmentos
├── messaging/            :3003   Conversaciones WA Cloud API + IG
├── broadcasts/           :3004   Difusiones con plantillas oficiales
├── postsale/             :3005   Postventa 1:1 (Baileys/WW.js)
├── analytics/            :3006   Métricas, embudo, costo por estado
└── integration/          :3007   Sync bidireccional con sistema actual

libs/
└── common/               Entities, DTOs, guards, logger compartidos
```

## Arrancar un servicio

```bash
cd apps/backend
npm install
npm run start:gateway     # o start:auth, start:crm-core, etc.
```

Los servicios corren independientes. En Railway cada uno se despliega como su propia app.

## Estado

**Scaffold skeleton** — cada servicio responde `GET /health` y nada más. Los endpoints reales se implementan según [Documentacion/02-Backend.md](../../Documentacion/02-Backend.md).
