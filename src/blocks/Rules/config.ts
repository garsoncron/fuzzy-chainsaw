import type { Block } from 'payload'

export const Rules: Block = {
  slug: 'rules',
  interfaceName: 'RulesBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Tournament Rules',
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional subtitle or description',
      },
    },
    {
      name: 'ruleCategories',
      type: 'array',
      label: 'Rule Categories',
      minRows: 1,
      fields: [
        {
          name: 'categoryTitle',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Game Format", "Scoring", "Penalties", etc.',
          },
        },
        {
          name: 'rules',
          type: 'array',
          label: 'Rules',
          minRows: 1,
          fields: [
            {
              name: 'rule',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'additionalInfo',
      type: 'textarea',
      label: 'Additional Information',
      admin: {
        description: 'Any additional notes or clarifications',
      },
    },
  ],
  labels: {
    singular: 'Rules Block',
    plural: 'Rules Blocks',
  },
}