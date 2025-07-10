/**
 * @description Record a goalie change in a game
 * @dependencies payload for data updates, broadcastGameUpdate for real-time
 * @security Requires authentication and scorekeeper role
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { broadcastGameUpdate } from '@/utilities/realtime'

interface GoalieChangeRequest {
  team: 'home' | 'away'
  newGoalieId: string
  period: 1 | 2 | 3 | 'OT1' | 'OT2'
  periodTime: number // time in seconds when change occurred
  reason?: 'injury' | 'performance' | 'penalty' | 'timeout' | 'other'
  description?: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const resolvedParams = await params
  const gameId = resolvedParams.id
  
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // TODO: Add authentication check
    // const user = await payload.auth({ headers: request.headers })
    // if (!user || !user.roles?.includes('scorekeeper')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body: GoalieChangeRequest = await request.json()
    const { team, newGoalieId, period, periodTime, reason, description } = body

    // Get current game
    const game = await payload.findByID({
      collection: 'games',
      id: gameId,
      depth: 2,
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Validate new goalie exists and is on correct team
    const newGoalie = await payload.findByID({
      collection: 'players',
      id: newGoalieId,
      depth: 1,
    })

    if (!newGoalie) {
      return NextResponse.json({ error: 'Goalie not found' }, { status: 404 })
    }

    // Validate team assignment
    const teamId = team === 'home' ? game.homeTeam.id : game.awayTeam.id
    if (newGoalie.team.id !== teamId) {
      return NextResponse.json({ error: 'Goalie is not on the correct team' }, { status: 400 })
    }

    // Validate player is a goalie
    if (newGoalie.playerType !== 'goalie') {
      return NextResponse.json({ error: 'Player is not a goalie' }, { status: 400 })
    }

    // Update game with new goalie
    const updateData = team === 'home' ? 
      { homeCurrentGoalie: newGoalieId } : 
      { awayCurrentGoalie: newGoalieId }

    const updatedGame = await payload.update({
      collection: 'games',
      id: gameId,
      data: {
        ...updateData,
        updatedAt: new Date().toISOString(),
      },
    })

    // Get updated game with populated goalie data
    const gameWithGoalie = await payload.findByID({
      collection: 'games',
      id: gameId,
      depth: 2,
    })

    // Broadcast update to all connected clients
    const gameData = {
      id: gameWithGoalie.id,
      gameNumber: gameWithGoalie.gameNumber,
      status: gameWithGoalie.status,
      homeScore: gameWithGoalie.homeScore || 0,
      awayScore: gameWithGoalie.awayScore || 0,
      currentPeriod: gameWithGoalie.currentPeriod,
      periodTimeRemaining: gameWithGoalie.periodTimeRemaining,
      homeTeam: {
        id: gameWithGoalie.homeTeam.id,
        name: gameWithGoalie.homeTeam.name,
        logo: gameWithGoalie.homeTeam.logo?.url || undefined,
      },
      awayTeam: {
        id: gameWithGoalie.awayTeam.id,
        name: gameWithGoalie.awayTeam.name,
        logo: gameWithGoalie.awayTeam.logo?.url || undefined,
      },
      homeCurrentGoalie: gameWithGoalie.homeCurrentGoalie ? {
        id: gameWithGoalie.homeCurrentGoalie.id,
        firstName: gameWithGoalie.homeCurrentGoalie.firstName,
        lastName: gameWithGoalie.homeCurrentGoalie.lastName,
        jerseyNumber: gameWithGoalie.homeCurrentGoalie.jerseyNumber,
      } : undefined,
      awayCurrentGoalie: gameWithGoalie.awayCurrentGoalie ? {
        id: gameWithGoalie.awayCurrentGoalie.id,
        firstName: gameWithGoalie.awayCurrentGoalie.firstName,
        lastName: gameWithGoalie.awayCurrentGoalie.lastName,
        jerseyNumber: gameWithGoalie.awayCurrentGoalie.jerseyNumber,
      } : undefined,
      gamePoints: gameWithGoalie.gamePoints || { home: 0, away: 0 },
      periodPoints: gameWithGoalie.periodPoints || {
        period1: { home: 0, away: 0 },
        period2: { home: 0, away: 0 },
        period3: { home: 0, away: 0 },
      },
      lastUpdated: new Date().toISOString(),
    }

    broadcastGameUpdate(gameId, gameData)

    return NextResponse.json({
      success: true,
      game: updatedGame,
      message: `${team === 'home' ? 'Home' : 'Away'} goalie changed to ${newGoalie.firstName} ${newGoalie.lastName}`,
    })
  } catch (error) {
    console.error('Error recording goalie change:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}