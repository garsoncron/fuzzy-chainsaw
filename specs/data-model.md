# Cowtown Showdown Data Model Documentation

This document provides a comprehensive overview of all data structures, collections, and relationships for the Cowtown Showdown lacrosse tournament system.

## Core Collections

### Teams
Represents the 8 tournament teams participating in the Cowtown Showdown.

```typescript
interface Team {
  id: string
  name: string                    // "Calgary Bears"
  slug: string                    // "calgary-bears"
  logo?: Media                    // Team logo upload
  primaryColor?: string           // Hex color for team branding
  secondaryColor?: string         // Secondary hex color
  city: string                    // Team city
  province: string                // Team province
  captain: {
    name: string
    email: string
    phone: string
  }
  roster: Player[]                // Relationship to Players collection
  stats: TeamStats                // Virtual/computed field
  createdAt: Date
  updatedAt: Date
}
```

### Players
All players registered for the tournament, including runners and goalies.

```typescript
interface Player {
  id: string
  firstName: string
  lastName: string
  jerseyNumber: number            // 0-99
  primaryPosition: PlayerPosition // See position definitions below
  secondaryPosition?: PlayerPosition
  handedness: 'left' | 'right'
  team: Team                      // Relationship to Teams collection
  playerType: 'runner' | 'goalie'
  photo?: Media
  stats: PlayerStats              // Virtual/computed field
  createdAt: Date
  updatedAt: Date
}

type PlayerPosition = 'offence' | 'defence' | 'transition' | 'faceoff' | 'goalie'
```

#### Player Position Definitions
- **Offence**: Primary goal scorers and offensive players
- **Defence**: Defensive specialists who prevent opponents from scoring
- **Transition**: Hybrid players who excel at moving the ball between ends
- **Faceoff**: Specialists responsible for winning face-offs
- **Goalie**: Goaltender who protects the net

### Team Staff
Coaches, trainers, and other team support personnel.

```typescript
interface TeamStaff {
  id: string
  firstName: string
  lastName: string
  role: 'coach' | 'trainer' | 'manager' | 'other'
  team: Team                      // Relationship
  createdAt: Date
  updatedAt: Date
}
```

### Games
All 22 tournament games including pool play and medal games.

```typescript
interface Game {
  id: string
  gameNumber: string              // "1", "2", etc.
  gameType: 'pool' | 'medal'      // Medal games are final 2 games
  day: 1 | 2 | 3
  scheduledTime: Date
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  
  // Team assignments
  homeTeam: Team
  awayTeam: Team
  homeScore: number
  awayScore: number
  
  // Goaltenders
  homeStartingGoalie: Player
  awayStartingGoalie: Player
  homeCurrentGoalie: Player       // For tracking goalie changes
  awayCurrentGoalie: Player
  
  // Game periods
  periods: Period[]
  overtimePeriods?: OvertimePeriod[] // Medal games only
  
  // Tournament points (5-point system)
  gamePoints: {
    home: number                  // 0-5 points possible
    away: number                  // 0-5 points possible
  }
  
  // Period-by-period points breakdown
  periodPoints: {
    period1: { home: number, away: number } // 0, 0.5, or 1
    period2: { home: number, away: number }
    period3: { home: number, away: number }
  }
  
  // Final game points (win/tie/loss)
  finalGamePoints: {
    home: number                  // 0, 1, or 2
    away: number                  // 0, 1, or 2
  }
  
  // Game timing configuration
  warmupTime: 5                   // Minutes
  periodLength: number            // 12 for pool, 15 for medal
  stopTimeStart: 2                // Last 2 minutes of 3rd
  breakLength: 2                  // Minutes between periods
  timeoutsPerGame: 2              // Not in same period
  gameInterval: 50                // Minutes between games
  overtimeAllowed: boolean        // Only for medal games
  
  // Current state
  currentPeriod: 0 | 1 | 2 | 3 | 'OT1' | 'OT2' | 'OT3'
  periodTimeRemaining?: number    // Seconds
  
  // Media and metadata
  youtubeUrl?: string
  slug: string                    // Auto-generated
  createdAt: Date
  updatedAt: Date
  
  // Relationships to statistics
  goals: Goal[]
  penalties: Penalty[]
  faceoffs: Faceoff[]
  shots: Shot[]
  looseBalls: LooseBall[]
  ruleViolations: RuleViolation[]
  delayOfGame: DelayOfGame[]
}
```

### Periods
Individual period data for each game.

```typescript
interface Period {
  id: string
  game: Game                      // Relationship
  periodNumber: 1 | 2 | 3
  homeScore: number
  awayScore: number
  
  // Tournament points for this period
  homePeriodPoints: number        // 0, 0.5, or 1
  awayPeriodPoints: number        // 0, 0.5, or 1
  
  // Timing
  scheduledLength: number         // 12 or 15 minutes
  stopTime: boolean               // True for last 2 min of 3rd
  startTime: Date
  endTime?: Date
  
  // Timeouts used
  homeTimeoutsUsed: number
  awayTimeoutsUsed: number
}
```

### Overtime Periods
For medal games that go to overtime.

```typescript
interface OvertimePeriod {
  id: string
  game: Game                      // Relationship
  overtimeNumber: number          // 1, 2, 3, etc.
  length: 5                       // 5-minute sudden death
  breakLength: 1                  // 1-minute breaks
  homeScore: number
  awayScore: number
  startTime: Date
  endTime?: Date
  suddenDeath: true
  additionalTimeouts: 1           // One more timeout in OT
}
```

## Statistics Collections

### Goals
Every goal scored in the tournament.

```typescript
interface Goal {
  id: string
  game: Game                      // Relationship
  period: number | string         // 1, 2, 3, "OT1", etc.
  time: string                    // "12:34" game clock
  scorer: Player                  // Relationship
  assist1?: Player                // Primary assist
  assist2?: Player                // Secondary assist
  team: Team                      // Scoring team
  gameTime: number                // Seconds from game start
  goalType: 'even_strength' | 'power_play' | 'short_handed' | 'penalty_shot'
}
```

### Penalties
All penalties assessed during games.

```typescript
interface Penalty {
  id: string
  game: Game                      // Relationship
  period: number | string
  time: string
  player: Player                  // Penalized player
  team: Team
  infraction: string              // See penalty definitions
  duration: PenaltyDuration
  penaltyType: PenaltyType
  coincidental: boolean           // For coincidental penalties
  delayedPenalty: boolean
  startTime: Date
  endTime?: Date
  gameTime: number
  description?: string            // Additional details
}

type PenaltyDuration = '30s' | '1min' | '2min' | '3min' | '5min' | '10min' | 'game' | 'penalty_shot'
type PenaltyType = 'minor' | 'major' | 'misconduct' | 'game_misconduct' | 'penalty_shot'
```

#### Common Penalty Infractions
**Minor Penalties (2 minutes)**
- Slashing, Tripping, Interference, Holding
- Illegal Pick, Cross Checking, Elbowing, Roughing
- Unsportsmanlike Conduct, Delay of Game
- Illegal Substitution, Crease Violation, Over and Back

**Major Penalties (5 minutes)**
- High Sticking, Boarding, Face Masking
- Fighting, Spearing, Checking from Behind

**Misconduct (10 minutes)**
- Serious violations warranting removal

**Game Misconduct**
- Ejection from the game

**Penalty Shot**
- Severe infractions preventing clear scoring opportunities

### Faceoffs
All faceoff results tracked during games.

```typescript
interface Faceoff {
  id: string
  game: Game                      // Relationship
  period: number | string
  time: string                    // Game clock
  homeFaceoffPlayer: Player       // Home team player
  awayFaceoffPlayer: Player       // Away team player
  winner: 'home' | 'away'
  gameTime: number                // Seconds from start
}
```

### Shots
Shot attempts tracked for goaltender statistics.

```typescript
interface Shot {
  id: string
  game: Game                      // Relationship
  period: number | string
  time: string
  shooter: Player                 // Player taking shot
  goalie: Player                  // Goalie facing shot
  team: 'home' | 'away'
  saved: boolean                  // Whether goalie saved it
  gameTime: number                // Seconds from start
}
```

### Loose Balls
Loose ball recoveries for possession statistics.

```typescript
interface LooseBall {
  id: string
  game: Game                      // Relationship
  period: number | string
  time: string
  player: Player                  // Player recovering ball
  team: 'home' | 'away'
  gameTime: number
}
```

### Goalie Changes
Track when goalies are substituted during games.

```typescript
interface GoalieChange {
  id: string
  game: Game                      // Relationship
  period: number | string
  time: string
  team: 'home' | 'away'
  previousGoalie: Player
  newGoalie: Player
  gameTime: number
}
```

## Rule-Specific Collections

### Rule Violations
Non-penalty rule violations that result in possession changes.

```typescript
interface RuleViolation {
  id: string
  game: Game                      // Relationship
  period: number
  time: string
  player: Player
  team: 'home' | 'away'
  violationType: ViolationType
  description: string
  gameTime: number
  penaltyAssessed: boolean        // Whether penalty was given
}

type ViolationType = 
  | 'illegal_substitution'        // Too many players
  | 'over_and_back'              // Ball back across center
  | 'crease_violation'           // In crease while playing ball
  | 'eight_second'               // Failed to cross center in 8s
  | 'four_second'                // Failed to exit crease in 4s
  | 'traditional_stick'          // Illegal stick (non-goalie)
  | 'shot_clock'                 // 30-second violation
  | 'fast_restart_violation'     // Failed to move 6 feet away
```

### Delay of Game
Special tracking for teams not ready to play.

```typescript
interface DelayOfGame {
  id: string
  game: Game                      // Relationship
  period: number
  time: string
  team: 'home' | 'away'
  reason: 'not_ready_to_play'
  pointsDeducted: number          // 1 point deducted
  gameTime: number
}
```

## Tournament Management Collections

### Tournament Years
Historical tournament data.

```typescript
interface TournamentYear {
  id: string
  year: number
  champion: Team                  // Relationship
  runnerUp: Team                  // Relationship
  mvp: Player                     // Relationship
  topScorer: Player               // Relationship
  teams: Team[]                   // All participating teams
  stats: {}                       // JSON blob for year stats
  photos: Media[]
}
```

### Team Submissions
Team registration applications.

```typescript
interface TeamSubmission {
  id: string
  teamName: string
  city: string
  province: string
  captainName: string
  captainEmail: string
  captainPhone: string
  alternateContact: {
    name: string
    email: string
    phone: string
  }
  estimatedRosterSize: number
  additionalInfo?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: Date
}
```

### Tournament Standings
Computed standings for the tournament.

```typescript
interface TournamentStandings {
  id: string
  team: Team                      // Relationship
  tournamentYear: number
  
  // Game records
  gamesPlayed: number
  wins: number
  ties: number
  losses: number
  
  // Tournament points (5-point system)
  totalTournamentPoints: number   // Sum of all game points (max 25)
  periodPoints: number            // Points from individual periods
  gamePoints: number              // Points from final results
  
  // Tiebreaker stats
  goalsFor: number
  goalsAgainst: number
  goalDifferential: number
  goalAverage: number             // GF ÷ (GF + GA)
  penaltyMinutes: number
  
  // Head-to-head records
  headToHeadResults: {
    opponent: Team
    result: 'win' | 'tie' | 'loss'
    tournamentPoints: number
  }[]
}
```

## Global Settings

### Tournament Settings
Global configuration for the tournament.

```typescript
interface TournamentSettings {
  currentYear: number
  registrationOpen: boolean
  registrationDeadline: Date
  tournamentStartDate: Date
  tournamentEndDate: Date
  
  // Tournament structure
  tournamentFee: 1800             // CAD
  feePerPlayer: 90                // CAD alternative
  maxRosterSize: 20               // Game roster limit
  gameRosterSize: 18              // 18 runners + 2 goalies
  guaranteedGames: 5
  
  // Game timing
  warmupTime: 5                   // Minutes
  regularPeriodLength: 12         // Minutes
  medalGamePeriodLength: 15       // Minutes
  periodCount: 3
  breakLength: 2                  // Minutes between periods
  stopTimeStart: 2                // Last 2 minutes of 3rd
  overtimePeriodLength: 5         // Minutes, sudden death
  overtimeBreakLength: 1          // Minutes
  timeoutsPerGame: 2
  timeoutsPerPeriodLimit: 2       // Cannot use both in same period
  additionalOvertimeTimeouts: 1
  gameInterval: 50                // New game every 50 minutes
  
  // Field specifications
  floorLength: 210                // Feet (approximately)
  floorWidth: 85                  // Feet
  goalHeight: 4                   // Feet
  goalWidth: 4.5                  // Feet (4'6")
  
  // Rules
  rules: 'RMLL Modified (same as OLA modified)'
  traditionalSticksAllowed: false // Except for goalies
  shotClock: 30                   // Seconds
  creaseCount: 4                  // Seconds to exit crease
  eightSecondCount: 8             // Seconds to cross center
  
  // Tournament point structure
  winPoints: 2
  tiePoints: 1
  lossPoints: 0
  periodWinPoints: 1
  periodTiePoints: 0.5
  periodLossPoints: 0
  maxPointsPerGame: 5
  
  // Tiebreaker rules
  tiebreakers: [
    'head_to_head_points',
    'head_to_head_goal_average',
    'overall_goal_average',
    'least_penalty_minutes'
  ]
  
  fields: Field[]
  landAcknowledgment: RichText
}
```

### Fields
Tournament venue information.

```typescript
interface Field {
  id: string
  name: string
  location: string
  address: string
  mapUrl?: string
}
```

## Computed Statistics

### Player Statistics
Statistics calculated from game events.

```typescript
interface PlayerStats {
  // Basic stats
  gamesPlayed: number             // GP
  goals: number                   // G
  assists: number                 // A
  points: number                  // PTS (G + A)
  penaltyMinutes: number          // PIM
  
  // Power play stats
  powerPlayGoals: number          // PPG
  powerPlayAssists: number        // PPA
  shortHandedGoals: number        // SHG
  
  // Possession stats
  looseBallRecoveries: number     // LB
  turnovers: number               // TO
  causedTurnovers: number         // CTO
  
  // Defensive stats
  blockedShots: number            // BLK
  
  // Shooting stats
  shotsOnGoal: number             // SOG
  
  // Faceoff stats (specialists)
  faceoffWins?: number            // FO wins
  faceoffAttempts?: number        // FO total
  faceoffPercentage?: number      // FO%
  
  // Goalie-specific stats
  minutesPlayed?: number          // MIN
  wins?: number                   // W
  losses?: number                 // L
  goalsAllowed?: number           // GA
  goalsAllowedAverage?: number    // GAA
  saves?: number                  // SV
  savePercentage?: number         // SV%
}
```

### Team Statistics
Aggregate team performance metrics.

```typescript
interface TeamStats {
  // Game records
  gamesPlayed: number
  wins: number
  ties: number
  losses: number
  tournamentPoints: number
  
  // Scoring stats
  goalsFor: number
  goalsAgainst: number
  goalDifferential: number
  goalAverage: number             // For tiebreaking
  
  // Special teams
  powerPlayGoals: number
  powerPlayOpportunities: number
  powerPlayPercentage: number
  penaltyKillGoalsAllowed: number
  penaltyKillOpportunities: number
  penaltyKillPercentage: number
  shortHandedGoals: number
  shortHandedGoalsAllowed: number
  
  // Possession stats
  looseBallRecoveries: number
  turnovers: number
  causedTurnovers: number
  
  // Shooting stats
  shotsFor: number
  shotsAgainst: number
  shotDifferential: number
  
  // Disciplinary stats
  penaltyMinutes: number
  penaltiesFor: number
  penaltiesAgainst: number
  
  // Faceoff stats
  faceoffWins: number
  faceoffAttempts: number
  faceoffPercentage: number
  
  // Defensive stats
  blockedShots: number
  
  // Goaltending stats
  saves: number
  savePercentage: number
  goalsAllowedAverage: number
  shutouts: number
}
```

## Key Formulas and Calculations

### Goal Average (for tiebreaking)
```typescript
goalAverage = goalsFor / (goalsFor + goalsAgainst)
```

### Tournament Points Calculation
```typescript
// For each period
if (homePeriodScore > awayPeriodScore) {
  homePeriodPoints = 1
  awayPeriodPoints = 0
} else if (awayPeriodScore > homePeriodScore) {
  homePeriodPoints = 0
  awayPeriodPoints = 1
} else {
  homePeriodPoints = 0.5
  awayPeriodPoints = 0.5
}

// For final game result
if (homeScore > awayScore) {
  homeFinalPoints = 2
  awayFinalPoints = 0
} else if (awayScore > homeScore) {
  homeFinalPoints = 0
  awayFinalPoints = 2
} else {
  homeFinalPoints = 1
  awayFinalPoints = 1
}

// Total tournament points
totalHomePoints = homePeriodPoints + homeFinalPoints // Max 5
totalAwayPoints = awayPeriodPoints + awayFinalPoints // Max 5
```

## Data Relationships

### Primary Relationships
- Team → Players (one-to-many)
- Team → Team Staff (one-to-many)
- Game → Teams (many-to-one for home/away)
- Game → Players (many-to-one for goalies)
- Game → Goals, Penalties, Faceoffs, Shots, etc. (one-to-many)
- Player → Goals (as scorer/assists)
- Player → Penalties, Faceoffs, Shots, etc.

### Computed Relationships
- Team → Team Stats (virtual/computed)
- Player → Player Stats (virtual/computed)
- Team → Tournament Standings (computed from games)

## Access Control Considerations

### Public Access
- View teams, players, games, standings
- View live game updates
- View statistics and leaderboards

### Scorekeeper Access
- Update game status and scores
- Record goals, penalties, and other events
- Manage period timing
- Cannot edit team or player data

### Admin Access
- Full CRUD on all collections
- User management
- Tournament configuration
- Data import/export

## Performance Considerations

### Indexed Fields
- `game.status` - For filtering live games
- `game.scheduledTime` - For schedule queries
- `player.team` - For roster lookups
- `goal.game`, `penalty.game`, etc. - For game statistics
- `team.slug`, `player.jerseyNumber` - For lookups

### Cached Data
- Live game states
- Current standings
- Player/team statistics (refresh periodically)

### Real-time Updates
- SSE connections for live games only
- Debounced updates for statistics
- Optimistic UI updates for scorekeeping