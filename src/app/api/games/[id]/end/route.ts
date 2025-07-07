/**
 * @description API endpoint for ending games
 * @dependencies Payload CMS, Next.js App Router, authentication
 * @notes Allows scorekeepers to end games they are managing
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireGameScorekeeper } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user and verify game assignment
    const user = await requireGameScorekeeper(request, params.id)
    const payload = await getPayload({ config })
    
    // Get the game
    const game = await payload.findByID({
      collection: 'games',
      id: params.id,
    })

    if (!game) {
      return NextResponse.json(
        { message: 'Game not found' },
        { status: 404 }
      )
    }

    // Check if game can be ended
    if (game.status !== 'live' && game.status !== 'overtime') {
      return NextResponse.json(
        { message: 'Only live or overtime games can be ended' },
        { status: 400 }
      )
    }

    // Calculate final tournament points based on 5-point system
    const homeScore = game.homeScore || 0
    const awayScore = game.awayScore || 0
    
    let finalGamePoints = { home: 0, away: 0 }
    
    if (homeScore > awayScore) {
      finalGamePoints = { home: 2, away: 0 } // Home wins
    } else if (awayScore > homeScore) {
      finalGamePoints = { home: 0, away: 2 } // Away wins
    } else {
      finalGamePoints = { home: 1, away: 1 } // Tie
    }

    // Calculate total game points (period points + final game points)
    const totalGamePoints = {
      home: (game.periodPoints?.period1?.home || 0) + 
             (game.periodPoints?.period2?.home || 0) + 
             (game.periodPoints?.period3?.home || 0) + 
             finalGamePoints.home,
      away: (game.periodPoints?.period1?.away || 0) + 
             (game.periodPoints?.period2?.away || 0) + 
             (game.periodPoints?.period3?.away || 0) + 
             finalGamePoints.away,
    }

    // End the game
    const updatedGame = await payload.update({
      collection: 'games',
      id: params.id,
      data: {
        status: 'final',
        finalGamePoints,
        gamePoints: totalGamePoints,
        endedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      message: 'Game ended successfully',
      game: updatedGame,
    })

  } catch (error) {
    console.error('Error ending game:', error)
    
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
      if (error.message === 'Not assigned to this game') {
        return NextResponse.json(
          { message: 'Not assigned to this game' },
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