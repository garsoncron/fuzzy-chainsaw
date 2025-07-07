import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Team, Player, Game } from '@/payload-types'

interface TeamProfilePageProps {
  team: Team
  players: Player[]
  games: Game[]
}

export function TeamProfilePage({ team, players, games }: TeamProfilePageProps) {
  // Separate players by type
  const goalies = players.filter(p => p.playerType === 'goalie')
  const runners = players.filter(p => p.playerType === 'runner')

  // Group runners by position
  const runnersByPosition = runners.reduce((acc, player) => {
    const position = player.primaryPosition
    if (!acc[position]) {
      acc[position] = []
    }
    acc[position].push(player)
    return acc
  }, {} as Record<string, Player[]>)

  // Calculate team stats
  const totalPlayers = players.length
  const completedGames = games.filter(g => g.status === 'final').length
  const wins = games.filter(g => {
    if (g.status !== 'final') return false
    const isHome = typeof g.homeTeam === 'object' && g.homeTeam.id === team.id
    const isAway = typeof g.awayTeam === 'object' && g.awayTeam.id === team.id
    if (isHome) return g.homeScore > g.awayScore
    if (isAway) return g.awayScore > g.homeScore
    return false
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/teams"
          className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Teams
        </Link>

        {/* Team Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Team Logo */}
            <div className="flex-shrink-0">
              {team.logo && typeof team.logo === 'object' && team.logo.url ? (
                <Image
                  src={team.logo.url}
                  alt={`${team.name} logo`}
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-30 h-30 rounded-full flex items-center justify-center text-white font-bold text-4xl"
                  style={{ backgroundColor: team.primaryColor || '#934F25' }}
                >
                  {team.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Team Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-amber-900 mb-2">{team.name}</h1>
              <p className="text-xl text-amber-700 mb-4">{team.city}, {team.province}</p>
              
              {/* Team Colors */}
              <div className="flex justify-center md:justify-start space-x-3 mb-4">
                {team.primaryColor && (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: team.primaryColor }}
                    />
                    <span className="text-sm text-amber-700">{team.primaryColor}</span>
                  </div>
                )}
                {team.secondaryColor && (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: team.secondaryColor }}
                    />
                    <span className="text-sm text-amber-700">{team.secondaryColor}</span>
                  </div>
                )}
              </div>

              {/* Team Stats */}
              <div className="flex justify-center md:justify-start space-x-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-amber-900">{totalPlayers}</div>
                  <div className="text-sm text-amber-700">Total Players</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-900">{completedGames}</div>
                  <div className="text-sm text-amber-700">Games Played</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-900">{wins}</div>
                  <div className="text-sm text-amber-700">Wins</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Team Captain</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Name</label>
              <p className="text-amber-900">{team.captain.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Email</label>
              <p className="text-amber-900">{team.captain.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Phone</label>
              <p className="text-amber-900">{team.captain.phone}</p>
            </div>
          </div>
        </div>

        {/* Team Roster */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Team Roster</h2>
          
          {/* Goalies */}
          {goalies.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Goalies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goalies.map((player) => (
                  <div key={player.id} className="border rounded-lg p-4 bg-amber-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center font-bold text-amber-900">
                        {player.jerseyNumber}
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-900">{player.displayName}</h4>
                        <p className="text-sm text-amber-700 capitalize">
                          {player.handedness} • {player.primaryPosition}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Runners by Position */}
          {Object.entries(runnersByPosition).map(([position, positionPlayers]) => (
            <div key={position} className="mb-8">
              <h3 className="text-lg font-semibold text-amber-800 mb-4 capitalize">
                {position} ({positionPlayers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {positionPlayers.map((player) => (
                  <div key={player.id} className="border rounded-lg p-4 hover:bg-amber-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center font-bold text-amber-900">
                        {player.jerseyNumber}
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-900">{player.displayName}</h4>
                        <p className="text-sm text-amber-700 capitalize">
                          {player.handedness}
                          {player.secondaryPosition && ` • ${player.secondaryPosition}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Team Schedule */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Team Schedule</h2>
          
          {games.length > 0 ? (
            <div className="space-y-4">
              {games.map((game) => {
                const isHome = typeof game.homeTeam === 'object' && game.homeTeam.id === team.id
                const opponent = isHome ? game.awayTeam : game.homeTeam
                const opponentName = typeof opponent === 'object' ? opponent.name : 'TBD'
                
                return (
                  <div key={game.id} className="border rounded-lg p-4 hover:bg-amber-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-amber-700">
                          Game {game.gameNumber}
                        </div>
                        <div className="font-semibold text-amber-900">
                          {isHome ? 'vs' : '@'} {opponentName}
                        </div>
                        <div className="text-sm px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                          {game.gameType === 'pool' ? 'Pool Play' : 'Medal Game'}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2 md:mt-0">
                        <div className="text-sm text-amber-700">
                          {new Date(game.scheduledTime).toLocaleDateString()} at{' '}
                          {new Date(game.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        
                        {game.status === 'final' && (
                          <div className="font-semibold text-amber-900">
                            {isHome ? `${game.homeScore} - ${game.awayScore}` : `${game.awayScore} - ${game.homeScore}`}
                          </div>
                        )}
                        
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          game.status === 'live' ? 'bg-red-100 text-red-800' :
                          game.status === 'final' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {game.status === 'live' ? 'Live' : 
                           game.status === 'final' ? 'Final' : 
                           'Scheduled'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-amber-700 text-center py-8">
              No games scheduled yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}