# Docker Setup Quick Start

## Local Development with Docker

### Prerequisites
- Docker & Docker Compose installed
- Copy `.env.local.example` → `.env.local` and fill in your credentials

### Start Everything

```bash
# Copy environment
cp .env.local.example .env.local

# Edit .env.local with your Meta credentials
# META_APP_ID, META_ACCESS_TOKEN, etc.

# Build and start all services
docker-compose up --build

# In another terminal, run migrations (if needed)
docker exec lid-backend npm run prisma:migrate:deploy --workspace apps/backend
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **PostgreSQL:** localhost:5432
- **Adminer (DB UI):** http://localhost:8081

### Common Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove volumes (clean database)
docker-compose down -v

# Rebuild specific service
docker-compose build --no-cache backend

# Execute command in container
docker exec lid-backend npm run prisma:generate
```

### Troubleshooting

**Port already in use:**
```bash
# Check what's using the port
lsof -i :8080

# Or use different port in docker-compose
docker-compose -e GATEWAY_PORT=9000 up
```

**Database not initializing:**
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Restart database
docker-compose down -v postgres
docker-compose up postgres
```

**Backend can't connect to database:**
```bash
# Ensure DATABASE_URL in .env.local is correct
# Should be: postgresql://postgres:postgres@postgres:5432/lid

# Check network connectivity
docker-compose exec backend ping postgres
```

---

**For production deployment, see:** [DEPLOYMENT-RAILWAY.md](./DEPLOYMENT-RAILWAY.md)
