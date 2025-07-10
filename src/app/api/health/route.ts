/**
 * @description Health check endpoint for monitoring and deployment verification
 * @dependencies None - lightweight health check
 * @performance Optimized for fast response times
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check - can be expanded with database connectivity tests
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      server: {
        url: process.env.NEXT_PUBLIC_SERVER_URL || 'localhost:3000',
        node_version: process.version,
      },
      checks: {
        server: 'healthy',
        // TODO: Add database health check
        // database: await checkDatabaseHealth(),
        // TODO: Add external service checks if applicable
        // external_services: await checkExternalServices(),
      }
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

// Optional: Add database health check function
// async function checkDatabaseHealth() {
//   try {
//     const payload = await getPayload({ config: configPromise })
//     // Simple query to verify database connectivity
//     await payload.find({ collection: 'users', limit: 1 })
//     return 'healthy'
//   } catch (error) {
//     console.error('Database health check failed:', error)
//     return 'unhealthy'
//   }
// }