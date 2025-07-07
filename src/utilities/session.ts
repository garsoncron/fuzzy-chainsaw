import { PayloadRequest } from 'payload'

/**
 * @description Session management utilities for scorekeeper authentication
 * @dependencies Payload request context
 * @security Validates session expiry and role-based access
 */

export interface SessionData {
  userId: string
  role: 'superAdmin' | 'admin' | 'scorekeeper'
  email: string
  firstName: string
  lastName: string
  startTime: Date
  lastActivity: Date
  expiry: Date
  assignedGames?: string[]
}

export interface AuthUser {
  id: string
  email: string
  role: 'superAdmin' | 'admin' | 'scorekeeper'
  firstName: string
  lastName: string
  sessionExpiry?: Date
  assignedGames?: string[]
  isActive: boolean
}

/**
 * Validates if a user session is still valid
 */
export const isSessionValid = (user: AuthUser): boolean => {
  if (!user.isActive) return false
  
  // Check session expiry for scorekeepers
  if (user.role === 'scorekeeper' && user.sessionExpiry) {
    const expiry = new Date(user.sessionExpiry)
    if (expiry < new Date()) {
      return false
    }
  }
  
  return true
}

/**
 * Extends session for active users
 */
export const extendSession = async (
  req: PayloadRequest,
  userId: string,
  role: string
): Promise<Date | null> => {
  if (role !== 'scorekeeper') return null
  
  const newExpiry = new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
  
  await req.payload.update({
    collection: 'users',
    id: userId,
    data: {
      lastActivity: new Date(),
      sessionExpiry: newExpiry,
    },
  })
  
  return newExpiry
}

/**
 * Invalidates a user session
 */
export const invalidateSession = async (
  req: PayloadRequest,
  userId: string
): Promise<void> => {
  await req.payload.update({
    collection: 'users',
    id: userId,
    data: {
      sessionExpiry: null,
    },
  })
}

/**
 * Gets remaining session time in seconds
 */
export const getSessionTimeRemaining = (user: AuthUser): number => {
  if (user.role !== 'scorekeeper' || !user.sessionExpiry) return -1
  
  const expiry = new Date(user.sessionExpiry)
  const now = new Date()
  
  return Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / 1000))
}

/**
 * Checks if user can claim a game
 */
export const canClaimGame = (user: AuthUser, gameId: string): boolean => {
  if (!user.isActive) return false
  
  // Admins and super admins can claim any game
  if (['superAdmin', 'admin'].includes(user.role)) return true
  
  // Scorekeepers can only claim assigned games or unassigned games
  if (user.role === 'scorekeeper') {
    return user.assignedGames?.includes(gameId) || false
  }
  
  return false
}

/**
 * Security context for middleware
 */
export const createSecurityContext = (user: AuthUser) => ({
  user,
  isAuthenticated: Boolean(user),
  isActive: user.isActive,
  sessionValid: isSessionValid(user),
  sessionTimeRemaining: getSessionTimeRemaining(user),
  permissions: {
    canManageSystem: user.role === 'superAdmin',
    canManageTournament: ['superAdmin', 'admin'].includes(user.role),
    canManageGames: ['superAdmin', 'admin', 'scorekeeper'].includes(user.role),
    canManageTeams: ['superAdmin', 'admin'].includes(user.role),
    canViewAuditLogs: user.role === 'superAdmin',
  },
})