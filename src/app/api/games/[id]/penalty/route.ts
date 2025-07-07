/**
 * @description Record a penalty in a game
 * @dependencies payload for data updates, broadcastGameUpdate for real-time
 * @security Requires authentication and scorekeeper role
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { broadcastGameUpdate } from '../live/route'

interface PenaltyRequest {
  playerId: string
  infraction: 'slashing' | 'tripping' | 'interference' | 'holding' | 'illegal_pick' | 'cross_checking' | 'elbowing' | 'roughing' | 'unsportsmanlike_conduct' | 'delay_of_game' | 'illegal_substitution' | 'crease_violation' | 'over_and_back' | 'high_sticking' | 'boarding' | 'face_masking' | 'fighting' | 'spearing' | 'checking_from_behind'
  team: 'home' | 'away'
  period: 1 | 2 | 3 | 'OT1' | 'OT2'
  periodTime: number // time in seconds when penalty was called
  description?: string
  coincidental?: boolean
  delayed?: boolean
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

    const body: PenaltyRequest = await request.json()
    const { playerId, infraction, team, period, periodTime, description, coincidental, delayed } = body

    // Get current game
    const game = await payload.findByID({
      collection: 'games',
      id: gameId,
      depth: 2,
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Validate player exists and is on correct team
    const player = await payload.findByID({
      collection: 'players',
      id: playerId,
      depth: 1,
    })

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    // Validate team assignment
    const teamId = team === 'home' ? game.homeTeam.id : game.awayTeam.id
    if (player.team.id !== teamId) {
      return NextResponse.json({ error: 'Player is not on the correct team' }, { status: 400 })
    }

    // Determine penalty type and duration based on infraction
    const penaltyMapping = {
      'slashing': { type: 'minor', duration: '2min' },
      'tripping': { type: 'minor', duration: '2min' },
      'interference': { type: 'minor', duration: '2min' },
      'holding': { type: 'minor', duration: '2min' },
      'illegal_pick': { type: 'minor', duration: '2min' },
      'cross_checking': { type: 'minor', duration: '2min' },
      'elbowing': { type: 'minor', duration: '2min' },
      'roughing': { type: 'minor', duration: '2min' },
      'unsportsmanlike_conduct': { type: 'minor', duration: '2min' },
      'delay_of_game': { type: 'minor', duration: '2min' },
      'illegal_substitution': { type: 'minor', duration: '2min' },
      'crease_violation': { type: 'minor', duration: '2min' },
      'over_and_back': { type: 'minor', duration: '2min' },
      'high_sticking': { type: 'major', duration: '5min' },
      'boarding': { type: 'major', duration: '5min' },
      'face_masking': { type: 'major', duration: '5min' },
      'fighting': { type: 'major', duration: '5min' },
      'spearing': { type: 'major', duration: '5min' },
      'checking_from_behind': { type: 'major', duration: '5min' },
    }

    const penaltyInfo = penaltyMapping[infraction]
    if (!penaltyInfo) {
      return NextResponse.json({ error: 'Invalid infraction type' }, { status: 400 })
    }

    // Calculate game time in seconds
    const gameTimeInSeconds = ((period === 'OT1' || period === 'OT2') ? 
      (36 * 60) + (period === 'OT2' ? 5 * 60 : 0) + periodTime : 
      (period - 1) * 12 * 60 + periodTime)

    // Create penalty record
    const penalty = await payload.create({
      collection: 'penalties',
      data: {
        game: gameId,
        player: playerId,
        infraction,
        penaltyType: penaltyInfo.type,
        duration: penaltyInfo.duration,
        team,
        period,
        periodTime,
        gameTimeInSeconds,
        description,
        coincidental: coincidental || false,
        delayed: delayed || false,
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
      penalty,
      game: updatedGame,
      message: `${penaltyInfo.duration} ${infraction} penalty assessed to ${player.firstName} ${player.lastName}`,
    })
  } catch (error) {
    console.error('Error recording penalty:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}