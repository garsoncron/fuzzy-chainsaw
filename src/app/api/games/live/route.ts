/**
 * @description SSE endpoint for live game updates
 * @dependencies Payload CMS, Next.js App Router
 * @accessibility N/A (API endpoint)
 * @performance Optimized for 500-900 concurrent connections
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Store active connections for broadcasting
const connections = new Set<ReadableStreamDefaultController>()

// Cleanup interval to remove closed connections
setInterval(() => {
  const toRemove: ReadableStreamDefaultController[] = []
  
  connections.forEach(controller => {
    try {
      // Test if connection is still active
      controller.enqueue('data: ping\n\n')
    } catch (error) {
      toRemove.push(controller)
    }
  })
  
  toRemove.forEach(controller => connections.delete(controller))
}, 30000) // Clean up every 30 seconds

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const gameId = searchParams.get('gameId')
  
  // Create SSE stream
  let streamController: ReadableStreamDefaultController
  
  const stream = new ReadableStream({
    start(controller) {
      streamController = controller
      connections.add(controller)
      
      // Send initial connection message
      controller.enqueue('data: {"type":"connected","timestamp":"' + new Date().toISOString() + '"}\n\n')
      
      // Send initial game data if gameId provided
      if (gameId) {
        getInitialGameData(gameId).then(data => {
          controller.enqueue(`data: ${JSON.stringify({
            type: 'initial',
            game: data,
            timestamp: new Date().toISOString()
          })}\n\n`)
        }).catch(error => {
          controller.enqueue(`data: ${JSON.stringify({
            type: 'error',
            message: 'Failed to load initial game data',
            timestamp: new Date().toISOString()
          })}\n\n`)
        })
      }
    },
    
    cancel() {
      if (streamController) {
        connections.delete(streamController)
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}

async function getInitialGameData(gameId: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const game = await payload.findByID({
      collection: 'games',
      id: gameId,
      depth: 2, // Include team relationships
    })
    
    return game
  } catch (error) {
    console.error('Error fetching initial game data:', error)
    throw error
  }
}

// Broadcast function to send updates to all connected clients
export async function broadcastGameUpdate(gameId: string, updateData: any) {
  const message = JSON.stringify({
    type: 'game_update',
    gameId,
    data: updateData,
    timestamp: new Date().toISOString()
  })
  
  const toRemove: ReadableStreamDefaultController[] = []
  
  connections.forEach(controller => {
    try {
      controller.enqueue(`data: ${message}\n\n`)
    } catch (error) {
      toRemove.push(controller)
    }
  })
  
  // Remove failed connections
  toRemove.forEach(controller => connections.delete(controller))
}

// Broadcast scoreboard updates
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
    
    const message = JSON.stringify({
      type: 'scoreboard_update',
      games: games.docs,
      timestamp: new Date().toISOString()
    })
    
    const toRemove: ReadableStreamDefaultController[] = []
    
    connections.forEach(controller => {
      try {
        controller.enqueue(`data: ${message}\n\n`)
      } catch (error) {
        toRemove.push(controller)
      }
    })
    
    // Remove failed connections
    toRemove.forEach(controller => connections.delete(controller))
    
    console.log(`Broadcasted scoreboard update to ${connections.size} clients`)
  } catch (error) {
    console.error('Error broadcasting scoreboard update:', error)
  }
}