/**
 * @description API endpoint for tournament standings with caching
 * @dependencies Payload CMS, Next.js App Router
 * @accessibility N/A (API endpoint)  
 * @performance Cached responses for high-traffic scenarios
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Cache standings for 30 seconds to reduce database load
let standingsCache: {
  data: any[]
  timestamp: number
} | null = null

const CACHE_DURATION = 30 * 1000 // 30 seconds

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now()
    if (standingsCache && (now - standingsCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        standings: standingsCache.data,
        cached: true,
        timestamp: new Date(standingsCache.timestamp).toISOString()
      })
    }

    const payload = await getPayload({ config: configPromise })
    
    // Get all teams
    const teams = await payload.find({
      collection: 'teams',
      limit: 100,
      sort: 'name'
    })
    
    // Get all completed games with team relationships
    const games = await payload.find({
      collection: 'games',
      depth: 2,
      limit: 200,
      where: {
        status: {
          equals: 'final'
        }
      },
      sort: 'scheduledTime'
    })

    // Calculate standings
    const standings = teams.docs.map(team => {
      const teamGames = games.docs.filter(game => 
        (game.homeTeam as any)?.id === team.id || (game.awayTeam as any)?.id === team.id
      )

      let wins = 0, losses = 0, ties = 0
      let tournamentPoints = 0, goalsFor = 0, goalsAgainst = 0
      let periodWins = 0, periodLosses = 0, periodTies = 0

      teamGames.forEach(game => {
        const isHome = (game.homeTeam as any)?.id === team.id
        const teamScore = isHome ? game.homeScore : game.awayScore
        const opponentScore = isHome ? game.awayScore : game.homeScore
        
        // Game results
        if (teamScore > opponentScore) wins++
        else if (teamScore < opponentScore) losses++
        else ties++

        // Goals
        goalsFor += teamScore
        goalsAgainst += opponentScore

        // Tournament points
        if (game.totalGamePoints) {
          tournamentPoints += isHome ? 
            (game.totalGamePoints as any).home : 
            (game.totalGamePoints as any).away
        }

        // Period statistics
        if (game.periodPoints) {
          const periods = game.periodPoints as any
          const teamPeriodPoints = [
            isHome ? periods.period1Home : periods.period1Away,
            isHome ? periods.period2Home : periods.period2Away, 
            isHome ? periods.period3Home : periods.period3Away
          ]
          
          const opponentPeriodPoints = [
            isHome ? periods.period1Away : periods.period1Home,
            isHome ? periods.period2Away : periods.period2Home,
            isHome ? periods.period3Away : periods.period3Home
          ]

          teamPeriodPoints.forEach((teamPoints, index) => {
            const opponentPoints = opponentPeriodPoints[index]
            if (teamPoints > opponentPoints) periodWins++
            else if (teamPoints < opponentPoints) periodLosses++
            else periodTies++
          })
        }
      })

      const goalDifferential = goalsFor - goalsAgainst
      const goalAverage = (goalsFor + goalsAgainst) > 0 ? 
        goalsFor / (goalsFor + goalsAgainst) : 0

      return {
        team: {
          id: team.id,
          name: team.name,
          city: team.city,
          province: team.province,
          slug: team.slug
        },
        gamesPlayed: teamGames.length,
        wins,
        losses,
        ties,
        tournamentPoints,
        goalsFor,
        goalsAgainst,
        goalDifferential,
        goalAverage: Math.round(goalAverage * 1000) / 10, // Round to 1 decimal
        periodWins,
        periodLosses,
        periodTies,
        winPercentage: teamGames.length > 0 ? 
          Math.round((wins / teamGames.length) * 1000) / 10 : 0
      }
    })

    // Sort by tournament points, then tiebreakers
    standings.sort((a, b) => {
      // Primary: Tournament points
      if (a.tournamentPoints !== b.tournamentPoints) {
        return b.tournamentPoints - a.tournamentPoints
      }
      
      // Tiebreaker: Goal average
      if (a.goalAverage !== b.goalAverage) {
        return b.goalAverage - a.goalAverage
      }
      
      // Final tiebreaker: Goal differential
      return b.goalDifferential - a.goalDifferential
    })

    // Add position numbers
    const standingsWithPosition = standings.map((team, index) => ({
      ...team,
      position: index + 1
    }))

    // Update cache
    standingsCache = {
      data: standingsWithPosition,
      timestamp: now
    }

    return NextResponse.json({
      standings: standingsWithPosition,
      cached: false,
      timestamp: new Date().toISOString(),
      totalTeams: teams.docs.length,
      totalGames: games.docs.length
    })

  } catch (error) {
    console.error('Error calculating standings:', error)
    return NextResponse.json(
      { error: 'Failed to calculate standings' },
      { status: 500 }
    )
  }
}

// Optional: Clear cache endpoint for development
export async function DELETE() {
  standingsCache = null
  return NextResponse.json({ message: 'Cache cleared' })
}