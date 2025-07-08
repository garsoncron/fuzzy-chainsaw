/**
 * @description Main games dashboard component with claiming functionality
 * @dependencies Payload CMS types, React hooks, shadcn/ui components
 * @accessibility ARIA labels, keyboard navigation, screen reader support
 * @performance Optimized for 500-900 concurrent users, mobile-first design
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDateTime } from '@/utilities/formatDateTime'
import { GameClaimDialog } from './GameClaimDialog'
import { useRouter } from 'next/navigation'
import type { Game, User } from '@/payload-types'

interface GamesDashboardProps {
  games: Game[]
  currentUser: User
}

export function GamesDashboard({ games, currentUser }: GamesDashboardProps) {
  const [currentGames, setCurrentGames] = useState(games)
  const [filteredGames, setFilteredGames] = useState(games)
  const [selectedDay, setSelectedDay] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Refresh games from server
  const refreshGames = async () => {
    try {
      console.log('🔄 Refreshing games data...')
      const response = await fetch('/api/games', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentGames(data.docs || [])
        console.log('✅ Games refreshed successfully')
      } else {
        console.error('❌ Failed to refresh games')
      }
    } catch (error) {
      console.error('❌ Error refreshing games:', error)
    }
  }

  // Filter games based on search and filter criteria
  useEffect(() => {
    let filtered = currentGames

    if (selectedDay !== 'all') {
      filtered = filtered.filter(game => game.day === parseInt(selectedDay))
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(game => game.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(game => 
        game.gameNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof game.homeTeam === 'object' && game.homeTeam?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof game.awayTeam === 'object' && game.awayTeam?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredGames(filtered)
  }, [currentGames, selectedDay, selectedStatus, searchTerm])

  const handleClaimGame = (game: Game) => {
    setSelectedGame(game)
    setClaimDialogOpen(true)
  }

  const handleManageGame = (game: Game) => {
    console.log('🎮 Navigating to game:', game.id, 'Status:', game.status)
    router.push(`/scorekeeper/game/${game.id}`)
  }

  const handleViewGame = (game: Game) => {
    console.log('👀 Viewing completed game:', game.id)
    router.push(`/scorekeeper/game/${game.id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'live':
        return 'bg-green-100 text-green-800 border border-green-200 pulse-live'
      case 'final':
        return 'bg-gray-100 text-gray-800 border border-gray-200'
      case 'overtime':
        return 'bg-orange-100 text-orange-800 border border-orange-200 pulse-live'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const canClaimGame = (game: Game) => {
    return game.status === 'scheduled' && !game.assignedScorekeeper
  }

  const isUserAssigned = (game: Game) => {
    return game.assignedScorekeeper?.id === currentUser.id
  }

  const getAssignedUser = (game: Game) => {
    return game.assignedScorekeeper?.name || null
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-amber-50/50 dark:bg-gray-700/50 rounded-lg p-4 border-2 border-primary-brown/10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-full sm:w-32 border-primary-brown/30 focus:border-golden focus:ring-golden/30">
                <SelectValue placeholder="All Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                <SelectItem value="1">📅 Day 1</SelectItem>
                <SelectItem value="2">📅 Day 2</SelectItem>
                <SelectItem value="3">📅 Day 3</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40 border-primary-brown/30 focus:border-golden focus:ring-golden/30">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">📅 Scheduled</SelectItem>
                <SelectItem value="live">🔴 Live</SelectItem>
                <SelectItem value="final">✅ Final</SelectItem>
                <SelectItem value="overtime">⚡ Overtime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="🔍 Search teams or game numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 border-primary-brown/30 focus:border-golden focus:ring-golden/30"
          />
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid gap-6">
        {filteredGames.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤠</div>
            <h3 className="text-2xl font-bold text-primary-brown mb-2">No Games Found, Partner!</h3>
            <p className="text-muted-foreground text-lg mb-6">
              {games.length === 0 
                ? "Looks like the tournament hasn't been seeded yet. Head to the saloon (admin panel) to set up some games!"
                : "Try adjusting your filters or search terms to find the games you're looking for."
              }
            </p>
            {games.length === 0 && (
              <Button 
                onClick={() => window.open('/seed', '_blank')} 
                className="bg-primary-brown hover:bg-dark-brown text-white"
              >
                🌱 Seed Tournament Data
              </Button>
            )}
          </div>
        ) : (
          filteredGames.map((game) => (
            <Card key={game.id} className="hover:shadow-lg transition-all duration-300 border-2 border-primary-brown/20 hover:border-golden/50 bg-gradient-to-r from-white to-amber-50/30 dark:from-gray-800 dark:to-gray-700">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary-brown/5 to-golden/5 border-b border-primary-brown/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <span className="text-2xl">{getStatusIcon(game.status)}</span>
                    <span className="font-bold text-primary-brown">Game {game.gameNumber}</span>
                    {game.gameType === 'medal' && (
                      <span className="text-golden text-sm">🏆 Medal Game</span>
                    )}
                  </CardTitle>
                  <Badge className={`${getStatusColor(game.status)} px-3 py-1 text-sm font-semibold rounded-full`}>
                    {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Teams */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-blue-600">
                    {typeof game.homeTeam === 'object' ? game.homeTeam.name : 'TBD'}
                  </span>
                  <span className="text-gray-500">vs</span>
                  <span className="text-red-600">
                    {typeof game.awayTeam === 'object' ? game.awayTeam.name : 'TBD'}
                  </span>
                </div>

                {/* Score (if live or final) */}
                {(game.status === 'live' || game.status === 'final' || game.status === 'overtime') && (
                  <div className="flex items-center justify-center text-2xl font-bold">
                    <span className="text-blue-600">{game.homeScore || 0}</span>
                    <span className="mx-4 text-gray-400">-</span>
                    <span className="text-red-600">{game.awayScore || 0}</span>
                  </div>
                )}

                {/* Game Details */}
                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600">
                  <span>Day {game.day} • {formatDateTime(game.scheduledTime)}</span>
                  <span className="capitalize">{game.gameType} Game</span>
                </div>

                {/* Scorekeeper Info */}
                {getAssignedUser(game) && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Scorekeeper:</span>
                    <span className={isUserAssigned(game) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                      {getAssignedUser(game)}
                      {isUserAssigned(game) && ' (You)'}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {/* Claim Game - for unclaimed scheduled games */}
                  {canClaimGame(game) && (
                    <Button
                      onClick={() => handleClaimGame(game)}
                      className="flex-1 h-12 text-base bg-primary-brown hover:bg-dark-brown text-white shadow-md hover:shadow-lg transition-all duration-200"
                      variant="default"
                    >
                      🤝 Claim Game
                    </Button>
                  )}

                  {/* Manage Game - for games you're assigned to (scheduled, live, or overtime) */}
                  {isUserAssigned(game) && (game.status === 'scheduled' || game.status === 'live' || game.status === 'overtime') && (
                    <Button
                      onClick={() => handleManageGame(game)}
                      className="flex-1 h-12 text-base bg-golden hover:bg-golden/90 text-dark-brown font-bold shadow-md hover:shadow-lg transition-all duration-200"
                      variant="default"
                    >
                      {game.status === 'scheduled' ? '🎮 Start Game' : '🎮 Manage Live'}
                    </Button>
                  )}

                  {/* View Completed Game - for final games you managed */}
                  {isUserAssigned(game) && game.status === 'final' && (
                    <Button
                      onClick={() => handleViewGame(game)}
                      className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                      variant="default"
                    >
                      📊 View Final Stats
                    </Button>
                  )}

                  {/* View Any Completed Game - for admins or any final game */}
                  {game.status === 'final' && !isUserAssigned(game) && currentUser.role === 'admin' && (
                    <Button
                      onClick={() => handleViewGame(game)}
                      className="flex-1 h-12 text-base bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                      variant="default"
                    >
                      👀 View Game
                    </Button>
                  )}

                  {/* Claimed by other user */}
                  {getAssignedUser(game) && !isUserAssigned(game) && game.status !== 'final' && (
                    <Button
                      disabled
                      className="flex-1 h-12 text-base opacity-50 cursor-not-allowed border-dashed"
                      variant="outline"
                    >
                      🔒 Claimed by {getAssignedUser(game)}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Claim Game Dialog */}
      <GameClaimDialog
        open={claimDialogOpen}
        onOpenChange={setClaimDialogOpen}
        game={selectedGame}
        currentUser={currentUser}
        onClaim={() => {
          // Refresh the games data
          refreshGames()
        }}
      />
    </div>
  )
}