import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { logAuthEvent } from '@/utilities/audit'
import { validateInput, sanitizeInput, rateLimitConfigs, rateLimit } from '@/utilities/security'

/**
 * @description Authentication endpoint for tournament users
 * @dependencies Payload CMS, audit logging, security utilities
 * @security Rate limiting, input validation, audit logging
 */

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimit(rateLimitConfigs.auth)(req)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const payload = await getPayload({ config })
    const body = await req.json()
    
    // Validate and sanitize input
    const validation = validateInput(body, {
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
    })
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      )
    }
    
    const sanitizedData = sanitizeInput(body)
    const { email, password } = sanitizedData
    
    // Attempt authentication
    try {
      const result = await payload.login({
        collection: 'users',
        data: { email, password },
      })
      
      // Check if user is active
      if (!result.user.isActive) {
        await logAuthEvent(
          { payload, user: result.user, headers: req.headers } as any,
          'login_failed',
          result.user.id,
          { reason: 'account_deactivated', email }
        )
        
        return NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 403 }
        )
      }
      
      // Update session information
      await payload.update({
        collection: 'users',
        id: result.user.id,
        data: {
          lastActivity: new Date(),
          sessionExpiry: result.user.role === 'scorekeeper'
            ? new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
            : null,
        },
      })
      
      // Log successful authentication
      await logAuthEvent(
        { payload, user: result.user, headers: req.headers } as any,
        'login',
        result.user.id,
        { role: result.user.role, email }
      )
      
      // Return user data and token
      return NextResponse.json({
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
          assignedGames: result.user.assignedGames || [],
          sessionExpiry: result.user.role === 'scorekeeper'
            ? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
            : null,
        },
        expiresIn: result.user.role === 'scorekeeper' ? 14400 : 86400, // seconds
      })
      
    } catch (authError) {
      // Log failed authentication attempt
      await logAuthEvent(
        { payload, headers: req.headers } as any,
        'login_failed',
        undefined,
        { reason: 'invalid_credentials', email }
      )
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}