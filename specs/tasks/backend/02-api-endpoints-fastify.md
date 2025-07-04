# Backend Task: API Endpoints with Fastify

## Overview
Create API endpoints using Fastify as the middleware layer for real-time scoring, game management, and statistics updates. Fastify provides high performance, schema validation, and excellent plugin ecosystem.

## Fastify Server Setup

### 1. Core Server Configuration
**File**: `src/server/index.ts`

```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import websocket from '@fastify/websocket'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { gameRoutes } from './routes/games'
import { statsRoutes } from './routes/stats'
import { teamRoutes } from './routes/teams'
import { authRoutes } from './routes/auth'
import { ssePlugin } from './plugins/sse'

export const buildServer = async () => {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      prettyPrint: process.env.NODE_ENV === 'development',
    },
    trustProxy: true,
  }).withTypeProvider<TypeBoxTypeProvider>()

  // Register plugins
  await server.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })

  await server.register(helmet, {
    contentSecurityPolicy: false, // Configure based on needs
  })

  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  await server.register(websocket)
  await server.register(ssePlugin)

  // Register routes
  await server.register(authRoutes, { prefix: '/api/auth' })
  await server.register(gameRoutes, { prefix: '/api/games' })
  await server.register(statsRoutes, { prefix: '/api/stats' })
  await server.register(teamRoutes, { prefix: '/api/teams' })

  // Health check
  server.get('/health', async () => ({ status: 'ok' }))

  return server
}

// Start server
const start = async () => {
  const server = await buildServer()
  
  try {
    await server.listen({
      port: parseInt(process.env.API_PORT || '3001'),
      host: '0.0.0.0',
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
```

### 2. Authentication Plugin
**File**: `src/server/plugins/auth.ts`

```typescript
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import { FastifyRequest } from 'fastify'

export interface User {
  id: string
  email: string
  roles: string[]
  managedTeam?: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: User
  }
}

export const authPlugin = fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET!,
    sign: {
      expiresIn: '4h', // Scorekeeper session timeout
    },
  })

  fastify.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      throw fastify.httpErrors.unauthorized('Invalid token')
    }
  })

  fastify.decorate('requireRole', (roles: string[]) => {
    return async (request: FastifyRequest) => {
      await fastify.authenticate(request)
      
      if (!request.user) {
        throw fastify.httpErrors.unauthorized()
      }

      const hasRole = roles.some(role => request.user!.roles.includes(role))
      if (!hasRole) {
        throw fastify.httpErrors.forbidden('Insufficient permissions')
      }
    }
  })
})
```

## API Route Implementations

### 1. Game Routes
**File**: `src/server/routes/games/index.ts`

```typescript
import { Type } from '@sinclair/typebox'
import { FastifyPluginAsync } from 'fastify'
import { gameController } from '../../controllers/game'

const gameSchema = {
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: Type.Object({
      id: Type.String(),
      homeTeam: Type.Object({ name: Type.String() }),
      awayTeam: Type.Object({ name: Type.String() }),
      homeScore: Type.Number(),
      awayScore: Type.Number(),
      status: Type.Union([
        Type.Literal('scheduled'),
        Type.Literal('live'),
        Type.Literal('final'),
      ]),
    }),
  },
}

export const gameRoutes: FastifyPluginAsync = async (server) => {
  // Get game details
  server.get<{ Params: { id: string } }>(
    '/:id',
    { schema: gameSchema },
    gameController.getGame
  )

  // List games with filters
  server.get(
    '/',
    {
      schema: {
        querystring: Type.Object({
          status: Type.Optional(Type.String()),
          day: Type.Optional(Type.Number()),
          team: Type.Optional(Type.String()),
        }),
      },
    },
    gameController.listGames
  )

  // Start game (scorekeeper only)
  server.post(
    '/:id/start',
    {
      preHandler: server.requireRole(['admin', 'scorekeeper']),
      schema: {
        body: Type.Object({
          homeStartingGoalie: Type.String(),
          awayStartingGoalie: Type.String(),
        }),
      },
    },
    gameController.startGame
  )

  // Update score
  server.post(
    '/:id/score',
    {
      preHandler: server.requireRole(['admin', 'scorekeeper']),
      schema: {
        body: Type.Object({
          team: Type.Union([Type.Literal('home'), Type.Literal('away')]),
          delta: Type.Number(),
        }),
      },
    },
    gameController.updateScore
  )

  // SSE endpoint for live updates
  server.get(
    '/:id/live',
    {
      sse: true,
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      
      // Add client to SSE manager
      server.sseManager.addClient(id, reply.raw)
      
      // Send initial state
      const gameState = await gameController.getGameState(id)
      reply.sse({ data: gameState })
      
      // Keep connection alive
      request.raw.on('close', () => {
        server.sseManager.removeClient(id, reply.raw)
      })
    }
  )

  // Period management
  server.post(
    '/:id/period',
    {
      preHandler: server.requireRole(['admin', 'scorekeeper']),
      schema: {
        body: Type.Object({
          action: Type.Union([Type.Literal('start'), Type.Literal('end')]),
          period: Type.String(),
        }),
      },
    },
    gameController.managePeriod
  )

  // Record goal
  server.post(
    '/:id/goal',
    {
      preHandler: server.requireRole(['admin', 'scorekeeper']),
      schema: {
        body: Type.Object({
          scorer: Type.String(),
          assist1: Type.Optional(Type.String()),
          assist2: Type.Optional(Type.String()),
          time: Type.String(),
          period: Type.String(),
          powerPlay: Type.Optional(Type.Boolean()),
          shortHanded: Type.Optional(Type.Boolean()),
          emptyNet: Type.Optional(Type.Boolean()),
        }),
      },
    },
    gameController.recordGoal
  )

  // Delete goal (undo)
  server.delete(
    '/:id/goal/:goalId',
    {
      preHandler: server.requireRole(['admin', 'scorekeeper']),
    },
    gameController.deleteGoal
  )

  // Record penalty
  server.post(
    '/:id/penalty',
    {
      preHandler: server.requireRole(['admin', 'scorekeeper']),
      schema: {
        body: Type.Object({
          player: Type.String(),
          infraction: Type.String(),
          duration: Type.Union([
            Type.Literal('30s'),
            Type.Literal('1min'),
            Type.Literal('2min'),
            Type.Literal('3min'),
            Type.Literal('5min'),
            Type.Literal('game'),
          ]),
          time: Type.String(),
          period: Type.String(),
        }),
      },
    },
    gameController.recordPenalty
  )

  // Complete game
  server.post(
    '/:id/complete',
    {
      preHandler: server.requireRole(['admin', 'scorekeeper']),
      schema: {
        body: Type.Object({
          threeStars: Type.Object({
            first: Type.String(),
            second: Type.String(),
            third: Type.String(),
          }),
        }),
      },
    },
    gameController.completeGame
  )
}
```

### 2. Statistics Routes
**File**: `src/server/routes/stats/index.ts`

```typescript
export const statsRoutes: FastifyPluginAsync = async (server) => {
  // Player statistics
  server.get(
    '/players',
    {
      schema: {
        querystring: Type.Object({
          tournament: Type.Optional(Type.String()),
          team: Type.Optional(Type.String()),
          position: Type.Optional(Type.String()),
          sort: Type.Optional(Type.Union([
            Type.Literal('goals'),
            Type.Literal('assists'),
            Type.Literal('points'),
            Type.Literal('pim'),
          ])),
          limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
        }),
        response: {
          200: Type.Object({
            players: Type.Array(Type.Object({
              id: Type.String(),
              firstName: Type.String(),
              lastName: Type.String(),
              jerseyNumber: Type.Number(),
              team: Type.Object({
                name: Type.String(),
                division: Type.String(),
              }),
              stats: Type.Object({
                goals: Type.Number(),
                assists: Type.Number(),
                points: Type.Number(),
                penaltyMinutes: Type.Number(),
                gamesPlayed: Type.Number(),
              }),
            })),
            meta: Type.Object({
              total: Type.Number(),
              limit: Type.Number(),
              offset: Type.Number(),
            }),
          }),
        },
      },
    },
    statsController.getPlayerStats
  )

  // Team statistics
  server.get(
    '/teams',
    {
      schema: {
        querystring: Type.Object({
          tournament: Type.Optional(Type.String()),
          division: Type.Optional(Type.Union([
            Type.Literal('gold'),
            Type.Literal('blue'),
          ])),
        }),
      },
    },
    statsController.getTeamStats
  )

  // Goalie statistics
  server.get(
    '/goalies',
    {
      schema: {
        querystring: Type.Object({
          tournament: Type.Optional(Type.String()),
          team: Type.Optional(Type.String()),
          minGames: Type.Optional(Type.Number()),
        }),
      },
    },
    statsController.getGoalieStats
  )

  // Real-time leaderboard updates via WebSocket
  server.get(
    '/live-leaderboard',
    { websocket: true },
    (connection, request) => {
      connection.socket.on('message', (message) => {
        const data = JSON.parse(message.toString())
        
        if (data.type === 'subscribe') {
          server.statsManager.subscribeToLeaderboard(connection.socket, data.category)
        }
      })

      connection.socket.on('close', () => {
        server.statsManager.unsubscribeFromLeaderboard(connection.socket)
      })
    }
  )
}
```

### 3. Standings Routes
**File**: `src/server/routes/standings/index.ts`

```typescript
export const standingsRoutes: FastifyPluginAsync = async (server) => {
  server.get(
    '/',
    {
      schema: {
        querystring: Type.Object({
          division: Type.Optional(Type.Union([
            Type.Literal('gold'),
            Type.Literal('blue'),
          ])),
        }),
        response: {
          200: Type.Object({
            standings: Type.Array(Type.Object({
              team: Type.Object({
                id: Type.String(),
                name: Type.String(),
                division: Type.String(),
              }),
              wins: Type.Number(),
              losses: Type.Number(),
              overtimeWins: Type.Number(),
              periodWins: Type.Number(),
              goalsFor: Type.Number(),
              goalsAgainst: Type.Number(),
              goalDifferential: Type.Number(),
              points: Type.Number(),
              gamesPlayed: Type.Number(),
            })),
            lastUpdated: Type.String(),
          }),
        },
      },
    },
    standingsController.getStandings
  )
}
```

### 4. Team Submission Routes
**File**: `src/server/routes/teams/submission.ts`

```typescript
export const teamSubmissionRoutes: FastifyPluginAsync = async (server) => {
  // Public submission endpoint
  server.post(
    '/submit',
    {
      schema: {
        body: Type.Object({
          teamName: Type.String({ minLength: 1, maxLength: 100 }),
          city: Type.String({ minLength: 1, maxLength: 100 }),
          province: Type.String({ minLength: 2, maxLength: 2 }),
          captainName: Type.String({ minLength: 1, maxLength: 100 }),
          captainEmail: Type.String({ format: 'email' }),
          captainPhone: Type.String({ pattern: '^[0-9-+()\\s]+$' }),
          alternateContact: Type.Object({
            name: Type.String({ minLength: 1, maxLength: 100 }),
            email: Type.String({ format: 'email' }),
            phone: Type.String({ pattern: '^[0-9-+()\\s]+$' }),
          }),
          estimatedRosterSize: Type.Number({ minimum: 15, maximum: 35 }),
          additionalInfo: Type.Optional(Type.String({ maxLength: 500 })),
        }),
      },
      rateLimit: {
        max: 3,
        timeWindow: '1 hour',
      },
    },
    teamController.submitTeam
  )

  // Admin approval endpoint
  server.post(
    '/:id/approve',
    {
      preHandler: server.requireRole(['admin']),
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        body: Type.Object({
          division: Type.Union([Type.Literal('gold'), Type.Literal('blue')]),
          divisionNumber: Type.String({ pattern: '^[1-4][GB]$' }),
        }),
      },
    },
    teamController.approveSubmission
  )

  // Admin rejection endpoint
  server.post(
    '/:id/reject',
    {
      preHandler: server.requireRole(['admin']),
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        body: Type.Object({
          reason: Type.String({ minLength: 1, maxLength: 500 }),
        }),
      },
    },
    teamController.rejectSubmission
  )
}
```

## Controllers

### Game Controller
**File**: `src/server/controllers/game.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { gameService } from '../services/game'
import { sseManager } from '../services/sse'

export const gameController = {
  async getGame(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const game = await gameService.getGame(request.params.id)
    
    if (!game) {
      return reply.code(404).send({ error: 'Game not found' })
    }
    
    return game
  },

  async updateScore(request: FastifyRequest<{
    Params: { id: string }
    Body: { team: 'home' | 'away'; delta: number }
  }>, reply: FastifyReply) {
    const { id } = request.params
    const { team, delta } = request.body
    
    try {
      const updatedGame = await gameService.updateScore(id, team, delta)
      
      // Broadcast update via SSE
      sseManager.broadcast(id, {
        type: 'score-update',
        data: {
          homeScore: updatedGame.homeScore,
          awayScore: updatedGame.awayScore,
        },
      })
      
      return { success: true, game: updatedGame }
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to update score' })
    }
  },

  async recordGoal(request: FastifyRequest<{
    Params: { id: string }
    Body: {
      scorer: string
      assist1?: string
      assist2?: string
      time: string
      period: string
      powerPlay?: boolean
      shortHanded?: boolean
      emptyNet?: boolean
    }
  }>, reply: FastifyReply) {
    const { id } = request.params
    
    try {
      const goal = await gameService.recordGoal(id, request.body)
      
      // Broadcast goal event
      sseManager.broadcast(id, {
        type: 'goal',
        data: goal,
      })
      
      // Audit log
      await auditService.log({
        user: request.user!.id,
        action: 'goal-recorded',
        resource: 'game',
        resourceId: id,
        details: goal,
      })
      
      return { success: true, goal }
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to record goal' })
    }
  },
}
```

## Middleware & Plugins

### SSE Plugin
**File**: `src/server/plugins/sse.ts`

```typescript
import fp from 'fastify-plugin'
import { FastifyReply } from 'fastify'

export interface SSEReply extends FastifyReply {
  sse: (data: any) => void
}

export const ssePlugin = fp(async (fastify) => {
  fastify.decorateReply('sse', function(this: FastifyReply, data: any) {
    this.raw.write(`data: ${JSON.stringify(data)}\n\n`)
  })

  fastify.addHook('onRequest', async (request, reply) => {
    if (request.routeOptions.sse) {
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      })
    }
  })
})
```

### Error Handler
**File**: `src/server/plugins/error-handler.ts`

```typescript
export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  const { validation, statusCode = 500 } = error

  if (validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      statusCode: 400,
      message: 'Request validation failed',
      details: validation,
    })
  }

  // Log server errors
  if (statusCode >= 500) {
    request.log.error(error)
  }

  return reply.status(statusCode).send({
    error: error.name || 'Internal Server Error',
    statusCode,
    message: error.message || 'An unexpected error occurred',
  })
}
```

## Performance Optimizations

### Connection Pooling
**File**: `src/server/services/database.ts`

```typescript
import { Pool } from 'pg'

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Use with Fastify
fastify.decorate('db', dbPool)
```

### Caching Strategy
**File**: `src/server/plugins/cache.ts`

```typescript
import NodeCache from 'node-cache'
import { createClient } from 'redis'

// In-memory cache for hot data
const memoryCache = new NodeCache({ stdTTL: 60 })

// Redis for distributed cache
const redis = createClient({
  url: process.env.REDIS_URL,
})

export const cachePlugin = fp(async (fastify) => {
  await redis.connect()

  fastify.decorate('cache', {
    memory: memoryCache,
    redis,
    
    async get(key: string) {
      // Check memory first
      const memValue = memoryCache.get(key)
      if (memValue) return memValue

      // Check Redis
      const redisValue = await redis.get(key)
      if (redisValue) {
        const parsed = JSON.parse(redisValue)
        memoryCache.set(key, parsed, 30) // Cache in memory for 30s
        return parsed
      }

      return null
    },

    async set(key: string, value: any, ttl = 300) {
      memoryCache.set(key, value, Math.min(ttl, 60))
      await redis.setEx(key, ttl, JSON.stringify(value))
    },
  })
})
```

## Testing

### Integration Tests
**File**: `src/server/__tests__/games.test.ts`

```typescript
import { test } from 'tap'
import { build } from '../helper'

test('game endpoints', async (t) => {
  const app = await build()

  t.teardown(() => app.close())

  t.test('GET /api/games/:id', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/games/test-game-id',
    })

    t.equal(response.statusCode, 200)
    t.hasOwnProp(response.json(), 'homeTeam')
    t.hasOwnProp(response.json(), 'awayTeam')
  })

  t.test('POST /api/games/:id/goal requires auth', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/games/test-game-id/goal',
      payload: {
        scorer: 'player-id',
        time: '12:34',
        period: '1',
      },
    })

    t.equal(response.statusCode, 401)
  })
})
```

## Deployment Configuration

### Docker Setup
**File**: `Dockerfile.api`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY ./dist ./dist
EXPOSE 3001
CMD ["node", "dist/server/index.js"]
```

### Environment Variables
```env
# API Configuration
API_PORT=3001
LOG_LEVEL=info

# Authentication
JWT_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cowtown

# Redis
REDIS_URL=redis://localhost:6379

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://cowtownshowdown.com

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```