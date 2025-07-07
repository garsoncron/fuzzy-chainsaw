/**
 * @description Scorekeeper dashboard for game management and claiming
 * @dependencies Next.js 15 App Router, Payload CMS API, React hooks
 * @accessibility Full keyboard navigation, ARIA labels, screen reader support
 * @performance Optimized for mobile tablets, 44px touch targets
 */

import { redirect } from 'next/navigation'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { GamesDashboard } from '@/components/scorekeeper/GamesDashboard'
import { getCurrentUser } from '@/lib/auth'

export default async function ScorekeeperPage() {
  const payload = await getPayloadHMR({ config })
  const user = await getCurrentUser()

  // Check if user is authorized as scorekeeper
  if (!user || (user.role !== 'scorekeeper' && user.role !== 'admin')) {
    redirect('/admin/login')
  }

  // Fetch all games for the dashboard
  const games = await payload.find({
    collection: 'games',
    sort: ['day', 'scheduledTime'],
    populate: {
      homeTeam: true,
      awayTeam: true,
    },
  })

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Scorekeeper Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage live scoring for Cowtown Showdown games
          </p>
        </header>

        <GamesDashboard 
          games={games.docs} 
          currentUser={user}
        />
      </div>
    </div>
  )
}