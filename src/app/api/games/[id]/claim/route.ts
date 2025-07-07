/**
 * @description API endpoint for claiming games by scorekeepers
 * @dependencies Payload CMS, Next.js App Router, authentication
 * @notes Allows scorekeepers to claim games for scoring
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireAuth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const user = await requireAuth(['admin', 'scorekeeper'])
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

    // Check if game is already claimed
    if (game.assignedScorekeeper) {
      return NextResponse.json(
        { message: 'Game is already claimed by another scorekeeper' },
        { status: 409 }
      )
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
      const existingClaim = await payload.find({
        collection: 'games',
        where: {
          assignedScorekeeper: {
            equals: user.id,
          },
          status: {
            not_equals: 'final',
          },
        },
      })

      if (existingClaim.docs.length > 0) {
        return NextResponse.json(
          { message: 'You already have a claimed game. Please release it first.' },
          { status: 400 }
        )
      }
    }

    // Claim the game
    const updatedGame = await payload.update({
      collection: 'games',
      id: params.id,
      data: {
        assignedScorekeeper: user.id,
        claimedAt: new Date().toISOString(),
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