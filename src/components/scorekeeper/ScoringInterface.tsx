/**
 * @description Main scoring interface with period timer and stats entry
 * @dependencies React hooks, SSE, mobile touch optimization
 * @accessibility 44px touch targets, ARIA labels, keyboard navigation
 * @performance Real-time updates under 1 second, offline queue
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Timer } from './Timer'
import { ScoreBoard } from './ScoreBoard'
import { StatButtons } from './StatButtons'
import { GameLog } from './GameLog'
import { PeriodControls } from './PeriodControls'
import { ThreeStarsDialog } from './ThreeStarsDialog'
import { useGameState } from '@/lib/hooks/useGameState'
import { useRealtime } from '@/lib/hooks/useRealtime'
import type { Game, Player, User } from '@/payload-types'

interface ScoringInterfaceProps {
  game: Game
  homeRoster: Player[]
  awayRoster: Player[]
  currentUser: User
}

export function ScoringInterface({
  game,
  homeRoster,
  awayRoster,
  currentUser,
}: ScoringInterfaceProps) {
  const [gameState, updateGameState] = useGameState(game)
  const [threeStarsOpen, setThreeStarsOpen] = useState(false)
  const [selectedStat, setSelectedStat] = useState<string | null>(null)

  // Real-time connection for live updates
  const { isConnected, sendEvent } = useRealtime(game.id, (event) => {
    updateGameState(event)
  })

  // Auto-open three stars dialog when game ends
  useEffect(() => {
    if (gameState.status === 'final' && !gameState.threeStars?.first) {
      setThreeStarsOpen(true)
    }
  }, [gameState.status, gameState.threeStars])

  const handleStatAction = useCallback(async (type: string, data: any) => {
    try {
      // Optimistic update
      const event = {
        id: `temp-${Date.now()}`,
        type,
        timestamp: new Date().toISOString(),
        data,
      }
      updateGameState(event)

      // Send to server
      await sendEvent(type, data)
    } catch (error) {
      console.error('Error submitting stat:', error)
      // TODO: Add to offline queue
    }
  }, [updateGameState, sendEvent])

  const getGameTypeInfo = () => {
    const periodLength = gameState.gameType === 'medal' ? 15 : 12
    const overtimeAllowed = gameState.gameType === 'medal'
    return { periodLength, overtimeAllowed }
  }

  const { periodLength, overtimeAllowed } = getGameTypeInfo()

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Game {gameState.gameNumber}
          </h1>
          <p className="text-muted-foreground">
            {gameState.homeTeam?.name} vs {gameState.awayTeam?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? '🟢 Live' : '🔴 Offline'}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {gameState.status}
          </Badge>
        </div>
      </div>

      {/* Main Game Interface */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left Column - Score & Timer */}
        <div className="lg:col-span-1 space-y-4">
          <ScoreBoard
            homeTeam={gameState.homeTeam}
            awayTeam={gameState.awayTeam}
            homeScore={gameState.homeScore || 0}
            awayScore={gameState.awayScore || 0}
            currentPeriod={gameState.currentPeriod || 0}
            gameStatus={gameState.status}
          />

          <Timer
            currentPeriod={gameState.currentPeriod || 0}
            timeRemaining={gameState.periodTimeRemaining || periodLength * 60}
            periodLength={periodLength}
            gameStatus={gameState.status}
            onTimeUpdate={(time) => handleStatAction('timer_update', { time })}
          />

          <PeriodControls
            currentPeriod={gameState.currentPeriod || 0}
            gameStatus={gameState.status}
            overtimeAllowed={overtimeAllowed}
            onStartPeriod={(period) => handleStatAction('start_period', { period })}
            onEndPeriod={() => handleStatAction('end_period', {})}
            onStartGame={() => handleStatAction('start_game', {})}
            onEndGame={() => handleStatAction('end_game', {})}
          />
        </div>

        {/* Middle Column - Statistics Entry */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <StatButtons
                homeRoster={homeRoster}
                awayRoster={awayRoster}
                selectedStat={selectedStat}
                onStatSelect={setSelectedStat}
                onStatSubmit={handleStatAction}
                gameStatus={gameState.status}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Game Log */}
        <div className="lg:col-span-1">
          <GameLog
            gameId={game.id}
            events={gameState.events || []}
            onEditEvent={(eventId) => {
              // TODO: Implement event editing
            }}
            onDeleteEvent={(eventId) => {
              // TODO: Implement event deletion
            }}
          />
        </div>
      </div>

      {/* Three Stars Dialog */}
      <ThreeStarsDialog
        open={threeStarsOpen}
        onOpenChange={setThreeStarsOpen}
        gameId={game.id}
        homeRoster={homeRoster}
        awayRoster={awayRoster}
        onSubmit={(stars) => {
          handleStatAction('three_stars', stars)
          setThreeStarsOpen(false)
        }}
      />
    </div>
  )
}