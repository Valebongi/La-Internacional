# Railway Deployment Guide

## Overview

Este documento explica cómo desplegar La Internacional CRM en Railway con Docker, PostgreSQL y configuración centralizada de variables de entorno.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Railway                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Frontend (Nginx) → Backend (NestJS Gateway)         │   │
│  │                       ↓                              │   │
│  │                  [8 Microservicios]                 │   │
│  │                       ↓                              │   │
│  │                  PostgreSQL (2 DBs)                 │   │
│  │                                                      │   │
│  │  Internal networking: *.railway.internal            │   │
│  │  Public domain: custom.up.railway.app               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Railway account: https://railway.app
- Docker installed locally (for testing)
- Git repository connected to Railway
- Meta WhatsApp Cloud API credentials

## Setup Steps

### 1. Connect Repository to Railway

```bash
# Via CLI
railway init
railway link

# Or via web: https://railway.app/dashboard
```

### 2. Create Railway Project

Railway will detect `Dockerfile.backend` and `Dockerfile.frontend` for automated deployment.

```bash
railway up
```

### 3. Configure Environment Variables

#### In Railway Dashboard:

Go to **Variables** section and add:

**Database:**
```
DATABASE_URL=postgresql://user:pass@postgres.railway.internal:5432/lid
POSTSALE_DATABASE_URL=postgresql://user:pass@postgres.railway.internal:5432/lid_postsale
```

**Authentication:**
```
JWT_SECRET=<generate-strong-random-string>
JWT_EXPIRES_IN=7d
```

**Meta WhatsApp API (REQUIRED):**
```
META_APP_ID=<from-meta-console>
META_APP_SECRET=<from-meta-console>
META_PHONE_NUMBER_ID=<from-meta-console>
META_BUSINESS_ACCOUNT_ID=<waba-id>
META_ACCESS_TOKEN=<user-access-token>
META_VERIFY_TOKEN=<generated-token>
META_GRAPH_VERSION=v25.0
```

**Frontend:**
```
VITE_API_BASE_URL=https://your-app.up.railway.app
VITE_APP_NAME=CRM La Internacional
VITE_USE_MOCKS=false
```

**External System:**
```
EXTERNAL_SYSTEM_BASE_URL=<your-system-url>
EXTERNAL_SYSTEM_API_KEY=<your-api-key>
EXTERNAL_SYSTEM_MOCK=false
```

### 4. Create PostgreSQL Service

In Railway Dashboard:

1. Add → PostgreSQL 16
2. Name: `postgres`
3. Variables will auto-populate: `DATABASE_URL`, `POSTGRES_PASSWORD`, etc.

### 5. Running Database Migrations

SSH into Railway and run:

```bash
cd apps/backend
npm run prisma:migrate:deploy
npm run prisma:generate
```

Or setup automatic migrations in `Dockerfile.backend`.

## Environment Variables Reference

### CRITICAL: Meta Access Token

The Meta Access Token is the most sensitive variable:

- **Never commit to git** (it's in `.env.example` as placeholder only)
- **Set ONLY via Railway Dashboard** → Variables
- **Rotate every 60 days** (Meta best practice)
- **If exposed:** regenerate immediately from Meta Console

**Getting the token:**
1. Go to Meta Business Console
2. System Users → Create user
3. Assign: `whatsapp_business_management`, `whatsapp_business_messaging`
4. Generate token
5. Paste in Railway Variables

### Service URLs (Internal)

When services communicate within Railway, use `.railway.internal`:

```
http://backend.railway.internal:8080
http://auth-service.railway.internal:3001
http://crm-core-service.railway.internal:3002
...
```

When accessed from outside (browser), use public domain:

```
https://your-app.up.railway.app/api/...
```

## Local Development with Docker

Test the setup locally before deploying:

```bash
# Copy .env.local.example to .env.local
cp .env.local.example .env.local

# Fill in your Meta credentials in .env.local
# META_APP_ID, META_ACCESS_TOKEN, etc.

# Start services
docker-compose up

# Access:
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# PostgreSQL: localhost:5432
```

## Deployment Workflow

### Option A: Automatic (Recommended)

1. Push to main branch
2. Railway auto-deploys via webhook
3. Check logs: `railway logs`

### Option B: Manual

```bash
railway up
```

### Monitoring Deployment

```bash
# View logs
railway logs

# View metrics
railway status

# Check running services
railway shell
ps aux
```

## Troubleshooting

### "META_ACCESS_TOKEN not configured"

- Check Railway Variables dashboard
- Ensure value is set (not empty)
- Restart service: `railway restart`

### Database Connection Error

```
"cannot connect to postgres.railway.internal"
```

Solution:
1. Verify `DATABASE_URL` in Variables
2. Check PostgreSQL service is running
3. Ensure network policy allows internal connections

### Build Failed

```bash
# Check build logs
railway logs --build

# Rebuild specific service
railway rebuild
```

### Frontend Not Loading

1. Check nginx config (`nginx.conf`) mounted correctly
2. Verify `VITE_API_BASE_URL` points to correct backend domain
3. Check CORS settings in backend `app.module.ts`

## Scaling

Each service can be scaled independently in Railway:

1. Go to service settings
2. Adjust "Replicas" or "CPU/Memory"
3. Railway handles load balancing

## Backup & Recovery

```bash
# Backup PostgreSQL
railway shell
pg_dump -U postgres lid > lid-backup.sql

# Restore from backup
psql -U postgres lid < lid-backup.sql
```

## Security Checklist

- [ ] Meta credentials only in Railway Variables (not git)
- [ ] JWT_SECRET is strong random string
- [ ] Database uses secured connection (ssl)
- [ ] Frontend CORS properly restricted
- [ ] External system URL uses HTTPS
- [ ] Regular token rotation (Meta: every 60 days)
- [ ] Backups automated
- [ ] Logs monitored for errors

## Further Documentation

- Railway Docs: https://docs.railway.app
- NestJS with Railway: https://docs.railway.app/guides/nestjs
- PostgreSQL with Railway: https://docs.railway.app/databases/postgresql
- Docker best practices: https://docs.docker.com/develop/dev-best-practices/

---

**Last Updated:** May 2026
**Maintained by:** Backend Team
