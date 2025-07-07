/**
 * @description Live scoreboard component for tournament homepage
 * @dependencies React, Payload types, real-time updates
 * @accessibility Live region for screen readers, keyboard navigation
 * @performance Optimized for 500-900 concurrent users
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Trophy, Users } from 'lucide-react'
import type { Game, Team } from '@/payload-types'

interface ScoreboardProps {
  games: Game[]
  autoRefresh?: boolean
  refreshInterval?: number
  className?: string
}

interface GameWithTeams extends Game {
  homeTeam: Team
  awayTeam: Team
}

export function Scoreboard({ 
  games, 
  autoRefresh = true, 
  refreshInterval = 5000,
  className = '' 
}: ScoreboardProps) {
  const [liveGames, setLiveGames] = useState<GameWithTeams[]>([])
  const [upcomingGames, setUpcomingGames] = useState<GameWithTeams[]>([])
  const [recentGames, setRecentGames] = useState<GameWithTeams[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const categorizeGames = () => {
      const now = new Date()
      const live: GameWithTeams[] = []
      const upcoming: GameWithTeams[] = []
      const recent: GameWithTeams[] = []

      games.forEach(game => {
        const gameWithTeams = game as GameWithTeams
        if (gameWithTeams.status === 'live' || gameWithTeams.status === 'overtime') {
          live.push(gameWithTeams)
        } else if (gameWithTeams.status === 'scheduled') {
          const scheduledTime = new Date(gameWithTeams.scheduledTime)
          if (scheduledTime > now) {
            upcoming.push(gameWithTeams)
          }
        } else if (gameWithTeams.status === 'final') {
          const gameTime = new Date(gameWithTeams.scheduledTime)
          const hoursAgo = (now.getTime() - gameTime.getTime()) / (1000 * 60 * 60)
          if (hoursAgo < 6) { // Show games from last 6 hours
            recent.push(gameWithTeams)
          }
        }
      })

      setLiveGames(live)
      setUpcomingGames(upcoming.slice(0, 3)) // Show next 3 games
      setRecentGames(recent.slice(0, 2)) // Show last 2 games
    }

    categorizeGames()
  }, [games])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Trigger refresh of game data
      window.location.reload()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatPeriodTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusBadge = (status: string, period?: string | number) => {
    const statusConfig = {
      live: { label: 'LIVE', className: 'bg-game-live text-live-indicator pulse-live' },
      overtime: { label: 'OT', className: 'bg-game-overtime text-orange-600 pulse-live' },
      final: { label: 'FINAL', className: 'bg-game-final text-muted-foreground' },
      scheduled: { label: 'SCHEDULED', className: 'bg-game-scheduled text-muted-foreground' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
    
    if (status === 'live' && period) {
      config.label = `P${period}`
    } else if (status === 'overtime') {
      config.label = period?.toString() || 'OT'
    }

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const GameCard = ({ game }: { game: GameWithTeams }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-western text-primary-brown">
            Game {game.gameNumber}
          </CardTitle>
          {getStatusBadge(game.status, game.currentPeriod)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Teams and Scores */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg">
                  {game.homeTeam.name}
                </span>
                <span className="text-2xl font-bold text-primary-brown">
                  {game.homeScore}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg">
                  {game.awayTeam.name}
                </span>
                <span className="text-2xl font-bold text-primary-brown">
                  {game.awayScore}
                </span>
              </div>
            </div>
            
            {/* Game Time/Status */}
            <div className="text-right">
              {game.status === 'scheduled' ? (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(new Date(game.scheduledTime))}
                </div>
              ) : game.status === 'live' || game.status === 'overtime' ? (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    {formatPeriodTime(game.periodTimeRemaining || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Period {game.currentPeriod}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {formatTime(new Date(game.scheduledTime))}
                </div>
              )}
            </div>
          </div>

          {/* Tournament Points */}
          {game.totalGamePoints && (
            <div className="flex justify-between text-sm text-muted-foreground border-t pt-2">
              <span>Tournament Points:</span>
              <span>
                {game.totalGamePoints.home} - {game.totalGamePoints.away}
              </span>
            </div>
          )}

          {/* Three Stars */}
          {game.threeStars && game.status === 'final' && (
            <div className="border-t pt-2">
              <div className="flex items-center text-sm text-golden">
                <Trophy className="h-4 w-4 mr-1" />
                <span>Three Stars Available</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className={`scoreboard ${className}`} role="region" aria-live="polite" aria-label="Live Tournament Scoreboard">
      <div className="mb-6">
        <h2 className="text-2xl font-western text-primary-brown mb-2">
          Live Scoreboard
        </h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          Last updated: {formatTime(currentTime)}
        </div>
      </div>

      {/* Live Games */}
      {liveGames.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-primary-brown mb-4 flex items-center">
            <span className="pulse-live text-live-indicator mr-2">●</span>
            Live Games
          </h3>
          {liveGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {/* Upcoming Games */}
      {upcomingGames.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-primary-brown mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Next Games
          </h3>
          {upcomingGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {/* Recent Games */}
      {recentGames.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-primary-brown mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Recent Results
          </h3>
          {recentGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {/* No games message */}
      {liveGames.length === 0 && upcomingGames.length === 0 && recentGames.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No games scheduled at this time.</p>
        </div>
      )}
    </div>
  )
}