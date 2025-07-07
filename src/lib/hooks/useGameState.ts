/**
 * @description Game state management hook with optimistic updates
 * @dependencies React hooks, game types
 * @notes Manages local game state with real-time synchronization
 */

'use client'

import { useState, useCallback } from 'react'
import type { Game } from '@/payload-types'

interface GameEvent {
  id: string
  type: string
  timestamp: string
  data: any
}

export function useGameState(initialGame: Game) {
  const [gameState, setGameState] = useState<Game & { events?: GameEvent[] }>({
    ...initialGame,
    events: [],
  })

  const updateGameState = useCallback((event: GameEvent) => {
    setGameState(prev => {
      const newState = { ...prev }

      switch (event.type) {
        case 'goal':
          if (event.data.team === 'home') {
            newState.homeScore = (newState.homeScore || 0) + 1
          } else {
            newState.awayScore = (newState.awayScore || 0) + 1
          }
          break

        case 'start_game':
          newState.status = 'live'
          newState.currentPeriod = 1
          break

        case 'start_period':
          newState.currentPeriod = event.data.period
          newState.status = 'live'
          break

        case 'end_period':
          if (newState.currentPeriod === 3) {
            // Check if overtime is needed
            if (newState.homeScore === newState.awayScore && newState.overtimeAllowed) {
              newState.status = 'overtime'
              newState.currentPeriod = 'OT1'
            } else {
              newState.status = 'final'
            }
          }
          break

        case 'end_game':
          newState.status = 'final'
          break

        case 'timer_update':
          newState.periodTimeRemaining = event.data.time
          break

        case 'three_stars':
          newState.threeStars = event.data
          break

        case 'penalty':
          // Penalty logic will be handled by the statistics system
          break

        case 'goalie_change':
          if (event.data.team === 'home') {
            newState.homeCurrentGoalie = event.data.player
          } else {
            newState.awayCurrentGoalie = event.data.player
          }
          break
      }

      // Add event to history
      const events = [...(prev.events || [])]
      const existingIndex = events.findIndex(e => e.id === event.id)
      if (existingIndex >= 0) {
        events[existingIndex] = event
      } else {
        events.push(event)
      }
      
      // Sort events by timestamp
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      // Keep only last 50 events in memory
      newState.events = events.slice(0, 50)

      return newState
    })
  }, [])

  const resetGameState = useCallback((newGame: Game) => {
    setGameState({
      ...newGame,
      events: gameState.events || [],
    })
  }, [gameState.events])

  return [gameState, updateGameState, resetGameState] as const
}