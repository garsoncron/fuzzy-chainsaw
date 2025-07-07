import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Faceoffs: CollectionConfig = {
  slug: 'faceoffs',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'game', 'period', 'time', 'winner'],
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
            if (data?.homeFaceoffPlayer && data?.awayFaceoffPlayer && data?.period && data?.time) {
              const winner = data.winner === 'home' ? data.homeFaceoffPlayer : data.awayFaceoffPlayer
              return `Faceoff: ${data.homeFaceoffPlayer} vs ${data.awayFaceoffPlayer} (${winner} won) - P${data.period} ${data.time}`
            }
            return data?.displayName || 'Faceoff'
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
        description: 'The game this faceoff occurred in',
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
        description: 'Period in which faceoff occurred',
      },
    },
    {
      name: 'time',
      type: 'text',
      required: true,
      label: 'Game Time',
      admin: {
        description: 'Time on game clock when faceoff occurred (e.g., "12:34")',
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
      type: 'row',
      fields: [
        {
          name: 'homeFaceoffPlayer',
          type: 'relationship',
          relationTo: 'players',
          required: true,
          label: 'Home Team Player',
          admin: {
            width: '50%',
            description: 'Home team player taking the faceoff',
          },
        },
        {
          name: 'awayFaceoffPlayer',
          type: 'relationship',
          relationTo: 'players',
          required: true,
          label: 'Away Team Player',
          admin: {
            width: '50%',
            description: 'Away team player taking the faceoff',
          },
        },
      ],
    },
    {
      name: 'winner',
      type: 'select',
      required: true,
      label: 'Faceoff Winner',
      options: [
        { label: 'Home Team', value: 'home' },
        { label: 'Away Team', value: 'away' },
      ],
      admin: {
        description: 'Which team won the faceoff',
      },
    },
    {
      name: 'location',
      type: 'select',
      label: 'Faceoff Location',
      options: [
        { label: 'Center Ice', value: 'center' },
        { label: 'Home End', value: 'home_end' },
        { label: 'Away End', value: 'away_end' },
        { label: 'Neutral Zone', value: 'neutral_zone' },
      ],
      admin: {
        description: 'Location on the floor where faceoff occurred',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Additional notes about the faceoff (optional)',
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