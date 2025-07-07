import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { StatButtons } from './StatButtons'

// Mock player data for scorekeeper interface
const mockHomePlayers = [
  {
    id: 'player-1',
    firstName: 'Connor',
    lastName: 'McDavid',
    jerseyNumber: 97,
    primaryPosition: 'offence',
    handedness: 'left',
    playerType: 'runner',
  },
  {
    id: 'player-2',
    firstName: 'Leon',
    lastName: 'Draisaitl',
    jerseyNumber: 29,
    primaryPosition: 'offence',
    handedness: 'right',
    playerType: 'runner',
  },
  {
    id: 'player-3',
    firstName: 'Stuart',
    lastName: 'Skinner',
    jerseyNumber: 74,
    primaryPosition: 'goalie',
    handedness: 'left',
    playerType: 'goalie',
  },
  {
    id: 'player-4',
    firstName: 'Ryan',
    lastName: 'Nugent-Hopkins',
    jerseyNumber: 93,
    primaryPosition: 'offence',
    handedness: 'left',
    playerType: 'runner',
  },
  {
    id: 'player-5',
    firstName: 'Zach',
    lastName: 'Hyman',
    jerseyNumber: 18,
    primaryPosition: 'offence',
    handedness: 'left',
    playerType: 'runner',
  },
]

const mockAwayPlayers = [
  {
    id: 'player-6',
    firstName: 'Johnny',
    lastName: 'Gaudreau',
    jerseyNumber: 13,
    primaryPosition: 'offence',
    handedness: 'left',
    playerType: 'runner',
  },
  {
    id: 'player-7',
    firstName: 'Elias',
    lastName: 'Lindholm',
    jerseyNumber: 23,
    primaryPosition: 'offence',
    handedness: 'right',
    playerType: 'runner',
  },
  {
    id: 'player-8',
    firstName: 'Jacob',
    lastName: 'Markstrom',
    jerseyNumber: 25,
    primaryPosition: 'goalie',
    handedness: 'left',
    playerType: 'goalie',
  },
  {
    id: 'player-9',
    firstName: 'Rasmus',
    lastName: 'Andersson',
    jerseyNumber: 4,
    primaryPosition: 'defence',
    handedness: 'right',
    playerType: 'runner',
  },
  {
    id: 'player-10',
    firstName: 'Matthew',
    lastName: 'Tkachuk',
    jerseyNumber: 19,
    primaryPosition: 'offence',
    handedness: 'left',
    playerType: 'runner',
  },
]

const meta: Meta<typeof StatButtons> = {
  title: 'Scorekeeper/StatButtons',
  component: StatButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Statistics entry interface designed for rapid data entry during live games. Features 
large touch-friendly buttons, team-specific actions, and comprehensive stat tracking.

### Features
- **Rapid Entry**: Large 44px+ touch targets for mobile scorekeeper use
- **Team Selection**: Separate buttons for home/away team actions
- **Live Game Focus**: Buttons disabled when game not active (except goalie changes)
- **Comprehensive Stats**: Goals, shots, faceoffs, penalties, timeouts, goalie changes
- **Quick Actions**: Undo last action, team timeouts
- **Modal Dialogs**: Player selection and penalty detail entry

### Statistics Tracked
- **Goal**: Score tracking with player attribution
- **Shot**: Shot on goal attempts for goalie stats
- **Faceoff**: Faceoff wins for center statistics
- **Penalty**: Full penalty tracking with infractions
- **Timeout**: Team timeout usage tracking
- **Goalie Change**: Goaltender substitutions

### Touch Optimization
- Minimum 44px touch targets
- High contrast color coding
- Clear visual feedback
- Rapid sequential entry support
- Offline capability with sync

### Game State Management
- Live/overtime: All buttons active
- Pre-game/final: Limited functionality
- Real-time updates to game state
        `,
      },
    },
  },
  argTypes: {
    homeRoster: {
      description: 'Array of home team players',
    },
    awayRoster: {
      description: 'Array of away team players',
    },
    selectedStat: {
      control: { type: 'select' },
      options: [null, 'goal', 'shot', 'faceoff', 'penalty', 'timeout', 'goalie_change'],
      description: 'Currently selected statistic type',
    },
    gameStatus: {
      control: { type: 'select' },
      options: ['scheduled', 'live', 'overtime', 'final'],
      description: 'Current game status',
    },
    onStatSelect: {
      action: 'statSelected',
      description: 'Called when stat type is selected',
    },
    onStatSubmit: {
      action: 'statSubmitted',
      description: 'Called when stat data is submitted',
    },
  },
  args: {
    onStatSelect: fn(),
    onStatSubmit: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatButtons>

// Basic states
export const LiveGame: Story = {
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
}

export const PreGame: Story = {
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'scheduled',
  },
}

export const OvertimeGame: Story = {
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'overtime',
  },
}

export const GameComplete: Story = {
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'final',
  },
}

// Selected statistic states
export const GoalSelected: Story = {
  name: 'Goal Stat Selected',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: 'goal',
    gameStatus: 'live',
  },
}

export const PenaltySelected: Story = {
  name: 'Penalty Stat Selected',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: 'penalty',
    gameStatus: 'live',
  },
}

export const FaceoffSelected: Story = {
  name: 'Faceoff Stat Selected',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: 'faceoff',
    gameStatus: 'live',
  },
}

// Roster variations
export const SmallRoster: Story = {
  name: 'Small Team Roster',
  args: {
    homeRoster: mockHomePlayers.slice(0, 3),
    awayRoster: mockAwayPlayers.slice(0, 3),
    selectedStat: null,
    gameStatus: 'live',
  },
}

export const LargeRoster: Story = {
  name: 'Full Team Roster',
  args: {
    homeRoster: [
      ...mockHomePlayers,
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `extra-home-${i}`,
        firstName: `Player${i + 6}`,
        lastName: `LastName${i + 6}`,
        jerseyNumber: i + 6,
        primaryPosition: 'offence',
        handedness: 'right',
        playerType: 'runner',
      })),
    ],
    awayRoster: [
      ...mockAwayPlayers,
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `extra-away-${i}`,
        firstName: `Player${i + 11}`,
        lastName: `LastName${i + 11}`,
        jerseyNumber: i + 11,
        primaryPosition: 'defence',
        handedness: 'left',
        playerType: 'runner',
      })),
    ],
    selectedStat: null,
    gameStatus: 'live',
  },
}

export const NoRoster: Story = {
  name: 'Empty Rosters',
  args: {
    homeRoster: [],
    awayRoster: [],
    selectedStat: null,
    gameStatus: 'live',
  },
}

// Mobile responsive
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
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
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg mx-auto p-6">
        <Story />
      </div>
    ),
  ],
}

// Scorekeeper interface context
export const ScorekeeperInterface: Story = {
  name: 'Full Scorekeeper Interface',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary-brown mb-2">
              Live Game Scorekeeper
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Game 5 • Period 2 • 8:23 remaining</span>
              <span>Calgary Bears 6 - Edmonton Storm 4</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 border mb-4">
                <h3 className="font-semibold mb-2">Current Score</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Calgary Bears</div>
                  <div className="text-4xl font-bold my-2">6</div>
                  <div className="text-sm text-muted-foreground">vs</div>
                  <div className="text-4xl font-bold my-2">4</div>
                  <div className="text-2xl font-bold text-red-600">Edmonton Storm</div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <Story />
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

// High-frequency usage scenarios
export const RapidEntry: Story = {
  name: 'Rapid Stat Entry Mode',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded">
          <p className="text-sm font-medium text-green-800">
            ⚡ Rapid Entry Mode: Optimized for quick stat entry during fast play
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}

// Accessibility examples
export const HighContrast: Story = {
  name: 'High Contrast Mode',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-6 rounded">
        <div style={{ filter: 'contrast(1.5) brightness(1.2)' }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

export const LargeTouch: Story = {
  name: 'Large Touch Targets',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div style={{ transform: 'scale(1.2)', transformOrigin: 'top left' }}>
        <Story />
      </div>
    ),
  ],
}

// Error states
export const OfflineMode: Story = {
  name: 'Offline Mode',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-sm font-medium text-yellow-800">
              Offline Mode: Stats will sync when connection is restored
            </p>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
}

export const ConnectionError: Story = {
  name: 'Connection Error',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-red-800">
              Connection Error: Unable to submit stats. Please try again.
            </p>
          </div>
        </div>
        <div style={{ opacity: 0.7, pointerEvents: 'none' }}>
          <Story />
        </div>
      </div>
    ),
  ],
}

// Tournament-specific scenarios
export const ChampionshipGame: Story = {
  name: 'Championship Game',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'overtime',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-golden/20 border border-golden rounded">
          <div className="flex items-center gap-2">
            <div className="text-golden">🏆</div>
            <p className="text-sm font-medium text-primary-brown">
              Championship Game - Every stat counts!
            </p>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
}

export const MedalGame: Story = {
  name: 'Medal Game',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded">
          <div className="flex items-center gap-2">
            <div className="text-blue-600">🥇</div>
            <p className="text-sm font-medium text-blue-800">
              Medal Game - 15-minute periods, overtime allowed
            </p>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
}

// Testing scenarios
export const LoadTesting: Story = {
  name: 'High Volume Stats',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: null,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-purple-100 border border-purple-400 rounded">
          <p className="text-sm font-medium text-purple-800">
            🔬 Load Test: Simulating high-frequency stat entry (20+ stats/minute)
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}

// Component interaction examples
export const WithSelectedGoal: Story = {
  name: 'Goal Entry Flow',
  args: {
    homeRoster: mockHomePlayers,
    awayRoster: mockAwayPlayers,
    selectedStat: 'goal',
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded">
          <p className="text-sm font-medium text-green-800">
            Step 1: Goal selected → Step 2: Choose team → Step 3: Select player
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}