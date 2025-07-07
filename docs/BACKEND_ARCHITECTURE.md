# Backend Architecture Documentation

This document provides a comprehensive overview of the backend architecture for the Cowtown Showdown lacrosse tournament website.

## Table of Contents

- [System Overview](#system-overview)
- [Database Architecture](#database-architecture)
- [API Architecture](#api-architecture)
- [Real-time Systems](#real-time-systems)
- [Authentication & Authorization](#authentication--authorization)
- [Business Logic](#business-logic)
- [Data Validation](#data-validation)
- [Error Handling](#error-handling)
- [Performance & Caching](#performance--caching)
- [Configuration](#configuration)

## System Overview

### Technology Stack

- **Framework**: Payload CMS 3.x on Next.js 15
- **Database**: PostgreSQL with `@payloadcms/db-postgres`
- **Runtime**: Node.js 18.20.2+
- **Editor**: Lexical rich text editor
- **File Processing**: Sharp for image optimization
- **Real-time**: Server-Sent Events (SSE)
- **Type System**: TypeScript with auto-generated types

### Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │    │   (Payload CMS) │    │   (PostgreSQL)  │
│                 │    │                 │    │                 │
├─ Tournament UI  │◄──►│ REST API        │◄──►│ Collections     │
├─ Scorekeeper    │    │ GraphQL API     │    │ - Teams         │
├─ Admin Panel    │    │ SSE Endpoints   │    │ - Players       │
└─ Public Pages   │    │ File Upload     │    │ - Games         │
                  │    │ Authentication  │    │ - Statistics    │
                  │    └─────────────────┘    └─────────────────┘
                  │
                  │    ┌─────────────────┐
                  │    │   SSE Clients   │
                  │    │   (Real-time)   │
                  └────┤ - Scoreboard    │
                       │ - Live Games    │
                       │ - Game Stats    │
                       └─────────────────┘
```

## Database Architecture

### Collection Structure

The database follows a normalized structure optimized for tournament management:

```
Collections/
├── Core CMS
│   ├── users           # User authentication
│   ├── pages           # Static pages
│   ├── posts           # Blog posts
│   ├── media           # File uploads
│   └── categories      # Content categories
└── Tournament
    ├── teams           # 8 tournament teams
    ├── players         # Player rosters
    ├── games           # Game schedule/results
    ├── goals           # Goal scoring events
    ├── penalties       # Penalty tracking
    ├── faceoffs        # Faceoff statistics
    ├── shots           # Shot tracking
    └── loose-balls     # Loose ball recoveries
```

### Key Relationships

```typescript
// Teams → Players (One-to-Many)
Team {
  id: string
  name: string
  players: Player[]
}

// Games → Teams (Many-to-Many)
Game {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeStartingGoalie: Player
  awayStartingGoalie: Player
  goals: Goal[]
  penalties: Penalty[]
}

// Statistics → Game & Player
Goal {
  id: string
  game: Game
  scorer: Player
  assists: Player[]
  period: number
  periodTime: number
}
```

### Data Models

#### Teams Collection

```typescript
export const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'captain'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'primaryColor',
      type: 'text',
      validate: (val) => /^#[0-9A-F]{6}$/i.test(val),
    },
    {
      name: 'captain',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
  ],
}
```

#### Games Collection (5-Point Tournament System)

```typescript
export const Games: CollectionConfig = {
  slug: 'games',
  fields: [
    {
      name: 'gameNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'gameType',
      type: 'select',
      options: [
        { label: 'Pool Play', value: 'pool' },
        { label: 'Medal Game', value: 'medal' },
      ],
      defaultValue: 'pool',
    },
    {
      name: 'homeTeam',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
    },
    {
      name: 'awayTeam',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
    },
    {
      name: 'homeScore',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'awayScore',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'gamePoints',
      type: 'group',
      fields: [
        { name: 'home', type: 'number', defaultValue: 0 },
        { name: 'away', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'periodPoints',
      type: 'group',
      fields: [
        {
          name: 'period1',
          type: 'group',
          fields: [
            { name: 'home', type: 'number', defaultValue: 0 },
            { name: 'away', type: 'number', defaultValue: 0 },
          ],
        },
        // period2, period3...
      ],
    },
    {
      name: 'currentPeriod',
      type: 'select',
      options: [
        { label: 'Pre-Game', value: 0 },
        { label: 'Period 1', value: 1 },
        { label: 'Period 2', value: 2 },
        { label: 'Period 3', value: 3 },
        { label: 'Overtime 1', value: 'OT1' },
        { label: 'Overtime 2', value: 'OT2' },
      ],
      defaultValue: 0,
    },
    {
      name: 'periodTimeRemaining',
      type: 'number',
      defaultValue: 720, // 12 minutes in seconds
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Live', value: 'live' },
        { label: 'Final', value: 'final' },
        { label: 'Overtime', value: 'overtime' },
      ],
      defaultValue: 'scheduled',
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-calculate period length based on game type
        if (data.gameType === 'medal') {
          data.periodLength = 900 // 15 minutes
        } else {
          data.periodLength = 720 // 12 minutes
        }
        
        // Initialize current goalies from starting goalies
        if (!data.homeCurrentGoalie && data.homeStartingGoalie) {
          data.homeCurrentGoalie = data.homeStartingGoalie
        }
        if (!data.awayCurrentGoalie && data.awayStartingGoalie) {
          data.awayCurrentGoalie = data.awayStartingGoalie
        }
        
        return data
      },
    ],
  },
}
```

#### Players Collection

```typescript
export const Players: CollectionConfig = {
  slug: 'players',
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'displayName',
      type: 'text',
      hooks: {
        beforeValidate: [
          ({ data }) => `${data.firstName} ${data.lastName}`,
        ],
      },
    },
    {
      name: 'jerseyNumber',
      type: 'number',
      required: true,
      min: 0,
      max: 99,
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
    },
    {
      name: 'primaryPosition',
      type: 'select',
      options: [
        { label: 'Offence', value: 'offence' },
        { label: 'Defence', value: 'defence' },
        { label: 'Transition', value: 'transition' },
        { label: 'Faceoff', value: 'faceoff' },
        { label: 'Goalie', value: 'goalie' },
      ],
      required: true,
    },
    {
      name: 'playerType',
      type: 'select',
      options: [
        { label: 'Runner', value: 'runner' },
        { label: 'Goalie', value: 'goalie' },
      ],
      required: true,
    },
    {
      name: 'handedness',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      required: true,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Ensure consistency between position and player type
        if (data.primaryPosition === 'goalie') {
          data.playerType = 'goalie'
        } else if (data.playerType === 'goalie') {
          data.primaryPosition = 'goalie'
        }
        
        return data
      },
    ],
  },
}
```

## API Architecture

### RESTful Endpoints

The API follows RESTful conventions with custom endpoints for real-time operations:

```
/api/
├── {collection}/           # Standard CRUD operations
├── {collection}/{id}/      # Single resource operations
├── games/
│   ├── live/              # SSE: All games updates
│   └── {id}/
│       ├── live/          # SSE: Single game updates
│       ├── goal/          # POST: Record goal
│       ├── penalty/       # POST: Record penalty
│       ├── faceoff/       # POST: Record faceoff
│       ├── timer/         # POST: Update timer
│       ├── claim/         # POST: Claim game
│       └── release/       # POST: Release game
├── standings/             # GET: Tournament standings
└── graphql/              # GraphQL endpoint
```

### Custom API Endpoints

#### Goal Recording API

```typescript
// POST /api/games/[id]/goal
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate request
    const { scorerId, assistId, goalType, team, period, periodTime } = body
    
    // Create goal record
    const goal = await payload.create({
      collection: 'goals',
      data: {
        game: params.id,
        scorer: scorerId,
        assists: assistId ? [assistId] : [],
        goalType,
        team,
        period,
        periodTime,
      },
    })
    
    // Update game score
    const game = await payload.findByID({
      collection: 'games',
      id: params.id,
    })
    
    const updatedGame = await payload.update({
      collection: 'games',
      id: params.id,
      data: {
        [`${team}Score`]: game[`${team}Score`] + 1,
      },
    })
    
    // Broadcast real-time update
    broadcastGameUpdate(params.id, updatedGame)
    
    return NextResponse.json({ success: true, goal, game: updatedGame })
  } catch (error) {
    console.error('Goal recording error:', error)
    return NextResponse.json({ error: 'Failed to record goal' }, { status: 500 })
  }
}
```

#### Penalty Recording API

```typescript
// POST /api/games/[id]/penalty
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { playerId, infraction, team, period, periodTime } = body
    
    // Map infraction to duration
    const penaltyDuration = getPenaltyDuration(infraction)
    
    // Create penalty record
    const penalty = await payload.create({
      collection: 'penalties',
      data: {
        game: params.id,
        player: playerId,
        infraction,
        team,
        period,
        periodTime,
        duration: penaltyDuration,
      },
    })
    
    // Broadcast update
    broadcastGameUpdate(params.id, { penalties: [penalty] })
    
    return NextResponse.json({ success: true, penalty })
  } catch (error) {
    console.error('Penalty recording error:', error)
    return NextResponse.json({ error: 'Failed to record penalty' }, { status: 500 })
  }
}

// Penalty duration mapping
function getPenaltyDuration(infraction: string): string {
  const durations = {
    // Minor penalties (2 minutes)
    'slashing': '2min',
    'tripping': '2min',
    'interference': '2min',
    'holding': '2min',
    'illegal_pick': '2min',
    
    // Major penalties (5 minutes)
    'high_sticking': '5min',
    'boarding': '5min',
    'fighting': '5min',
    
    // Misconduct (10 minutes)
    'misconduct': '10min',
    
    // Game misconduct
    'game_misconduct': 'game',
  }
  
  return durations[infraction] || '2min'
}
```

### GraphQL API

Payload CMS provides automatic GraphQL API generation:

```graphql
# Query team with players
query GetTeamWithPlayers($teamId: ID!) {
  Team(id: $teamId) {
    id
    name
    logo {
      url
    }
    players {
      firstName
      lastName
      jerseyNumber
      primaryPosition
    }
  }
}

# Query game with statistics
query GetGameWithStats($gameId: ID!) {
  Game(id: $gameId) {
    id
    homeTeam { name }
    awayTeam { name }
    homeScore
    awayScore
    currentPeriod
    periodTimeRemaining
    goals {
      scorer {
        firstName
        lastName
      }
      period
      periodTime
    }
    penalties {
      player {
        firstName
        lastName
      }
      infraction
      duration
    }
  }
}
```

## Real-time Systems

### Server-Sent Events Architecture

```typescript
// Global connection pool
const activeConnections = new Map<string, WritableStreamDefaultWriter>()

// SSE endpoint for single game
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      const writer = controller
      activeConnections.set(params.id, writer)
      
      // Send initial data
      const game = await payload.findByID({
        collection: 'games',
        id: params.id,
        depth: 2,
      })
      
      writer.enqueue(encoder.encode(
        `data: ${JSON.stringify({ type: 'game-update', game })}\n\n`
      ))
      
      // Set up periodic updates
      const interval = setInterval(async () => {
        if (game.status === 'live') {
          const updatedGame = await payload.findByID({
            collection: 'games',
            id: params.id,
            depth: 2,
          })
          
          writer.enqueue(encoder.encode(
            `data: ${JSON.stringify({ type: 'game-update', game: updatedGame })}\n\n`
          ))
        }
      }, 1000)
      
      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        activeConnections.delete(params.id)
      })
    },
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// Broadcast function
export function broadcastGameUpdate(gameId: string, data: any) {
  const writer = activeConnections.get(gameId)
  if (writer) {
    const encoder = new TextEncoder()
    writer.enqueue(encoder.encode(
      `data: ${JSON.stringify({ type: 'game-update', data })}\n\n`
    ))
  }
}
```

### Connection Management

```typescript
// Connection pool management
class SSEConnectionPool {
  private connections = new Map<string, Set<WritableStreamDefaultWriter>>()
  
  addConnection(gameId: string, writer: WritableStreamDefaultWriter) {
    if (!this.connections.has(gameId)) {
      this.connections.set(gameId, new Set())
    }
    this.connections.get(gameId)!.add(writer)
  }
  
  removeConnection(gameId: string, writer: WritableStreamDefaultWriter) {
    const gameConnections = this.connections.get(gameId)
    if (gameConnections) {
      gameConnections.delete(writer)
      if (gameConnections.size === 0) {
        this.connections.delete(gameId)
      }
    }
  }
  
  broadcast(gameId: string, data: any) {
    const gameConnections = this.connections.get(gameId)
    if (gameConnections) {
      const encoder = new TextEncoder()
      const message = `data: ${JSON.stringify(data)}\n\n`
      
      gameConnections.forEach(writer => {
        try {
          writer.enqueue(encoder.encode(message))
        } catch (error) {
          // Remove failed connections
          this.removeConnection(gameId, writer)
        }
      })
    }
  }
}
```

## Authentication & Authorization

### Current Implementation

```typescript
// Basic authentication check
export async function requireAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('Authentication required')
  }
  
  // Verify JWT token
  const user = await payload.jwt.verify(token)
  return user
}

// Role-based access (TODO: Implementation)
export async function requireRole(request: NextRequest, role: string) {
  const user = await requireAuth(request)
  
  if (!user.roles?.includes(role)) {
    throw new Error('Insufficient permissions')
  }
  
  return user
}
```

### Access Control Configuration

```typescript
// Collection access control
export const Games: CollectionConfig = {
  slug: 'games',
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => Boolean(user), // Authenticated create
    update: ({ req: { user } }) => Boolean(user), // Authenticated update
    delete: ({ req: { user } }) => user?.role === 'admin', // Admin only delete
  },
}

// Field-level access control
{
  name: 'scorekeeper',
  type: 'relationship',
  relationTo: 'users',
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
  },
}
```

## Business Logic

### Tournament Point System

```typescript
// 5-point system calculation
export function calculateTournamentPoints(game: Game) {
  const points = {
    home: 0,
    away: 0,
  }
  
  // Period points (0, 0.5, or 1 point per period)
  for (let period = 1; period <= 3; period++) {
    const homeGoals = game.goals.filter(g => 
      g.team === 'home' && g.period === period
    ).length
    
    const awayGoals = game.goals.filter(g => 
      g.team === 'away' && g.period === period
    ).length
    
    if (homeGoals > awayGoals) {
      points.home += 1
    } else if (awayGoals > homeGoals) {
      points.away += 1
    } else {
      points.home += 0.5
      points.away += 0.5
    }
  }
  
  // Game outcome points (0, 1, or 2 points)
  if (game.homeScore > game.awayScore) {
    points.home += 2
  } else if (game.awayScore > game.homeScore) {
    points.away += 2
  } else {
    points.home += 1
    points.away += 1
  }
  
  return points
}
```

### Standings Calculation

```typescript
// Tournament standings with tiebreakers
export function calculateStandings(teams: Team[], games: Game[]) {
  const standings = teams.map(team => {
    const teamGames = games.filter(game => 
      game.homeTeam.id === team.id || game.awayTeam.id === team.id
    )
    
    let stats = {
      gamesPlayed: teamGames.length,
      wins: 0,
      losses: 0,
      ties: 0,
      tournamentPoints: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      penaltyMinutes: 0,
    }
    
    // Calculate statistics
    teamGames.forEach(game => {
      const isHome = game.homeTeam.id === team.id
      const teamScore = isHome ? game.homeScore : game.awayScore
      const oppScore = isHome ? game.awayScore : game.homeScore
      
      stats.goalsFor += teamScore
      stats.goalsAgainst += oppScore
      
      if (teamScore > oppScore) {
        stats.wins++
      } else if (oppScore > teamScore) {
        stats.losses++
      } else {
        stats.ties++
      }
      
      // Add tournament points
      const gamePoints = calculateTournamentPoints(game)
      stats.tournamentPoints += isHome ? gamePoints.home : gamePoints.away
    })
    
    // Calculate derived stats
    stats.goalDifferential = stats.goalsFor - stats.goalsAgainst
    stats.goalAverage = stats.goalsFor / (stats.goalsFor + stats.goalsAgainst)
    
    return {
      team,
      ...stats,
    }
  })
  
  // Sort with tiebreakers
  return standings.sort((a, b) => {
    // 1. Tournament points
    if (a.tournamentPoints !== b.tournamentPoints) {
      return b.tournamentPoints - a.tournamentPoints
    }
    
    // 2. Goal average
    if (a.goalAverage !== b.goalAverage) {
      return b.goalAverage - a.goalAverage
    }
    
    // 3. Goal differential
    if (a.goalDifferential !== b.goalDifferential) {
      return b.goalDifferential - a.goalDifferential
    }
    
    // 4. Fewest penalty minutes
    return a.penaltyMinutes - b.penaltyMinutes
  })
}
```

## Data Validation

### Field-Level Validation

```typescript
// Custom validators
{
  name: 'primaryColor',
  type: 'text',
  validate: (val: string) => {
    if (!val) return true
    return /^#[0-9A-F]{6}$/i.test(val) || 'Must be a valid hex color'
  },
}

{
  name: 'jerseyNumber',
  type: 'number',
  validate: (val: number, { siblingData }) => {
    if (val < 0 || val > 99) {
      return 'Jersey number must be between 0 and 99'
    }
    
    // Check uniqueness within team (would need additional logic)
    return true
  },
}
```

### Business Rule Validation

```typescript
// Hooks for complex validation
hooks: {
  beforeValidate: [
    ({ data, originalDoc }) => {
      // Validate team assignment
      if (data.homeTeam === data.awayTeam) {
        throw new Error('Home and away teams cannot be the same')
      }
      
      // Validate player eligibility
      if (data.homeStartingGoalie) {
        const goalie = await payload.findByID({
          collection: 'players',
          id: data.homeStartingGoalie,
        })
        
        if (goalie.team !== data.homeTeam) {
          throw new Error('Starting goalie must be from the home team')
        }
      }
      
      return data
    },
  ],
}
```

## Error Handling

### Consistent Error Responses

```typescript
// Error handler middleware
export function handleAPIError(error: Error, request: NextRequest) {
  console.error('API Error:', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
  })
  
  // Determine error type and status
  let status = 500
  let message = 'Internal Server Error'
  
  if (error.message.includes('not found')) {
    status = 404
    message = 'Resource not found'
  } else if (error.message.includes('validation')) {
    status = 400
    message = 'Validation error'
  } else if (error.message.includes('unauthorized')) {
    status = 401
    message = 'Unauthorized'
  }
  
  return NextResponse.json({
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack 
      }),
    },
  }, { status })
}
```

### Error Logging

```typescript
// Structured logging
export function logError(error: Error, context: any) {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  }
  
  // Log to console (or external service)
  console.error(JSON.stringify(logData, null, 2))
  
  // Could integrate with external logging service
  // sendToLoggingService(logData)
}
```

## Performance & Caching

### Current Caching Strategy

```typescript
// Next.js cache configuration
export const dynamic = 'force-dynamic' // For SSE endpoints
export const revalidate = 60 // For static data

// Payload collection caching
export const Games: CollectionConfig = {
  slug: 'games',
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  // Built-in caching through Payload
}
```

### Recommended Enhancements

```typescript
// Redis cache integration (recommended)
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// Cache standings
export async function getCachedStandings() {
  const cached = await redis.get('tournament:standings')
  if (cached) {
    return JSON.parse(cached)
  }
  
  const standings = await calculateStandings()
  await redis.setex('tournament:standings', 30, JSON.stringify(standings))
  
  return standings
}

// Cache game state
export async function cacheGameState(gameId: string, gameData: any) {
  await redis.setex(`game:${gameId}`, 300, JSON.stringify(gameData))
}
```

## Configuration

### Environment Variables

```env
# Database
DATABASE_URI=postgresql://user:password@localhost:5432/cowtown

# Payload CMS
PAYLOAD_SECRET=your-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.com

# Real-time settings
SCOREKEEPER_SESSION_TIMEOUT=14400  # 4 hours
REALTIME_UPDATE_INTERVAL=1000      # 1 second

# Features
NEXT_PUBLIC_ENABLE_DRAFT_MODE=true
NEXT_PUBLIC_DRAFT_SECRET=draft-secret

# External services
REDIS_URL=redis://localhost:6379
SENTRY_DSN=https://your-sentry-dsn
```

### Payload Configuration

```typescript
// payload.config.ts
export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [
    Users,
    Pages,
    Posts,
    Media,
    Categories,
    // Tournament collections
    Teams,
    Players,
    Games,
    Goals,
    Penalties,
    Faceoffs,
    Shots,
    LooseBalls,
  ],
  globals: [
    Settings,
    Header,
    Footer,
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  plugins: [
    payloadCloud(),
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        number: true,
        checkbox: true,
        country: true,
        payment: false,
      },
    }),
  ],
})
```

## Monitoring & Observability

### Health Check Endpoint

```typescript
// /api/health
export async function GET() {
  try {
    // Check database connection
    const dbCheck = await payload.db.pool.query('SELECT 1')
    
    // Check SSE connections
    const sseConnections = activeConnections.size
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck ? 'healthy' : 'unhealthy',
        sseConnections,
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
    }, { status: 500 })
  }
}
```

### Metrics Collection

```typescript
// Basic metrics
export const metrics = {
  apiRequests: 0,
  sseConnections: 0,
  errors: 0,
  gamesInProgress: 0,
}

// Middleware to track metrics
export function trackMetrics(request: NextRequest) {
  metrics.apiRequests++
  
  // Track by endpoint
  const endpoint = request.nextUrl.pathname
  console.log(`API Request: ${request.method} ${endpoint}`)
}
```

## Deployment Considerations

### Production Optimizations

1. **Database Indexing**
   - Index foreign keys and frequently queried fields
   - Composite indexes for complex queries
   - Optimize joins between games and statistics

2. **Connection Pooling**
   - Configure PostgreSQL connection limits
   - Implement connection pooling for high concurrency
   - Monitor connection usage

3. **Caching Strategy**
   - Redis for session data and standings
   - CDN for static assets
   - Database query caching

4. **Monitoring**
   - APM tools (Sentry, DataDog)
   - Database performance monitoring
   - Real-time connection monitoring

This backend architecture provides a solid foundation for a tournament management system with real-time capabilities, comprehensive data modeling, and scalability considerations for handling 500-900 concurrent users during live events.