/**
 * @description Real-time connection hook using Server-Sent Events
 * @dependencies EventSource API, React hooks
 * @notes Handles SSE connection with automatic reconnection
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface GameEvent {
  id: string
  type: string
  timestamp: string
  data: any
}

export function useRealtime(
  gameId: string,
  onEvent: (event: GameEvent) => void
) {
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Connect to SSE endpoint
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource(`/api/games/${gameId}/live`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
      console.log('SSE connected')
    }

    eventSource.onmessage = (event) => {
      try {
        const gameEvent = JSON.parse(event.data) as GameEvent
        onEvent(gameEvent)
      } catch (error) {
        console.error('Error parsing SSE event:', error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      console.log('SSE connection error, attempting to reconnect...')
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, 3000)
    }
  }, [gameId, onEvent])

  // Send event to server
  const sendEvent = useCallback(async (type: string, data: any) => {
    try {
      const response = await fetch(`/api/games/${gameId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending event:', error)
      throw error
    }
  }, [gameId])

  // Connect on mount
  useEffect(() => {
    connect()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected) {
        connect()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [connect, isConnected])

  return {
    isConnected,
    sendEvent,
    reconnect: connect,
  }
}