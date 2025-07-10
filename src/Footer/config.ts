import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'landAcknowledgment',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show/hide the land acknowledgment section',
          },
        },
        {
          name: 'text',
          type: 'richText',
          admin: {
            description: 'Land acknowledgment text content',
          },
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
