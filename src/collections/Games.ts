import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const Games: CollectionConfig = {
  slug: 'games',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'gameType', 'day', 'scheduledTime', 'status'],
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
      name: 'gameNumber',
      type: 'text',
      required: true,
      label: 'Game Number',
      admin: {
        description: 'Game number in tournament (e.g., "1", "2", "Pool A1")',
      },
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
            if (data?.homeTeam && data?.awayTeam && data?.gameNumber) {
              return `Game ${data.gameNumber}: ${data.homeTeam} vs ${data.awayTeam}`
            }
            return data?.displayName || `Game ${data?.gameNumber || 'TBD'}`
          },
        ],
      },
    },
    ...slugField('displayName'),
    {
      name: 'gameType',
      type: 'select',
      required: true,
      label: 'Game Type',
      options: [
        {
          label: 'Pool Play',
          value: 'pool',
        },
        {
          label: 'Medal Game',
          value: 'medal',
        },
      ],
      admin: {
        description: 'Pool play (12 min periods) or medal game (15 min periods)',
      },
    },
    {
      name: 'day',
      type: 'select',
      required: true,
      label: 'Tournament Day',
      options: [
        {
          label: 'Day 1',
          value: '1',
        },
        {
          label: 'Day 2',
          value: '2',
        },
        {
          label: 'Day 3',
          value: '3',
        },
      ],
      admin: {
        description: 'Tournament day (1-3)',
      },
    },
    {
      name: 'scheduledTime',
      type: 'date',
      required: true,
      label: 'Scheduled Time',
      admin: {
        description: 'Game start time',
        date: {
          pickerAppearance: 'dayAndTime' as const,
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Game Status',
      defaultValue: 'scheduled',
      options: [
        {
          label: 'Scheduled',
          value: 'scheduled',
        },
        {
          label: 'Live',
          value: 'live',
        },
        {
          label: 'Final',
          value: 'final',
        },
        {
          label: 'Overtime',
          value: 'overtime',
        },
      ],
      admin: {
        description: 'Current game status',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'homeTeam',
          type: 'relationship',
          relationTo: 'teams',
          required: true,
          label: 'Home Team',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'awayTeam',
          type: 'relationship',
          relationTo: 'teams',
          required: true,
          label: 'Away Team',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'homeScore',
          type: 'number',
          label: 'Home Score',
          defaultValue: 0,
          min: 0,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'awayScore',
          type: 'number',
          label: 'Away Score',
          defaultValue: 0,
          min: 0,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Goaltenders',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'homeStartingGoalie',
              type: 'relationship',
              relationTo: 'players',
              label: 'Home Starting Goalie',
              admin: {
                width: '50%',
              },
              filterOptions: {
                playerType: {
                  equals: 'goalie',
                },
              },
            },
            {
              name: 'awayStartingGoalie',
              type: 'relationship',
              relationTo: 'players',
              label: 'Away Starting Goalie',
              admin: {
                width: '50%',
              },
              filterOptions: {
                playerType: {
                  equals: 'goalie',
                },
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'homeCurrentGoalie',
              type: 'relationship',
              relationTo: 'players',
              label: 'Home Current Goalie',
              admin: {
                width: '50%',
                description: 'Current goalie (for tracking changes)',
              },
              filterOptions: {
                playerType: {
                  equals: 'goalie',
                },
              },
            },
            {
              name: 'awayCurrentGoalie',
              type: 'relationship',
              relationTo: 'players',
              label: 'Away Current Goalie',
              admin: {
                width: '50%',
                description: 'Current goalie (for tracking changes)',
              },
              filterOptions: {
                playerType: {
                  equals: 'goalie',
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Tournament Points (5-Point System)',
      fields: [
        {
          type: 'group',
          name: 'periodPoints',
          label: 'Period Points',
          admin: {
            description: 'Points awarded for each period (1 for win, 0.5 for tie, 0 for loss)',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'period1Home',
                  type: 'number',
                  label: 'Period 1 Home',
                  defaultValue: 0,
                  min: 0,
                  max: 1,
                  admin: {
                    width: '25%',
                  },
                } as const,
                {
                  name: 'period1Away',
                  type: 'number',
                  label: 'Period 1 Away',
                  defaultValue: 0,
                  min: 0,
                  max: 1,
                  admin: {
                    width: '25%',
                  },
                } as const,
                {
                  name: 'period2Home',
                  type: 'number',
                  label: 'Period 2 Home',
                  defaultValue: 0,
                  min: 0,
                  max: 1,
                  admin: {
                    width: '25%',
                  },
                } as const,
                {
                  name: 'period2Away',
                  type: 'number',
                  label: 'Period 2 Away',
                  defaultValue: 0,
                  min: 0,
                  max: 1,
                  admin: {
                    width: '25%',
                  },
                } as const,
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'period3Home',
                  type: 'number',
                  label: 'Period 3 Home',
                  defaultValue: 0,
                  min: 0,
                  max: 1,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'period3Away',
                  type: 'number',
                  label: 'Period 3 Away',
                  defaultValue: 0,
                  min: 0,
                  max: 1,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'totalPeriodHome',
                  type: 'number',
                  label: 'Total Period Points Home',
                  defaultValue: 0,
                  min: 0,
                  max: 3,
                  admin: {
                    width: '25%',
                    readOnly: true,
                  },
                },
                {
                  name: 'totalPeriodAway',
                  type: 'number',
                  label: 'Total Period Points Away',
                  defaultValue: 0,
                  min: 0,
                  max: 3,
                  admin: {
                    width: '25%',
                    readOnly: true,
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'group',
          name: 'finalGamePoints',
          label: 'Final Game Points',
          admin: {
            description: 'Points awarded for final game result (2 for win, 1 for tie, 0 for loss)',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'home',
                  type: 'number',
                  label: 'Home Final Points',
                  defaultValue: 0,
                  min: 0,
                  max: 2,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'away',
                  type: 'number',
                  label: 'Away Final Points',
                  defaultValue: 0,
                  min: 0,
                  max: 2,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'group',
          name: 'totalGamePoints',
          label: 'Total Game Points',
          admin: {
            description: 'Total tournament points for this game (max 5 per team)',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'home',
                  type: 'number',
                  label: 'Home Total Points',
                  defaultValue: 0,
                  min: 0,
                  max: 5,
                  admin: {
                    width: '50%',
                    readOnly: true,
                  },
                },
                {
                  name: 'away',
                  type: 'number',
                  label: 'Away Total Points',
                  defaultValue: 0,
                  min: 0,
                  max: 5,
                  admin: {
                    width: '50%',
                    readOnly: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Game Timing',
      fields: [
        {
          name: 'periodLength',
          type: 'number',
          label: 'Period Length (minutes)',
          defaultValue: 12,
          admin: {
            description: '12 for pool play, 15 for medal games',
          },
        },
        {
          name: 'currentPeriod',
          type: 'select',
          label: 'Current Period',
          defaultValue: '0',
          options: [
            { label: 'Pre-Game', value: '0' },
            { label: 'Period 1', value: '1' },
            { label: 'Period 2', value: '2' },
            { label: 'Period 3', value: '3' },
            { label: 'OT1', value: 'OT1' },
            { label: 'OT2', value: 'OT2' },
            { label: 'OT3', value: 'OT3' },
          ],
        },
        {
          name: 'periodTimeRemaining',
          type: 'number',
          label: 'Period Time Remaining (seconds)',
          admin: {
            description: 'Time remaining in current period',
          },
        },
        {
          name: 'overtimeAllowed',
          type: 'checkbox',
          label: 'Overtime Allowed',
          admin: {
            description: 'Only medal games allow overtime',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Media & Additional Info',
      fields: [
        {
          name: 'youtubeUrl',
          type: 'text',
          label: 'YouTube Live Stream URL',
          admin: {
            description: 'Live stream URL for this game',
          },
        },
        {
          type: 'group',
          name: 'threeStars',
          label: 'Three Stars',
          admin: {
            description: 'Post-game recognition (selected immediately after game)',
          },
          fields: [
            {
              name: 'first',
              type: 'relationship',
              relationTo: 'players',
              label: 'First Star',
            },
            {
              name: 'second',
              type: 'relationship',
              relationTo: 'players',
              label: 'Second Star',
            },
            {
              name: 'third',
              type: 'relationship',
              relationTo: 'players',
              label: 'Third Star',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-calculate total period points
        if (data?.periodPoints) {
          const homeTotal = (data.periodPoints.period1Home || 0) + 
                           (data.periodPoints.period2Home || 0) + 
                           (data.periodPoints.period3Home || 0)
          const awayTotal = (data.periodPoints.period1Away || 0) + 
                           (data.periodPoints.period2Away || 0) + 
                           (data.periodPoints.period3Away || 0)
          
          data.periodPoints.totalPeriodHome = homeTotal
          data.periodPoints.totalPeriodAway = awayTotal
        }
        
        // Auto-calculate total game points
        if (data?.periodPoints && data?.finalGamePoints) {
          const homePeriodTotal = data.periodPoints.totalPeriodHome || 0
          const awayPeriodTotal = data.periodPoints.totalPeriodAway || 0
          const homeFinalPoints = data.finalGamePoints.home || 0
          const awayFinalPoints = data.finalGamePoints.away || 0
          
          if (!data.totalGamePoints) {
            data.totalGamePoints = { home: 0, away: 0 }
          }
          
          data.totalGamePoints.home = homePeriodTotal + homeFinalPoints
          data.totalGamePoints.away = awayPeriodTotal + awayFinalPoints
        }
        
        // Set period length based on game type
        if (data?.gameType && !data?.periodLength) {
          data.periodLength = data.gameType === 'medal' ? 15 : 12
        }
        
        // Set overtime allowed based on game type
        if (data?.gameType) {
          data.overtimeAllowed = data.gameType === 'medal'
        }
        
        // Set current goalies to starting goalies if not set
        if (data?.homeStartingGoalie && !data?.homeCurrentGoalie) {
          data.homeCurrentGoalie = data.homeStartingGoalie
        }
        if (data?.awayStartingGoalie && !data?.awayCurrentGoalie) {
          data.awayCurrentGoalie = data.awayStartingGoalie
        }
        
        return data
      },
    ],
  },
}