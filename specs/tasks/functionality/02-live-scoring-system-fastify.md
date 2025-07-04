# Functionality Task: Live Scoring System with Fastify

## Overview
Implement a robust real-time scoring system using Fastify for high-performance API endpoints, with Server-Sent Events (SSE) and WebSocket support for live updates.

## System Architecture

### 1. Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Scorekeeper   │────▶│  Fastify API     │────▶│    Database     │
│   Interface     │     │  Server (:3001)  │     │  (PostgreSQL)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐     ┌─────────────────┐
         └─────────────▶│   SSE/WS Hub     │────▶│     Redis       │
                        │  (Real-time)     │     │    (Cache)      │
                        └──────────────────┘     └─────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Public Users   │     │  Scoreboard      │     │   Admin Panel   │
│  (Web/Mobile)   │     │   Displays       │     │  (Monitoring)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2. Fastify Server with Real-time Support
**File**: `src/server/real-time.ts`

```typescript
import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import { EventEmitter } from 'events'
import Redis from 'ioredis'

// Global event bus for real-time updates
export const gameEventBus = new EventEmitter()

// Redis for pub/sub across multiple servers
const publisher = new Redis(process.env.REDIS_URL)
const subscriber = new Redis(process.env.REDIS_URL)

export const setupRealTimeServer = async () => {
  const server = Fastify({ logger: true })
  
  await server.register(websocket, {
    options: {
      maxPayload: 1048576, // 1MB
      perMessageDeflate: true,
    },
  })

  // SSE endpoint for game updates
  server.get('/games/:id/events', { sse: true }, async (request, reply) => {
    const { id: gameId } = request.params as { id: string }
    
    // Set SSE headers
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable Nginx buffering
    })

    // Send initial connection event
    reply.sse({
      event: 'connected',
      data: { gameId, timestamp: new Date() },
    })

    // Subscribe to game events
    const eventHandler = (event: GameEvent) => {
      if (event.gameId === gameId) {
        reply.sse({
          id: event.id,
          event: event.type,
          data: event.data,
          retry: 5000,
        })
      }
    }

    gameEventBus.on('game-event', eventHandler)

    // Handle client disconnect
    request.raw.on('close', () => {
      gameEventBus.off('game-event', eventHandler)
      reply.raw.end()
    })

    // Keep connection alive
    const keepAlive = setInterval(() => {
      reply.sse({ event: 'ping', data: Date.now() })
    }, 30000)

    request.raw.on('close', () => {
      clearInterval(keepAlive)
    })
  })

  // WebSocket endpoint for bi-directional communication
  server.get('/games/:id/ws', { websocket: true }, (connection, request) => {
    const { id: gameId } = request.params as { id: string }
    const { socket } = connection
    
    server.log.info(`WebSocket connected for game ${gameId}`)

    // Send initial state
    socket.send(JSON.stringify({
      type: 'connected',
      gameId,
      timestamp: new Date(),
    }))

    // Handle incoming messages
    socket.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString())
        
        switch (data.type) {
          case 'subscribe-stats':
            subscribeToStats(socket, gameId, data.statType)
            break
          case 'ping':
            socket.send(JSON.stringify({ type: 'pong' }))
            break
        }
      } catch (error) {
        server.log.error(error)
      }
    })

    // Subscribe to game events
    const eventHandler = (event: GameEvent) => {
      if (event.gameId === gameId) {
        socket.send(JSON.stringify(event))
      }
    }

    gameEventBus.on('game-event', eventHandler)

    socket.on('close', () => {
      gameEventBus.off('game-event', eventHandler)
      server.log.info(`WebSocket disconnected for game ${gameId}`)
    })
  })

  // Redis pub/sub for multi-server support
  subscriber.subscribe('game-events')
  subscriber.on('message', (channel, message) => {
    const event = JSON.parse(message)
    gameEventBus.emit('game-event', event)
  })

  return server
}
```

## Event Management System

### 1. Event Manager Service
**File**: `src/server/services/event-manager.ts`

```typescript
import { v4 as uuid } from 'uuid'
import { publisher } from './redis'
import { gameStateCache } from './cache'

export enum GameEventType {
  // Game state
  GAME_START = 'game-start',
  GAME_END = 'game-end',
  PERIOD_START = 'period-start',
  PERIOD_END = 'period-end',
  
  // Scoring
  GOAL = 'goal',
  GOAL_REMOVED = 'goal-removed',
  
  // Penalties
  PENALTY = 'penalty',
  PENALTY_EXPIRED = 'penalty-expired',
  
  // Other events
  TIMEOUT = 'timeout',
  GOALIE_CHANGE = 'goalie-change',
  THREE_STARS = 'three-stars',
  
  // Updates
  SCORE_UPDATE = 'score-update',
  TIME_UPDATE = 'time-update',
  STATS_UPDATE = 'stats-update',
}

export interface GameEvent {
  id: string
  type: GameEventType
  gameId: string
  timestamp: Date
  data: any
  userId?: string
  sequence: number
}

export class EventManager {
  private eventSequence = new Map<string, number>()

  async publishEvent(
    gameId: string,
    type: GameEventType,
    data: any,
    userId?: string
  ): Promise<GameEvent> {
    // Get next sequence number
    const sequence = this.getNextSequence(gameId)
    
    const event: GameEvent = {
      id: uuid(),
      type,
      gameId,
      timestamp: new Date(),
      data,
      userId,
      sequence,
    }

    // Store in event log
    await this.storeEvent(event)

    // Update game state cache
    await this.updateGameState(gameId, event)

    // Publish to Redis for distribution
    await publisher.publish('game-events', JSON.stringify(event))

    // Emit locally for immediate processing
    gameEventBus.emit('game-event', event)

    return event
  }

  private getNextSequence(gameId: string): number {
    const current = this.eventSequence.get(gameId) || 0
    const next = current + 1
    this.eventSequence.set(gameId, next)
    return next
  }

  private async storeEvent(event: GameEvent) {
    // Store in database for replay/audit
    await db.query(
      `INSERT INTO game_events 
       (id, game_id, type, data, user_id, sequence, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [event.id, event.gameId, event.type, event.data, event.userId, event.sequence, event.timestamp]
    )
  }

  private async updateGameState(gameId: string, event: GameEvent) {
    const state = await gameStateCache.get(gameId)
    if (!state) return

    switch (event.type) {
      case GameEventType.GOAL:
        const { team } = event.data
        state[`${team}Score`]++
        break
      
      case GameEventType.PERIOD_START:
        state.currentPeriod = event.data.period
        state.periodTimeRemaining = PERIOD_LENGTH_SECONDS
        state.status = 'live'
        break
      
      case GameEventType.PERIOD_END:
        state.periods.push({
          number: state.currentPeriod,
          homeScore: state.homePeriodScore,
          awayScore: state.awayPeriodScore,
        })
        break
    }

    await gameStateCache.set(gameId, state)
  }

  async replayEvents(gameId: string, fromSequence: number = 0): Promise<GameEvent[]> {
    // Fetch events from database
    const result = await db.query(
      `SELECT * FROM game_events 
       WHERE game_id = $1 AND sequence > $2 
       ORDER BY sequence ASC`,
      [gameId, fromSequence]
    )

    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      gameId: row.game_id,
      timestamp: row.created_at,
      data: row.data,
      userId: row.user_id,
      sequence: row.sequence,
    }))
  }
}

export const eventManager = new EventManager()
```

### 2. Game State Cache
**File**: `src/server/services/game-state-cache.ts`

```typescript
import Redis from 'ioredis'
import { LRUCache } from 'lru-cache'

interface GameState {
  id: string
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  homeTeam: { id: string; name: string }
  awayTeam: { id: string; name: string }
  homeScore: number
  awayScore: number
  currentPeriod: string
  periodTimeRemaining: number
  periods: PeriodScore[]
  penalties: ActivePenalty[]
  lastUpdate: Date
}

export class GameStateCache {
  private redis: Redis
  private memoryCache: LRUCache<string, GameState>

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL)
    this.memoryCache = new LRUCache<string, GameState>({
      max: 100,
      ttl: 1000 * 60 * 5, // 5 minutes
      updateAgeOnGet: true,
    })
  }

  async get(gameId: string): Promise<GameState | null> {
    // Check memory cache first
    const cached = this.memoryCache.get(gameId)
    if (cached) return cached

    // Check Redis
    const redisData = await this.redis.get(`game:${gameId}`)
    if (redisData) {
      const state = JSON.parse(redisData)
      this.memoryCache.set(gameId, state)
      return state
    }

    // Load from database
    const dbState = await this.loadFromDatabase(gameId)
    if (dbState) {
      await this.set(gameId, dbState)
    }
    
    return dbState
  }

  async set(gameId: string, state: GameState): Promise<void> {
    state.lastUpdate = new Date()
    
    // Update both caches
    this.memoryCache.set(gameId, state)
    await this.redis.setex(
      `game:${gameId}`,
      300, // 5 minute expiry
      JSON.stringify(state)
    )
  }

  async invalidate(gameId: string): Promise<void> {
    this.memoryCache.delete(gameId)
    await this.redis.del(`game:${gameId}`)
  }

  private async loadFromDatabase(gameId: string): Promise<GameState | null> {
    const game = await payload.findByID({
      collection: 'games',
      id: gameId,
      depth: 2,
    })

    if (!game) return null

    return {
      id: game.id,
      status: game.status,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      currentPeriod: game.currentPeriod,
      periodTimeRemaining: game.periodTimeRemaining,
      periods: game.periods || [],
      penalties: await this.getActivePenalties(gameId),
      lastUpdate: new Date(),
    }
  }
}

export const gameStateCache = new GameStateCache()
```

## Fastify Game Controllers

### 1. Live Game Controller
**File**: `src/server/controllers/live-game.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { eventManager } from '../services/event-manager'
import { gameStateCache } from '../services/game-state-cache'
import { periodManager } from '../services/period-manager'

export const liveGameController = {
  async startGame(
    request: FastifyRequest<{
      Params: { id: string }
      Body: { homeStartingGoalie: string; awayStartingGoalie: string }
    }>,
    reply: FastifyReply
  ) {
    const { id: gameId } = request.params
    const { homeStartingGoalie, awayStartingGoalie } = request.body

    try {
      // Update game status
      await payload.update({
        collection: 'games',
        id: gameId,
        data: {
          status: 'live',
          homeStartingGoalie,
          awayStartingGoalie,
          homeCurrentGoalie: homeStartingGoalie,
          awayCurrentGoalie: awayStartingGoalie,
        },
      })

      // Publish event
      await eventManager.publishEvent(
        gameId,
        GameEventType.GAME_START,
        {
          homeStartingGoalie,
          awayStartingGoalie,
        },
        request.user?.id
      )

      return { success: true }
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to start game' })
    }
  },

  async recordGoal(
    request: FastifyRequest<{
      Params: { id: string }
      Body: GoalData
    }>,
    reply: FastifyReply
  ) {
    const { id: gameId } = request.params
    const goalData = request.body

    // Start transaction
    const client = await dbPool.connect()
    
    try {
      await client.query('BEGIN')

      // Create goal record
      const goal = await payload.create({
        collection: 'goals',
        data: {
          game: gameId,
          ...goalData,
          gameTime: calculateGameTime(goalData.period, goalData.time),
        },
      })

      // Update game score
      const teamField = `${goalData.team}Score`
      await client.query(
        `UPDATE games SET ${teamField} = ${teamField} + 1 WHERE id = $1`,
        [gameId]
      )

      // Update player stats
      await updatePlayerStats(client, [
        { playerId: goalData.scorer, goals: 1, points: 1 },
        goalData.assist1 && { playerId: goalData.assist1, assists: 1, points: 1 },
        goalData.assist2 && { playerId: goalData.assist2, assists: 1, points: 1 },
      ].filter(Boolean))

      await client.query('COMMIT')

      // Publish goal event
      await eventManager.publishEvent(
        gameId,
        GameEventType.GOAL,
        goal,
        request.user?.id
      )

      return { success: true, goal }
    } catch (error) {
      await client.query('ROLLBACK')
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to record goal' })
    } finally {
      client.release()
    }
  },

  async updatePeriodTime(
    request: FastifyRequest<{
      Params: { id: string }
      Body: { timeRemaining: number }
    }>,
    reply: FastifyReply
  ) {
    const { id: gameId } = request.params
    const { timeRemaining } = request.body

    try {
      const state = await gameStateCache.get(gameId)
      if (!state) {
        return reply.code(404).send({ error: 'Game not found' })
      }

      state.periodTimeRemaining = timeRemaining
      await gameStateCache.set(gameId, state)

      // Broadcast time update (throttled)
      if (timeRemaining % 5 === 0 || timeRemaining < 10) {
        await eventManager.publishEvent(
          gameId,
          GameEventType.TIME_UPDATE,
          {
            period: state.currentPeriod,
            timeRemaining,
          }
        )
      }

      return { success: true }
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Failed to update time' })
    }
  },
}
```

### 2. Period Management Service
**File**: `src/server/services/period-manager.ts`

```typescript
import { eventManager, GameEventType } from './event-manager'
import { gameStateCache } from './game-state-cache'

const PERIOD_LENGTH_SECONDS = 12 * 60 // 12 minutes

export class PeriodManager {
  private timers = new Map<string, NodeJS.Timer>()

  async startPeriod(gameId: string, period: string) {
    // Clear any existing timer
    this.stopTimer(gameId)

    // Update game state
    const state = await gameStateCache.get(gameId)
    if (!state) throw new Error('Game not found')

    state.currentPeriod = period
    state.periodTimeRemaining = PERIOD_LENGTH_SECONDS
    state.status = 'live'
    await gameStateCache.set(gameId, state)

    // Publish period start event
    await eventManager.publishEvent(
      gameId,
      GameEventType.PERIOD_START,
      { period, startTime: new Date() }
    )

    // Start countdown timer
    const timer = setInterval(async () => {
      const currentState = await gameStateCache.get(gameId)
      if (!currentState || currentState.periodTimeRemaining <= 0) {
        await this.endPeriod(gameId)
        return
      }

      currentState.periodTimeRemaining--
      await gameStateCache.set(gameId, currentState)

      // Broadcast time updates at intervals
      if (
        currentState.periodTimeRemaining % 30 === 0 || // Every 30 seconds
        currentState.periodTimeRemaining === 60 || // 1 minute warning
        currentState.periodTimeRemaining === 30 || // 30 second warning
        currentState.periodTimeRemaining <= 10 // Final countdown
      ) {
        await eventManager.publishEvent(
          gameId,
          GameEventType.TIME_UPDATE,
          {
            period: currentState.currentPeriod,
            timeRemaining: currentState.periodTimeRemaining,
          }
        )
      }
    }, 1000)

    this.timers.set(gameId, timer)
  }

  async pausePeriod(gameId: string) {
    this.stopTimer(gameId)
    
    const state = await gameStateCache.get(gameId)
    if (state) {
      state.status = 'paused'
      await gameStateCache.set(gameId, state)
    }
  }

  async endPeriod(gameId: string) {
    this.stopTimer(gameId)

    const state = await gameStateCache.get(gameId)
    if (!state) return

    // Calculate period scores
    const periodScore = await this.calculatePeriodScore(gameId, state.currentPeriod)

    // Create period record
    await payload.create({
      collection: 'periods',
      data: {
        game: gameId,
        periodNumber: parseInt(state.currentPeriod),
        homeScore: periodScore.home,
        awayScore: periodScore.away,
        endTime: new Date(),
      },
    })

    // Publish period end event
    await eventManager.publishEvent(
      gameId,
      GameEventType.PERIOD_END,
      {
        period: state.currentPeriod,
        homeScore: periodScore.home,
        awayScore: periodScore.away,
      }
    )

    // Update game state
    state.status = 'intermission'
    await gameStateCache.set(gameId, state)
  }

  private stopTimer(gameId: string) {
    const timer = this.timers.get(gameId)
    if (timer) {
      clearInterval(timer)
      this.timers.delete(gameId)
    }
  }

  private async calculatePeriodScore(gameId: string, period: string) {
    const goals = await payload.find({
      collection: 'goals',
      where: {
        game: { equals: gameId },
        period: { equals: period },
      },
    })

    const homeGoals = goals.docs.filter(g => g.team === 'home').length
    const awayGoals = goals.docs.filter(g => g.team === 'away').length

    return { home: homeGoals, away: awayGoals }
  }
}

export const periodManager = new PeriodManager()
```

## Client Integration

### 1. React Hook with Fastify SSE
**File**: `src/hooks/useLiveGameFastify.ts`

```typescript
import { useEffect, useState, useRef } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'

interface GameState {
  id: string
  status: string
  homeScore: number
  awayScore: number
  currentPeriod: string
  periodTimeRemaining: number
  penalties: Penalty[]
}

export function useLiveGame(gameId: string) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<Date | null>(null)
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null)

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}/events`
    
    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      withCredentials: true,
    })

    eventSourceRef.current = eventSource

    eventSource.addEventListener('connected', (e: any) => {
      console.log('Connected to game events', e.data)
      setIsConnected(true)
    })

    eventSource.addEventListener('game-state', (e: any) => {
      const state = JSON.parse(e.data)
      setGameState(state)
      setLastEvent(new Date())
    })

    eventSource.addEventListener('goal', (e: any) => {
      const goal = JSON.parse(e.data)
      
      // Update score optimistically
      setGameState(prev => {
        if (!prev) return null
        return {
          ...prev,
          [`${goal.team}Score`]: prev[`${goal.team}Score`] + 1,
        }
      })
      
      // Show notification
      showGoalNotification(goal)
      setLastEvent(new Date())
    })

    eventSource.addEventListener('score-update', (e: any) => {
      const { homeScore, awayScore } = JSON.parse(e.data)
      setGameState(prev => ({
        ...prev!,
        homeScore,
        awayScore,
      }))
      setLastEvent(new Date())
    })

    eventSource.addEventListener('time-update', (e: any) => {
      const { period, timeRemaining } = JSON.parse(e.data)
      setGameState(prev => ({
        ...prev!,
        currentPeriod: period,
        periodTimeRemaining: timeRemaining,
      }))
    })

    eventSource.addEventListener('error', (e: any) => {
      console.error('SSE error:', e)
      setIsConnected(false)
      
      // Implement exponential backoff reconnection
      if (e.readyState === EventSource.CLOSED) {
        setTimeout(() => {
          console.log('Reconnecting...')
          eventSource.close()
          // Component will re-render and create new connection
        }, 5000)
      }
    })

    // Cleanup
    return () => {
      eventSource.close()
    }
  }, [gameId])

  return {
    gameState,
    isConnected,
    lastEvent,
    isLive: gameState?.status === 'live',
  }
}
```

### 2. WebSocket Client for Advanced Features
**File**: `src/hooks/useGameWebSocket.ts`

```typescript
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useGameWebSocket(gameId: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const reconnectAttemptsRef = useRef(0)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL!, {
      path: '/games/ws',
      transports: ['websocket'],
      auth: {
        token: getAuthToken(),
      },
      query: {
        gameId,
      },
    })

    socketInstance.on('connect', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
      reconnectAttemptsRef.current = 0
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error)
      reconnectAttemptsRef.current++
      
      // Exponential backoff
      const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
      setTimeout(() => {
        socketInstance.connect()
      }, timeout)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [gameId])

  return {
    socket,
    isConnected,
    emit: (event: string, data: any) => socket?.emit(event, data),
    on: (event: string, handler: (data: any) => void) => {
      socket?.on(event, handler)
      return () => socket?.off(event, handler)
    },
  }
}
```

## Performance & Scalability

### 1. Load Balancing with Sticky Sessions
**File**: `nginx.conf`

```nginx
upstream fastify_backend {
    ip_hash;  # Sticky sessions for SSE/WebSocket
    server api1:3001;
    server api2:3001;
    server api3:3001;
}

server {
    location /api {
        proxy_pass http://fastify_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # SSE specific
        proxy_set_header X-Accel-Buffering no;
        proxy_read_timeout 86400;
    }
}
```

### 2. Redis Cluster for High Availability
**File**: `src/server/services/redis-cluster.ts`

```typescript
import Redis from 'ioredis'

export const redisCluster = new Redis.Cluster([
  { port: 6380, host: 'redis-1' },
  { port: 6381, host: 'redis-2' },
  { port: 6382, host: 'redis-3' },
], {
  dnsLookup: (address, callback) => callback(null, address),
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
  },
  retryDelayOnFailover: 100,
  retryDelayOnClusterDown: 300,
})
```

## Testing

### 1. Load Testing with Artillery
**File**: `load-test.yml`

```yaml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 300
      arrivalRate: 100
      name: 'Sustained load'
  processor: './load-test-processor.js'

scenarios:
  - name: 'Live Game Updates'
    engine: 'socketio'
    flow:
      - connect:
          url: '/games/{{ gameId }}/ws'
      - think: 5
      - emit:
          channel: 'subscribe-stats'
          data:
            statType: 'all'
      - think: 30
      - emit:
          channel: 'ping'
      - think: 30
  
  - name: 'SSE Connection'
    flow:
      - get:
          url: '/games/{{ gameId }}/events'
          headers:
            Accept: 'text/event-stream'
      - think: 60
```

### 2. Integration Tests
**File**: `src/server/__tests__/live-game.test.ts`

```typescript
import { test } from 'tap'
import { build } from '../test-helper'
import { EventSource } from 'eventsource'

test('live game SSE updates', async (t) => {
  const app = await build()
  const gameId = 'test-game-123'

  t.teardown(() => app.close())

  // Start SSE connection
  const eventSource = new EventSource(
    `http://localhost:${app.server.address().port}/games/${gameId}/events`
  )

  const events: any[] = []

  eventSource.addEventListener('goal', (e) => {
    events.push(JSON.parse(e.data))
  })

  // Simulate goal
  await app.inject({
    method: 'POST',
    url: `/games/${gameId}/goal`,
    headers: {
      authorization: 'Bearer test-token',
    },
    payload: {
      scorer: 'player-1',
      team: 'home',
      time: '10:00',
      period: '1',
    },
  })

  // Wait for event
  await new Promise(resolve => setTimeout(resolve, 100))

  t.equal(events.length, 1)
  t.equal(events[0].team, 'home')

  eventSource.close()
})
```