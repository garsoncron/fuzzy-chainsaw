#!/usr/bin/env node

import { getPayload, createLocalReq } from 'payload'
import config from '@payload-config'
import { seedTournamentOnly } from '@/endpoints/seed/tournament-only'

async function main() {
  console.log('🏆 Starting tournament data seeding...')
  
  try {
    const payload = await getPayload({ config })
    
    // Create a mock user for seeding
    const mockUser = { id: 'seed-user', collection: 'users' }
    const req = await createLocalReq({ user: mockUser }, payload)
    
    await seedTournamentOnly({ payload, req })
    
    console.log('✅ Tournament seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding tournament data:', error)
    process.exit(1)
  }
}

main()