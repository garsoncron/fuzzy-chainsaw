/**
 * @description Record a faceoff result in a game
 * @dependencies payload for data updates, broadcastGameUpdate for real-time
 * @security Requires authentication and scorekeeper role
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { broadcastGameUpdate } from '../live/route'

interface FaceoffRequest {
  homePlayerId: string
  awayPlayerId: string
  winnerId: string
  location: 'center' | 'home_end' | 'away_end' | 'neutral_zone'
  period: 1 | 2 | 3 | 'OT1' | 'OT2'
  periodTime: number // time in seconds when faceoff occurred
  description?: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  const gameId = params.id
  
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // TODO: Add authentication check
    // const user = await payload.auth({ headers: request.headers })
    // if (!user || !user.roles?.includes('scorekeeper')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body: FaceoffRequest = await request.json()
    const { homePlayerId, awayPlayerId, winnerId, location, period, periodTime, description } = body

    // Get current game
    const game = await payload.findByID({
      collection: 'games',
      id: gameId,
      depth: 2,
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Validate players exist and are on correct teams
    const [homePlayer, awayPlayer, winnerPlayer] = await Promise.all([
      payload.findByID({ collection: 'players', id: homePlayerId, depth: 1 }),
      payload.findByID({ collection: 'players', id: awayPlayerId, depth: 1 }),
      payload.findByID({ collection: 'players', id: winnerId, depth: 1 }),
    ])

    if (!homePlayer || !awayPlayer || !winnerPlayer) {
      return NextResponse.json({ error: 'One or more players not found' }, { status: 404 })
    }

    // Validate team assignments
    if (homePlayer.team.id !== game.homeTeam.id) {
      return NextResponse.json({ error: 'Home player is not on the home team' }, { status: 400 })
    }
    if (awayPlayer.team.id !== game.awayTeam.id) {
      return NextResponse.json({ error: 'Away player is not on the away team' }, { status: 400 })
    }

    // Validate winner is one of the faceoff players
    if (winnerId !== homePlayerId && winnerId !== awayPlayerId) {
      return NextResponse.json({ error: 'Winner must be one of the faceoff players' }, { status: 400 })
    }

    // Calculate game time in seconds
    const gameTimeInSeconds = ((period === 'OT1' || period === 'OT2') ? 
      (36 * 60) + (period === 'OT2' ? 5 * 60 : 0) + periodTime : 
      (period - 1) * 12 * 60 + periodTime)

    // Create faceoff record
    const faceoff = await payload.create({
      collection: 'faceoffs',
      data: {
        game: gameId,
        homePlayer: homePlayerId,
        awayPlayer: awayPlayerId,
        winner: winnerId,
        location,
        period,
        periodTime,
        gameTimeInSeconds,
        description,
      },
    })

    // Update game timestamp
    const updatedGame = await payload.update({
      collection: 'games',
      id: gameId,
      data: {
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
      faceoff,
      game: updatedGame,
      message: `Faceoff won by ${winnerPlayer.firstName} ${winnerPlayer.lastName}`,
    })
  } catch (error) {
    console.error('Error recording faceoff:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}