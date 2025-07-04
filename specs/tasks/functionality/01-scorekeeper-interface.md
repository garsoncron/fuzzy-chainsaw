# Functionality Task: Scorekeeper Interface

## Overview
Build a mobile-first scorekeeper interface for managing live games, tracking statistics, and updating scores in real-time during tournament games.

## Core Requirements

### Authentication & Access
- Scorekeeper role-based access
- 4-hour session timeout
- Quick re-authentication
- Audit trail of all actions

### Mobile Optimization
- Tablet-first design (iPad primary target)
- Large touch targets (min 44x44px)
- Prevent accidental double-taps
- Landscape orientation optimized
- Offline capability with sync

## Scorekeeper App Structure

### 1. Scorekeeper Dashboard
**Route**: `/scorekeeper`
**File**: `src/app/scorekeeper/page.tsx`

```typescript
interface ScorekeeperDashboard {
  activeGames: Game[]
  upcomingGames: Game[]
  completedGames: Game[]
  userInfo: {
    name: string
    role: string
    lastActivity: Date
    sessionExpiry: Date
  }
}
```

**Features**:
- List of assigned games
- Quick access to active game
- Session timer display
- Logout button

### 2. Game Selection Screen
**Route**: `/scorekeeper/games`
**File**: `src/app/scorekeeper/games/page.tsx`

```typescript
interface GameSelectionScreen {
  games: Array<{
    id: string
    gameNumber: string
    teams: { home: Team, away: Team }
    scheduledTime: Date
    status: GameStatus
    field: string
  }>
}
```

**UI Elements**:
- Large game cards with team logos
- Status indicators
- Start game button (for scheduled games)
- Resume button (for live games)

### 3. Pre-Game Setup
**Route**: `/scorekeeper/games/[id]/setup`
**File**: `src/app/scorekeeper/games/[id]/setup/page.tsx`

```typescript
interface PreGameSetup {
  game: Game
  homeRoster: Player[]
  awayRoster: Player[]
  officials?: Official[]
}
```

**Setup Steps**:
1. Confirm team rosters
2. Select starting goalies
3. Enter officials (optional)
4. Confirm game start

**UI Components**:
```typescript
// Goalie selection
<GoalieSelector
  team={homeTeam}
  players={homeGoalies}
  onSelect={(goalie) => setHomeStartingGoalie(goalie)}
/>

// Roster confirmation
<RosterCheckbox
  team={team}
  players={roster}
  onConfirm={(presentPlayers) => setActiveRoster(presentPlayers)}
/>
```

### 4. Live Game Management
**Route**: `/scorekeeper/games/[id]/live`
**File**: `src/app/scorekeeper/games/[id]/live/page.tsx`

**Layout Structure**:
```
+----------------------------------+
|        Score Display              |
|   HOME 3  -  2 AWAY              |
|      Period 2 - 8:45             |
+----------------------------------+
|  Quick Actions Bar               |
|  [Goal] [Penalty] [Shot] [Face] |
+----------------------------------+
|        Main Action Area          |
|     (Context-sensitive)          |
+----------------------------------+
|  Period Controls | Game Actions  |
+----------------------------------+
```

### 5. Goal Entry Interface
**Component**: `src/components/Scorekeeper/GoalEntry.tsx`

```typescript
interface GoalEntryProps {
  game: Game
  onSubmit: (goal: GoalData) => Promise<void>
  onCancel: () => void
}

interface GoalData {
  team: 'home' | 'away'
  scorer: string // player ID
  assists: string[] // max 2 player IDs
  time: string // game clock time
  period: string
  powerPlay: boolean
  shortHanded: boolean
  emptyNet: boolean
}
```

**UI Flow**:
1. Select scoring team (large buttons)
2. Select goal scorer (jersey number grid)
3. Optional: Select assists (up to 2)
4. Confirm special situations (PP/SH/EN)
5. Submit or cancel

**Touch UI Example**:
```typescript
// Jersey number grid
<div className="grid grid-cols-6 gap-2">
  {teamPlayers.map((player) => (
    <button
      key={player.id}
      className="h-16 w-16 bg-western-wood text-white text-xl font-bold rounded"
      onClick={() => handlePlayerSelect(player)}
    >
      {player.jerseyNumber}
    </button>
  ))}
</div>
```

### 6. Penalty Entry Interface
**Component**: `src/components/Scorekeeper/PenaltyEntry.tsx`

```typescript
interface PenaltyData {
  team: 'home' | 'away'
  player: string
  infraction: string
  duration: '30s' | '1min' | '2min' | '3min' | '5min' | 'game'
  time: string
  period: string
}
```

**Common Infractions Quick Select**:
- Slashing
- Tripping
- Roughing
- Cross-checking
- High-sticking
- Too many men
- Delay of game
- Other (text input)

### 7. Period Management
**Component**: `src/components/Scorekeeper/PeriodControls.tsx`

```typescript
interface PeriodControlsProps {
  currentPeriod: string
  timeRemaining: number
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onEndPeriod: () => void
}
```

**Features**:
- Large start/stop button
- Period timer display
- End period confirmation
- Intermission timer (optional)

### 8. Quick Stats Entry
**Component**: `src/components/Scorekeeper/QuickStats.tsx`

**Shot Counter**:
```typescript
<div className="grid grid-cols-2 gap-4">
  <ShotCounter
    team="home"
    shots={homeShots}
    onIncrement={() => addShot('home')}
    onDecrement={() => removeShot('home')}
  />
  <ShotCounter
    team="away"
    shots={awayShots}
    onIncrement={() => addShot('away')}
    onDecrement={() => removeShot('away')}
  />
</div>
```

**Faceoff Tracker**:
```typescript
<FaceoffTracker
  onWin={(team) => recordFaceoffWin(team)}
  homeWins={homeFaceoffWins}
  awayWins={awayFaceoffWins}
/>
```

### 9. Game Completion
**Route**: `/scorekeeper/games/[id]/complete`
**File**: `src/app/scorekeeper/games/[id]/complete/page.tsx`

**Completion Steps**:
1. Confirm final score
2. Select three stars
3. Review game statistics
4. Submit final game sheet

**Three Stars Selection**:
```typescript
<ThreeStarsSelector
  eligiblePlayers={getAllPlayers()}
  onSelect={(stars) => setThreeStars(stars)}
  gameStats={gameStats}
/>
```

### 10. Offline Support
**File**: `src/lib/offline-sync.ts`

```typescript
class OfflineGameSync {
  private pendingActions: GameAction[] = []
  private db: IDBDatabase
  
  async queueAction(action: GameAction) {
    // Store action in IndexedDB
    await this.db.add('pendingActions', action)
    
    // Try to sync if online
    if (navigator.onLine) {
      await this.syncActions()
    }
  }
  
  async syncActions() {
    const actions = await this.getPendingActions()
    
    for (const action of actions) {
      try {
        await this.sendAction(action)
        await this.removeAction(action.id)
      } catch (error) {
        console.error('Sync failed for action:', action)
      }
    }
  }
}
```

## UI/UX Guidelines

### Touch Optimization
1. **Button Sizes**: Minimum 44x44px, preferably 48x48px
2. **Spacing**: 8px minimum between touch targets
3. **Feedback**: Immediate visual feedback on touch
4. **Gestures**: Swipe to undo last action
5. **Confirmation**: Required for destructive actions

### Visual Design
1. **High Contrast**: For outdoor visibility
2. **Large Text**: Minimum 16px, preferably 18px
3. **Color Coding**: Team colors for quick identification
4. **Status Indicators**: Clear live/paused/ended states
5. **Western Theme**: Consistent with main site

### Error Prevention
1. **Undo Functionality**: Last 5 actions
2. **Confirmation Dialogs**: For period end, game end
3. **Auto-save**: Every action saved immediately
4. **Validation**: Prevent impossible states
5. **Recovery**: Graceful handling of connection loss

## Technical Implementation

### State Management
```typescript
// Use Zustand for game state
interface GameStore {
  gameId: string
  gameState: GameState
  pendingActions: GameAction[]
  
  // Actions
  updateScore: (team: 'home' | 'away', delta: number) => void
  addGoal: (goal: GoalData) => void
  addPenalty: (penalty: PenaltyData) => void
  updatePeriod: (period: string) => void
  syncWithServer: () => Promise<void>
}
```

### Real-time Sync
```typescript
// Optimistic updates with rollback
const addGoal = async (goal: GoalData) => {
  // Optimistic update
  const tempId = generateTempId()
  store.addOptimisticGoal({ ...goal, id: tempId })
  
  try {
    const result = await api.addGoal(goal)
    store.confirmGoal(tempId, result.id)
  } catch (error) {
    store.rollbackGoal(tempId)
    toast.error('Failed to record goal')
  }
}
```

### Performance
1. **Code Splitting**: Separate bundles for scorekeeper app
2. **Service Worker**: For offline functionality
3. **Minimal Dependencies**: Keep bundle size small
4. **Efficient Rendering**: React.memo for static elements
5. **Battery Optimization**: Reduce unnecessary updates

## Security Considerations

1. **Session Management**: Automatic logout after 4 hours
2. **Action Logging**: Every action logged with timestamp and user
3. **Data Validation**: Server-side validation of all inputs
4. **Rate Limiting**: Prevent spam submissions
5. **Role Verification**: Check permissions on each request

## Testing Requirements

1. **Device Testing**: iPad, Android tablets, phones
2. **Offline Testing**: Full game flow without connection
3. **Stress Testing**: Rapid action entry
4. **Accessibility**: Touch target sizes, contrast
5. **Integration**: With live scoring system