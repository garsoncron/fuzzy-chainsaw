/**
 * @description Client-side tournament homepage with real-time updates
 * @dependencies React, SSE, tournament components
 * @accessibility Live regions, keyboard navigation, screen reader support
 * @performance Optimized SSE connections, efficient re-rendering
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Scoreboard } from '@/components/tournament/Scoreboard'
import { GameCard } from '@/components/tournament/GameCard'
import { 
  Trophy, 
  Calendar, 
  Users, 
  Play, 
  ExternalLink,
  Tv,
  Clock,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import type { Game, Team } from '@/payload-types'

interface TournamentHomepageProps {
  liveGames: Game[]
  todaysGames: Game[]
  upcomingGames: Game[]
  recentGames: Game[]
  teams: Team[]
  featuredGame?: Game
}

interface GameWithTeams extends Game {
  homeTeam: Team
  awayTeam: Team
}

export function TournamentHomepage({
  liveGames: initialLiveGames,
  todaysGames: initialTodaysGames,
  upcomingGames: initialUpcomingGames,
  recentGames: initialRecentGames,
  teams,
  featuredGame: initialFeaturedGame
}: TournamentHomepageProps) {
  const [liveGames, setLiveGames] = useState<GameWithTeams[]>(initialLiveGames as GameWithTeams[])
  const [todaysGames, setTodaysGames] = useState<GameWithTeams[]>(initialTodaysGames as GameWithTeams[])
  const [upcomingGames, setUpcomingGames] = useState<GameWithTeams[]>(initialUpcomingGames as GameWithTeams[])
  const [recentGames, setRecentGames] = useState<GameWithTeams[]>(initialRecentGames as GameWithTeams[])
  const [featuredGame, setFeaturedGame] = useState<GameWithTeams | undefined>(initialFeaturedGame as GameWithTeams)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Set up SSE connection for real-time updates
    const eventSource = new EventSource('/api/games/live')
    
    eventSource.onopen = () => {
      setIsConnected(true)
      console.log('Connected to live updates')
    }
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastUpdate(new Date())
        
        switch (data.type) {
          case 'connected':
            setIsConnected(true)
            break
            
          case 'scoreboard_update':
            // Update all games with new data
            if (data.games) {
              const games = data.games as GameWithTeams[]
              
              // Categorize updated games
              const live = games.filter(g => g.status === 'live' || g.status === 'overtime')
              const today = games.filter(g => {
                const gameDate = new Date(g.scheduledTime)
                const today = new Date()
                return gameDate.toDateString() === today.toDateString()
              })
              const upcoming = games.filter(g => 
                g.status === 'scheduled' && new Date(g.scheduledTime) > new Date()
              ).slice(0, 5)
              const recent = games.filter(g => {
                const gameTime = new Date(g.scheduledTime)
                const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)
                return g.status === 'final' && gameTime > sixHoursAgo
              })
              
              setLiveGames(live)
              setTodaysGames(today)
              setUpcomingGames(upcoming)
              setRecentGames(recent)
              
              // Update featured game if it's in the updated games
              if (featuredGame) {
                const updatedFeatured = games.find(g => g.id === featuredGame.id)
                if (updatedFeatured) {
                  setFeaturedGame(updatedFeatured)
                }
              }
            }
            break
            
          case 'game_update':
            // Handle individual game updates
            if (data.gameId && data.data) {
              // Update the specific game in all relevant arrays
              const updateGame = (gamesList: GameWithTeams[]) => 
                gamesList.map(game => 
                  game.id === data.gameId ? { ...game, ...data.data } : game
                )
              
              setLiveGames(updateGame)
              setTodaysGames(updateGame)
              setUpcomingGames(updateGame)
              setRecentGames(updateGame)
              
              if (featuredGame?.id === data.gameId) {
                setFeaturedGame(prev => prev ? { ...prev, ...data.data } : prev)
              }
            }
            break
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }
    
    eventSource.onerror = () => {
      setIsConnected(false)
      console.log('SSE connection error')
    }
    
    return () => {
      eventSource.close()
    }
  }, [featuredGame])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getTournamentDay = () => {
    const now = new Date()
    // This would be configured based on actual tournament dates
    // For now, we'll calculate based on the current date
    return 2 // Day 2 as example
  }

  const FeaturedGameCard = ({ game }: { game: GameWithTeams }) => (
    <Card className="mb-8 bg-gradient-to-r from-primary-brown/10 to-golden/10 border-2 border-golden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-western text-primary-brown">
              Featured Game {game.gameNumber}
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              {game.gameType === 'medal' ? 'Medal Game' : 'Pool Play'} • Day {game.day}
            </p>
          </div>
          {game.youtubeUrl && (
            <Badge className="bg-red-600 text-white">
              <Tv className="h-3 w-3 mr-1" />
              LIVE STREAM
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Game Info */}
          <div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-background rounded-lg">
                <div>
                  <div className="font-semibold text-lg">{game.homeTeam.name}</div>
                </div>
                <div className="text-3xl font-bold text-primary-brown">
                  {game.homeScore || 0}
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-background rounded-lg">
                <div>
                  <div className="font-semibold text-lg">{game.awayTeam.name}</div>
                </div>
                <div className="text-3xl font-bold text-primary-brown">
                  {game.awayScore || 0}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Link href={`/games/${game.slug}`}>
                <Button className="bg-primary-brown hover:bg-dark-brown">
                  <Play className="h-4 w-4 mr-2" />
                  Game Details
                </Button>
              </Link>
              {game.youtubeUrl && (
                <Button asChild variant="outline">
                  <a href={game.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch Live
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          {/* Stream Embed */}
          {game.youtubeUrl && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={game.youtubeUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                title={`Live stream: ${game.homeTeam.name} vs ${game.awayTeam.name}`}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tournament Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-western text-primary-brown mb-2">
          Cowtown Showdown
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Senior Men&apos;s Box Lacrosse Tournament
        </p>
        <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Calgary, Alberta
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Tournament Day {getTournamentDay()}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Last updated: {formatTime(lastUpdate)}
          </div>
          <div className={`flex items-center ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`} />
            {isConnected ? 'Live' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Featured Game */}
      {featuredGame && <FeaturedGameCard game={featuredGame} />}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Live Scoreboard */}
        <div className="lg:col-span-2">
          <Scoreboard 
            games={[...liveGames, ...upcomingGames, ...recentGames]}
            autoRefresh={false} // We handle updates via SSE
            className="mb-8"
          />
          
          {/* Today's Schedule */}
          {todaysGames.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary-brown" />
                  <span className="font-western text-primary-brown">Today&apos;s Games</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysGames.slice(0, 6).map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game as GameWithTeams}
                      compact={true}
                      showDay={false}
                    />
                  ))}
                </div>
                {todaysGames.length > 6 && (
                  <div className="mt-4 text-center">
                    <Link href="/schedule">
                      <Button variant="outline">
                        View Full Schedule
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-brown font-western">Tournament</CardTitle>
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
                  <Users className="h-4 w-4 mr-2" />
                  Players
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Teams Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-brown font-western">Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {teams.slice(0, 8).map(team => (
                  <Link key={team.id} href={`/teams/${team.slug}`} className="block">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      {team.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tournament Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-brown font-western">Tournament Format</CardTitle>
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
        </div>
      </div>
    </div>
  )
}