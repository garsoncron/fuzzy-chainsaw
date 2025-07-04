# Backend Task: Tournament Collections

## Overview
Create all Payload CMS collections required for the Cowtown Showdown tournament system.

## Collections to Implement

### 1. Teams Collection
**Priority**: Critical
**Dependencies**: None

```typescript
// src/collections/Teams/index.ts
{
  slug: 'teams',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'division', type: 'select', options: ['gold', 'blue'], required: true },
    { name: 'divisionNumber', type: 'text', required: true }, // "1G", "2B", etc.
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'primaryColor', type: 'text' },
    { name: 'secondaryColor', type: 'text' },
    { name: 'city', type: 'text', required: true },
    { name: 'province', type: 'text', required: true },
    { name: 'captain', type: 'group', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'phone', type: 'text', required: true }
    ]},
    { name: 'yearFounded', type: 'number' },
    { name: 'homeRink', type: 'text' }
  ]
}
```

### 2. Players Collection
**Priority**: Critical
**Dependencies**: Teams

```typescript
// src/collections/Players/index.ts
{
  slug: 'players',
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'jerseyNumber', type: 'number', required: true, min: 0, max: 99 },
    { name: 'team', type: 'relationship', relationTo: 'teams', required: true },
    { name: 'playerType', type: 'select', options: ['runner', 'goalie'], required: true },
    { name: 'primaryPosition', type: 'select', 
      options: ['offence', 'defence', 'transition', 'faceoff', 'goalie'], 
      required: true 
    },
    { name: 'secondaryPosition', type: 'select',
      options: ['offence', 'defence', 'transition', 'faceoff']
    },
    { name: 'handedness', type: 'select', options: ['left', 'right'], required: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'hometown', type: 'text' },
    { name: 'birthYear', type: 'number' }
  ]
}
```

### 3. Games Collection
**Priority**: Critical
**Dependencies**: Teams, Players

```typescript
// src/collections/Games/index.ts
{
  slug: 'games',
  fields: [
    { name: 'gameNumber', type: 'text', required: true, unique: true },
    { name: 'gameType', type: 'select', 
      options: ['pool', 'playoff', 'bronze', 'gold'], 
      required: true 
    },
    { name: 'day', type: 'select', options: [1, 2, 3], required: true },
    { name: 'scheduledTime', type: 'date', required: true },
    { name: 'field', type: 'select', options: ['Field 1', 'Field 2'], required: true },
    { name: 'status', type: 'select', 
      options: ['scheduled', 'live', 'final', 'overtime'], 
      defaultValue: 'scheduled',
      required: true 
    },
    { name: 'homeTeam', type: 'relationship', relationTo: 'teams', required: true },
    { name: 'awayTeam', type: 'relationship', relationTo: 'teams', required: true },
    { name: 'homeScore', type: 'number', defaultValue: 0 },
    { name: 'awayScore', type: 'number', defaultValue: 0 },
    { name: 'homeStartingGoalie', type: 'relationship', relationTo: 'players' },
    { name: 'awayStartingGoalie', type: 'relationship', relationTo: 'players' },
    { name: 'homeCurrentGoalie', type: 'relationship', relationTo: 'players' },
    { name: 'awayCurrentGoalie', type: 'relationship', relationTo: 'players' },
    { name: 'currentPeriod', type: 'text', defaultValue: '0' }, // 0, 1, 2, 3, OT1, OT2
    { name: 'periodTimeRemaining', type: 'number' }, // seconds
    { name: 'gamePoints', type: 'group', fields: [
      { name: 'home', type: 'number', defaultValue: 0, min: 0, max: 5 },
      { name: 'away', type: 'number', defaultValue: 0, min: 0, max: 5 }
    ]},
    { name: 'periods', type: 'array', fields: [
      { name: 'periodNumber', type: 'number' },
      { name: 'homeScore', type: 'number', defaultValue: 0 },
      { name: 'awayScore', type: 'number', defaultValue: 0 },
      { name: 'startTime', type: 'date' },
      { name: 'endTime', type: 'date' }
    ]},
    { name: 'youtubeUrl', type: 'text' },
    { name: 'threeStars', type: 'group', fields: [
      { name: 'first', type: 'relationship', relationTo: 'players' },
      { name: 'second', type: 'relationship', relationTo: 'players' },
      { name: 'third', type: 'relationship', relationTo: 'players' }
    ]}
  ]
}
```

### 4. Goals Collection
**Priority**: Critical
**Dependencies**: Games, Players, Teams

```typescript
// src/collections/Goals/index.ts
{
  slug: 'goals',
  fields: [
    { name: 'game', type: 'relationship', relationTo: 'games', required: true },
    { name: 'period', type: 'text', required: true }, // "1", "2", "3", "OT1", etc.
    { name: 'time', type: 'text', required: true }, // "12:34"
    { name: 'gameTime', type: 'number', required: true }, // seconds from start
    { name: 'scorer', type: 'relationship', relationTo: 'players', required: true },
    { name: 'assist1', type: 'relationship', relationTo: 'players' },
    { name: 'assist2', type: 'relationship', relationTo: 'players' },
    { name: 'team', type: 'relationship', relationTo: 'teams', required: true },
    { name: 'powerPlay', type: 'checkbox', defaultValue: false },
    { name: 'shortHanded', type: 'checkbox', defaultValue: false },
    { name: 'emptyNet', type: 'checkbox', defaultValue: false }
  ]
}
```

### 5. Penalties Collection
**Priority**: High
**Dependencies**: Games, Players, Teams

```typescript
// src/collections/Penalties/index.ts
{
  slug: 'penalties',
  fields: [
    { name: 'game', type: 'relationship', relationTo: 'games', required: true },
    { name: 'period', type: 'text', required: true },
    { name: 'time', type: 'text', required: true },
    { name: 'gameTime', type: 'number', required: true },
    { name: 'player', type: 'relationship', relationTo: 'players', required: true },
    { name: 'team', type: 'relationship', relationTo: 'teams', required: true },
    { name: 'infraction', type: 'text', required: true },
    { name: 'duration', type: 'select', 
      options: ['30s', '1min', '2min', '3min', '5min', 'game'], 
      required: true 
    },
    { name: 'startTime', type: 'date', required: true },
    { name: 'endTime', type: 'date' },
    { name: 'served', type: 'checkbox', defaultValue: false }
  ]
}
```

### 6. Shots Collection
**Priority**: High
**Dependencies**: Games, Players

```typescript
// src/collections/Shots/index.ts
{
  slug: 'shots',
  fields: [
    { name: 'game', type: 'relationship', relationTo: 'games', required: true },
    { name: 'period', type: 'text', required: true },
    { name: 'time', type: 'text', required: true },
    { name: 'gameTime', type: 'number', required: true },
    { name: 'shooter', type: 'relationship', relationTo: 'players', required: true },
    { name: 'goalie', type: 'relationship', relationTo: 'players', required: true },
    { name: 'team', type: 'select', options: ['home', 'away'], required: true },
    { name: 'saved', type: 'checkbox', defaultValue: true }
  ]
}
```

### 7. Faceoffs Collection
**Priority**: Medium
**Dependencies**: Games, Players

```typescript
// src/collections/Faceoffs/index.ts
{
  slug: 'faceoffs',
  fields: [
    { name: 'game', type: 'relationship', relationTo: 'games', required: true },
    { name: 'period', type: 'text', required: true },
    { name: 'time', type: 'text', required: true },
    { name: 'gameTime', type: 'number', required: true },
    { name: 'homeFaceoffPlayer', type: 'relationship', relationTo: 'players', required: true },
    { name: 'awayFaceoffPlayer', type: 'relationship', relationTo: 'players', required: true },
    { name: 'winner', type: 'select', options: ['home', 'away'], required: true },
    { name: 'zone', type: 'select', 
      options: ['home-defensive', 'neutral', 'away-defensive'], 
      required: true 
    }
  ]
}
```

### 8. TeamStaff Collection
**Priority**: Low
**Dependencies**: Teams

```typescript
// src/collections/TeamStaff/index.ts
{
  slug: 'teamStaff',
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'role', type: 'select', 
      options: ['coach', 'trainer', 'manager', 'other'], 
      required: true 
    },
    { name: 'team', type: 'relationship', relationTo: 'teams', required: true }
  ]
}
```

### 9. GoalieChanges Collection
**Priority**: Medium
**Dependencies**: Games, Players

```typescript
// src/collections/GoalieChanges/index.ts
{
  slug: 'goalieChanges',
  fields: [
    { name: 'game', type: 'relationship', relationTo: 'games', required: true },
    { name: 'period', type: 'text', required: true },
    { name: 'time', type: 'text', required: true },
    { name: 'gameTime', type: 'number', required: true },
    { name: 'team', type: 'select', options: ['home', 'away'], required: true },
    { name: 'previousGoalie', type: 'relationship', relationTo: 'players', required: true },
    { name: 'newGoalie', type: 'relationship', relationTo: 'players', required: true },
    { name: 'reason', type: 'select', 
      options: ['injury', 'performance', 'tactical', 'penalty'], 
      required: true 
    }
  ]
}
```

### 10. TournamentYears Collection
**Priority**: Low
**Dependencies**: Teams, Players

```typescript
// src/collections/TournamentYears/index.ts
{
  slug: 'tournamentYears',
  fields: [
    { name: 'year', type: 'number', required: true, unique: true },
    { name: 'champion', type: 'relationship', relationTo: 'teams' },
    { name: 'runnerUp', type: 'relationship', relationTo: 'teams' },
    { name: 'mvp', type: 'relationship', relationTo: 'players' },
    { name: 'topScorer', type: 'relationship', relationTo: 'players' },
    { name: 'teams', type: 'relationship', relationTo: 'teams', hasMany: true },
    { name: 'stats', type: 'json' },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true }
  ]
}
```

### 11. TeamSubmissions Collection
**Priority**: Medium
**Dependencies**: None

```typescript
// src/collections/TeamSubmissions/index.ts
{
  slug: 'teamSubmissions',
  fields: [
    { name: 'teamName', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'province', type: 'text', required: true },
    { name: 'captainName', type: 'text', required: true },
    { name: 'captainEmail', type: 'email', required: true },
    { name: 'captainPhone', type: 'text', required: true },
    { name: 'alternateContact', type: 'group', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'phone', type: 'text', required: true }
    ]},
    { name: 'estimatedRosterSize', type: 'number', required: true },
    { name: 'additionalInfo', type: 'textarea' },
    { name: 'status', type: 'select', 
      options: ['pending', 'approved', 'rejected'], 
      defaultValue: 'pending',
      required: true 
    }
  ]
}
```

## Implementation Notes

### Access Control
Each collection should implement proper access control:
- Public read access for tournament data (teams, players, games, stats)
- Authenticated create/update/delete for admin users
- Special permissions for scorekeeper role on game-related collections

### Hooks
Implement the following hooks:
- `beforeChange` on Games to calculate game points
- `afterChange` on Goals/Penalties to update game scores
- `beforeValidate` on Players to ensure jersey numbers are unique per team

### Virtual Fields
Add computed fields for:
- Player statistics (goals, assists, points, PIMs)
- Team statistics (wins, losses, goals for/against)
- Goalie statistics (saves, save percentage)

### Indexes
Create database indexes on:
- `games.gameNumber`
- `players.team + jerseyNumber`
- `goals.game`
- `penalties.game`
- All relationship fields

## Testing Requirements
- Unit tests for all validation logic
- Integration tests for collection hooks
- Ensure proper cascade deletes
- Test access control for each role

## Performance Considerations
- Implement pagination for all list queries
- Add caching for frequently accessed data
- Optimize relationship queries
- Consider denormalizing some statistics for performance