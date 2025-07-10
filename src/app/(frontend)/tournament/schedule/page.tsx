/**
 * @description Tournament schedule page with calendar and list views
 * @dependencies Payload CMS, schedule components, filtering
 * @accessibility Semantic HTML, keyboard navigation, screen reader support
 * @performance Server-side rendering with client-side filtering
 */

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next/metadata'
import { SchedulePage } from './page.client'
import type { Game } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Tournament Schedule - Cowtown Showdown',
  description: 'Complete tournament schedule for the Cowtown Showdown. View games by day, team, or time with live updates and real-time scoring.',
  keywords: ['lacrosse schedule', 'tournament games', 'Calgary lacrosse', 'game times', 'Cowtown Showdown schedule'],
  openGraph: {
    title: 'Tournament Schedule - Cowtown Showdown',
    description: 'Complete tournament schedule with live updates',
    type: 'website',
  }
}

export default async function TournamentSchedulePage() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Get all games with team relationships
    const [gamesResult, teamsResult] = await Promise.all([
      payload.find({
        collection: 'games',
        depth: 2, // Include team relationships
        limit: 100,
        sort: 'scheduledTime',
      }),
      payload.find({
        collection: 'teams',
        limit: 20,
        sort: 'name'
      })
    ])

    // Organize games by day
    const gamesByDay = gamesResult.docs.reduce((acc: Record<string, Game[]>, game) => {
      const day = game.day?.toString() || '1'
      if (!acc[day]) acc[day] = []
      acc[day].push(game)
      return acc
    }, {})

    // Get tournament dates (this would typically come from a global config)
    const tournamentDates = {
      '1': new Date('2024-07-12'), // Day 1
      '2': new Date('2024-07-13'), // Day 2  
      '3': new Date('2024-07-14'), // Day 3
    }

    return (
      <SchedulePage
        games={gamesResult.docs}
        teams={teamsResult.docs}
        gamesByDay={gamesByDay}
        tournamentDates={tournamentDates}
        totalGames={gamesResult.totalDocs}
      />
    )
  } catch (error) {
    console.error('Error loading schedule data:', error)
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-western text-primary-brown mb-4">
            Tournament Schedule
          </h1>
          <p className="text-muted-foreground">
            Sorry, we&apos;re having trouble loading the schedule. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}