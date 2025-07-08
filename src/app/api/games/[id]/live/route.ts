/**
 * @description Real-time game updates endpoint using Server-Sent Events
 * @dependencies payload, NextResponse for game data streaming
 * @performance Uses SSE with 1-second intervals for real-time updates
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

interface GameUpdateData {
  id: string
  gameNumber: string
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  homeScore: number
  awayScore: number
  currentPeriod: 0 | 1 | 2 | 3 | 'OT1' | 'OT2'
  periodTimeRemaining: number
  homeTeam: {
    id: string
    name: string
    logo?: string
  }
  awayTeam: {
    id: string
    name: string
    logo?: string
  }
  homeCurrentGoalie?: {
    id: string
    firstName: string
    lastName: string
    jerseyNumber: number
  }
  awayCurrentGoalie?: {
    id: string
    firstName: string
    lastName: string
    jerseyNumber: number
  }
  gamePoints: { home: number; away: number }
  periodPoints: {
    period1: { home: number; away: number }
    period2: { home: number; away: number }
    period3: { home: number; away: number }
  }
  lastUpdated: string
}

// Store active SSE connections
const activeConnections = new Set<ReadableStreamDefaultController>()

// Helper function to broadcast updates to all connected clients
export function broadcastGameUpdate(gameId: string, data: GameUpdateData) {
  const message = `data: ${JSON.stringify(data)}\n\n`
  
  activeConnections.forEach(controller => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
      // Remove failed connections
      activeConnections.delete(controller)
    }
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const resolvedParams = await params
  const gameId = resolvedParams.id
  
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Verify game exists
    const game = await payload.findByID({
      collection: 'games',
      id: gameId,
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        activeConnections.add(controller)
        
        // Send initial game data
        const sendInitialData = async () => {
          try {
            const currentGame = await payload.findByID({
              collection: 'games',
              id: gameId,
              depth: 2,
            })

            const gameData: GameUpdateData = {
              id: currentGame.id,
              gameNumber: currentGame.gameNumber,
              status: currentGame.status,
              homeScore: currentGame.homeScore || 0,
              awayScore: currentGame.awayScore || 0,
              currentPeriod: currentGame.currentPeriod || 0,
              periodTimeRemaining: currentGame.periodTimeRemaining || 0,
              homeTeam: {
                id: currentGame.homeTeam.id,
                name: currentGame.homeTeam.name,
                logo: currentGame.homeTeam.logo?.url || undefined,
              },
              awayTeam: {
                id: currentGame.awayTeam.id,
                name: currentGame.awayTeam.name,
                logo: currentGame.awayTeam.logo?.url || undefined,
              },
              homeCurrentGoalie: currentGame.homeCurrentGoalie ? {
                id: currentGame.homeCurrentGoalie.id,
                firstName: currentGame.homeCurrentGoalie.firstName,
                lastName: currentGame.homeCurrentGoalie.lastName,
                jerseyNumber: currentGame.homeCurrentGoalie.jerseyNumber,
              } : undefined,
              awayCurrentGoalie: currentGame.awayCurrentGoalie ? {
                id: currentGame.awayCurrentGoalie.id,
                firstName: currentGame.awayCurrentGoalie.firstName,
                lastName: currentGame.awayCurrentGoalie.lastName,
                jerseyNumber: currentGame.awayCurrentGoalie.jerseyNumber,
              } : undefined,
              gamePoints: currentGame.gamePoints || { home: 0, away: 0 },
              periodPoints: currentGame.periodPoints || {
                period1: { home: 0, away: 0 },
                period2: { home: 0, away: 0 },
                period3: { home: 0, away: 0 },
              },
              lastUpdated: new Date().toISOString(),
            }

            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(gameData)}\n\n`))
          } catch (error) {
            console.error('Error sending initial game data:', error)
            controller.error(error)
          }
        }

        sendInitialData()

        // Set up periodic updates (every 1 second for live games)
        const interval = setInterval(async () => {
          try {
            const currentGame = await payload.findByID({
              collection: 'games',
              id: gameId,
              depth: 2,
            })

            // Only send updates for live games
            if (currentGame.status === 'live') {
              const gameData: GameUpdateData = {
                id: currentGame.id,
                gameNumber: currentGame.gameNumber,
                status: currentGame.status,
                homeScore: currentGame.homeScore || 0,
                awayScore: currentGame.awayScore || 0,
                currentPeriod: currentGame.currentPeriod || 0,
                periodTimeRemaining: currentGame.periodTimeRemaining || 0,
                homeTeam: {
                  id: currentGame.homeTeam.id,
                  name: currentGame.homeTeam.name,
                  logo: currentGame.homeTeam.logo?.url || undefined,
                },
                awayTeam: {
                  id: currentGame.awayTeam.id,
                  name: currentGame.awayTeam.name,
                  logo: currentGame.awayTeam.logo?.url || undefined,
                },
                homeCurrentGoalie: currentGame.homeCurrentGoalie ? {
                  id: currentGame.homeCurrentGoalie.id,
                  firstName: currentGame.homeCurrentGoalie.firstName,
                  lastName: currentGame.homeCurrentGoalie.lastName,
                  jerseyNumber: currentGame.homeCurrentGoalie.jerseyNumber,
                } : undefined,
                awayCurrentGoalie: currentGame.awayCurrentGoalie ? {
                  id: currentGame.awayCurrentGoalie.id,
                  firstName: currentGame.awayCurrentGoalie.firstName,
                  lastName: currentGame.awayCurrentGoalie.lastName,
                  jerseyNumber: currentGame.awayCurrentGoalie.jerseyNumber,
                } : undefined,
                gamePoints: currentGame.gamePoints || { home: 0, away: 0 },
                periodPoints: currentGame.periodPoints || {
                  period1: { home: 0, away: 0 },
                  period2: { home: 0, away: 0 },
                  period3: { home: 0, away: 0 },
                },
                lastUpdated: new Date().toISOString(),
              }

              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(gameData)}\n\n`))
            }
          } catch (error) {
            console.error('Error in periodic update:', error)
          }
        }, 1000) // Update every second

        // Send keep-alive ping every 30 seconds
        const keepAlive = setInterval(() => {
          try {
            controller.enqueue(new TextEncoder().encode(': keepalive\n\n'))
          } catch (error) {
            clearInterval(keepAlive)
          }
        }, 30000)

        // Cleanup on connection close
        return () => {
          clearInterval(interval)
          clearInterval(keepAlive)
          activeConnections.delete(controller)
        }
      },
      cancel() {
        // Connection closed by client
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    })
  } catch (error) {
    console.error('Error in live game endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}