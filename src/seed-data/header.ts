/**
 * @description Seed data for Cowtown Showdown header configuration
 * @dependencies None - pure data structure
 * @notes Matches the site information architecture with realistic Alberta teams
 */

export const headerSeedData = {
  // Tournament Logo (will be populated via CMS upload)
  logo: null, // Upload cowtown-showdown-logo.png via CMS
  
  // Main navigation structure based on information architecture
  headerColumns: [
    {
      title: {
        title: 'Tournament',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/tournament',
          label: 'Tournament'
        }
      },
      subMenuItems: [
        {
          linkText: 'Schedule',
          link: {
            type: 'custom',
            url: '/tournament/schedule'
          }
        },
        {
          linkText: 'Standings',
          link: {
            type: 'custom',
            url: '/tournament/standings'
          }
        },
        {
          linkText: 'Bracket',
          link: {
            type: 'custom',
            url: '/tournament/bracket'
          }
        },
        {
          linkText: 'Statistics',
          link: {
            type: 'custom',
            url: '/tournament/stats'
          }
        },
        {
          linkText: 'Rules & Format',
          link: {
            type: 'custom',
            url: '/tournament/rules'
          }
        }
      ]
    },
    {
      title: {
        title: 'Teams',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/teams'
        }
      },
      subMenuItems: [
        {
          linkText: 'Calgary Bears',
          link: {
            type: 'custom',
            url: '/teams/calgary-bears'
          }
        },
        {
          linkText: 'Edmonton Warriors',
          link: {
            type: 'custom',
            url: '/teams/edmonton-warriors'
          }
        },
        {
          linkText: 'Red Deer Rebels',
          link: {
            type: 'custom',
            url: '/teams/red-deer-rebels'
          }
        },
        {
          linkText: 'Lethbridge Hurricanes',
          link: {
            type: 'custom',
            url: '/teams/lethbridge-hurricanes'
          }
        },
        {
          linkText: 'Medicine Hat Mavericks',
          link: {
            type: 'custom',
            url: '/teams/medicine-hat-mavericks'
          }
        },
        {
          linkText: 'Grande Prairie Storm',
          link: {
            type: 'custom',
            url: '/teams/grande-prairie-storm'
          }
        },
        {
          linkText: 'Fort McMurray Oil Barons',
          link: {
            type: 'custom',
            url: '/teams/fort-mcmurray-oil-barons'
          }
        },
        {
          linkText: 'Lloydminster Border Kings',
          link: {
            type: 'custom',
            url: '/teams/lloydminster-border-kings'
          }
        }
      ]
    },
    {
      title: {
        title: 'Players',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/players'
        }
      },
      subMenuItems: [
        {
          linkText: 'Player Directory',
          link: {
            type: 'custom',
            url: '/players'
          }
        },
        {
          linkText: 'Top Scorers',
          link: {
            type: 'custom',
            url: '/players?sort=points'
          }
        },
        {
          linkText: 'Goalies',
          link: {
            type: 'custom',
            url: '/players?position=goalie'
          }
        }
      ]
    },
    {
      title: {
        title: 'Games',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/games'
        }
      },
      subMenuItems: [
        {
          linkText: 'All Games',
          link: {
            type: 'custom',
            url: '/games'
          }
        },
        {
          linkText: 'Live Dashboard',
          link: {
            type: 'custom',
            url: '/games/live'
          }
        },
        {
          linkText: 'Day 1 Games',
          link: {
            type: 'custom',
            url: '/games?day=1'
          }
        },
        {
          linkText: 'Day 2 Games',
          link: {
            type: 'custom',
            url: '/games?day=2'
          }
        },
        {
          linkText: 'Day 3 Games',
          link: {
            type: 'custom',
            url: '/games?day=3'
          }
        }
      ]
    },
    {
      title: {
        title: 'Media',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/media'
        }
      },
      subMenuItems: [
        {
          linkText: 'Photo Gallery',
          link: {
            type: 'custom',
            url: '/media/photos'
          }
        },
        {
          linkText: 'Video Highlights',
          link: {
            type: 'custom',
            url: '/media/videos'
          }
        },
        {
          linkText: 'Game Highlights',
          link: {
            type: 'custom',
            url: '/media/highlights'
          }
        },
        {
          linkText: 'News & Updates',
          link: {
            type: 'custom',
            url: '/news'
          }
        }
      ]
    }
  ],
  
  // Call to Action button
  cta: {
    ctaText: 'View Schedule',
    link: {
      type: 'custom',
      url: '/tournament/schedule'
    }
  },
  
  // Legacy nav items (empty for new implementation)
  navItems: []
}

// Alternative configurations for different tournament phases

export const headerSeedDataPreTournament = {
  ...headerSeedData,
  cta: {
    ctaText: 'Register Team',
    link: {
      type: 'custom',
      url: '/contact'
    }
  }
}

export const headerSeedDataLive = {
  ...headerSeedData,
  cta: {
    ctaText: 'Watch Live',
    link: {
      type: 'custom',
      url: '/games/live'
    }
  }
}

export const headerSeedDataWithAbout = {
  ...headerSeedData,
  headerColumns: [
    ...headerSeedData.headerColumns.slice(0, 4), // Keep first 4 columns
    {
      title: {
        title: 'About',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/about'
        }
      },
      subMenuItems: [
        {
          linkText: 'Tournament Info',
          link: {
            type: 'custom',
            url: '/about/tournament'
          }
        },
        {
          linkText: 'Venue & Location',
          link: {
            type: 'custom',
            url: '/about/venue'
          }
        },
        {
          linkText: 'Volunteers',
          link: {
            type: 'custom',
            url: '/about/volunteers'
          }
        },
        {
          linkText: 'Sponsors',
          link: {
            type: 'custom',
            url: '/about/sponsors'
          }
        },
        {
          linkText: 'Contact Us',
          link: {
            type: 'custom',
            url: '/contact'
          }
        }
      ]
    }
  ]
}

// Simplified mobile-first configuration
export const headerSeedDataSimple = {
  ...headerSeedData,
  headerColumns: [
    {
      title: {
        title: 'Schedule',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/tournament/schedule'
        }
      },
      subMenuItems: []
    },
    {
      title: {
        title: 'Standings',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/tournament/standings'
        }
      },
      subMenuItems: []
    },
    {
      title: {
        title: 'Teams',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/teams'
        }
      },
      subMenuItems: []
    },
    {
      title: {
        title: 'Live',
        enableLink: true,
        link: {
          type: 'custom',
          url: '/games/live'
        }
      },
      subMenuItems: []
    }
  ],
  cta: {
    ctaText: 'Get Directions',
    link: {
      type: 'custom',
      url: '/about/venue'
    }
  }
}

/**
 * Instructions for CMS Setup:
 * 
 * 1. Navigate to Admin -> Site Header
 * 2. Upload tournament logo (recommended: western-themed, 140x50px)
 * 3. Copy and paste the headerSeedData structure into the CMS
 * 4. Adjust CTA text and links based on current tournament phase
 * 5. Test all navigation links to ensure they work correctly
 * 
 * Tournament Phase Recommendations:
 * - Pre-tournament: Use headerSeedDataPreTournament
 * - During tournament: Use headerSeedDataLive
 * - Post-tournament: Use headerSeedData (default)
 * 
 * Mobile Optimization:
 * - Consider using headerSeedDataSimple for mobile-first approach
 * - Test navigation on various screen sizes
 * - Ensure dropdown menus work properly on touch devices
 */