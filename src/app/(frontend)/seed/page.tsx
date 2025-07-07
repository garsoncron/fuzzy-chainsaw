'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [tournamentLoading, setTournamentLoading] = useState(false)
  const [message, setMessage] = useState('')

  const seedFullDatabase = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/next/seed', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        setMessage('✅ Full database seeded successfully! Includes demo content + tournament data.')
      } else {
        setMessage('❌ Failed to seed database. Make sure you are logged in as admin.')
      }
    } catch (error) {
      setMessage('❌ Error seeding database.')
    } finally {
      setLoading(false)
    }
  }

  const seedTournamentOnly = async () => {
    setTournamentLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/next/seed-tournament', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        setMessage('✅ Tournament data seeded successfully! Teams, players, and games added.')
      } else {
        setMessage('❌ Failed to seed tournament data. Make sure you are logged in as admin.')
      }
    } catch (error) {
      setMessage('❌ Error seeding tournament data.')
    } finally {
      setTournamentLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Seed Tournament Data</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Full Database Seed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Seeds the complete database including demo content (pages, posts, media) 
              plus all tournament data (teams, players, games, sample stats).
            </p>
            <Button 
              onClick={seedFullDatabase}
              disabled={loading || tournamentLoading}
              className="w-full"
            >
              {loading ? 'Seeding Full Database...' : 'Seed Full Database'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tournament Data Only</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Seeds only tournament-specific data: 8 teams, player rosters, 
              22-game schedule, and sample completed games with statistics.
            </p>
            <Button 
              onClick={seedTournamentOnly}
              disabled={loading || tournamentLoading}
              variant="outline"
              className="w-full"
            >
              {tournamentLoading ? 'Seeding Tournament Data...' : 'Seed Tournament Data Only'}
            </Button>
          </CardContent>
        </Card>

        {message && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center font-medium">{message}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>What Gets Seeded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>Teams:</strong> 8 tournament teams with captain info</div>
              <div><strong>Players:</strong> ~160 players (20 per team, mix of runners and goalies)</div>
              <div><strong>Games:</strong> 22 scheduled games (20 pool play + 2 medal games)</div>
              <div><strong>Sample Stats:</strong> 3 completed games with goals, penalties, etc.</div>
              <div><strong>Demo Content:</strong> Pages, posts, and media (full seed only)</div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Note: You must be logged in as an admin to seed data.
          </p>
        </div>
      </div>
    </div>
  )
}