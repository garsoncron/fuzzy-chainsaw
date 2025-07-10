/**
 * @description Seed script for populating Cowtown Showdown header global data
 * @dependencies payload, headerSeedData
 * @notes Run this script to populate the header global with realistic tournament data
 */

import { getPayload } from 'payload'
import config from '@/payload.config'
import { headerSeedData } from './header'

export async function seedHeader() {
  const payload = await getPayload({ config })
  
  try {
    console.log('🌱 Seeding header global data...')
    
    // First, let's find the uploaded logo in the media collection
    const logoMedia = await payload.find({
      collection: 'media',
      where: {
        or: [
          {
            filename: {
              contains: 'cowtown-logo'
            }
          },
          {
            filename: {
              contains: 'naked-logo'
            }
          }
        ]
      },
      limit: 1
    })
    
    let logoId = null
    if (logoMedia.docs.length > 0) {
      logoId = logoMedia.docs[0].id
      console.log(`✅ Found logo: ${logoMedia.docs[0].filename}`)
    } else {
      console.log('⚠️  No logo found in media collection')
    }
    
    // Update the header global with seed data
    const headerData = {
      ...headerSeedData,
      logo: logoId, // Reference to the uploaded logo
    }
    
    // Update or create the header global
    await payload.updateGlobal({
      slug: 'header',
      data: headerData
    })
    
    console.log('✅ Header global seeded successfully!')
    console.log('📋 Seeded data includes:')
    console.log(`   - Logo: ${logoId ? 'Connected' : 'Not connected'}`)
    console.log(`   - Navigation columns: ${headerData.headerColumns.length}`)
    console.log(`   - CTA: ${headerData.cta?.ctaText || 'Not set'}`)
    
    // Log the navigation structure
    headerData.headerColumns.forEach((column, index) => {
      console.log(`   - Column ${index + 1}: ${column.title.title} (${column.subMenuItems?.length || 0} sub-items)`)
    })
    
    return {
      success: true,
      logoConnected: !!logoId,
      columnsSeeded: headerData.headerColumns.length
    }
    
  } catch (error) {
    console.error('❌ Error seeding header:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Alternative seed functions for different tournament phases
export async function seedHeaderPreTournament() {
  const payload = await getPayload({ config })
  
  try {
    console.log('🌱 Seeding pre-tournament header...')
    
    const logoMedia = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: 'cowtown-logo'
        }
      },
      limit: 1
    })
    
    await payload.updateGlobal({
      slug: 'header',
      data: {
        ...headerSeedData,
        logo: logoMedia.docs[0]?.id || null,
        cta: {
          ctaText: 'Register Team',
          link: {
            type: 'custom',
            url: '/contact'
          }
        }
      }
    })
    
    console.log('✅ Pre-tournament header seeded!')
    return { success: true }
    
  } catch (error) {
    console.error('❌ Error seeding pre-tournament header:', error)
    return { success: false, error: error.message }
  }
}

export async function seedHeaderLive() {
  const payload = await getPayload({ config })
  
  try {
    console.log('🌱 Seeding live tournament header...')
    
    const logoMedia = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: 'cowtown-logo'
        }
      },
      limit: 1
    })
    
    await payload.updateGlobal({
      slug: 'header',
      data: {
        ...headerSeedData,
        logo: logoMedia.docs[0]?.id || null,
        cta: {
          ctaText: 'Watch Live',
          link: {
            type: 'custom',
            url: '/games/live'
          }
        }
      }
    })
    
    console.log('✅ Live tournament header seeded!')
    return { success: true }
    
  } catch (error) {
    console.error('❌ Error seeding live tournament header:', error)
    return { success: false, error: error.message }
  }
}

// Export for use in API routes or other scripts
export { headerSeedData }