import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Timer } from './Timer'

const meta: Meta<typeof Timer> = {
  title: 'Scorekeeper/Timer',
  component: Timer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Game period timer component designed for scorekeeper use during live games. Features 
accurate timing, visual alerts, and clear period management.

### Features
- **Accurate Timing**: 1-second precision countdown timer
- **Period Management**: Supports regular periods and overtime
- **Visual Alerts**: Color changes and warnings for critical times
- **Large Controls**: Touch-friendly buttons for mobile scorekeeper use
- **Time Formatting**: Clear MM:SS display with negative time support
- **Status Indicators**: Visual feedback for timer state

### Timer States
- **Running**: Active countdown with green start button
- **Stopped**: Paused timer with play button
- **Expired**: Time <= 0 with red warning and animation
- **Final Minutes**: Last 2 minutes shown in yellow
- **Pre-game**: Timer disabled until period starts

### Controls
- **Start/Stop**: Toggle timer running state
- **Reset**: Return to full period time
- **End**: Immediately set timer to 0:00

### Period Types
- **Regular Periods**: 12 minutes for pool play, 15 for medal games
- **Overtime**: 5-minute sudden death periods
- **Pre-game**: Period 0 state before game starts
        `,
      },
    },
  },
  argTypes: {
    currentPeriod: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 'OT1', 'OT2'],
      description: 'Current game period (0 = pre-game)',
    },
    timeRemaining: {
      control: { type: 'number', min: -300, max: 900, step: 1 },
      description: 'Time remaining in seconds',
    },
    periodLength: {
      control: { type: 'select' },
      options: [12, 15],
      description: 'Period length in minutes (12 for pool, 15 for medal)',
    },
    gameStatus: {
      control: { type: 'select' },
      options: ['scheduled', 'live', 'final'],
      description: 'Current game status',
    },
    onTimeUpdate: {
      action: 'timeUpdated',
      description: 'Called when timer updates',
    },
  },
  args: {
    onTimeUpdate: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Timer>

// Basic timer states
export const PreGame: Story = {
  args: {
    currentPeriod: 0,
    timeRemaining: 720, // 12:00
    periodLength: 12,
    gameStatus: 'scheduled',
  },
}

export const Period1Start: Story = {
  name: 'Period 1 - Full Time',
  args: {
    currentPeriod: 1,
    timeRemaining: 720, // 12:00
    periodLength: 12,
    gameStatus: 'live',
  },
}

export const Period1Middle: Story = {
  name: 'Period 1 - Mid Period',
  args: {
    currentPeriod: 1,
    timeRemaining: 420, // 7:00
    periodLength: 12,
    gameStatus: 'live',
  },
}

export const Period2: Story = {
  name: 'Period 2',
  args: {
    currentPeriod: 2,
    timeRemaining: 540, // 9:00
    periodLength: 12,
    gameStatus: 'live',
  },
}

export const Period3: Story = {
  name: 'Period 3',
  args: {
    currentPeriod: 3,
    timeRemaining: 360, // 6:00
    periodLength: 12,
    gameStatus: 'live',
  },
}

// Critical time scenarios
export const FinalMinutes: Story = {
  name: 'Final 2 Minutes',
  args: {
    currentPeriod: 3,
    timeRemaining: 120, // 2:00
    periodLength: 12,
    gameStatus: 'live',
  },
}

export const FinalSeconds: Story = {
  name: 'Final 30 Seconds',
  args: {
    currentPeriod: 3,
    timeRemaining: 30,
    periodLength: 12,
    gameStatus: 'live',
  },
}

export const TimeExpired: Story = {
  name: 'Time Expired',
  args: {
    currentPeriod: 3,
    timeRemaining: 0,
    periodLength: 12,
    gameStatus: 'live',
  },
}

export const Overtime: Story = {
  name: 'Overtime Running',
  args: {
    currentPeriod: 'OT1',
    timeRemaining: 300, // 5:00
    periodLength: 5,
    gameStatus: 'live',
  },
}

export const OvertimeExpired: Story = {
  name: 'Overtime Expired',
  args: {
    currentPeriod: 'OT1',
    timeRemaining: 0,
    periodLength: 5,
    gameStatus: 'live',
  },
}

export const DoubleOvertime: Story = {
  name: 'Double Overtime',
  args: {
    currentPeriod: 'OT2',
    timeRemaining: 240, // 4:00
    periodLength: 5,
    gameStatus: 'live',
  },
}

// Medal game scenarios (15-minute periods)
export const MedalGamePeriod: Story = {
  name: 'Medal Game (15 min)',
  args: {
    currentPeriod: 1,
    timeRemaining: 900, // 15:00
    periodLength: 15,
    gameStatus: 'live',
  },
}

export const MedalGameFinals: Story = {
  name: 'Medal Game Final Minutes',
  args: {
    currentPeriod: 3,
    timeRemaining: 90, // 1:30
    periodLength: 15,
    gameStatus: 'live',
  },
}

// Negative time scenarios
export const NegativeTime: Story = {
  name: 'Negative Time (Overtime)',
  args: {
    currentPeriod: 3,
    timeRemaining: -45, // -0:45
    periodLength: 12,
    gameStatus: 'live',
  },
}

// Game completed
export const GameFinal: Story = {
  name: 'Game Completed',
  args: {
    currentPeriod: 3,
    timeRemaining: 0,
    periodLength: 12,
    gameStatus: 'final',
  },
}

// Various time displays
export const ExactMinute: Story = {
  name: 'Exact Minute Mark',
  args: {
    currentPeriod: 2,
    timeRemaining: 600, // 10:00
    periodLength: 12,
    gameStatus: 'live',
  },
}

export const OddSeconds: Story = {
  name: 'Odd Seconds Display',
  args: {
    currentPeriod: 2,
    timeRemaining: 337, // 5:37
    periodLength: 12,
    gameStatus: 'live',
  },
}

export const SingleDigitMinutes: Story = {
  name: 'Single Digit Minutes',
  args: {
    currentPeriod: 1,
    timeRemaining: 543, // 9:03
    periodLength: 12,
    gameStatus: 'live',
  },
}

// Mobile/responsive examples
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    currentPeriod: 2,
    timeRemaining: 420, // 7:00
    periodLength: 12,
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
    currentPeriod: 3,
    timeRemaining: 180, // 3:00
    periodLength: 12,
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
  name: 'Scorekeeper Dashboard',
  args: {
    currentPeriod: 2,
    timeRemaining: 480, // 8:00
    periodLength: 12,
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
            Game 8 • Calgary Bears vs Edmonton Storm
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Story />
          </div>
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="font-semibold mb-4">Game Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Period:</span>
                <span className="font-medium">2nd Period</span>
              </div>
              <div className="flex justify-between">
                <span>Score:</span>
                <span className="font-medium">Calgary 6 - Edmonton 4</span>
              </div>
              <div className="flex justify-between">
                <span>Next Action:</span>
                <span className="font-medium">Faceoff at center</span>
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

// Accessibility examples
export const HighContrast: Story = {
  name: 'High Contrast Mode',
  args: {
    currentPeriod: 3,
    timeRemaining: 90, // 1:30
    periodLength: 12,
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

export const LargeText: Story = {
  name: 'Large Text Mode',
  args: {
    currentPeriod: 2,
    timeRemaining: 300, // 5:00
    periodLength: 12,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div style={{ fontSize: '1.25em' }}>
        <Story />
      </div>
    ),
  ],
}

// Interactive demo
export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  args: {
    currentPeriod: 1,
    timeRemaining: 720, // 12:00
    periodLength: 12,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded">
          <p className="text-sm font-medium text-blue-800">
            🎮 Interactive Demo: Use the Start/Stop/Reset buttons to control the timer
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}

// Tournament scenarios
export const PoolPlayGame: Story = {
  name: 'Pool Play Game',
  args: {
    currentPeriod: 2,
    timeRemaining: 540, // 9:00
    periodLength: 12,
    gameStatus: 'live',
  },
}

export const ChampionshipTimer: Story = {
  name: 'Championship Game',
  args: {
    currentPeriod: 3,
    timeRemaining: 120, // 2:00
    periodLength: 15,
    gameStatus: 'live',
  },
}

// Edge cases
export const VeryLongOvertime: Story = {
  name: 'Extended Overtime',
  args: {
    currentPeriod: 'OT5',
    timeRemaining: 180, // 3:00
    periodLength: 5,
    gameStatus: 'live',
  },
}

export const ZeroSeconds: Story = {
  name: 'Exactly Zero',
  args: {
    currentPeriod: 1,
    timeRemaining: 0,
    periodLength: 12,
    gameStatus: 'live',
  },
}

// Performance test (rapid updates)
export const RapidUpdates: Story = {
  name: 'Rapid Timer Updates',
  args: {
    currentPeriod: 3,
    timeRemaining: 10,
    periodLength: 12,
    gameStatus: 'live',
  },
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded">
          <p className="text-sm font-medium text-green-800">
            ⚡ Performance Test: Timer will count down rapidly in final seconds
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}