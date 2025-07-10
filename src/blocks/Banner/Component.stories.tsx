import type { Meta, StoryObj } from '@storybook/react'
import { BannerBlock } from './Component'

// Mock rich text content structure
const createMockContent = (text: string) => ({
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

const meta: Meta<typeof BannerBlock> = {
  title: 'Blocks/Banner',
  component: BannerBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Banner block component for displaying important messages, alerts, and notifications 
throughout the tournament website. Features multiple style variants for different 
message types and semantic color coding.

### Features
- **Style Variants**: Info, Success, Warning, Error
- **Rich Text Content**: Full rich text support with formatting
- **Semantic Colors**: Color-coded based on message importance
- **Responsive Design**: Full-width with consistent spacing
- **Accessibility**: Proper contrast ratios and semantic HTML

### Use Cases
- Tournament announcements
- Schedule changes and updates
- Emergency notifications
- Success confirmations
- System status messages
- Registration information

### Style Guidelines
- **Info**: General information and announcements
- **Success**: Positive confirmations and completions
- **Warning**: Important notices requiring attention
- **Error**: Critical alerts and error messages

### Tournament Context
- Game schedule updates
- Weather-related announcements
- Registration deadlines
- Payment confirmations
- Live stream notifications
        `,
      },
    },
  },
  argTypes: {
    content: {
      description: 'Rich text content for the banner message',
    },
    style: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
      description: 'Visual style variant for the banner',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BannerBlock>

// Basic style variants
export const Info: Story = {
  args: {
    content: createMockContent('Tournament registration is now open! Register your team by July 1st to secure your spot.'),
    style: 'info',
  },
}

export const Success: Story = {
  args: {
    content: createMockContent('Your team registration has been successfully submitted! Welcome to the Cowtown Showdown.'),
    style: 'success',
  },
}

export const Warning: Story = {
  args: {
    content: createMockContent('Important: Final roster submission deadline is approaching. Submit your roster by 11:59 PM tonight.'),
    style: 'warning',
  },
}

export const Error: Story = {
  args: {
    content: createMockContent('Payment failed: Unable to process your tournament registration fee. Please try again or contact support.'),
    style: 'error',
  },
}

// Tournament-specific content
export const ScheduleUpdate: Story = {
  name: 'Schedule Update',
  args: {
    content: createMockContent('Game schedule updated: All Day 2 games moved to 1 hour later due to weather conditions.'),
    style: 'warning',
  },
}

export const LiveStreamAlert: Story = {
  name: 'Live Stream Available',
  args: {
    content: createMockContent('🔴 LIVE: Championship game now streaming on YouTube! Watch the final showdown between Calgary Bears and Edmonton Storm.'),
    style: 'info',
  },
}

export const RegistrationSuccess: Story = {
  name: 'Registration Confirmed',
  args: {
    content: createMockContent('✅ Team registration confirmed! Check your email for tournament details and schedule information.'),
    style: 'success',
  },
}

export const WeatherAlert: Story = {
  name: 'Weather Alert',
  args: {
    content: createMockContent('⚠️ Weather Advisory: Thunderstorms possible this afternoon. All outdoor activities may be moved indoors.'),
    style: 'warning',
  },
}

export const SystemError: Story = {
  name: 'System Error',
  args: {
    content: createMockContent('❌ Live scoring system temporarily unavailable. Scores will be updated manually until service is restored.'),
    style: 'error',
  },
}

// Content length variations
export const ShortMessage: Story = {
  name: 'Short Message',
  args: {
    content: createMockContent('Tournament starts tomorrow!'),
    style: 'info',
  },
}

export const LongMessage: Story = {
  name: 'Long Message',
  args: {
    content: createMockContent('The Cowtown Showdown lacrosse tournament has been running for over 20 years, bringing together the best senior men\'s teams from across Western Canada. This year\'s tournament features 8 teams competing in a round-robin format with medal games on the final day. Registration includes all games, tournament t-shirt, and post-tournament barbecue.'),
    style: 'info',
  },
}

// Rich text content examples
export const RichTextContent: Story = {
  name: 'Formatted Text',
  args: {
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Important: ',
                bold: true,
              },
              {
                type: 'text',
                text: 'All teams must submit their ',
              },
              {
                type: 'text',
                text: 'final roster',
                italic: true,
              },
              {
                type: 'text',
                text: ' by ',
              },
              {
                type: 'text',
                text: 'July 10th at 11:59 PM',
                bold: true,
              },
              {
                type: 'text',
                text: '. Late submissions will not be accepted.',
              },
            ],
          },
        ],
      },
    },
    style: 'warning',
  },
}

// Tournament progression messages
export const TournamentStarted: Story = {
  name: 'Tournament Started',
  args: {
    content: createMockContent('🏆 The 2024 Cowtown Showdown has officially begun! Follow live scores and updates throughout the tournament.'),
    style: 'success',
  },
}

export const ChampionshipDay: Story = {
  name: 'Championship Day',
  args: {
    content: createMockContent('🥇 Championship Day is here! Medal games begin at 2:00 PM. May the best teams win!'),
    style: 'info',
  },
}

export const TournamentComplete: Story = {
  name: 'Tournament Complete',
  args: {
    content: createMockContent('🎉 Congratulations to all teams! The 2024 Cowtown Showdown is now complete. Thank you for an amazing tournament!'),
    style: 'success',
  },
}

// Emergency scenarios
export const EmergencyAlert: Story = {
  name: 'Emergency Alert',
  args: {
    content: createMockContent('🚨 EMERGENCY: All games suspended immediately due to severe weather. Please evacuate to the main building.'),
    style: 'error',
  },
}

export const FacilityAlert: Story = {
  name: 'Facility Alert',
  args: {
    content: createMockContent('⚠️ Facility Alert: Arena 2 is temporarily closed for maintenance. Games 15-18 moved to Arena 1 with adjusted times.'),
    style: 'warning',
  },
}

// Payment and registration
export const PaymentReminder: Story = {
  name: 'Payment Reminder',
  args: {
    content: createMockContent('💳 Payment reminder: Tournament fees are due within 48 hours of registration to secure your team\'s spot.'),
    style: 'warning',
  },
}

export const PaymentComplete: Story = {
  name: 'Payment Complete',
  args: {
    content: createMockContent('✅ Payment received! Your team is now fully registered for the tournament. Welcome to the Cowtown Showdown!'),
    style: 'success',
  },
}

// COVID/Health protocols
export const HealthProtocol: Story = {
  name: 'Health Protocol',
  args: {
    content: createMockContent('🏥 Health Reminder: All participants must complete the health screening form before entering the facility each day.'),
    style: 'info',
  },
}

// Responsive examples
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    content: createMockContent('Tournament update: Game 12 delayed by 30 minutes due to equipment setup.'),
    style: 'warning',
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
    content: createMockContent('Live streaming now available for all medal games! Watch the championship action online.'),
    style: 'info',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

// Multiple banners scenario
export const MultipleBanners: Story = {
  name: 'Multiple Banners',
  render: () => (
    <div className="space-y-4">
      <BannerBlock
        content={createMockContent('🔴 LIVE: Championship game in progress')}
        style="info"
      />
      <BannerBlock
        content={createMockContent('Weather alert: Rain expected this afternoon')}
        style="warning"
      />
      <BannerBlock
        content={createMockContent('Registration deadline extended to July 15th')}
        style="success"
      />
    </div>
  ),
}

// Tournament website context
export const TournamentHomepage: Story = {
  name: 'Tournament Homepage',
  args: {
    content: createMockContent('🏆 Welcome to the 2024 Cowtown Showdown! Check the schedule for your team\'s game times and follow live scores throughout the tournament.'),
    style: 'info',
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-western text-primary-brown mb-2">
              Cowtown Showdown 2024
            </h1>
            <p className="text-muted-foreground">
              Senior Men&apos;s Box Lacrosse Tournament
            </p>
          </header>
          <Story />
          <div className="mt-8 bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Tournament Information</h2>
            <p>Content would continue here...</p>
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
  name: 'High Contrast',
  args: {
    content: createMockContent('Important announcement: Tournament schedule has been updated.'),
    style: 'warning',
  },
  decorators: [
    (Story) => (
      <div style={{ filter: 'contrast(1.5)' }}>
        <Story />
      </div>
    ),
  ],
}

export const DarkMode: Story = {
  name: 'Dark Mode',
  args: {
    content: createMockContent('System maintenance scheduled for tonight from 11 PM to 1 AM.'),
    style: 'info',
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 p-6 rounded">
        <Story />
      </div>
    ),
  ],
}