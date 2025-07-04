# Backend Task: User Roles & Authentication System

## Overview
Implement a three-tier authentication system with Super Admin, Admin, and Scorekeeper roles for the Cowtown Showdown tournament.

## User Role Hierarchy

### 1. Super Admin
**Permissions**:
- Full system access
- User management (create/edit/delete all users)
- System configuration
- Database management
- Access to all collections and endpoints
- Can promote/demote other users
- Tournament archival functions

**Use Cases**:
- System maintenance
- Emergency overrides
- User account recovery
- System-wide settings

### 2. Admin
**Permissions**:
- Tournament management
- Team approval/rejection
- Schedule management
- Game management (create/edit/delete)
- View all statistics and reports
- Create/manage scorekeeper accounts
- Cannot modify super admin accounts

**Use Cases**:
- Day-to-day tournament operations
- Team registration processing
- Schedule adjustments
- Report generation

### 3. Scorekeeper
**Permissions**:
- Access to scorekeeper interface
- Manage assigned games (start/update/complete)
- Record game events (goals, penalties, etc.)
- Cannot edit teams or schedules
- Cannot access admin functions
- 4-hour session timeout

**Use Cases**:
- Live game scoring
- Stat entry during games
- Three stars selection
- Game completion

## Implementation

### 1. Update Users Collection
**File**: `src/collections/Users/index.ts`

```typescript
import { CollectionConfig } from 'payload/types'
import { isAdmin, isSuperAdmin } from '../../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: {
      secure: true,
      sameSite: 'lax',
    },
    tokenExpiration: 14400, // 4 hours for scorekeepers
    verify: false, // Email verification not required
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'lastActivity', 'createdAt'],
    group: 'Admin',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      
      // Users can read their own data
      return {
        or: [
          { id: { equals: user.id } },
          // Admins can read scorekeeper accounts
          {
            and: [
              { role: { equals: 'scorekeeper' } },
              { _id: { exists: true } },
            ],
          },
          // Super admins can read all
          isSuperAdmin({ req: { user } }),
        ],
      }
    },
    create: isAdmin,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      
      // Users can update their own profile (limited fields)
      if (user.id === id) return true
      
      // Admins can update scorekeepers
      if (user.role === 'admin') {
        return {
          and: [
            { id: { equals: id } },
            { role: { equals: 'scorekeeper' } },
          ],
        }
      }
      
      // Super admins can update anyone
      return user.role === 'superAdmin'
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
      defaultValue: 'scorekeeper',
      options: [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Scorekeeper', value: 'scorekeeper' },
      ],
      access: {
        read: () => true,
        create: ({ req: { user } }) => {
          // Only super admins can create other super admins
          return user?.role === 'superAdmin' || user?.role === 'admin'
        },
        update: ({ req: { user }, data }) => {
          if (!user) return false
          
          // Super admins can change any role
          if (user.role === 'superAdmin') return true
          
          // Admins cannot promote to super admin
          if (user.role === 'admin' && data?.role !== 'superAdmin') return true
          
          return false
        },
      },
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
    {
      name: 'assignedGames',
      type: 'relationship',
      relationTo: 'games',
      hasMany: true,
      admin: {
        condition: (data) => data?.role === 'scorekeeper',
        description: 'Games this scorekeeper is assigned to manage',
      },
    },
    {
      name: 'lastActivity',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'sessionExpiry',
      type: 'date',
      admin: {
        readOnly: true,
        condition: (data) => data?.role === 'scorekeeper',
        position: 'sidebar',
      },
    },
    {
      name: 'permissions',
      type: 'group',
      admin: {
        condition: (data) => data?.role === 'superAdmin',
      },
      fields: [
        {
          name: 'canManageSystem',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'canAccessDatabase',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'canViewAuditLogs',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // Prevent last super admin from being demoted
        if (operation === 'update' && data.role !== 'superAdmin') {
          const superAdminCount = await req.payload.find({
            collection: 'users',
            where: {
              role: { equals: 'superAdmin' },
              id: { not_equals: req.user?.id },
            },
            limit: 1,
          })
          
          if (superAdminCount.totalDocs === 0) {
            throw new Error('Cannot remove the last super admin')
          }
        }
        
        return data
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        // Update last activity
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            lastActivity: new Date(),
            sessionExpiry: user.role === 'scorekeeper'
              ? new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
              : null,
          },
        })
        
        return user
      },
    ],
  },
}
```

### 2. Access Control Functions
**File**: `src/access/index.ts`

```typescript
import { Access } from 'payload/types'

export const isSuperAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'superAdmin'
}

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'superAdmin' || user?.role === 'admin'
}

export const isScorekeeper: Access = ({ req: { user } }) => {
  return ['superAdmin', 'admin', 'scorekeeper'].includes(user?.role)
}

export const canManageGames: Access = ({ req: { user } }) => {
  return ['superAdmin', 'admin', 'scorekeeper'].includes(user?.role)
}

export const canManageTeams: Access = ({ req: { user } }) => {
  return ['superAdmin', 'admin'].includes(user?.role)
}

export const canAccessAdmin: Access = ({ req: { user } }) => {
  return Boolean(user)
}

// Field-level access for sensitive data
export const superAdminFieldAccess = ({ req: { user } }) => {
  return user?.role === 'superAdmin'
}

export const adminFieldAccess = ({ req: { user } }) => {
  return ['superAdmin', 'admin'].includes(user?.role)
}
```

### 3. Fastify Authentication Middleware
**File**: `src/server/plugins/auth.ts`

```typescript
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import { FastifyRequest, FastifyReply } from 'fastify'

export interface AuthUser {
  id: string
  email: string
  role: 'superAdmin' | 'admin' | 'scorekeeper'
  firstName: string
  lastName: string
  sessionExpiry?: Date
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser
  }
}

export const authPlugin = fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET!,
    sign: {
      expiresIn: '24h', // Default expiry
    },
  })

  // Verify JWT and check session
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()
      
      // Check session expiry for scorekeepers
      if (request.user?.role === 'scorekeeper' && request.user.sessionExpiry) {
        const expiry = new Date(request.user.sessionExpiry)
        if (expiry < new Date()) {
          throw new Error('Session expired')
        }
      }
    } catch (err) {
      reply.code(401).send({ error: 'Authentication required' })
    }
  })

  // Role-based middleware
  fastify.decorate('requireSuperAdmin', async function (request: FastifyRequest, reply: FastifyReply) {
    await fastify.authenticate(request, reply)
    
    if (request.user?.role !== 'superAdmin') {
      reply.code(403).send({ error: 'Super admin access required' })
    }
  })

  fastify.decorate('requireAdmin', async function (request: FastifyRequest, reply: FastifyReply) {
    await fastify.authenticate(request, reply)
    
    if (!['superAdmin', 'admin'].includes(request.user?.role || '')) {
      reply.code(403).send({ error: 'Admin access required' })
    }
  })

  fastify.decorate('requireScorekeeper', async function (request: FastifyRequest, reply: FastifyReply) {
    await fastify.authenticate(request, reply)
    
    if (!['superAdmin', 'admin', 'scorekeeper'].includes(request.user?.role || '')) {
      reply.code(403).send({ error: 'Scorekeeper access required' })
    }
  })
})
```

### 4. Session Management for Scorekeepers
**File**: `src/server/services/session-manager.ts`

```typescript
export class SessionManager {
  private sessions = new Map<string, SessionData>()
  
  constructor(private redis: Redis) {
    // Check sessions every minute
    setInterval(() => this.cleanupExpiredSessions(), 60000)
  }
  
  async createSession(user: AuthUser): Promise<string> {
    const token = await generateToken(user)
    const sessionData: SessionData = {
      userId: user.id,
      role: user.role,
      startTime: new Date(),
      lastActivity: new Date(),
      expiry: user.role === 'scorekeeper'
        ? new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
        : new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }
    
    // Store in Redis with TTL
    const ttl = user.role === 'scorekeeper' ? 14400 : 86400
    await this.redis.setex(
      `session:${token}`,
      ttl,
      JSON.stringify(sessionData)
    )
    
    return token
  }
  
  async validateSession(token: string): Promise<SessionData | null> {
    const data = await this.redis.get(`session:${token}`)
    if (!data) return null
    
    const session = JSON.parse(data) as SessionData
    
    // Check expiry
    if (new Date(session.expiry) < new Date()) {
      await this.invalidateSession(token)
      return null
    }
    
    // Update last activity
    session.lastActivity = new Date()
    await this.redis.setex(
      `session:${token}`,
      Math.floor((new Date(session.expiry).getTime() - Date.now()) / 1000),
      JSON.stringify(session)
    )
    
    return session
  }
  
  async invalidateSession(token: string): Promise<void> {
    await this.redis.del(`session:${token}`)
  }
  
  private async cleanupExpiredSessions(): Promise<void> {
    // Redis handles TTL automatically, but we can add additional cleanup if needed
  }
}
```

## Authentication Flows

### 1. Login Endpoint
**File**: `src/server/routes/auth/login.ts`

```typescript
export const loginRoute: FastifyPluginAsync = async (server) => {
  server.post('/login', {
    schema: {
      body: Type.Object({
        email: Type.String({ format: 'email' }),
        password: Type.String({ minLength: 8 }),
      }),
      response: {
        200: Type.Object({
          token: Type.String(),
          user: Type.Object({
            id: Type.String(),
            email: Type.String(),
            role: Type.String(),
            firstName: Type.String(),
            lastName: Type.String(),
          }),
          expiresIn: Type.Number(),
        }),
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body
    
    try {
      // Authenticate with Payload
      const { token, user } = await payload.login({
        collection: 'users',
        data: { email, password },
      })
      
      // Create session
      const sessionToken = await sessionManager.createSession(user)
      
      // Log authentication
      await auditLog.record({
        action: 'user.login',
        userId: user.id,
        details: {
          role: user.role,
          ip: request.ip,
          userAgent: request.headers['user-agent'],
        },
      })
      
      return {
        token: sessionToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        expiresIn: user.role === 'scorekeeper' ? 14400 : 86400,
      }
    } catch (error) {
      reply.code(401).send({ error: 'Invalid credentials' })
    }
  })
}
```

### 2. Role-Based Route Protection
**File**: `src/server/routes/admin/index.ts`

```typescript
export const adminRoutes: FastifyPluginAsync = async (server) => {
  // All routes require authentication
  server.addHook('preHandler', server.authenticate)
  
  // Super Admin only routes
  server.register(async (server) => {
    server.addHook('preHandler', server.requireSuperAdmin)
    
    server.get('/system/config', systemController.getConfig)
    server.put('/system/config', systemController.updateConfig)
    server.get('/audit-logs', auditController.getLogs)
    server.post('/users/:id/promote', userController.promoteUser)
  })
  
  // Admin routes (admin + super admin)
  server.register(async (server) => {
    server.addHook('preHandler', server.requireAdmin)
    
    server.get('/teams/submissions', teamController.getSubmissions)
    server.post('/teams/submissions/:id/approve', teamController.approveSubmission)
    server.post('/teams/submissions/:id/reject', teamController.rejectSubmission)
    server.get('/reports/tournament', reportController.getTournamentReport)
    server.post('/schedule/generate', scheduleController.generateSchedule)
  })
  
  // Scorekeeper routes (all authenticated users)
  server.register(async (server) => {
    server.addHook('preHandler', server.requireScorekeeper)
    
    server.get('/games/assigned', gameController.getAssignedGames)
    server.get('/profile', userController.getProfile)
  })
}
```

## Admin UI Customization

### 1. Role-Based Dashboard
**File**: `src/components/Admin/RoleBasedDashboard.tsx`

```typescript
export function RoleBasedDashboard({ user }: { user: AuthUser }) {
  switch (user.role) {
    case 'superAdmin':
      return <SuperAdminDashboard />
    case 'admin':
      return <AdminDashboard />
    case 'scorekeeper':
      return <ScorekeeperDashboard />
    default:
      return <div>Unauthorized</div>
  }
}

function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Administration</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <DashboardCard
          title="User Management"
          icon={<UsersIcon />}
          link="/admin/users"
        />
        <DashboardCard
          title="System Configuration"
          icon={<SettingsIcon />}
          link="/admin/system"
        />
        <DashboardCard
          title="Audit Logs"
          icon={<LogsIcon />}
          link="/admin/audit"
        />
      </div>
      
      <SystemHealthMonitor />
      <DatabaseStats />
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tournament Administration</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <DashboardCard
          title="Team Management"
          icon={<TeamsIcon />}
          link="/admin/teams"
        />
        <DashboardCard
          title="Schedule"
          icon={<CalendarIcon />}
          link="/admin/schedule"
        />
        <DashboardCard
          title="Scorekeepers"
          icon={<UsersIcon />}
          link="/admin/scorekeepers"
        />
      </div>
      
      <PendingApprovals />
      <TournamentStats />
    </div>
  )
}

function ScorekeeperDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scorekeeper Dashboard</h1>
      
      <SessionTimer />
      <AssignedGames />
      <QuickLinks />
    </div>
  )
}
```

## Security Considerations

### 1. Password Requirements
```typescript
const passwordSchema = {
  superAdmin: {
    minLength: 16,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  admin: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
  },
  scorekeeper: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
  },
}
```

### 2. Two-Factor Authentication (Future)
```typescript
// Optional 2FA for super admin accounts
interface TwoFactorAuth {
  enabled: boolean
  secret?: string
  backupCodes?: string[]
  lastUsed?: Date
}
```

## Testing

### 1. Role-Based Access Tests
```typescript
describe('Role-based access control', () => {
  test('Super admin can access all endpoints', async () => {
    const token = await loginAs('superAdmin')
    
    const responses = await Promise.all([
      api.get('/admin/system/config', { headers: { authorization: `Bearer ${token}` } }),
      api.get('/admin/teams', { headers: { authorization: `Bearer ${token}` } }),
      api.get('/games/1', { headers: { authorization: `Bearer ${token}` } }),
    ])
    
    responses.forEach(res => {
      expect(res.status).toBe(200)
    })
  })
  
  test('Admin cannot access system config', async () => {
    const token = await loginAs('admin')
    
    const res = await api.get('/admin/system/config', {
      headers: { authorization: `Bearer ${token}` },
    })
    
    expect(res.status).toBe(403)
  })
  
  test('Scorekeeper session expires after 4 hours', async () => {
    const token = await loginAs('scorekeeper')
    
    // Fast-forward time
    jest.advanceTimersByTime(4 * 60 * 60 * 1000 + 1000)
    
    const res = await api.get('/games/assigned', {
      headers: { authorization: `Bearer ${token}` },
    })
    
    expect(res.status).toBe(401)
    expect(res.data.error).toBe('Session expired')
  })
})
```