import type { Meta, StoryObj } from '@storybook/react'
import { ScoreBoard } from './ScoreBoard'
import { mockTeams } from '@/stories/fixtures'

const meta: Meta<typeof ScoreBoard> = {
  title: 'Scorekeeper/ScoreBoard',
  component: ScoreBoard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Live scoreboard display component optimized for scorekeeper interfaces. Features real-time 
score updates, game status indicators, and clear team identification.

### Features
- **Live Updates**: Real-time score display with status indicators
- **Team Identity**: Clear team names, cities, and color coding
- **Game States**: Live, Final, Overtime, Pre-game status
- **Winner Highlighting**: Visual indication of winning team
- **Close Game Alert**: Special indicator for games within 2 points
- **Mobile Optimized**: Large touch targets and clear typography

### Game Status
- **Live**: Active game with green indicator
- **Final**: Completed game with blue indicator and winner highlight
- **Overtime**: Extended game with yellow indicator
- **Scheduled**: Pre-game status with gray indicator

### Visual Design
- Home team: Blue color scheme
- Away team: Red color scheme
- Winner highlight: Green ring and background
- Large, clear score display for visibility
        `,
      },
    },
  },
  argTypes: {
    homeTeam: {
      description: 'Home team object with name and city',
    },
    awayTeam: {
      description: 'Away team object with name and city',
    },
    homeScore: {
      control: 'number',
      description: 'Current home team score',
    },
    awayScore: {
      control: 'number',
      description: 'Current away team score',
    },
    currentPeriod: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 'OT1', 'OT2'],
      description: 'Current game period (0 = pre-game)',
    },
    gameStatus: {
      control: { type: 'select' },
      options: ['scheduled', 'live', 'final', 'overtime'],
      description: 'Current game status',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ScoreBoard>

// Basic game states
export const PreGame: Story = {
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 0,
    awayScore: 0,
    currentPeriod: 0,
    gameStatus: 'scheduled',
  },
}

export const LiveGame: Story = {
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 8,
    awayScore: 5,
    currentPeriod: 2,
    gameStatus: 'live',
  },
}

export const FinalGame: Story = {
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 12,
    awayScore: 8,
    currentPeriod: 3,
    gameStatus: 'final',
  },
}

export const OvertimeGame: Story = {
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 9,
    awayScore: 9,
    currentPeriod: 'OT1',
    gameStatus: 'overtime',
  },
}

// Scoring scenarios
export const CloseGame: Story = {
  name: 'Close Game (Live)',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 7,
    awayScore: 6,
    currentPeriod: 3,
    gameStatus: 'live',
  },
}

export const TiedGame: Story = {
  name: 'Tied Score',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 8,
    awayScore: 8,
    currentPeriod: 3,
    gameStatus: 'live',
  },
}

export const BlowoutGame: Story = {
  name: 'High Scoring Blowout',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 18,
    awayScore: 4,
    currentPeriod: 3,
    gameStatus: 'live',
  },
}

export const LowScoringGame: Story = {
  name: 'Defensive Battle',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 2,
    awayScore: 1,
    currentPeriod: 3,
    gameStatus: 'live',
  },
}

export const ScorelessGame: Story = {
  name: 'Scoreless in Progress',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 0,
    awayScore: 0,
    currentPeriod: 1,
    gameStatus: 'live',
  },
}

// Final game scenarios
export const HomeTeamWins: Story = {
  name: 'Home Team Victory',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 11,
    awayScore: 7,
    currentPeriod: 3,
    gameStatus: 'final',
  },
}

export const AwayTeamWins: Story = {
  name: 'Away Team Victory',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 6,
    awayScore: 10,
    currentPeriod: 3,
    gameStatus: 'final',
  },
}

export const TieFinal: Story = {
  name: 'Final Tie Game',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 9,
    awayScore: 9,
    currentPeriod: 3,
    gameStatus: 'final',
  },
}

export const OvertimeWin: Story = {
  name: 'Overtime Victory',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 8,
    awayScore: 7,
    currentPeriod: 'OT1',
    gameStatus: 'final',
  },
}

export const DoubleOvertimeFinal: Story = {
  name: 'Double Overtime Final',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 10,
    awayScore: 9,
    currentPeriod: 'OT2',
    gameStatus: 'final',
  },
}

// Period progression
export const Period1: Story = {
  name: 'First Period',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 3,
    awayScore: 2,
    currentPeriod: 1,
    gameStatus: 'live',
  },
}

export const Period2: Story = {
  name: 'Second Period',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 6,
    awayScore: 4,
    currentPeriod: 2,
    gameStatus: 'live',
  },
}

export const Period3: Story = {
  name: 'Third Period',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 8,
    awayScore: 7,
    currentPeriod: 3,
    gameStatus: 'live',
  },
}

// Team variations
export const LongTeamNames: Story = {
  name: 'Long Team Names',
  args: {
    homeTeam: {
      ...mockTeams[0],
      name: 'Calgary Metropolitan Roughnecks',
      city: 'Greater Calgary Area',
    },
    awayTeam: {
      ...mockTeams[1],
      name: 'Edmonton Professional Oil Kings',
      city: 'Edmonton Metropolitan',
    },
    homeScore: 7,
    awayScore: 5,
    currentPeriod: 2,
    gameStatus: 'live',
  },
}

export const MissingTeamData: Story = {
  name: 'Missing Team Data',
  args: {
    homeTeam: null,
    awayTeam: null,
    homeScore: 4,
    awayScore: 3,
    currentPeriod: 2,
    gameStatus: 'live',
  },
}

// Championship scenarios
export const ChampionshipGame: Story = {
  name: 'Championship Final',
  args: {
    homeTeam: {
      ...mockTeams[0],
      name: 'Calgary Bears',
      city: 'Calgary',
    },
    awayTeam: {
      ...mockTeams[1],
      name: 'Edmonton Storm',
      city: 'Edmonton',
    },
    homeScore: 12,
    awayScore: 11,
    currentPeriod: 3,
    gameStatus: 'final',
  },
}

export const ChampionshipOvertime: Story = {
  name: 'Championship Overtime',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 8,
    awayScore: 8,
    currentPeriod: 'OT1',
    gameStatus: 'overtime',
  },
}

// Medal game scenarios
export const MedalGameLive: Story = {
  name: 'Medal Game Live',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 9,
    awayScore: 8,
    currentPeriod: 3,
    gameStatus: 'live',
  },
}

// Responsive examples
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 8,
    awayScore: 6,
    currentPeriod: 2,
    gameStatus: 'live',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm mx-auto p-4">
        <Story />
      </div>
    ),
  ],
}

export const Tablet: Story = {
  name: 'Tablet View',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 10,
    awayScore: 7,
    currentPeriod: 3,
    gameStatus: 'live',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md mx-auto p-6">
        <Story />
      </div>
    ),
  ],
}

// Scorekeeper interface context
export const ScorekeeperInterface: Story = {
  name: 'Scorekeeper Dashboard View',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 6,
    awayScore: 4,
    currentPeriod: 2,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-100 p-6 min-h-screen">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary-brown">
            Scorekeeper Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Game 5 • Day 2 • Pool Play
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Story />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold mb-4">Game Controls</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-green-500 text-white p-3 rounded font-semibold">
                  Goal
                </button>
                <button className="bg-red-500 text-white p-3 rounded font-semibold">
                  Penalty
                </button>
                <button className="bg-blue-500 text-white p-3 rounded font-semibold">
                  Faceoff
                </button>
                <button className="bg-purple-500 text-white p-3 rounded font-semibold">
                  Shot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

// Animation demo (simulated)
export const LiveUpdates: Story = {
  name: 'Live Score Updates',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 8,
    awayScore: 7,
    currentPeriod: 3,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm font-medium text-yellow-800">
            ⚡ This component updates in real-time during live games
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}

// High contrast mode
export const HighContrast: Story = {
  name: 'High Contrast Mode',
  args: {
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 9,
    awayScore: 6,
    currentPeriod: 2,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-6 rounded">
        <div style={{ filter: 'contrast(1.5)' }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

// No teams assigned
export const EmptyState: Story = {
  name: 'No Teams Assigned',
  args: {
    homeTeam: null,
    awayTeam: null,
    homeScore: 0,
    awayScore: 0,
    currentPeriod: 0,
    gameStatus: 'scheduled',
  },
}