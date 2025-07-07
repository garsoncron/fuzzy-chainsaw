import type { Meta, StoryObj } from '@storybook/react'
import { CallToActionBlock } from './Component'

// Mock rich text content structure
const createMockRichText = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text,
          },
        ],
      },
    ],
  },
})

// Mock link structure
const createMockLink = (label: string, url: string, type: 'internal' | 'external' = 'external') => ({
  link: {
    type: 'custom',
    url,
    label,
    appearance: 'primary',
    newTab: type === 'external',
  },
})

const meta: Meta<typeof CallToActionBlock> = {
  title: 'Blocks/CallToAction',
  component: CallToActionBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Call-to-Action block component designed to drive user engagement and conversions 
throughout the tournament website. Features prominent messaging with action buttons.

### Features
- **Rich Text Content**: Full rich text support for compelling messaging
- **Multiple Links**: Support for multiple action buttons
- **Responsive Layout**: Stacked on mobile, side-by-side on desktop
- **Flexible Styling**: Adaptable to different campaign needs
- **High Contrast**: Prominent design for maximum visibility

### Use Cases
- Tournament registration calls
- Team captain recruitment
- Sponsor partnership opportunities
- Volunteer recruitment
- Merchandise sales
- Live stream promotions
- Post-tournament surveys

### Design Pattern
- Left side: Compelling message with rich text formatting
- Right side: Primary action buttons (1-3 recommended)
- Full-width container with card background
- Consistent spacing and typography

### Tournament Context
- Drive registration conversions
- Promote live streaming
- Encourage social media engagement
- Collect contact information
- Promote future tournaments
        `,
      },
    },
  },
  argTypes: {
    richText: {
      description: 'Rich text content for the call-to-action message',
    },
    links: {
      description: 'Array of action links/buttons',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CallToActionBlock>

// Basic examples
export const SingleAction: Story = {
  args: {
    richText: createMockRichText('Ready to compete in Western Canada\'s premier lacrosse tournament? Register your team today and join the excitement!'),
    links: [
      createMockLink('Register Now', '/register'),
    ],
  },
}

export const MultipleActions: Story = {
  args: {
    richText: createMockRichText('Don\'t miss the championship action! Follow live scores, watch the stream, and join the conversation.'),
    links: [
      createMockLink('Live Scores', '/live'),
      createMockLink('Watch Stream', 'https://youtube.com/watch?v=example'),
      createMockLink('Join Discord', 'https://discord.gg/example'),
    ],
  },
}

// Tournament-specific scenarios
export const RegistrationCTA: Story = {
  name: 'Tournament Registration',
  args: {
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h3',
            children: [
              {
                type: 'text',
                text: 'Join the 2024 Cowtown Showdown',
                bold: true,
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Registration is now open for teams across Western Canada. Secure your spot in this year\'s tournament with early bird pricing available until June 15th.',
              },
            ],
          },
        ],
      },
    },
    links: [
      createMockLink('Register Your Team', '/register'),
      createMockLink('View Tournament Info', '/tournament-info'),
    ],
  },
}

export const LiveStreamPromo: Story = {
  name: 'Live Stream Promotion',
  args: {
    richText: createMockRichText('🔴 LIVE NOW: Championship game between Calgary Bears and Edmonton Storm! Don\'t miss the action.'),
    links: [
      createMockLink('Watch Live', 'https://youtube.com/live/championship'),
      createMockLink('Live Stats', '/live-stats'),
    ],
  },
}

export const VolunteerRecruitment: Story = {
  name: 'Volunteer Recruitment',
  args: {
    richText: createMockRichText('Help make the tournament a success! We need volunteers for scorekeeping, equipment management, and event coordination.'),
    links: [
      createMockLink('Volunteer Sign-up', '/volunteer'),
      createMockLink('Learn More', '/volunteer-info'),
    ],
  },
}

export const SponsorshipCTA: Story = {
  name: 'Sponsorship Opportunity',
  args: {
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h3',
            children: [
              {
                type: 'text',
                text: 'Partner with the Cowtown Showdown',
                bold: true,
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Join our community of sponsors and support Western Canada\'s premier lacrosse tournament. Multiple sponsorship packages available.',
              },
            ],
          },
        ],
      },
    },
    links: [
      createMockLink('Sponsorship Packages', '/sponsorship'),
      createMockLink('Contact Us', '/contact'),
    ],
  },
}

export const TeamCaptainCTA: Story = {
  name: 'Team Captain Resources',
  args: {
    richText: createMockRichText('Team captains: Access your dashboard to manage rosters, view schedules, and submit final paperwork before the tournament.'),
    links: [
      createMockLink('Captain Dashboard', '/captain'),
      createMockLink('Submit Roster', '/roster'),
    ],
  },
}

// Post-tournament scenarios
export const SurveyRequest: Story = {
  name: 'Post-Tournament Survey',
  args: {
    richText: createMockRichText('Thanks for an amazing tournament! Help us improve by sharing your feedback and experience.'),
    links: [
      createMockLink('Take Survey', 'https://survey.example.com'),
      createMockLink('Photo Gallery', '/photos'),
    ],
  },
}

export const NextYearPromo: Story = {
  name: 'Next Year Promotion',
  args: {
    richText: createMockRichText('Save the date! The 2025 Cowtown Showdown will be even bigger and better. Get early access to registration.'),
    links: [
      createMockLink('Join Mailing List', '/newsletter'),
      createMockLink('Follow Updates', 'https://facebook.com/cowtownshowdown'),
    ],
  },
}

// Content variations
export const ShortMessage: Story = {
  name: 'Short Message',
  args: {
    richText: createMockRichText('Game day is here!'),
    links: [
      createMockLink('View Schedule', '/schedule'),
    ],
  },
}

export const DetailedMessage: Story = {
  name: 'Detailed Message',
  args: {
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              {
                type: 'text',
                text: 'Experience Championship Lacrosse',
                bold: true,
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'The Cowtown Showdown brings together ',
              },
              {
                type: 'text',
                text: '8 elite teams',
                bold: true,
              },
              {
                type: 'text',
                text: ' from across Western Canada for three days of intense competition. With a ',
              },
              {
                type: 'text',
                text: 'unique 5-point scoring system',
                italic: true,
              },
              {
                type: 'text',
                text: ' and live streaming of all medal games, this is lacrosse at its finest.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Registration includes all games, tournament merchandise, and access to the post-tournament celebration.',
              },
            ],
          },
        ],
      },
    },
    links: [
      createMockLink('Register Team', '/register'),
      createMockLink('Tournament Rules', '/rules'),
      createMockLink('Past Results', '/history'),
    ],
  },
}

// Emergency/urgent CTAs
export const UrgentRegistration: Story = {
  name: 'Urgent Registration',
  args: {
    richText: createMockRichText('⏰ Final call! Registration closes in 48 hours. Only 2 spots remaining for the 2024 tournament.'),
    links: [
      createMockLink('Register Immediately', '/register-urgent'),
    ],
  },
}

export const LastMinuteChanges: Story = {
  name: 'Last Minute Changes',
  args: {
    richText: createMockRichText('🚨 Important update: Game locations have changed due to facility maintenance. Check your updated schedule.'),
    links: [
      createMockLink('View New Schedule', '/schedule-updated'),
      createMockLink('Get Notifications', '/notifications'),
    ],
  },
}

// Merchandise and revenue
export const MerchandiseCTA: Story = {
  name: 'Tournament Merchandise',
  args: {
    richText: createMockRichText('Get your official Cowtown Showdown gear! Limited edition tournament t-shirts, hoodies, and accessories available.'),
    links: [
      createMockLink('Shop Now', '/merchandise'),
      createMockLink('Size Guide', '/sizing'),
    ],
  },
}

// Social media and community
export const SocialMediaCTA: Story = {
  name: 'Social Media Engagement',
  args: {
    richText: createMockRichText('Share your tournament experience! Tag us in your photos and follow along for behind-the-scenes content.'),
    links: [
      createMockLink('Follow on Instagram', 'https://instagram.com/cowtownshowdown'),
      createMockLink('Join Facebook Group', 'https://facebook.com/groups/cowtownlacrosse'),
    ],
  },
}

// Mobile responsive examples
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    richText: createMockRichText('Tournament app now available! Get live scores, schedules, and notifications on your phone.'),
    links: [
      createMockLink('Download App', '/mobile-app'),
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const Tablet: Story = {
  name: 'Tablet View',
  args: {
    richText: createMockRichText('Team captains: Complete your roster submissions and payment processing before the deadline.'),
    links: [
      createMockLink('Captain Portal', '/captain'),
      createMockLink('Make Payment', '/payment'),
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

// Tournament website context
export const HomepageContext: Story = {
  name: 'Homepage Context',
  args: {
    richText: createMockRichText('Join Western Canada\'s premier senior men\'s lacrosse tournament. Three days of championship competition await!'),
    links: [
      createMockLink('Register Now', '/register'),
      createMockLink('Learn More', '/about'),
    ],
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-western text-primary-brown mb-4">
              Cowtown Showdown 2024
            </h1>
            <p className="text-xl text-muted-foreground">
              July 12-14 • Calgary, Alberta
            </p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Live Scores</h2>
              <p>Current games and results...</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Tournament Standings</h2>
              <p>Team rankings and statistics...</p>
            </div>
          </div>
          
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

// A/B testing scenarios
export const VariantA: Story = {
  name: 'CTA Variant A (Action Focused)',
  args: {
    richText: createMockRichText('Don\'t miss out! Secure your team\'s spot in the tournament today.'),
    links: [
      createMockLink('Register Now', '/register'),
    ],
  },
}

export const VariantB: Story = {
  name: 'CTA Variant B (Benefit Focused)',
  args: {
    richText: createMockRichText('Join 8 elite teams competing for the championship title and $5,000 in prizes.'),
    links: [
      createMockLink('Join the Competition', '/register'),
    ],
  },
}

// No links edge case
export const TextOnly: Story = {
  name: 'Text Only (No Links)',
  args: {
    richText: createMockRichText('Tournament registration is currently closed. Check back next year for the 2025 Cowtown Showdown!'),
    links: [],
  },
}