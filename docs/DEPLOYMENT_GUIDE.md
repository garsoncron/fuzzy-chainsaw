# Deployment Guide

This comprehensive guide covers deployment strategies, configurations, and best practices for the Cowtown Showdown tournament website.

## Table of Contents

- [Deployment Overview](#deployment-overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Database Setup](#database-setup)
- [Security Configuration](#security-configuration)
- [Monitoring and Logging](#monitoring-and-logging)
- [Performance Optimization](#performance-optimization)
- [Backup and Recovery](#backup-and-recovery)
- [Scaling Considerations](#scaling-considerations)
- [Troubleshooting](#troubleshooting)

## Deployment Overview

### Architecture

The Cowtown Showdown application is a Next.js 15 application with Payload CMS, designed to handle 500-900 concurrent users during tournament operations.

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Load Balancer │    │   CDN/Cache     │                │
│  │   (nginx/traefik)│    │   (CloudFlare)  │                │
│  └─────────┬───────┘    └─────────┬───────┘                │
│            │                      │                        │
│            ▼                      ▼                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Application   │    │   Static Assets │                │
│  │   (Next.js)     │    │   (Images/CSS)  │                │
│  │   Port 3000     │    │                 │                │
│  └─────────┬───────┘    └─────────────────┘                │
│            │                                               │
│            ▼                                               │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Database      │    │   Redis Cache   │                │
│  │   (PostgreSQL)  │    │   (Sessions)    │                │
│  │   Port 5432     │    │   Port 6379     │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────────│
│  │   Monitoring & Logging                                  │
│  │   - APM (Sentry/DataDog)                               │
│  │   - Logs (Structured JSON)                             │
│  │   - Metrics (Prometheus/Grafana)                       │
│  │   - Alerts (Email/Slack)                               │
│  └─────────────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────┘
```

### Deployment Targets

1. **Development** - Local development with hot reloading
2. **Staging** - Pre-production testing environment
3. **Production** - Live tournament environment (Coolify)

## Prerequisites

### System Requirements

- **Node.js**: ^18.20.2 || >=20.9.0
- **pnpm**: v9 or v10
- **Docker**: Latest stable version
- **PostgreSQL**: 14+ (for production)
- **Redis**: 6+ (recommended for production)

### Development Tools

```bash
# Install Node.js (recommended: use nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Install pnpm
npm install -g pnpm@latest

# Verify installations
node --version    # v20.x.x
pnpm --version    # 9.x.x or 10.x.x
```

## Environment Configuration

### Environment Variables

Create environment files for each deployment target:

#### `.env.local` (Development)

```bash
# Database
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/cowtown_dev

# Payload CMS
PAYLOAD_SECRET=your-32-character-secret-key-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Optional features
NEXT_PUBLIC_ENABLE_DRAFT_MODE=true
PAYLOAD_PUBLIC_DRAFT_SECRET=your-draft-secret-here

# Development
NODE_ENV=development
```

#### `.env.production` (Production)

```bash
# Database (Production)
DATABASE_URI=postgresql://username:password@hostname:5432/cowtown_production

# Payload CMS
PAYLOAD_SECRET=your-production-secret-min-32-chars
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# Security
PAYLOAD_PUBLIC_DRAFT_SECRET=your-production-draft-secret

# Performance
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=4096

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=cowtown-showdown

# Redis (Recommended)
REDIS_URL=redis://username:password@hostname:6379

# Email (Optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

### Configuration Validation

```typescript
// src/lib/config.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URI: z.string().url(),
  PAYLOAD_SECRET: z.string().min(32),
  NEXT_PUBLIC_SERVER_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  REDIS_URL: z.string().url().optional(),
})

export const config = envSchema.parse(process.env)
```

## Local Development

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/cowtown-nextjs-1.git
cd cowtown-nextjs-1

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Start database (using Docker)
docker-compose up -d postgres

# Run database migrations
pnpm payload migrate

# Seed with tournament data
pnpm run seed:tournament

# Start development server
pnpm dev
```

### Development with Docker

```bash
# Start all services
docker-compose up

# Development mode with hot reloading
docker-compose -f docker-compose.dev.yml up

# Run specific service
docker-compose up postgres
```

### Development Scripts

```bash
# Development
pnpm dev                    # Start development server
pnpm dev:turbo             # Start with Turbo (faster)

# Database
pnpm db:migrate            # Run migrations
pnpm db:seed               # Seed database
pnpm db:reset              # Reset database

# Code Quality
pnpm lint                  # ESLint
pnpm lint:fix             # ESLint with auto-fix
pnpm type-check           # TypeScript checking

# Testing
pnpm test                 # All tests
pnpm test:watch           # Watch mode
pnpm test:coverage        # With coverage

# Build
pnpm build                # Production build
pnpm analyze              # Bundle analysis
```

## Docker Deployment

### Dockerfile Optimization

Update the Dockerfile for production deployment:

```dockerfile
# Dockerfile
FROM node:22.12.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Payload types
RUN pnpm payload generate:types

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

### Required Next.js Configuration Update

```typescript
// next.config.js
const nextConfig = {
  // REQUIRED: Enable standalone output for Docker
  output: 'standalone',
  
  // Existing configuration
  experimental: {
    reactCompiler: false,
  },
  
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
      '.jsx': ['.jsx', '.tsx'],
    }
    return config
  },
  
  // Image optimization
  images: {
    domains: process.env.NODE_ENV === 'production' 
      ? ['yourdomain.com', 'cdn.yourdomain.com']
      : ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
```

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URI=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}
      - NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-cowtown}
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### .dockerignore

```bash
# .dockerignore
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.env*
.git
.gitignore
.next
.nyc_output
coverage
.vscode
docs
tests
```

## Production Deployment

### Health Check Endpoint

Add a health check endpoint for load balancers:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET() {
  try {
    // Check database connection
    const payload = await getPayload()
    await payload.db.pool.query('SELECT 1')
    
    // Check Redis connection (if configured)
    if (process.env.REDIS_URL) {
      // Add Redis health check
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      checks: {
        database: 'healthy',
        redis: 'healthy',
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
        keepalive 32;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=sse:10m rate=5r/s;
    
    server {
        listen 80;
        server_name yourdomain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name yourdomain.com;
        
        # SSL Configuration
        ssl_certificate /etc/ssl/certs/yourdomain.crt;
        ssl_certificate_key /etc/ssl/certs/yourdomain.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!SHA1:!WEAK;
        ssl_prefer_server_ciphers off;
        
        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # Compression
        gzip on;
        gzip_vary on;
        gzip_comp_level 6;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
        
        # Static assets
        location /_next/static/ {
            alias /app/.next/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # API routes with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # SSE endpoints
        location /api/games/live {
            limit_req zone=sse burst=10 nodelay;
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Connection '';
            proxy_set_header Cache-Control 'no-cache';
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_buffering off;
            proxy_cache off;
        }
        
        # Main application
        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeout settings
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }
        
        # Health check
        location /api/health {
            access_log off;
            proxy_pass http://app;
        }
    }
}
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting deployment..."

# Environment validation
if [[ -z "$PAYLOAD_SECRET" ]]; then
    echo "❌ PAYLOAD_SECRET environment variable is required"
    exit 1
fi

if [[ -z "$DATABASE_URI" ]]; then
    echo "❌ DATABASE_URI environment variable is required"
    exit 1
fi

# Pull latest code
echo "📦 Pulling latest code..."
git pull origin main

# Build and deploy
echo "🔨 Building application..."
docker-compose -f docker-compose.prod.yml build

echo "🗃️ Running database migrations..."
docker-compose -f docker-compose.prod.yml run --rm app pnpm payload migrate

echo "🌱 Seeding database (if needed)..."
if [[ "$SEED_DATABASE" == "true" ]]; then
    docker-compose -f docker-compose.prod.yml run --rm app pnpm run seed:tournament
fi

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be healthy..."
sleep 30

# Health check
echo "🏥 Running health checks..."
HEALTH_CHECK=$(curl -s http://localhost:3000/api/health)
if echo "$HEALTH_CHECK" | grep -q "healthy"; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed!"
    echo "$HEALTH_CHECK"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
```

## Database Setup

### PostgreSQL Configuration

```sql
-- scripts/init-db.sql
-- Create database and user
CREATE DATABASE cowtown;
CREATE USER cowtown_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE cowtown TO cowtown_user;

-- Performance optimizations
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = '200';
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = '0.9';
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = '100';

-- Restart required for some settings
SELECT pg_reload_conf();
```

### Migration Script

```typescript
// scripts/migrate.ts
import { getPayload } from 'payload'
import config from '../payload.config'

async function migrate() {
  try {
    const payload = await getPayload({ config })
    
    console.log('Running database migrations...')
    const result = await payload.db.migrate()
    
    if (result.length === 0) {
      console.log('✅ No migrations to run')
    } else {
      console.log(`✅ Ran ${result.length} migrations`)
      result.forEach(migration => {
        console.log(`  - ${migration.name}`)
      })
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()
```

### Backup Script

```bash
#!/bin/bash
# scripts/backup.sh

set -e

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="${POSTGRES_DB:-cowtown}"

echo "📋 Starting database backup..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Database backup
pg_dump "$DATABASE_URI" > "$BACKUP_DIR/db_backup_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db_backup_$DATE.sql"

echo "✅ Database backup completed: db_backup_$DATE.sql.gz"

# Cleanup old backups (keep last 7 days)
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "🧹 Cleaned up old backups"
```

## Security Configuration

### Environment Security

```typescript
// src/lib/security.ts
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

// Rate limiting configuration
export const createRateLimit = (windowMs: number, max: number) =>
  rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  })

// Security headers
export const securityConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
})

// API rate limits
export const apiLimiter = createRateLimit(15 * 60 * 1000, 100) // 100 requests per 15 minutes
export const authLimiter = createRateLimit(15 * 60 * 1000, 5)  // 5 login attempts per 15 minutes
export const sseLimiter = createRateLimit(60 * 1000, 10)       // 10 SSE connections per minute
```

### Authentication Security

```typescript
// src/lib/auth.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export class AuthService {
  private static readonly TOKEN_EXPIRY = '24h'
  private static readonly REFRESH_TOKEN_EXPIRY = '7d'
  
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }
  
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
  
  static generateTokens(payload: any) {
    const accessToken = jwt.sign(payload, process.env.PAYLOAD_SECRET!, {
      expiresIn: this.TOKEN_EXPIRY,
    })
    
    const refreshToken = jwt.sign(payload, process.env.PAYLOAD_SECRET!, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    })
    
    return { accessToken, refreshToken }
  }
  
  static verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.PAYLOAD_SECRET!)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
```

## Monitoring and Logging

### Structured Logging

```typescript
// src/lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'cowtown-showdown',
    version: process.env.npm_package_version,
  },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // File output (production)
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({
        filename: '/var/log/app/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: '/var/log/app/combined.log',
      }),
    ] : []),
  ],
})

export default logger
```

### Error Monitoring with Sentry

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.headers) {
      delete event.request.headers.authorization
      delete event.request.headers.cookie
    }
    return event
  },
})
```

### Metrics Collection

```typescript
// src/lib/metrics.ts
import client from 'prom-client'

// Create metrics registry
const register = new client.Registry()

// Metrics
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
})

export const sseConnections = new client.Gauge({
  name: 'sse_connections_total',
  help: 'Number of active SSE connections',
})

export const gameEvents = new client.Counter({
  name: 'game_events_total',
  help: 'Total number of game events',
  labelNames: ['type', 'game_id'],
})

register.registerMetric(httpRequestDuration)
register.registerMetric(sseConnections)
register.registerMetric(gameEvents)

// Metrics endpoint
export async function getMetrics() {
  return register.metrics()
}
```

## Performance Optimization

### Caching Strategy

```typescript
// src/lib/cache.ts
import Redis from 'ioredis'

const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL)
  : null

export class CacheService {
  static async get(key: string) {
    if (!redis) return null
    
    try {
      const value = await redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.warn('Cache get error:', error)
      return null
    }
  }
  
  static async set(key: string, value: any, ttl = 3600) {
    if (!redis) return
    
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.warn('Cache set error:', error)
    }
  }
  
  static async del(key: string) {
    if (!redis) return
    
    try {
      await redis.del(key)
    } catch (error) {
      console.warn('Cache delete error:', error)
    }
  }
  
  // Tournament-specific caching
  static async getStandings() {
    return this.get('tournament:standings')
  }
  
  static async setStandings(standings: any) {
    return this.set('tournament:standings', standings, 30) // 30-second cache
  }
  
  static async getGameState(gameId: string) {
    return this.get(`game:${gameId}:state`)
  }
  
  static async setGameState(gameId: string, state: any) {
    return this.set(`game:${gameId}:state`, state, 300) // 5-minute cache
  }
}
```

### Database Optimization

```typescript
// src/lib/database.ts
import { Pool } from 'pg'

// Connection pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Database query optimization
export async function optimizedQuery(query: string, params?: any[]) {
  const client = await pool.connect()
  
  try {
    const start = Date.now()
    const result = await client.query(query, params)
    const duration = Date.now() - start
    
    // Log slow queries
    if (duration > 1000) {
      logger.warn('Slow query detected', { query, duration, params })
    }
    
    return result
  } finally {
    client.release()
  }
}

// Prepared statements for common queries
export const preparedQueries = {
  getGameWithStats: `
    SELECT g.*, 
           json_agg(DISTINCT goals.*) as goals,
           json_agg(DISTINCT penalties.*) as penalties
    FROM games g
    LEFT JOIN goals ON goals.game = g.id
    LEFT JOIN penalties ON penalties.game = g.id
    WHERE g.id = $1
    GROUP BY g.id
  `,
  
  getTeamStandings: `
    SELECT t.*,
           COUNT(g.id) as games_played,
           SUM(CASE WHEN g.home_team = t.id THEN g.home_score ELSE g.away_score END) as goals_for,
           SUM(CASE WHEN g.home_team = t.id THEN g.away_score ELSE g.home_score END) as goals_against
    FROM teams t
    LEFT JOIN games g ON (g.home_team = t.id OR g.away_team = t.id)
    WHERE g.status = 'final'
    GROUP BY t.id
    ORDER BY goals_for - goals_against DESC
  `,
}
```

## Backup and Recovery

### Automated Backup

```bash
#!/bin/bash
# scripts/automated-backup.sh

BACKUP_DIR="/backups"
S3_BUCKET="cowtown-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump "$DATABASE_URI" | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Media files backup
tar -czf "$BACKUP_DIR/media_$DATE.tar.gz" /app/media

# Upload to S3 (optional)
if command -v aws &> /dev/null; then
    aws s3 cp "$BACKUP_DIR/db_$DATE.sql.gz" "s3://$S3_BUCKET/database/"
    aws s3 cp "$BACKUP_DIR/media_$DATE.tar.gz" "s3://$S3_BUCKET/media/"
fi

# Cleanup local backups older than 3 days
find "$BACKUP_DIR" -name "*.gz" -mtime +3 -delete

echo "Backup completed: $DATE"
```

### Recovery Procedures

```bash
#!/bin/bash
# scripts/restore.sh

BACKUP_FILE="$1"

if [[ -z "$BACKUP_FILE" ]]; then
    echo "Usage: $0 <backup-file>"
    exit 1
fi

echo "⚠️  WARNING: This will restore the database from backup!"
echo "Database: $DATABASE_URI"
echo "Backup file: $BACKUP_FILE"
read -p "Continue? (y/N): " confirm

if [[ $confirm != "y" ]]; then
    echo "Restore cancelled"
    exit 0
fi

# Stop application
docker-compose down app

# Restore database
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URI"
else
    psql "$DATABASE_URI" < "$BACKUP_FILE"
fi

# Start application
docker-compose up -d

echo "✅ Restore completed"
```

## Scaling Considerations

### Horizontal Scaling

For tournament peak loads (500-900 concurrent users):

```yaml
# docker-compose.scale.yml
version: '3.8'

services:
  app:
    build: .
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URI=${DATABASE_URI}
    depends_on:
      - postgres
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-load-balancer.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

### Load Balancer Configuration

```nginx
# nginx-load-balancer.conf
upstream app_backend {
    least_conn;
    server app_1:3000;
    server app_2:3000;
    server app_3:3000;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://app_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Session affinity for SSE connections
        ip_hash;
    }
}
```

### Database Scaling

```typescript
// src/lib/database-cluster.ts
import { Pool } from 'pg'

// Read/write splitting
const writePool = new Pool({
  connectionString: process.env.DATABASE_WRITE_URI,
  max: 10,
})

const readPool = new Pool({
  connectionString: process.env.DATABASE_READ_URI,
  max: 20,
})

export async function writeQuery(query: string, params?: any[]) {
  const client = await writePool.connect()
  try {
    return await client.query(query, params)
  } finally {
    client.release()
  }
}

export async function readQuery(query: string, params?: any[]) {
  const client = await readPool.connect()
  try {
    return await client.query(query, params)
  } finally {
    client.release()
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs app

# Common issues:
# - Missing environment variables
# - Database connection failure
# - Port conflicts

# Solutions:
docker-compose down
docker-compose up -d postgres
# Wait for database to be ready
docker-compose up app
```

#### 2. Database Connection Issues

```bash
# Test database connection
docker-compose exec postgres psql -U postgres -d cowtown -c "SELECT 1;"

# Check connection string format
echo $DATABASE_URI
# Should be: postgresql://user:password@host:port/database
```

#### 3. SSE Connection Problems

```bash
# Check nginx configuration for SSE
curl -N -H "Accept: text/event-stream" http://localhost/api/games/live

# Verify proxy settings
nginx -t
```

#### 4. Performance Issues

```bash
# Monitor resource usage
docker stats

# Check database performance
docker-compose exec postgres psql -U postgres -c "
  SELECT query, calls, total_time, mean_time 
  FROM pg_stat_statements 
  ORDER BY mean_time DESC 
  LIMIT 10;
"
```

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=debug
export NODE_ENV=development

# Start with debugging
docker-compose -f docker-compose.debug.yml up
```

### Monitoring Commands

```bash
# Application health
curl http://localhost:3000/api/health

# Database health
docker-compose exec postgres pg_isready

# Redis health (if configured)
docker-compose exec redis redis-cli ping

# Container resources
docker stats

# Application logs
docker-compose logs -f app
```

This deployment guide provides comprehensive instructions for deploying the Cowtown Showdown tournament website in various environments, with emphasis on reliability, security, and performance for tournament operations.