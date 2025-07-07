/**
 * @description Period timer component with start/stop/reset functionality
 * @dependencies React hooks, timer utilities
 * @accessibility Large touch targets, clear visual states
 * @performance Accurate timing with 1-second updates
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'

interface TimerProps {
  currentPeriod: number | string
  timeRemaining: number // seconds
  periodLength: number // minutes
  gameStatus: string
  onTimeUpdate: (time: number) => void
}

export function Timer({
  currentPeriod,
  timeRemaining,
  periodLength,
  gameStatus,
  onTimeUpdate,
}: TimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [displayTime, setDisplayTime] = useState(timeRemaining)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60)
    const secs = Math.abs(seconds) % 60
    const sign = seconds < 0 ? '-' : ''
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Update display time when prop changes
  useEffect(() => {
    setDisplayTime(timeRemaining)
  }, [timeRemaining])

  // Timer logic
  useEffect(() => {
    if (isRunning && gameStatus === 'live') {
      intervalRef.current = setInterval(() => {
        setDisplayTime((prev) => {
          const newTime = prev - 1
          onTimeUpdate(newTime)
          return newTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, gameStatus, onTimeUpdate])

  const handleStartStop = useCallback(() => {
    setIsRunning(!isRunning)
  }, [isRunning])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    const resetTime = periodLength * 60
    setDisplayTime(resetTime)
    onTimeUpdate(resetTime)
  }, [periodLength, onTimeUpdate])

  const getPeriodDisplay = () => {
    if (currentPeriod === 0) return 'Pre-Game'
    if (typeof currentPeriod === 'string' && currentPeriod.startsWith('OT')) {
      return currentPeriod
    }
    return `Period ${currentPeriod}`
  }

  const getTimerColor = () => {
    if (displayTime <= 0) return 'text-red-600'
    if (displayTime <= 120) return 'text-yellow-600' // Last 2 minutes
    return 'text-foreground'
  }

  const canControlTimer = gameStatus === 'live' || gameStatus === 'scheduled'

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg">Game Clock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Period Display */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Current Period</div>
          <div className="text-xl font-bold">{getPeriodDisplay()}</div>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className={`text-6xl font-mono font-bold ${getTimerColor()}`}>
            {formatTime(displayTime)}
          </div>
          {displayTime <= 0 && (
            <div className="text-red-600 font-semibold mt-2 animate-pulse">
              TIME EXPIRED
            </div>
          )}
        </div>

        {/* Timer Controls */}
        {canControlTimer && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleStartStop}
              className="h-12 text-base"
              variant={isRunning ? 'destructive' : 'default'}
              disabled={currentPeriod === 0}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>

            <Button
              onClick={handleReset}
              className="h-12 text-base"
              variant="outline"
              disabled={currentPeriod === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              onClick={() => setDisplayTime(0)}
              className="h-12 text-base"
              variant="outline"
              disabled={currentPeriod === 0}
            >
              <Square className="w-4 h-4 mr-2" />
              End
            </Button>
          </div>
        )}

        {/* Timer Status */}
        <div className="text-center text-sm text-muted-foreground">
          {isRunning && gameStatus === 'live' && 'Timer is running'}
          {!isRunning && gameStatus === 'live' && 'Timer is stopped'}
          {gameStatus !== 'live' && 'Game not active'}
        </div>

        {/* Game Type Info */}
        <div className="text-center text-xs text-muted-foreground">
          {periodLength}-minute periods
        </div>
      </CardContent>
    </Card>
  )
}