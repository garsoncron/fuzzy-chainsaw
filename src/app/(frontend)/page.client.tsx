/**
 * @description Client-side tournament homepage with live updates
 * @dependencies React hooks, tournament components, real-time data
 * @accessibility Semantic HTML, ARIA regions, keyboard navigation
 * @performance Optimized for high traffic and real-time updates
 */

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GameCardWrapper as GameCard } from '@/components/tournament/GameCardWrapper'
import { useTournamentData } from '@/lib/hooks/useTournamentData'
import { 
  Trophy, 
  Calendar, 
  Users, 
  Play, 
  MapPin,
  Clock,
  Star,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react'
import type { Game, Team, Homepage } from '@/payload-types'
import { SuperheroBannerBlock } from '@/blocks/SuperheroBanner/Component'
import YouTubeEmbedBlock from '@/blocks/YouTubeEmbed/Component'

export type GameWithTeams = Game & {
  homeTeam: Team
  awayTeam: Team
}

interface TournamentHomepageProps {
  initialTeams: Team[]
  initialGames: GameWithTeams[]
  initialLiveGames: GameWithTeams[]
  initialUpcomingGames: GameWithTeams[]
  initialRecentGames: GameWithTeams[]
  homepageSettings?: Homepage
}

export function TournamentHomepage({ 
  initialTeams,
  initialGames,
  initialLiveGames,
  initialUpcomingGames,
  initialRecentGames,
  homepageSettings
}: TournamentHomepageProps) {
  const [teams] = useState<Team[]>(initialTeams)
  const [liveGames, setLiveGames] = useState<GameWithTeams[]>(initialLiveGames)
  const [upcomingGames, setUpcomingGames] = useState<GameWithTeams[]>(initialUpcomingGames)
  const [recentGames, setRecentGames] = useState<GameWithTeams[]>(initialRecentGames)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Use tournament data hook for real-time updates
  const {
    games: currentGames,
    liveGames: hookLiveGames,
    upcomingGames: hookUpcomingGames,
    recentGames: hookRecentGames,
    isConnected: hookIsConnected,
    lastUpdate: hookLastUpdate,
    refreshData,
    isLoading,
    error
  } = useTournamentData()

  // Update local state when hook data changes
  useEffect(() => {
    if (currentGames.length > 0) {
      setLiveGames(hookLiveGames)
      setUpcomingGames(hookUpcomingGames)
      setRecentGames(hookRecentGames)
      setIsConnected(hookIsConnected)
      setLastUpdate(hookLastUpdate)
    }
  }, [hookLiveGames, hookUpcomingGames, hookRecentGames, hookIsConnected, hookLastUpdate, currentGames])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const tournamentStats = {
    totalGames: currentGames.length || initialGames.length,
    completedGames: currentGames.filter(g => g.status === 'final').length || initialGames.filter(g => g.status === 'final').length,
    liveGames: liveGames.length,
    totalTeams: teams.length
  }

  const featuredGame = liveGames[0] || upcomingGames[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner from CMS */}
      {homepageSettings?.enableHeroBanner && homepageSettings?.heroBanner && (
        <SuperheroBannerBlock
          backgroundImage={homepageSettings.heroBanner.backgroundImage}
          announcementBadge={homepageSettings.heroBanner.announcementBadge}
          heading={homepageSettings.heroBanner.heading}
          subheading={homepageSettings.heroBanner.subheading || ''}
          primaryCTA={homepageSettings.heroBanner.primaryCTA}
          secondaryCTA={homepageSettings.heroBanner.secondaryCTA}
          enableGradientOverlay={homepageSettings.heroBanner.enableGradientOverlay}
          blockType="heroBanner"
        />
      )}

      {/* Default Hero Section (shown if CMS hero is disabled) */}
      {(!homepageSettings?.enableHeroBanner || !homepageSettings?.heroBanner) && (
        <section className="bg-gradient-to-b from-primary-brown/10 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-western text-primary-brown mb-4">
              Cowtown Showdown
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Senior Men&apos;s Box Lacrosse Tournament
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
              {isConnected ? (
                <Wifi className="h-5 w-5 mr-2" />
              ) : (
                <WifiOff className="h-5 w-5 mr-2" />
              )}
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
            {liveGames.length > 0 && featuredGame && (
              <Link href={`/games/${featuredGame.slug}`}>
                <Button size="lg" variant="outline">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Live
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      )}

      {/* YouTube Live Stream Section */}
      {homepageSettings?.enableLiveStream && homepageSettings?.liveStream?.youtubeUrl && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {homepageSettings.liveStream.title && (
              <h2 className="text-3xl md:text-4xl font-western text-primary-brown text-center mb-8">
                {homepageSettings.liveStream.title}
              </h2>
            )}
            <YouTubeEmbedBlock
              url={homepageSettings.liveStream.youtubeUrl}
              title={homepageSettings.liveStream.title || 'Tournament Live Stream'}
              autoplay={homepageSettings.liveStream.autoplay}
              muted={homepageSettings.liveStream.muted}
              showControls={homepageSettings.liveStream.showControls}
              aspectRatio={homepageSettings.liveStream.aspectRatio}
              privacyEnhanced={homepageSettings.liveStream.privacyEnhanced}
              blockType="youtubeEmbed"
            />
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-700">Error loading tournament data: {error.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Retry
              </Button>
            </div>
          </div>
        )}

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
                      game={game as any}
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
                      game={game as any}
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
                      game={game as any}
                      compact={true}
                      showThreeStars={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* No games message */}
            {liveGames.length === 0 && upcomingGames.length === 0 && recentGames.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No games scheduled</h3>
                <p className="text-muted-foreground">Check back later for tournament updates.</p>
              </div>
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
                {!isConnected && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshData}
                    disabled={isLoading}
                    className="w-full mt-2"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}