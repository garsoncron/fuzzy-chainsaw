import type { Meta, StoryObj } from '@storybook/react'
import { NavigationDropdown } from './NavigationDropdown'

const meta: Meta<typeof NavigationDropdown> = {
  title: 'Navigation/NavigationDropdown',
  component: NavigationDropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Mega menu navigation dropdown component with 3-column layout, hover interactions, and mobile support. Features tournament-specific content sections and live game indicators.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Navigation item label'
    },
    menuType: {
      control: 'select',
      options: ['tournament', 'teams', 'games', 'stats', 'media'],
      description: 'Type of mega menu to display'
    }
  }
}

export default meta
type Story = StoryObj<typeof NavigationDropdown>

export const Tournament: Story = {
  args: {
    label: 'Tournament',
    menuType: 'tournament'
  },
  parameters: {
    docs: {
      description: {
        story: 'Tournament mega menu with quick access, information, and featured content sections'
      }
    }
  }
}

export const Teams: Story = {
  args: {
    label: 'Teams',
    menuType: 'teams'
  },
  parameters: {
    docs: {
      description: {
        story: 'Teams mega menu with team logo grid, tools, and standings preview'
      }
    }
  }
}

export const Games: Story = {
  args: {
    label: 'Games',
    menuType: 'games'
  },
  parameters: {
    docs: {
      description: {
        story: 'Games mega menu with live games, schedule, and recent results'
      }
    }
  }
}

export const Stats: Story = {
  args: {
    label: 'Stats',
    menuType: 'stats'
  },
  parameters: {
    docs: {
      description: {
        story: 'Statistics mega menu with leaders, categories, and records'
      }
    }
  }
}

export const Media: Story = {
  args: {
    label: 'Media',
    menuType: 'media'
  },
  parameters: {
    docs: {
      description: {
        story: 'Media mega menu with latest content, highlights, and social feed'
      }
    }
  }
}

export const MobileView: Story = {
  args: {
    label: 'Tournament',
    menuType: 'tournament'
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'Mobile view with compact dropdown instead of mega menu'
      }
    }
  }
}

export const TabletView: Story = {
  args: {
    label: 'Teams',
    menuType: 'teams'
  },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    docs: {
      description: {
        story: 'Tablet view with responsive mega menu layout'
      }
    }
  }
}

export const InteractiveDemo: Story = {
  args: {
    label: 'Games',
    menuType: 'games'
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - hover to open mega menu on desktop, click on mobile'
      }
    }
  }
}

export const AccessibilityTest: Story = {
  args: {
    label: 'Stats',
    menuType: 'stats'
  },
  parameters: {
    docs: {
      description: {
        story: 'Test keyboard navigation (Tab, Arrow keys, Escape) and screen reader compatibility'
      }
    }
  }
}

export const AllMenuTypes: Story = {
  render: () => (
    <div className="flex items-center space-x-1 bg-white p-4 rounded-lg shadow-lg">
      <NavigationDropdown label="Tournament" menuType="tournament" />
      <NavigationDropdown label="Teams" menuType="teams" />
      <NavigationDropdown label="Games" menuType="games" />
      <NavigationDropdown label="Stats" menuType="stats" />
      <NavigationDropdown label="Media" menuType="media" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All navigation dropdown types displayed together as they appear in the header'
      }
    }
  }
}