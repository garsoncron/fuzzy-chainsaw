/**
 * @description Main tournament homepage component
 * @dependencies React, tournament components, real-time updates
 * @accessibility Semantic HTML, ARIA regions, keyboard navigation
 * @performance Optimized for high traffic and real-time updates
 */

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GameCardWrapper as GameCard } from './GameCardWrapper'
import { 
  Trophy, 
  Calendar, 
  Users, 
  Play, 
  MapPin,
  Clock,
  Star
} from 'lucide-react'
// import type { Game, Team } from '@/payload-types' // Will be available after type generation

// Basic type definitions for compatibility
type Team = {
  id: string
  name: string
  city: string
  province?: string
  slug: string
  primaryColor?: string
  secondaryColor?: string
}

type Game = {
  id: string
  gameNumber: string
  gameType: 'pool' | 'medal'
  day: string
  scheduledTime: string
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  homeTeam: string | Team
  awayTeam: string | Team
  homeScore: number
  awayScore: number
  currentPeriod?: string
  periodTimeRemaining?: number
  totalGamePoints?: {
    home: number
    away: number
  }
  threeStars?: {
    first?: string
    second?: string
    third?: string
  }
  youtubeUrl?: string
  slug?: string
}

interface TournamentHomepageProps {
  teams: Team[]
  games: Game[]
}

interface GameWithTeams extends Game {
  homeTeam: Team
  awayTeam: Team
}

export function TournamentHomepage({ teams, games }: TournamentHomepageProps) {
  const [liveGames, setLiveGames] = useState<GameWithTeams[]>([])
  const [upcomingGames, setUpcomingGames] = useState<GameWithTeams[]>([])
  const [recentGames, setRecentGames] = useState<GameWithTeams[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Categorize games on load and updates
    const categorizeGames = () => {
      const now = new Date()
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000)
      
      const live = games.filter(game => 
        game.status === 'live' || game.status === 'overtime'
      ) as GameWithTeams[]
      
      const upcoming = games.filter(game => 
        game.status === 'scheduled' && new Date(game.scheduledTime) > now
      ).slice(0, 6) as GameWithTeams[]
      
      const recent = games.filter(game => 
        game.status === 'final' && new Date(game.scheduledTime) > sixHoursAgo
      ).slice(0, 4) as GameWithTeams[]

      setLiveGames(live)
      setUpcomingGames(upcoming)
      setRecentGames(recent)
    }

    categorizeGames()

    // Set up SSE connection for real-time updates
    const eventSource = new EventSource('/api/games/live')
    
    eventSource.onopen = () => {
      setIsConnected(true)
    }
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastUpdate(new Date())
        
        if (data.type === 'scoreboard_update' && data.games) {
          // Update games and re-categorize
          categorizeGames()
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }
    
    eventSource.onerror = () => {
      setIsConnected(false)
    }
    
    return () => {
      eventSource.close()
    }
  }, [games])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const tournamentStats = {
    totalGames: games.length,
    completedGames: games.filter(g => g.status === 'final').length,
    liveGames: liveGames.length,
    totalTeams: teams.length
  }

  const featuredGame = liveGames[0] || upcomingGames[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-brown/10 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-western text-primary-brown mb-4">
            Cowtown Showdown
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">
            Senior Men's Box Lacrosse Tournament
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2" />
              Calgary, Alberta
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-5 w-5 mr-2" />
              {tournamentStats.totalTeams} Teams
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-5 w-5 mr-2" />
              {tournamentStats.totalGames} Games
            </div>
            <div className={`flex items-center ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`} />
              {isConnected ? 'Live Updates' : 'Offline'}
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/schedule">
              <Button size="lg" className="bg-primary-brown hover:bg-dark-brown">
                <Calendar className="h-5 w-5 mr-2" />
                View Schedule
              </Button>
            </Link>
            <Link href="/standings">
              <Button size="lg" variant="outline">
                <Trophy className="h-5 w-5 mr-2" />
                Standings
              </Button>
            </Link>
            {liveGames.length > 0 && (
              <Link href={`/games/${featuredGame?.slug}`}>
                <Button size="lg" variant="outline">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Live
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Tournament Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-brown mb-2">
                {tournamentStats.completedGames}
              </div>
              <div className="text-sm text-muted-foreground">Games Complete</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {tournamentStats.liveGames}
              </div>
              <div className="text-sm text-muted-foreground">Live Now</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-golden mb-2">
                {tournamentStats.totalTeams}
              </div>
              <div className="text-sm text-muted-foreground">Teams</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-brown mb-2">
                {tournamentStats.totalGames}
              </div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Games */}
            {liveGames.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-western text-primary-brown flex items-center">
                    <span className="pulse-live text-live-indicator mr-3">●</span>
                    Live Games
                  </h2>
                  <Badge className="bg-game-live text-live-indicator pulse-live">
                    {liveGames.length} LIVE
                  </Badge>
                </div>
                <div className="grid gap-6">
                  {liveGames.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game}
                      showDay={true}
                      className="ring-2 ring-live-indicator"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Games */}
            {upcomingGames.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-western text-primary-brown flex items-center">
                    <Clock className="h-8 w-8 mr-3" />
                    Next Games
                  </h2>
                  <Link href="/schedule">
                    <Button variant="outline" size="sm">
                      View Full Schedule
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingGames.slice(0, 4).map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game}
                      compact={true}
                      showDay={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Recent Results */}
            {recentGames.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-western text-primary-brown flex items-center">
                    <Trophy className="h-8 w-8 mr-3" />
                    Recent Results
                  </h2>
                  <Link href="/schedule?filter=final">
                    <Button variant="outline" size="sm">
                      View All Results
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {recentGames.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game}
                      compact={true}
                      showThreeStars={true}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="font-western text-primary-brown">Tournament</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/standings" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Trophy className="h-4 w-4 mr-2" />
                    Standings
                  </Button>
                </Link>
                <Link href="/schedule" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </Link>
                <Link href="/teams" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Teams
                  </Button>
                </Link>
                <Link href="/players" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Players
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Teams */}
            <Card>
              <CardHeader>
                <CardTitle className="font-western text-primary-brown">Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teams.slice(0, 8).map(team => (
                    <Link key={team.id} href={`/teams/${team.slug}`} className="block">
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        <span className="truncate">{team.name}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tournament Format */}
            <Card>
              <CardHeader>
                <CardTitle className="font-western text-primary-brown">Format</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>• 8 teams, pool play format</div>
                <div>• 22 games over 3 days</div>
                <div>• 5-point system per game</div>
                <div>• RMLL Modified Rules</div>
                <div>• 12-minute periods (pool)</div>
                <div>• 15-minute periods (medal)</div>
              </CardContent>
            </Card>

            {/* Live Updates Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-western text-primary-brown">Live Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Connection Status:</span>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Last Update:</span>
                  <span>{formatTime(lastUpdate)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}