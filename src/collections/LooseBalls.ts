import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const LooseBalls: CollectionConfig = {
  slug: 'loose-balls',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'game', 'period', 'time', 'player'],
    group: 'Statistics',
    hidden: true,
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.player && data?.period && data?.time) {
              return `Loose Ball by ${data.player} - P${data.period} ${data.time}`
            }
            return data?.displayName || 'Loose Ball'
          },
        ],
      },
    },
    {
      name: 'game',
      type: 'relationship',
      relationTo: 'games',
      required: true,
      label: 'Game',
      admin: {
        description: 'The game this loose ball occurred in',
      },
    },
    {
      name: 'period',
      type: 'select',
      required: true,
      label: 'Period',
      options: [
        { label: 'Period 1', value: '1' },
        { label: 'Period 2', value: '2' },
        { label: 'Period 3', value: '3' },
        { label: 'OT1', value: 'OT1' },
        { label: 'OT2', value: 'OT2' },
        { label: 'OT3', value: 'OT3' },
      ],
      admin: {
        description: 'Period in which loose ball occurred',
      },
    },
    {
      name: 'time',
      type: 'text',
      required: true,
      label: 'Game Time',
      admin: {
        description: 'Time on game clock when loose ball occurred (e.g., "12:34")',
        placeholder: '12:34',
      },
      validate: (value) => {
        if (value && !/^\d{1,2}:\d{2}$/.test(value)) {
          return 'Please enter time in MM:SS format (e.g., 12:34)'
        }
        return true
      },
    },
    {
      name: 'gameTime',
      type: 'number',
      label: 'Game Time (seconds)',
      admin: {
        description: 'Seconds elapsed since game start (calculated automatically)',
        readOnly: true,
      },
    },
    {
      name: 'player',
      type: 'relationship',
      relationTo: 'players',
      required: true,
      label: 'Player',
      admin: {
        description: 'Player who recovered the loose ball',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      label: 'Team',
      admin: {
        description: 'Team that recovered the loose ball',
      },
    },
    {
      name: 'location',
      type: 'select',
      label: 'Field Location',
      options: [
        { label: 'Offensive End', value: 'offensive_end' },
        { label: 'Defensive End', value: 'defensive_end' },
        { label: 'Center Field', value: 'center_field' },
        { label: 'Corner', value: 'corner' },
        { label: 'Behind Net', value: 'behind_net' },
        { label: 'Crease Area', value: 'crease_area' },
        { label: 'Neutral Zone', value: 'neutral_zone' },
      ],
      admin: {
        description: 'Location on the floor where loose ball was recovered',
      },
    },
    {
      name: 'recoveryType',
      type: 'select',
      label: 'Recovery Type',
      options: [
        { label: 'Ground Ball', value: 'ground_ball' },
        { label: 'Rebound', value: 'rebound' },
        { label: 'Deflection', value: 'deflection' },
        { label: 'Scramble', value: 'scramble' },
        { label: 'Turnover', value: 'turnover' },
        { label: 'Faceoff', value: 'faceoff' },
      ],
      admin: {
        description: 'How the loose ball was created/recovered',
      },
    },
    {
      name: 'contested',
      type: 'checkbox',
      label: 'Contested Recovery',
      admin: {
        description: 'Check if the loose ball was contested by multiple players',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Additional notes about the loose ball recovery (optional)',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Calculate game time in seconds from time string
        if (data?.time && data?.period) {
          const [minutes, seconds] = data.time.split(':').map(Number)
          if (!isNaN(minutes) && !isNaN(seconds)) {
            // Calculate based on period and time
            let periodStartTime = 0
            if (data.period === 2) periodStartTime = 12 * 60 // 12 minutes in seconds
            if (data.period === 3) periodStartTime = 24 * 60 // 24 minutes in seconds
            if (data.period === 'OT1') periodStartTime = 36 * 60 // 36 minutes in seconds
            
            // Time remaining format - convert to elapsed time
            const periodLength = 12 * 60 // 12 minutes in seconds
            const timeElapsed = periodLength - (minutes * 60 + seconds)
            data.gameTime = periodStartTime + timeElapsed
          }
        }
        
        return data
      },
    ],
  },
}