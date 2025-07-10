/**
 * @description API endpoint for fetching all teams
 * @dependencies Payload CMS, Next.js App Router, authentication
 * @notes Returns teams sorted by name
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Get authentication from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Authenticate user with Payload
    const { user } = await payload.auth({
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
      }),
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user has correct role
    if (!['admin', 'scorekeeper', 'superAdmin'].includes(user.role)) {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // Fetch all teams
    const teams = await payload.find({
      collection: 'teams',
      sort: 'name',
    })

    return NextResponse.json(teams)

  } catch (error) {
    console.error('Error fetching teams:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}