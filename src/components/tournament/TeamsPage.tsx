import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Team, Player } from '@/payload-types'

interface TeamsPageProps {
  teams: Team[]
  players: Player[]
}

export function TeamsPage({ teams, players }: TeamsPageProps) {
  // Group players by team
  const playersByTeam = players.reduce((acc, player) => {
    const teamId = typeof player.team === 'string' ? player.team : player.team?.id
    if (!teamId) return acc
    
    if (!acc[teamId]) {
      acc[teamId] = []
    }
    acc[teamId].push(player)
    return acc
  }, {} as Record<string, Player[]>)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Tournament Teams
          </h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Meet the 8 teams competing in the Cowtown Showdown Senior Men's Box Lacrosse Tournament. 
            Click on any team to view their full roster and schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team) => {
            const teamPlayers = playersByTeam[team.id] || []
            const rosterCount = teamPlayers.length
            const goalies = teamPlayers.filter(p => p.playerType === 'goalie').length
            const runners = teamPlayers.filter(p => p.playerType === 'runner').length

            return (
              <Link
                key={team.id}
                href={`/teams/${team.slug}`}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Team Logo */}
                  <div className="flex justify-center mb-4">
                    {team.logo && typeof team.logo === 'object' && team.logo.url ? (
                      <Image
                        src={team.logo.url}
                        alt={`${team.name} logo`}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                        style={{ backgroundColor: team.primaryColor || '#934F25' }}
                      >
                        {team.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Team Name */}
                  <h2 className="text-xl font-bold text-center mb-2 text-amber-900 group-hover:text-amber-600 transition-colors">
                    {team.name}
                  </h2>

                  {/* Team Location */}
                  <p className="text-center text-amber-700 mb-4">
                    {team.city}, {team.province}
                  </p>

                  {/* Roster Stats */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm text-amber-600">
                      <span>Total Roster: {rosterCount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-amber-600 mt-1">
                      <span>Runners: {runners}</span>
                      <span>Goalies: {goalies}</span>
                    </div>
                  </div>

                  {/* Team Colors */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {team.primaryColor && (
                      <div
                        className="w-4 h-4 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: team.primaryColor }}
                        title={`Primary: ${team.primaryColor}`}
                      />
                    )}
                    {team.secondaryColor && (
                      <div
                        className="w-4 h-4 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: team.secondaryColor }}
                        title={`Secondary: ${team.secondaryColor}`}
                      />
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Tournament Info */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Tournament Format</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Pool Play</h3>
              <p className="text-amber-700">
                Round robin format with all teams playing each other
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">5-Point System</h3>
              <p className="text-amber-700">
                2 points for win, 1 point per period win, 0.5 for period tie
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Medal Games</h3>
              <p className="text-amber-700">
                Top teams advance to championship and bronze medal games
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}