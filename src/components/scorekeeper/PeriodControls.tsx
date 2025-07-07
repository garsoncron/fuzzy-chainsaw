/**
 * @description Period management controls for game flow
 * @dependencies React hooks, shadcn/ui components, game state types
 * @accessibility Large touch targets, clear state indicators, keyboard navigation
 * @performance Optimized for critical game moment management
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Square, 
  SkipForward, 
  Trophy,
  AlertTriangle
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface PeriodControlsProps {
  currentPeriod: number | string
  gameStatus: string
  overtimeAllowed: boolean
  onStartPeriod: (period: number | string) => void
  onEndPeriod: () => void
  onStartGame: () => void
  onEndGame: () => void
}

export function PeriodControls({
  currentPeriod,
  gameStatus,
  overtimeAllowed,
  onStartPeriod,
  onEndPeriod,
  onStartGame,
  onEndGame,
}: PeriodControlsProps) {
  const [confirmAction, setConfirmAction] = useState<string | null>(null)

  const isPreGame = currentPeriod === 0
  const isRegularTime = typeof currentPeriod === 'number' && currentPeriod >= 1 && currentPeriod <= 3
  const isOvertime = typeof currentPeriod === 'string' && currentPeriod.startsWith('OT')
  const canStartOvertime = overtimeAllowed && currentPeriod === 3 && gameStatus !== 'final'

  const getNextPeriod = (): number | string => {
    if (isPreGame) return 1
    if (typeof currentPeriod === 'number') {
      if (currentPeriod < 3) return currentPeriod + 1
      if (currentPeriod === 3 && overtimeAllowed) return 'OT1'
      return 3 // Stay at period 3 if no overtime
    }
    if (typeof currentPeriod === 'string' && currentPeriod.startsWith('OT')) {
      const otNumber = parseInt(currentPeriod.replace('OT', ''))
      return `OT${otNumber + 1}`
    }
    return currentPeriod
  }

  const getPeriodDisplay = (period: number | string): string => {
    if (period === 0) return 'Pre-Game'
    if (typeof period === 'number') return `Period ${period}`
    return period
  }

  const handleStartGame = () => {
    onStartGame()
    onStartPeriod(1)
  }

  const handleStartNextPeriod = () => {
    const nextPeriod = getNextPeriod()
    onStartPeriod(nextPeriod)
  }

  const handleEndGame = () => {
    onEndGame()
  }

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'live':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-gray-100 text-gray-800'
      case 'final':
        return 'bg-blue-100 text-blue-800'
      case 'overtime':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Period Controls</CardTitle>
          <Badge className={getStatusColor()}>
            {gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Period Display */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Current Period</div>
          <div className="text-2xl font-bold">
            {getPeriodDisplay(currentPeriod)}
          </div>
        </div>

        {/* Period Control Buttons */}
        <div className="space-y-3">
          {/* Start Game */}
          {isPreGame && gameStatus === 'scheduled' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full h-12 text-base" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Game</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will begin Period 1 and set the game status to "Live". 
                    Make sure both teams are ready and starting goalies are set.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStartGame}>
                    Start Game
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Start Next Period */}
          {!isPreGame && gameStatus === 'live' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full h-12 text-base" 
                  variant="outline"
                  disabled={currentPeriod === 3 && !overtimeAllowed}
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  Start {getPeriodDisplay(getNextPeriod())}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Next Period</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end the current period and begin {getPeriodDisplay(getNextPeriod())}.
                    The game timer will reset to the full period length.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStartNextPeriod}>
                    Start {getPeriodDisplay(getNextPeriod())}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* End Period */}
          {gameStatus === 'live' && !isPreGame && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full h-12 text-base" 
                  variant="outline"
                >
                  <Square className="w-5 h-5 mr-2" />
                  End Current Period
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End Current Period</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end {getPeriodDisplay(currentPeriod)} immediately. 
                    The timer will stop and you can start the next period when ready.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onEndPeriod}>
                    End Period
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* End Game */}
          {gameStatus === 'live' && !isPreGame && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full h-12 text-base" 
                  variant="destructive"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  End Game
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End Game</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end the game immediately and set the status to "Final". 
                    Make sure you've recorded all statistics and are ready to select three stars.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEndGame}>
                    End Game
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Game State Information */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {isPreGame && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <span>Game not started. Click "Start Game" to begin Period 1.</span>
            </div>
          )}
          
          {currentPeriod === 3 && !overtimeAllowed && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span>Period 3 is the final period for this game type.</span>
            </div>
          )}

          {canStartOvertime && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span>Overtime available for medal games if needed.</span>
            </div>
          )}

          {isOvertime && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span>Sudden death overtime - first goal wins!</span>
            </div>
          )}

          {gameStatus === 'final' && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <Trophy className="w-4 h-4 text-green-600" />
              <span>Game completed. Select three stars if not done already.</span>
            </div>
          )}
        </div>

        {/* Period Progress Indicator */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Game Progress</div>
          <div className="flex gap-1">
            {[1, 2, 3].map(period => (
              <div
                key={period}
                className={`flex-1 h-2 rounded ${
                  typeof currentPeriod === 'number' && currentPeriod >= period
                    ? 'bg-green-500'
                    : currentPeriod === 0
                    ? 'bg-gray-200'
                    : 'bg-gray-200'
                }`}
              />
            ))}
            {overtimeAllowed && (
              <div
                className={`flex-1 h-2 rounded ${
                  isOvertime ? 'bg-yellow-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>P1</span>
            <span>P2</span>
            <span>P3</span>
            {overtimeAllowed && <span>OT</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}