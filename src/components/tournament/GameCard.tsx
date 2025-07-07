/**
 * @description Individual game card component for schedules and game lists
 * @dependencies React, Payload types, tournament utilities
 * @accessibility Semantic HTML, keyboard navigation, screen reader friendly
 * @performance Lightweight component for list rendering
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Trophy, Users, Play, Calendar } from 'lucide-react'
// import type { Game, Team } from '@/payload-types' // Will be available after type generation

// Basic type definitions for compatibility
type Team = {
  id: string
  name: string
  city: string
  province?: string
  slug: string
  primaryColor?: string
  secondaryColor?: string
}

type Game = {
  id: string
  gameNumber: string
  gameType: 'pool' | 'medal'
  day: string
  scheduledTime: string
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  homeTeam: Team
  awayTeam: Team
  homeScore: number
  awayScore: number
  currentPeriod?: string
  periodTimeRemaining?: number
  totalGamePoints?: {
    home: number
    away: number
  }
  threeStars?: {
    first?: string
    second?: string
    third?: string
  }
  youtubeUrl?: string
  slug?: string
}

interface GameCardProps {
  game: Game
  showDay?: boolean
  showTournamentPoints?: boolean
  showThreeStars?: boolean
  compact?: boolean
  className?: string
}

export function GameCard({ 
  game, 
  showDay = true,
  showTournamentPoints = true,
  showThreeStars = true,
  compact = false,
  className = '' 
}: GameCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPeriodTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusBadge = (status: string, period?: string | number) => {
    const statusConfig = {
      live: { 
        label: 'LIVE', 
        className: 'bg-game-live text-live-indicator pulse-live border-0',
        icon: <Play className="h-3 w-3 mr-1" />
      },
      overtime: { 
        label: 'OT', 
        className: 'bg-game-overtime text-orange-600 pulse-live border-0',
        icon: <Play className="h-3 w-3 mr-1" />
      },
      final: { 
        label: 'FINAL', 
        className: 'bg-game-final text-muted-foreground border-0',
        icon: <Trophy className="h-3 w-3 mr-1" />
      },
      scheduled: { 
        label: 'SCHEDULED', 
        className: 'bg-game-scheduled text-muted-foreground border-0',
        icon: <Calendar className="h-3 w-3 mr-1" />
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
    
    if (status === 'live' && period) {
      config.label = `P${period}`
    } else if (status === 'overtime') {
      config.label = period?.toString() || 'OT'
    }

    return (
      <Badge className={config.className}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getGameTypeInfo = () => {
    const gameDate = new Date(game.scheduledTime)
    const dayInfo = showDay ? `Day ${game.day}` : ''
    const timeInfo = formatTime(gameDate)
    const dateInfo = formatDate(gameDate)
    
    return {
      dayInfo,
      timeInfo,
      dateInfo,
      gameType: game.gameType === 'medal' ? 'Medal Game' : 'Pool Play'
    }
  }

  const { dayInfo, timeInfo, dateInfo, gameType } = getGameTypeInfo()

  const isLive = game.status === 'live' || game.status === 'overtime'
  const hasScore = game.homeScore !== undefined && game.awayScore !== undefined

  return (
    <Link href={`/games/${game.slug}`} className="block">
      <Card className={`hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${isLive ? 'ring-2 ring-live-indicator' : ''} ${className}`}>
        <CardHeader className={compact ? 'pb-2' : 'pb-3'}>
          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-1">
              <CardTitle className="text-lg font-western text-primary-brown">
                Game {game.gameNumber}
              </CardTitle>
              {!compact && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {dayInfo && <span>{dayInfo}</span>}
                  {dayInfo && <span>•</span>}
                  <span>{gameType}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end space-y-1">
              {getStatusBadge(game.status, game.currentPeriod)}
              {!compact && (
                <div className="text-xs text-muted-foreground text-right">
                  <div>{dateInfo}</div>
                  <div>{timeInfo}</div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Teams and Scores */}
            <div className="flex justify-between items-center">
              <div className="flex-1">
                {/* Home Team */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-base">
                      {game.homeTeam.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {game.homeTeam.city}
                    </span>
                  </div>
                  {hasScore && (
                    <span className="text-2xl font-bold text-primary-brown">
                      {game.homeScore}
                    </span>
                  )}
                </div>
                
                {/* Away Team */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-base">
                      {game.awayTeam.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {game.awayTeam.city}
                    </span>
                  </div>
                  {hasScore && (
                    <span className="text-2xl font-bold text-primary-brown">
                      {game.awayScore}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Live Game Time */}
            {isLive && game.periodTimeRemaining !== undefined && (
              <div className="flex justify-center py-2 bg-game-live/20 rounded-md">
                <div className="text-center">
                  <div className="text-lg font-bold text-live-indicator">
                    {formatPeriodTime(game.periodTimeRemaining)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Period {game.currentPeriod}
                  </div>
                </div>
              </div>
            )}

            {/* Tournament Points */}
            {showTournamentPoints && game.totalGamePoints && (
              <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-2">
                <span>Tournament Points:</span>
                <span className="font-medium">
                  {game.totalGamePoints.home} - {game.totalGamePoints.away}
                </span>
              </div>
            )}

            {/* Three Stars */}
            {showThreeStars && game.threeStars && game.status === 'final' && (
              <div className="border-t pt-2">
                <div className="flex items-center text-sm text-golden">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span>Three Stars Selected</span>
                </div>
              </div>
            )}

            {/* YouTube Live Stream */}
            {game.youtubeUrl && isLive && (
              <div className="border-t pt-2">
                <div className="flex items-center text-sm text-power-play">
                  <Play className="h-4 w-4 mr-1" />
                  <span>Live Stream Available</span>
                </div>
              </div>
            )}

            {/* Compact mode time display */}
            {compact && (
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{dayInfo}</span>
                <span>{timeInfo}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}