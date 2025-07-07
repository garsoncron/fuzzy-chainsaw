import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'jerseyNumber', 'team', 'primaryPosition', 'playerType'],
    group: 'Tournament',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Last Name',
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.firstName && data?.lastName) {
              return `${data.firstName} ${data.lastName}`
            }
            return data?.displayName
          },
        ],
      },
    },
    {
      name: 'jerseyNumber',
      type: 'number',
      required: true,
      label: 'Jersey Number',
      min: 0,
      max: 99,
      admin: {
        description: 'Player jersey number (0-99)',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      label: 'Team',
      admin: {
        description: 'The team this player belongs to',
      },
    },
    {
      name: 'primaryPosition',
      type: 'select',
      required: true,
      label: 'Primary Position',
      options: [
        {
          label: 'Offence',
          value: 'offence',
        },
        {
          label: 'Defence',
          value: 'defence',
        },
        {
          label: 'Transition',
          value: 'transition',
        },
        {
          label: 'Faceoff',
          value: 'faceoff',
        },
        {
          label: 'Goalie',
          value: 'goalie',
        },
      ],
      admin: {
        description: 'Player primary position',
      },
    },
    {
      name: 'secondaryPosition',
      type: 'select',
      label: 'Secondary Position',
      options: [
        {
          label: 'Offence',
          value: 'offence',
        },
        {
          label: 'Defence',
          value: 'defence',
        },
        {
          label: 'Transition',
          value: 'transition',
        },
        {
          label: 'Faceoff',
          value: 'faceoff',
        },
        {
          label: 'Goalie',
          value: 'goalie',
        },
      ],
      admin: {
        description: 'Player secondary position (optional)',
      },
    },
    {
      name: 'handedness',
      type: 'select',
      required: true,
      label: 'Handedness',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      admin: {
        description: 'Player handedness for stick handling',
      },
    },
    {
      name: 'playerType',
      type: 'select',
      required: true,
      label: 'Player Type',
      options: [
        {
          label: 'Runner',
          value: 'runner',
        },
        {
          label: 'Goalie',
          value: 'goalie',
        },
      ],
      admin: {
        description: 'Runner or Goalie classification',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Player Photo',
      admin: {
        description: 'Upload player photo (optional)',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Ensure goalie position matches goalie player type
        if (data?.playerType === 'goalie' && data?.primaryPosition !== 'goalie') {
          data.primaryPosition = 'goalie'
        }
        
        // Ensure non-goalies don't have goalie as primary position
        if (data?.playerType === 'runner' && data?.primaryPosition === 'goalie') {
          data.primaryPosition = 'offence' // Default to offence
        }
        
        return data
      },
    ],
  },
}