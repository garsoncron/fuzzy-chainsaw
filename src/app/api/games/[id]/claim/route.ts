/**
 * @description API endpoint for claiming games by scorekeepers
 * @dependencies Payload CMS, Next.js App Router, authentication
 * @notes Allows scorekeepers to claim games for scoring
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getPayload({ config })
    const resolvedParams = await params
    
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
    
    // Get the game
    const game = await payload.findByID({
      collection: 'games',
      id: resolvedParams.id,
    })

    if (!game) {
      return NextResponse.json(
        { message: 'Game not found' },
        { status: 404 }
      )
    }

    // Check if game is already claimed (check youtubeUrl for claim data)
    if (game.youtubeUrl && game.youtubeUrl.startsWith('CLAIM_DATA:')) {
      try {
        const existingClaimData = JSON.parse(game.youtubeUrl.replace('CLAIM_DATA:', ''))
        if (existingClaimData.assignedScorekeeper) {
          // If the current user already has this game claimed, allow "re-claiming" (no-op)
          if (existingClaimData.assignedScorekeeper.id === user.id) {
            return NextResponse.json({
              message: 'Game already claimed by you',
              game: game,
            })
          }
          
          // Otherwise, it's claimed by someone else
          return NextResponse.json(
            { message: `Game is already claimed by ${existingClaimData.assignedScorekeeper.name}` },
            { status: 409 }
          )
        }
      } catch (error) {
        console.error('Error parsing existing claim data:', error)
      }
    }

    // Check if game can be claimed (only scheduled games)
    if (game.status !== 'scheduled') {
      return NextResponse.json(
        { message: 'Only scheduled games can be claimed' },
        { status: 400 }
      )
    }

    // Check if user already has a claimed game (only one at a time)
    if (user.role === 'scorekeeper') {
      const allGames = await payload.find({
        collection: 'games',
        where: {
          status: {
            not_equals: 'final',
          },
        },
      })

      // Check for existing claims in youtubeUrl field
      const userClaims = allGames.docs.filter(game => {
        if (game.youtubeUrl && game.youtubeUrl.startsWith('CLAIM_DATA:')) {
          try {
            const claimData = JSON.parse(game.youtubeUrl.replace('CLAIM_DATA:', ''))
            return claimData.assignedScorekeeper?.id === user.id
          } catch (error) {
            return false
          }
        }
        return false
      })

      if (userClaims.length > 0) {
        return NextResponse.json(
          { message: 'You already have a claimed game. Please release it first.' },
          { status: 400 }
        )
      }
    }

    // Temporarily use youtubeUrl field to store claim data as JSON
    // TODO: Add proper assignedScorekeeper field to Games collection schema
    
    const claimData = {
      assignedScorekeeper: {
        id: user.id,
        name: user.firstName || user.email,
        email: user.email,
        role: user.role,
      },
      claimedAt: new Date().toISOString(),
      originalYoutubeUrl: game.youtubeUrl || null, // Preserve original value
    }
    
    const updatedGame = await payload.update({
      collection: 'games',
      id: resolvedParams.id,
      data: {
        youtubeUrl: `CLAIM_DATA:${JSON.stringify(claimData)}`,
      },
    })

    return NextResponse.json({
      message: 'Game claimed successfully',
      game: updatedGame,
    })

  } catch (error) {
    console.error('Error claiming game:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json(
          { message: 'Authentication required' },
          { status: 401 }
        )
      }
      if (error.message === 'Insufficient permissions') {
        return NextResponse.json(
          { message: 'Insufficient permissions' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}