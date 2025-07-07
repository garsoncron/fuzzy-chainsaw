# Authentication & Security Implementation

## Overview

The Cowtown Showdown tournament system implements a comprehensive role-based authentication and security system designed for live tournament operations. The system provides three primary user roles with different access levels and security measures appropriate for tournament administration and scoring.

## User Roles & Permissions

### Super Admin
- **Full system access** including configuration and user management
- **Database management** capabilities
- **Audit log access** for security monitoring
- **Emergency override** capabilities for all tournament functions
- **User promotion/demotion** authority
- **Session:** No automatic expiry (24 hours default)

### Admin
- **Tournament management** including teams, schedules, and games
- **Team approval/rejection** authority
- **Scorekeeper account management**
- **Report generation** and analytics access
- **Cannot modify** super admin accounts
- **Session:** No automatic expiry (24 hours default)

### Scorekeeper
- **Game scoring and management** for assigned games
- **Live event recording** (goals, penalties, faceoffs, etc.)
- **Three stars selection** post-game
- **Limited to assigned games** only
- **Session:** 4-hour automatic expiry with extension capability
- **Cannot access** admin functions or team management

## Security Features

### Session Management
- **Scorekeeper sessions** automatically expire after 4 hours
- **Session extension** available through UI or API
- **Activity tracking** updates last activity timestamp
- **Secure token** handling with Payload CMS authentication

### Rate Limiting
- **Authentication endpoints:** 5 requests per 15 minutes
- **Admin endpoints:** 200 requests per 15 minutes
- **Scoring endpoints:** 60 requests per minute (for live games)
- **Public endpoints:** 100 requests per 15 minutes

### Security Headers
- **Content Security Policy** with strict directives
- **CSRF protection** for state-changing operations
- **XSS protection** with proper headers
- **Frame options** to prevent clickjacking
- **Strict Transport Security** for HTTPS enforcement

### Audit Logging
- **All authentication events** (login, logout, failures)
- **Game management actions** (claim, release, scoring)
- **User management changes** (role changes, activation)
- **System configuration** modifications
- **IP address and user agent** tracking

## Implementation Files

### Core Authentication
- `/src/collections/Users.ts` - Enhanced user collection with roles
- `/src/lib/auth.ts` - Authentication utilities and session validation
- `/src/utilities/session.ts` - Session management functions
- `/src/middleware.ts` - Security middleware for Next.js

### Access Control
- `/src/access/` - Role-based access control functions
  - `isSuperAdmin.ts` - Super admin access
  - `isAdmin.ts` - Admin access 
  - `isScorekeeper.ts` - Scorekeeper access
  - `canManageGames.ts` - Game management permissions
  - `canManageTeams.ts` - Team management permissions

### Security Utilities
- `/src/utilities/security.ts` - Rate limiting and validation
- `/src/utilities/audit.ts` - Audit logging functions
- `/src/collections/AuditLogs.ts` - Audit log collection

### API Endpoints
- `/src/app/api/auth/login/route.ts` - Authentication endpoint
- `/src/app/api/auth/extend-session/route.ts` - Session extension
- `/src/app/api/games/[id]/claim/route.ts` - Game claiming (enhanced)

### UI Components
- `/src/components/Auth/LoginForm.tsx` - Tournament login interface
- `/src/components/Auth/SessionTimer.tsx` - Session countdown timer
- `/src/components/Auth/GameClaimManager.tsx` - Game claiming interface

## Usage Examples

### Login Process
```typescript
// User authentication with role-based redirection
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})

const { token, user, expiresIn } = await response.json()

// Store authentication data
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))

// Redirect based on role
const redirectPath = user.role === 'scorekeeper' ? '/scorekeeper' : '/admin'
router.push(redirectPath)
```

### Session Extension
```typescript
// Extend scorekeeper session
const response = await fetch('/api/auth/extend-session', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})

const { sessionExpiry, timeRemaining } = await response.json()
```

### Game Claiming
```typescript
// Claim a game for scoring
const response = await fetch(`/api/games/${gameId}/claim`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})

const { success, claimedBy, claimedAt } = await response.json()
```

### Access Control in Collections
```typescript
// Example access control in Payload collection
access: {
  read: ({ req: { user } }) => {
    if (user?.role === 'superAdmin') return true
    if (user?.role === 'admin') return { status: { equals: 'published' } }
    return false
  },
  create: isAdmin,
  update: ({ req: { user }, id }) => {
    return user?.role === 'superAdmin' || user?.id === id
  },
  delete: isSuperAdmin,
}
```

## Security Best Practices

### Password Requirements
- **Super Admin:** 16+ characters, all character types required
- **Admin:** 12+ characters, uppercase, lowercase, numbers required
- **Scorekeeper:** 8+ characters, mixed case and numbers required

### Session Security
- **Automatic logout** on session expiry
- **Activity-based extension** for active users
- **Secure token storage** using httpOnly cookies
- **IP address validation** for suspicious activity

### API Security
- **Bearer token authentication** for API endpoints
- **Role validation** on every request
- **Input sanitization** and validation
- **Rate limiting** to prevent abuse
- **CSRF tokens** for state-changing operations

### Monitoring & Logging
- **Failed login attempts** tracked and logged
- **Suspicious activity** flagged for review
- **Session extensions** logged for audit
- **Administrative actions** require additional logging

## Environment Variables

```env
# Authentication
PAYLOAD_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Session Configuration
SCOREKEEPER_SESSION_TIMEOUT=14400  # 4 hours in seconds
ADMIN_SESSION_TIMEOUT=86400        # 24 hours in seconds

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000        # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Security
CSRF_SECRET=your-csrf-secret-here
AUDIT_LOG_RETENTION_DAYS=365
```

## Testing

### Authentication Tests
```bash
# Test role-based access
pnpm test src/lib/auth.test.ts

# Test session management
pnpm test src/utilities/session.test.ts

# Test security middleware
pnpm test src/middleware.test.ts
```

### Security Validation
- **Penetration testing** for common vulnerabilities
- **Rate limiting verification** with automated scripts
- **Session timeout validation** with different user roles
- **CSRF protection testing** for all endpoints

## Deployment Considerations

### Production Security
- **HTTPS enforcement** in all environments
- **Security headers** configured at reverse proxy level
- **Database encryption** for sensitive data
- **Regular security audits** and vulnerability scans

### Performance
- **Rate limiting** uses in-memory storage (consider Redis for scale)
- **Session data** cached appropriately
- **Audit logs** rotated based on retention policy
- **Database indexes** on security-relevant fields

## Emergency Procedures

### Account Recovery
1. **Super admin lockout:** Use database direct access for recovery
2. **Forgotten passwords:** Admin can reset scorekeeper passwords
3. **Compromised accounts:** Immediate deactivation through admin panel
4. **System breach:** Emergency lockdown procedure documented

### Security Incidents
1. **Automated alerts** for failed login attempts
2. **Audit log monitoring** for suspicious patterns
3. **Immediate response** procedures for detected threats
4. **Post-incident review** and system hardening

This authentication and security system provides enterprise-grade protection while maintaining usability for tournament operations.