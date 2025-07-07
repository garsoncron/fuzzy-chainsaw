import type { Meta, StoryObj } from '@storybook/react'
import { MediaBlock } from './Component'

// Mock media object structure
const createMockMedia = (alt: string, caption?: string) => ({
  id: 'mock-media-id',
  alt,
  filename: 'tournament-photo.jpg',
  mimeType: 'image/jpeg',
  filesize: 245760,
  width: 1200,
  height: 800,
  focalX: 50,
  focalY: 50,
  caption: caption ? {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: caption,
            },
          ],
        },
      ],
    },
  } : undefined,
  url: 'https://picsum.photos/1200/800?random=1',
})

const createMockVideoMedia = (alt: string, caption?: string) => ({
  id: 'mock-video-id',
  alt,
  filename: 'tournament-highlights.mp4',
  mimeType: 'video/mp4',
  filesize: 15728640,
  width: 1920,
  height: 1080,
  caption: caption ? {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: caption,
            },
          ],
        },
      ],
    },
  } : undefined,
  url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
})

const meta: Meta<typeof MediaBlock> = {
  title: 'Blocks/MediaBlock',
  component: MediaBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Media block component for displaying images and videos with optional captions 
throughout the tournament website. Supports responsive design and accessibility features.

### Features
- **Image Support**: High-quality image display with responsive sizing
- **Video Support**: Embedded video content with controls
- **Caption Support**: Rich text captions with formatting
- **Responsive Design**: Adaptive sizing for all screen sizes
- **Accessibility**: Alt text and semantic HTML structure
- **Focal Point**: Smart cropping based on focal point settings

### Use Cases
- Tournament action photography
- Team photos and headshots
- Facility and venue images
- Sponsor logo displays
- Historical tournament photos
- Live stream screenshots
- Award ceremony photos
- Behind-the-scenes content

### Layout Options
- Full-width display
- Container-constrained width
- Custom breakout sizing
- Flexible caption positioning

### Tournament Context
- Game action highlights
- Team roster photos
- Venue and facility showcases
- Sponsor recognition
- Historical moments
- Championship celebrations
        `,
      },
    },
  },
  argTypes: {
    media: {
      description: 'Media object with image/video and metadata',
    },
    breakout: {
      control: 'boolean',
      description: 'Whether to break out of container constraints',
    },
    enableGutter: {
      control: 'boolean',
      description: 'Whether to apply container gutters',
    },
    disableInnerContainer: {
      control: 'boolean',
      description: 'Disable inner container for caption',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the block',
    },
    imgClassName: {
      control: 'text',
      description: 'Additional CSS classes for the image',
    },
    captionClassName: {
      control: 'text',
      description: 'Additional CSS classes for the caption',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MediaBlock>

// Basic image examples
export const BasicImage: Story = {
  args: {
    media: createMockMedia('Tournament action shot'),
    enableGutter: true,
  },
}

export const ImageWithCaption: Story = {
  args: {
    media: createMockMedia('Championship game action', 'Calgary Bears vs Edmonton Storm in the 2024 championship final at the Cowtown Showdown.'),
    enableGutter: true,
  },
}

export const ImageNoGutter: Story = {
  name: 'Full Width Image',
  args: {
    media: createMockMedia('Tournament venue wide shot'),
    enableGutter: false,
  },
}

// Tournament-specific images
export const TeamPhoto: Story = {
  args: {
    media: createMockMedia('Calgary Bears team photo', 'The Calgary Bears celebrate their championship victory at the 2024 Cowtown Showdown.'),
    enableGutter: true,
  },
}

export const ActionShot: Story = {
  args: {
    media: createMockMedia('Player scoring goal', 'Connor McDavid (#97) scores the game-winning goal in overtime to secure the championship for Calgary Bears.'),
    enableGutter: true,
  },
}

export const VenuePhoto: Story = {
  args: {
    media: createMockMedia('Tournament venue', 'The main arena at the Calgary Sportsplex, home of the Cowtown Showdown since 2018.'),
    enableGutter: true,
  },
}

export const AwardCeremony: Story = {
  args: {
    media: createMockMedia('Championship trophy presentation', 'Tournament organizers present the championship trophy to the Calgary Bears captain following their victory.'),
    enableGutter: true,
  },
}

export const ThreeStarsPhoto: Story = {
  args: {
    media: createMockMedia('Three stars of the game', 'The three stars of the championship game: Connor McDavid (1st), Leon Draisaitl (2nd), and Stuart Skinner (3rd).'),
    enableGutter: true,
  },
}

// Historical and archival content
export const HistoricalPhoto: Story = {
  args: {
    media: createMockMedia('1995 tournament winners', 'The original Calgary team that won the first-ever Cowtown Showdown in 1995, establishing the tournament tradition.'),
    enableGutter: true,
  },
}

export const TournamentEvolution: Story = {
  args: {
    media: createMockMedia('Tournament growth over time', 'From 4 teams in 1995 to 8 teams today - the Cowtown Showdown continues to grow and attract top talent.'),
    enableGutter: true,
  },
}

// Sponsor and partnership content
export const SponsorLogo: Story = {
  args: {
    media: createMockMedia('Tournament sponsor logo', 'Proudly sponsored by local Calgary businesses supporting lacrosse in the community.'),
    enableGutter: true,
    imgClassName: 'max-w-md mx-auto',
  },
}

export const PartnershipPhoto: Story = {
  args: {
    media: createMockMedia('Community partnership', 'Tournament organizers with representatives from the Calgary Lacrosse Association, continuing the partnership for youth development.'),
    enableGutter: true,
  },
}

// Behind-the-scenes content
export const BehindTheScenes: Story = {
  args: {
    media: createMockMedia('Equipment preparation', 'Tournament volunteers prepare equipment and set up the arena early Saturday morning before the first games.'),
    enableGutter: true,
  },
}

export const ScorekeeperSetup: Story = {
  args: {
    media: createMockMedia('Scorekeeper training', 'Volunteer scorekeepers receive training on the electronic scoring system before tournament play begins.'),
    enableGutter: true,
  },
}

// Live streaming and technology
export const LiveStreamSetup: Story = {
  args: {
    media: createMockMedia('Live streaming equipment', 'Professional streaming equipment captures every moment of the medal games for online viewers.'),
    enableGutter: true,
  },
}

export const StatisticsDisplay: Story = {
  args: {
    media: createMockMedia('Live statistics dashboard', 'Real-time game statistics and scoring updates displayed throughout the tournament.'),
    enableGutter: true,
  },
}

// Video content examples
export const TournamentHighlights: Story = {
  args: {
    media: createMockVideoMedia('Tournament highlight reel', '2024 Cowtown Showdown highlights featuring the best goals, saves, and moments from the championship weekend.'),
    enableGutter: true,
  },
}

export const InterviewVideo: Story = {
  args: {
    media: createMockVideoMedia('Championship interview', 'Post-game interview with Calgary Bears captain Connor McDavid following the championship victory.'),
    enableGutter: true,
  },
}

// Layout variations
export const Breakout: Story = {
  args: {
    media: createMockMedia('Wide tournament panorama'),
    breakout: true,
    enableGutter: false,
  },
}

export const CustomSizing: Story = {
  args: {
    media: createMockMedia('Team portrait'),
    enableGutter: true,
    imgClassName: 'max-w-lg mx-auto rounded-lg shadow-lg',
  },
}

// Caption variations
export const DetailedCaption: Story = {
  args: {
    media: {
      ...createMockMedia('Game-winning moment'),
      caption: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The decisive moment: ',
                  bold: true,
                },
                {
                  type: 'text',
                  text: 'With 1:23 remaining in overtime, Connor McDavid (#97) scores the championship-winning goal for the Calgary Bears. This marks their ',
                },
                {
                  type: 'text',
                  text: 'third consecutive',
                  italic: true,
                },
                {
                  type: 'text',
                  text: ' Cowtown Showdown victory.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Photo credit: Tournament photographer Sarah Johnson',
                  italic: true,
                },
              ],
            },
          ],
        },
      },
    },
    enableGutter: true,
  },
}

export const NoCaption: Story = {
  args: {
    media: createMockMedia('Action shot without caption'),
    enableGutter: true,
  },
}

// Mobile responsive examples
export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    media: createMockMedia('Mobile optimized image', 'Tournament action optimized for mobile viewing with clear visibility of key moments.'),
    enableGutter: true,
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
    media: createMockMedia('Tablet optimized display', 'Perfect sizing for tablet users viewing tournament content and photo galleries.'),
    enableGutter: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

// Content context examples
export const BlogPostContext: Story = {
  name: 'Blog Post Context',
  args: {
    media: createMockMedia('Embedded blog image', 'Mid-article image showing tournament highlights within a blog post about the championship game.'),
    enableGutter: true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto">
        <article className="prose prose-lg">
          <h1>Championship Game Recap: Bears Complete Three-Peat</h1>
          <p>
            The Calgary Bears have done it again, capturing their third consecutive Cowtown Showdown 
            championship in dramatic fashion. In a thrilling overtime battle against the Edmonton Storm, 
            the Bears secured victory with a stunning goal by Connor McDavid.
          </p>
          <Story />
          <p>
            The tournament, which has been running for nearly three decades, continues to showcase 
            the highest level of senior men's lacrosse in Western Canada. This year's event drew 
            over 2,000 spectators and was live-streamed to fans across the country.
          </p>
        </article>
      </div>
    ),
  ],
}

export const PhotoGalleryContext: Story = {
  name: 'Photo Gallery Context',
  args: {
    media: createMockMedia('Gallery featured image', 'Featured image from the 2024 tournament photo gallery showcasing the championship celebration.'),
    enableGutter: true,
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">2024 Tournament Photo Gallery</h1>
            <p className="text-muted-foreground">Capturing the best moments from this year's championship weekend</p>
          </header>
          <Story />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
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
    media: createMockMedia('High contrast optimized image', 'Tournament image optimized for high contrast viewing and accessibility.'),
    enableGutter: true,
  },
  decorators: [
    (Story) => (
      <div style={{ filter: 'contrast(1.5)' }}>
        <Story />
      </div>
    ),
  ],
}

// Error states
export const BrokenImage: Story = {
  name: 'Image Load Error',
  args: {
    media: {
      ...createMockMedia('Image that failed to load', 'This image caption will still display even if the image fails to load.'),
      url: 'https://broken-url-example.com/missing-image.jpg',
    },
    enableGutter: true,
  },
}

export const MissingMedia: Story = {
  name: 'No Media Provided',
  args: {
    media: undefined,
    enableGutter: true,
  },
}