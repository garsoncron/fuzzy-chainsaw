import { PayloadRequest } from 'payload'

/**
 * @description Audit logging utilities for security and compliance
 * @dependencies Payload request context
 * @security Logs all critical actions for audit trail
 */

export interface AuditLogData {
  action: string
  userId?: string
  targetId?: string
  targetType?: 'user' | 'game' | 'team' | 'player' | 'goal' | 'penalty' | 'system'
  ipAddress?: string
  userAgent?: string
  details?: Record<string, any>
  success?: boolean
  errorMessage?: string
  severity?: 'info' | 'warning' | 'error' | 'critical'
}

/**
 * Records an audit log entry
 */
export const logAuditEvent = async (
  req: PayloadRequest,
  data: AuditLogData
): Promise<void> => {
  try {
    await req.payload.create({
      collection: 'audit-logs',
      data: {
        action: data.action,
        userId: data.userId || req.user?.id,
        targetId: data.targetId,
        targetType: data.targetType,
        timestamp: new Date(),
        ipAddress: data.ipAddress || getClientIP(req),
        userAgent: data.userAgent || req.headers?.['user-agent'],
        details: data.details || {},
        success: data.success !== false,
        errorMessage: data.errorMessage,
        severity: data.severity || 'info',
      },
    })
  } catch (error) {
    // Don't throw errors from audit logging to prevent breaking main functionality
    console.error('Failed to log audit event:', error)
  }
}

/**
 * Logs authentication events
 */
export const logAuthEvent = async (
  req: PayloadRequest,
  action: 'login' | 'logout' | 'login_failed' | 'session_expired',
  userId?: string,
  details?: Record<string, any>
): Promise<void> => {
  const severity = action === 'login_failed' ? 'warning' : 'info'
  
  await logAuditEvent(req, {
    action: `auth.${action}`,
    userId,
    targetType: 'user',
    details,
    severity,
    success: action !== 'login_failed',
  })
}

/**
 * Logs game management events
 */
export const logGameEvent = async (
  req: PayloadRequest,
  action: 'start' | 'end' | 'claim' | 'release' | 'update',
  gameId: string,
  details?: Record<string, any>
): Promise<void> => {
  await logAuditEvent(req, {
    action: `game.${action}`,
    targetId: gameId,
    targetType: 'game',
    details,
    severity: 'info',
  })
}

/**
 * Logs team management events
 */
export const logTeamEvent = async (
  req: PayloadRequest,
  action: 'create' | 'update' | 'approve' | 'reject' | 'delete',
  teamId: string,
  details?: Record<string, any>
): Promise<void> => {
  const severity = action === 'delete' ? 'warning' : 'info'
  
  await logAuditEvent(req, {
    action: `team.${action}`,
    targetId: teamId,
    targetType: 'team',
    details,
    severity,
  })
}

/**
 * Logs user management events
 */
export const logUserEvent = async (
  req: PayloadRequest,
  action: 'create' | 'update' | 'delete' | 'role_change' | 'deactivate',
  targetUserId: string,
  details?: Record<string, any>
): Promise<void> => {
  const severity = ['delete', 'role_change', 'deactivate'].includes(action) ? 'warning' : 'info'
  
  await logAuditEvent(req, {
    action: `user.${action}`,
    targetId: targetUserId,
    targetType: 'user',
    details,
    severity,
  })
}

/**
 * Logs system events
 */
export const logSystemEvent = async (
  req: PayloadRequest,
  action: 'config_change' | 'backup' | 'restore' | 'maintenance' | 'error',
  details?: Record<string, any>
): Promise<void> => {
  const severity = action === 'error' ? 'critical' : 'info'
  
  await logAuditEvent(req, {
    action: `system.${action}`,
    targetType: 'system',
    details,
    severity,
  })
}

/**
 * Logs scoring events
 */
export const logScoringEvent = async (
  req: PayloadRequest,
  action: 'goal' | 'penalty' | 'faceoff' | 'shot' | 'loose_ball',
  gameId: string,
  details?: Record<string, any>
): Promise<void> => {
  await logAuditEvent(req, {
    action: `scoring.${action}`,
    targetId: gameId,
    targetType: 'game',
    details,
    severity: 'info',
  })
}

/**
 * Gets client IP address from request
 */
export const getClientIP = (req: PayloadRequest): string => {
  return (
    req.headers?.['x-forwarded-for'] ||
    req.headers?.['x-real-ip'] ||
    req.ip ||
    'unknown'
  )
}

/**
 * Creates audit context for middleware
 */
export const createAuditContext = (req: PayloadRequest) => ({
  logAuth: (action: string, details?: Record<string, any>) => 
    logAuthEvent(req, action as any, req.user?.id, details),
  logGame: (action: string, gameId: string, details?: Record<string, any>) => 
    logGameEvent(req, action as any, gameId, details),
  logTeam: (action: string, teamId: string, details?: Record<string, any>) => 
    logTeamEvent(req, action as any, teamId, details),
  logUser: (action: string, userId: string, details?: Record<string, any>) => 
    logUserEvent(req, action as any, userId, details),
  logSystem: (action: string, details?: Record<string, any>) => 
    logSystemEvent(req, action as any, details),
  logScoring: (action: string, gameId: string, details?: Record<string, any>) => 
    logScoringEvent(req, action as any, gameId, details),
})