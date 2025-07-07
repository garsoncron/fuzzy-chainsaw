import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Penalties: CollectionConfig = {
  slug: 'penalties',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'game', 'period', 'time', 'infraction', 'duration'],
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
            if (data?.player && data?.infraction && data?.period && data?.time) {
              return `${data.player} - ${data.infraction} (${data.duration}) - P${data.period} ${data.time}`
            }
            return data?.displayName || 'Penalty'
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
        description: 'The game this penalty occurred in',
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
        description: 'Period in which penalty was assessed',
      },
    },
    {
      name: 'time',
      type: 'text',
      required: true,
      label: 'Game Time',
      admin: {
        description: 'Time on game clock when penalty was assessed (e.g., "12:34")',
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
      label: 'Penalized Player',
      admin: {
        description: 'Player who committed the penalty',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      label: 'Penalized Team',
      admin: {
        description: 'Team of the penalized player',
      },
    },
    {
      name: 'infraction',
      type: 'select',
      required: true,
      label: 'Infraction',
      options: [
        // Minor Penalties (2 minutes)
        { label: 'Slashing', value: 'slashing' },
        { label: 'Tripping', value: 'tripping' },
        { label: 'Interference', value: 'interference' },
        { label: 'Holding', value: 'holding' },
        { label: 'Illegal Pick', value: 'illegal_pick' },
        { label: 'Cross Checking', value: 'cross_checking' },
        { label: 'Elbowing', value: 'elbowing' },
        { label: 'Roughing', value: 'roughing' },
        { label: 'Unsportsmanlike Conduct', value: 'unsportsmanlike_conduct' },
        { label: 'Delay of Game', value: 'delay_of_game' },
        { label: 'Illegal Substitution', value: 'illegal_substitution' },
        { label: 'Crease Violation', value: 'crease_violation' },
        { label: 'Over and Back', value: 'over_and_back' },
        
        // Major Penalties (5 minutes)
        { label: 'High Sticking', value: 'high_sticking' },
        { label: 'Boarding', value: 'boarding' },
        { label: 'Face Masking', value: 'face_masking' },
        { label: 'Fighting', value: 'fighting' },
        { label: 'Spearing', value: 'spearing' },
        { label: 'Checking from Behind', value: 'checking_from_behind' },
        
        // Misconduct Penalties
        { label: 'Misconduct', value: 'misconduct' },
        { label: 'Game Misconduct', value: 'game_misconduct' },
        
        // Special
        { label: 'Penalty Shot', value: 'penalty_shot' },
      ],
      admin: {
        description: 'Type of penalty infraction',
      },
    },
    {
      name: 'duration',
      type: 'select',
      required: true,
      label: 'Penalty Duration',
      options: [
        { label: '30 seconds', value: '30s' },
        { label: '1 minute', value: '1min' },
        { label: '2 minutes', value: '2min' },
        { label: '3 minutes', value: '3min' },
        { label: '5 minutes', value: '5min' },
        { label: '10 minutes', value: '10min' },
        { label: 'Game', value: 'game' },
        { label: 'Penalty Shot', value: 'penalty_shot' },
      ],
      admin: {
        description: 'Duration of the penalty',
      },
    },
    {
      name: 'penaltyType',
      type: 'select',
      required: true,
      label: 'Penalty Type',
      options: [
        { label: 'Minor', value: 'minor' },
        { label: 'Major', value: 'major' },
        { label: 'Misconduct', value: 'misconduct' },
        { label: 'Game Misconduct', value: 'game_misconduct' },
        { label: 'Penalty Shot', value: 'penalty_shot' },
      ],
      admin: {
        description: 'Classification of penalty type',
      },
    },
    {
      name: 'coincidental',
      type: 'checkbox',
      label: 'Coincidental Penalty',
      admin: {
        description: 'Check if this is a coincidental penalty',
      },
    },
    {
      name: 'delayedPenalty',
      type: 'checkbox',
      label: 'Delayed Penalty',
      admin: {
        description: 'Check if this was a delayed penalty call',
      },
    },
    {
      name: 'startTime',
      type: 'date',
      label: 'Penalty Start Time',
      admin: {
        description: 'When the penalty time began',
        date: {
          pickerAppearance: 'timeOnly',
        },
      },
    },
    {
      name: 'endTime',
      type: 'date',
      label: 'Penalty End Time',
      admin: {
        description: 'When the penalty time ended (if applicable)',
        date: {
          pickerAppearance: 'timeOnly',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Additional details about the penalty (optional)',
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
        
        // Auto-set penalty type based on infraction
        if (data?.infraction && !data?.penaltyType) {
          const minorPenalties = [
            'slashing', 'tripping', 'interference', 'holding', 'illegal_pick', 
            'cross_checking', 'elbowing', 'roughing', 'unsportsmanlike_conduct',
            'delay_of_game', 'illegal_substitution', 'crease_violation', 'over_and_back'
          ]
          const majorPenalties = [
            'high_sticking', 'boarding', 'face_masking', 'fighting', 'spearing', 'checking_from_behind'
          ]
          
          if (minorPenalties.includes(data.infraction)) {
            data.penaltyType = 'minor'
            if (!data.duration) data.duration = '2min'
          } else if (majorPenalties.includes(data.infraction)) {
            data.penaltyType = 'major'
            if (!data.duration) data.duration = '5min'
          } else if (data.infraction === 'misconduct') {
            data.penaltyType = 'misconduct'
            if (!data.duration) data.duration = '10min'
          } else if (data.infraction === 'game_misconduct') {
            data.penaltyType = 'game_misconduct'
            if (!data.duration) data.duration = 'game'
          } else if (data.infraction === 'penalty_shot') {
            data.penaltyType = 'penalty_shot'
            if (!data.duration) data.duration = 'penalty_shot'
          }
        }
        
        return data
      },
    ],
  },
}