/**
 * @description Tournament data fetching hook with real-time updates
 * @dependencies React hooks, Payload types, SSE updates
 * @notes Manages tournament data with optimistic updates and error handling
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Game, Team } from '@/payload-types'

export type GameWithTeams = Game & {
  homeTeam: Team
  awayTeam: Team
}

interface TournamentData {
  games: GameWithTeams[]
  teams: Team[]
  liveGames: GameWithTeams[]
  upcomingGames: GameWithTeams[]
  recentGames: GameWithTeams[]
  isLoading: boolean
  error: Error | null
  lastUpdate: Date
  isConnected: boolean
}

export function useTournamentData() {
  const [data, setData] = useState<TournamentData>({
    games: [],
    teams: [],
    liveGames: [],
    upcomingGames: [],
    recentGames: [],
    isLoading: true,
    error: null,
    lastUpdate: new Date(),
    isConnected: false
  })

  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  // Categorize games by status
  const categorizeGames = useCallback((games: GameWithTeams[]) => {
    const now = new Date()
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000)
    
    const live = games.filter(game => 
      game.status === 'live' || game.status === 'overtime'
    )
    
    const upcoming = games.filter(game => 
      game.status === 'scheduled' && new Date(game.scheduledTime) > now
    ).slice(0, 8)
    
    const recent = games.filter(game => 
      game.status === 'final' && new Date(game.scheduledTime) > sixHoursAgo
    ).slice(0, 6)

    return { live, upcoming, recent }
  }, [])

  // Fetch initial tournament data
  const fetchTournamentData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }))
      
      const [teamsResponse, gamesResponse] = await Promise.all([
        fetch('/api/public/teams', {
          headers: {
            'Content-Type': 'application/json',
          }
        }),
        fetch('/api/public/games', {
          headers: {
            'Content-Type': 'application/json',
          }
        })
      ])

      // Handle errors (authentication shouldn't be required for public endpoints)
      if (teamsResponse.status === 401 || gamesResponse.status === 401) {
        throw new Error('Unexpected authentication error.')
      }

      if (teamsResponse.status === 403 || gamesResponse.status === 403) {
        throw new Error('Access denied to tournament data.')
      }

      if (!teamsResponse.ok || !gamesResponse.ok) {
        const teamsError = teamsResponse.ok ? null : await teamsResponse.text()
        const gamesError = gamesResponse.ok ? null : await gamesResponse.text()
        throw new Error(`Failed to fetch tournament data: ${teamsError || gamesError || 'Unknown error'}`)
      }

      const [teamsData, gamesData] = await Promise.all([
        teamsResponse.json(),
        gamesResponse.json()
      ])

      const games = gamesData.docs || gamesData
      const teams = teamsData.docs || teamsData
      
      const { live, upcoming, recent } = categorizeGames(games)

      setData(prev => ({
        ...prev,
        games,
        teams,
        liveGames: live,
        upcomingGames: upcoming,
        recentGames: recent,
        isLoading: false,
        lastUpdate: new Date()
      }))
    } catch (error) {
      console.error('Error fetching tournament data:', error)
      setData(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false
      }))
    }
  }, [categorizeGames])

  // Handle SSE updates
  const handleSSEUpdate = useCallback((event: MessageEvent) => {
    try {
      // Skip non-JSON messages (like "ping" heartbeats)
      if (!event.data || event.data === 'ping' || event.data.trim() === '') {
        return
      }
      
      const updateData = JSON.parse(event.data)
      
      if (updateData.type === 'games_update') {
        setData(prev => {
          const updatedGames = updateData.games || prev.games
          const { live, upcoming, recent } = categorizeGames(updatedGames)
          
          return {
            ...prev,
            games: updatedGames,
            liveGames: live,
            upcomingGames: upcoming,
            recentGames: recent,
            lastUpdate: new Date()
          }
        })
      } else if (updateData.type === 'game_update') {
        // Update specific game
        setData(prev => {
          const updatedGames = prev.games.map(game => 
            game.id === updateData.game.id ? { ...game, ...updateData.game } : game
          )
          const { live, upcoming, recent } = categorizeGames(updatedGames)
          
          return {
            ...prev,
            games: updatedGames,
            liveGames: live,
            upcomingGames: upcoming,
            recentGames: recent,
            lastUpdate: new Date()
          }
        })
      }
    } catch (error) {
      console.error('Error parsing SSE update:', error)
    }
  }, [categorizeGames])

  // Setup SSE connection
  useEffect(() => {
    const setupSSE = () => {
      const source = new EventSource('/api/games/live')
      
      source.onopen = () => {
        console.log('Tournament SSE connected')
        setData(prev => ({ ...prev, isConnected: true }))
      }
      
      source.onmessage = handleSSEUpdate
      
      source.onerror = (error) => {
        console.error('Tournament SSE error:', error)
        setData(prev => ({ ...prev, isConnected: false }))
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (source.readyState === EventSource.CLOSED) {
            setupSSE()
          }
        }, 5000)
      }
      
      setEventSource(source)
      return source
    }

    const source = setupSSE()
    
    return () => {
      source.close()
    }
  }, [handleSSEUpdate])

  // Initial data fetch
  useEffect(() => {
    fetchTournamentData()
  }, [fetchTournamentData])

  // Refresh data manually
  const refreshData = useCallback(() => {
    fetchTournamentData()
  }, [fetchTournamentData])

  // Cleanup
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [eventSource])

  return {
    ...data,
    refreshData
  }
}