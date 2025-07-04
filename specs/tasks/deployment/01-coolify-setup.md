# Deployment Task: Coolify Setup & Configuration

## Overview
Configure the project for deployment on Coolify with optimized Next.js standalone build, PostgreSQL database, and Fastify API server.

## Next.js Configuration

### 1. Update next.config.js for Standalone Output
**File**: `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for optimized Docker builds
  output: 'standalone',
  
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    domains: ['localhost', 'cowtownshowdown.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  },
  
  // Experimental features
  experimental: {
    serverActions: true,
  },
  
  // Custom webpack config for fonts
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/fonts/',
          outputPath: 'static/fonts/',
          name: '[name].[hash].[ext]',
        },
      },
    })
    return config
  },
}

export default nextConfig
```

## Docker Configuration

### 1. Multi-Stage Dockerfile for Next.js
**File**: `Dockerfile`

```dockerfile
# Dependencies stage
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_API_URL

ENV DATABASE_URI=${DATABASE_URI}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Generate Payload types
RUN pnpm payload generate:types

# Build Next.js
RUN pnpm build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy custom fonts
COPY --from=builder /app/public/fonts ./public/fonts

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Dockerfile for Fastify API
**File**: `Dockerfile.api`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy source
COPY ./src/server ./src/server
COPY ./tsconfig.json ./

# Build
RUN pnpm build:api

# Production stage
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies only
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --prod --frozen-lockfile

# Copy built files
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

USER fastify

EXPOSE 3001

CMD ["node", "dist/server/index.js"]
```

### 3. Docker Compose for Local Development
**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-cowtown}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-cowtown123}
      POSTGRES_DB: ${POSTGRES_DB:-cowtown_showdown}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Optional: pgAdmin for database management
  pgadmin:
    image: dpage/pgadmin4:latest
    restart: unless-stopped
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@cowtownshowdown.com}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin123}
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
  pgadmin_data:
```

### 4. Docker Compose for Production
**File**: `docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        DATABASE_URI: ${DATABASE_URI}
        PAYLOAD_SECRET: ${PAYLOAD_SECRET}
        NEXT_PUBLIC_SERVER_URL: ${NEXT_PUBLIC_SERVER_URL}
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URI: ${DATABASE_URI}
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      REDIS_URL: ${REDIS_URL}
    depends_on:
      - api
    networks:
      - cowtown

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      DATABASE_URI: ${DATABASE_URI}
      JWT_SECRET: ${JWT_SECRET}
      REDIS_URL: ${REDIS_URL}
      API_PORT: 3001
    networks:
      - cowtown

networks:
  cowtown:
    driver: bridge
```

## Environment Configuration

### 1. Update .env.example
**File**: `.env.example`

```env
# Database
DATABASE_URI=postgresql://cowtown:cowtown123@localhost:5432/cowtown_showdown
POSTGRES_USER=cowtown
POSTGRES_PASSWORD=cowtown123
POSTGRES_DB=cowtown_showdown

# Redis
REDIS_URL=redis://localhost:6379

# Payload CMS
PAYLOAD_SECRET=your-payload-secret-here-min-32-chars

# Authentication
JWT_SECRET=your-jwt-secret-here-min-32-chars

# URLs
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# API Configuration
API_PORT=3001
LOG_LEVEL=info

# Scorekeeper Session (4 hours in seconds)
SCOREKEEPER_SESSION_TIMEOUT=14400

# Real-time Updates
REALTIME_UPDATE_INTERVAL=1000

# CORS (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000

# pgAdmin (optional for local dev)
PGADMIN_EMAIL=admin@cowtownshowdown.com
PGADMIN_PASSWORD=admin123

# Production URLs (update for deployment)
# NEXT_PUBLIC_SERVER_URL=https://cowtownshowdown.com
# NEXT_PUBLIC_API_URL=https://api.cowtownshowdown.com
```

### 2. Environment Variables for Coolify
**File**: `.env.production`

```env
# Database (Coolify managed)
DATABASE_URI=${DATABASE_URI}

# Redis (Coolify managed)
REDIS_URL=${REDIS_URL}

# Secrets (set in Coolify)
PAYLOAD_SECRET=${PAYLOAD_SECRET}
JWT_SECRET=${JWT_SECRET}

# Public URLs
NEXT_PUBLIC_SERVER_URL=https://cowtownshowdown.com
NEXT_PUBLIC_API_URL=https://api.cowtownshowdown.com

# Performance
NODE_ENV=production
```

## Build Scripts

### 1. Update package.json
**File**: `package.json`

```json
{
  "scripts": {
    // Development
    "dev": "docker-compose up -d && next dev",
    "dev:api": "tsx watch src/server/index.ts",
    "dev:all": "concurrently \"pnpm dev\" \"pnpm dev:api\"",
    
    // Build
    "build": "next build",
    "build:api": "tsc -p tsconfig.server.json",
    "build:all": "pnpm build && pnpm build:api",
    
    // Production
    "start": "node server.js",
    "start:api": "node dist/server/index.js",
    
    // Database
    "db:push": "pnpm payload migrate",
    "db:seed": "tsx src/seed/index.ts",
    
    // Docker
    "docker:dev": "docker-compose up",
    "docker:build": "docker-compose -f docker-compose.prod.yml build",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up",
    
    // Types
    "generate:types": "pnpm payload generate:types",
    "generate:importmap": "pnpm payload generate:importmap"
  }
}
```

## Coolify Configuration

### 1. Build Configuration
**Coolify Build Settings**:

```yaml
# Build Pack: Dockerfile
# Dockerfile Location: ./Dockerfile
# Build Context: .

# Environment Variables (Build Time)
DATABASE_URI: postgresql://user:pass@db:5432/cowtown
PAYLOAD_SECRET: [generated-secret]
NEXT_PUBLIC_SERVER_URL: https://cowtownshowdown.com
NEXT_PUBLIC_API_URL: https://api.cowtownshowdown.com

# Health Check
health_check_path: /api/health
health_check_interval: 30
health_check_timeout: 10
health_check_retries: 3

# Resources
memory_limit: 1024
memory_reservation: 512
cpu_limit: 1.0
cpu_reservation: 0.5
```

### 2. Deployment Workflow
**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Coolify

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        run: pnpm test
      
      - name: Build project
        run: pnpm build
        env:
          DATABASE_URI: ${{ secrets.DATABASE_URI }}
          PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Trigger Coolify Deployment
        run: |
          curl -X POST ${{ secrets.COOLIFY_WEBHOOK_URL }}
```

## Custom Fonts Setup

### 1. Font Configuration
**File**: `src/app/(frontend)/fonts.ts`

```typescript
import localFont from 'next/font/local'

// Western display font from custom files
export const westernDisplay = localFont({
  src: [
    {
      path: '../../../public/fonts/western-display-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/western-display-bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-western',
  display: 'swap',
})

// Fallback to Geist for body text
export const geistSans = localFont({
  src: '../../../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
```

### 2. Font File Structure
```
public/
└── fonts/
    ├── western-display-regular.otf
    ├── western-display-regular.ttf
    ├── western-display-bold.otf
    ├── western-display-bold.ttf
    └── GeistVF.woff
```

### 3. Layout Implementation
**File**: `src/app/(frontend)/layout.tsx`

```typescript
import { westernDisplay, geistSans } from './fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${westernDisplay.variable} ${geistSans.variable}`}>
      <body className={geistSans.className}>
        {children}
      </body>
    </html>
  )
}
```

## Performance Optimizations

### 1. Next.js Optimization
```javascript
// Optimize images
const optimizedImageConfig = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
}

// Bundle analyzer (development only)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
```

### 2. Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_scheduled_time ON games(scheduled_time);
CREATE INDEX idx_goals_game_id ON goals(game_id);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_game_events_game_id_sequence ON game_events(game_id, sequence);
```

## Monitoring & Health Checks

### 1. Health Check Endpoints
**File**: `src/app/api/health/route.ts`

```typescript
export async function GET() {
  try {
    // Check database
    await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    // Check Redis
    await redis.ping()
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
      },
    })
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message,
    }, { status: 503 })
  }
}
```

## Deployment Checklist

- [ ] Update environment variables in Coolify
- [ ] Configure PostgreSQL database
- [ ] Set up Redis instance
- [ ] Upload custom font files
- [ ] Configure domain and SSL
- [ ] Set up GitHub webhook
- [ ] Test health checks
- [ ] Configure backup strategy
- [ ] Set up monitoring alerts
- [ ] Document rollback procedure