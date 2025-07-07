import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from './button'
import { ChevronRight, Download, Heart, Plus, Settings, Star } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A versatile button component built with **Radix UI** and **class-variance-authority**. 
Supports multiple variants, sizes, and can be rendered as different elements using the \`asChild\` prop.

### Features
- Multiple variants (default, destructive, outline, secondary, ghost, link)
- Various sizes (sm, default, lg, icon, clear)
- Full accessibility support with keyboard navigation
- Can render as different elements using \`asChild\` prop
- Optimized for touch interfaces (minimum 44px touch targets)
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon', 'clear'],
      description: 'Size of the button',
    },
    asChild: {
      control: 'boolean',
      description: 'When true, the button will be rendered as its child element',
    },
    disabled: {
      control: 'boolean',
      description: 'When true, the button is disabled and not interactive',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when button is clicked',
    },
  },
  args: {
    onClick: fn(),
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

// Basic variants
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Game',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'View Details',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Learn More',
  },
}

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <Settings className="h-4 w-4" />,
    'aria-label': 'Settings',
  },
}

export const Clear: Story = {
  args: {
    size: 'clear',
    children: 'Clear Button',
  },
}

// With icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="mr-2 h-4 w-4" />
        Add Goal
      </>
    ),
  },
}

export const IconRight: Story = {
  args: {
    children: (
      <>
        Next Period
        <ChevronRight className="ml-2 h-4 w-4" />
      </>
    ),
  },
}

export const IconOnly: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    children: <Heart className="h-4 w-4" />,
    'aria-label': 'Add to favorites',
  },
}

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Submitting...
      </>
    ),
  },
}

// Tournament-specific examples
export const StartPeriod: Story = {
  name: 'Tournament: Start Period',
  args: {
    size: 'lg',
    children: 'Start Period 1',
    className: 'bg-green-600 hover:bg-green-700 text-white font-bold',
  },
}

export const RecordGoal: Story = {
  name: 'Tournament: Record Goal',
  args: {
    variant: 'default',
    children: (
      <>
        <Plus className="mr-2 h-4 w-4" />
        Goal
      </>
    ),
  },
}

export const RecordPenalty: Story = {
  name: 'Tournament: Record Penalty',
  args: {
    variant: 'destructive',
    children: 'Penalty',
  },
}

export const ThreeStars: Story = {
  name: 'Tournament: Three Stars',
  args: {
    variant: 'outline',
    children: (
      <>
        <Star className="mr-2 h-4 w-4" />
        Select Three Stars
      </>
    ),
  },
}

export const DownloadStats: Story = {
  name: 'Tournament: Download Stats',
  args: {
    variant: 'secondary',
    size: 'sm',
    children: (
      <>
        <Download className="mr-2 h-4 w-4" />
        Export Game Stats
      </>
    ),
  },
}

// Responsive examples
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    size: 'lg',
    children: 'Touch-Friendly Button',
    className: 'min-h-[44px] min-w-[44px] px-6',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const ScorekeeperInterface: Story = {
  name: 'Scorekeeper Interface',
  args: {
    size: 'lg',
    children: (
      <>
        <Plus className="mr-2 h-5 w-5" />
        Home Goal
      </>
    ),
    className: 'min-h-[48px] px-8 text-base font-semibold',
  },
  parameters: {
    viewport: {
      defaultViewport: 'scorekeeperTablet',
    },
    backgrounds: {
      default: 'tournament',
    },
  },
}

// Button groups
export const ButtonGroup: Story = {
  name: 'Button Group Example',
  render: () => (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm">
        Period 1
      </Button>
      <Button variant="outline" size="sm">
        Period 2
      </Button>
      <Button size="sm">
        Period 3
      </Button>
    </div>
  ),
}

export const QuickActions: Story = {
  name: 'Quick Actions (Scorekeeper)',
  render: () => (
    <div className="grid grid-cols-2 gap-3 p-4">
      <Button className="h-16">
        <div className="text-center">
          <Plus className="mx-auto mb-1 h-5 w-5" />
          <div className="text-sm">Goal</div>
        </div>
      </Button>
      <Button variant="destructive" className="h-16">
        <div className="text-center">
          <div className="mx-auto mb-1 h-5 w-5 rounded-full bg-current" />
          <div className="text-sm">Penalty</div>
        </div>
      </Button>
      <Button variant="outline" className="h-16">
        <div className="text-center">
          <div className="mx-auto mb-1 h-5 w-5 rounded-full border-2 border-current" />
          <div className="text-sm">Faceoff</div>
        </div>
      </Button>
      <Button variant="secondary" className="h-16">
        <div className="text-center">
          <Settings className="mx-auto mb-1 h-5 w-5" />
          <div className="text-sm">Settings</div>
        </div>
      </Button>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

// AsChild example
export const AsChildLink: Story = {
  name: 'As Child (Link)',
  render: () => (
    <Button asChild>
      <a href="/tournament/schedule" target="_blank" rel="noopener noreferrer">
        View Tournament Schedule
      </a>
    </Button>
  ),
}