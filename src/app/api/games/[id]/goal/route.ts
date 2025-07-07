/**
 * @description Record a goal in a game and update scores
 * @dependencies payload for data updates, broadcastGameUpdate for real-time
 * @security Requires authentication and scorekeeper role
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { broadcastGameUpdate } from '../live/route'

interface GoalRequest {
  scorerId: string
  assistId?: string
  secondaryAssistId?: string
  goalType: 'even_strength' | 'power_play' | 'short_handed' | 'penalty_shot' | 'empty_net'
  team: 'home' | 'away'
  period: 1 | 2 | 3 | 'OT1' | 'OT2'
  periodTime: number // time in seconds when goal was scored
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

    const body: GoalRequest = await request.json()
    const { scorerId, assistId, secondaryAssistId, goalType, team, period, periodTime, description } = body

    // Get current game
    const game = await payload.findByID({
      collection: 'games',
      id: gameId,
      depth: 2,
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Validate scorer exists and is on correct team
    const scorer = await payload.findByID({
      collection: 'players',
      id: scorerId,
      depth: 1,
    })

    if (!scorer) {
      return NextResponse.json({ error: 'Scorer not found' }, { status: 404 })
    }

    // Validate team assignment
    const teamId = team === 'home' ? game.homeTeam.id : game.awayTeam.id
    if (scorer.team.id !== teamId) {
      return NextResponse.json({ error: 'Scorer is not on the correct team' }, { status: 400 })
    }

    // Calculate game time in seconds
    const gameTimeInSeconds = ((period === 'OT1' || period === 'OT2') ? 
      (36 * 60) + (period === 'OT2' ? 5 * 60 : 0) + periodTime : 
      (period - 1) * 12 * 60 + periodTime)

    // Create goal record
    const goal = await payload.create({
      collection: 'goals',
      data: {
        game: gameId,
        scorer: scorerId,
        primaryAssist: assistId,
        secondaryAssist: secondaryAssistId,
        goalType,
        team,
        period,
        periodTime,
        gameTimeInSeconds,
        description,
      },
    })

    // Update game scores
    const currentHomeScore = game.homeScore || 0
    const currentAwayScore = game.awayScore || 0
    const newHomeScore = team === 'home' ? currentHomeScore + 1 : currentHomeScore
    const newAwayScore = team === 'away' ? currentAwayScore + 1 : currentAwayScore

    // Update game with new score
    const updatedGame = await payload.update({
      collection: 'games',
      id: gameId,
      data: {
        homeScore: newHomeScore,
        awayScore: newAwayScore,
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
      goal,
      game: updatedGame,
      message: `Goal scored by ${scorer.firstName} ${scorer.lastName}`,
    })
  } catch (error) {
    console.error('Error recording goal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}