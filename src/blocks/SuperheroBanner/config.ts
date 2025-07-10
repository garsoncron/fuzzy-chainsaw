import type { Block, GroupField } from 'payload'
import { link } from '@/fields/link'

export const SuperheroBanner: Block = {
  slug: 'heroBanner',
  interfaceName: 'HeroBannerBlock',
  dbName: 'hero_banner',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Hero background image (recommended: 2880x1620px)',
      },
    },
    {
      name: 'announcementBadge',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          admin: {
            description: 'Badge text (e.g., "Live games happening now")',
          },
        },
        {
          name: 'linkText',
          type: 'text',
          admin: {
            description: 'Link text (e.g., "View live games")',
          },
        },
        {
          name: 'linkUrl',
          type: 'text',
          defaultValue: '/games/live',
          admin: {
            description: 'Path to live games page',
          },
        },
      ],
      admin: {
        description: 'Optional announcement badge above the main heading',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main hero heading (e.g., "Cowtown Showdown 2024")',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Supporting text below the heading',
      },
    },
    {
      name: 'primaryCTA',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            description: 'Primary button text (e.g., "View Tournament")',
          },
        },
        ...(link({ disableLabel: true }) as GroupField).fields,
      ],
      admin: {
        description: 'Primary call-to-action button',
      },
    },
    {
      name: 'secondaryCTA',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          admin: {
            description: 'Secondary link text (e.g., "Learn more")',
          },
        },
        ...(link({ disableLabel: true }) as GroupField).fields,
      ],
      admin: {
        description: 'Optional secondary call-to-action link',
      },
    },
    {
      name: 'enableGradientOverlay',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable gradient overlay for better text contrast',
      },
    },
  ],
}
