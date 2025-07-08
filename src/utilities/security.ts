import { NextRequest, NextResponse } from 'next/server'
import { PayloadRequest } from 'payload'

/**
 * @description Security utilities for rate limiting and request validation
 * @dependencies Next.js request/response objects
 * @security Implements rate limiting and request validation
 */

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export interface SecurityHeaders {
  'Content-Security-Policy': string
  'X-Frame-Options': string
  'X-Content-Type-Options': string
  'Referrer-Policy': string
  'Permissions-Policy': string
  'Strict-Transport-Security': string
}

/**
 * Rate limiting middleware
 */
export const rateLimit = (config: RateLimitConfig) => {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const ip = getClientIP(req)
    const key = `rate_limit:${ip}`
    const now = Date.now()
    
    // Clean expired entries
    if (rateLimitStore.has(key)) {
      const data = rateLimitStore.get(key)!
      if (now > data.resetTime) {
        rateLimitStore.delete(key)
      }
    }
    
    // Get or create rate limit data
    const data = rateLimitStore.get(key) || {
      count: 0,
      resetTime: now + config.windowMs,
    }
    
    // Increment counter
    data.count++
    rateLimitStore.set(key, data)
    
    // Check if limit exceeded
    if (data.count > config.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((data.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(data.resetTime).toISOString(),
          }
        }
      )
    }
    
    return null // Allow request to proceed
  }
}

/**
 * Security headers for enhanced protection
 */
export const getSecurityHeaders = (): SecurityHeaders => ({
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.payload.com",
    "frame-src https://www.youtube.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
})

/**
 * CSRF protection middleware
 */
export const csrfProtection = async (req: NextRequest): Promise<NextResponse | null> => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') return null
  
  const csrfToken = req.headers.get('x-csrf-token')
  const sessionToken = req.headers.get('authorization') || req.cookies.get('payload-token')?.value
  
  if (!csrfToken || !sessionToken) {
    return NextResponse.json(
      { error: 'CSRF token required' },
      { status: 403 }
    )
  }
  
  // Validate CSRF token (implement your validation logic)
  if (!validateCSRFToken(csrfToken, sessionToken)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }
  
  return null
}

/**
 * Input validation and sanitization
 */
export const validateInput = (data: any, schema: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Basic validation (expand as needed)
  if (typeof data !== 'object' || data === null) {
    errors.push('Invalid input data')
    return { valid: false, errors }
  }
  
  // Validate against schema
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key]
    const fieldRules = rules as any
    
    if (fieldRules.required && (value === undefined || value === null)) {
      errors.push(`${key} is required`)
    }
    
    if (value && fieldRules.type && typeof value !== fieldRules.type) {
      errors.push(`${key} must be of type ${fieldRules.type}`)
    }
    
    if (value && fieldRules.minLength && value.length < fieldRules.minLength) {
      errors.push(`${key} must be at least ${fieldRules.minLength} characters`)
    }
    
    if (value && fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors.push(`${key} must be at most ${fieldRules.maxLength} characters`)
    }
    
    if (value && fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors.push(`${key} has invalid format`)
    }
  }
  
  return { valid: errors.length === 0, errors }
}

/**
 * Sanitize input data
 */
export const sanitizeInput = (data: any): any => {
  if (typeof data === 'string') {
    return data
      .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
      .trim()
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput)
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }
  
  return data
}

/**
 * Get client IP address
 */
export const getClientIP = (req: NextRequest): string => {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    req.ip ||
    'unknown'
  )
}

/**
 * Validate CSRF token (implement your own logic)
 */
export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  try {
    // Decode the CSRF token
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const parts = decoded.split(':')
    
    if (parts.length !== 3) {
      return false
    }
    
    const [tokenSessionPart, timestamp, randomBytes] = parts
    
    // Check if the session token matches
    if (tokenSessionPart !== sessionToken.substring(0, 10)) {
      return false
    }
    
    // Check if the token is not too old (1 hour max)
    const tokenTime = parseInt(timestamp)
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    
    if (now - tokenTime > oneHour) {
      return false
    }
    
    // Check if randomBytes exist
    if (!randomBytes || randomBytes.length === 0) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('CSRF token validation error:', error)
    return false
  }
}

/**
 * Generate CSRF token
 */
export const generateCSRFToken = (sessionToken: string): string => {
  // Create a more robust CSRF token
  const timestamp = Date.now().toString()
  const randomBytes = Math.random().toString(36).substring(2, 15)
  const tokenPayload = `${sessionToken.substring(0, 10)}:${timestamp}:${randomBytes}`
  return Buffer.from(tokenPayload).toString('base64')
}

/**
 * Security middleware for Payload hooks
 */
export const securityMiddleware = async (req: PayloadRequest): Promise<void> => {
  // Update user activity
  if (req.user) {
    await req.payload.update({
      collection: 'users',
      id: req.user.id,
      data: {
        lastActivity: new Date(),
      },
    })
  }
  
  // Log security-relevant events
  const securityActions = ['create', 'update', 'delete']
  if (securityActions.includes(req.route?.method || '')) {
    // TODO: Log to audit trail
  }
}

/**
 * Rate limiting configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Public endpoints - more restrictive
  public: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  
  // Authentication endpoints - very restrictive
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  
  // Admin endpoints - moderate
  admin: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200,
  },
  
  // Scoring endpoints - higher limits for live games
  scoring: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 60,
  },
}

/**
 * Input validation schemas
 */
export const validationSchemas = {
  login: {
    email: {
      required: true,
      type: 'string',
      pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
    },
    password: {
      required: true,
      type: 'string',
      minLength: 8,
    },
  },
  
  goal: {
    playerId: {
      required: true,
      type: 'string',
    },
    gameId: {
      required: true,
      type: 'string',
    },
    period: {
      required: true,
      type: 'number',
    },
  },
  
  penalty: {
    playerId: {
      required: true,
      type: 'string',
    },
    gameId: {
      required: true,
      type: 'string',
    },
    infraction: {
      required: true,
      type: 'string',
    },
    duration: {
      required: true,
      type: 'string',
    },
  },
}