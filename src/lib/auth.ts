/**
 * @description Authentication utilities for scorekeeper access and API endpoints
 * @dependencies Payload CMS auth, cookies, server-side auth, Next.js headers
 * @notes Server-side only functions for user authentication with API support
 */

import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { User } from '@/payload-types'
import { NextRequest } from 'next/server'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return null
    }

    // Create headers with the authorization token
    const headersList = await headers()
    const authHeaders = new Headers(headersList)
    authHeaders.set('Authorization', `Bearer ${token}`)

    const { user } = await payload.auth({
      headers: authHeaders,
    })

    return user || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(allowedRoles: string[] = ['admin', 'scorekeeper', 'superAdmin']): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('Account is deactivated')
  }

  // Check role permissions
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }

  // Validate session for scorekeepers
  if (user.role === 'scorekeeper' && user.sessionExpiry) {
    const expiry = new Date(user.sessionExpiry)
    if (expiry < new Date()) {
      throw new Error('Session expired')
    }
  }

  return user
}

/**
 * API endpoint authentication using Bearer token from headers
 */
export async function authenticateAPIRequest(request: NextRequest): Promise<User | null> {
  try {
    const payload = await getPayload({ config })
    
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    if (!token) {
      return null
    }

    // Verify token with Payload
    const { user } = await payload.auth({
      headers: request.headers,
    })
    
    return user || null
  } catch (error) {
    console.error('API authentication error:', error)
    return null
  }
}

/**
 * Require API authentication with specific roles
 */
export async function requireAPIAuth(
  request: NextRequest,
  allowedRoles: string[] = ['admin', 'scorekeeper', 'superAdmin']
): Promise<User> {
  const user = await authenticateAPIRequest(request)
  
  if (!user) {
    throw new Error('Authentication required')
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }

  return user
}

/**
 * Check if user has scorekeeper role for the specific game
 */
export async function requireGameScorekeeper(
  request: NextRequest,
  gameId: string
): Promise<User> {
  const user = await requireAPIAuth(request, ['admin', 'scorekeeper', 'superAdmin'])
  
  // Admins and superAdmins can access any game
  if (user.role === 'admin' || user.role === 'superAdmin') {
    return user
  }
  
  // Scorekeepers need to be assigned to the specific game
  try {
    const payload = await getPayload({ config })
    const game = await payload.findByID({
      collection: 'games',
      id: gameId,
    })

    if (!game) {
      throw new Error('Game not found')
    }

    if (game.assignedScorekeeper !== user.id) {
      throw new Error('Not assigned to this game')
    }

    return user
  } catch (error) {
    if (error instanceof Error && error.message === 'Game not found') {
      throw error
    }
    if (error instanceof Error && error.message === 'Not assigned to this game') {
      throw error
    }
    throw new Error('Cannot verify game assignment')
  }
}

/**
 * Rate limiting for API endpoints
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  
  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
  
  const current = rateLimitMap.get(identifier)
  
  if (!current || current.resetTime < now) {
    // First request in window or window has reset
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    }
  }
  
  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    }
  }
  
  current.count++
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime
  }
}

/**
 * Validate API key for webhook endpoints
 */
export function validateApiKey(request: NextRequest, expectedKey?: string): boolean {
  if (!expectedKey) return false
  
  const apiKey = request.headers.get('x-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '')
  return apiKey === expectedKey
}

/**
 * Get client IP address for rate limiting
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  const remote = request.headers.get('remote-addr')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return real || remote || 'unknown'
}