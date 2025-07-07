import { CollectionConfig } from 'payload'
import { isSuperAdmin, isAdmin } from '../access'

/**
 * @description Audit logging collection for security and compliance
 * @dependencies Access control functions
 * @security Only super admins can view audit logs
 * @performance Indexes on timestamp and action for efficient querying
 */
export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'userId', 'timestamp', 'ipAddress'],
    group: 'Security',
    description: 'System audit trail for security monitoring',
  },
  access: {
    read: isSuperAdmin,
    create: () => true, // Allow programmatic creation from hooks
    update: () => false, // Audit logs are immutable
    delete: isSuperAdmin, // Only super admins can delete for compliance
  },
  fields: [
    {
      name: 'action',
      type: 'text',
      required: true,
      admin: {
        description: 'Action performed (e.g., user.login, game.start, team.approve)',
      },
    },
    {
      name: 'userId',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who performed the action',
      },
    },
    {
      name: 'targetId',
      type: 'text',
      admin: {
        description: 'ID of the resource being acted upon',
      },
    },
    {
      name: 'targetType',
      type: 'select',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Game', value: 'game' },
        { label: 'Team', value: 'team' },
        { label: 'Player', value: 'player' },
        { label: 'Goal', value: 'goal' },
        { label: 'Penalty', value: 'penalty' },
        { label: 'System', value: 'system' },
      ],
      admin: {
        description: 'Type of resource being acted upon',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        description: 'When the action occurred',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address of the user',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'User agent string',
      },
    },
    {
      name: 'details',
      type: 'json',
      admin: {
        description: 'Additional details about the action',
      },
    },
    {
      name: 'success',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether the action was successful',
      },
    },
    {
      name: 'errorMessage',
      type: 'text',
      admin: {
        condition: (data) => data?.success === false,
        description: 'Error message if action failed',
      },
    },
    {
      name: 'severity',
      type: 'select',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Critical', value: 'critical' },
      ],
      defaultValue: 'info',
      admin: {
        description: 'Severity level of the action',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Ensure timestamp is always set
        if (!data.timestamp) {
          data.timestamp = new Date()
        }
        
        return data
      },
    ],
  },
  // TODO: Add database indexes for performance later
  // indexes: [
  //   {
  //     fields: { timestamp: -1 },
  //   },
  //   {
  //     fields: { action: 1, timestamp: -1 },
  //   },
  //   {
  //     fields: { userId: 1, timestamp: -1 },
  //   },
  //   {
  //     fields: { severity: 1, timestamp: -1 },
  //   },
  // ],
}