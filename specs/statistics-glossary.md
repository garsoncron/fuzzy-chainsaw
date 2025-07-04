# Cowtown Showdown Statistics Glossary and Calculations

This document provides comprehensive definitions of all statistics tracked in the Cowtown Showdown tournament, including formulas and calculation methods.

## Runner Statistics

### Basic Statistics

#### GP - Games Played
- **Definition**: Total number of games in which the player participated
- **Calculation**: Count of games where player appears on game roster
- **Display**: Whole number

#### G - Goals
- **Definition**: Total goals scored by the player
- **Calculation**: Count of goals where player is listed as scorer
- **Display**: Whole number

#### A - Assists
- **Definition**: Total assists (primary and secondary) credited to the player
- **Calculation**: Count of goals where player is assist1 or assist2
- **Display**: Whole number

#### PTS - Points
- **Definition**: Total offensive points (goals plus assists)
- **Calculation**: G + A
- **Display**: Whole number
- **Note**: This is offensive points, not tournament points

#### PIM - Penalty Minutes
- **Definition**: Total penalty minutes assessed to the player
- **Calculation**: Sum of all penalty durations in minutes
- **Display**: Whole number
- **Special Cases**:
  - Game misconduct = 10 minutes
  - Match penalty = 10 minutes
  - Penalty shot = 0 minutes

### Power Play Statistics

#### PPG - Power Play Goals
- **Definition**: Goals scored while team has man advantage
- **Calculation**: Count of goals where goalType = 'power_play'
- **Display**: Whole number

#### PPA - Power Play Assists
- **Definition**: Assists on power play goals
- **Calculation**: Count of power play goals where player has assist
- **Display**: Whole number

#### SHG - Short Handed Goals
- **Definition**: Goals scored while team is short-handed
- **Calculation**: Count of goals where goalType = 'short_handed'
- **Display**: Whole number

### Possession Statistics

#### LB - Loose Ball Recoveries
- **Definition**: Number of loose balls recovered by player
- **Calculation**: Count of loose ball events for player
- **Display**: Whole number

#### TO - Turnovers
- **Definition**: Number of times player lost possession to opponent
- **Calculation**: Manual tracking by scorekeeper
- **Display**: Whole number

#### CTO - Caused Turnovers
- **Definition**: Number of turnovers forced on opponents
- **Calculation**: Manual tracking by scorekeeper
- **Display**: Whole number

### Defensive Statistics

#### BLK - Blocked Shots
- **Definition**: Shots blocked by player (non-goalie)
- **Calculation**: Manual tracking by scorekeeper
- **Display**: Whole number

### Shooting Statistics

#### SOG - Shots on Goal
- **Definition**: Shot attempts that would go in net if not saved
- **Calculation**: Count of shot events for player
- **Display**: Whole number

### Faceoff Statistics

#### FO - Faceoffs
- **Definition**: Faceoff wins and attempts
- **Calculation**: Wins/Total attempts
- **Display**: "W-L" format (e.g., "12-8")

#### FO% - Faceoff Win Percentage
- **Definition**: Percentage of faceoffs won
- **Calculation**: (Faceoff Wins / Faceoff Attempts) × 100
- **Display**: Percentage to 1 decimal (e.g., "60.0%")
- **Minimum**: 10 attempts to qualify

## Goaltender Statistics

### Basic Goalie Statistics

#### GP - Games Played
- **Definition**: Games in which goalie played any minutes
- **Calculation**: Count of games with minutes > 0
- **Display**: Whole number

#### MIN - Minutes Played
- **Definition**: Total time spent in net
- **Calculation**: Sum of time as currentGoalie
- **Display**: "MM:SS" format

#### W - Wins
- **Definition**: Games won while goalie of record
- **Calculation**: Games where goalie played majority and team won
- **Display**: Whole number

#### L - Losses
- **Definition**: Games lost while goalie of record
- **Calculation**: Games where goalie played majority and team lost
- **Display**: Whole number

### Goals Against Statistics

#### GA - Goals Allowed
- **Definition**: Total goals scored against goalie
- **Calculation**: Count of goals while goalie in net
- **Display**: Whole number

#### GAA - Goals Allowed Average
- **Definition**: Average goals allowed per 60 minutes
- **Calculation**: (GA × 60) / MIN
- **Display**: To 2 decimals (e.g., "3.45")

### Save Statistics

#### SV - Saves
- **Definition**: Shots stopped by goalie
- **Calculation**: Count of shots where saved = true
- **Display**: Whole number

#### SV% - Save Percentage
- **Definition**: Percentage of shots saved
- **Calculation**: SV / (SV + GA)
- **Display**: To 3 decimals (e.g., ".915")

## Team Statistics

### Record Statistics

#### GP - Games Played
- **Definition**: Total games played by team
- **Calculation**: Count of completed games
- **Display**: Whole number

#### W-T-L - Record
- **Definition**: Wins, ties, and losses
- **Calculation**: Count by final score comparison
- **Display**: "W-T-L" format (e.g., "3-1-1")

#### PTS - Tournament Points
- **Definition**: Total points in 5-point system
- **Calculation**: Sum of all game points earned
- **Display**: To 1 decimal (e.g., "18.5")
- **Maximum**: 25 points (5 games × 5 points)

### Scoring Statistics

#### GF - Goals For
- **Definition**: Total goals scored by team
- **Calculation**: Sum of team scores
- **Display**: Whole number

#### GA - Goals Against
- **Definition**: Total goals allowed by team
- **Calculation**: Sum of opponent scores
- **Display**: Whole number

#### DIFF - Goal Differential
- **Definition**: Difference between goals for and against
- **Calculation**: GF - GA
- **Display**: With +/- sign (e.g., "+12")

#### Goal Average
- **Definition**: Tiebreaker metric for tournament standings
- **Calculation**: GF / (GF + GA)
- **Display**: To 3 decimals (e.g., ".625")
- **Range**: 0.000 to 1.000

### Special Teams Statistics

#### PP% - Power Play Percentage
- **Definition**: Success rate on power play opportunities
- **Calculation**: (PPG / PPO) × 100
- **Display**: Percentage to 1 decimal
- **Components**:
  - PPG: Power play goals
  - PPO: Power play opportunities

#### PK% - Penalty Kill Percentage
- **Definition**: Success rate killing penalties
- **Calculation**: ((PKO - PPGA) / PKO) × 100
- **Display**: Percentage to 1 decimal
- **Components**:
  - PKO: Times short-handed
  - PPGA: Power play goals against

### Faceoff Statistics

#### FO% - Team Faceoff Percentage
- **Definition**: Team's overall faceoff win percentage
- **Calculation**: (Team FO Wins / Team FO Attempts) × 100
- **Display**: Percentage to 1 decimal

### Discipline Statistics

#### PIM - Penalty Minutes
- **Definition**: Total team penalty minutes
- **Calculation**: Sum of all player penalty minutes
- **Display**: Whole number
- **Tiebreaker**: 4th tiebreaker (least is better)

## Tournament-Specific Calculations

### 5-Point Game System

```typescript
function calculateGamePoints(game: Game): GamePoints {
  let homePoints = 0
  let awayPoints = 0
  
  // Period points (1 for win, 0.5 for tie, 0 for loss)
  for (const period of game.periods) {
    if (period.homeScore > period.awayScore) {
      homePoints += 1
    } else if (period.awayScore > period.homeScore) {
      awayPoints += 1
    } else {
      homePoints += 0.5
      awayPoints += 0.5
    }
  }
  
  // Game points (2 for win, 1 for tie, 0 for loss)
  if (game.homeScore > game.awayScore) {
    homePoints += 2
  } else if (game.awayScore > game.homeScore) {
    awayPoints += 2
  } else {
    homePoints += 1
    awayPoints += 1
  }
  
  return { home: homePoints, away: awayPoints }
}
```

### Tiebreaking Calculations

#### 1. Head-to-Head Points
```typescript
function getHeadToHeadPoints(team1: Team, team2: Team): number {
  const h2hGames = games.filter(g => 
    (g.homeTeam === team1 && g.awayTeam === team2) ||
    (g.homeTeam === team2 && g.awayTeam === team1)
  )
  
  return h2hGames.reduce((points, game) => {
    if (game.homeTeam === team1) {
      return points + game.gamePoints.home
    } else {
      return points + game.gamePoints.away
    }
  }, 0)
}
```

#### 2. Head-to-Head Goal Average
```typescript
function getHeadToHeadGoalAverage(team1: Team, team2: Team): number {
  let goalsFor = 0
  let goalsAgainst = 0
  
  const h2hGames = games.filter(g => 
    (g.homeTeam === team1 && g.awayTeam === team2) ||
    (g.homeTeam === team2 && g.awayTeam === team1)
  )
  
  h2hGames.forEach(game => {
    if (game.homeTeam === team1) {
      goalsFor += game.homeScore
      goalsAgainst += game.awayScore
    } else {
      goalsFor += game.awayScore
      goalsAgainst += game.homeScore
    }
  })
  
  return goalsFor / (goalsFor + goalsAgainst)
}
```

## Statistical Leaders and Qualifications

### Minimum Requirements
- **Scoring Leaders**: No minimum
- **GAA Leaders**: 60 minutes played
- **Save % Leaders**: 60 minutes played
- **Faceoff % Leaders**: 10 attempts
- **PP% Leaders**: 5 opportunities
- **PK% Leaders**: 5 times short-handed

### Sorting Tiebreakers
1. **Points**: Goals as tiebreaker
2. **Goals**: Fewer games played
3. **GAA**: More minutes played
4. **Save %**: More saves

## Real-Time Statistics Updates

### Update Triggers
- **Goal Scored**: Update G, A, PTS, PPG, SHG, team GF/GA
- **Penalty Called**: Update PIM, track PP/PK opportunity
- **Faceoff Won**: Update FO wins/attempts, FO%
- **Shot Taken**: Update SOG, SV, GA, SV%
- **Period End**: Calculate period points
- **Game End**: Calculate final points, W-L record

### Caching Strategy
```typescript
interface StatisticsCache {
  playerId: string
  stats: PlayerStats
  lastUpdated: Date
  version: number
}

// Invalidate on:
// - Any game event for player
// - Team roster change
// - Manual statistics correction
```

## Display Formats

### Leaderboard Display
```
SCORING LEADERS
Player Name        Team  GP   G   A  PTS
J. Smith          CAL    5  12   8   20
M. Johnson        EDM    5  10   9   19
```

### Goalie Leaders
```
GOALTENDING LEADERS
Player Name        Team  GP  MIN    W-L   GAA   SV%
B. Jones          CAL    3  180   2-1   3.33  .912
T. Brown          EDM    4  240   3-1   2.75  .925
```

### Team Standings
```
TOURNAMENT STANDINGS
Team               GP  W-T-L   PTS   GF  GA  DIFF   GA%
Calgary Bears       5  4-0-1  20.5   45  32  +13  .584
Edmonton Rush       5  3-1-1  18.0   42  38   +4  .525
```

## Advanced Analytics

### Per-Game Averages
- **G/GP**: Goals per game = G / GP
- **A/GP**: Assists per game = A / GP
- **PTS/GP**: Points per game = PTS / GP
- **PIM/GP**: Penalty minutes per game = PIM / GP

### Shooting Efficiency
- **S%**: Shooting percentage = (G / SOG) × 100
- **Shots/Goal**: Average shots per goal = SOG / G

### Plus/Minus Alternative
Since traditional +/- is complex in lacrosse:
- Track goals for/against while player on floor
- Requires manual tracking or video analysis
- Not implemented in basic system

## Data Export Formats

### CSV Export
```csv
Player,Team,GP,G,A,PTS,PIM,PPG,PPA,SHG,LB,FO,FO%
"Smith, John",CAL,5,12,8,20,14,3,2,1,15,25-20,55.6
```

### JSON Export
```json
{
  "player": {
    "name": "John Smith",
    "team": "CAL",
    "stats": {
      "gamesPlayed": 5,
      "goals": 12,
      "assists": 8,
      "points": 20,
      "penaltyMinutes": 14,
      "powerPlayGoals": 3,
      "powerPlayAssists": 2,
      "shortHandedGoals": 1,
      "looseBalls": 15,
      "faceoffs": {
        "wins": 25,
        "attempts": 45,
        "percentage": 55.6
      }
    }
  }
}
```