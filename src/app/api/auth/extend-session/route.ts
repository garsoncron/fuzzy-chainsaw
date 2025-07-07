import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { extendSession } from '@/utilities/session'
import { logAuthEvent } from '@/utilities/audit'

/**
 * @description Session extension endpoint for scorekeepers
 * @dependencies Payload CMS, session utilities, audit logging
 * @security Authentication required, role validation
 */

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    
    // Verify the token and get user
    try {
      const { user } = await payload.verifyEmail({
        collection: 'users',
        token,
      })
      
      // Only scorekeepers need session extension
      if (user.role !== 'scorekeeper') {
        return NextResponse.json(
          { error: 'Session extension not required for your role' },
          { status: 400 }
        )
      }
      
      // Check if user is active
      if (!user.isActive) {
        return NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 403 }
        )
      }
      
      // Extend the session
      const newExpiry = await extendSession(
        { payload, user, headers: req.headers } as any,
        user.id,
        user.role
      )
      
      // Log session extension
      await logAuthEvent(
        { payload, user, headers: req.headers } as any,
        'session_extended' as any,
        user.id,
        { newExpiry: newExpiry?.toISOString() }
      )
      
      return NextResponse.json({
        success: true,
        sessionExpiry: newExpiry?.toISOString(),
        timeRemaining: 14400, // 4 hours in seconds
      })
      
    } catch (tokenError) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
  } catch (error) {
    console.error('Session extension error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}