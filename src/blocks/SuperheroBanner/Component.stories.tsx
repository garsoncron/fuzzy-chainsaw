import type { Meta, StoryObj } from '@storybook/react'
import { SuperheroBannerBlock } from './Component'

const meta: Meta<typeof SuperheroBannerBlock> = {
  title: 'Blocks/HeroBanner',
  component: SuperheroBannerBlock,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'SuperheroBanner block featuring a full-screen hero section with Cowtown Showdown branding, customizable background image, announcement badge, and dual CTA buttons.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    disableInnerContainer: {
      control: 'boolean',
      description: 'Disable inner container padding',
    },
    heading: {
      control: 'text',
      description: 'Main hero heading',
    },
    subheading: {
      control: 'text',
      description: 'Supporting text below heading',
    },
    enableGradientOverlay: {
      control: 'boolean',
      description: 'Enable gradient overlay for better text contrast',
    },
  },
}

export default meta
type Story = StoryObj<typeof SuperheroBannerBlock>

const mockBackgroundImage = {
  id: '1',
  url: '/media/swalm-lax.jpg',
  alt: 'Lacrosse arena background',
  width: 1920,
  height: 1080,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  filename: 'swalm-lax.jpg',
  mimeType: 'image/jpeg',
  filesize: 1024000,
}

export const Default: Story = {
  args: {
    backgroundImage: mockBackgroundImage,
    announcementBadge: {
      text: 'Tournament is live now!',
      linkText: 'View live games',
      linkUrl: '/games/live',
    },
    heading: 'Cowtown Showdown 2024',
    subheading: 'The premier Senior Men\'s box lacrosse tournament returns to Calgary. Eight teams compete over three days in the heart of Alberta\'s western heritage.',
    primaryCTA: {
      text: 'View Tournament',
      type: 'custom',
      url: '/tournament',
      newTab: false,
    },
    secondaryCTA: {
      text: 'Learn more',
      type: 'custom',
      url: '/about',
      newTab: false,
    },
    enableGradientOverlay: true,
  },
}

export const WithoutAnnouncementBadge: Story = {
  args: {
    backgroundImage: mockBackgroundImage,
    heading: 'Welcome to Cowtown Showdown',
    subheading: 'Experience the excitement of professional box lacrosse in Calgary\'s western atmosphere. Join us for three days of intense competition.',
    primaryCTA: {
      text: 'Register Now',
      type: 'custom',
      url: '/register',
      newTab: false,
    },
    secondaryCTA: {
      text: 'View Schedule',
      type: 'custom',
      url: '/schedule',
      newTab: false,
    },
    enableGradientOverlay: true,
  },
}

export const SingleCTA: Story = {
  args: {
    backgroundImage: mockBackgroundImage,
    announcementBadge: {
      text: 'Registration closes soon',
      linkText: 'Register now',
      linkUrl: '/register',
    },
    heading: 'Last Call for Teams',
    subheading: 'Don\'t miss your chance to compete in Calgary\'s premier box lacrosse tournament. Limited spots available.',
    primaryCTA: {
      text: 'Register Your Team',
      type: 'custom',
      url: '/register',
      newTab: false,
    },
    enableGradientOverlay: true,
  },
}

export const WithoutGradientOverlay: Story = {
  args: {
    backgroundImage: mockBackgroundImage,
    heading: 'Clean Design',
    subheading: 'Sometimes less is more. This version removes the gradient overlay for a cleaner look.',
    primaryCTA: {
      text: 'Get Started',
      type: 'custom',
      url: '/start',
      newTab: false,
    },
    secondaryCTA: {
      text: 'Learn more',
      type: 'custom',
      url: '/about',
      newTab: false,
    },
    enableGradientOverlay: false,
  },
}

export const LongContent: Story = {
  args: {
    backgroundImage: mockBackgroundImage,
    announcementBadge: {
      text: 'Early bird pricing available until March 1st',
      linkText: 'Get early bird pricing',
      linkUrl: '/pricing',
    },
    heading: 'The Ultimate Box Lacrosse Experience in Western Canada',
    subheading: 'Join us for the most prestigious Senior Men\'s box lacrosse tournament in Alberta. Three days of intense competition, western hospitality, and unforgettable memories. Teams from across Canada converge on Calgary for this annual championship featuring modified RMLL rules, real-time scoring, and professional-grade facilities.',
    primaryCTA: {
      text: 'View Tournament Package',
      type: 'custom',
      url: '/tournament-package',
      newTab: false,
    },
    secondaryCTA: {
      text: 'Contact tournament director',
      type: 'custom',
      url: '/contact',
      newTab: false,
    },
    enableGradientOverlay: true,
  },
}

export const Mobile: Story = {
  args: {
    backgroundImage: mockBackgroundImage,
    announcementBadge: {
      text: 'Live now!',
      linkText: 'Watch',
      linkUrl: '/live',
    },
    heading: 'Cowtown Showdown',
    subheading: 'Calgary\'s premier box lacrosse tournament.',
    primaryCTA: {
      text: 'Watch Live',
      type: 'custom',
      url: '/live',
      newTab: false,
    },
    secondaryCTA: {
      text: 'Schedule',
      type: 'custom',
      url: '/schedule',
      newTab: false,
    },
    enableGradientOverlay: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const NoBackground: Story = {
  args: {
    heading: 'Fallback Design',
    subheading: 'When no background image is provided, the component falls back to the brand color background.',
    primaryCTA: {
      text: 'Primary Action',
      type: 'custom',
      url: '/action',
      newTab: false,
    },
    secondaryCTA: {
      text: 'Secondary Action',
      type: 'custom',
      url: '/secondary',
      newTab: false,
    },
    enableGradientOverlay: true,
  },
}

export const WithLacrosseImage: Story = {
  args: {
    backgroundImage: {
      id: '2',
      url: '/media/swalm-lax.jpg',
      alt: 'Lacrosse action shot',
      width: 1920,
      height: 1080,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      filename: 'swalm-lax.jpg',
      mimeType: 'image/jpeg',
      filesize: 1024000,
    },
    announcementBadge: {
      text: 'Tournament is live now!',
      linkText: 'View live games',
      linkUrl: '/games/live',
    },
    heading: 'Cowtown Showdown 2024',
    subheading: 'Experience the intensity of Senior Men\'s box lacrosse in Calgary. Eight teams compete for championship glory.',
    primaryCTA: {
      text: 'View Tournament',
      type: 'custom',
      url: '/tournament',
      newTab: false,
    },
    secondaryCTA: {
      text: 'Watch Live',
      type: 'custom',
      url: '/live',
      newTab: false,
    },
    enableGradientOverlay: true,
  },
}

export const DirectImageTest: Story = {
  args: {
    backgroundImage: {
      id: '3',
      url: 'http://localhost:6006/media/swalm-lax.jpg',
      alt: 'Lacrosse action shot - direct test',
      width: 1920,
      height: 1080,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      filename: 'swalm-lax.jpg',
      mimeType: 'image/jpeg',
      filesize: 1024000,
    },
    heading: 'Image Loading Test',
    subheading: 'Testing direct image path with localhost URL for Storybook.',
    primaryCTA: {
      text: 'Test CTA',
      type: 'custom',
      url: '/test',
      newTab: false,
    },
    enableGradientOverlay: true,
  },
}

export const GradientTest: Story = {
  args: {
    backgroundImage: mockBackgroundImage,
    heading: 'Red/White Gradient Test',
    subheading: 'Testing the custom red-to-white gradient overlay over the lacrosse image.',
    primaryCTA: {
      text: 'Primary Button',
      type: 'custom',
      url: '/test',
      newTab: false,
    },
    secondaryCTA: {
      text: 'Secondary Link',
      type: 'custom',
      url: '/test2',
      newTab: false,
    },
    enableGradientOverlay: true,
  },
}

export const NoGradientTest: Story = {
  args: {
    backgroundImage: mockBackgroundImage,
    heading: 'No Gradient Test',
    subheading: 'Testing without gradient to see just the image and dark overlay.',
    primaryCTA: {
      text: 'Primary Button',
      type: 'custom',
      url: '/test',
      newTab: false,
    },
    enableGradientOverlay: false,
  },
}

export const ExternalLinks: Story = {
  args: {
    backgroundImage: mockBackgroundImage,
    announcementBadge: {
      text: 'Watch live on YouTube',
      linkText: 'Open YouTube',
      linkUrl: 'https://youtube.com/watch?v=example',
    },
    heading: 'Stream Live Coverage',
    subheading: 'Follow every goal, every save, and every moment of the tournament with our live streaming coverage.',
    primaryCTA: {
      text: 'Watch on YouTube',
      type: 'custom',
      url: 'https://youtube.com/cowtownshowdown',
      newTab: true,
    },
    secondaryCTA: {
      text: 'Follow on social',
      type: 'custom',
      url: 'https://instagram.com/cowtownshowdown',
      newTab: true,
    },
    enableGradientOverlay: true,
  },
}