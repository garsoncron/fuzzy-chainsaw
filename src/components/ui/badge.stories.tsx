import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'
import { Clock, AlertCircle, CheckCircle, Star, Trophy, Users } from 'lucide-react'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A small status indicator component perfect for showing game status, player positions, 
tournament points, and other categorical information.

### Features
- Multiple variants (default, secondary, destructive, outline)
- Supports icons and custom styling
- Optimized for tournament status indicators
- Accessible with proper contrast ratios

### Common Uses
- Game status (Live, Final, Upcoming)
- Player positions (Offence, Defence, Goalie)
- Tournament categories (Pool A, Medal Game)
- Priority indicators (High, Medium, Low)
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant of the badge',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Badge>

// Basic variants
export const Default: Story = {
  args: {
    children: 'Default',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

// Game status badges
export const LiveGame: Story = {
  name: 'Tournament: Live Game',
  args: {
    variant: 'destructive',
    children: (
      <>
        <div className="mr-1 h-2 w-2 rounded-full bg-white animate-pulse"></div>
        LIVE
      </>
    ),
    className: 'bg-red-500 text-white',
  },
}

export const FinalGame: Story = {
  name: 'Tournament: Final Game',
  args: {
    variant: 'secondary',
    children: (
      <>
        <CheckCircle className="mr-1 h-3 w-3" />
        FINAL
      </>
    ),
  },
}

export const UpcomingGame: Story = {
  name: 'Tournament: Upcoming Game',
  args: {
    variant: 'outline',
    children: (
      <>
        <Clock className="mr-1 h-3 w-3" />
        UPCOMING
      </>
    ),
  },
}

export const DelayedGame: Story = {
  name: 'Tournament: Delayed Game',
  args: {
    variant: 'destructive',
    children: (
      <>
        <AlertCircle className="mr-1 h-3 w-3" />
        DELAYED
      </>
    ),
    className: 'bg-amber-500 text-white',
  },
}

// Player position badges
export const Offence: Story = {
  name: 'Player: Offence',
  args: {
    variant: 'default',
    children: 'Offence',
    className: 'bg-blue-500 text-white',
  },
}

export const Defence: Story = {
  name: 'Player: Defence',
  args: {
    variant: 'default',
    children: 'Defence',
    className: 'bg-red-500 text-white',
  },
}

export const Goalie: Story = {
  name: 'Player: Goalie',
  args: {
    variant: 'default',
    children: 'Goalie',
    className: 'bg-purple-500 text-white',
  },
}

export const Transition: Story = {
  name: 'Player: Transition',
  args: {
    variant: 'default',
    children: 'Transition',
    className: 'bg-green-500 text-white',
  },
}

export const Faceoff: Story = {
  name: 'Player: Faceoff',
  args: {
    variant: 'default',
    children: 'Faceoff',
    className: 'bg-orange-500 text-white',
  },
}

// Tournament categories
export const PoolA: Story = {
  name: 'Tournament: Pool A',
  args: {
    variant: 'outline',
    children: 'Pool A',
    className: 'border-blue-300 text-blue-700',
  },
}

export const PoolB: Story = {
  name: 'Tournament: Pool B',
  args: {
    variant: 'outline',
    children: 'Pool B',
    className: 'border-green-300 text-green-700',
  },
}

export const MedalGame: Story = {
  name: 'Tournament: Medal Game',
  args: {
    variant: 'default',
    children: (
      <>
        <Trophy className="mr-1 h-3 w-3" />
        Medal Game
      </>
    ),
    className: 'bg-yellow-500 text-yellow-900',
  },
}

// Statistics badges
export const TournamentPoints: Story = {
  name: 'Stats: Tournament Points',
  args: {
    variant: 'secondary',
    children: '18.5 pts',
  },
}

export const Goals: Story = {
  name: 'Stats: Goals',
  args: {
    variant: 'default',
    children: '12 G',
    className: 'bg-green-600 text-white',
  },
}

export const Assists: Story = {
  name: 'Stats: Assists',
  args: {
    variant: 'default',
    children: '8 A',
    className: 'bg-blue-600 text-white',
  },
}

export const PenaltyMinutes: Story = {
  name: 'Stats: Penalty Minutes',
  args: {
    variant: 'destructive',
    children: '4 PIM',
  },
}

// Special states
export const ThreeStars: Story = {
  name: 'Special: Three Stars',
  args: {
    variant: 'default',
    children: (
      <>
        <Star className="mr-1 h-3 w-3 fill-current" />
        1st Star
      </>
    ),
    className: 'bg-yellow-400 text-yellow-900',
  },
}

export const Captain: Story = {
  name: 'Special: Captain',
  args: {
    variant: 'outline',
    children: (
      <>
        <Users className="mr-1 h-3 w-3" />
        Captain
      </>
    ),
    className: 'border-amber-400 text-amber-700',
  },
}

export const PowerPlay: Story = {
  name: 'Game State: Power Play',
  args: {
    variant: 'default',
    children: 'PP',
    className: 'bg-blue-500 text-white animate-pulse',
  },
}

export const PenaltyKill: Story = {
  name: 'Game State: Penalty Kill',
  args: {
    variant: 'destructive',
    children: 'PK',
    className: 'animate-pulse',
  },
}

// Size variations
export const Large: Story = {
  name: 'Size: Large',
  args: {
    children: 'Large Badge',
    className: 'px-3 py-1 text-sm',
  },
}

export const Small: Story = {
  name: 'Size: Small',
  args: {
    children: 'XS',
    className: 'px-1.5 py-0.5 text-xs',
  },
}

// Numbers and jersey numbers
export const JerseyNumber: Story = {
  name: 'Jersey Number',
  args: {
    variant: 'outline',
    children: '#97',
    className: 'font-mono font-bold',
  },
}

export const Score: Story = {
  name: 'Score Display',
  args: {
    variant: 'default',
    children: '8-5',
    className: 'font-mono text-lg px-3 py-1',
  },
}

// Interactive states
export const Clickable: Story = {
  name: 'Interactive Badge',
  args: {
    children: 'Clickable',
    className: 'cursor-pointer hover:bg-primary/90 transition-colors',
    onClick: () => alert('Badge clicked!'),
  },
}

// Badge groups
export const BadgeGroup: Story = {
  name: 'Badge Group Example',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">Pool A</Badge>
      <Badge className="bg-green-500 text-white">5-0</Badge>
      <Badge variant="secondary">18.5 pts</Badge>
      <Badge variant="outline" className="border-amber-400 text-amber-700">
        <Star className="mr-1 h-3 w-3 fill-current" />
        Captain
      </Badge>
    </div>
  ),
}

export const GameStatusGroup: Story = {
  name: 'Game Status Examples',
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm w-20">Live:</span>
        <Badge className="bg-red-500 text-white">
          <div className="mr-1 h-2 w-2 rounded-full bg-white animate-pulse"></div>
          LIVE
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm w-20">Final:</span>
        <Badge variant="secondary">
          <CheckCircle className="mr-1 h-3 w-3" />
          FINAL
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm w-20">Upcoming:</span>
        <Badge variant="outline">
          <Clock className="mr-1 h-3 w-3" />
          UPCOMING
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm w-20">Delayed:</span>
        <Badge className="bg-amber-500 text-white">
          <AlertCircle className="mr-1 h-3 w-3" />
          DELAYED
        </Badge>
      </div>
    </div>
  ),
}

export const PlayerPositions: Story = {
  name: 'Player Position Examples',
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      <Badge className="bg-blue-500 text-white justify-center">Offence</Badge>
      <Badge className="bg-red-500 text-white justify-center">Defence</Badge>
      <Badge className="bg-green-500 text-white justify-center">Transition</Badge>
      <Badge className="bg-orange-500 text-white justify-center">Faceoff</Badge>
      <Badge className="bg-purple-500 text-white justify-center col-span-2">Goalie</Badge>
    </div>
  ),
}

// Tournament-specific badge combinations
export const TournamentCard: Story = {
  name: 'Tournament Card Example',
  render: () => (
    <div className="p-4 border rounded-lg w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Calgary Bears</h3>
        <Badge variant="outline" className="border-blue-300 text-blue-700">
          Pool A
        </Badge>
      </div>
      <div className="flex gap-2 mb-3">
        <Badge className="bg-green-600 text-white">5-0</Badge>
        <Badge variant="secondary">18.5 pts</Badge>
        <Badge variant="outline">1st Place</Badge>
      </div>
      <div className="flex gap-1">
        <Badge variant="outline" className="text-xs border-amber-400 text-amber-700">
          <Star className="mr-1 h-2 w-2 fill-current" />
          Captain
        </Badge>
        <Badge variant="outline" className="text-xs">20 Players</Badge>
      </div>
    </div>
  ),
}