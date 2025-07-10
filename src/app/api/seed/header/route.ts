/**
 * @description API route for seeding header global data
 * @dependencies seedHeader functions
 * @notes GET /api/seed/header to seed the header with tournament data
 */

import { NextRequest, NextResponse } from 'next/server'
import { seedHeader, seedHeaderPreTournament, seedHeaderLive } from '@/seed-data/seed-header'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phase = searchParams.get('phase') || 'default'
    
    console.log(`🌱 Seeding header for phase: ${phase}`)
    
    let result
    
    switch (phase) {
      case 'pre-tournament':
        result = await seedHeaderPreTournament()
        break
      case 'live':
        result = await seedHeaderLive()
        break
      case 'default':
      default:
        result = await seedHeader()
        break
    }
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Header seeded successfully for phase: ${phase}`,
        data: result
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to seed header',
        error: result.error
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Error in header seeding API:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phase = 'default' } = body
    
    console.log(`🌱 POST: Seeding header for phase: ${phase}`)
    
    let result
    
    switch (phase) {
      case 'pre-tournament':
        result = await seedHeaderPreTournament()
        break
      case 'live':
        result = await seedHeaderLive()
        break
      case 'default':
      default:
        result = await seedHeader()
        break
    }
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Header seeded successfully for phase: ${phase}`,
        data: result
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to seed header',
        error: result.error
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Error in header seeding API:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}