/**
 * @description Utility functions for real-time game updates via SSE
 * @dependencies payload CMS for game data access
 * @performance Optimized connection management for 500-900 concurrent users
 */

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

// Store active SSE connections globally
const activeConnections = new Set<ReadableStreamDefaultController>()

/**
 * Helper function to broadcast game updates to all connected clients
 */
export function broadcastGameUpdate(gameId: string, data: GameUpdateData | Record<string, unknown>) {
  const message = `data: ${JSON.stringify({
    type: 'game_update',
    gameId,
    data,
    timestamp: new Date().toISOString()
  })}\n\n`
  
  const toRemove: ReadableStreamDefaultController[] = []
  
  activeConnections.forEach(controller => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch (_error) {
      // Mark failed connections for removal
      toRemove.push(controller)
    }
  })
  
  // Remove failed connections
  toRemove.forEach(controller => activeConnections.delete(controller))
}

/**
 * Broadcast scoreboard updates to all connected clients
 */
export async function broadcastScoreboardUpdate() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Get all games with their teams
    const games = await payload.find({
      collection: 'games',
      depth: 2,
      limit: 100,
      sort: 'scheduledTime',
      where: {
        or: [
          { status: { equals: 'live' } },
          { status: { equals: 'overtime' } },
          { status: { equals: 'scheduled' } },
          {
            and: [
              { status: { equals: 'final' } },
              {
                scheduledTime: {
                  greater_than: new Date(Date.now() - 6 * 60 * 60 * 1000) // Last 6 hours
                }
              }
            ]
          }
        ]
      }
    })
    
    const message = `data: ${JSON.stringify({
      type: 'scoreboard_update',
      games: games.docs,
      timestamp: new Date().toISOString()
    })}\n\n`
    
    const toRemove: ReadableStreamDefaultController[] = []
    
    activeConnections.forEach(controller => {
      try {
        controller.enqueue(new TextEncoder().encode(message))
      } catch (_error) {
        toRemove.push(controller)
      }
    })
    
    // Remove failed connections
    toRemove.forEach(controller => activeConnections.delete(controller))
    
    console.log(`Broadcasted scoreboard update to ${activeConnections.size} clients`)
  } catch (error) {
    console.error('Error broadcasting scoreboard update:', error)
  }
}

/**
 * Add a connection to the active connections pool
 */
export function addConnection(controller: ReadableStreamDefaultController) {
  activeConnections.add(controller)
}

/**
 * Remove a connection from the active connections pool
 */
export function removeConnection(controller: ReadableStreamDefaultController) {
  activeConnections.delete(controller)
}

/**
 * Get the current number of active connections
 */
export function getConnectionCount(): number {
  return activeConnections.size
}

/**
 * Clean up dead connections periodically
 */
export function cleanupConnections() {
  const toRemove: ReadableStreamDefaultController[] = []
  
  activeConnections.forEach(controller => {
    try {
      // Test if connection is still active with a ping
      controller.enqueue(new TextEncoder().encode(': keepalive\n\n'))
    } catch (_error) {
      toRemove.push(controller)
    }
  })
  
  toRemove.forEach(controller => activeConnections.delete(controller))
  
  if (toRemove.length > 0) {
    console.log(`Cleaned up ${toRemove.length} dead connections`)
  }
}

// Set up periodic cleanup
setInterval(cleanupConnections, 30000) // Clean up every 30 seconds