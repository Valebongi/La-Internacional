# Environment Variables Configuration

## Overview

All environment variables are centralized and validated at service startup. This document explains each variable and when/how to configure them.

## Variable Categories

### 1. Frontend (Vite)

| Variable | Default | Description | Example |
|----------|---------|-------------|---------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API endpoint | `https://app.railway.app` |
| `VITE_APP_NAME` | `CRM La Internacional` | Application title | Same |
| `VITE_USE_MOCKS` | `true` | Use mock data (dev only) | `false` in prod |
| `VITE_POLL_INBOX_MS` | `15000` | Inbox polling interval (ms) | 15000 |
| `VITE_POLL_NOTIFICATIONS_MS` | `30000` | Notifications polling (ms) | 30000 |
| `VITE_POLL_CHAT_MS` | `5000` | Chat polling interval (ms) | 5000 |

### 2. Backend - Core Configuration

| Variable | Default | Description | Example |
|----------|---------|-------------|---------|
| `NODE_ENV` | `development` | Runtime environment | `development`, `production` |
| `GATEWAY_PORT` | `8080` | Gateway service port | 8080 |
| `AUTH_PORT` | `3001` | Auth service port | 3001 |
| `CRM_CORE_PORT` | `3002` | CRM core service port | 3002 |
| `MESSAGING_PORT` | `3003` | Messaging service port | 3003 |
| `BROADCASTS_PORT` | `3004` | Broadcasts service port | 3004 |
| `POSTSALE_PORT` | `3005` | Postsale service port | 3005 |
| `ANALYTICS_PORT` | `3006` | Analytics service port | 3006 |
| `INTEGRATION_PORT` | `3007` | Integration service port | 3007 |

### 3. Service URLs (Inter-service Communication)

**Local Development:**
```
AUTH_URL=http://localhost:3001
CRM_CORE_URL=http://localhost:3002
MESSAGING_URL=http://localhost:3003
BROADCASTS_URL=http://localhost:3004
POSTSALE_URL=http://localhost:3005
ANALYTICS_URL=http://localhost:3006
INTEGRATION_URL=http://localhost:3007
```

**Railway (Docker Internal Network):**
```
AUTH_URL=http://auth-service.railway.internal:3001
CRM_CORE_URL=http://crm-core-service.railway.internal:3002
# etc...
```

These are **NOT public URLs** — only used for service-to-service communication within the same network.

### 4. Database Configuration

| Variable | Example | Notes |
|----------|---------|-------|
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/lid` | Main database |
| `POSTSALE_DATABASE_URL` | `postgresql://user:pass@localhost:5432/lid_postsale` | Postsale data (separate DB for scale) |

**Railway:** Use the provided `DATABASE_URL` from PostgreSQL add-on. Create `lid_postsale` separately via `init-db.sql`.

### 5. Authentication

| Variable | Default | Notes |
|----------|---------|-------|
| `JWT_SECRET` | ❌ REQUIRED | Strong random string, 32+ chars |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |

**Generate Strong JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. WhatsApp Cloud API (Meta) — CRITICAL ⚠️

**These credentials are SENSITIVE. Never commit to git.**

| Variable | Required | Source | Notes |
|----------|----------|--------|-------|
| `META_APP_ID` | ✅ | Meta Console | App ID (numeric) |
| `META_APP_SECRET` | ✅ | Meta Console | Keep secure, server-to-server only |
| `META_PHONE_NUMBER_ID` | ✅ | WhatsApp Settings | Phone numbers in your business account |
| `META_BUSINESS_ACCOUNT_ID` | ✅ | WhatsApp Settings | WABA ID (numeric) |
| `META_ACCESS_TOKEN` | ✅ | Generated | Primary token for Graph API |
| `META_VERIFY_TOKEN` | ✅ | Generated | For webhook verification |
| `META_GRAPH_VERSION` | `v25.0` | Meta Docs | API version (update as needed) |

**How to Get Meta Credentials:**

1. **Create Meta App:**
   - Go to https://developers.facebook.com
   - Create new app → Business type
   - Add WhatsApp product

2. **Get Phone Number ID:**
   - WhatsApp Business Account → Phone Numbers
   - Copy the ID

3. **Generate Access Token:**
   - System Users → Create User
   - Assign roles: `whatsapp_business_management`, `whatsapp_business_messaging`
   - Generate token with 60-day expiration
   - **Save securely — never share or commit**

4. **Set Verify Token:**
   - Generate random string for webhook verification
   - Example: `your-secure-random-token-here`

**Important:**
- Rotate token every 60 days (Meta requirement)
- If token exposed: regenerate immediately
- Never use app secret as access token
- Never hardcode tokens in source code

### 7. External System Integration

| Variable | Default | Description |
|----------|---------|-------------|
| `EXTERNAL_SYSTEM_BASE_URL` | Empty | URL of existing CRM system |
| `EXTERNAL_SYSTEM_API_KEY` | Empty | Auth key for external system |
| `EXTERNAL_SYSTEM_MOCK` | `true` | Use mock responses (dev) |

## Setup by Environment

### Development (Local)

1. Copy `.env.local.example` → `.env.local`
2. Fill in your Meta test credentials
3. For `VITE_USE_MOCKS=true`, no real backend needed
4. For testing with real API: get temporary Meta token

```bash
cp .env.local.example .env.local
# Edit .env.local
docker-compose up
```

### Production (Railway)

1. **Never set variables in files** — use Railway UI
2. Go to Railway Dashboard → Variables section
3. Add each variable:

**Required:**
- All Meta credentials (`META_*`)
- Database URLs (auto-provided by PostgreSQL add-on)
- `JWT_SECRET` (generate new, strong value)

**Optional (can use defaults):**
- Port numbers (use 8080, 3001, etc.)
- Service URLs (auto-resolved in Railway network)

**Screenshot Guide:**
```
Variables → Add Variable
Name:  META_ACCESS_TOKEN
Value: your-long-token-here
```

## Validation

All services validate environment variables on startup. If a required variable is missing:

```
[CONFIG ERROR] Environment variables missing or invalid:
  META_ACCESS_TOKEN: Should not be empty
  JWT_SECRET: Should not be empty
```

Service will exit with code 1. Check logs and add missing variables.

## Rotation & Security

### Meta Access Token Rotation

Meta tokens expire. Rotate every 60 days:

1. Generate new token in Meta Console
2. Update in Railway Variables
3. Redeploy (`railway up` or auto via Git)
4. Verify service is running: `railway logs`
5. Delete old token from Meta Console

### JWT Secret Rotation

To rotate JWT secret:

1. Generate new secret
2. Update `JWT_SECRET` in Railway Variables
3. Existing tokens will be invalid (users must re-login)
4. Redeploy

## Docker & Local Testing

When using docker-compose, variables are loaded from `.env` and `.env.local`:

```bash
# Values in .env.local override docker-compose defaults
docker-compose up

# Or explicit override
docker-compose --env-file .env.local up
```

## Common Mistakes

❌ **Committing `.env.local` with real tokens**
✅ Use `.env.local.example`, keep `.env.local` in `.gitignore`

❌ **Sharing Meta tokens in chat/tickets**
✅ Only share in secure 1:1 conversations with authorized team members

❌ **Using app secret as access token**
✅ Get proper access token from System Users section

❌ **Not rotating tokens**
✅ Set calendar reminder for every 60 days

❌ **Wrong service URL in Railway**
✅ Use `.railway.internal` for internal services, public domain for browser

---

**For Railway deployment:** See [DEPLOYMENT-RAILWAY.md](./DEPLOYMENT-RAILWAY.md)
**For local Docker setup:** See [DOCKER-SETUP.md](./DOCKER-SETUP.md)
