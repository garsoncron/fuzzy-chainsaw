/**
 * @description Start a new period in a game
 * @dependencies payload for game updates, broadcastGameUpdate for real-time
 * @security Requires authentication and scorekeeper role
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { broadcastGameUpdate } from '../live/route'

interface StartPeriodRequest {
  period: 1 | 2 | 3 | 'OT1' | 'OT2'
  periodLength?: number // in minutes, defaults to 12 for pool games, 15 for medal games
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

    const body: StartPeriodRequest = await request.json()
    const { period, periodLength } = body

    // Get current game
    const game = await payload.findByID({
      collection: 'games',
      id: gameId,
      depth: 2,
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Determine period length based on game type
    const defaultPeriodLength = game.gameType === 'medal' ? 15 : 12
    const periodTimeInSeconds = (periodLength || defaultPeriodLength) * 60

    // Update game with new period
    const updatedGame = await payload.update({
      collection: 'games',
      id: gameId,
      data: {
        status: 'live',
        currentPeriod: period,
        periodTimeRemaining: periodTimeInSeconds,
        updatedAt: new Date().toISOString(),
      },
    })

    // Broadcast update to all connected clients
    const gameData = {
      id: updatedGame.id,
      gameNumber: updatedGame.gameNumber,
      status: updatedGame.status,
      homeScore: updatedGame.homeScore || 0,
      awayScore: updatedGame.awayScore || 0,
      currentPeriod: updatedGame.currentPeriod,
      periodTimeRemaining: updatedGame.periodTimeRemaining,
      homeTeam: {
        id: updatedGame.homeTeam.id,
        name: updatedGame.homeTeam.name,
        logo: updatedGame.homeTeam.logo?.url || undefined,
      },
      awayTeam: {
        id: updatedGame.awayTeam.id,
        name: updatedGame.awayTeam.name,
        logo: updatedGame.awayTeam.logo?.url || undefined,
      },
      homeCurrentGoalie: updatedGame.homeCurrentGoalie ? {
        id: updatedGame.homeCurrentGoalie.id,
        firstName: updatedGame.homeCurrentGoalie.firstName,
        lastName: updatedGame.homeCurrentGoalie.lastName,
        jerseyNumber: updatedGame.homeCurrentGoalie.jerseyNumber,
      } : undefined,
      awayCurrentGoalie: updatedGame.awayCurrentGoalie ? {
        id: updatedGame.awayCurrentGoalie.id,
        firstName: updatedGame.awayCurrentGoalie.firstName,
        lastName: updatedGame.awayCurrentGoalie.lastName,
        jerseyNumber: updatedGame.awayCurrentGoalie.jerseyNumber,
      } : undefined,
      gamePoints: updatedGame.gamePoints || { home: 0, away: 0 },
      periodPoints: updatedGame.periodPoints || {
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
      message: `Period ${period} started`,
    })
  } catch (error) {
    console.error('Error starting period:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}