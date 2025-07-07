/**
 * @description Scorekeeper dashboard for game management and claiming
 * @dependencies Next.js 15 App Router, Payload CMS API, React hooks
 * @accessibility Full keyboard navigation, ARIA labels, screen reader support
 * @performance Optimized for mobile tablets, 44px touch targets
 */

import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { GamesDashboard } from '@/components/scorekeeper/GamesDashboard'
import { getCurrentUser } from '@/lib/auth'

export default async function ScorekeeperPage() {
  const payload = await getPayload({ config })
  const user = await getCurrentUser()

  // Check if user is authorized as scorekeeper
  if (!user || (user.role !== 'scorekeeper' && user.role !== 'admin' && user.role !== 'superAdmin')) {
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

  console.log('🎮 Games found:', games.totalDocs)
  console.log('🎮 Sample game:', games.docs[0] ? {
    id: games.docs[0].id,
    gameNumber: games.docs[0].gameNumber,
    homeTeam: games.docs[0].homeTeam,
    awayTeam: games.docs[0].awayTeam
  } : 'No games')

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Western Header */}
      <div className="bg-dark-brown text-white shadow-lg border-b-4 border-golden">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-western text-golden mb-2 drop-shadow-lg">
                🤠 Scorekeeper Dashboard
              </h1>
              <p className="text-amber-100 text-lg">
                Welcome back, <span className="text-golden font-semibold">{user.firstName || user.email}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="bg-primary-brown/30 rounded-lg px-4 py-2 border border-golden/30">
                <p className="text-golden text-sm font-medium">Tournament Role</p>
                <p className="text-amber-100 text-lg capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 border-2 border-primary-brown/20 shadow-lg backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-brown">{games.totalDocs}</div>
              <div className="text-sm text-muted-foreground">Total Games</div>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 border-2 border-green-500/20 shadow-lg backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {games.docs.filter(g => g.status === 'live').length}
              </div>
              <div className="text-sm text-muted-foreground">Live Games</div>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 border-2 border-blue-500/20 shadow-lg backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {games.docs.filter(g => g.status === 'scheduled').length}
              </div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 border-2 border-gray-500/20 shadow-lg backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {games.docs.filter(g => g.status === 'final').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>

        {/* Games Dashboard */}
        <div className="bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-xl border-2 border-primary-brown/30 backdrop-blur-sm">
          <div className="p-6 border-b border-primary-brown/20">
            <h2 className="text-2xl font-bold text-primary-brown mb-1">
              🏆 Tournament Games
            </h2>
            <p className="text-muted-foreground">
              Claim and manage games for the Cowtown Showdown
            </p>
          </div>
          
          <div className="p-6">
            <GamesDashboard 
              games={games.docs} 
              currentUser={user}
            />
          </div>
        </div>
      </div>
    </div>
  )
}