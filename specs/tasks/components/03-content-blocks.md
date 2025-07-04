# Component Task: Tournament Content Blocks for Payload CMS

## Overview
Create Payload CMS blocks specifically for tournament content management, allowing editors to build dynamic tournament pages.

## Tournament-Specific Blocks

### 1. Live Scoreboard Block
**File**: `src/blocks/LiveScoreboard/config.ts`
**Priority**: Critical

```typescript
import { Block } from 'payload/types'

export const LiveScoreboard: Block = {
  slug: 'liveScoreboard',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Live Scores',
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'compact',
      options: [
        { label: 'Compact', value: 'compact' },
        { label: 'Detailed', value: 'detailed' },
        { label: 'Mini', value: 'mini' },
      ],
    },
    {
      name: 'filterBy',
      type: 'select',
      options: [
        { label: 'All Games', value: 'all' },
        { label: 'Live Only', value: 'live' },
        { label: 'Today', value: 'today' },
        { label: 'Day 1', value: 'day1' },
        { label: 'Day 2', value: 'day2' },
        { label: 'Day 3', value: 'day3' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'autoRefresh',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'refreshInterval',
      type: 'number',
      defaultValue: 5000,
      min: 1000,
      max: 60000,
      admin: {
        condition: (data) => data.autoRefresh,
        description: 'Refresh interval in milliseconds',
      },
    },
  ],
}
```

**Component**: `src/blocks/LiveScoreboard/Component.tsx`
```typescript
export const LiveScoreboardBlock: React.FC<any> = ({
  title,
  variant,
  filterBy,
  autoRefresh,
  refreshInterval,
}) => {
  const games = useFilteredGames(filterBy)
  
  return (
    <section className="my-8">
      {title && <h2 className="western-heading text-3xl mb-6">{title}</h2>}
      <Scoreboard
        games={games}
        variant={variant}
        autoRefresh={autoRefresh}
        refreshInterval={refreshInterval}
      />
    </section>
  )
}
```

### 2. Standings Table Block
**File**: `src/blocks/StandingsTable/config.ts`
**Priority**: Critical

```typescript
export const StandingsTableBlock: Block = {
  slug: 'standingsTable',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Tournament Standings',
    },
    {
      name: 'division',
      type: 'select',
      required: true,
      options: [
        { label: 'Gold Division', value: 'gold' },
        { label: 'Blue Division', value: 'blue' },
        { label: 'Both Divisions', value: 'both' },
      ],
    },
    {
      name: 'showPointsBreakdown',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show 5-point system breakdown',
    },
    {
      name: 'showTiebreakers',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show tiebreaker information',
    },
    {
      name: 'highlightTopTeams',
      type: 'number',
      defaultValue: 2,
      min: 0,
      max: 4,
      label: 'Number of playoff spots to highlight',
    },
  ],
}
```

### 3. Team Grid Block
**File**: `src/blocks/TeamGrid/config.ts`
**Priority**: High

```typescript
export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Tournament Teams',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'teams',
      type: 'relationship',
      relationTo: 'teams',
      hasMany: true,
      admin: {
        description: 'Leave empty to show all teams',
      },
    },
    {
      name: 'showDivisionBadge',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showStats',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show team win/loss record',
    },
    {
      name: 'cardStyle',
      type: 'select',
      defaultValue: 'wanted',
      options: [
        { label: 'Wanted Poster', value: 'wanted' },
        { label: 'Wood Frame', value: 'wood' },
        { label: 'Modern', value: 'modern' },
      ],
    },
  ],
}
```

### 4. Game Schedule Block
**File**: `src/blocks/GameSchedule/config.ts`
**Priority**: High

```typescript
export const GameScheduleBlock: Block = {
  slug: 'gameSchedule',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Game Schedule',
    },
    {
      name: 'view',
      type: 'select',
      defaultValue: 'list',
      options: [
        { label: 'List View', value: 'list' },
        { label: 'Calendar View', value: 'calendar' },
        { label: 'Timeline View', value: 'timeline' },
      ],
    },
    {
      name: 'filterOptions',
      type: 'group',
      fields: [
        {
          name: 'day',
          type: 'select',
          options: [
            { label: 'All Days', value: 'all' },
            { label: 'Day 1', value: '1' },
            { label: 'Day 2', value: '2' },
            { label: 'Day 3', value: '3' },
          ],
        },
        {
          name: 'gameType',
          type: 'select',
          options: [
            { label: 'All Games', value: 'all' },
            { label: 'Pool Games', value: 'pool' },
            { label: 'Playoff Games', value: 'playoff' },
            { label: 'Medal Games', value: 'medal' },
          ],
        },
        {
          name: 'team',
          type: 'relationship',
          relationTo: 'teams',
        },
      ],
    },
    {
      name: 'showField',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'enableExport',
      type: 'checkbox',
      defaultValue: true,
      label: 'Allow calendar export',
    },
  ],
}
```

### 5. Player Stats Leaderboard Block
**File**: `src/blocks/PlayerStatsLeaderboard/config.ts`
**Priority**: High

```typescript
export const PlayerStatsLeaderboardBlock: Block = {
  slug: 'playerStatsLeaderboard',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Tournament Leaders',
    },
    {
      name: 'statCategories',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          options: [
            { label: 'Goals', value: 'goals' },
            { label: 'Assists', value: 'assists' },
            { label: 'Points', value: 'points' },
            { label: 'Penalty Minutes', value: 'pim' },
            { label: 'Plus/Minus', value: 'plusMinus' },
          ],
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 5,
          min: 3,
          max: 20,
        },
        {
          name: 'showTeamBadge',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'tabs',
      options: [
        { label: 'Tabs', value: 'tabs' },
        { label: 'Side by Side', value: 'grid' },
        { label: 'Accordion', value: 'accordion' },
      ],
    },
  ],
}
```

### 6. Tournament Bracket Block
**File**: `src/blocks/TournamentBracket/config.ts`
**Priority**: Medium

```typescript
export const TournamentBracketBlock: Block = {
  slug: 'tournamentBracket',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Playoff Bracket',
    },
    {
      name: 'bracketType',
      type: 'select',
      defaultValue: 'single',
      options: [
        { label: 'Single Elimination', value: 'single' },
        { label: 'Pool to Playoff', value: 'poolToPlayoff' },
      ],
    },
    {
      name: 'showPoolStandings',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: (data) => data.bracketType === 'poolToPlayoff',
      },
    },
    {
      name: 'highlightPath',
      type: 'relationship',
      relationTo: 'teams',
      admin: {
        description: 'Highlight the path for a specific team',
      },
    },
    {
      name: 'interactive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable hover effects and tooltips',
    },
  ],
}
```

### 7. Game Highlights Block
**File**: `src/blocks/GameHighlights/config.ts`
**Priority**: Medium

```typescript
export const GameHighlightsBlock: Block = {
  slug: 'gameHighlights',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Game Highlights',
    },
    {
      name: 'games',
      type: 'relationship',
      relationTo: 'games',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select specific games to highlight',
      },
    },
    {
      name: 'displayType',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Game Cards', value: 'cards' },
        { label: 'Detailed Box Scores', value: 'boxScores' },
        { label: 'Compact List', value: 'list' },
      ],
    },
    {
      name: 'showThreeStars',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showVideoLinks',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
```

### 8. Tournament Info Block
**File**: `src/blocks/TournamentInfo/config.ts`
**Priority**: Low

```typescript
export const TournamentInfoBlock: Block = {
  slug: 'tournamentInfo',
  fields: [
    {
      name: 'infoType',
      type: 'select',
      required: true,
      options: [
        { label: 'Tournament Rules', value: 'rules' },
        { label: 'Venue Information', value: 'venue' },
        { label: 'Important Dates', value: 'dates' },
        { label: 'Contact Information', value: 'contact' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'parchment',
      options: [
        { label: 'Parchment', value: 'parchment' },
        { label: 'Wood Frame', value: 'wood' },
        { label: 'Modern', value: 'modern' },
      ],
    },
    {
      name: 'collapsible',
      type: 'checkbox',
      defaultValue: false,
      label: 'Make content collapsible',
    },
  ],
}
```

### 9. Three Stars Display Block
**File**: `src/blocks/ThreeStarsDisplay/config.ts`
**Priority**: Low

```typescript
export const ThreeStarsDisplayBlock: Block = {
  slug: 'threeStarsDisplay',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Three Stars of the Game',
    },
    {
      name: 'game',
      type: 'relationship',
      relationTo: 'games',
      required: true,
      filterOptions: {
        status: { equals: 'final' },
      },
    },
    {
      name: 'displayStyle',
      type: 'select',
      defaultValue: 'podium',
      options: [
        { label: 'Podium Style', value: 'podium' },
        { label: 'Cards', value: 'cards' },
        { label: 'Banner', value: 'banner' },
      ],
    },
    {
      name: 'showStats',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show player stats for the game',
    },
  ],
}
```

### 10. Sponsor Recognition Block
**File**: `src/blocks/SponsorRecognition/config.ts`
**Priority**: Low

```typescript
export const SponsorRecognitionBlock: Block = {
  slug: 'sponsorRecognition',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Tournament Sponsors',
    },
    {
      name: 'sponsors',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'tier',
          type: 'select',
          options: [
            { label: 'Title Sponsor', value: 'title' },
            { label: 'Gold Sponsor', value: 'gold' },
            { label: 'Silver Sponsor', value: 'silver' },
            { label: 'Bronze Sponsor', value: 'bronze' },
          ],
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'List by Tier', value: 'tiered' },
      ],
    },
  ],
}
```

## Block Registration

**File**: `src/blocks/index.ts`
```typescript
import { LiveScoreboard } from './LiveScoreboard/config'
import { StandingsTableBlock } from './StandingsTable/config'
import { TeamGridBlock } from './TeamGrid/config'
import { GameScheduleBlock } from './GameSchedule/config'
import { PlayerStatsLeaderboardBlock } from './PlayerStatsLeaderboard/config'
import { TournamentBracketBlock } from './TournamentBracket/config'
import { GameHighlightsBlock } from './GameHighlights/config'
import { TournamentInfoBlock } from './TournamentInfo/config'
import { ThreeStarsDisplayBlock } from './ThreeStarsDisplay/config'
import { SponsorRecognitionBlock } from './SponsorRecognition/config'

export const tournamentBlocks = [
  LiveScoreboard,
  StandingsTableBlock,
  TeamGridBlock,
  GameScheduleBlock,
  PlayerStatsLeaderboardBlock,
  TournamentBracketBlock,
  GameHighlightsBlock,
  TournamentInfoBlock,
  ThreeStarsDisplayBlock,
  SponsorRecognitionBlock,
]
```

## Admin UI Enhancements

### Block Preview Components
Each block should have a preview component for the admin panel:

```typescript
// src/blocks/LiveScoreboard/Preview.tsx
export const LiveScoreboardPreview: React.FC = ({ data }) => {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="font-bold mb-2">Live Scoreboard</h3>
      <p className="text-sm text-gray-600">
        Variant: {data.variant} | Filter: {data.filterBy}
      </p>
      <div className="mt-2 text-xs">
        {data.autoRefresh ? `Auto-refresh every ${data.refreshInterval}ms` : 'Manual refresh'}
      </div>
    </div>
  )
}
```

## Performance Considerations

1. **Lazy Loading**: Load block components only when needed
2. **Data Fetching**: Use React Query for efficient data management
3. **Caching**: Implement proper caching strategies for tournament data
4. **SSR/SSG**: Ensure blocks work with Next.js rendering strategies

## Testing Requirements

1. **Unit Tests**: Test block configuration and validation
2. **Component Tests**: Test block rendering with various props
3. **Integration Tests**: Test blocks within page context
4. **Visual Tests**: Storybook stories for all block variants
5. **Performance Tests**: Measure block rendering performance