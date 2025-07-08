/**
 * @description API endpoint for releasing claimed games
 * @dependencies Payload CMS, Next.js App Router, authentication
 * @notes Allows scorekeepers to release games they've claimed
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireAuth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    // Authenticate user
    const user = await requireAuth(['admin', 'scorekeeper'])
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

    // Check if user owns this game or is admin
    if (user.role !== 'admin' && game.assignedScorekeeper?.id !== user.id) {
      return NextResponse.json(
        { message: 'You can only release games you have claimed' },
        { status: 403 }
      )
    }

    // Check if game can be released (not live or final)
    if (game.status === 'live' || game.status === 'final') {
      return NextResponse.json(
        { message: 'Cannot release a live or completed game' },
        { status: 400 }
      )
    }

    // Release the game
    const updatedGame = await payload.update({
      collection: 'games',
      id: resolvedParams.id,
      data: {
        assignedScorekeeper: null,
        claimedAt: null,
      },
    })

    return NextResponse.json({
      message: 'Game released successfully',
      game: updatedGame,
    })

  } catch (error) {
    console.error('Error releasing game:', error)
    
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