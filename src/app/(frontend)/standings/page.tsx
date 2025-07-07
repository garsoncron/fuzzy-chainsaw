/**
 * @description Tournament standings page with 5-point system
 * @dependencies Payload CMS, standings components, statistical calculations
 * @accessibility Table structure, sortable columns, screen reader support
 * @performance Server-side calculations with client-side caching
 */

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next/metadata'
import { StandingsPageClient } from './page.client'

export const metadata: Metadata = {
  title: 'Tournament Standings - Cowtown Showdown',
  description: 'Live tournament standings with the 5-point system. Track team performance, goals, and tournament points in real-time.',
  keywords: ['lacrosse standings', 'tournament points', '5-point system', 'team rankings', 'Cowtown Showdown standings'],
  openGraph: {
    title: 'Tournament Standings - Cowtown Showdown',
    description: 'Live tournament standings with 5-point system',
    type: 'website',
  }
}

export default async function StandingsPage() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Get all teams and completed games for standings calculation
    const [teamsResult, gamesResult, goalsResult] = await Promise.all([
      payload.find({
        collection: 'teams',
        limit: 20,
        sort: 'name'
      }),
      payload.find({
        collection: 'games',
        depth: 2, // Include team relationships
        limit: 100,
        sort: 'scheduledTime'
      }),
      payload.find({
        collection: 'goals',
        depth: 2, // Include player and team relationships
        limit: 500,
        sort: '-createdAt'
      })
    ])

    // Calculate additional statistics
    const teamStats = calculateTeamStatistics(
      teamsResult.docs,
      gamesResult.docs,
      goalsResult.docs
    )

    return (
      <StandingsPageClient
        teams={teamsResult.docs}
        games={gamesResult.docs}
        goals={goalsResult.docs}
        teamStats={teamStats}
        lastUpdated={new Date()}
      />
    )
  } catch (error) {
    console.error('Error loading standings data:', error)
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-western text-primary-brown mb-4">
            Tournament Standings
          </h1>
          <p className="text-muted-foreground">
            Sorry, we're having trouble loading the standings. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}

function calculateTeamStatistics(teams: any[], games: any[], goals: any[]) {
  return teams.map(team => {
    const teamGames = games.filter(game => 
      game.homeTeam?.id === team.id || game.awayTeam?.id === team.id
    )
    
    const completedGames = teamGames.filter(game => game.status === 'final')
    const teamGoals = goals.filter(goal => goal.team?.id === team.id)
    
    let wins = 0, losses = 0, ties = 0
    let tournamentPoints = 0, goalsFor = 0, goalsAgainst = 0
    let periodWins = 0, periodLosses = 0, periodTies = 0
    let powerPlayGoals = 0, shortHandedGoals = 0
    const penaltyMinutes = 0 // TODO: Calculate from penalties when available
    
    const recentGames: ('W' | 'L' | 'T')[] = []

    completedGames.forEach(game => {
      const isHome = game.homeTeam?.id === team.id
      const teamScore = isHome ? game.homeScore : game.awayScore
      const opponentScore = isHome ? game.awayScore : game.homeScore
      
      // Game results
      if (teamScore > opponentScore) {
        wins++
        recentGames.push('W')
      } else if (teamScore < opponentScore) {
        losses++
        recentGames.push('L')
      } else {
        ties++
        recentGames.push('T')
      }

      // Goals
      goalsFor += teamScore
      goalsAgainst += opponentScore

      // Tournament points
      if (game.totalGamePoints) {
        tournamentPoints += isHome ? 
          game.totalGamePoints.home : 
          game.totalGamePoints.away
      }

      // Period statistics
      if (game.periodPoints) {
        const periods = [
          [isHome ? game.periodPoints.period1Home : game.periodPoints.period1Away,
           isHome ? game.periodPoints.period1Away : game.periodPoints.period1Home],
          [isHome ? game.periodPoints.period2Home : game.periodPoints.period2Away,
           isHome ? game.periodPoints.period2Away : game.periodPoints.period2Home],
          [isHome ? game.periodPoints.period3Home : game.periodPoints.period3Away,
           isHome ? game.periodPoints.period3Away : game.periodPoints.period3Home]
        ]

        periods.forEach(([teamPoints, opponentPoints]) => {
          if (teamPoints > opponentPoints) periodWins++
          else if (teamPoints < opponentPoints) periodLosses++
          else periodTies++
        })
      }
    })

    // Goal type statistics
    teamGoals.forEach(goal => {
      if (goal.goalType === 'power_play') powerPlayGoals++
      if (goal.goalType === 'short_handed') shortHandedGoals++
    })

    // Keep only last 5 games
    const lastFiveGames = recentGames.slice(-5)

    const goalDifferential = goalsFor - goalsAgainst
    const goalAverage = (goalsFor + goalsAgainst) > 0 ? 
      goalsFor / (goalsFor + goalsAgainst) : 0
    const winPercentage = completedGames.length > 0 ? 
      wins / completedGames.length : 0

    // Calculate trend based on last 3 games
    const recentThree = lastFiveGames.slice(-3)
    const recentWins = recentThree.filter(g => g === 'W').length
    const recentLosses = recentThree.filter(g => g === 'L').length
    
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
      goalAverage: Math.round(goalAverage * 1000) / 10, // Round to 1 decimal
      winPercentage: Math.round(winPercentage * 1000) / 10,
      periodWins,
      periodLosses,
      periodTies,
      powerPlayGoals,
      shortHandedGoals,
      penaltyMinutes,
      lastFiveGames,
      trend,
      // Additional calculated fields
      pointsPerGame: completedGames.length > 0 ? 
        Math.round((tournamentPoints / completedGames.length) * 10) / 10 : 0,
      goalsPerGame: completedGames.length > 0 ? 
        Math.round((goalsFor / completedGames.length) * 10) / 10 : 0,
      goalsAgainstPerGame: completedGames.length > 0 ? 
        Math.round((goalsAgainst / completedGames.length) * 10) / 10 : 0
    }
  }).sort((a, b) => {
    // Sort by tournament points (primary)
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
}