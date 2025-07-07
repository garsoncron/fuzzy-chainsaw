import type { Meta, StoryObj } from '@storybook/react'
import { StandingsTable } from './StandingsTable'
import { mockGames, mockTeams } from '@/stories/fixtures'

// Create extended mock data for comprehensive standings scenarios
const createMockGame = (overrides: any) => ({
  ...mockGames[0],
  ...overrides,
})

const createMockTeam = (overrides: any) => ({
  ...mockTeams[0],
  ...overrides,
})

// Full tournament schedule with completed games
const standingsGames = [
  // Day 1 completed games
  createMockGame({
    id: 'game-1',
    gameNumber: '1',
    status: 'final',
    homeTeam: mockTeams[0], // Calgary Bears
    awayTeam: mockTeams[1], // Edmonton Storm
    homeScore: 12,
    awayScore: 8,
    totalGamePoints: { home: 4.5, away: 0.5 },
    periodPoints: {
      period1Home: 1, period1Away: 0,
      period2Home: 1, period2Away: 0.5,
      period3Home: 0.5, period3Away: 0,
    },
  }),
  createMockGame({
    id: 'game-2',
    gameNumber: '2',
    status: 'final',
    homeTeam: mockTeams[2], // Vancouver Thunder
    awayTeam: mockTeams[3], // Saskatoon Blazers
    homeScore: 9,
    awayScore: 11,
    totalGamePoints: { home: 1.5, away: 3.5 },
    periodPoints: {
      period1Home: 0.5, period1Away: 0.5,
      period2Home: 0, period2Away: 1,
      period3Home: 1, period3Away: 0,
    },
  }),
  createMockGame({
    id: 'game-3',
    gameNumber: '3',
    status: 'final',
    homeTeam: mockTeams[4], // Winnipeg Warriors
    awayTeam: mockTeams[5], // Regina Riders
    homeScore: 7,
    awayScore: 7,
    totalGamePoints: { home: 2.5, away: 2.5 },
    periodPoints: {
      period1Home: 1, period1Away: 0,
      period2Home: 0.5, period2Away: 0.5,
      period3Home: 0, period3Away: 1,
    },
  }),
  
  // Day 2 completed games
  createMockGame({
    id: 'game-4',
    gameNumber: '4',
    status: 'final',
    homeTeam: mockTeams[0], // Calgary Bears
    awayTeam: mockTeams[2], // Vancouver Thunder
    homeScore: 15,
    awayScore: 6,
    totalGamePoints: { home: 5.0, away: 0.0 },
    periodPoints: {
      period1Home: 1, period1Away: 0,
      period2Home: 1, period2Away: 0,
      period3Home: 1, period3Away: 0,
    },
  }),
  createMockGame({
    id: 'game-5',
    gameNumber: '5',
    status: 'final',
    homeTeam: mockTeams[1], // Edmonton Storm
    awayTeam: mockTeams[3], // Saskatoon Blazers
    homeScore: 10,
    awayScore: 8,
    totalGamePoints: { home: 3.5, away: 1.5 },
    periodPoints: {
      period1Home: 0.5, period1Away: 0.5,
      period2Home: 1, period2Away: 0,
      period3Home: 0.5, period3Away: 0.5,
    },
  }),
  createMockGame({
    id: 'game-6',
    gameNumber: '6',
    status: 'final',
    homeTeam: mockTeams[4], // Winnipeg Warriors
    awayTeam: mockTeams[6], // Toronto Titans
    homeScore: 4,
    awayScore: 13,
    totalGamePoints: { home: 0.5, away: 4.5 },
    periodPoints: {
      period1Home: 0, period1Away: 1,
      period2Home: 0.5, period2Away: 0.5,
      period3Home: 0, period3Away: 1,
    },
  }),
  
  // Day 3 completed games
  createMockGame({
    id: 'game-7',
    gameNumber: '7',
    status: 'final',
    homeTeam: mockTeams[0], // Calgary Bears
    awayTeam: mockTeams[7], // Montreal Mavericks
    homeScore: 8,
    awayScore: 9,
    totalGamePoints: { home: 1.0, away: 4.0 },
    periodPoints: {
      period1Home: 0, period1Away: 1,
      period2Home: 0, period2Away: 1,
      period3Home: 1, period3Away: 0,
    },
  }),
  createMockGame({
    id: 'game-8',
    gameNumber: '8',
    status: 'final',
    homeTeam: mockTeams[1], // Edmonton Storm
    awayTeam: mockTeams[5], // Regina Riders
    homeScore: 11,
    awayScore: 5,
    totalGamePoints: { home: 4.5, away: 0.5 },
    periodPoints: {
      period1Home: 1, period1Away: 0,
      period2Home: 1, period2Away: 0,
      period3Home: 0.5, period3Away: 0.5,
    },
  }),
  
  // Current live games
  createMockGame({
    id: 'game-9',
    gameNumber: '9',
    status: 'live',
    homeTeam: mockTeams[2], // Vancouver Thunder
    awayTeam: mockTeams[4], // Winnipeg Warriors
    homeScore: 5,
    awayScore: 3,
    currentPeriod: '2',
    periodTimeRemaining: 420,
  }),
  
  // Scheduled games
  createMockGame({
    id: 'game-10',
    gameNumber: '10',
    status: 'scheduled',
    homeTeam: mockTeams[3], // Saskatoon Blazers
    awayTeam: mockTeams[6], // Toronto Titans
    homeScore: 0,
    awayScore: 0,
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  }),
]

// Extended mock teams with 8 teams
const standingsTeams = [
  createMockTeam({
    id: 'team-1',
    name: 'Calgary Bears',
    city: 'Calgary',
    province: 'Alberta',
    slug: 'calgary-bears',
  }),
  createMockTeam({
    id: 'team-2',
    name: 'Edmonton Storm',
    city: 'Edmonton',
    province: 'Alberta',
    slug: 'edmonton-storm',
  }),
  createMockTeam({
    id: 'team-3',
    name: 'Vancouver Thunder',
    city: 'Vancouver',
    province: 'British Columbia',
    slug: 'vancouver-thunder',
  }),
  createMockTeam({
    id: 'team-4',
    name: 'Saskatoon Blazers',
    city: 'Saskatoon',
    province: 'Saskatchewan',
    slug: 'saskatoon-blazers',
  }),
  createMockTeam({
    id: 'team-5',
    name: 'Winnipeg Warriors',
    city: 'Winnipeg',
    province: 'Manitoba',
    slug: 'winnipeg-warriors',
  }),
  createMockTeam({
    id: 'team-6',
    name: 'Regina Riders',
    city: 'Regina',
    province: 'Saskatchewan',
    slug: 'regina-riders',
  }),
  createMockTeam({
    id: 'team-7',
    name: 'Toronto Titans',
    city: 'Toronto',
    province: 'Ontario',
    slug: 'toronto-titans',
  }),
  createMockTeam({
    id: 'team-8',
    name: 'Montreal Mavericks',
    city: 'Montreal',
    province: 'Quebec',
    slug: 'montreal-mavericks',
  }),
]

const meta: Meta<typeof StandingsTable> = {
  title: 'Tournament/StandingsTable',
  component: StandingsTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Tournament standings table implementing the 5-point scoring system with comprehensive statistics
and sorting capabilities. Features real-time updates, tiebreaker rules, and trend analysis.

### Features
- **5-Point System**: 2 points for game win, 1 point per period win, 0.5 per period tie
- **Comprehensive Stats**: Goals, averages, penalty minutes, recent form
- **Sortable Columns**: Click any column header to sort
- **Tiebreaker Rules**: Tournament points → goal average → penalty minutes
- **Visual Indicators**: Last 5 games, trend arrows, champion trophy
- **Responsive Design**: Horizontal scroll on mobile devices

### Tournament System
The standings use the official 5-point system:
- **Game Win**: 2 points
- **Game Tie**: 1 point
- **Period Win**: 1 point
- **Period Tie**: 0.5 points
- **Maximum per game**: 5 points

### Tiebreaker Rules
When teams are tied in tournament points:
1. Head-to-head tournament points (not implemented)
2. Goal average (GF ÷ (GF + GA))
3. Fewest penalty minutes

### Statistics
- **GP**: Games Played
- **W/L/T**: Wins, Losses, Ties
- **PTS**: Tournament Points
- **GF/GA**: Goals For/Against
- **+/-**: Goal Differential
- **GA%**: Goal Average percentage
- **Last 5**: Recent game results (●W ●L ●T)
- **Trend**: Performance direction (↑↓→)
        `,
      },
    },
  },
  argTypes: {
    games: {
      description: 'Array of tournament games with teams populated',
    },
    teams: {
      description: 'Array of tournament teams',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StandingsTable>

// Complete standings table
export const Default: Story = {
  args: {
    games: standingsGames,
    teams: standingsTeams,
  },
}

// Early season standings (fewer games)
export const EarlySeason: Story = {
  name: 'Early Season',
  args: {
    games: standingsGames.slice(0, 4), // First 4 games only
    teams: standingsTeams,
  },
}

// Mid-season standings
export const MidSeason: Story = {
  name: 'Mid Season',
  args: {
    games: standingsGames.slice(0, 7), // First 7 games
    teams: standingsTeams,
  },
}

// Close race scenario
export const CloseRace: Story = {
  name: 'Close Championship Race',
  args: {
    games: [
      // Create a scenario where top teams are very close
      createMockGame({
        id: 'close-1',
        gameNumber: '15',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[1],
        homeScore: 8,
        awayScore: 8,
        totalGamePoints: { home: 2.5, away: 2.5 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 0.5, period2Away: 0.5,
          period3Home: 0, period3Away: 1,
        },
      }),
      createMockGame({
        id: 'close-2',
        gameNumber: '16',
        status: 'final',
        homeTeam: standingsTeams[2],
        awayTeam: standingsTeams[3],
        homeScore: 9,
        awayScore: 8,
        totalGamePoints: { home: 2.5, away: 2.5 },
        periodPoints: {
          period1Home: 0.5, period1Away: 0.5,
          period2Home: 0.5, period2Away: 0.5,
          period3Home: 0.5, period3Away: 0.5,
        },
      }),
      createMockGame({
        id: 'close-3',
        gameNumber: '17',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[2],
        homeScore: 7,
        awayScore: 6,
        totalGamePoints: { home: 3.0, away: 2.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 0, period2Away: 1,
          period3Home: 0, period3Away: 1,
        },
      }),
    ],
    teams: standingsTeams.slice(0, 4), // Top 4 teams only
  },
}

// Dominant leader scenario
export const DominantLeader: Story = {
  name: 'Dominant Leader',
  args: {
    games: [
      // Calgary Bears dominating
      createMockGame({
        id: 'dom-1',
        gameNumber: '1',
        status: 'final',
        homeTeam: standingsTeams[0], // Calgary Bears
        awayTeam: standingsTeams[1],
        homeScore: 15,
        awayScore: 3,
        totalGamePoints: { home: 5.0, away: 0.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 1, period3Away: 0,
        },
      }),
      createMockGame({
        id: 'dom-2',
        gameNumber: '2',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[2],
        homeScore: 18,
        awayScore: 4,
        totalGamePoints: { home: 5.0, away: 0.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 1, period3Away: 0,
        },
      }),
      createMockGame({
        id: 'dom-3',
        gameNumber: '3',
        status: 'final',
        homeTeam: standingsTeams[1],
        awayTeam: standingsTeams[2],
        homeScore: 8,
        awayScore: 7,
        totalGamePoints: { home: 2.5, away: 2.5 },
        periodPoints: {
          period1Home: 0.5, period1Away: 0.5,
          period2Home: 1, period2Away: 0,
          period3Home: 0, period3Away: 1,
        },
      }),
    ],
    teams: standingsTeams.slice(0, 3),
  },
}

// High-scoring tournament
export const HighScoringTournament: Story = {
  name: 'High Scoring Tournament',
  args: {
    games: [
      createMockGame({
        id: 'high-1',
        gameNumber: '1',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[1],
        homeScore: 22,
        awayScore: 19,
        totalGamePoints: { home: 3.5, away: 1.5 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 0.5, period2Away: 0.5,
          period3Home: 0, period3Away: 1,
        },
      }),
      createMockGame({
        id: 'high-2',
        gameNumber: '2',
        status: 'final',
        homeTeam: standingsTeams[2],
        awayTeam: standingsTeams[3],
        homeScore: 25,
        awayScore: 18,
        totalGamePoints: { home: 4.5, away: 0.5 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 0.5, period3Away: 0.5,
        },
      }),
    ],
    teams: standingsTeams.slice(0, 4),
  },
}

// Defensive tournament (low scoring)
export const DefensiveTournament: Story = {
  name: 'Defensive Tournament',
  args: {
    games: [
      createMockGame({
        id: 'low-1',
        gameNumber: '1',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[1],
        homeScore: 4,
        awayScore: 2,
        totalGamePoints: { home: 4.0, away: 1.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 0, period3Away: 1,
        },
      }),
      createMockGame({
        id: 'low-2',
        gameNumber: '2',
        status: 'final',
        homeTeam: standingsTeams[2],
        awayTeam: standingsTeams[3],
        homeScore: 3,
        awayScore: 1,
        totalGamePoints: { home: 4.5, away: 0.5 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 0.5, period3Away: 0.5,
        },
      }),
    ],
    teams: standingsTeams.slice(0, 4),
  },
}

// Many ties scenario
export const ManyTies: Story = {
  name: 'Tournament with Many Ties',
  args: {
    games: [
      createMockGame({
        id: 'tie-1',
        gameNumber: '1',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[1],
        homeScore: 6,
        awayScore: 6,
        totalGamePoints: { home: 2.5, away: 2.5 },
        periodPoints: {
          period1Home: 0.5, period1Away: 0.5,
          period2Home: 1, period2Away: 0,
          period3Home: 0, period3Away: 1,
        },
      }),
      createMockGame({
        id: 'tie-2',
        gameNumber: '2',
        status: 'final',
        homeTeam: standingsTeams[2],
        awayTeam: standingsTeams[3],
        homeScore: 8,
        awayScore: 8,
        totalGamePoints: { home: 3.0, away: 2.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 0, period3Away: 1,
        },
      }),
      createMockGame({
        id: 'tie-3',
        gameNumber: '3',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[2],
        homeScore: 5,
        awayScore: 5,
        totalGamePoints: { home: 1.5, away: 3.5 },
        periodPoints: {
          period1Home: 0, period1Away: 1,
          period2Home: 0.5, period2Away: 0.5,
          period3Home: 0, period3Away: 1,
        },
      }),
    ],
    teams: standingsTeams.slice(0, 4),
  },
}

// Perfect season scenario
export const PerfectSeason: Story = {
  name: 'Perfect Season Team',
  args: {
    games: [
      createMockGame({
        id: 'perfect-1',
        gameNumber: '1',
        status: 'final',
        homeTeam: standingsTeams[0], // Calgary Bears undefeated
        awayTeam: standingsTeams[1],
        homeScore: 12,
        awayScore: 8,
        totalGamePoints: { home: 5.0, away: 0.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 1, period3Away: 0,
        },
      }),
      createMockGame({
        id: 'perfect-2',
        gameNumber: '2',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[2],
        homeScore: 10,
        awayScore: 7,
        totalGamePoints: { home: 5.0, away: 0.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 1, period3Away: 0,
        },
      }),
      createMockGame({
        id: 'perfect-3',
        gameNumber: '3',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[3],
        homeScore: 14,
        awayScore: 5,
        totalGamePoints: { home: 5.0, away: 0.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 1, period3Away: 0,
        },
      }),
    ],
    teams: standingsTeams.slice(0, 4),
  },
}

// Team with poor record
export const StrugglingSeason: Story = {
  name: 'Struggling Team',
  args: {
    games: [
      createMockGame({
        id: 'struggle-1',
        gameNumber: '1',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[1], // Edmonton struggling
        homeScore: 15,
        awayScore: 3,
        totalGamePoints: { home: 5.0, away: 0.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 1, period3Away: 0,
        },
      }),
      createMockGame({
        id: 'struggle-2',
        gameNumber: '2',
        status: 'final',
        homeTeam: standingsTeams[2],
        awayTeam: standingsTeams[1],
        homeScore: 12,
        awayScore: 2,
        totalGamePoints: { home: 5.0, away: 0.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 1, period3Away: 0,
        },
      }),
      createMockGame({
        id: 'struggle-3',
        gameNumber: '3',
        status: 'final',
        homeTeam: standingsTeams[1],
        awayTeam: standingsTeams[3],
        homeScore: 4,
        awayScore: 11,
        totalGamePoints: { home: 0.5, away: 4.5 },
        periodPoints: {
          period1Home: 0, period1Away: 1,
          period2Home: 0.5, period2Away: 0.5,
          period3Home: 0, period3Away: 1,
        },
      }),
    ],
    teams: standingsTeams.slice(0, 4),
  },
}

// Empty standings (no games played)
export const EmptyStandings: Story = {
  name: 'No Games Played',
  args: {
    games: [],
    teams: standingsTeams.slice(0, 4),
  },
}

// Single game played
export const SingleGame: Story = {
  name: 'Single Game Played',
  args: {
    games: [standingsGames[0]],
    teams: standingsTeams.slice(0, 4),
  },
}

// Small tournament (4 teams)
export const SmallTournament: Story = {
  name: 'Small Tournament (4 Teams)',
  args: {
    games: standingsGames.slice(0, 6),
    teams: standingsTeams.slice(0, 4),
  },
}

// Large tournament (8 teams) 
export const LargeTournament: Story = {
  name: 'Large Tournament (8 Teams)',
  args: {
    games: standingsGames,
    teams: standingsTeams,
  },
}

// Mobile responsive
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    games: standingsGames.slice(0, 6),
    teams: standingsTeams.slice(0, 4),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Tablet view
export const Tablet: Story = {
  name: 'Tablet View',
  args: {
    games: standingsGames.slice(0, 8),
    teams: standingsTeams.slice(0, 6),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

// Tournament homepage integration
export const TournamentHomepage: Story = {
  name: 'Tournament Homepage Layout',
  args: {
    games: standingsGames,
    teams: standingsTeams,
    className: 'max-w-6xl mx-auto',
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-western text-primary-brown text-center mb-2">
            Cowtown Showdown
          </h1>
          <p className="text-center text-muted-foreground">
            Tournament Standings
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}

// Sorting demonstration
export const SortingDemo: Story = {
  name: 'Sorting Example',
  args: {
    games: standingsGames.slice(0, 8),
    teams: standingsTeams.slice(0, 6),
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on any column header to sort. Click again to reverse sort order.',
      },
    },
  },
}

// Tiebreaker scenario
export const TiebreakerScenario: Story = {
  name: 'Tiebreaker Example',
  args: {
    games: [
      // Teams tied in points but different goal averages
      createMockGame({
        id: 'tie-1',
        gameNumber: '1',
        status: 'final',
        homeTeam: standingsTeams[0], // Calgary: 10 pts, good goal average
        awayTeam: standingsTeams[3],
        homeScore: 12,
        awayScore: 4,
        totalGamePoints: { home: 5.0, away: 0.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 1, period3Away: 0,
        },
      }),
      createMockGame({
        id: 'tie-2',
        gameNumber: '2',
        status: 'final',
        homeTeam: standingsTeams[1], // Edmonton: 10 pts, poor goal average
        awayTeam: standingsTeams[2],
        homeScore: 8,
        awayScore: 15,
        totalGamePoints: { home: 0.0, away: 5.0 },
        periodPoints: {
          period1Home: 0, period1Away: 1,
          period2Home: 0, period2Away: 1,
          period3Home: 0, period3Away: 1,
        },
      }),
      createMockGame({
        id: 'tie-3',
        gameNumber: '3',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[1],
        homeScore: 6,
        awayScore: 6,
        totalGamePoints: { home: 2.5, away: 2.5 },
        periodPoints: {
          period1Home: 0.5, period1Away: 0.5,
          period2Home: 1, period2Away: 0,
          period3Home: 0, period3Away: 1,
        },
      }),
      createMockGame({
        id: 'tie-4',
        gameNumber: '4',
        status: 'final',
        homeTeam: standingsTeams[0],
        awayTeam: standingsTeams[2],
        homeScore: 5,
        awayScore: 7,
        totalGamePoints: { home: 2.5, away: 2.5 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 0.5, period2Away: 0.5,
          period3Home: 0, period3Away: 1,
        },
      }),
      createMockGame({
        id: 'tie-5',
        gameNumber: '5',
        status: 'final',
        homeTeam: standingsTeams[1],
        awayTeam: standingsTeams[3],
        homeScore: 9,
        awayScore: 3,
        totalGamePoints: { home: 5.0, away: 0.0 },
        periodPoints: {
          period1Home: 1, period1Away: 0,
          period2Home: 1, period2Away: 0,
          period3Home: 1, period3Away: 0,
        },
      }),
    ],
    teams: standingsTeams.slice(0, 4),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates tiebreaker rules when teams have equal tournament points.',
      },
    },
  },
}

// Loading state simulation
export const LoadingState: Story = {
  name: 'Loading State',
  render: () => (
    <div className="animate-pulse">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-8 mr-2"></div>
          <div className="h-8 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4">
              {Array.from({ length: 12 }, (_, j) => (
                <div key={j} className="h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
}

// Error state
export const ErrorState: Story = {
  name: 'Error State',
  render: () => (
    <div className="bg-white border border-red-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="h-6 w-6 text-red-500 mr-2">⚠️</div>
        <h3 className="text-lg font-western text-red-700">
          Unable to Load Standings
        </h3>
      </div>
      <p className="text-red-600 mb-4">
        There was an error loading the tournament standings. Please try again.
      </p>
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Retry
      </button>
    </div>
  ),
}