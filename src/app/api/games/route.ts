/**
 * @description API endpoint for fetching all games with team data
 * @dependencies Payload CMS, Next.js App Router, authentication
 * @notes Returns games sorted by day and scheduled time
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
    
    // Fetch all games with team data
    const games = await payload.find({
      collection: 'games',
      sort: ['day', 'scheduledTime'],
      populate: {
        homeTeam: true,
        awayTeam: true,
      },
    })

    // Parse claim data from youtubeUrl field and add to games
    const gamesWithClaims = games.docs.map(game => {
      const gameData = { ...game }
      
      if (game.youtubeUrl && game.youtubeUrl.startsWith('CLAIM_DATA:')) {
        try {
          const claimData = JSON.parse(game.youtubeUrl.replace('CLAIM_DATA:', ''))
          gameData.assignedScorekeeper = claimData.assignedScorekeeper
          gameData.claimedAt = claimData.claimedAt
          gameData.youtubeUrl = claimData.originalYoutubeUrl // Restore original URL
        } catch (error) {
          console.error('Error parsing claim data for game:', game.id, error)
        }
      }
      
      return gameData
    })

    return NextResponse.json({
      ...games,
      docs: gamesWithClaims,
    })

  } catch (error) {
    console.error('Error fetching games:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}