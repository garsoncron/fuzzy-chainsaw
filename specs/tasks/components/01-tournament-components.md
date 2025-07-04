# Component Task: Tournament-Specific Components

## Overview
Create reusable React components for tournament features including scoreboards, game cards, standings tables, and statistics displays.

## Core Tournament Components

### 1. Scoreboard Component
**File**: `src/components/Scoreboard/index.tsx`
**Priority**: Critical

```typescript
interface ScoreboardProps {
  games: Game[]
  variant?: 'compact' | 'detailed' | 'mini'
  groupBy?: 'day' | 'status' | 'none'
  autoRefresh?: boolean
  refreshInterval?: number
}

export function Scoreboard({
  games,
  variant = 'compact',
  groupBy = 'day',
  autoRefresh = true,
  refreshInterval = 5000,
}: ScoreboardProps) {
  // Component implementation
}
```

**Features**:
- Scrollable horizontal layout on mobile
- Group games by day or status
- Live game indicators with pulsing animation
- Auto-refresh for live games
- Western-themed styling

**Variants**:
- `compact`: Shows team logos, score, and status
- `detailed`: Includes period scores and current time
- `mini`: Minimal view for embedding

### 2. GameCard Component
**File**: `src/components/GameCard/index.tsx`
**Priority**: Critical

```typescript
interface GameCardProps {
  game: Game
  variant?: 'schedule' | 'live' | 'final' | 'preview'
  showDetails?: boolean
  onClickDetails?: () => void
}

export function GameCard({
  game,
  variant,
  showDetails = true,
  onClickDetails,
}: GameCardProps) {
  // Component implementation
}
```

**Features**:
- Dynamic styling based on game status
- Power play/penalty kill indicators
- Three stars display (final games)
- YouTube link indicator
- Responsive layout

**Status Indicators**:
- Scheduled: Shows time and field
- Live: Pulsing border, period timer
- Final: Three stars, final badge
- Overtime: Special OT indicator

### 3. StandingsTable Component
**File**: `src/components/StandingsTable/index.tsx`
**Priority**: Critical

```typescript
interface StandingsTableProps {
  teams: TeamStanding[]
  division: 'gold' | 'blue'
  showPointsBreakdown?: boolean
  highlightTeam?: string
}

interface TeamStanding {
  team: Team
  wins: number
  losses: number
  overtimeWins: number
  periodWins: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export function StandingsTable({
  teams,
  division,
  showPointsBreakdown = true,
  highlightTeam,
}: StandingsTableProps) {
  // Component implementation
}
```

**Features**:
- 5-point system display
- Sortable columns
- Points breakdown tooltip
- Tiebreaker indicators
- Mobile-responsive table

**Columns**:
| Team | W | L | GF | GA | +/- | Pts | Detail |
|------|---|---|----|----|-----|-----|---------|

### 4. BoxScore Component
**File**: `src/components/BoxScore/index.tsx`
**Priority**: High

```typescript
interface BoxScoreProps {
  game: Game
  showGoalies?: boolean
  showShots?: boolean
  showPenalties?: boolean
  showFaceoffs?: boolean
}

export function BoxScore({
  game,
  showGoalies = true,
  showShots = true,
  showPenalties = true,
  showFaceoffs = false,
}: BoxScoreProps) {
  // Component implementation
}
```

**Layout**:
```
Team Name    | 1 | 2 | 3 | OT | T |
-------------|---|---|---|----|----|
Home Team    | 2 | 1 | 3 | -  | 6 |
Away Team    | 1 | 2 | 1 | -  | 4 |

Shots: Home 35 - Away 28
Penalties: Home 3/6 - Away 2/4
Faceoffs: Home 18/30 - Away 12/30
```

### 5. PlayerStatsCard Component
**File**: `src/components/PlayerStatsCard/index.tsx`
**Priority**: High

```typescript
interface PlayerStatsCardProps {
  player: Player
  stats: PlayerStats
  variant?: 'compact' | 'detailed'
  showRank?: boolean
}

interface PlayerStats {
  goals: number
  assists: number
  points: number
  penaltyMinutes: number
  plusMinus: number
  gamesPlayed: number
}

export function PlayerStatsCard({
  player,
  stats,
  variant = 'compact',
  showRank,
}: PlayerStatsCardProps) {
  // Component implementation
}
```

**Features**:
- Player photo display
- Jersey number badge
- Position indicator
- Stats summary
- Team colors accent

### 6. ThreeStarsDisplay Component
**File**: `src/components/ThreeStarsDisplay/index.tsx`
**Priority**: Medium

```typescript
interface ThreeStarsDisplayProps {
  stars: {
    first: Player
    second: Player
    third: Player
  }
  gameId: string
  variant?: 'banner' | 'card' | 'overlay'
}

export function ThreeStarsDisplay({
  stars,
  gameId,
  variant = 'card',
}: ThreeStarsDisplayProps) {
  // Component implementation
}
```

**Design**:
- Gold, silver, bronze star badges
- Player photos with team colors
- Stats for the game
- Western-themed styling

### 7. TeamLogo Component
**File**: `src/components/TeamLogo/index.tsx`
**Priority**: High

```typescript
interface TeamLogoProps {
  team: Team
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  variant?: 'circle' | 'square' | 'badge'
}

export function TeamLogo({
  team,
  size = 'md',
  showName = false,
  variant = 'circle',
}: TeamLogoProps) {
  // Component implementation
}
```

**Features**:
- Responsive sizing
- Fallback to initials if no logo
- Team color background
- Optional team name display

### 8. PeriodIndicator Component
**File**: `src/components/PeriodIndicator/index.tsx`
**Priority**: Medium

```typescript
interface PeriodIndicatorProps {
  currentPeriod: string
  timeRemaining?: number
  isLive?: boolean
  showOvertimeDetails?: boolean
}

export function PeriodIndicator({
  currentPeriod,
  timeRemaining,
  isLive = false,
  showOvertimeDetails = true,
}: PeriodIndicatorProps) {
  // Component implementation
}
```

**Display Examples**:
- "1st - 8:45" (live)
- "2nd Intermission"
- "3rd Period"
- "OT1 - Sudden Death"
- "Final"

### 9. GoalSummary Component
**File**: `src/components/GoalSummary/index.tsx`
**Priority**: Medium

```typescript
interface GoalSummaryProps {
  goals: Goal[]
  groupByPeriod?: boolean
  showAssists?: boolean
  compact?: boolean
}

export function GoalSummary({
  goals,
  groupByPeriod = true,
  showAssists = true,
  compact = false,
}: GoalSummaryProps) {
  // Component implementation
}
```

**Layout**:
```
1st Period
1. HOME (2:34) - #12 J. Smith (PP)
   Assists: #7 M. Jones, #15 K. Brown

2. AWAY (8:12) - #22 R. Wilson
   Assist: #9 T. Davis
```

### 10. ScheduleCalendar Component
**File**: `src/components/ScheduleCalendar/index.tsx`
**Priority**: Medium

```typescript
interface ScheduleCalendarProps {
  games: Game[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  teamFilter?: string
}

export function ScheduleCalendar({
  games,
  selectedDate,
  onDateSelect,
  teamFilter,
}: ScheduleCalendarProps) {
  // Component implementation
}
```

**Features**:
- Three-day tournament view
- Time slots with field indicators
- Team filtering
- Game type color coding
- Mobile swipe navigation

### 11. StatLeaderboard Component
**File**: `src/components/StatLeaderboard/index.tsx`
**Priority**: Medium

```typescript
interface StatLeaderboardProps {
  category: 'goals' | 'assists' | 'points' | 'saves' | 'pim'
  players: PlayerWithStats[]
  limit?: number
  showTeamBadge?: boolean
}

export function StatLeaderboard({
  category,
  players,
  limit = 10,
  showTeamBadge = true,
}: StatLeaderboardProps) {
  // Component implementation
}
```

**Layout**:
```
Top Scorers
1. #12 J. Smith (CGY) - 8G, 5A, 13P
2. #7 M. Jones (EDM) - 6G, 7A, 13P
3. #22 R. Wilson (CAL) - 7G, 4A, 11P
```

### 12. TournamentBracket Component
**File**: `src/components/TournamentBracket/index.tsx`
**Priority**: Low

```typescript
interface TournamentBracketProps {
  games: Game[]
  currentRound?: 'pool' | 'semifinal' | 'final'
  interactive?: boolean
}

export function TournamentBracket({
  games,
  currentRound,
  interactive = true,
}: TournamentBracketProps) {
  // Component implementation
}
```

**Features**:
- Visual bracket display
- Completed/upcoming game states
- Team progression lines
- Medal game highlights
- Mobile-friendly layout

## Shared Component Utilities

### Animation Variants
```typescript
// src/components/animations.ts
export const gameCardVariants = {
  live: {
    borderColor: ['#FF0000', '#FF6B6B', '#FF0000'],
    transition: { duration: 2, repeat: Infinity },
  },
  scheduled: {
    opacity: 0.8,
  },
  final: {
    opacity: 1,
  },
}
```

### Western Theme Utilities
```typescript
// src/components/western-utils.ts
export const westernBadgeStyles = {
  gold: 'bg-cowtown-gold text-cowtown-dark-brown font-western',
  blue: 'bg-blue-600 text-white font-western',
  live: 'bg-red-500 text-white animate-pulse',
}
```

## Component Documentation

Each component should include:
1. Storybook stories with all variants
2. TypeScript interfaces exported
3. Accessibility attributes
4. Loading and error states
5. Mobile responsiveness tests

## Performance Considerations

1. Use React.memo for static components
2. Implement virtual scrolling for long lists
3. Lazy load images with next/image
4. Debounce real-time updates
5. Use CSS animations over JS where possible

## Testing Requirements

1. Unit tests for all logic
2. Visual regression tests
3. Accessibility audits
4. Performance benchmarks
5. Mobile device testing