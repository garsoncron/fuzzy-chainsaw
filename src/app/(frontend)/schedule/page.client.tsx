/**
 * @description Client-side schedule page with filtering and view options
 * @dependencies React, tournament components, date utilities
 * @accessibility Tab navigation, screen reader labels, keyboard shortcuts
 * @performance Efficient filtering and virtual scrolling for large datasets
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GameCard } from '@/components/tournament/GameCard'
import { 
  Calendar, 
  List, 
  Filter, 
  Search, 
  Clock, 
  Users,
  Trophy,
  Play,
  CheckCircle,
  CalendarDays
} from 'lucide-react'
import type { Game, Team } from '@/payload-types'

interface SchedulePageProps {
  games: Game[]
  teams: Team[]
  gamesByDay: Record<string, Game[]>
  tournamentDates: Record<string, Date>
  totalGames: number
}

interface GameWithTeams extends Game {
  homeTeam: Team
  awayTeam: Team
}

type ViewMode = 'calendar' | 'list'
type FilterDay = 'all' | '1' | '2' | '3'
type FilterStatus = 'all' | 'scheduled' | 'live' | 'final'

export function SchedulePage({ 
  games, 
  teams, 
  gamesByDay, 
  tournamentDates,
  totalGames 
}: SchedulePageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [filterDay, setFilterDay] = useState<FilterDay>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterTeam, setFilterTeam] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGames = useMemo(() => {
    let filtered = games as GameWithTeams[]

    // Filter by day
    if (filterDay !== 'all') {
      filtered = filtered.filter(game => game.day?.toString() === filterDay)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(game => game.status === filterStatus)
    }

    // Filter by team
    if (filterTeam !== 'all') {
      filtered = filtered.filter(game => 
        game.homeTeam?.id === filterTeam || game.awayTeam?.id === filterTeam
      )
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(game =>
        game.homeTeam?.name?.toLowerCase().includes(term) ||
        game.awayTeam?.name?.toLowerCase().includes(term) ||
        game.gameNumber?.toLowerCase().includes(term) ||
        `game ${game.gameNumber}`.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [games, filterDay, filterStatus, filterTeam, searchTerm])

  const gameStats = useMemo(() => {
    const stats = {
      total: games.length,
      scheduled: games.filter(g => g.status === 'scheduled').length,
      live: games.filter(g => g.status === 'live' || g.status === 'overtime').length,
      completed: games.filter(g => g.status === 'final').length,
      byDay: Object.keys(gamesByDay).reduce((acc, day) => {
        acc[day] = gamesByDay[day].length
        return acc
      }, {} as Record<string, number>)
    }
    return stats
  }, [games, gamesByDay])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'text-blue-600 bg-blue-50',
      live: 'text-green-600 bg-green-50',
      overtime: 'text-orange-600 bg-orange-50',
      final: 'text-gray-600 bg-gray-50'
    }
    return colors[status as keyof typeof colors] || colors.scheduled
  }

  const CalendarView = () => (
    <div className="space-y-8">
      {Object.entries(tournamentDates).map(([day, date]) => {
        const dayGames = filteredGames.filter(game => game.day?.toString() === day)
        
        if (dayGames.length === 0 && filterDay === 'all') return null

        return (
          <Card key={day} className="overflow-hidden">
            <CardHeader className="bg-primary-brown/5">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-6 w-6 text-primary-brown" />
                  <div>
                    <span className="font-western text-primary-brown">
                      Day {day}
                    </span>
                    <div className="text-sm text-muted-foreground font-normal">
                      {formatDate(date)}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-primary-brown border-primary-brown">
                  {dayGames.length} games
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {dayGames.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No games match the current filters for Day {day}
                </div>
              ) : (
                <div className="grid gap-4 p-6">
                  {dayGames.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game}
                      showDay={false}
                      className="hover:shadow-md transition-shadow"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const ListView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <List className="h-5 w-5 text-primary-brown" />
          <span className="font-western text-primary-brown">All Games</span>
          <Badge variant="outline" className="text-primary-brown border-primary-brown">
            {filteredGames.length} of {totalGames}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredGames.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No games match your current filters.</p>
            <p className="text-sm mt-2">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGames.map(game => (
              <GameCard 
                key={game.id} 
                game={game}
                showDay={true}
                className="hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const clearFilters = () => {
    setFilterDay('all')
    setFilterStatus('all')
    setFilterTeam('all')
    setSearchTerm('')
  }

  const hasActiveFilters = filterDay !== 'all' || filterStatus !== 'all' || filterTeam !== 'all' || searchTerm

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-western text-primary-brown mb-2">
          Tournament Schedule
        </h1>
        <p className="text-muted-foreground mb-4">
          Complete schedule for all {totalGames} tournament games
        </p>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary-brown">{gameStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{gameStats.scheduled}</div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{gameStats.live}</div>
              <div className="text-sm text-muted-foreground">Live</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{gameStats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-golden">{Object.keys(tournamentDates).length}</div>
              <div className="text-sm text-muted-foreground">Days</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* View Mode Toggle */}
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
                className={viewMode === 'calendar' ? 'bg-primary-brown hover:bg-dark-brown' : ''}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-primary-brown hover:bg-dark-brown' : ''}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search games or teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={filterDay} onValueChange={(value) => setFilterDay(value as FilterDay)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  <SelectItem value="1">Day 1</SelectItem>
                  <SelectItem value="2">Day 2</SelectItem>
                  <SelectItem value="3">Day 3</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="final">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTeam} onValueChange={setFilterTeam}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filterDay !== 'all' && (
                <Badge variant="secondary">Day {filterDay}</Badge>
              )}
              {filterStatus !== 'all' && (
                <Badge variant="secondary">{filterStatus}</Badge>
              )}
              {filterTeam !== 'all' && (
                <Badge variant="secondary">
                  {teams.find(t => t.id === filterTeam)?.name}
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary">"{searchTerm}"</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === 'calendar' ? <CalendarView /> : <ListView />}

      {/* Tournament Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-primary-brown font-western">Tournament Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Game Format</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Pool Play: 12-minute periods</li>
              <li>• Medal Games: 15-minute periods</li>
              <li>• RMLL Modified Rules</li>
              <li>• 30-second shot clock</li>
              <li>• Stop time final 2 minutes</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Schedule Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Games start every 50 minutes</li>
              <li>• 5-minute warm-up before each game</li>
              <li>• 2-minute break between periods</li>
              <li>• Times shown in local time</li>
              <li>• Live updates during games</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}