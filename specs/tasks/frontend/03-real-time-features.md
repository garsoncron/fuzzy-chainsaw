# Frontend Task: Real-time Features Implementation

## Overview
Implement real-time score updates, live game tracking, and dynamic content updates using Server-Sent Events (SSE) and optimistic UI patterns.

## Core Real-time Features

### 1. SSE Client Implementation
**File**: `src/lib/sse-client.ts`

```typescript
export class SSEClient {
  private eventSource: EventSource | null = null
  private reconnectInterval = 1000
  private maxReconnectInterval = 30000
  private reconnectAttempts = 0
  
  constructor(
    private url: string,
    private handlers: {
      onMessage?: (event: MessageEvent) => void
      onError?: (error: Event) => void
      onOpen?: () => void
      [eventType: string]: ((event: MessageEvent) => void) | undefined
    }
  ) {}
  
  connect() {
    if (this.eventSource) return
    
    this.eventSource = new EventSource(this.url)
    
    this.eventSource.onopen = () => {
      console.log('SSE connected')
      this.reconnectAttempts = 0
      this.reconnectInterval = 1000
      this.handlers.onOpen?.()
    }
    
    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      this.handlers.onError?.(error)
      this.reconnect()
    }
    
    // Register event handlers
    Object.entries(this.handlers).forEach(([event, handler]) => {
      if (event.startsWith('on')) return
      if (handler && this.eventSource) {
        this.eventSource.addEventListener(event, handler as EventListener)
      }
    })
  }
  
  private reconnect() {
    this.disconnect()
    
    setTimeout(() => {
      this.reconnectAttempts++
      this.reconnectInterval = Math.min(
        this.reconnectInterval * 2,
        this.maxReconnectInterval
      )
      this.connect()
    }, this.reconnectInterval)
  }
  
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }
}
```

### 2. Live Game Hook
**File**: `src/hooks/useLiveGame.ts`

```typescript
import { useEffect, useState, useCallback } from 'react'
import { SSEClient } from '@/lib/sse-client'

interface GameState {
  id: string
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  homeScore: number
  awayScore: number
  currentPeriod: string
  periodTimeRemaining: number
  penalties: Penalty[]
  lastGoal?: Goal
}

export function useLiveGame(gameId: string) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  
  useEffect(() => {
    const client = new SSEClient(
      `/api/games/${gameId}/live`,
      {
        onOpen: () => setIsConnected(true),
        onError: () => setIsConnected(false),
        
        'game-status': (event) => {
          const data = JSON.parse(event.data)
          setGameState(prev => ({ ...prev, ...data }))
          setLastUpdate(new Date())
        },
        
        'score-update': (event) => {
          const data = JSON.parse(event.data)
          setGameState(prev => ({
            ...prev!,
            homeScore: data.homeScore,
            awayScore: data.awayScore,
          }))
          setLastUpdate(new Date())
        },
        
        'goal': (event) => {
          const goal = JSON.parse(event.data)
          setGameState(prev => ({
            ...prev!,
            lastGoal: goal,
            homeScore: goal.team === 'home' ? prev!.homeScore + 1 : prev!.homeScore,
            awayScore: goal.team === 'away' ? prev!.awayScore + 1 : prev!.awayScore,
          }))
          
          // Show goal notification
          showGoalNotification(goal)
        },
        
        'penalty': (event) => {
          const penalty = JSON.parse(event.data)
          setGameState(prev => ({
            ...prev!,
            penalties: [...prev!.penalties, penalty],
          }))
        },
        
        'period-change': (event) => {
          const data = JSON.parse(event.data)
          setGameState(prev => ({
            ...prev!,
            currentPeriod: data.period,
            periodTimeRemaining: data.timeRemaining,
          }))
        },
      }
    )
    
    client.connect()
    
    return () => {
      client.disconnect()
    }
  }, [gameId])
  
  return {
    gameState,
    isConnected,
    lastUpdate,
  }
}
```

### 3. Live Scoreboard Component
**File**: `src/components/LiveScoreboard/index.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { SSEClient } from '@/lib/sse-client'
import { GameCard } from '../GameCard'

interface LiveGame {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeScore: number
  awayScore: number
  status: string
  currentPeriod: string
  periodTimeRemaining: number
}

export function LiveScoreboard() {
  const [liveGames, setLiveGames] = useState<LiveGame[]>([])
  const [isConnected, setIsConnected] = useState(false)
  
  useEffect(() => {
    // Initial fetch
    fetchLiveGames()
    
    // SSE connection for updates
    const client = new SSEClient('/api/live-games', {
      onOpen: () => setIsConnected(true),
      onError: () => setIsConnected(false),
      
      'games-update': (event) => {
        const games = JSON.parse(event.data)
        setLiveGames(games)
      },
    })
    
    client.connect()
    
    // Fallback polling every 30 seconds
    const interval = setInterval(fetchLiveGames, 30000)
    
    return () => {
      client.disconnect()
      clearInterval(interval)
    }
  }, [])
  
  async function fetchLiveGames() {
    try {
      const res = await fetch('/api/games?status=live')
      const data = await res.json()
      setLiveGames(data.games)
    } catch (error) {
      console.error('Failed to fetch live games:', error)
    }
  }
  
  return (
    <div className="relative">
      {/* Connection indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-xs text-muted-foreground">
          {isConnected ? 'Live' : 'Updating...'}
        </span>
      </div>
      
      {/* Scrollable game list */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {liveGames.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-muted-foreground">No games currently live</p>
            </div>
          ) : (
            liveGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                variant="live"
                showPeriodTime
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

### 4. Period Timer Component
**File**: `src/components/PeriodTimer/index.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'

interface PeriodTimerProps {
  initialTime: number // seconds
  isRunning: boolean
  onTimeUpdate?: (time: number) => void
}

export function PeriodTimer({ initialTime, isRunning, onTimeUpdate }: PeriodTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  
  useEffect(() => {
    setTimeRemaining(initialTime)
  }, [initialTime])
  
  useEffect(() => {
    if (!isRunning) return
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1)
        onTimeUpdate?.(newTime)
        return newTime
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isRunning, onTimeUpdate])
  
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  
  return (
    <div className="text-center">
      <div className="text-4xl font-mono font-bold tabular-nums">
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </div>
      {timeRemaining === 0 && isRunning && (
        <div className="text-red-500 animate-pulse mt-1">Period End</div>
      )}
    </div>
  )
}
```

### 5. Goal Notification
**File**: `src/components/GoalNotification/index.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Goal {
  scorer: Player
  assists: Player[]
  team: 'home' | 'away'
  time: string
  period: string
}

export function GoalNotification() {
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  
  useEffect(() => {
    // Listen for goal events
    const handleGoal = (event: CustomEvent<Goal>) => {
      setCurrentGoal(event.detail)
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setCurrentGoal(null)
      }, 5000)
    }
    
    window.addEventListener('goal-scored' as any, handleGoal)
    
    return () => {
      window.removeEventListener('goal-scored' as any, handleGoal)
    }
  }, [])
  
  return (
    <AnimatePresence>
      {currentGoal && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-cowtown-gold to-yellow-500 text-cowtown-dark-brown p-6 rounded-lg shadow-2xl border-4 border-cowtown-dark-brown">
            <div className="text-center">
              <h2 className="text-3xl font-western mb-2">GOAL!</h2>
              <p className="text-xl font-bold">
                {currentGoal.scorer.firstName} {currentGoal.scorer.lastName}
              </p>
              {currentGoal.assists.length > 0 && (
                <p className="text-sm mt-1">
                  Assists: {currentGoal.assists.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                </p>
              )}
              <p className="text-sm mt-2">
                {currentGoal.period} - {currentGoal.time}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 6. Penalty Box Status
**File**: `src/components/PenaltyBox/index.tsx`

```typescript
'use client'

interface PenaltyBoxProps {
  penalties: Penalty[]
  currentGameTime: number
}

export function PenaltyBox({ penalties, currentGameTime }: PenaltyBoxProps) {
  const activePenalties = penalties.filter(p => {
    const endTime = p.startTime + parseDuration(p.duration)
    return currentGameTime < endTime && !p.served
  })
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Home penalties */}
      <div className="bg-penalty-kill/20 border-2 border-penalty-kill rounded p-4">
        <h3 className="font-bold text-sm mb-2">Home Penalties</h3>
        {activePenalties
          .filter(p => p.team === 'home')
          .map(penalty => (
            <PenaltyTimer
              key={penalty.id}
              penalty={penalty}
              currentTime={currentGameTime}
            />
          ))}
      </div>
      
      {/* Away penalties */}
      <div className="bg-penalty-kill/20 border-2 border-penalty-kill rounded p-4">
        <h3 className="font-bold text-sm mb-2">Away Penalties</h3>
        {activePenalties
          .filter(p => p.team === 'away')
          .map(penalty => (
            <PenaltyTimer
              key={penalty.id}
              penalty={penalty}
              currentTime={currentGameTime}
            />
          ))}
      </div>
    </div>
  )
}

function PenaltyTimer({ penalty, currentTime }: { penalty: Penalty; currentTime: number }) {
  const timeRemaining = penalty.endTime - currentTime
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm">
        #{penalty.player.jerseyNumber} {penalty.infraction}
      </span>
      <span className="font-mono text-sm font-bold">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
```

### 7. Live Game Page
**File**: `src/app/(frontend)/games/[id]/LiveGameView.tsx`

```typescript
'use client'

import { useLiveGame } from '@/hooks/useLiveGame'
import { PeriodTimer } from '@/components/PeriodTimer'
import { PenaltyBox } from '@/components/PenaltyBox'
import { BoxScore } from '@/components/BoxScore'
import { PlayByPlay } from '@/components/PlayByPlay'

export function LiveGameView({ gameId }: { gameId: string }) {
  const { gameState, isConnected } = useLiveGame(gameId)
  
  if (!gameState) {
    return <div>Loading game data...</div>
  }
  
  return (
    <div className="space-y-6">
      {/* Game header with live indicator */}
      <div className="relative">
        {gameState.status === 'live' && (
          <div className="absolute top-0 right-0">
            <span className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              LIVE
            </span>
          </div>
        )}
        
        {/* Score display */}
        <div className="text-center">
          <div className="grid grid-cols-3 items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{gameState.homeTeam.name}</h2>
              <div className="text-5xl font-bold">{gameState.homeScore}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Period {gameState.currentPeriod}</div>
              <PeriodTimer
                initialTime={gameState.periodTimeRemaining}
                isRunning={gameState.status === 'live'}
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{gameState.awayTeam.name}</h2>
              <div className="text-5xl font-bold">{gameState.awayScore}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Penalty box status */}
      <PenaltyBox
        penalties={gameState.penalties}
        currentGameTime={calculateGameTime(gameState)}
      />
      
      {/* Box score */}
      <BoxScore game={gameState} />
      
      {/* Play by play */}
      <PlayByPlay gameId={gameId} />
    </div>
  )
}
```

## Optimistic Updates

### Goal Scoring
```typescript
const handleGoalScored = async (goalData: GoalInput) => {
  // Optimistic update
  setGameState(prev => ({
    ...prev,
    homeScore: goalData.team === 'home' ? prev.homeScore + 1 : prev.homeScore,
    awayScore: goalData.team === 'away' ? prev.awayScore + 1 : prev.awayScore,
  }))
  
  try {
    await fetch(`/api/games/${gameId}/goal`, {
      method: 'POST',
      body: JSON.stringify(goalData),
    })
  } catch (error) {
    // Revert on error
    setGameState(prev => ({
      ...prev,
      homeScore: goalData.team === 'home' ? prev.homeScore - 1 : prev.homeScore,
      awayScore: goalData.team === 'away' ? prev.awayScore - 1 : prev.awayScore,
    }))
    toast.error('Failed to record goal')
  }
}
```

## Performance Optimizations

1. **Debounced Updates**: Batch rapid updates to prevent UI thrashing
2. **Selective Re-renders**: Use React.memo for components that don't need frequent updates
3. **Connection Management**: Automatic reconnection with exponential backoff
4. **Fallback Polling**: Use polling as fallback when SSE fails
5. **Local State Caching**: Cache game state to prevent flickering on reconnect

## Error Handling

1. **Connection Loss**: Show connection status indicator
2. **Update Failures**: Revert optimistic updates on error
3. **Stale Data**: Show last update timestamp
4. **Graceful Degradation**: Fall back to polling if SSE unavailable

## Testing Requirements

1. Test SSE connection stability
2. Verify optimistic updates and rollbacks
3. Test reconnection logic
4. Validate real-time synchronization
5. Load test with multiple concurrent connections