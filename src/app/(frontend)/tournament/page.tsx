/**
 * @description Tournament homepage with live scoreboard and featured content
 * @dependencies Payload CMS, tournament components, SSE updates
 * @accessibility Semantic HTML, ARIA regions, keyboard navigation
 * @performance Server-side rendering with client-side real-time updates
 */

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next/metadata'
import { TournamentHomepage } from './page.client'

export const metadata: Metadata = {
  title: 'Cowtown Showdown - Live Tournament',
  description: 'Follow the live action from the Cowtown Showdown Senior Men\'s Box Lacrosse Tournament. Real-time scores, standings, and tournament updates.',
  keywords: ['lacrosse', 'tournament', 'Calgary', 'Cowtown Showdown', 'box lacrosse', 'live scores'],
  openGraph: {
    title: 'Cowtown Showdown - Live Tournament',
    description: 'Follow the live action from the Cowtown Showdown lacrosse tournament',
    type: 'website',
  }
}

export default async function TournamentPage() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Get today's games and upcoming games
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    
    // Get live and recent games
    const [liveGames, todaysGames, upcomingGames, teams] = await Promise.all([
      // Live games
      payload.find({
        collection: 'games',
        depth: 2,
        where: {
          or: [
            { status: { equals: 'live' } },
            { status: { equals: 'overtime' } }
          ]
        },
        sort: 'scheduledTime',
        limit: 10
      }),
      
      // Today's games
      payload.find({
        collection: 'games',
        depth: 2,
        where: {
          and: [
            {
              scheduledTime: {
                greater_than_equal: startOfDay.toISOString()
              }
            },
            {
              scheduledTime: {
                less_than: endOfDay.toISOString()
              }
            }
          ]
        },
        sort: 'scheduledTime',
        limit: 20
      }),
      
      // Next 5 upcoming games
      payload.find({
        collection: 'games',
        depth: 2,
        where: {
          and: [
            { status: { equals: 'scheduled' } },
            {
              scheduledTime: {
                greater_than: now.toISOString()
              }
            }
          ]
        },
        sort: 'scheduledTime',
        limit: 5
      }),
      
      // All teams for quick access
      payload.find({
        collection: 'teams',
        limit: 20,
        sort: 'name'
      })
    ])

    // Get recent final games (last 6 hours)
    const recentCutoff = new Date(now.getTime() - 6 * 60 * 60 * 1000)
    const recentGames = await payload.find({
      collection: 'games',
      depth: 2,
      where: {
        and: [
          { status: { equals: 'final' } },
          {
            scheduledTime: {
              greater_than: recentCutoff.toISOString()
            }
          }
        ]
      },
      sort: '-scheduledTime',
      limit: 10
    })

    // Get featured live stream game (if any)
    const featuredGame = liveGames.docs.find(game => game.youtubeUrl) || 
                        liveGames.docs[0] || 
                        upcomingGames.docs[0]

    return (
      <TournamentHomepage
        liveGames={liveGames.docs}
        todaysGames={todaysGames.docs}
        upcomingGames={upcomingGames.docs}
        recentGames={recentGames.docs}
        teams={teams.docs}
        featuredGame={featuredGame}
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