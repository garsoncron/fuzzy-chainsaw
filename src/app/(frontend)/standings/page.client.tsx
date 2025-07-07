/**
 * @description Client-side standings page with interactive features
 * @dependencies React, standings table, filtering and sorting
 * @accessibility Keyboard navigation, screen readers, ARIA labels
 * @performance Optimized rendering and state management
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StandingsTable } from '@/components/tournament/StandingsTable'
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Clock, 
  RefreshCw,
  Info,
  Download,
  Share2
} from 'lucide-react'
import type { Game, Team } from '@/payload-types'

interface StandingsPageProps {
  teams: Team[]
  games: Game[]
  goals: any[]
  teamStats: any[]
  lastUpdated: Date
}

interface GameWithTeams extends Game {
  homeTeam: Team
  awayTeam: Team
}

export function StandingsPageClient({ 
  teams, 
  games, 
  goals,
  teamStats: initialTeamStats,
  lastUpdated 
}: StandingsPageProps) {
  const [teamStats] = useState(initialTeamStats)
  const [showDetailed, setShowDetailed] = useState(false)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const tournamentStats = {
    totalGames: games.length,
    completedGames: games.filter(g => g.status === 'final').length,
    liveGames: games.filter(g => g.status === 'live' || g.status === 'overtime').length,
    totalGoals: goals.length,
    averageGoalsPerGame: games.filter(g => g.status === 'final').length > 0 ? 
      Math.round((goals.length / games.filter(g => g.status === 'final').length) * 10) / 10 : 0
  }

  const topPerformers = {
    highestPoints: teamStats[0],
    bestGoalAverage: [...teamStats].sort((a, b) => b.goalAverage - a.goalAverage)[0],
    mostGoals: [...teamStats].sort((a, b) => b.goalsFor - a.goalsFor)[0],
    bestDefense: [...teamStats].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0]
  }

  const PlayoffPicture = () => {
    // In a real tournament, this would show playoff scenarios
    const topTeams = teamStats.slice(0, 4)
    const bubbleTeams = teamStats.slice(4, 6)
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-golden" />
            <span className="font-western text-primary-brown">Playoff Picture</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-green-600">Playoff Position</h3>
              <div className="space-y-1">
                {topTeams.map((team, index) => (
                  <div key={team.team.id} className="flex items-center justify-between text-sm">
                    <span>{index + 1}. {team.team.name}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {team.tournamentPoints} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {bubbleTeams.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-orange-600">On the Bubble</h3>
                <div className="space-y-1">
                  {bubbleTeams.map((team, index) => (
                    <div key={team.team.id} className="flex items-center justify-between text-sm">
                      <span>{index + 5}. {team.team.name}</span>
                      <Badge variant="outline">
                        {team.tournamentPoints} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-western text-primary-brown mb-2">
          Tournament Standings
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            5-Point System: 2 pts for game win, 1 pt for period win, 0.5 pts for period tie
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Updated: {formatTime(lastUpdated)}
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Tournament Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary-brown mb-2">
              {tournamentStats.completedGames}
            </div>
            <div className="text-sm text-muted-foreground">Games Completed</div>
            <div className="text-xs text-muted-foreground mt-1">
              of {tournamentStats.totalGames} total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {tournamentStats.liveGames}
            </div>
            <div className="text-sm text-muted-foreground">Live Games</div>
            <div className="text-xs text-muted-foreground mt-1">
              in progress
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-golden mb-2">
              {tournamentStats.totalGoals}
            </div>
            <div className="text-sm text-muted-foreground">Total Goals</div>
            <div className="text-xs text-muted-foreground mt-1">
              {tournamentStats.averageGoalsPerGame} per game
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary-brown mb-2">
              {teams.length}
            </div>
            <div className="text-sm text-muted-foreground">Teams</div>
            <div className="text-xs text-muted-foreground mt-1">
              competing
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Main Standings Table */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-western text-primary-brown">Current Standings</h2>
            <div className="flex space-x-2">
              <Button
                variant={showDetailed ? "outline" : "default"}
                onClick={() => setShowDetailed(false)}
                size="sm"
              >
                Standard
              </Button>
              <Button
                variant={showDetailed ? "default" : "outline"}
                onClick={() => setShowDetailed(true)}
                size="sm"
              >
                Detailed
              </Button>
            </div>
          </div>
          
          <StandingsTable 
            games={games as (Game & { homeTeam: Team; awayTeam: Team })[]}
            teams={teams}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary-brown" />
                <span className="font-western text-primary-brown">Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPerformers.highestPoints && (
                <div>
                  <div className="text-sm font-semibold text-golden">Most Points</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{topPerformers.highestPoints.team.name}</span>
                    <Badge className="bg-golden text-dark-brown">
                      {topPerformers.highestPoints.tournamentPoints}
                    </Badge>
                  </div>
                </div>
              )}
              
              {topPerformers.bestGoalAverage && (
                <div>
                  <div className="text-sm font-semibold text-green-600">Best Goal Average</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{topPerformers.bestGoalAverage.team.name}</span>
                    <Badge variant="outline">
                      {topPerformers.bestGoalAverage.goalAverage}%
                    </Badge>
                  </div>
                </div>
              )}
              
              {topPerformers.mostGoals && (
                <div>
                  <div className="text-sm font-semibold text-blue-600">Most Goals</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{topPerformers.mostGoals.team.name}</span>
                    <Badge variant="outline">
                      {topPerformers.mostGoals.goalsFor}
                    </Badge>
                  </div>
                </div>
              )}
              
              {topPerformers.bestDefense && (
                <div>
                  <div className="text-sm font-semibold text-purple-600">Best Defense</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{topPerformers.bestDefense.team.name}</span>
                    <Badge variant="outline">
                      {topPerformers.bestDefense.goalsAgainst} GA
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Playoff Picture */}
          <PlayoffPicture />

          {/* Tiebreaker Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-primary-brown" />
                <span className="font-western text-primary-brown">Tiebreakers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div><strong>1.</strong> Tournament Points</div>
              <div><strong>2.</strong> Head-to-head record</div>
              <div><strong>3.</strong> Goal average</div>
              <div><strong>4.</strong> Fewest penalty minutes</div>
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs">
                  <strong>Goal Average:</strong> Goals For ÷ (Goals For + Goals Against)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-western text-primary-brown">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Standings
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Points System Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary-brown font-western">5-Point Tournament System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Game Points (0-2 points)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Win in regulation/overtime:</span>
                  <Badge>2 points</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tie game:</span>
                  <Badge>1 point</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Loss:</span>
                  <Badge variant="outline">0 points</Badge>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Period Points (0-3 points)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Win a period:</span>
                  <Badge>1 point</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tie a period:</span>
                  <Badge>0.5 points</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Lose a period:</span>
                  <Badge variant="outline">0 points</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Maximum 5 points per game possible
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}