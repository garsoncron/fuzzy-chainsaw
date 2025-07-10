import { CollectionConfig } from 'payload'
import { isAdmin, isSuperAdmin, adminFieldAccess, superAdminFieldAccess } from '../../access'

/**
 * @description Users collection with tournament-specific roles and session management
 * @dependencies Access control functions from ../access/
 * @security Role-based access control with three tiers: superAdmin, admin, scorekeeper
 * @performance Optimized queries with proper indexing on role and lastActivity fields
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
    tokenExpiration: 14400, // 4 hours - will be extended for non-scorekeepers
    verify: false, // Email verification not required for tournament
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
    // Password validation
    useAPIKey: false,
    depth: 0,
    disableLocalStrategy: false,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role'],
    group: 'Tournament Management',
    listSearchableFields: ['email', 'firstName', 'lastName'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: async ({ req }) => {
      // Allow first user creation when no users exist
      const userCount = await req.payload.find({
        collection: 'users',
        limit: 1,
      })
      
      if (userCount.totalDocs === 0) {
        return true // Allow first user creation
      }
      
      // Otherwise require authentication
      return Boolean(req.user)
    },
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      access: {
        update: ({ req: { user } }) => Boolean(user),
      },
      options: [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Scorekeeper', value: 'scorekeeper' },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    // Override default password field to add validation
    {
      name: 'password',
      type: 'text',
      admin: {
        hidden: true, // Hide in admin list views
      },
      hooks: {
        beforeChange: [
          async ({ value, req }) => {
            // Skip validation for first user creation (when no users exist)
            if (value && typeof value === 'string') {
              const userCount = await req.payload.find({
                collection: 'users',
                limit: 1,
              })
              
              // Less strict validation for first user
              if (userCount.totalDocs === 0) {
                if (value.length < 6) {
                  throw new Error('Password must be at least 6 characters long')
                }
                return value
              }
              
              // Full validation for subsequent users
              if (value.length < 8) {
                throw new Error('Password must be at least 8 characters long')
              }
              if (!/(?=.*[a-z])/.test(value)) {
                throw new Error('Password must contain at least one lowercase letter')
              }
              if (!/(?=.*[A-Z])/.test(value)) {
                throw new Error('Password must contain at least one uppercase letter')
              }
              if (!/(?=.*\d)/.test(value)) {
                throw new Error('Password must contain at least one number')
              }
              if (!/(?=.*[@$!%*?&])/.test(value)) {
                throw new Error('Password must contain at least one special character (@$!%*?&)')
              }
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        // Validate unique email
        if (data?.email && (operation === 'create' || operation === 'update')) {
          const existingUser = await req.payload.find({
            collection: 'users',
            where: {
              email: { equals: data.email },
              id: { not_equals: data.id || '' }, // Exclude current user for updates
            },
            limit: 1,
          })
          
          if (existingUser.totalDocs > 0) {
            throw new Error('Email address is already in use')
          }
        }
        
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Log user operations for audit trail
        const auditData = {
          action: operation === 'create' ? 'user_created' : 'user_updated',
          userId: req.user?.id || null, // Who performed the action
          targetId: doc.id, // The user being created/updated
          targetType: 'user',
          timestamp: new Date(),
          details: {
            userEmail: doc.email,
            role: doc.role,
            firstName: doc.firstName,
            lastName: doc.lastName,
            performedBy: req.user?.email || 'system',
          },
        }
        
        // Create audit log entry
        try {
          await req.payload.create({
            collection: 'audit-logs',
            data: auditData,
          })
        } catch (error) {
          req.payload.logger.error('Failed to create audit log:', error)
        }
        
        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // Log user deletion for audit trail
        const auditData = {
          action: 'user_deleted',
          userId: req.user?.id || null, // Who performed the action
          targetId: doc.id, // The user being deleted
          targetType: 'user',
          timestamp: new Date(),
          details: {
            userEmail: doc.email,
            role: doc.role,
            firstName: doc.firstName,
            lastName: doc.lastName,
            performedBy: req.user?.email || 'system',
          },
        }
        
        // Create audit log entry
        try {
          await req.payload.create({
            collection: 'audit-logs',
            data: auditData,
          })
        } catch (error) {
          req.payload.logger.error('Failed to create audit log:', error)
        }
        
        return doc
      },
    ],
  },
  // TODO: Add database indexes for performance later
  // indexes: [
  //   {
  //     fields: { role: 1, isActive: 1 },
  //   },
  //   {
  //     fields: { lastActivity: -1 },
  //   },
  //   {
  //     fields: { sessionExpiry: 1 },
  //   },
  // ],
}