# Backend Task: Access Control & Permissions

## Overview
Implement role-based access control for tournament management, ensuring proper permissions for different user types.

## User Roles

### 1. Admin
- Full access to all collections and endpoints
- Can manage users and roles
- Can edit tournament settings
- Can approve team submissions

### 2. Scorekeeper
- Can manage live games (start, update scores, end)
- Can add/edit game events (goals, penalties, etc.)
- Cannot edit teams or players
- Cannot approve team submissions

### 3. Team Manager
- Can view their team's data
- Can submit team registration
- Can update roster (with approval)
- Cannot edit game data

### 4. Public
- Read-only access to public data
- Can view games, teams, stats
- Can submit team registration form
- No write access to game data

## Implementation

### 1. Update Users Collection
**File**: `src/collections/Users/index.ts`

```typescript
{
  slug: 'users',
  auth: true,
  fields: [
    // ... existing fields ...
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Scorekeeper', value: 'scorekeeper' },
        { label: 'Team Manager', value: 'teamManager' },
      ],
      defaultValue: ['teamManager'],
      required: true,
    },
    {
      name: 'managedTeam',
      type: 'relationship',
      relationTo: 'teams',
      admin: {
        condition: (data) => data?.roles?.includes('teamManager'),
      },
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return false
    },
    create: ({ req: { user } }) => {
      return user?.roles?.includes('admin')
    },
    update: ({ req: { user }, id }) => {
      if (user?.roles?.includes('admin')) return true
      return user?.id === id // Users can update their own profile
    },
    delete: ({ req: { user } }) => {
      return user?.roles?.includes('admin')
    },
  },
}
```

### 2. Access Control Functions
**File**: `src/access/index.ts`

```typescript
import { Access, FieldAccess } from 'payload/types'

// Check if user has specific role
export const hasRole = (role: string): Access => ({ req: { user } }) => {
  return user?.roles?.includes(role) || false
}

// Check if user has any of the specified roles
export const hasAnyRole = (roles: string[]): Access => ({ req: { user } }) => {
  if (!user) return false
  return roles.some(role => user.roles?.includes(role))
}

// Admin only access
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin') || false
}

// Scorekeeper or admin access
export const canManageGames: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('admin') || user.roles?.includes('scorekeeper')
}

// Team manager access for their own team
export const canManageOwnTeam: Access = ({ req: { user }, id }) => {
  if (!user) return false
  if (user.roles?.includes('admin')) return true
  if (user.roles?.includes('teamManager') && user.managedTeam) {
    return {
      id: { equals: user.managedTeam }
    }
  }
  return false
}

// Public read access
export const publicRead: Access = () => true

// Authenticated read access
export const authenticatedRead: Access = ({ req: { user } }) => !!user

// Field-level access for sensitive data
export const adminFieldAccess: FieldAccess = ({ req: { user } }) => {
  return user?.roles?.includes('admin') || false
}
```

### 3. Collection Access Control

#### Teams Collection
```typescript
access: {
  read: publicRead,
  create: isAdmin,
  update: canManageOwnTeam,
  delete: isAdmin,
}
```

#### Players Collection
```typescript
access: {
  read: publicRead,
  create: hasAnyRole(['admin', 'teamManager']),
  update: ({ req: { user }, data }) => {
    if (isAdmin({ req: { user } })) return true
    // Team managers can only update players on their team
    if (user?.roles?.includes('teamManager') && user.managedTeam) {
      return {
        team: { equals: user.managedTeam }
      }
    }
    return false
  },
  delete: isAdmin,
}
```

#### Games Collection
```typescript
access: {
  read: publicRead,
  create: isAdmin,
  update: canManageGames,
  delete: isAdmin,
},
fields: [
  // ... other fields ...
  {
    name: 'status',
    type: 'select',
    access: {
      update: canManageGames,
    },
  },
  {
    name: 'homeScore',
    type: 'number',
    access: {
      update: canManageGames,
    },
  },
  // Similar field-level access for other game state fields
]
```

#### Goals/Penalties/Shots/Faceoffs Collections
```typescript
access: {
  read: publicRead,
  create: canManageGames,
  update: canManageGames,
  delete: canManageGames,
}
```

#### TeamSubmissions Collection
```typescript
access: {
  read: hasAnyRole(['admin', 'teamManager']),
  create: () => true, // Anyone can submit
  update: isAdmin,
  delete: isAdmin,
}
```

### 4. API Route Protection
**File**: `src/utilities/auth.ts`

```typescript
import { PayloadRequest } from 'payload/types'
import { NextResponse } from 'next/server'

export const requireAuth = async (
  req: PayloadRequest,
  requiredRoles?: string[]
): Promise<NextResponse | null> => {
  if (!req.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      req.user.roles?.includes(role)
    )
    
    if (!hasRequiredRole) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
  }

  return null
}

// Usage in API routes:
export async function POST(req: Request) {
  const authError = await requireAuth(req, ['admin', 'scorekeeper'])
  if (authError) return authError
  
  // Route logic here
}
```

### 5. Scorekeeper Session Management
**File**: `src/hooks/scorekeeperSession.ts`

```typescript
import { CollectionBeforeChangeHook } from 'payload/types'

export const trackScorekeeperActivity: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation === 'update' && req.user?.roles?.includes('scorekeeper')) {
    // Track last activity for session timeout
    await req.payload.update({
      collection: 'users',
      id: req.user.id,
      data: {
        lastActivity: new Date(),
      },
    })
  }
  
  return data
}

// Session timeout check middleware
export const checkScorekeeperSession = async (req: PayloadRequest) => {
  const TIMEOUT = parseInt(process.env.SCOREKEEPER_SESSION_TIMEOUT || '14400') // 4 hours
  
  if (req.user?.roles?.includes('scorekeeper')) {
    const lastActivity = new Date(req.user.lastActivity)
    const now = new Date()
    const diff = (now.getTime() - lastActivity.getTime()) / 1000
    
    if (diff > TIMEOUT) {
      // Force logout
      req.user = null
      throw new Error('Session expired. Please login again.')
    }
  }
}
```

### 6. Audit Trail
**File**: `src/collections/AuditLog/index.ts`

```typescript
export const AuditLog: CollectionConfig = {
  slug: 'auditLog',
  access: {
    read: isAdmin,
    create: () => false, // Only system can create
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'action',
      type: 'text',
      required: true,
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
    },
    {
      name: 'changes',
      type: 'json',
    },
    {
      name: 'timestamp',
      type: 'date',
      defaultValue: () => new Date(),
      required: true,
    },
  ],
}

// Audit hook for critical collections
export const auditChanges: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
  collection,
}) => {
  if (req.user && ['create', 'update', 'delete'].includes(operation)) {
    await req.payload.create({
      collection: 'auditLog',
      data: {
        user: req.user.id,
        action: operation,
        collection: collection.slug,
        documentId: doc.id,
        changes: operation === 'update' ? 
          { before: previousDoc, after: doc } : 
          doc,
      },
    })
  }
}
```

## Security Best Practices

1. **Principle of Least Privilege**: Users only get the minimum permissions needed
2. **Role Validation**: Always validate roles on both client and server
3. **Session Management**: Implement timeout for scorekeeper sessions
4. **Audit Trail**: Log all critical operations
5. **Field-Level Security**: Restrict sensitive fields to appropriate roles
6. **API Protection**: Validate permissions in all API routes

## Testing Requirements

1. Test each role's access to collections
2. Verify field-level permissions
3. Test API route protection
4. Validate session timeout functionality
5. Ensure audit trail captures all changes
6. Test edge cases (role changes, team switches)