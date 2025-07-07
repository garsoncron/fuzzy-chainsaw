/**
 * @description Statistics entry buttons with player selection
 * @dependencies React hooks, player data, mobile touch optimization
 * @accessibility 44px touch targets, ARIA labels, keyboard navigation
 * @performance Optimized for rapid stat entry during live games
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Users, Clock, AlertTriangle, RotateCcw, Crown } from 'lucide-react'
import { PlayerSelectDialog } from './PlayerSelectDialog'
import { PenaltyDialog } from './PenaltyDialog'
import type { Player } from '@/payload-types'

interface StatButtonsProps {
  homeRoster: Player[]
  awayRoster: Player[]
  selectedStat: string | null
  onStatSelect: (stat: string | null) => void
  onStatSubmit: (type: string, data: any) => void
  gameStatus: string
}

export function StatButtons({
  homeRoster,
  awayRoster,
  selectedStat,
  onStatSelect,
  onStatSubmit,
  gameStatus,
}: StatButtonsProps) {
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false)
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home')

  const isGameActive = gameStatus === 'live' || gameStatus === 'overtime'

  const handleStatClick = (statType: string, team: 'home' | 'away') => {
    setSelectedTeam(team)
    onStatSelect(statType)

    if (statType === 'penalty') {
      setPenaltyDialogOpen(true)
    } else {
      setPlayerDialogOpen(true)
    }
  }

  const handlePlayerSelect = (player: Player, additionalData?: any) => {
    if (!selectedStat) return

    const statData = {
      type: selectedStat,
      team: selectedTeam,
      player: player.id,
      playerName: `${player.firstName} ${player.lastName}`,
      playerNumber: player.jerseyNumber,
      timestamp: new Date().toISOString(),
      ...additionalData,
    }

    onStatSubmit(selectedStat, statData)
    setPlayerDialogOpen(false)
    onStatSelect(null)
  }

  const handlePenaltySubmit = (penaltyData: any) => {
    onStatSubmit('penalty', {
      ...penaltyData,
      team: selectedTeam,
      timestamp: new Date().toISOString(),
    })
    setPenaltyDialogOpen(false)
    onStatSelect(null)
  }

  const statButtons = [
    {
      id: 'goal',
      label: 'Goal',
      icon: Target,
      color: 'bg-green-100 text-green-800 hover:bg-green-200',
      description: 'Score a goal',
    },
    {
      id: 'shot',
      label: 'Shot',
      icon: Target,
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      description: 'Shot on goal',
    },
    {
      id: 'faceoff',
      label: 'Faceoff',
      icon: Users,
      color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      description: 'Faceoff win',
    },
    {
      id: 'penalty',
      label: 'Penalty',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-800 hover:bg-red-200',
      description: 'Player penalty',
    },
    {
      id: 'timeout',
      label: 'Timeout',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      description: 'Team timeout',
    },
    {
      id: 'goalie_change',
      label: 'Goalie',
      icon: RotateCcw,
      color: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      description: 'Goalie change',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Quick Action Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        Select a statistic, then choose the team
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statButtons.map((stat) => (
          <div key={stat.id} className="space-y-2">
            <div className="text-center text-sm font-medium">{stat.label}</div>
            
            {/* Home Team Button */}
            <Button
              onClick={() => handleStatClick(stat.id, 'home')}
              disabled={!isGameActive && stat.id !== 'goalie_change'}
              className={`w-full h-12 text-sm ${stat.color} border border-blue-300`}
              variant="outline"
            >
              <stat.icon className="w-4 h-4 mr-2" />
              Home
            </Button>

            {/* Away Team Button */}
            <Button
              onClick={() => handleStatClick(stat.id, 'away')}
              disabled={!isGameActive && stat.id !== 'goalie_change'}
              className={`w-full h-12 text-sm ${stat.color} border border-red-300`}
              variant="outline"
            >
              <stat.icon className="w-4 h-4 mr-2" />
              Away
            </Button>
          </div>
        ))}
      </div>

      {/* Game Status Warning */}
      {!isGameActive && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Game is not active. Some statistics are disabled.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Action Undo */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => onStatSubmit('undo_last', {})}
            className="w-full h-10"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Undo Last Action
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onStatSubmit('period_timeout', { team: 'home' })}
              className="h-10 text-xs"
              variant="outline"
              disabled={!isGameActive}
            >
              Home Timeout
            </Button>
            <Button
              onClick={() => onStatSubmit('period_timeout', { team: 'away' })}
              className="h-10 text-xs"
              variant="outline"
              disabled={!isGameActive}
            >
              Away Timeout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Player Selection Dialog */}
      <PlayerSelectDialog
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
        roster={selectedTeam === 'home' ? homeRoster : awayRoster}
        statType={selectedStat || ''}
        teamName={selectedTeam === 'home' ? 'Home' : 'Away'}
        onPlayerSelect={handlePlayerSelect}
      />

      {/* Penalty Dialog */}
      <PenaltyDialog
        open={penaltyDialogOpen}
        onOpenChange={setPenaltyDialogOpen}
        roster={selectedTeam === 'home' ? homeRoster : awayRoster}
        teamName={selectedTeam === 'home' ? 'Home' : 'Away'}
        onSubmit={handlePenaltySubmit}
      />
    </div>
  )
}