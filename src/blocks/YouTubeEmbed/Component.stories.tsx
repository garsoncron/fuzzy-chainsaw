import type { Meta, StoryObj } from '@storybook/react'
import { YouTubeEmbed } from './Component'

const meta: Meta<typeof YouTubeEmbed> = {
  title: 'Blocks/YouTubeEmbed',
  component: YouTubeEmbed,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    url: {
      control: 'text',
      description: 'YouTube video URL',
    },
    title: {
      control: 'text',
      description: 'Optional title above the video',
    },
    autoplay: {
      control: 'boolean',
      description: 'Autoplay the video (requires muted)',
    },
    muted: {
      control: 'boolean',
      description: 'Start the video muted',
    },
    showControls: {
      control: 'boolean',
      description: 'Show video player controls',
    },
    aspectRatio: {
      control: 'select',
      options: ['16:9', '4:3', '21:9', '1:1'],
      description: 'Video aspect ratio',
    },
    privacyEnhanced: {
      control: 'boolean',
      description: 'Use privacy-enhanced mode',
    },
  },
}

export default meta
type Story = StoryObj<typeof YouTubeEmbed>

// Default story with a lacrosse highlights video
export const Default: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Game Highlights',
    autoplay: false,
    muted: false,
    showControls: true,
    aspectRatio: '16:9',
    privacyEnhanced: true,
  },
}

// Live stream example
export const LiveStream: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    title: 'Live: Calgary Bears vs Edmonton Eagles',
    autoplay: true,
    muted: true,
    showControls: true,
    aspectRatio: '16:9',
    privacyEnhanced: true,
  },
}

// Without title
export const NoTitle: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    autoplay: false,
    muted: false,
    showControls: true,
    aspectRatio: '16:9',
    privacyEnhanced: true,
  },
}

// Different aspect ratios
export const StandardAspectRatio: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Standard 4:3 Video',
    aspectRatio: '4:3',
    showControls: true,
  },
}

export const UltrawideAspectRatio: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Ultrawide 21:9 Video',
    aspectRatio: '21:9',
    showControls: true,
  },
}

export const SquareAspectRatio: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Square 1:1 Video',
    aspectRatio: '1:1',
    showControls: true,
  },
}

// Autoplay with muted
export const AutoplayMuted: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Autoplaying Video (Muted)',
    autoplay: true,
    muted: true,
    showControls: true,
    aspectRatio: '16:9',
  },
}

// No controls
export const NoControls: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Video Without Controls',
    autoplay: false,
    muted: false,
    showControls: false,
    aspectRatio: '16:9',
  },
}

// Different URL formats
export const ShortUrl: Story = {
  args: {
    url: 'https://youtu.be/dQw4w9WgXcQ',
    title: 'Short URL Format (youtu.be)',
    showControls: true,
  },
}

export const EmbedUrl: Story = {
  args: {
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Embed URL Format',
    showControls: true,
  },
}

// Error states
export const InvalidUrl: Story = {
  args: {
    url: 'https://www.youtube.com/not-a-valid-url',
    title: 'Invalid URL Example',
    showControls: true,
  },
}

export const NoUrl: Story = {
  args: {
    url: '',
    title: 'Missing URL',
    showControls: true,
  },
}

// Privacy modes
export const StandardMode: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Standard YouTube Mode',
    privacyEnhanced: false,
    showControls: true,
  },
}

export const PrivacyEnhancedMode: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Privacy Enhanced Mode',
    privacyEnhanced: true,
    showControls: true,
  },
}

// Mobile responsive
export const Mobile: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Mobile Responsive Video',
    showControls: true,
    aspectRatio: '16:9',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Tournament specific example
export const TournamentHighlights: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Cowtown Showdown 2024 - Day 1 Highlights',
    showControls: true,
    aspectRatio: '16:9',
    privacyEnhanced: true,
  },
  decorators: [
    (Story) => (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-western text-primary-brown mb-8">Tournament Highlights</h1>
        <Story />
      </div>
    ),
  ],
}