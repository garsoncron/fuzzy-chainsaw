/**
 * @description Tournament API interaction hook
 * @dependencies React hooks, fetch API, error handling
 * @notes Provides methods for fetching and updating tournament data
 */

'use client'

import { useState, useCallback } from 'react'
import type { Game, Team, Player } from '@/payload-types'

export type GameWithTeams = Game & {
  homeTeam: Team
  awayTeam: Team
}

interface APIState {
  isLoading: boolean
  error: Error | null
}

export function useTournamentAPI() {
  const [state, setState] = useState<APIState>({
    isLoading: false,
    error: null
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }))
  }, [])

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  // Fetch all games with team relationships
  const fetchGames = useCallback(async (): Promise<GameWithTeams[]> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/games?depth=2')
      if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs || data
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch games')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch all teams
  const fetchTeams = useCallback(async (): Promise<Team[]> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/teams')
      if (!response.ok) {
        throw new Error(`Failed to fetch teams: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs || data
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch teams')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch live games only
  const fetchLiveGames = useCallback(async (): Promise<GameWithTeams[]> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/games?depth=2&where[status][in]=live,overtime')
      if (!response.ok) {
        throw new Error(`Failed to fetch live games: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs || data
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch live games')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch games by status
  const fetchGamesByStatus = useCallback(async (status: Game['status']): Promise<GameWithTeams[]> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/games?depth=2&where[status][equals]=${status}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${status} games: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs || data
    } catch (error) {
      const err = error instanceof Error ? error : new Error(`Failed to fetch ${status} games`)
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch games by day
  const fetchGamesByDay = useCallback(async (day: '1' | '2' | '3'): Promise<GameWithTeams[]> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/games?depth=2&where[day][equals]=${day}&sort=scheduledTime`)
      if (!response.ok) {
        throw new Error(`Failed to fetch day ${day} games: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs || data
    } catch (error) {
      const err = error instanceof Error ? error : new Error(`Failed to fetch day ${day} games`)
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch game by ID with full depth
  const fetchGame = useCallback(async (gameId: string): Promise<GameWithTeams> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/games/${gameId}?depth=3`)
      if (!response.ok) {
        throw new Error(`Failed to fetch game: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch game')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch team with players
  const fetchTeam = useCallback(async (teamId: string): Promise<Team> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/teams/${teamId}?depth=2`)
      if (!response.ok) {
        throw new Error(`Failed to fetch team: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch team')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch players for a team
  const fetchTeamPlayers = useCallback(async (teamId: string): Promise<Player[]> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/players?where[team][equals]=${teamId}&sort=jerseyNumber`)
      if (!response.ok) {
        throw new Error(`Failed to fetch team players: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs || data
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch team players')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch game statistics (goals, penalties, etc.)
  const fetchGameStats = useCallback(async (gameId: string) => {
    try {
      setLoading(true)
      setError(null)

      const [goalsResponse, penaltiesResponse, faceofsResponse, shotsResponse] = await Promise.all([
        fetch(`/api/goals?where[game][equals]=${gameId}&depth=2&sort=createdAt`),
        fetch(`/api/penalties?where[game][equals]=${gameId}&depth=2&sort=createdAt`),
        fetch(`/api/faceoffs?where[game][equals]=${gameId}&depth=2&sort=createdAt`),
        fetch(`/api/shots?where[game][equals]=${gameId}&depth=2&sort=createdAt`)
      ])

      const [goals, penalties, faceoffs, shots] = await Promise.all([
        goalsResponse.ok ? goalsResponse.json() : { docs: [] },
        penaltiesResponse.ok ? penaltiesResponse.json() : { docs: [] },
        faceofsResponse.ok ? faceofsResponse.json() : { docs: [] },
        shotsResponse.ok ? shotsResponse.json() : { docs: [] }
      ])

      return {
        goals: goals.docs || goals,
        penalties: penalties.docs || penalties,
        faceoffs: faceoffs.docs || faceoffs,
        shots: shots.docs || shots
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch game statistics')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch upcoming games (next X hours)
  const fetchUpcomingGames = useCallback(async (hours: number = 24): Promise<GameWithTeams[]> => {
    try {
      setLoading(true)
      setError(null)

      const now = new Date()
      const future = new Date(now.getTime() + hours * 60 * 60 * 1000)

      const response = await fetch(
        `/api/games?depth=2&where[and][0][status][equals]=scheduled&where[and][1][scheduledTime][greater_than]=${now.toISOString()}&where[and][2][scheduledTime][less_than]=${future.toISOString()}&sort=scheduledTime`
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch upcoming games: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs || data
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch upcoming games')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  // Fetch recent completed games
  const fetchRecentGames = useCallback(async (hours: number = 6): Promise<GameWithTeams[]> => {
    try {
      setLoading(true)
      setError(null)

      const now = new Date()
      const past = new Date(now.getTime() - hours * 60 * 60 * 1000)

      const response = await fetch(
        `/api/games?depth=2&where[and][0][status][equals]=final&where[and][1][scheduledTime][greater_than]=${past.toISOString()}&sort=-scheduledTime`
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recent games: ${response.statusText}`)
      }

      const data = await response.json()
      return data.docs || data
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch recent games')
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  return {
    ...state,
    fetchGames,
    fetchTeams,
    fetchLiveGames,
    fetchGamesByStatus,
    fetchGamesByDay,
    fetchGame,
    fetchTeam,
    fetchTeamPlayers,
    fetchGameStats,
    fetchUpcomingGames,
    fetchRecentGames
  }
}