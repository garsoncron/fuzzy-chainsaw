/**
 * @description Live scoreboard display for active games
 * @dependencies React, team data types
 * @accessibility High contrast colors, clear typography
 * @performance Optimized for real-time score updates
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Team } from '@/payload-types'

interface ScoreBoardProps {
  homeTeam: Team | null
  awayTeam: Team | null
  homeScore: number
  awayScore: number
  currentPeriod: number | string
  gameStatus: string
}

export function ScoreBoard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  currentPeriod,
  gameStatus,
}: ScoreBoardProps) {
  const getStatusColor = () => {
    switch (gameStatus) {
      case 'live':
        return 'bg-green-100 text-green-800'
      case 'final':
        return 'bg-blue-100 text-blue-800'
      case 'overtime':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = () => {
    switch (gameStatus) {
      case 'live':
        return '🔴'
      case 'final':
        return '✅'
      case 'overtime':
        return '⚡'
      default:
        return '📅'
    }
  }

  const getWinnerStyle = (isHome: boolean) => {
    if (gameStatus !== 'final') return ''
    
    if (isHome) {
      return homeScore > awayScore ? 'ring-2 ring-green-500 bg-green-50' : ''
    } else {
      return awayScore > homeScore ? 'ring-2 ring-green-500 bg-green-50' : ''
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Score</CardTitle>
          <Badge className={getStatusColor()}>
            <span className="mr-1">{getStatusIcon()}</span>
            {gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Home Team */}
        <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${getWinnerStyle(true)}`}>
          <div className="flex-1">
            <div className="text-lg font-semibold text-blue-600">
              {homeTeam?.name || 'Home Team'}
            </div>
            <div className="text-sm text-muted-foreground">
              {homeTeam?.city || 'City'}
            </div>
          </div>
          <div className="text-4xl font-bold text-blue-600">
            {homeScore}
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center text-gray-400 font-semibold">
          VS
        </div>

        {/* Away Team */}
        <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${getWinnerStyle(false)}`}>
          <div className="flex-1">
            <div className="text-lg font-semibold text-red-600">
              {awayTeam?.name || 'Away Team'}
            </div>
            <div className="text-sm text-muted-foreground">
              {awayTeam?.city || 'City'}
            </div>
          </div>
          <div className="text-4xl font-bold text-red-600">
            {awayScore}
          </div>
        </div>

        {/* Game Info */}
        <div className="text-center text-sm text-muted-foreground pt-2 border-t">
          {currentPeriod === 0 && 'Pre-Game'}
          {typeof currentPeriod === 'number' && currentPeriod > 0 && `Period ${currentPeriod}`}
          {typeof currentPeriod === 'string' && currentPeriod.startsWith('OT') && currentPeriod}
        </div>

        {/* Score Difference (for close games) */}
        {gameStatus === 'live' && Math.abs(homeScore - awayScore) <= 2 && (
          <div className="text-center text-sm font-semibold text-yellow-600">
            Close Game!
          </div>
        )}

        {/* Final Score Announcement */}
        {gameStatus === 'final' && (
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-sm font-semibold text-blue-800">
              FINAL SCORE
            </div>
            {homeScore !== awayScore && (
              <div className="text-xs text-blue-600 mt-1">
                {homeScore > awayScore 
                  ? `${homeTeam?.name} wins by ${homeScore - awayScore}`
                  : `${awayTeam?.name} wins by ${awayScore - homeScore}`
                }
              </div>
            )}
            {homeScore === awayScore && (
              <div className="text-xs text-blue-600 mt-1">
                Game ends in a tie
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}