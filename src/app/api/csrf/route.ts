/**
 * @description API endpoint for generating CSRF tokens
 * @dependencies Next.js App Router, security utilities
 * @notes Returns CSRF token for authenticated users
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateCSRFToken } from '@/utilities/security'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Get the user's session token
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('payload-token')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Generate CSRF token
    const csrfToken = generateCSRFToken(sessionToken)
    
    return NextResponse.json({
      csrfToken,
    })
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}