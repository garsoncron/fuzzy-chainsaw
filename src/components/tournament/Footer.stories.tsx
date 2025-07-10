import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './Footer'

const meta: Meta<typeof Footer> = {
  title: 'Tournament/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light'
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The complete footer component for the Cowtown Showdown tournament website, featuring tournament information, quick links, resources, and social media integration.'
      }
    }
  }
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile view showing the accordion-style layout with collapsible sections for better user experience on smaller screens.'
      }
    }
  }
}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet view showing the 2x2 grid layout optimized for medium-sized screens.'
      }
    }
  }
}

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    },
    docs: {
      description: {
        story: 'Desktop view showing the full 4-column layout with all sections visible at once.'
      }
    }
  }
}

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        story: 'Footer component with dark background to demonstrate the western theme colors and contrast.'
      }
    }
  }
}

export const FocusStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation and focus states for accessibility. Use Tab to navigate through all interactive elements.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    // Focus the first interactive element to show focus states
    const firstLink = canvasElement.querySelector('a')
    if (firstLink) {
      firstLink.focus()
    }
  }
}