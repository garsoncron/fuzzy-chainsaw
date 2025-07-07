import type { Meta, StoryObj } from '@storybook/react'
import { GameCard } from './GameCard'
import { mockGames, mockTeams } from '@/stories/fixtures'

const meta: Meta<typeof GameCard> = {
  title: 'Tournament/GameCard',
  component: GameCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Individual game card component for displaying tournament games in schedules and scoreboards.
Features real-time status indicators, tournament points, and responsive design.

### Features
- **Real-time status**: Live, Final, Scheduled, Overtime indicators
- **Tournament points**: 5-point system display
- **Three stars**: Post-game recognition
- **Live streaming**: YouTube integration indicator
- **Responsive design**: Compact mode for mobile
- **Accessibility**: Semantic HTML and keyboard navigation

### Game States
- **Scheduled**: Upcoming games with time and teams
- **Live**: Active games with period time and scores
- **Final**: Completed games with final scores and three stars
- **Overtime**: Extended games with OT indicators

### Tournament System
The card displays tournament points using the 5-point system:
- 2 points for game win, 1 for tie
- 1 point per period win, 0.5 per period tie
- Maximum 5 points per game
        `,
      },
    },
  },
  argTypes: {
    game: {
      description: 'Game object with teams, scores, and status',
    },
    showDay: {
      control: 'boolean',
      description: 'Whether to display tournament day information',
    },
    showTournamentPoints: {
      control: 'boolean',
      description: 'Whether to display tournament points earned',
    },
    showThreeStars: {
      control: 'boolean',
      description: 'Whether to display three stars indicator',
    },
    compact: {
      control: 'boolean',
      description: 'Compact display mode for mobile',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
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
type Story = StoryObj<typeof GameCard>

// Basic states
export const Scheduled: Story = {
  args: {
    game: mockGames[1], // Scheduled game
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

export const Live: Story = {
  args: {
    game: {
      ...mockGames[0],
      status: 'live',
      currentPeriod: '2',
      periodTimeRemaining: 420, // 7:00
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

export const Final: Story = {
  args: {
    game: {
      ...mockGames[2],
      status: 'final',
      threeStars: {
        first: 'Connor McDavid',
        second: 'Leon Draisaitl',
        third: 'Stuart Skinner',
      },
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

export const Overtime: Story = {
  args: {
    game: {
      ...mockGames[0],
      status: 'overtime',
      currentPeriod: 'OT1',
      periodTimeRemaining: 300, // 5:00
      homeScore: 8,
      awayScore: 8,
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

// Medal game
export const MedalGame: Story = {
  name: 'Medal Game (Championship)',
  args: {
    game: {
      ...mockGames[2],
      gameType: 'medal',
      gameNumber: '22',
      status: 'live',
      currentPeriod: '3',
      periodTimeRemaining: 180, // 3:00
      homeScore: 12,
      awayScore: 11,
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

// With live stream
export const WithLiveStream: Story = {
  name: 'Live Game with Stream',
  args: {
    game: {
      ...mockGames[0],
      status: 'live',
      youtubeUrl: 'https://youtube.com/watch?v=example123',
      currentPeriod: '2',
      periodTimeRemaining: 540, // 9:00
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

// Tournament points variations
export const HighScoringGame: Story = {
  name: 'High Scoring Final',
  args: {
    game: {
      ...mockGames[0],
      status: 'final',
      homeScore: 15,
      awayScore: 12,
      totalGamePoints: {
        home: 4.5,
        away: 0.5,
      },
      threeStars: {
        first: 'Connor McDavid',
        second: 'Leon Draisaitl', 
        third: 'Quinn Hughes',
      },
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

export const CloseGame: Story = {
  name: 'Close Game (Tie)',
  args: {
    game: {
      ...mockGames[0],
      status: 'final',
      homeScore: 7,
      awayScore: 7,
      totalGamePoints: {
        home: 2.5,
        away: 2.5,
      },
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

// Display options
export const NoTournamentPoints: Story = {
  name: 'Without Tournament Points',
  args: {
    game: mockGames[0],
    showDay: true,
    showTournamentPoints: false,
    showThreeStars: true,
    compact: false,
  },
}

export const NoThreeStars: Story = {
  name: 'Without Three Stars',
  args: {
    game: mockGames[2],
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: false,
    compact: false,
  },
}

export const NoDay: Story = {
  name: 'Without Day Info',
  args: {
    game: mockGames[0],
    showDay: false,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

// Compact mode
export const Compact: Story = {
  name: 'Compact Mode',
  args: {
    game: mockGames[0],
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: true,
  },
}

export const CompactScheduled: Story = {
  name: 'Compact Scheduled',
  args: {
    game: mockGames[1],
    showDay: true,
    showTournamentPoints: false,
    showThreeStars: false,
    compact: true,
  },
}

export const CompactLive: Story = {
  name: 'Compact Live',
  args: {
    game: {
      ...mockGames[0],
      status: 'live',
      currentPeriod: '2',
      periodTimeRemaining: 420,
    },
    showDay: true,
    showTournamentPoints: false,
    showThreeStars: false,
    compact: true,
  },
}

// Edge cases
export const LongTeamNames: Story = {
  name: 'Long Team Names',
  args: {
    game: {
      ...mockGames[0],
      homeTeam: {
        ...mockTeams[0],
        name: 'Calgary Roughnecks Professional',
        city: 'Calgary Metropolitan Area',
      },
      awayTeam: {
        ...mockTeams[1],
        name: 'Edmonton Oil Kings Supreme',
        city: 'Greater Edmonton Region',
      },
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

export const HighGameNumber: Story = {
  name: 'High Game Number',
  args: {
    game: {
      ...mockGames[0],
      gameNumber: '157',
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

export const ZeroZeroGame: Story = {
  name: 'Scoreless Game',
  args: {
    game: {
      ...mockGames[0],
      status: 'live',
      homeScore: 0,
      awayScore: 0,
      currentPeriod: '1',
      periodTimeRemaining: 600, // 10:00
    },
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
}

// Responsive examples
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    game: mockGames[0],
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm mx-auto">
        <Story />
      </div>
    ),
  ],
}

export const Tablet: Story = {
  name: 'Tablet View',
  args: {
    game: mockGames[0],
    showDay: true,
    showTournamentPoints: true,
    showThreeStars: true,
    compact: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
}

// Period variations
export const Period1: Story = {
  name: 'Period 1 Live',
  args: {
    game: {
      ...mockGames[0],
      status: 'live',
      currentPeriod: '1',
      periodTimeRemaining: 720, // 12:00 (full period)
      homeScore: 2,
      awayScore: 1,
    },
  },
}

export const Period3: Story = {
  name: 'Period 3 Live',
  args: {
    game: {
      ...mockGames[0],
      status: 'live',
      currentPeriod: '3',
      periodTimeRemaining: 120, // 2:00 (final minutes)
      homeScore: 8,
      awayScore: 7,
    },
  },
}

export const DoubleOvertime: Story = {
  name: 'Double Overtime',
  args: {
    game: {
      ...mockGames[0],
      status: 'overtime',
      currentPeriod: 'OT2',
      periodTimeRemaining: 240, // 4:00
      homeScore: 10,
      awayScore: 10,
    },
  },
}

// Tournament scenarios
export const TournamentDecider: Story = {
  name: 'Tournament Deciding Game',
  args: {
    game: {
      ...mockGames[2],
      gameType: 'medal',
      gameNumber: '22',
      status: 'live',
      currentPeriod: '3',
      periodTimeRemaining: 60, // 1:00 final minute
      homeScore: 9,
      awayScore: 8,
      totalGamePoints: {
        home: 3.5,
        away: 1.5,
      },
      youtubeUrl: 'https://youtube.com/watch?v=championship',
    },
  },
}

// Card grid example
export const CardGrid: Story = {
  name: 'Game Cards Grid',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <GameCard game={{...mockGames[0], status: 'live'}} />
      <GameCard game={mockGames[1]} />
      <GameCard game={{...mockGames[2], status: 'final'}} />
      <GameCard game={{...mockGames[0], status: 'overtime', currentPeriod: 'OT1'}} />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

// Loading state simulation
export const LoadingState: Story = {
  name: 'Loading State',
  render: () => (
    <div className="w-[400px]">
      <div className="animate-pulse">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
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
    </div>
  ),
}

// Interactive states
export const Hover: Story = {
  name: 'Hover State',
  args: {
    game: mockGames[0],
    className: 'hover:shadow-xl hover:scale-105 transition-all duration-300',
  },
}

export const Selected: Story = {
  name: 'Selected State',
  args: {
    game: mockGames[0],
    className: 'ring-2 ring-blue-500 ring-offset-2 shadow-lg',
  },
}