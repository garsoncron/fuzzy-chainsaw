/**
 * @description Individual game scoring interface for scorekeepers
 * @dependencies Next.js 15 App Router, Payload CMS, real-time updates
 * @accessibility Mobile-optimized with 44px touch targets, ARIA labels
 * @performance Real-time updates, offline sync, optimistic UI
 */

import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'
import { ScoringInterface } from '@/components/scorekeeper/ScoringInterface'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function GameScoringPage({ params }: PageProps) {
  const resolvedParams = await params
  const payload = await getPayload({ config })
  const user = await getCurrentUser()

  // Check authentication
  if (!user || (user.role !== 'scorekeeper' && user.role !== 'admin' && user.role !== 'superAdmin')) {
    redirect('/admin/login')
  }

  // Fetch the game with all related data
  try {
    const game = await payload.findByID({
      collection: 'games',
      id: resolvedParams.id,
      populate: {
        homeTeam: true,
        awayTeam: true,
        homeStartingGoalie: true,
        awayStartingGoalie: true,
        homeCurrentGoalie: true,
        awayCurrentGoalie: true,
        threeStars: {
          first: true,
          second: true,
          third: true,
        },
      },
    })

    // Parse claim data from youtubeUrl field
    let assignedScorekeeper = null
    if (game.youtubeUrl && game.youtubeUrl.startsWith('CLAIM_DATA:')) {
      try {
        const claimData = JSON.parse(game.youtubeUrl.replace('CLAIM_DATA:', ''))
        assignedScorekeeper = claimData.assignedScorekeeper
      } catch (error) {
        console.error('Error parsing claim data:', error)
      }
    }

    // Check if user is assigned to this game (or is admin)
    if (user.role !== 'admin' && user.role !== 'superAdmin' && assignedScorekeeper?.id !== user.id) {
      return (
        <div className="min-h-screen bg-background p-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You are not assigned to this game. Please claim the game first from the dashboard.
            </p>
            <a
              href="/scorekeeper"
              className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      )
    }

    // Fetch team rosters
    const [homeRoster, awayRoster] = await Promise.all([
      payload.find({
        collection: 'players',
        where: {
          team: { equals: game.homeTeam.id },
        },
        sort: 'jerseyNumber',
      }),
      payload.find({
        collection: 'players',
        where: {
          team: { equals: game.awayTeam.id },
        },
        sort: 'jerseyNumber',
      }),
    ])

    return (
      <div className="min-h-screen bg-background">
        <ScoringInterface
          game={game}
          homeRoster={homeRoster.docs}
          awayRoster={awayRoster.docs}
          currentUser={user}
        />
      </div>
    )
  } catch (error) {
    console.error('Error fetching game:', error)
    notFound()
  }
}