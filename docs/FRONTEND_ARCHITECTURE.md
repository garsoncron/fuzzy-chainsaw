# Frontend Architecture Documentation

This document provides a comprehensive overview of the frontend architecture for the Cowtown Showdown lacrosse tournament website.

## Table of Contents

- [System Overview](#system-overview)
- [Next.js App Router Structure](#nextjs-app-router-structure)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Styling Architecture](#styling-architecture)
- [Real-time Implementation](#real-time-implementation)
- [Performance Optimizations](#performance-optimizations)
- [Data Fetching Patterns](#data-fetching-patterns)
- [SEO & Accessibility](#seo--accessibility)
- [Development Workflow](#development-workflow)

## System Overview

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Custom Properties
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React hooks + Server Components
- **Real-time**: Server-Sent Events (SSE)
- **Testing**: Vitest + Playwright
- **Build Tools**: Webpack 5 (via Next.js)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   App Router    │    │  Component Tree │                │
│  │   (Next.js 15)  │    │                 │                │
│  │                 │    │ ┌─────────────┐ │                │
│  │ ├─ (frontend)/  │    │ │   Blocks    │ │                │
│  │ │  ├─ page.tsx  │    │ │   - Banner  │ │                │
│  │ │  ├─ layout.tsx│    │ │   - CTA     │ │                │
│  │ │  └─ schedule/ │    │ │   - Form    │ │                │
│  │ │                │    │ └─────────────┘ │                │
│  │ ├─ (payload)/   │    │ ┌─────────────┐ │                │
│  │ │  └─ admin/    │    │ │  Components │ │                │
│  │ │               │    │ │   - UI      │ │                │
│  │ └─ api/         │    │ │   - Tournament│ │                │
│  │    ├─ games/    │    │ │   - Scorekeeper│ │                │
│  │    └─ standings/│    │ └─────────────┘ │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Real-time     │    │   State Mgmt    │                │
│  │                 │    │                 │                │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │                │
│  │ │ SSE Clients │ │    │ │ Server State│ │                │
│  │ │ - Scoreboard│ │    │ │ (Components)│ │                │
│  │ │ - Live Games│ │    │ └─────────────┘ │                │
│  │ │ - Game Stats│ │    │ ┌─────────────┐ │                │
│  │ └─────────────┘ │    │ │ Client State│ │                │
│  │                 │    │ │ (Hooks)     │ │                │
│  └─────────────────┘    │ └─────────────┘ │                │
│                         └─────────────────┘                │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Styling       │    │   Tooling       │                │
│  │                 │    │                 │                │
│  │ ├─ Tailwind CSS │    │ ├─ TypeScript   │                │
│  │ ├─ CSS Variables│    │ ├─ ESLint       │                │
│  │ ├─ Design System│    │ ├─ Vitest       │                │
│  │ └─ Responsive   │    │ └─ Playwright   │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Next.js App Router Structure

### Directory Organization

```
src/app/
├── (frontend)/              # Public tournament site
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── schedule/           # Tournament schedule
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── standings/          # Tournament standings
│   │   └── page.tsx
│   ├── tournament/         # Tournament info
│   │   └── page.tsx
│   └── test-data/          # Development utilities
├── (payload)/              # CMS admin interface
│   ├── admin/
│   │   ├── importMap.js
│   │   └── [[...segments]]/
│   │       └── page.tsx
│   └── layout.tsx
├── api/                    # API routes
│   ├── games/              # Game management
│   │   ├── [id]/
│   │   │   ├── goal/
│   │   │   ├── penalty/
│   │   │   ├── live/
│   │   │   └── claim/
│   │   └── live/
│   ├── standings/          # Tournament standings
│   ├── [...slug]/          # Payload CMS API
│   └── graphql/            # GraphQL endpoint
└── scorekeeper/            # Scorekeeper interface
    ├── page.tsx
    └── game/
        └── [id]/
            └── page.tsx
```

### Route Groups

**Public Routes `(frontend)/`**
- Tournament homepage with live scoring
- Schedule with filtering and search
- Standings with 5-point system
- Tournament information pages
- Player and team profiles

**Admin Routes `(payload)/`**
- Payload CMS admin interface
- Content management
- User management
- Media library

**Scorekeeper Routes**
- Game claiming dashboard
- Live scoring interface
- Statistical input forms
- Three stars selection

### Routing Patterns

```typescript
// Dynamic routes
app/tournament/[slug]/page.tsx       // Team pages
app/scorekeeper/game/[id]/page.tsx   // Game scoring

// Route groups
app/(frontend)/page.tsx              // Public homepage
app/(payload)/admin/page.tsx         // Admin dashboard

// API routes
app/api/games/[id]/goal/route.ts     // Goal recording
app/api/games/live/route.ts          // SSE endpoint
```

## Component Architecture

### Three-Tier Component Structure

#### 1. Block Components (Content Management)

Located in `src/blocks/` with config + component pattern:

```typescript
// Block structure
blocks/
├── Banner/
│   ├── Component.tsx       # React component
│   ├── config.ts          # Payload CMS config
│   └── index.ts           # Exports
├── CallToAction/
│   ├── Component.tsx
│   ├── config.ts
│   └── index.ts
└── Form/
    ├── Component.tsx
    ├── config.ts
    └── index.ts
```

**Banner Block Example:**
```typescript
import React from 'react'
import { cn } from '@/utilities/cn'

interface BannerProps {
  style?: 'info' | 'warning' | 'error' | 'success'
  content: any
}

export const BannerBlock: React.FC<BannerProps> = ({ 
  style = 'info', 
  content 
}) => {
  return (
    <div className={cn(
      'rounded-lg p-4 mb-6',
      {
        'bg-blue-50 border-blue-200': style === 'info',
        'bg-yellow-50 border-yellow-200': style === 'warning',
        'bg-red-50 border-red-200': style === 'error',
        'bg-green-50 border-green-200': style === 'success',
      }
    )}>
      <RichText content={content} />
    </div>
  )
}
```

#### 2. UI Components (Design System)

Located in `src/components/ui/` using Radix UI primitives:

```typescript
// UI component structure
components/ui/
├── button.tsx             # Button variants
├── card.tsx              # Card composition
├── dialog.tsx            # Modal dialogs
├── badge.tsx             # Status indicators
└── input.tsx             # Form inputs
```

**Button Component Example:**
```typescript
import { cn } from '@/utilities/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        clear: 'h-auto p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

#### 3. Feature Components (Tournament-Specific)

Located in `src/components/tournament/` and `src/components/scorekeeper/`:

```typescript
// Tournament components
components/tournament/
├── Scoreboard.tsx         # Live scoreboard
├── GameCard.tsx          # Game display
├── StandingsTable.tsx    # Tournament standings
└── TournamentHomepage.tsx # Main homepage

// Scorekeeper components
components/scorekeeper/
├── ScoringInterface.tsx  # Main scoring UI
├── GamesDashboard.tsx    # Game selection
├── Timer.tsx            # Period timer
└── StatButtons.tsx      # Quick stat entry
```

**GameCard Component Example:**
```typescript
'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/utilities/cn'

interface GameCardProps {
  game: Game
  showTournamentPoints?: boolean
  showThreeStars?: boolean
  compact?: boolean
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  showTournamentPoints = false,
  showThreeStars = false,
  compact = false,
}) => {
  const isLive = game.status === 'live'
  
  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-lg',
      {
        'ring-2 ring-blue-500 ring-opacity-50': isLive,
        'h-24': compact,
      }
    )}>
      <CardHeader className={cn(
        'pb-3',
        { 'p-2': compact }
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Game {game.gameNumber}
          </span>
          <Badge variant={
            isLive ? 'default' : 
            game.status === 'final' ? 'secondary' : 
            'outline'
          }>
            {isLive && (
              <span className="animate-pulse mr-1 h-2 w-2 rounded-full bg-white" />
            )}
            {game.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        'space-y-3',
        { 'p-2 pt-0': compact }
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {game.homeTeam.name}
            </span>
            <span className="text-2xl font-bold">
              {game.homeScore}
            </span>
          </div>
          
          {isLive && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Period {game.currentPeriod}
              </div>
              <div className="text-sm font-mono">
                {formatTime(game.periodTimeRemaining)}
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              {game.awayScore}
            </span>
            <span className="font-medium">
              {game.awayTeam.name}
            </span>
          </div>
        </div>
        
        {showTournamentPoints && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Points: {game.gamePoints.home}</span>
            <span>Points: {game.gamePoints.away}</span>
          </div>
        )}
        
        {showThreeStars && game.threeStars && (
          <div className="text-sm">
            <span className="font-medium">⭐ Three Stars:</span>
            <span className="ml-1">
              {game.threeStars.first.firstName} {game.threeStars.first.lastName}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
```

## State Management

### Hybrid State Architecture

The application uses a hybrid approach combining Server Components and Client Components:

#### Server State (Server Components)

```typescript
// Server Component for initial data
export default async function StandingsPage() {
  const teams = await payload.find({
    collection: 'teams',
    depth: 1,
  })
  
  const games = await payload.find({
    collection: 'games',
    where: {
      status: { not_equals: 'cancelled' }
    },
    depth: 2,
  })
  
  return <StandingsTable teams={teams.docs} games={games.docs} />
}
```

#### Client State (Custom Hooks)

```typescript
// useGameState hook for local state management
export function useGameState(initialGame: Game) {
  const [game, setGame] = useState(initialGame)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const updateGame = useCallback((updates: Partial<Game>) => {
    setGame(prev => ({ ...prev, ...updates }))
  }, [])
  
  const submitStat = useCallback(async (stat: StatSubmission) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Optimistic update
      updateGame({ 
        homeScore: stat.team === 'home' ? game.homeScore + 1 : game.homeScore,
        awayScore: stat.team === 'away' ? game.awayScore + 1 : game.awayScore,
      })
      
      // Submit to server
      const response = await fetch(`/api/games/${game.id}/goal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit stat')
      }
      
      const result = await response.json()
      updateGame(result.game)
    } catch (err) {
      setError(err as Error)
      // Revert optimistic update
      updateGame(initialGame)
    } finally {
      setIsLoading(false)
    }
  }, [game, initialGame, updateGame])
  
  return {
    game,
    isLoading,
    error,
    updateGame,
    submitStat,
  }
}
```

#### Real-time State (SSE Integration)

```typescript
// useRealtime hook for SSE connections
export function useRealtime(gameId: string, onUpdate: (data: any) => void) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  
  useEffect(() => {
    if (!gameId) return
    
    const connectSSE = () => {
      eventSourceRef.current = new EventSource(`/api/games/${gameId}/live`)
      
      eventSourceRef.current.onopen = () => {
        setIsConnected(true)
        setError(null)
      }
      
      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onUpdate(data)
        } catch (err) {
          console.error('SSE parse error:', err)
        }
      }
      
      eventSourceRef.current.onerror = () => {
        setIsConnected(false)
        setError('Connection lost')
        
        // Reconnect after delay
        setTimeout(connectSSE, 3000)
      }
    }
    
    connectSSE()
    
    return () => {
      eventSourceRef.current?.close()
    }
  }, [gameId, onUpdate])
  
  return { isConnected, error }
}
```

## Styling Architecture

### Design System Implementation

The application uses a comprehensive design system built on Tailwind CSS:

#### CSS Architecture

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS Variables */
:root {
  /* Tournament Colors */
  --primary-brown: 28 57% 37%;
  --dark-brown: 26 49% 25%;
  --golden: 46 69% 58%;
  
  /* Game Status Colors */
  --live-indicator: 204 100% 50%;
  --power-play: 204 100% 50%;
  --penalty-kill: 16 100% 55%;
  
  /* Semantic Colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}

/* Dark Theme */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  /* ... */
}

/* Western Typography */
.font-western {
  font-family: 'Rye', 'Smokum', cursive;
}

/* Tournament Specific */
.tournament-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.live-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### Tailwind Configuration

```typescript
// tailwind.config.js
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/blocks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-brown': 'hsl(var(--primary-brown))',
        'dark-brown': 'hsl(var(--dark-brown))',
        'golden': 'hsl(var(--golden))',
        'live-indicator': 'hsl(var(--live-indicator))',
        'power-play': 'hsl(var(--power-play))',
        'penalty-kill': 'hsl(var(--penalty-kill))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        western: ['Rye', 'Smokum', 'cursive'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

## Real-time Implementation

### Server-Sent Events Architecture

The application uses SSE for real-time updates with automatic reconnection:

```typescript
// Real-time scoreboard component
'use client'

import { useEffect, useState } from 'react'
import { GameCard } from './GameCard'

interface ScoreboardProps {
  initialGames: Game[]
  autoRefresh?: boolean
  refreshInterval?: number
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  initialGames,
  autoRefresh = true,
  refreshInterval = 5000,
}) => {
  const [games, setGames] = useState(initialGames)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected')
  
  useEffect(() => {
    if (!autoRefresh) return
    
    let eventSource: EventSource | null = null
    let reconnectTimer: NodeJS.Timeout | null = null
    
    const connect = () => {
      setConnectionStatus('connecting')
      
      eventSource = new EventSource('/api/games/live')
      
      eventSource.onopen = () => {
        setConnectionStatus('connected')
        if (reconnectTimer) {
          clearTimeout(reconnectTimer)
          reconnectTimer = null
        }
      }
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'scoreboard-update') {
            setGames(data.games)
          }
        } catch (error) {
          console.error('SSE parse error:', error)
        }
      }
      
      eventSource.onerror = () => {
        setConnectionStatus('disconnected')
        eventSource?.close()
        
        // Reconnect after delay
        reconnectTimer = setTimeout(connect, 3000)
      }
    }
    
    connect()
    
    return () => {
      eventSource?.close()
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }
    }
  }, [autoRefresh])
  
  // Categorize games
  const liveGames = games.filter(game => game.status === 'live')
  const upcomingGames = games.filter(game => game.status === 'scheduled')
  const completedGames = games.filter(game => game.status === 'final')
  
  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Scoreboard</h2>
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 
            'bg-red-500'
          }`} />
          <span className="text-sm text-muted-foreground">
            {connectionStatus}
          </span>
        </div>
      </div>
      
      {/* Live Games */}
      {liveGames.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3 text-live-indicator">
            🔴 Live Games
          </h3>
          <div className="tournament-grid">
            {liveGames.map(game => (
              <GameCard 
                key={game.id} 
                game={game}
                showTournamentPoints
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Upcoming Games */}
      {upcomingGames.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3">
            ⏳ Upcoming Games
          </h3>
          <div className="tournament-grid">
            {upcomingGames.map(game => (
              <GameCard 
                key={game.id} 
                game={game}
                compact
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Completed Games */}
      {completedGames.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3">
            ✅ Completed Games
          </h3>
          <div className="tournament-grid">
            {completedGames.map(game => (
              <GameCard 
                key={game.id} 
                game={game}
                showTournamentPoints
                showThreeStars
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

### Optimistic Updates

```typescript
// Optimistic update pattern
const handleGoal = async (goalData: GoalSubmission) => {
  // Optimistic update
  setGame(prev => ({
    ...prev,
    [goalData.team + 'Score']: prev[goalData.team + 'Score'] + 1,
  }))
  
  try {
    const response = await fetch(`/api/games/${game.id}/goal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to record goal')
    }
    
    const result = await response.json()
    
    // Server confirmation
    setGame(result.game)
    
    // Show success feedback
    toast.success('Goal recorded successfully!')
  } catch (error) {
    // Revert optimistic update
    setGame(prev => ({
      ...prev,
      [goalData.team + 'Score']: prev[goalData.team + 'Score'] - 1,
    }))
    
    toast.error('Failed to record goal')
  }
}
```

## Performance Optimizations

### React Performance

```typescript
// Component memoization
const GameCard = memo(({ game, ...props }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison for game updates
  return prevProps.game.homeScore === nextProps.game.homeScore &&
         prevProps.game.awayScore === nextProps.game.awayScore &&
         prevProps.game.status === nextProps.game.status
})

// Memoized calculations
const StandingsTable = ({ teams, games }) => {
  const standings = useMemo(() => {
    return calculateStandings(teams, games)
  }, [teams, games])
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Table implementation */}
      </table>
    </div>
  )
}

// Callback optimization
const ScoringInterface = ({ game, onStatSubmit }) => {
  const handleGoal = useCallback((goalData) => {
    onStatSubmit('goal', goalData)
  }, [onStatSubmit])
  
  const handlePenalty = useCallback((penaltyData) => {
    onStatSubmit('penalty', penaltyData)
  }, [onStatSubmit])
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatButtons onGoal={handleGoal} onPenalty={handlePenalty} />
    </div>
  )
}
```

### Next.js Optimizations

```typescript
// Image optimization
import Image from 'next/image'

export const TeamLogo = ({ team }) => (
  <Image
    src={team.logo.url}
    alt={`${team.name} logo`}
    width={48}
    height={48}
    className="rounded-full"
    priority={false}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
  />
)

// Static generation
export async function generateStaticParams() {
  const teams = await payload.find({ 
    collection: 'teams',
    select: { slug: true }
  })
  
  return teams.docs.map(team => ({
    slug: team.slug,
  }))
}

// Lazy loading
const StandingsTable = lazy(() => import('./StandingsTable'))

export default function StandingsPage() {
  return (
    <Suspense fallback={<StandingsTableSkeleton />}>
      <StandingsTable />
    </Suspense>
  )
}
```

## Data Fetching Patterns

### Server Components for Initial Data

```typescript
// Server Component with data fetching
export default async function GamePage({ params }: { params: { id: string } }) {
  const game = await payload.findByID({
    collection: 'games',
    id: params.id,
    depth: 2,
  })
  
  const [goals, penalties, faceoffs] = await Promise.all([
    payload.find({
      collection: 'goals',
      where: { game: { equals: params.id } },
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'penalties',
      where: { game: { equals: params.id } },
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'faceoffs',
      where: { game: { equals: params.id } },
      sort: '-createdAt',
    }),
  ])
  
  return (
    <div className="container mx-auto py-8">
      <GameDetailHeader game={game} />
      <GameStatistics 
        game={game}
        goals={goals.docs}
        penalties={penalties.docs}
        faceoffs={faceoffs.docs}
      />
    </div>
  )
}
```

### Client Components for Interactivity

```typescript
// Client Component with real-time updates
'use client'

export const GameStatistics = ({ game, goals, penalties, faceoffs }) => {
  const [liveGoals, setLiveGoals] = useState(goals)
  const [livePenalties, setLivePenalties] = useState(penalties)
  const [liveFaceoffs, setLiveFaceoffs] = useState(faceoffs)
  
  useEffect(() => {
    const eventSource = new EventSource(`/api/games/${game.id}/live`)
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'goal') {
        setLiveGoals(prev => [data.goal, ...prev])
      } else if (data.type === 'penalty') {
        setLivePenalties(prev => [data.penalty, ...prev])
      } else if (data.type === 'faceoff') {
        setLiveFaceoffs(prev => [data.faceoff, ...prev])
      }
    }
    
    return () => eventSource.close()
  }, [game.id])
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Goals" stats={liveGoals} />
      <StatCard title="Penalties" stats={livePenalties} />
      <StatCard title="Faceoffs" stats={liveFaceoffs} />
    </div>
  )
}
```

## SEO & Accessibility

### SEO Implementation

```typescript
// Metadata generation
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const game = await payload.findByID({
    collection: 'games',
    id: params.id,
    depth: 1,
  })
  
  const title = `${game.homeTeam.name} vs ${game.awayTeam.name} - Game ${game.gameNumber}`
  const description = `Live coverage of ${game.homeTeam.name} vs ${game.awayTeam.name} in the Cowtown Showdown lacrosse tournament.`
  
  return {
    title,
    description,
    keywords: [
      'lacrosse',
      'tournament',
      'cowtown showdown',
      game.homeTeam.name,
      game.awayTeam.name,
      'live scoring',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
  }
}

// Structured data
export const GameStructuredData = ({ game }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${game.homeTeam.name} vs ${game.awayTeam.name}`,
    startDate: game.scheduledTime,
    sport: 'Box Lacrosse',
    competitor: [
      {
        '@type': 'SportsTeam',
        name: game.homeTeam.name,
      },
      {
        '@type': 'SportsTeam',
        name: game.awayTeam.name,
      },
    ],
    location: {
      '@type': 'Place',
      name: 'Tournament Venue',
    },
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

### Accessibility Features

```typescript
// ARIA labels and roles
export const Scoreboard = ({ games }) => {
  return (
    <div role="region" aria-label="Live tournament scoreboard">
      <h2 id="scoreboard-title" className="sr-only">
        Tournament Scoreboard
      </h2>
      
      <div 
        role="table"
        aria-labelledby="scoreboard-title"
        className="tournament-grid"
      >
        {games.map(game => (
          <div
            key={game.id}
            role="row"
            aria-label={`Game ${game.gameNumber}: ${game.homeTeam.name} ${game.homeScore}, ${game.awayTeam.name} ${game.awayScore}`}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Keyboard navigation
export const StatButton = ({ label, onClick, disabled }) => {
  return (
    <button
      className="min-h-[44px] min-w-[44px] p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {label}
    </button>
  )
}

// Screen reader announcements
export const LiveGameAnnouncer = ({ game }) => {
  const [announcement, setAnnouncement] = useState('')
  
  useEffect(() => {
    setAnnouncement(
      `Goal scored. ${game.homeTeam.name} ${game.homeScore}, ${game.awayTeam.name} ${game.awayScore}`
    )
  }, [game.homeScore, game.awayScore])
  
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}
```

## Development Workflow

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test:int        # Integration tests
pnpm test:e2e        # End-to-end tests

# Code quality
pnpm lint            # ESLint
pnpm lint:fix        # ESLint with auto-fix
pnpm type-check      # TypeScript checking

# Payload CMS
pnpm payload generate:types    # Generate TypeScript types
pnpm payload generate:importmap # Generate import map
```

### Build Configuration

```typescript
// next.config.js
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload CMS integration
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
      '.jsx': ['.jsx', '.tsx'],
    }
    return config
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'your-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // React configuration
  reactStrictMode: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/collections/games',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utilities/*": ["./src/utilities/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

This frontend architecture provides a solid foundation for a real-time tournament management system with excellent user experience, performance, and maintainability. The combination of Next.js 15, React 19, and modern development practices creates a robust platform capable of handling high-traffic tournament events while maintaining code quality and developer productivity.