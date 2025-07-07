import type { Meta, StoryObj } from '@storybook/react'
import { Scoreboard } from './Scoreboard'
import { mockGames, mockTeams } from '@/stories/fixtures'

// Create extended mock games for different scenarios
const createMockGame = (overrides: any) => ({
  ...mockGames[0],
  ...overrides,
})

const scoreboardGames = [
  // Live games
  createMockGame({
    id: 'live-1',
    gameNumber: '5',
    status: 'live',
    currentPeriod: '2',
    periodTimeRemaining: 420, // 7:00
    homeScore: 8,
    awayScore: 5,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    totalGamePoints: { home: 3.5, away: 1.5 },
  }),
  createMockGame({
    id: 'live-2',
    gameNumber: '6',
    status: 'live',
    currentPeriod: '1',
    periodTimeRemaining: 300, // 5:00
    homeScore: 3,
    awayScore: 2,
    homeTeam: mockTeams[1],
    awayTeam: mockTeams[2],
    totalGamePoints: { home: 1.0, away: 0.5 },
  }),
  
  // Overtime game
  createMockGame({
    id: 'ot-1',
    gameNumber: '7',
    status: 'overtime',
    currentPeriod: 'OT1',
    periodTimeRemaining: 240, // 4:00
    homeScore: 9,
    awayScore: 9,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[2],
    totalGamePoints: { home: 2.5, away: 2.5 },
  }),
  
  // Upcoming games
  createMockGame({
    id: 'upcoming-1',
    gameNumber: '8',
    status: 'scheduled',
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    homeScore: 0,
    awayScore: 0,
    homeTeam: mockTeams[1],
    awayTeam: mockTeams[0],
  }),
  createMockGame({
    id: 'upcoming-2',
    gameNumber: '9',
    status: 'scheduled',
    scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    homeScore: 0,
    awayScore: 0,
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[1],
  }),
  
  // Recent final games
  createMockGame({
    id: 'final-1',
    gameNumber: '3',
    status: 'final',
    scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    homeScore: 12,
    awayScore: 8,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[2],
    totalGamePoints: { home: 5.0, away: 0.0 },
    threeStars: {
      first: 'Connor McDavid',
      second: 'Leon Draisaitl',
      third: 'Stuart Skinner',
    },
  }),
  createMockGame({
    id: 'final-2',
    gameNumber: '4',
    status: 'final',
    scheduledTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    homeScore: 7,
    awayScore: 6,
    homeTeam: mockTeams[1],
    awayTeam: mockTeams[2],
    totalGamePoints: { home: 3.5, away: 1.5 },
    threeStars: {
      first: 'Quinn Hughes',
      second: 'Mike Smith',
      third: 'Leon Draisaitl',
    },
  }),
]

const meta: Meta<typeof Scoreboard> = {
  title: 'Tournament/Scoreboard',
  component: Scoreboard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The main tournament scoreboard component displaying live, upcoming, and recent games.
Features real-time updates, automatic categorization, and responsive design.

### Features
- **Live Games**: Active games with period timer and real-time scores
- **Upcoming Games**: Next scheduled games with start times
- **Recent Results**: Recently completed games with final scores
- **Auto-refresh**: Configurable refresh interval for live updates
- **Accessibility**: Live regions for screen reader updates
- **Performance**: Optimized for 500-900 concurrent users

### Real-time Updates
The scoreboard automatically categorizes games by status:
- **Live**: Currently active games (status: 'live' or 'overtime')
- **Upcoming**: Scheduled games in the future (shows next 3)
- **Recent**: Completed games from last 6 hours (shows last 2)

### Tournament Integration
- Displays 5-point tournament system scores
- Shows three stars for completed games
- Period-by-period live timing
- Support for overtime periods
        `,
      },
    },
  },
  argTypes: {
    games: {
      description: 'Array of tournament games to display',
    },
    autoRefresh: {
      control: 'boolean',
      description: 'Whether to automatically refresh game data',
    },
    refreshInterval: {
      control: 'number',
      description: 'Refresh interval in milliseconds',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Scoreboard>

// Full scoreboard with all game types
export const Default: Story = {
  args: {
    games: scoreboardGames,
    autoRefresh: false, // Disabled for Storybook
    refreshInterval: 5000,
  },
}

// Live games only
export const LiveGamesOnly: Story = {
  name: 'Live Games Only',
  args: {
    games: scoreboardGames.filter(game => 
      game.status === 'live' || game.status === 'overtime'
    ),
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Upcoming games only
export const UpcomingGamesOnly: Story = {
  name: 'Upcoming Games Only',
  args: {
    games: scoreboardGames.filter(game => game.status === 'scheduled'),
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Recent games only
export const RecentGamesOnly: Story = {
  name: 'Recent Results Only',
  args: {
    games: scoreboardGames.filter(game => game.status === 'final'),
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Single live game
export const SingleLiveGame: Story = {
  name: 'Single Live Game',
  args: {
    games: [scoreboardGames[0]], // First live game only
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Multiple live games
export const MultipleLiveGames: Story = {
  name: 'Multiple Live Games',
  args: {
    games: scoreboardGames.filter(game => game.status === 'live'),
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Overtime game scenario
export const OvertimeGame: Story = {
  name: 'Overtime Game',
  args: {
    games: [scoreboardGames.find(game => game.status === 'overtime')!],
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// High scoring games
export const HighScoringGames: Story = {
  name: 'High Scoring Games',
  args: {
    games: [
      createMockGame({
        id: 'high-1',
        gameNumber: '15',
        status: 'live',
        currentPeriod: '3',
        periodTimeRemaining: 180, // 3:00
        homeScore: 18,
        awayScore: 15,
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[1],
        totalGamePoints: { home: 4.5, away: 0.5 },
      }),
      createMockGame({
        id: 'high-2',
        gameNumber: '16',
        status: 'final',
        scheduledTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        homeScore: 22,
        awayScore: 19,
        homeTeam: mockTeams[1],
        awayTeam: mockTeams[2],
        totalGamePoints: { home: 5.0, away: 0.0 },
        threeStars: {
          first: 'Connor McDavid',
          second: 'Leon Draisaitl',
          third: 'Quinn Hughes',
        },
      }),
    ],
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Close games
export const CloseGames: Story = {
  name: 'Close/Tied Games',
  args: {
    games: [
      createMockGame({
        id: 'close-1',
        gameNumber: '10',
        status: 'live',
        currentPeriod: '3',
        periodTimeRemaining: 60, // 1:00 final minute
        homeScore: 8,
        awayScore: 8,
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[1],
        totalGamePoints: { home: 2.5, away: 2.5 },
      }),
      createMockGame({
        id: 'close-2',
        gameNumber: '11',
        status: 'final',
        scheduledTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        homeScore: 6,
        awayScore: 6,
        homeTeam: mockTeams[1],
        awayTeam: mockTeams[2],
        totalGamePoints: { home: 2.5, away: 2.5 },
      }),
    ],
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Medal games
export const MedalGames: Story = {
  name: 'Medal Games',
  args: {
    games: [
      createMockGame({
        id: 'medal-1',
        gameNumber: '21',
        gameType: 'medal',
        status: 'live',
        currentPeriod: '3',
        periodTimeRemaining: 300, // 5:00
        homeScore: 10,
        awayScore: 9,
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[1],
        totalGamePoints: { home: 4.0, away: 1.0 },
      }),
      createMockGame({
        id: 'medal-2',
        gameNumber: '22',
        gameType: 'medal',
        status: 'scheduled',
        scheduledTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        homeScore: 0,
        awayScore: 0,
        homeTeam: mockTeams[1],
        awayTeam: mockTeams[2],
      }),
    ],
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Empty state
export const EmptyState: Story = {
  name: 'No Games',
  args: {
    games: [],
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Fast refresh for testing
export const FastRefresh: Story = {
  name: 'Fast Refresh (Testing)',
  args: {
    games: [scoreboardGames[0]],
    autoRefresh: false, // Keep disabled for Storybook
    refreshInterval: 1000, // 1 second
  },
}

// Different periods
export const DifferentPeriods: Story = {
  name: 'Different Period States',
  args: {
    games: [
      createMockGame({
        id: 'p1',
        gameNumber: '12',
        status: 'live',
        currentPeriod: '1',
        periodTimeRemaining: 720, // 12:00 full period
        homeScore: 0,
        awayScore: 1,
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[1],
      }),
      createMockGame({
        id: 'p2',
        gameNumber: '13',
        status: 'live',
        currentPeriod: '2',
        periodTimeRemaining: 360, // 6:00 half period
        homeScore: 4,
        awayScore: 3,
        homeTeam: mockTeams[1],
        awayTeam: mockTeams[2],
      }),
      createMockGame({
        id: 'p3',
        gameNumber: '14',
        status: 'live',
        currentPeriod: '3',
        periodTimeRemaining: 120, // 2:00 final minutes
        homeScore: 7,
        awayScore: 6,
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[2],
      }),
    ],
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Championship scenario
export const ChampionshipDay: Story = {
  name: 'Championship Day',
  args: {
    games: [
      // Semi-final live
      createMockGame({
        id: 'semi',
        gameNumber: '21',
        gameType: 'medal',
        status: 'live',
        currentPeriod: '3',
        periodTimeRemaining: 180, // 3:00
        homeScore: 11,
        awayScore: 9,
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[1],
        totalGamePoints: { home: 4.5, away: 0.5 },
      }),
      // Championship final upcoming
      createMockGame({
        id: 'final',
        gameNumber: '22',
        gameType: 'medal',
        status: 'scheduled',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        homeScore: 0,
        awayScore: 0,
        homeTeam: mockTeams[0], // Winner of semi
        awayTeam: mockTeams[2], // Other semi winner
      }),
    ],
    autoRefresh: false,
    refreshInterval: 5000,
  },
}

// Mobile responsive
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    games: scoreboardGames.slice(0, 4), // Fewer games for mobile
    autoRefresh: false,
    refreshInterval: 5000,
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
    games: scoreboardGames,
    autoRefresh: false,
    refreshInterval: 5000,
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
    games: scoreboardGames,
    autoRefresh: false,
    refreshInterval: 5000,
    className: 'max-w-4xl mx-auto',
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
            Live Tournament Updates
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}

// Loading state simulation
export const LoadingState: Story = {
  name: 'Loading State',
  render: () => (
    <div className="scoreboard">
      <div className="mb-6">
        <h2 className="text-2xl font-western text-primary-brown mb-2">
          Live Scoreboard
        </h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <div className="animate-spin h-4 w-4 mr-2 rounded-full border-2 border-current border-t-transparent"></div>
          Loading games...
        </div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-8 bg-gray-200 rounded w-8"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-28"></div>
                  <div className="h-8 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

// Error state
export const ErrorState: Story = {
  name: 'Error State',
  render: () => (
    <div className="scoreboard">
      <div className="mb-6">
        <h2 className="text-2xl font-western text-primary-brown mb-2">
          Live Scoreboard
        </h2>
        <div className="flex items-center text-sm text-red-600">
          <div className="h-4 w-4 mr-2 rounded-full bg-red-500"></div>
          Connection error - retrying...
        </div>
      </div>
      
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-700 mb-4">Unable to load game data</p>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Retry
        </button>
      </div>
    </div>
  ),
}