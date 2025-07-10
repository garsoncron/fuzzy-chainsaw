import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { link } from '@/fields/link'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Settings',
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Banner',
          fields: [
            {
              name: 'enableHeroBanner',
              type: 'checkbox',
              label: 'Enable Hero Banner',
              defaultValue: true,
            },
            {
              name: 'heroBanner',
              type: 'group',
              label: 'Hero Banner Content',
              admin: {
                condition: (data) => data?.enableHeroBanner === true,
              },
              fields: [
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Background Image',
                  required: false,
                },
                {
                  name: 'announcementBadge',
                  type: 'group',
                  label: 'Announcement Badge',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Badge Text',
                      admin: {
                        description: 'Badge text (e.g., "Live games happening now")',
                      },
                    },
                    {
                      name: 'linkText',
                      type: 'text',
                      label: 'Link Text',
                      admin: {
                        description: 'Link text (e.g., "View live games")',
                      },
                    },
                    {
                      name: 'linkUrl',
                      type: 'text',
                      label: 'Link URL',
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
                  label: 'Main Heading',
                  required: false,
                  defaultValue: 'Cowtown Showdown',
                },
                {
                  name: 'subheading',
                  type: 'textarea',
                  label: 'Subheading',
                  admin: {
                    description: 'Supporting text below the main heading',
                  },
                },
                // {
                //   name: 'primaryCTA',
                //   type: 'group',
                //   label: 'Primary Call to Action',
                //   fields: [
                //     {
                //       name: 'text',
                //       type: 'text',
                //       label: 'Button Text',
                //       required: false,
                //       defaultValue: 'View Schedule',
                //     },
                //     ...link({ disableLabel: true }).fields,
                //   ],
                // },
                // {
                //   name: 'secondaryCTA',
                //   type: 'group',
                //   label: 'Secondary Call to Action',
                //   fields: [
                //     {
                //       name: 'text',
                //       type: 'text',
                //       label: 'Button Text',
                //       defaultValue: 'View Teams',
                //     },
                //     ...link({ disableLabel: true }).fields,
                //   ],
                // },
                {
                  name: 'enableGradientOverlay',
                  type: 'checkbox',
                  label: 'Enable Gradient Overlay',
                  defaultValue: true,
                  admin: {
                    description: 'Adds a dark gradient overlay to improve text readability',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Live Stream',
          fields: [
            {
              name: 'enableLiveStream',
              type: 'checkbox',
              label: 'Enable Live Stream Section',
              defaultValue: false,
            },
            {
              name: 'liveStream',
              type: 'group',
              label: 'Live Stream Settings',
              admin: {
                condition: (data) => data?.enableLiveStream === true,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'Watch Live',
                  admin: {
                    description: 'Title displayed above the video embed',
                  },
                },
                {
                  name: 'youtubeUrl',
                  type: 'text',
                  label: 'YouTube URL',
                  required: true,
                  admin: {
                    description:
                      'Full YouTube URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)',
                  },
                  validate: (value: string | null | undefined) => {
                    if (!value) return true
                    const youtubeRegex =
                      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+(&.*)?$/
                    if (!youtubeRegex.test(value)) {
                      return 'Please enter a valid YouTube URL'
                    }
                    return true
                  },
                },
                {
                  name: 'autoplay',
                  type: 'checkbox',
                  label: 'Autoplay',
                  defaultValue: false,
                  admin: {
                    description: 'Autoplay requires video to be muted',
                  },
                },
                {
                  name: 'muted',
                  type: 'checkbox',
                  label: 'Muted',
                  defaultValue: false,
                  admin: {
                    description: 'Start video muted (required for autoplay)',
                  },
                },
                {
                  name: 'showControls',
                  type: 'checkbox',
                  label: 'Show Controls',
                  defaultValue: true,
                },
                {
                  name: 'aspectRatio',
                  type: 'select',
                  label: 'Aspect Ratio',
                  defaultValue: '16:9',
                  options: [
                    { label: '16:9 (Default)', value: '16:9' },
                    { label: '4:3', value: '4:3' },
                    { label: '21:9 (Ultra-wide)', value: '21:9' },
                  ],
                },
                {
                  name: 'privacyEnhanced',
                  type: 'checkbox',
                  label: 'Privacy Enhanced Mode',
                  defaultValue: true,
                  admin: {
                    description: 'Uses youtube-nocookie.com domain for enhanced privacy',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Content Settings',
          fields: [
            {
              name: 'showLiveGames',
              type: 'checkbox',
              label: 'Show Live Games Section',
              defaultValue: true,
            },
            {
              name: 'showUpcomingGames',
              type: 'checkbox',
              label: 'Show Upcoming Games Section',
              defaultValue: true,
            },
            {
              name: 'showStandings',
              type: 'checkbox',
              label: 'Show Standings Section',
              defaultValue: true,
            },
            {
              name: 'showRecentGames',
              type: 'checkbox',
              label: 'Show Recent Games Section',
              defaultValue: true,
            },
          ],
        },
      ],
    },
  ],
}
