'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

/**
 * @description Game claiming interface for scorekeepers
 * @dependencies UI components, React hooks
 * @accessibility Full keyboard navigation and screen reader support
 * @security Role-based game claiming with session validation
 */

interface Game {
  id: string
  gameNumber: string
  homeTeam: string
  awayTeam: string
  scheduledTime: string
  status: 'scheduled' | 'live' | 'final'
  claimedBy?: string
  claimedByName?: string
}

interface GameClaimManagerProps {
  userId: string
  userRole: string
  assignedGames?: string[]
  onGameClaimed: (gameId: string) => void
  onGameReleased: (gameId: string) => void
  className?: string
}

export function GameClaimManager({
  userId,
  userRole,
  assignedGames = [],
  onGameClaimed,
  onGameReleased,
  className = ''
}: GameClaimManagerProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [claimingGame, setClaimingGame] = useState<string | null>(null)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/games/available', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch games')
      }

      const data = await response.json()
      setGames(data.games)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games')
    } finally {
      setLoading(false)
    }
  }

  const handleClaimGame = async (gameId: string) => {
    setClaimingGame(gameId)
    try {
      const response = await fetch(`/api/games/${gameId}/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to claim game')
      }

      await fetchGames() // Refresh the list
      onGameClaimed(gameId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim game')
    } finally {
      setClaimingGame(null)
    }
  }

  const handleReleaseGame = async (gameId: string) => {
    setClaimingGame(gameId)
    try {
      const response = await fetch(`/api/games/${gameId}/release`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to release game')
      }

      await fetchGames() // Refresh the list
      onGameReleased(gameId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release game')
    } finally {
      setClaimingGame(null)
    }
  }

  const canClaimGame = (game: Game): boolean => {
    // Game must not be claimed by someone else
    if (game.claimedBy && game.claimedBy !== userId) return false
    
    // Admins can claim any game
    if (userRole === 'admin' || userRole === 'superAdmin') return true
    
    // Scorekeepers can only claim assigned games or unclaimed games
    if (userRole === 'scorekeeper') {
      return assignedGames.includes(game.id) || !game.claimedBy
    }
    
    return false
  }

  const getGameStatusIcon = (game: Game) => {
    if (game.claimedBy === userId) {
      return <CheckCircle className=\"h-4 w-4 text-green-600\" />
    }
    if (game.claimedBy) {
      return <User className=\"h-4 w-4 text-blue-600\" />
    }
    return <AlertCircle className=\"h-4 w-4 text-gray-400\" />
  }

  const getGameStatusText = (game: Game) => {
    if (game.claimedBy === userId) {
      return 'Claimed by you'
    }
    if (game.claimedBy) {
      return `Claimed by ${game.claimedByName || 'Unknown'}`
    }
    return 'Available'
  }

  const formatGameTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className=\"p-6\">
          <div className=\"animate-pulse space-y-4\">
            <div className=\"h-4 bg-gray-200 rounded w-1/4\"></div>
            <div className=\"space-y-2\">
              <div className=\"h-3 bg-gray-200 rounded\"></div>
              <div className=\"h-3 bg-gray-200 rounded w-5/6\"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className=\"flex items-center gap-2\">
          <Clock className=\"h-5 w-5\" />
          Game Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant=\"destructive\" className=\"mb-4\">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className=\"space-y-3\">
          {games.length === 0 ? (
            <p className=\"text-center text-gray-500 py-4\">
              No games available at this time.
            </p>
          ) : (
            games.map((game) => (
              <div
                key={game.id}
                className=\"border rounded-lg p-4 space-y-3\"
              >
                <div className=\"flex items-center justify-between\">
                  <div>
                    <h3 className=\"font-semibold\">
                      Game {game.gameNumber}: {game.homeTeam} vs {game.awayTeam}
                    </h3>
                    <p className=\"text-sm text-gray-600\">
                      {formatGameTime(game.scheduledTime)}
                    </p>
                  </div>
                  <Badge variant={game.status === 'live' ? 'default' : 'secondary'}>
                    {game.status}
                  </Badge>
                </div>
                
                <div className=\"flex items-center justify-between\">
                  <div className=\"flex items-center gap-2 text-sm\">
                    {getGameStatusIcon(game)}
                    <span>{getGameStatusText(game)}</span>
                  </div>
                  
                  <div className=\"flex gap-2\">
                    {game.claimedBy === userId ? (
                      <Button
                        onClick={() => handleReleaseGame(game.id)}
                        disabled={claimingGame === game.id}
                        variant=\"outline\"
                        size=\"sm\"
                      >
                        {claimingGame === game.id ? 'Releasing...' : 'Release'}
                      </Button>
                    ) : canClaimGame(game) ? (
                      <Button
                        onClick={() => handleClaimGame(game.id)}
                        disabled={claimingGame === game.id}
                        size=\"sm\"
                      >
                        {claimingGame === game.id ? 'Claiming...' : 'Claim'}
                      </Button>
                    ) : (
                      <Button
                        disabled
                        variant=\"outline\"
                        size=\"sm\"
                      >
                        Unavailable
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className=\"mt-4 text-xs text-gray-500\">
          {userRole === 'scorekeeper' && assignedGames.length > 0 && (
            <p>You are assigned to {assignedGames.length} game(s) this tournament.</p>
          )}
          {userRole === 'admin' || userRole === 'superAdmin' ? (
            <p>As an admin, you can claim any available game.</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}