# Backend Task: API Endpoints for Real-time Scoring

## Overview
Create API endpoints to support real-time scoring, game management, and statistics updates.

## Core Endpoints

### 1. Live Game Updates (SSE)
**Priority**: Critical
**Dependencies**: Games, Goals, Penalties collections

```typescript
// src/app/api/games/[id]/live/route.ts
GET /api/games/:id/live

// Server-Sent Events endpoint for real-time updates
// Returns: EventSource stream with game state updates
```

Event Types:
- `game-status`: Game status changes (live, final, etc.)
- `score-update`: Score changes
- `goal`: New goal scored
- `penalty`: New penalty
- `period-change`: Period start/end
- `three-stars`: Three stars selection

### 2. Game Management
**Priority**: Critical
**Dependencies**: Games collection

```typescript
// src/app/api/games/[id]/start/route.ts
POST /api/games/:id/start
Body: {
  homeStartingGoalie: string,
  awayStartingGoalie: string
}

// src/app/api/games/[id]/period/route.ts
POST /api/games/:id/period
Body: {
  action: 'start' | 'end',
  period: string // "1", "2", "3", "OT1", etc.
}

// src/app/api/games/[id]/time/route.ts
POST /api/games/:id/time
Body: {
  timeRemaining: number // seconds
}

// src/app/api/games/[id]/complete/route.ts
POST /api/games/:id/complete
Body: {
  threeStars: {
    first: string,
    second: string,
    third: string
  }
}
```

### 3. Goal Scoring
**Priority**: Critical
**Dependencies**: Goals, Games, Players collections

```typescript
// src/app/api/games/[id]/goal/route.ts
POST /api/games/:id/goal
Body: {
  scorer: string, // player ID
  assist1?: string,
  assist2?: string,
  time: string, // "12:34"
  period: string,
  powerPlay?: boolean,
  shortHanded?: boolean,
  emptyNet?: boolean
}

// src/app/api/games/[id]/goal/[goalId]/route.ts
DELETE /api/games/:id/goal/:goalId
```

### 4. Penalty Tracking
**Priority**: High
**Dependencies**: Penalties, Games, Players collections

```typescript
// src/app/api/games/[id]/penalty/route.ts
POST /api/games/:id/penalty
Body: {
  player: string,
  infraction: string,
  duration: '30s' | '1min' | '2min' | '3min' | '5min' | 'game',
  time: string,
  period: string
}

// src/app/api/games/[id]/penalty/[penaltyId]/route.ts
PUT /api/games/:id/penalty/:penaltyId
Body: {
  served: boolean
}
```

### 5. Shot Tracking
**Priority**: High
**Dependencies**: Shots, Games, Players collections

```typescript
// src/app/api/games/[id]/shot/route.ts
POST /api/games/:id/shot
Body: {
  shooter: string,
  goalie: string,
  saved: boolean,
  time: string,
  period: string
}

// Bulk shot update for period end
// src/app/api/games/[id]/shots/bulk/route.ts
POST /api/games/:id/shots/bulk
Body: {
  period: string,
  homeShotsFor: number,
  awayShotsFor: number
}
```

### 6. Faceoff Tracking
**Priority**: Medium
**Dependencies**: Faceoffs, Games, Players collections

```typescript
// src/app/api/games/[id]/faceoff/route.ts
POST /api/games/:id/faceoff
Body: {
  homeFaceoffPlayer: string,
  awayFaceoffPlayer: string,
  winner: 'home' | 'away',
  zone: 'home-defensive' | 'neutral' | 'away-defensive',
  time: string,
  period: string
}
```

### 7. Goalie Changes
**Priority**: Medium
**Dependencies**: GoalieChanges, Games, Players collections

```typescript
// src/app/api/games/[id]/goalie-change/route.ts
POST /api/games/:id/goalie-change
Body: {
  team: 'home' | 'away',
  newGoalie: string,
  reason: 'injury' | 'performance' | 'tactical' | 'penalty',
  time: string,
  period: string
}
```

### 8. Statistics Endpoints
**Priority**: High
**Dependencies**: All game-related collections

```typescript
// Player stats
// src/app/api/stats/players/route.ts
GET /api/stats/players
Query params: 
  - tournament?: string
  - team?: string
  - position?: string
  - sort?: 'goals' | 'assists' | 'points' | 'pim'
  - limit?: number

// Team stats
// src/app/api/stats/teams/route.ts
GET /api/stats/teams
Query params:
  - tournament?: string
  - division?: 'gold' | 'blue'

// Goalie stats
// src/app/api/stats/goalies/route.ts
GET /api/stats/goalies
Query params:
  - tournament?: string
  - team?: string
  - minGames?: number

// Game summary
// src/app/api/games/[id]/summary/route.ts
GET /api/games/:id/summary
Returns: Complete game data with all events
```

### 9. Schedule & Standings
**Priority**: High
**Dependencies**: Games, Teams collections

```typescript
// Schedule
// src/app/api/schedule/route.ts
GET /api/schedule
Query params:
  - day?: 1 | 2 | 3
  - team?: string
  - gameType?: 'pool' | 'playoff' | 'bronze' | 'gold'

// Standings (with 5-point system calculation)
// src/app/api/standings/route.ts
GET /api/standings
Query params:
  - division?: 'gold' | 'blue'
```

### 10. Team Submission
**Priority**: Medium
**Dependencies**: TeamSubmissions collection

```typescript
// src/app/api/team-submission/route.ts
POST /api/team-submission
Body: {
  teamName: string,
  city: string,
  province: string,
  captainName: string,
  captainEmail: string,
  captainPhone: string,
  alternateContact: {
    name: string,
    email: string,
    phone: string
  },
  estimatedRosterSize: number,
  additionalInfo?: string
}
```

## Implementation Requirements

### Authentication & Authorization
- All write endpoints require authentication
- Scorekeeper role required for game management endpoints
- Admin role required for statistics configuration
- Public read access for GET endpoints

### Real-time Updates
- Implement Server-Sent Events (SSE) for live game updates
- Use Redis or in-memory cache for active game state
- Broadcast updates to all connected clients
- Handle reconnection gracefully

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging
- Client-friendly error messages

### Validation
- Validate all input data
- Ensure game state consistency
- Prevent duplicate entries
- Validate time/period combinations

### Performance
- Implement response caching where appropriate
- Use database indexes for common queries
- Paginate large result sets
- Optimize for mobile data usage

## Response Formats

### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": { ... }
  }
}
```

### SSE Event Format
```
event: score-update
data: {"homeScore": 5, "awayScore": 3, "gameTime": 1823}
id: 12345

event: goal
data: {"scorer": "player-id", "team": "home", "time": "8:45", "period": "2"}
id: 12346
```

## Testing Requirements
- Unit tests for all endpoint logic
- Integration tests with real database
- Load testing for concurrent users
- SSE connection testing
- Error scenario testing

## Security Considerations
- Rate limiting on all endpoints
- CORS configuration for client access
- Input sanitization
- SQL injection prevention
- CSRF protection for state-changing operations