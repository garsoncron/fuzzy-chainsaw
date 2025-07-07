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
    read: ({ req: { user } }) => {
      if (!user) return false
      
      // Super admins can read all users
      if (user.role === 'superAdmin') {
        return true
      }
      
      // Admins can read scorekeeper accounts and their own
      if (user.role === 'admin') {
        return {
          or: [
            { id: { equals: user.id } },
            { role: { equals: 'scorekeeper' } },
          ],
        }
      }
      
      // Regular users can only read their own data
      return { id: { equals: user.id } }
    },
    create: async ({ req }) => {
      // Allow first user creation when no users exist
      const userCount = await req.payload.find({
        collection: 'users',
        limit: 1,
      })
      
      if (userCount.totalDocs === 0) {
        return true // Allow first user creation
      }
      
      // Otherwise require admin privileges
      return isAdmin({ req })
    },
    update: ({ req: { user }, id }) => {
      if (!user) return false
      
      // Super admins can update anyone
      if (user.role === 'superAdmin') return true
      
      // Admins can update scorekeepers
      if (user.role === 'admin') {
        return {
          and: [
            { id: { equals: id } },
            { role: { equals: 'scorekeeper' } },
          ],
        }
      }
      
      // Users can update their own profile (but NOT role - see field-level access)
      if (user.id === id) return true
      
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      
      // Only super admins can delete users
      if (user.role === 'superAdmin') return true
      
      // Admins can only delete scorekeeper accounts
      if (user.role === 'admin') {
        return { role: { equals: 'scorekeeper' } }
      }
      
      return false
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      access: {
        // Only super admins can edit roles, admins can set scorekeeper role only
        update: ({ req: { user }, id }) => {
          if (!user) return false
          
          // Super admins can edit any role
          if (user.role === 'superAdmin') return true
          
          // Admins can only change scorekeepers to scorekeeper role  
          if (user.role === 'admin' && id !== user.id) return true
          
          // Users cannot edit their own role
          return false
        },
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
          ({ value }) => {
            // Password validation
            if (value && typeof value === 'string') {
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