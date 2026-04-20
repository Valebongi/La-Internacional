# La Internacional — CRM

Monorepo del CRM paralelo de La Internacional.

## Estructura

```
apps/
├── frontend/                  # Vite + React + Ionic
└── backend/
    ├── gateway/               # 8080
    ├── auth-service/          # 3001
    ├── crm-core-service/      # 3002
    ├── messaging-service/     # 3003
    ├── broadcasts-service/    # 3004
    ├── postsale-service/      # 3005
    ├── analytics-service/     # 3006
    └── integration-service/   # 3007
```

## Arrancar el frontend

```bash
npm install
npm run dev
```

El frontend corre en modo **mock** por defecto (`VITE_USE_MOCKS=true`): todas las páginas navegables sin necesidad de backend.

## Docs

Ver [Documentacion/](Documentacion/) para arquitectura, backend, frontend, BD y requerimientos.
