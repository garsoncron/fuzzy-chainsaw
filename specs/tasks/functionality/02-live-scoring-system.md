# Functionality Task: Live Scoring System

## Overview
Implement a robust real-time scoring system that handles live game updates, broadcasts changes to all connected clients, and maintains data consistency across the platform.

## System Architecture

### 1. Core Components

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Scorekeeper   │────▶│   API Server     │────▶│    Database     │
│   Interface     │     │  (Next.js API)   │     │  (PostgreSQL)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         └─────────────▶│   SSE Broker     │
                        │  (Real-time)     │
                        └──────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Public Users   │     │  Scoreboard      │     │   Admin Panel   │
│  (Web/Mobile)   │     │   Displays       │     │  (Monitoring)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2. Data Flow

1. **Scorekeeper Action** → API Endpoint → Database Update
2. **Database Update** → SSE Event → All Connected Clients
3. **Client Update** → UI Re-render → User Sees Change

## Real-time Event System

### 1. SSE Event Manager
**File**: `src/lib/sse/event-manager.ts`

```typescript
export class SSEEventManager {
  private clients: Map<string, Set<Response>> = new Map()
  private gameStates: Map<string, GameState> = new Map()
  
  // Add client to game room
  addClient(gameId: string, response: Response) {
    if (!this.clients.has(gameId)) {
      this.clients.set(gameId, new Set())
    }
    this.clients.get(gameId)!.add(response)
    
    // Send initial state
    this.sendInitialState(gameId, response)
  }
  
  // Broadcast event to all clients watching a game
  broadcastGameEvent(gameId: string, event: GameEvent) {
    const clients = this.clients.get(gameId) || new Set()
    const eventData = this.formatSSEEvent(event)
    
    clients.forEach(client => {
      try {
        client.write(eventData)
      } catch (error) {
        // Remove dead connections
        clients.delete(client)
      }
    })
    
    // Update cached game state
    this.updateGameState(gameId, event)
  }
  
  private formatSSEEvent(event: GameEvent): string {
    return `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\nid: ${event.id}\n\n`
  }
}
```

### 2. Event Types
**File**: `src/types/game-events.ts`

```typescript
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
  PENALTY_REMOVED = 'penalty-removed',
  
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
  userId: string // Who triggered the event
}
```

### 3. Game State Cache
**File**: `src/lib/game-state-cache.ts`

```typescript
import { Redis } from '@upstash/redis'

export class GameStateCache {
  private redis: Redis
  private memoryCache: Map<string, CachedGameState> = new Map()
  
  async getGameState(gameId: string): Promise<GameState | null> {
    // Check memory cache first
    const cached = this.memoryCache.get(gameId)
    if (cached && cached.expiry > Date.now()) {
      return cached.state
    }
    
    // Check Redis
    const redisState = await this.redis.get(`game:${gameId}`)
    if (redisState) {
      // Update memory cache
      this.memoryCache.set(gameId, {
        state: redisState,
        expiry: Date.now() + 5000, // 5 second TTL
      })
      return redisState
    }
    
    // Load from database
    return this.loadFromDatabase(gameId)
  }
  
  async updateGameState(gameId: string, updates: Partial<GameState>) {
    const current = await this.getGameState(gameId)
    const updated = { ...current, ...updates }
    
    // Update all caches
    await this.redis.setex(`game:${gameId}`, 300, updated) // 5 min TTL
    this.memoryCache.set(gameId, {
      state: updated,
      expiry: Date.now() + 5000,
    })
    
    return updated
  }
}
```

## Live Scoring Endpoints

### 1. Score Management
**File**: `src/app/api/games/[id]/score/route.ts`

```typescript
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!canManageGame(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { team, delta } = await req.json()
  
  // Validate
  if (!['home', 'away'].includes(team) || typeof delta !== 'number') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  
  // Update score
  const game = await payload.update({
    collection: 'games',
    id: params.id,
    data: {
      [`${team}Score`]: { increment: delta },
    },
  })
  
  // Broadcast update
  eventManager.broadcastGameEvent(params.id, {
    type: GameEventType.SCORE_UPDATE,
    gameId: params.id,
    data: {
      homeScore: game.homeScore,
      awayScore: game.awayScore,
    },
  })
  
  return NextResponse.json({ success: true, game })
}
```

### 2. Goal Recording
**File**: `src/app/api/games/[id]/goals/route.ts`

```typescript
export async function POST(req: Request) {
  const data = await req.json()
  
  // Start transaction
  const client = await db.connect()
  
  try {
    await client.query('BEGIN')
    
    // Create goal record
    const goal = await payload.create({
      collection: 'goals',
      data: {
        game: params.id,
        scorer: data.scorer,
        assist1: data.assist1,
        assist2: data.assist2,
        team: data.team,
        period: data.period,
        time: data.time,
        gameTime: calculateGameTime(data.period, data.time),
        powerPlay: data.powerPlay,
        shortHanded: data.shortHanded,
        emptyNet: data.emptyNet,
      },
    })
    
    // Update game score
    await payload.update({
      collection: 'games',
      id: params.id,
      data: {
        [`${data.team}Score`]: { increment: 1 },
      },
    })
    
    // Update player stats
    await updatePlayerStats([
      { playerId: data.scorer, goals: 1, points: 1 },
      data.assist1 && { playerId: data.assist1, assists: 1, points: 1 },
      data.assist2 && { playerId: data.assist2, assists: 1, points: 1 },
    ].filter(Boolean))
    
    await client.query('COMMIT')
    
    // Broadcast goal event
    eventManager.broadcastGameEvent(params.id, {
      type: GameEventType.GOAL,
      gameId: params.id,
      data: goal,
    })
    
    return NextResponse.json({ success: true, goal })
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
```

### 3. Period Management
**File**: `src/lib/period-manager.ts`

```typescript
export class PeriodManager {
  private timers: Map<string, NodeJS.Timeout> = new Map()
  
  async startPeriod(gameId: string, period: string) {
    // Clear any existing timer
    this.stopPeriod(gameId)
    
    // Update game state
    await gameStateCache.updateGameState(gameId, {
      currentPeriod: period,
      periodTimeRemaining: PERIOD_LENGTH_SECONDS,
      status: 'live',
    })
    
    // Start countdown timer
    const timer = setInterval(async () => {
      const state = await gameStateCache.getGameState(gameId)
      
      if (state.periodTimeRemaining <= 0) {
        this.endPeriod(gameId)
        return
      }
      
      // Update time
      await gameStateCache.updateGameState(gameId, {
        periodTimeRemaining: state.periodTimeRemaining - 1,
      })
      
      // Broadcast time update every 5 seconds
      if (state.periodTimeRemaining % 5 === 0) {
        eventManager.broadcastGameEvent(gameId, {
          type: GameEventType.TIME_UPDATE,
          gameId,
          data: {
            period: state.currentPeriod,
            timeRemaining: state.periodTimeRemaining - 1,
          },
        })
      }
    }, 1000)
    
    this.timers.set(gameId, timer)
  }
  
  stopPeriod(gameId: string) {
    const timer = this.timers.get(gameId)
    if (timer) {
      clearInterval(timer)
      this.timers.delete(gameId)
    }
  }
  
  async endPeriod(gameId: string) {
    this.stopPeriod(gameId)
    
    const state = await gameStateCache.getGameState(gameId)
    
    // Create period record
    await payload.create({
      collection: 'periods',
      data: {
        game: gameId,
        periodNumber: parseInt(state.currentPeriod),
        endTime: new Date(),
        homeScore: state.homePeriodScore,
        awayScore: state.awayPeriodScore,
      },
    })
    
    // Broadcast period end
    eventManager.broadcastGameEvent(gameId, {
      type: GameEventType.PERIOD_END,
      gameId,
      data: {
        period: state.currentPeriod,
        nextPeriod: getNextPeriod(state.currentPeriod),
      },
    })
  }
}
```

## Client-Side Integration

### 1. React Hook for Live Games
**File**: `src/hooks/useLiveGame.ts`

```typescript
export function useLiveGame(gameId: string) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [events, setEvents] = useState<GameEvent[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  
  useEffect(() => {
    const eventSource = new EventSource(`/api/games/${gameId}/live`)
    
    eventSource.onopen = () => {
      setConnectionStatus('connected')
    }
    
    eventSource.onerror = () => {
      setConnectionStatus('disconnected')
    }
    
    // Handle different event types
    eventSource.addEventListener('game-state', (e) => {
      const state = JSON.parse(e.data)
      setGameState(state)
    })
    
    eventSource.addEventListener('goal', (e) => {
      const goal = JSON.parse(e.data)
      setEvents(prev => [...prev, { type: 'goal', data: goal }])
      
      // Update score optimistically
      setGameState(prev => ({
        ...prev!,
        [`${goal.team}Score`]: prev![`${goal.team}Score`] + 1,
      }))
      
      // Show notification
      showGoalNotification(goal)
    })
    
    eventSource.addEventListener('score-update', (e) => {
      const scores = JSON.parse(e.data)
      setGameState(prev => ({
        ...prev!,
        homeScore: scores.homeScore,
        awayScore: scores.awayScore,
      }))
    })
    
    eventSource.addEventListener('time-update', (e) => {
      const { period, timeRemaining } = JSON.parse(e.data)
      setGameState(prev => ({
        ...prev!,
        currentPeriod: period,
        periodTimeRemaining: timeRemaining,
      }))
    })
    
    return () => {
      eventSource.close()
    }
  }, [gameId])
  
  return {
    gameState,
    events,
    connectionStatus,
    isLive: gameState?.status === 'live',
  }
}
```

### 2. Optimistic Updates
**File**: `src/lib/optimistic-updates.ts`

```typescript
export class OptimisticUpdateManager {
  private pendingUpdates: Map<string, PendingUpdate> = new Map()
  
  async executeWithOptimisticUpdate<T>(
    optimisticUpdate: () => void,
    serverAction: () => Promise<T>,
    rollback: () => void
  ): Promise<T> {
    const updateId = generateId()
    
    // Apply optimistic update
    optimisticUpdate()
    
    this.pendingUpdates.set(updateId, {
      rollback,
      timestamp: Date.now(),
    })
    
    try {
      const result = await serverAction()
      this.pendingUpdates.delete(updateId)
      return result
    } catch (error) {
      // Rollback on error
      rollback()
      this.pendingUpdates.delete(updateId)
      throw error
    }
  }
  
  // Rollback all pending updates (connection lost)
  rollbackAll() {
    this.pendingUpdates.forEach(update => {
      update.rollback()
    })
    this.pendingUpdates.clear()
  }
}
```

## Statistics Calculation

### 1. Real-time Stats Engine
**File**: `src/lib/stats-engine.ts`

```typescript
export class StatsEngine {
  async calculatePlayerStats(playerId: string, tournamentId?: string) {
    const goals = await payload.find({
      collection: 'goals',
      where: {
        scorer: { equals: playerId },
        ...(tournamentId && { 'game.tournament': { equals: tournamentId } }),
      },
    })
    
    const assists = await payload.find({
      collection: 'goals',
      where: {
        or: [
          { assist1: { equals: playerId } },
          { assist2: { equals: playerId } },
        ],
        ...(tournamentId && { 'game.tournament': { equals: tournamentId } }),
      },
    })
    
    const penalties = await payload.find({
      collection: 'penalties',
      where: {
        player: { equals: playerId },
        ...(tournamentId && { 'game.tournament': { equals: tournamentId } }),
      },
    })
    
    return {
      goals: goals.totalDocs,
      assists: assists.totalDocs,
      points: goals.totalDocs + assists.totalDocs,
      penaltyMinutes: penalties.docs.reduce((sum, p) => sum + parsePenaltyMinutes(p.duration), 0),
    }
  }
  
  async calculateTeamStandings(division: 'gold' | 'blue') {
    const teams = await payload.find({
      collection: 'teams',
      where: { division: { equals: division } },
    })
    
    const standings = await Promise.all(
      teams.docs.map(async (team) => {
        const games = await this.getTeamGames(team.id)
        const stats = this.calculate5PointSystem(team.id, games)
        
        return {
          team,
          ...stats,
        }
      })
    )
    
    // Sort by points, then tiebreakers
    return standings.sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points
      if (a.wins !== b.wins) return b.wins - a.wins
      if (a.goalDiff !== b.goalDiff) return b.goalDiff - a.goalDiff
      return b.goalsFor - a.goalsFor
    })
  }
  
  private calculate5PointSystem(teamId: string, games: Game[]) {
    let points = 0
    let wins = 0
    let losses = 0
    let periodWins = 0
    
    games.forEach(game => {
      const isHome = game.homeTeam.id === teamId
      const teamScore = isHome ? game.homeScore : game.awayScore
      const oppScore = isHome ? game.awayScore : game.homeScore
      
      if (teamScore > oppScore) {
        wins++
        points += 2 // Win
      } else {
        losses++
      }
      
      // Count period wins
      game.periods.forEach(period => {
        const teamPeriodScore = isHome ? period.homeScore : period.awayScore
        const oppPeriodScore = isHome ? period.awayScore : period.homeScore
        
        if (teamPeriodScore > oppPeriodScore) {
          periodWins++
          points += 1 // Period win
        }
      })
    })
    
    return { wins, losses, periodWins, points }
  }
}
```

## Performance Optimization

### 1. Connection Pooling
```typescript
// Reuse SSE connections for multiple games
class SSEConnectionPool {
  private connections: Map<string, EventSource> = new Map()
  
  getConnection(gameId: string): EventSource {
    if (!this.connections.has(gameId)) {
      const eventSource = new EventSource(`/api/games/${gameId}/live`)
      this.connections.set(gameId, eventSource)
    }
    return this.connections.get(gameId)!
  }
}
```

### 2. Debounced Updates
```typescript
// Batch rapid updates
const debouncedBroadcast = debounce((gameId: string, events: GameEvent[]) => {
  eventManager.broadcastGameEvent(gameId, {
    type: GameEventType.BATCH_UPDATE,
    data: events,
  })
}, 100)
```

### 3. Selective Updates
```typescript
// Only send relevant data to minimize bandwidth
function filterEventData(event: GameEvent, clientType: 'public' | 'scorekeeper' | 'admin') {
  switch (clientType) {
    case 'public':
      // Remove sensitive data
      delete event.data.userId
      break
    case 'scorekeeper':
      // Include audit info
      break
    case 'admin':
      // Full data
      break
  }
  return event
}
```

## Error Handling & Recovery

### 1. Automatic Reconnection
```typescript
class ResilientSSEClient {
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  
  connect() {
    this.eventSource = new EventSource(this.url)
    
    this.eventSource.onerror = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++
          this.connect()
        }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000))
      }
    }
    
    this.eventSource.onopen = () => {
      this.reconnectAttempts = 0
    }
  }
}
```

### 2. State Recovery
```typescript
// Recover from disconnections
async function recoverGameState(gameId: string, lastEventId: string) {
  // Get all events since last known state
  const missedEvents = await getMissedEvents(gameId, lastEventId)
  
  // Replay events to catch up
  missedEvents.forEach(event => {
    applyEventToState(event)
  })
}
```

## Testing Strategy

1. **Load Testing**: Simulate 500-900 concurrent connections
2. **Latency Testing**: Measure update propagation time
3. **Failure Testing**: Test connection drops, server restarts
4. **Consistency Testing**: Verify data integrity across clients
5. **Performance Testing**: Monitor CPU/memory usage under load