/**
 * @description API endpoint for starting games
 * @dependencies Payload CMS, Next.js App Router, authentication
 * @notes Allows scorekeepers to start games they have claimed
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireGameScorekeeper } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    // Authenticate user and verify game assignment
    const user = await requireGameScorekeeper(request, resolvedParams.id)
    const payload = await getPayload({ config })
    
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

    // Check if game can be started
    if (game.status !== 'scheduled') {
      return NextResponse.json(
        { message: 'Only scheduled games can be started' },
        { status: 400 }
      )
    }

    // Start the game
    const updatedGame = await payload.update({
      collection: 'games',
      id: resolvedParams.id,
      data: {
        status: 'live',
        currentPeriod: 1,
        periodTimeRemaining: game.periodLength * 60, // Convert minutes to seconds
        startedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      message: 'Game started successfully',
      game: updatedGame,
    })

  } catch (error) {
    console.error('Error starting game:', error)
    
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