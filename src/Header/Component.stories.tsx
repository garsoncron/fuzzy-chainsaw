import type { Meta, StoryObj } from '@storybook/react'
import { HeaderClient } from './Component.client'

const meta: Meta<typeof HeaderClient> = {
  title: 'Navigation/Header',
  component: HeaderClient,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Enhanced header component for Cowtown Showdown tournament with western theme, live game indicators, and responsive navigation.'
      }
    }
  },
  argTypes: {
    liveGamesCount: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Number of currently live games'
    },
    nextGameTime: {
      control: 'text',
      description: 'Next game start time display'
    },
    showLiveIndicator: {
      control: 'boolean',
      description: 'Show live game status indicators'
    }
  }
}

export default meta
type Story = StoryObj<typeof HeaderClient>

// Mock header data for stories
const mockHeaderData = {
  id: '1',
  navItems: [
    { link: { type: 'reference', url: '/', label: 'Home' } },
    { link: { type: 'reference', url: '/schedule', label: 'Schedule' } },
    { link: { type: 'reference', url: '/standings', label: 'Standings' } },
    { link: { type: 'reference', url: '/teams', label: 'Teams' } },
    { link: { type: 'reference', url: '/stats', label: 'Stats' } },
    { link: { type: 'reference', url: '/scores', label: 'Scores' } },
    { link: { type: 'reference', url: '/about', label: 'About' } },
    { link: { type: 'reference', url: '/register', label: 'Register' } }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const Default: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 0,
    showLiveIndicator: true
  }
}

export const WithLiveGames: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 2,
    nextGameTime: '2:30 PM',
    showLiveIndicator: true
  }
}

export const SingleLiveGame: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 1,
    nextGameTime: '4:15 PM',
    showLiveIndicator: true
  }
}

export const UpcomingGameOnly: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 0,
    nextGameTime: '10:00 AM Tomorrow',
    showLiveIndicator: true
  }
}

export const NoLiveIndicators: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 0,
    showLiveIndicator: false
  }
}

export const MinimalNavigation: Story = {
  args: {
    data: {
      ...mockHeaderData,
      navItems: [
        { link: { type: 'reference', url: '/', label: 'Home' } },
        { link: { type: 'reference', url: '/scores', label: 'Scores' } },
        { link: { type: 'reference', url: '/teams', label: 'Teams' } }
      ]
    },
    liveGamesCount: 0,
    showLiveIndicator: true
  }
}

export const Mobile: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 3,
    nextGameTime: '1:00 PM',
    showLiveIndicator: true
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' }
  }
}

export const Tablet: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 1,
    nextGameTime: '3:45 PM',
    showLiveIndicator: true
  },
  parameters: {
    viewport: { defaultViewport: 'tablet' }
  }
}

export const TournamentInProgress: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 4,
    nextGameTime: '12:30 PM',
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header during peak tournament activity with multiple live games'
      }
    }
  }
}

export const EmptyNavigation: Story = {
  args: {
    data: {
      ...mockHeaderData,
      navItems: []
    },
    liveGamesCount: 0,
    showLiveIndicator: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with no navigation items (edge case)'
      }
    }
  }
}