import type { Meta, StoryObj } from '@storybook/react'
import { HeaderClient } from './Component.client'
import type { Header } from '@/payload-types'

const meta: Meta<typeof HeaderClient> = {
  title: 'Navigation/Header',
  component: HeaderClient,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Clean header component using Tailwind UI template structure. Features logo on left, centered navigation with dropdowns, and right-side CTA. Mobile menu slides from right with proper close functionality.'
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

// Mock header data for stories matching the site information architecture
const mockHeaderData: Header = {
  id: 1,
  // CMS Logo - Tournament logo (using uploaded SVG)
  logo: {
    id: 'logo-1',
    url: '/media/cowtown-logo.svg',
    alt: 'Cowtown Showdown',
    width: 140,
    height: 50,
    mimeType: 'image/svg+xml',
    filesize: 25000,
    filename: 'cowtown-logo.svg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Header columns based on complete information architecture
  headerColumns: [
    {
      id: 'col-tournament',
      title: {
        title: 'Tournament',
        enableLink: true,
        link: { type: 'custom', url: '/tournament', label: 'Tournament' }
      },
      subMenuItems: [
        {
          id: 'sub-schedule',
          linkText: 'Schedule',
          link: { type: 'custom', url: '/tournament/schedule', label: 'Schedule' }
        },
        {
          id: 'sub-standings',
          linkText: 'Standings',
          link: { type: 'custom', url: '/tournament/standings' }
        },
        {
          id: 'sub-bracket',
          linkText: 'Bracket',
          link: { type: 'custom', url: '/tournament/bracket' }
        },
        {
          id: 'sub-stats',
          linkText: 'Statistics',
          link: { type: 'custom', url: '/tournament/stats' }
        },
        {
          id: 'sub-rules',
          linkText: 'Rules & Format',
          link: { type: 'custom', url: '/tournament/rules' }
        }
      ]
    },
    {
      id: 'col-teams',
      title: {
        title: 'Teams',
        enableLink: true,
        link: { type: 'custom', url: '/teams' }
      },
      subMenuItems: [
        {
          id: 'sub-calgary-bears',
          linkText: 'Calgary Bears',
          link: { type: 'custom', url: '/teams/calgary-bears' }
        },
        {
          id: 'sub-edmonton-warriors',
          linkText: 'Edmonton Warriors',
          link: { type: 'custom', url: '/teams/edmonton-warriors' }
        },
        {
          id: 'sub-red-deer-rebels',
          linkText: 'Red Deer Rebels',
          link: { type: 'custom', url: '/teams/red-deer-rebels' }
        },
        {
          id: 'sub-lethbridge-hurricanes',
          linkText: 'Lethbridge Hurricanes',
          link: { type: 'custom', url: '/teams/lethbridge-hurricanes' }
        },
        {
          id: 'sub-medicine-hat-mavericks',
          linkText: 'Medicine Hat Mavericks',
          link: { type: 'custom', url: '/teams/medicine-hat-mavericks' }
        },
        {
          id: 'sub-grande-prairie-storm',
          linkText: 'Grande Prairie Storm',
          link: { type: 'custom', url: '/teams/grande-prairie-storm' }
        },
        {
          id: 'sub-fort-mcmurray-oil-barons',
          linkText: 'Fort McMurray Oil Barons',
          link: { type: 'custom', url: '/teams/fort-mcmurray-oil-barons' }
        },
        {
          id: 'sub-lloydminster-border-kings',
          linkText: 'Lloydminster Border Kings',
          link: { type: 'custom', url: '/teams/lloydminster-border-kings' }
        }
      ]
    },
    {
      id: 'col-players',
      title: {
        title: 'Players',
        enableLink: true,
        link: { type: 'custom', url: '/players' }
      },
      subMenuItems: [
        {
          id: 'sub-all-players',
          linkText: 'Player Directory',
          link: { type: 'custom', url: '/players' }
        },
        {
          id: 'sub-top-scorers',
          linkText: 'Top Scorers',
          link: { type: 'custom', url: '/players?sort=points' }
        },
        {
          id: 'sub-goalies',
          linkText: 'Goalies',
          link: { type: 'custom', url: '/players?position=goalie' }
        }
      ]
    },
    {
      id: 'col-games',
      title: {
        title: 'Games',
        enableLink: true,
        link: { type: 'custom', url: '/games' }
      },
      subMenuItems: [
        {
          id: 'sub-all-games',
          linkText: 'All Games',
          link: { type: 'custom', url: '/games' }
        },
        {
          id: 'sub-live-games',
          linkText: 'Live Dashboard',
          link: { type: 'custom', url: '/games/live' }
        },
        {
          id: 'sub-day-1-games',
          linkText: 'Day 1 Games',
          link: { type: 'custom', url: '/games?day=1' }
        },
        {
          id: 'sub-day-2-games',
          linkText: 'Day 2 Games',
          link: { type: 'custom', url: '/games?day=2' }
        },
        {
          id: 'sub-day-3-games',
          linkText: 'Day 3 Games',
          link: { type: 'custom', url: '/games?day=3' }
        }
      ]
    },
    {
      id: 'col-media',
      title: {
        title: 'Media',
        enableLink: true,
        link: { type: 'custom', url: '/media' }
      },
      subMenuItems: [
        {
          id: 'sub-photos',
          linkText: 'Photo Gallery',
          link: { type: 'custom', url: '/media/photos' }
        },
        {
          id: 'sub-videos',
          linkText: 'Video Highlights',
          link: { type: 'custom', url: '/media/videos' }
        },
        {
          id: 'sub-highlights',
          linkText: 'Game Highlights',
          link: { type: 'custom', url: '/media/highlights' }
        },
        {
          id: 'sub-news',
          linkText: 'News & Updates',
          link: { type: 'custom', url: '/news' }
        }
      ]
    }
  ],
  // Call to Action
  cta: {
    ctaText: 'View Schedule',
    link: { type: 'custom', url: '/tournament/schedule', label: 'View Schedule' }
  },
  // Legacy nav items for backward compatibility
  navItems: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Tournament information focused header
const mockHeaderWithAbout = {
  ...mockHeaderData,
  headerColumns: [
    {
      id: 'col-tournament',
      title: {
        title: 'Tournament',
        enableLink: true,
        link: { type: 'custom', url: '/tournament', label: 'Tournament' }
      },
      subMenuItems: [
        {
          id: 'sub-schedule',
          linkText: 'Schedule',
          link: { type: 'custom', url: '/tournament/schedule', label: 'Schedule' }
        },
        {
          id: 'sub-standings',
          linkText: 'Standings',
          link: { type: 'custom', url: '/tournament/standings' }
        },
        {
          id: 'sub-bracket',
          linkText: 'Bracket',
          link: { type: 'custom', url: '/tournament/bracket' }
        },
        {
          id: 'sub-stats',
          linkText: 'Statistics',
          link: { type: 'custom', url: '/tournament/stats' }
        },
        {
          id: 'sub-rules',
          linkText: 'Rules & Format',
          link: { type: 'custom', url: '/tournament/rules' }
        }
      ]
    },
    {
      id: 'col-teams',
      title: {
        title: 'Teams',
        enableLink: true,
        link: { type: 'custom', url: '/teams' }
      },
      subMenuItems: [
        {
          id: 'sub-all-teams',
          linkText: 'All Teams',
          link: { type: 'custom', url: '/teams' }
        },
        {
          id: 'sub-players',
          linkText: 'Players',
          link: { type: 'custom', url: '/players' }
        }
      ]
    },
    {
      id: 'col-games',
      title: {
        title: 'Games',
        enableLink: true,
        link: { type: 'custom', url: '/games' }
      },
      subMenuItems: [
        {
          id: 'sub-all-games',
          linkText: 'All Games',
          link: { type: 'custom', url: '/games' }
        },
        {
          id: 'sub-live-games',
          linkText: 'Live Dashboard',
          link: { type: 'custom', url: '/games/live' }
        }
      ]
    },
    {
      id: 'col-media',
      title: {
        title: 'Media',
        enableLink: true,
        link: { type: 'custom', url: '/media' }
      },
      subMenuItems: [
        {
          id: 'sub-photos',
          linkText: 'Photo Gallery',
          link: { type: 'custom', url: '/media/photos' }
        },
        {
          id: 'sub-videos',
          linkText: 'Video Highlights',
          link: { type: 'custom', url: '/media/videos' }
        },
        {
          id: 'sub-news',
          linkText: 'News & Updates',
          link: { type: 'custom', url: '/news' }
        }
      ]
    },
    {
      id: 'col-about',
      title: {
        title: 'About',
        enableLink: true,
        link: { type: 'custom', url: '/about' }
      },
      subMenuItems: [
        {
          id: 'sub-about-tournament',
          linkText: 'Tournament Info',
          link: { type: 'custom', url: '/about/tournament' }
        },
        {
          id: 'sub-venue',
          linkText: 'Venue & Location',
          link: { type: 'custom', url: '/about/venue' }
        },
        {
          id: 'sub-volunteers',
          linkText: 'Volunteers',
          link: { type: 'custom', url: '/about/volunteers' }
        },
        {
          id: 'sub-sponsors',
          linkText: 'Sponsors',
          link: { type: 'custom', url: '/about/sponsors' }
        },
        {
          id: 'sub-contact',
          linkText: 'Contact Us',
          link: { type: 'custom', url: '/contact' }
        }
      ]
    }
  ]
}

// Simplified navigation for mobile-first approach
const mockHeaderSimple = {
  ...mockHeaderData,
  headerColumns: [
    {
      id: 'col-schedule',
      title: {
        title: 'Schedule',
        enableLink: true,
        link: { type: 'custom', url: '/tournament/schedule' }
      },
      subMenuItems: []
    },
    {
      id: 'col-standings',
      title: {
        title: 'Standings',
        enableLink: true,
        link: { type: 'custom', url: '/tournament/standings' }
      },
      subMenuItems: []
    },
    {
      id: 'col-teams',
      title: {
        title: 'Teams',
        enableLink: true,
        link: { type: 'custom', url: '/teams' }
      },
      subMenuItems: []
    },
    {
      id: 'col-live',
      title: {
        title: 'Live',
        enableLink: true,
        link: { type: 'custom', url: '/games/live' }
      },
      subMenuItems: []
    }
  ],
  cta: {
    ctaText: 'Buy Tickets',
    link: { type: 'custom', url: 'tel:403-555-0100' }
  }
}

export const Default: Story = {
  args: {
    data: {
      id: 1,
      logo: null,
      headerColumns: [], // Empty - will trigger fallback navigation
      cta: {
        ctaText: 'View Schedule',
        link: { type: 'custom', url: '/tournament/schedule', label: 'View Schedule' }
      },
      navItems: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    liveGamesCount: 0,
    showLiveIndicator: false
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Default header showing fallback navigation (what real app probably shows)'
      }
    }
  }
}

// Debug story to verify data structure
export const DebugData: Story = {
  args: {
    data: {
      id: 999,
      logo: null,
      headerColumns: [
        {
          id: 'debug-1',
          title: {
            title: 'TEST NAV',
            enableLink: true,
            link: { 
              type: 'custom', 
              url: '/test',
              label: 'TEST NAV'
            }
          },
          subMenuItems: null
        }
      ],
      cta: {
        ctaText: 'TEST CTA',
        link: { 
          type: 'custom', 
          url: '/test-cta',
          label: 'TEST CTA'
        }
      },
      navItems: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    liveGamesCount: 0,
    showLiveIndicator: false
  },
  render: (args) => {
    console.log('Header Debug Data:', args.data)
    console.log('Header Columns:', args.data.headerColumns)
    console.log('Navigation check:', args.data.headerColumns && args.data.headerColumns.length > 0)
    return (
      <div style={{ border: '2px solid red', padding: '10px', minWidth: '1200px' }}>
        <HeaderClient {...args} />
      </div>
    )
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Debug story to check data structure in console - should show TEST NAV'
      }
    }
  }
}

// Simple test with minimal data
export const MinimalTest: Story = {
  args: {
    data: {
      id: 'test',
      logo: null,
      headerColumns: [
        {
          id: 'test-1',
          title: {
            title: 'Test Menu',
            enableLink: true,
            link: { type: 'custom', url: '/test' }
          },
          subMenuItems: [
            {
              id: 'test-sub-1',
              linkText: 'Test Sub Item',
              link: { type: 'custom', url: '/test/sub' }
            }
          ]
        }
      ],
      cta: {
        ctaText: 'Test CTA',
        link: { type: 'custom', url: '/test-cta' }
      },
      navItems: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    } as Header,
    liveGamesCount: 0,
    showLiveIndicator: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal test to verify component works with simple data'
      }
    }
  }
}

// Ultra simple test with just basic navigation - GUARANTEED TO WORK
export const BasicNavigation: Story = {
  args: {
    data: {
      id: 2,
      logo: null,
      headerColumns: [
        {
          id: 'nav-1',
          title: {
            title: 'Tournament',
            enableLink: true,
            link: { 
              type: 'custom', 
              url: '/tournament',
              label: 'Tournament'
            }
          },
          subMenuItems: null
        },
        {
          id: 'nav-2',
          title: {
            title: 'Teams',
            enableLink: true,
            link: { 
              type: 'custom', 
              url: '/teams',
              label: 'Teams'
            }
          },
          subMenuItems: null
        },
        {
          id: 'nav-3',
          title: {
            title: 'Games',
            enableLink: true,
            link: { 
              type: 'custom', 
              url: '/games',
              label: 'Games'
            }
          },
          subMenuItems: null
        }
      ],
      cta: {
        ctaText: 'View Schedule',
        link: { 
          type: 'custom', 
          url: '/schedule',
          label: 'View Schedule'
        }
      },
      navItems: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    liveGamesCount: 1,
    nextGameTime: '2:30 PM',
    showLiveIndicator: true
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Basic navigation with three main items and live game indicator - should definitely show navigation'
      }
    }
  }
}

export const WithLiveGames: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 2,
    nextGameTime: '2:30 PM',
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with live games indicator showing 2 active games'
      }
    }
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
    nextGameTime: 'Tomorrow 10:00 AM',
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
      headerColumns: [
        {
          id: 'col-1',
          title: {
            title: 'Schedule',
            enableLink: true,
            link: { type: 'custom', url: '/tournament/schedule', label: 'Schedule' }
          },
          subMenuItems: []
        },
        {
          id: 'col-2',
          title: {
            title: 'Standings',
            enableLink: true,
            link: { type: 'custom', url: '/tournament/standings' }
          },
          subMenuItems: []
        },
        {
          id: 'col-3',
          title: {
            title: 'Teams',
            enableLink: true,
            link: { type: 'custom', url: '/teams' }
          },
          subMenuItems: []
        }
      ],
      cta: null
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
    data: {
      ...mockHeaderData,
      cta: {
        ctaText: 'Live Scores',
        link: { type: 'custom', url: '/games/live' }
      }
    },
    liveGamesCount: 4,
    nextGameTime: '12:30 PM',
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header during peak tournament activity with multiple live games and live scores CTA'
      }
    }
  }
}

export const EmptyNavigation: Story = {
  args: {
    data: {
      id: 'empty',
      logo: null,
      headerColumns: [],
      cta: null,
      navItems: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    } as Header,
    liveGamesCount: 0,
    showLiveIndicator: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with empty CMS data - shows fallback navigation (Tournament, Teams, Games, Media)'
      }
    }
  }
}

// Test fallback navigation explicitly
export const FallbackNavigation: Story = {
  args: {
    data: {
      id: 'fallback-test',
      logo: null,
      headerColumns: [], // Empty array to trigger fallback
      cta: {
        ctaText: 'View Schedule',
        link: { type: 'custom', url: '/schedule' }
      },
      navItems: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    } as Header,
    liveGamesCount: 2,
    nextGameTime: '3:00 PM',
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests fallback navigation when headerColumns is empty - should show Tournament, Teams, Games, Media with dropdowns'
      }
    }
  }
}

export const NoLogo: Story = {
  args: {
    data: {
      ...mockHeaderData,
      logo: null
    },
    liveGamesCount: 1,
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header without CMS logo - shows fallback "COWTOWN SHOWDOWN" text with colored square'
      }
    }
  }
}

export const MegaMenuDemo: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 2,
    nextGameTime: '2:30 PM',
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Desktop dropdown menu demonstration - click Tournament or Games to see dropdown menus'
      }
    }
  }
}

export const MobilePanelDemo: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 1,
    nextGameTime: '4:00 PM',
    showLiveIndicator: true
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'Mobile slide-out menu - hamburger opens menu from right, X button closes, auto-closes on navigation'
      }
    }
  }
}

export const AccessibilityTest: Story = {
  args: {
    data: mockHeaderData,
    liveGamesCount: 3,
    nextGameTime: '5:15 PM',
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Test keyboard navigation (Tab, Arrow keys, Escape) and screen reader compatibility'
      }
    }
  }
}

export const WithAboutSection: Story = {
  args: {
    data: mockHeaderWithAbout,
    liveGamesCount: 0,
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with About section showing venue, volunteers, sponsors, and contact information'
      }
    }
  }
}

export const CompactNavigation: Story = {
  args: {
    data: mockHeaderSimple,
    liveGamesCount: 2,
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Simplified navigation for mobile-first design with essential links only'
      }
    }
  }
}

export const GameDayHeader: Story = {
  args: {
    data: {
      ...mockHeaderData,
      cta: {
        ctaText: 'Watch Live',
        link: { type: 'custom', url: '/games/live' }
      }
    },
    liveGamesCount: 5,
    nextGameTime: 'NOW',
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header during tournament game day with multiple live games and prominent live stream CTA'
      }
    }
  }
}

// Clean template demonstration
export const CleanTemplate: Story = {
  args: {
    data: {
      id: 'clean-template',
      logo: null,
      headerColumns: [],
      cta: null,
      navItems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    liveGamesCount: 0,
    showLiveIndicator: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the clean Tailwind UI template with fallback navigation: Tournament (with dropdown), Teams, Games (with dropdown), Media'
      }
    }
  }
}

// Real-world Alberta teams showcase
export const AlbertaTeamsShowcase: Story = {
  args: {
    data: {
      ...mockHeaderData,
      headerColumns: [
        {
          id: 'col-tournament',
          title: {
            title: 'Tournament',
            enableLink: true,
            link: { type: 'custom', url: '/tournament' }
          },
          subMenuItems: [
            {
              id: 'sub-schedule',
              linkText: 'Schedule',
              link: { type: 'custom', url: '/tournament/schedule', label: 'Schedule' }
            },
            {
              id: 'sub-standings',
              linkText: 'Standings',
              link: { type: 'custom', url: '/tournament/standings' }
            },
            {
              id: 'sub-bracket',
              linkText: 'Bracket',
              link: { type: 'custom', url: '/tournament/bracket' }
            }
          ]
        },
        {
          id: 'col-teams',
          title: {
            title: 'Teams',
            enableLink: true,
            link: { type: 'custom', url: '/teams' }
          },
          subMenuItems: [
            {
              id: 'sub-calgary',
              linkText: 'Calgary Bears',
              link: { type: 'custom', url: '/teams/calgary-bears' }
            },
            {
              id: 'sub-edmonton',
              linkText: 'Edmonton Warriors',
              link: { type: 'custom', url: '/teams/edmonton-warriors' }
            },
            {
              id: 'sub-red-deer',
              linkText: 'Red Deer Rebels',
              link: { type: 'custom', url: '/teams/red-deer-rebels' }
            },
            {
              id: 'sub-lethbridge',
              linkText: 'Lethbridge Hurricanes',
              link: { type: 'custom', url: '/teams/lethbridge-hurricanes' }
            }
          ]
        },
        {
          id: 'col-live',
          title: {
            title: 'Live Games',
            enableLink: true,
            link: { type: 'custom', url: '/games/live' }
          },
          subMenuItems: []
        }
      ],
      cta: {
        ctaText: 'Get Directions',
        link: { type: 'custom', url: '/about/venue' }
      }
    },
    liveGamesCount: 3,
    nextGameTime: '2:30 PM',
    showLiveIndicator: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header showcasing Alberta teams with venue directions CTA for tournament day'
      }
    }
  }
}