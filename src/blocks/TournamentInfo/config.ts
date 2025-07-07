import type { Block } from 'payload'

export const TournamentInfo: Block = {
  slug: 'tournamentInfo',
  interfaceName: 'TournamentInfoBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Tournament Information',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Key Highlights',
      minRows: 3,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Trophy', value: 'trophy' },
            { label: 'Calendar', value: 'calendar' },
            { label: 'Users', value: 'users' },
            { label: 'MapPin', value: 'mapPin' },
            { label: 'Clock', value: 'clock' },
            { label: 'Star', value: 'star' },
          ],
          defaultValue: 'trophy',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Tournament Statistics',
      minRows: 2,
      maxRows: 8,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "8", "22", "3", etc.',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Teams", "Games", "Days", etc.',
          },
        },
      ],
    },
  ],
  labels: {
    singular: 'Tournament Info',
    plural: 'Tournament Info Blocks',
  },
}