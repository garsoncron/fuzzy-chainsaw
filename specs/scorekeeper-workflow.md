# Scorekeeper Workflow and Game Management

This document details the complete scorekeeper workflow, game management system, and related functionality for the Cowtown Showdown tournament.

## User Roles and Permissions

### Role Matrix

| Feature | Admin | Scorekeeper | Public |
|---------|-------|-------------|---------|
| View all games | ✓ | ✓ | ✓ |
| Claim game for scoring | ✓ | ✓ | ✗ |
| Update live game stats | ✓ | ✓ (assigned only) | ✗ |
| Edit completed game stats | ✓ | ✓ (assigned only) | ✗ |
| Manage teams/players | ✓ | ✗ | ✗ |
| Import rosters | ✓ | ✗ | ✗ |
| Configure tournament | ✓ | ✗ | ✗ |
| View live updates | ✓ | ✓ | ✓ |

### Scorekeeper Constraints
- Can only manage ONE game at a time
- Must claim/be assigned a game before accessing scorekeeper interface
- Retains access to edit game stats after game completion
- Cannot claim another game until releasing current game

## Game Management Dashboard

### Admin Games Overview
Central dashboard showing all tournament games with:

```typescript
interface GameDashboard {
  games: {
    id: string
    gameNumber: string
    day: number
    scheduledTime: Date
    status: 'scheduled' | 'claimed' | 'live' | 'final'
    homeTeam: string
    awayTeam: string
    assignedScorekeeper?: {
      id: string
      name: string
      email: string
    }
    claimedAt?: Date
  }[]
}
```

### Game Claiming Process

1. **View Available Games**
   - Dashboard shows all games
   - Color coding: Gray (scheduled), Yellow (claimed), Green (live), Blue (final)
   - Filter by day, status, or search

2. **Claim Game**
   - Click "Claim Game" button on scheduled games
   - Confirmation modal: "Claim Game #X: Team A vs Team B?"
   - System checks if scorekeeper has active game
   - If yes: "You must release Game #Y before claiming another"

3. **Release Game**
   - Option to release claimed game if not started
   - Admin can force-release any game

4. **Access Scorekeeper Interface**
   - "Manage Game" button appears for claimed games
   - Direct link to scorekeeper interface for that game

### UI Mockup
```
┌─────────────────────────────────────────────────────────────┐
│ Games Management Dashboard                    [Scorekeeper: John Smith]
├─────────────────────────────────────────────────────────────┤
│ Filter: [All Days ▼] [All Status ▼]          Search: [____] │
├─────────────────────────────────────────────────────────────┤
│ Day 1 - Friday, July 5                                      │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Game 1 • 6:00 PM                          [Scheduled] │   │
│ │ Calgary Bears vs Edmonton Rush              [Claim]   │   │
│ └───────────────────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Game 2 • 6:50 PM                 🔒 Claimed by: M.Jones│   │
│ │ Saskatoon Storm vs Regina Riot          [Unavailable] │   │
│ └───────────────────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Game 3 • 7:40 PM        ⚡ YOUR ACTIVE GAME     [Live]│   │
│ │ Lethbridge Miners vs Medicine Hat Mavericks           │   │
│ │                                      [Manage Game →]   │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Three Stars Selection

### Selection Process
1. **When**: Immediately after game ends (status changes to 'final')
2. **Who**: Assigned scorekeeper only
3. **Interface**: Modal popup after final buzzer

### Selection Rules
- Must select exactly 3 players
- Can be from either team
- Cannot select same player twice
- Published immediately upon selection
- CANNOT be changed after submission

### UI Design
```
┌─────────────────────────────────────────────────────┐
│ Select Three Stars - Game 12                        │
├─────────────────────────────────────────────────────┤
│ Select the three stars of the game:                 │
│                                                      │
│ First Star:  [Select Player... ▼]                   │
│              Calgary Bears (8)                       │
│              ├─ #9 Smith, John (3G, 2A)            │
│              └─ #14 Jones, Mike (2G, 3A)           │
│              Edmonton Rush (6)                       │
│              └─ #21 Brown, Tom (4G, 1A)            │
│                                                      │
│ Second Star: [Select Player... ▼]                   │
│                                                      │
│ Third Star:  [Select Player... ▼]                   │
│                                                      │
│ ⚠️ Selections are final and cannot be changed       │
│                                                      │
│ [Cancel]                              [Submit Stars] │
└─────────────────────────────────────────────────────┘
```

## Offline Functionality and Data Sync

### Caching Strategy
Implement Progressive Web App (PWA) with service workers:

```typescript
interface OfflineGameState {
  gameId: string
  lastSyncTime: Date
  pendingActions: GameAction[]
  currentState: {
    score: { home: number, away: number }
    period: number
    timeRemaining: number
    events: GameEvent[]
  }
}

interface GameAction {
  id: string
  type: 'goal' | 'penalty' | 'faceoff' | 'shot' | 'timeout' | 'period_end'
  timestamp: Date
  data: any
  synced: boolean
}
```

### Offline Behavior
1. **Detection**: Monitor online/offline status
2. **Local Storage**: Queue all actions in IndexedDB
3. **Visual Indicator**: Show offline banner
4. **Sync Queue**: Automatic retry when connection restored
5. **Conflict Resolution**: Server timestamp wins, notify of conflicts

### Implementation
```typescript
// Service Worker
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/games/') && 
      event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request.clone())
        .catch(() => {
          // Save to IndexedDB for later sync
          return saveToOfflineQueue(event.request)
        })
    )
  }
})

// Sync when back online
window.addEventListener('online', () => {
  syncOfflineQueue()
})
```

## Statistics Editing and Corrections

### Real-Time Editing
Scorekeepers can edit any statistic during the game:

1. **Quick Corrections** (< 30 seconds)
   - Undo last action button
   - Shows last 5 actions in sidebar

2. **Period Corrections**
   - Edit any event from current period
   - Click on event in game log
   - Modal to edit/delete

3. **Historical Corrections**
   - Access any past period
   - Full editing capabilities
   - Audit log tracks changes

### Editing Interface
```typescript
interface EditableEvent {
  id: string
  type: string
  period: number
  time: string
  description: string
  actions: {
    edit: () => void
    delete: () => void
  }
}
```

### Audit Trail
All edits are logged:
```typescript
interface AuditLog {
  id: string
  gameId: string
  userId: string
  timestamp: Date
  action: 'create' | 'update' | 'delete'
  eventType: string
  oldValue?: any
  newValue?: any
  reason?: string
}
```

## CSV/Excel Roster Import

### Import Format
Support for CSV and Excel files with the following columns:

```csv
Jersey,First Name,Last Name,Position,Handedness,Player Type
9,John,Smith,offence,right,runner
14,Mike,Jones,defence,left,runner
30,Tom,Brown,goalie,left,goalie
```

### Position Values
- `offence`, `defence`, `transition`, `faceoff`, `goalie`

### Import Process
1. **Upload File**: Drag-and-drop or file selector
2. **Preview**: Show first 10 rows for validation
3. **Map Columns**: Auto-detect or manual mapping
4. **Validate**: Check for duplicates, invalid data
5. **Import**: Create players with team association

### Validation Rules
- Jersey numbers: 0-99
- Required fields: Jersey, First Name, Last Name, Position
- Handedness: left/right only
- Player type: runner/goalie only
- No duplicate jersey numbers per team

### Import UI
```
┌─────────────────────────────────────────────────────────┐
│ Import Team Roster - Calgary Bears                      │
├─────────────────────────────────────────────────────────┤
│ [📎 Drop CSV/Excel file here or click to browse]       │
│                                                          │
│ Preview (showing first 5 rows):                         │
│ ┌────┬────────────┬───────────┬──────────┬──────────┐  │
│ │ #  │ First      │ Last      │ Position │ Hand     │  │
│ ├────┼────────────┼───────────┼──────────┼──────────┤  │
│ │ 9  │ John       │ Smith     │ offence  │ right    │  │
│ │ 14 │ Mike       │ Jones     │ defence  │ left     │  │
│ │ 21 │ Bob        │ Wilson    │ trans... │ right    │  │
│ │ 30 │ Tom        │ Brown     │ goalie   │ left     │  │
│ │ 35 │ Jim        │ Davis     │ goalie   │ right    │  │
│ └────┴────────────┴───────────┴──────────┴──────────┘  │
│                                                          │
│ ✓ 5 valid rows detected                                 │
│ ⚠️ 0 warnings                                           │
│                                                          │
│ [Cancel]                              [Import Players]   │
└─────────────────────────────────────────────────────────┘
```

## YouTube Live Integration

### Stream Configuration
Each game can have one YouTube stream URL:

```typescript
interface GameStream {
  gameId: string
  youtubeUrl: string // Full YouTube URL or just video ID
  isLive: boolean
  startedAt?: Date
}
```

### Display Locations

#### 1. Homepage Featured Game
```
┌─────────────────────────────────────────────────────────┐
│ LIVE NOW: Game 12 - Calgary vs Edmonton                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [YouTube Live Stream Player - 16:9 aspect ratio]       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ Calgary Bears  3  │  2nd Period  │  2  Edmonton Rush   │
│                   │   08:45      │                      │
├─────────────────────────────────────────────────────────┤
│ Latest: Smith (CAL) scores! Assisted by Jones          │
└─────────────────────────────────────────────────────────┘
```

#### 2. Game Detail Page
```
┌─────────────────────────────────────────────────────────┐
│ Game 12: Calgary Bears vs Edmonton Rush                │
├─────────────────────────────────────────────────────────┤
│ [Tab: Live] [Tab: Stats] [Tab: Play-by-Play]           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [YouTube Live Stream Player - 16:9 aspect ratio]       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ Live Statistics                                         │
│ ┌─────────────────┬─────────────────┐                  │
│ │ Calgary Bears   │ Edmonton Rush   │                  │
│ │ Goals: 3        │ Goals: 2        │                  │
│ │ Shots: 24       │ Shots: 18       │                  │
│ │ Penalties: 4    │ Penalties: 6    │                  │
│ └─────────────────┴─────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

### Stream Detection
- Check if game status is 'live'
- Show stream player if youtubeUrl exists
- Auto-play muted (browser requirement)
- Full-screen capability

### Implementation
```typescript
// YouTube Player Component
interface YouTubePlayerProps {
  videoId: string
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
}

// Extract video ID from various YouTube URL formats
function extractYouTubeId(url: string): string {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  // Assume it's already just the ID
  return url
}
```

## Performance and Scaling Best Practices

### Database Optimization
1. **Indexes**
   ```sql
   -- Critical indexes for 500-900 concurrent users
   CREATE INDEX idx_games_status ON games(status);
   CREATE INDEX idx_games_scheduled ON games(scheduledTime);
   CREATE INDEX idx_goals_game ON goals(gameId);
   CREATE INDEX idx_players_team ON players(teamId);
   ```

2. **Connection Pooling**
   ```typescript
   // PostgreSQL connection pool
   const pool = new Pool({
     max: 20, // max connections
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   })
   ```

### Caching Strategy
1. **Redis for Live Game States**
   ```typescript
   // Cache live game data with 1-second TTL
   await redis.setex(`game:${gameId}:live`, 1, JSON.stringify(gameState))
   ```

2. **CDN for Static Assets**
   - Team logos
   - Player photos
   - CSS/JS bundles

3. **API Response Caching**
   ```typescript
   // Cache standings for 30 seconds
   app.get('/api/standings', cache(30), async (req, res) => {
     const standings = await calculateStandings()
     res.json(standings)
   })
   ```

### Real-Time Optimization
1. **SSE Connection Management**
   - Limit one connection per user
   - Automatic reconnection
   - Heartbeat every 30 seconds

2. **Update Debouncing**
   ```typescript
   // Debounce statistics calculations
   const debouncedCalcStats = debounce(calculateGameStats, 1000)
   ```

3. **Payload Optimization**
   - Send only changed data
   - Use MessagePack for binary encoding
   - Compress large responses

### Load Testing Targets
- 900 concurrent SSE connections
- 100 requests/second to live endpoints
- < 100ms response time for cached data
- < 500ms for database queries