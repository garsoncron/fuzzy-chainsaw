import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TeamsPage } from '@/components/tournament/TeamsPage'

export const metadata: Metadata = {
  title: 'Teams - Cowtown Showdown',
  description: 'Meet the 8 teams competing in the Cowtown Showdown Senior Men\'s Box Lacrosse Tournament. View team profiles, rosters, and contact information.',
  keywords: ['lacrosse teams', 'tournament teams', 'Calgary lacrosse', 'box lacrosse teams', 'Cowtown Showdown teams'],
}

export default async function TeamsPageRoute() {
  const payload = await getPayload({ config: configPromise })

  const teamsResult = await payload.find({
    collection: 'teams',
    limit: 8,
    sort: 'name',
  })

  const playersResult = await payload.find({
    collection: 'players',
    limit: 1000,
    sort: ['team', 'jerseyNumber'],
    depth: 1,
  })

  return <TeamsPage teams={teamsResult.docs} players={playersResult.docs} />
}