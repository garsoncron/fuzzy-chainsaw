import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'province', 'updatedAt'],
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Team Name',
      admin: {
        description: 'Full team name (e.g., "Calgary Bears")',
      },
    },
    ...slugField('name'),
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Team Logo',
      admin: {
        description: 'Upload team logo for branding',
      },
    },
    {
      name: 'primaryColor',
      type: 'text',
      label: 'Primary Color',
      admin: {
        description: 'Hex color code (e.g., #934F25)',
        placeholder: '#934F25',
      },
      validate: (value) => {
        if (value && !/^#[0-9A-F]{6}$/i.test(value)) {
          return 'Please enter a valid hex color code (e.g., #934F25)'
        }
        return true
      },
    },
    {
      name: 'secondaryColor',
      type: 'text',
      label: 'Secondary Color',
      admin: {
        description: 'Secondary hex color code (e.g., #D6AC4D)',
        placeholder: '#D6AC4D',
      },
      validate: (value) => {
        if (value && !/^#[0-9A-F]{6}$/i.test(value)) {
          return 'Please enter a valid hex color code (e.g., #D6AC4D)'
        }
        return true
      },
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      label: 'City',
      admin: {
        description: 'Team city (e.g., "Calgary")',
      },
    },
    {
      name: 'province',
      type: 'text',
      required: true,
      label: 'Province',
      admin: {
        description: 'Team province (e.g., "Alberta")',
      },
    },
    {
      type: 'group',
      name: 'captain',
      label: 'Team Captain',
      admin: {
        description: 'Primary contact for team communication',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Captain Name',
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'Captain Email',
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Captain Phone',
          admin: {
            description: 'Phone number for tournament communication',
          },
        },
      ],
    },
  ],
}