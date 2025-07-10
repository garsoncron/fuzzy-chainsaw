import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TournamentHomepage } from './page.client'

export const metadata: Metadata = {
  title: 'Cowtown Showdown - Senior Men\'s Box Lacrosse Tournament',
  description: 'The premier Senior Men\'s box lacrosse tournament in Calgary. 8 teams compete over 3 days with live scoring, real-time updates, and western hospitality.',
  keywords: ['lacrosse', 'tournament', 'Calgary', 'box lacrosse', 'senior men', 'Cowtown Showdown'],
  openGraph: {
    title: 'Cowtown Showdown - Live Tournament',
    description: 'Follow the live action from the Cowtown Showdown lacrosse tournament',
    type: 'website',
  }
}

export default async function HomePage() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const now = new Date()
    
    // Fetch tournament data with relationships and homepage settings
    const [teamsResult, gamesResult, homepageSettings] = await Promise.all([
      payload.find({
        collection: 'teams',
        limit: 8,
        sort: 'name',
      }),
      payload.find({
        collection: 'games',
        depth: 2,
        limit: 50,
        sort: 'scheduledTime',
        where: {
          status: {
            in: ['scheduled', 'live', 'final', 'overtime'],
          },
        },
      }),
      payload.findGlobal({
        slug: 'homepage',
        depth: 2,
      }),
    ])

    // Get live and upcoming games for initial state
    const liveGames = gamesResult.docs.filter(game => 
      game.status === 'live' || game.status === 'overtime'
    )
    
    const upcomingGames = gamesResult.docs.filter(game => 
      game.status === 'scheduled' && new Date(game.scheduledTime) > now
    ).slice(0, 6)
    
    const recentGames = gamesResult.docs.filter(game => {
      const gameTime = new Date(game.scheduledTime)
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000)
      return game.status === 'final' && gameTime > sixHoursAgo
    }).slice(0, 4)

    return (
      <TournamentHomepage
        initialTeams={teamsResult.docs}
        initialGames={gamesResult.docs as any}
        initialLiveGames={liveGames as any}
        initialUpcomingGames={upcomingGames as any}
        initialRecentGames={recentGames as any}
        homepageSettings={homepageSettings}
      />
    )
  } catch (error) {
    console.error('Error loading tournament data:', error)
    
    // Return error fallback
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-western text-primary-brown mb-4">
            Cowtown Showdown
          </h1>
          <p className="text-muted-foreground">
            Sorry, we&apos;re having trouble loading the tournament data. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}