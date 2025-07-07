import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Goals: CollectionConfig = {
  slug: 'goals',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'game', 'period', 'time', 'goalType'],
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
            if (data?.scorer && data?.period && data?.time) {
              const assists = []
              if (data.assist1) assists.push(data.assist1)
              if (data.assist2) assists.push(data.assist2)
              const assistText = assists.length > 0 ? ` (${assists.join(', ')})` : ''
              return `Goal by ${data.scorer} - P${data.period} ${data.time}${assistText}`
            }
            return data?.displayName || 'Goal'
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
        description: 'The game this goal was scored in',
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
        description: 'Period in which goal was scored',
      },
    },
    {
      name: 'time',
      type: 'text',
      required: true,
      label: 'Game Time',
      admin: {
        description: 'Time on game clock when goal was scored (e.g., "12:34")',
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
      name: 'scorer',
      type: 'relationship',
      relationTo: 'players',
      required: true,
      label: 'Goal Scorer',
      admin: {
        description: 'Player who scored the goal',
      },
    },
    {
      name: 'assist1',
      type: 'relationship',
      relationTo: 'players',
      label: 'Primary Assist',
      admin: {
        description: 'Player credited with primary assist (optional)',
      },
    },
    {
      name: 'assist2',
      type: 'relationship',
      relationTo: 'players',
      label: 'Secondary Assist',
      admin: {
        description: 'Player credited with secondary assist (optional)',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      label: 'Scoring Team',
      admin: {
        description: 'Team that scored the goal',
      },
    },
    {
      name: 'goalType',
      type: 'select',
      required: true,
      label: 'Goal Type',
      defaultValue: 'even_strength',
      options: [
        {
          label: 'Even Strength',
          value: 'even_strength',
        },
        {
          label: 'Power Play',
          value: 'power_play',
        },
        {
          label: 'Short Handed',
          value: 'short_handed',
        },
        {
          label: 'Penalty Shot',
          value: 'penalty_shot',
        },
      ],
      admin: {
        description: 'Type of goal scored',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Additional notes about the goal (optional)',
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