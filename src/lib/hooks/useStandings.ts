/**
 * @description Tournament standings calculation hook
 * @dependencies React hooks, Payload types, tournament calculations
 * @notes Calculates standings with 5-point system and tiebreakers
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Game, Team } from '@/payload-types'

export type GameWithTeams = Game & {
  homeTeam: Team
  awayTeam: Team
}

export interface TeamStanding {
  team: Team
  rank: number
  gamesPlayed: number
  wins: number
  losses: number
  ties: number
  tournamentPoints: number
  goalsFor: number
  goalsAgainst: number
  goalDifferential: number
  goalAverage: number
  periodWins: number
  periodLosses: number
  periodTies: number
  penaltyMinutes: number
  lastFiveGames: ('W' | 'L' | 'T')[]
  trend: 'up' | 'down' | 'steady'
}

interface StandingsData {
  standings: TeamStanding[]
  isLoading: boolean
  error: Error | null
  lastUpdate: Date
}

export function useStandings(games: GameWithTeams[], teams: Team[]) {
  const [data, setData] = useState<StandingsData>({
    standings: [],
    isLoading: true,
    error: null,
    lastUpdate: new Date()
  })

  const standings = useMemo(() => {
    if (!games.length || !teams.length) return []

    try {
      const teamStandings: TeamStanding[] = teams.map(team => {
        const teamGames = games.filter(game => 
          game.homeTeam.id === team.id || game.awayTeam.id === team.id
        )

        const completedGames = teamGames.filter(game => game.status === 'final')
        
        let wins = 0, losses = 0, ties = 0
        let tournamentPoints = 0, goalsFor = 0, goalsAgainst = 0
        let periodWins = 0, periodLosses = 0, periodTies = 0
        const penaltyMinutes = 0
        const lastFiveGames: ('W' | 'L' | 'T')[] = []

        completedGames.forEach(game => {
          const isHome = game.homeTeam.id === team.id
          const teamScore = isHome ? (game.homeScore || 0) : (game.awayScore || 0)
          const opponentScore = isHome ? (game.awayScore || 0) : (game.homeScore || 0)
          
          // Game results
          if (teamScore > opponentScore) {
            wins++
            lastFiveGames.push('W')
          } else if (teamScore < opponentScore) {
            losses++
            lastFiveGames.push('L')
          } else {
            ties++
            lastFiveGames.push('T')
          }

          // Goals
          goalsFor += teamScore
          goalsAgainst += opponentScore

          // Tournament points from this game
          if (game.totalGamePoints) {
            tournamentPoints += isHome ? 
              (game.totalGamePoints.home || 0) : 
              (game.totalGamePoints.away || 0)
          }

          // Period statistics
          if (game.periodPoints) {
            const teamPeriods = [
              isHome ? game.periodPoints.period1Home : game.periodPoints.period1Away,
              isHome ? game.periodPoints.period2Home : game.periodPoints.period2Away,
              isHome ? game.periodPoints.period3Home : game.periodPoints.period3Away,
            ]
            
            const opponentPeriods = [
              isHome ? game.periodPoints.period1Away : game.periodPoints.period1Home,
              isHome ? game.periodPoints.period2Away : game.periodPoints.period2Home,
              isHome ? game.periodPoints.period3Away : game.periodPoints.period3Home,
            ]

            // Count period wins/losses/ties
            teamPeriods.forEach((teamPeriod, index) => {
              const opponentPeriod = opponentPeriods[index]
              if (teamPeriod && opponentPeriod) {
                if (teamPeriod > opponentPeriod) periodWins++
                else if (teamPeriod < opponentPeriod) periodLosses++
                else periodTies++
              }
            })
          }

          // TODO: Add penalty minutes calculation when penalty collection is available
        })

        // Keep only last 5 games
        lastFiveGames.splice(0, Math.max(0, lastFiveGames.length - 5))

        const goalDifferential = goalsFor - goalsAgainst
        const goalAverage = (goalsFor + goalsAgainst) > 0 ? 
          goalsFor / (goalsFor + goalsAgainst) : 0

        // Determine trend based on last 3 games
        const recentGames = lastFiveGames.slice(-3)
        const recentWins = recentGames.filter(g => g === 'W').length
        const recentLosses = recentGames.filter(g => g === 'L').length
        
        let trend: 'up' | 'down' | 'steady' = 'steady'
        if (recentWins > recentLosses) trend = 'up'
        else if (recentLosses > recentWins) trend = 'down'

        return {
          team,
          rank: 0, // Will be set after sorting
          gamesPlayed: completedGames.length,
          wins,
          losses,
          ties,
          tournamentPoints,
          goalsFor,
          goalsAgainst,
          goalDifferential,
          goalAverage,
          periodWins,
          periodLosses,
          periodTies,
          penaltyMinutes,
          lastFiveGames,
          trend
        }
      })

      // Sort by tournament points (primary), then by tiebreakers
      const sortedStandings = teamStandings.sort((a, b) => {
        // Primary: Tournament points
        if (a.tournamentPoints !== b.tournamentPoints) {
          return b.tournamentPoints - a.tournamentPoints
        }
        
        // Tiebreaker 1: Head-to-head (TODO: implement when needed)
        
        // Tiebreaker 2: Goal average
        if (a.goalAverage !== b.goalAverage) {
          return b.goalAverage - a.goalAverage
        }
        
        // Tiebreaker 3: Penalty minutes (fewer is better)
        return a.penaltyMinutes - b.penaltyMinutes
      })

      // Assign ranks
      sortedStandings.forEach((standing, index) => {
        standing.rank = index + 1
      })

      return sortedStandings
    } catch (error) {
      console.error('Error calculating standings:', error)
      return []
    }
  }, [games, teams])

  useEffect(() => {
    try {
      setData({
        standings,
        isLoading: false,
        error: null,
        lastUpdate: new Date()
      })
    } catch (error) {
      setData({
        standings: [],
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        lastUpdate: new Date()
      })
    }
  }, [standings])

  return data
}