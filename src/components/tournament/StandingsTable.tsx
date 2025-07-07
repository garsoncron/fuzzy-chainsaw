/**
 * @description Tournament standings table with 5-point system
 * @dependencies React, Payload types, tournament calculation utilities
 * @accessibility ARIA table structure, sortable columns, screen reader friendly
 * @performance Optimized calculation caching for large datasets
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, TrendingUp, TrendingDown, Minus, ArrowUpDown } from 'lucide-react'
import type { Game, Team } from '@/payload-types'

interface StandingsTableProps {
  games: (Game & {
    homeTeam: Team
    awayTeam: Team
  })[]
  teams: Team[]
  className?: string
}

interface TeamStats {
  team: Team
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

type SortKey = keyof TeamStats
type SortDirection = 'asc' | 'desc'

export function StandingsTable({ games, teams, className = '' }: StandingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('tournamentPoints')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const teamStats = useMemo(() => {
    const stats: TeamStats[] = teams.map(team => {
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
        const teamScore = isHome ? game.homeScore : game.awayScore
        const opponentScore = isHome ? game.awayScore : game.homeScore
        
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
          tournamentPoints += isHome ? game.totalGamePoints.home : game.totalGamePoints.away
        }

        // Period statistics
        if (game.periodPoints) {
          const teamPeriod1 = isHome ? game.periodPoints.period1Home : game.periodPoints.period1Away
          const teamPeriod2 = isHome ? game.periodPoints.period2Home : game.periodPoints.period2Away
          const teamPeriod3 = isHome ? game.periodPoints.period3Home : game.periodPoints.period3Away
          
          const opponentPeriod1 = isHome ? game.periodPoints.period1Away : game.periodPoints.period1Home
          const opponentPeriod2 = isHome ? game.periodPoints.period2Away : game.periodPoints.period2Home
          const opponentPeriod3 = isHome ? game.periodPoints.period3Away : game.periodPoints.period3Home

          // Count period wins/losses/ties
          const periods = [
            [teamPeriod1, opponentPeriod1],
            [teamPeriod2, opponentPeriod2],
            [teamPeriod3, opponentPeriod3]
          ]
          
          periods.forEach(([teamPoints, opponentPoints]) => {
            if (teamPoints > opponentPoints) periodWins++
            else if (teamPoints < opponentPoints) periodLosses++
            else periodTies++
          })
        }

        // TODO: Add penalty minutes calculation when penalty collection is available
      })

      // Keep only last 5 games
      lastFiveGames.splice(0, Math.max(0, lastFiveGames.length - 5))

      const goalDifferential = goalsFor - goalsAgainst
      const goalAverage = (goalsFor + goalsAgainst) > 0 ? goalsFor / (goalsFor + goalsAgainst) : 0

      // Determine trend based on last 3 games
      const recentGames = lastFiveGames.slice(-3)
      const recentWins = recentGames.filter(g => g === 'W').length
      const recentLosses = recentGames.filter(g => g === 'L').length
      
      let trend: 'up' | 'down' | 'steady' = 'steady'
      if (recentWins > recentLosses) trend = 'up'
      else if (recentLosses > recentWins) trend = 'down'

      return {
        team,
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
    return stats.sort((a, b) => {
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
  }, [games, teams])

  const sortedStats = useMemo(() => {
    const sorted = [...teamStats].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      return 0
    })
    
    return sorted
  }, [teamStats, sortKey, sortDirection])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'steady') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getLastFiveDisplay = (games: ('W' | 'L' | 'T')[]) => {
    return games.map((result, index) => {
      const colorClass = {
        'W': 'bg-green-500',
        'L': 'bg-red-500',
        'T': 'bg-yellow-500'
      }[result]
      
      return (
        <span 
          key={index} 
          className={`inline-block w-2 h-2 rounded-full ${colorClass} mr-1`}
          title={`${result === 'W' ? 'Win' : result === 'L' ? 'Loss' : 'Tie'}`}
        />
      )
    })
  }

  const SortableHeader = ({ 
    children, 
    sortKey: key, 
    className = '' 
  }: { 
    children: React.ReactNode
    sortKey: SortKey
    className?: string 
  }) => (
    <th 
      className={`px-4 py-3 text-left cursor-pointer hover:bg-muted/50 ${className}`}
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </th>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-golden" />
          <span className="font-western text-primary-brown">Tournament Standings</span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          5-Point System: 2 pts for game win, 1 pt for period win, 0.5 pts for period tie
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left w-12">#</th>
                <SortableHeader sortKey="team" className="min-w-48">Team</SortableHeader>
                <SortableHeader sortKey="gamesPlayed" className="text-center">GP</SortableHeader>
                <SortableHeader sortKey="wins" className="text-center">W</SortableHeader>
                <SortableHeader sortKey="losses" className="text-center">L</SortableHeader>
                <SortableHeader sortKey="ties" className="text-center">T</SortableHeader>
                <SortableHeader sortKey="tournamentPoints" className="text-center font-semibold">PTS</SortableHeader>
                <SortableHeader sortKey="goalsFor" className="text-center">GF</SortableHeader>
                <SortableHeader sortKey="goalsAgainst" className="text-center">GA</SortableHeader>
                <SortableHeader sortKey="goalDifferential" className="text-center">+/-</SortableHeader>
                <SortableHeader sortKey="goalAverage" className="text-center">GA%</SortableHeader>
                <th className="px-4 py-3 text-center">Last 5</th>
                <th className="px-4 py-3 text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {sortedStats.map((stat, index) => (
                <tr key={stat.team.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <span className="font-semibold">{index + 1}</span>
                      {index === 0 && <Trophy className="h-4 w-4 text-golden ml-1" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="font-semibold">{stat.team.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {stat.team.city}, {stat.team.province}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{stat.gamesPlayed}</td>
                  <td className="px-4 py-3 text-center">{stat.wins}</td>
                  <td className="px-4 py-3 text-center">{stat.losses}</td>
                  <td className="px-4 py-3 text-center">{stat.ties}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="bg-golden text-dark-brown font-bold">
                      {stat.tournamentPoints}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">{stat.goalsFor}</td>
                  <td className="px-4 py-3 text-center">{stat.goalsAgainst}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={stat.goalDifferential > 0 ? 'text-green-600' : stat.goalDifferential < 0 ? 'text-red-600' : 'text-gray-600'}>
                      {stat.goalDifferential > 0 ? '+' : ''}{stat.goalDifferential}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {(stat.goalAverage * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      {getLastFiveDisplay(stat.lastFiveGames)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getTrendIcon(stat.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">
            <div className="font-semibold mb-2">Legend:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>GP: Games Played</div>
              <div>W: Wins</div>
              <div>L: Losses</div>
              <div>T: Ties</div>
              <div>PTS: Tournament Points</div>
              <div>GF: Goals For</div>
              <div>GA: Goals Against</div>
              <div>+/-: Goal Differential</div>
              <div>GA%: Goal Average</div>
              <div className="col-span-2">
                Last 5: 
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-1 mr-1" />W
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-1 mr-1" />L
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 ml-1 mr-1" />T
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}