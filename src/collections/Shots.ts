import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Shots: CollectionConfig = {
  slug: 'shots',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'game', 'period', 'time', 'saved'],
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
            if (data?.shooter && data?.goalie && data?.period && data?.time) {
              const result = data.saved ? 'saved' : 'missed'
              return `Shot by ${data.shooter} on ${data.goalie} (${result}) - P${data.period} ${data.time}`
            }
            return data?.displayName || 'Shot'
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
        description: 'The game this shot occurred in',
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
        description: 'Period in which shot occurred',
      },
    },
    {
      name: 'time',
      type: 'text',
      required: true,
      label: 'Game Time',
      admin: {
        description: 'Time on game clock when shot occurred (e.g., "12:34")',
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
      name: 'shooter',
      type: 'relationship',
      relationTo: 'players',
      required: true,
      label: 'Shooter',
      admin: {
        description: 'Player who took the shot',
      },
      filterOptions: {
        playerType: {
          not_equals: 'goalie',
        },
      },
    },
    {
      name: 'goalie',
      type: 'relationship',
      relationTo: 'players',
      required: true,
      label: 'Goalie',
      admin: {
        description: 'Goalie who faced the shot',
      },
      filterOptions: {
        playerType: {
          equals: 'goalie',
        },
      },
    },
    {
      name: 'shootingTeam',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      label: 'Shooting Team',
      admin: {
        description: 'Team that took the shot',
      },
    },
    {
      name: 'goalieTeam',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      label: 'Goalie Team',
      admin: {
        description: 'Team of the goalie who faced the shot',
      },
    },
    {
      name: 'saved',
      type: 'checkbox',
      required: true,
      label: 'Shot Saved',
      admin: {
        description: 'Check if the goalie saved the shot',
      },
    },
    {
      name: 'shotType',
      type: 'select',
      label: 'Shot Type',
      options: [
        { label: 'Wrist Shot', value: 'wrist' },
        { label: 'Snap Shot', value: 'snap' },
        { label: 'Slap Shot', value: 'slap' },
        { label: 'Backhand', value: 'backhand' },
        { label: 'Tip-in', value: 'tip_in' },
        { label: 'Deflection', value: 'deflection' },
        { label: 'Rebound', value: 'rebound' },
        { label: 'Breakaway', value: 'breakaway' },
      ],
      admin: {
        description: 'Type of shot taken (optional)',
      },
    },
    {
      name: 'shotLocation',
      type: 'select',
      label: 'Shot Location',
      options: [
        { label: 'High Left', value: 'high_left' },
        { label: 'High Right', value: 'high_right' },
        { label: 'Low Left', value: 'low_left' },
        { label: 'Low Right', value: 'low_right' },
        { label: 'Five Hole', value: 'five_hole' },
        { label: 'Blocker Side', value: 'blocker_side' },
        { label: 'Glove Side', value: 'glove_side' },
        { label: 'Top Shelf', value: 'top_shelf' },
        { label: 'Bottom Corner', value: 'bottom_corner' },
      ],
      admin: {
        description: 'Location where shot was aimed (optional)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Additional notes about the shot (optional)',
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