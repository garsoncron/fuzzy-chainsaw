import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { authenticated } from '@/access/authenticated'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Site Header',
  admin: {
    group: 'Site Navigation',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    // Tournament logo
    {
      name: 'logo',
      type: 'upload',
      label: 'Tournament Logo',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Upload the Cowtown Showdown logo',
      },
    },
    // Header columns with dropdown support
    {
      name: 'headerColumns',
      type: 'array',
      label: 'Header Navigation Columns',
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'group',
          label: 'Column Title',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Column Heading Text',
            },
            {
              name: 'enableLink',
              type: 'checkbox',
              label: 'Enable Link',
              defaultValue: true,
            },
            link({
              appearances: false,
              overrides: {
                admin: {
                  condition: (_: unknown, { enableLink }: { enableLink: boolean }) =>
                    Boolean(enableLink),
                },
              },
            }),
          ],
          admin: {
            description: 'Create the title for the header column. Enable link if this column should be clickable.',
          },
        },
        {
          name: 'subMenuItems',
          type: 'array',
          label: 'Sub-menu Items',
          maxRows: 5,
          fields: [
            {
              name: 'linkText',
              type: 'text',
              required: true,
              label: 'Link Text',
            },
            link({
              appearances: false,
            }),
          ],
          admin: {
            description: 'Add dropdown menu items for this column',
          },
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    // Call to Action button
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      fields: [
        {
          name: 'ctaText',
          type: 'text',
          required: true,
          label: 'CTA Button Text',
        },
        link({
          appearances: false,
        }),
      ],
      admin: {
        description: 'Call to action button displayed in the header',
      },
    },
    // Legacy nav items for backward compatibility
    {
      name: 'navItems',
      type: 'array',
      label: 'Legacy Navigation Items',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description: 'Legacy navigation items - consider migrating to Header Columns',
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
