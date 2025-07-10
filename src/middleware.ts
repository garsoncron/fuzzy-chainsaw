import { NextRequest, NextResponse } from 'next/server'
import { getSecurityHeaders, rateLimit, rateLimitConfigs, csrfProtection } from '@/utilities/security'

/**
 * @description Next.js middleware for security, rate limiting, and authentication
 * @dependencies Security utilities, Next.js middleware
 * @security Applies security headers, rate limiting, and CSRF protection
 */

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Create response with security headers
  const response = NextResponse.next()
  
  // Apply security headers to all responses
  const securityHeaders = getSecurityHeaders()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Rate limiting for different endpoint categories
  let rateLimitResponse = null
  
  if (pathname.startsWith('/api/auth/') && !pathname.includes('first-register')) {
    // Authentication endpoints - very restrictive (but allow first user creation)
    rateLimitResponse = await rateLimit(rateLimitConfigs.auth)(req)
  } else if (pathname.startsWith('/api/admin/')) {
    // Admin endpoints - moderate limits
    rateLimitResponse = await rateLimit(rateLimitConfigs.admin)(req)
  } else if (pathname.startsWith('/api/games/') && pathname.includes('/goal')) {
    // Scoring endpoints - higher limits for live games
    rateLimitResponse = await rateLimit(rateLimitConfigs.scoring)(req)
  } else if (pathname.startsWith('/api/') && !pathname.startsWith('/api/users/') && !pathname.startsWith('/api/access/') && !pathname.startsWith('/api/graphql')) {
    // Public API endpoints - more restrictive (excluding Payload core endpoints)
    rateLimitResponse = await rateLimit(rateLimitConfigs.public)(req)
  }
  
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  
  // CSRF protection for state-changing operations
  const isStateMutatingRequest = req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS'
  const isAPIRequest = pathname.startsWith('/api/')
  const isProtectedEndpoint = !pathname.startsWith('/api/users/first-register') && 
                             !pathname.startsWith('/api/users/login') && 
                             !pathname.startsWith('/api/users/logout') &&
                             !pathname.startsWith('/api/csrf') && // Exclude CSRF token endpoint
                             !pathname.startsWith('/api/games/') && // Exclude games endpoints from CSRF (they handle auth internally)
                             !pathname.startsWith('/api/graphql') && // Exclude GraphQL introspection
                             !pathname.startsWith('/api/globals/') && // Exclude Payload globals - Payload has its own CSRF protection
                             !pathname.startsWith('/api/payload-preferences/') && // Exclude Payload preferences - Payload has its own CSRF protection
                             !pathname.startsWith('/api/collections/') // Exclude Payload collections - Payload has its own CSRF protection
  
  if (isStateMutatingRequest && isAPIRequest && isProtectedEndpoint) {
    const csrfResponse = await csrfProtection(req)
    if (csrfResponse) {
      return csrfResponse
    }
  }
  
  // Session validation for protected routes (excluding Payload admin routes)
  if (pathname.startsWith('/scorekeeper')) {
    const authCookie = req.cookies.get('payload-token')
    
    if (!authCookie) {
      // Redirect to admin login for scorekeeper routes
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // TODO: Add session expiry validation for scorekeepers
  }
  
  // Let Payload handle its own /admin authentication
  
  // Add additional headers for API responses
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-API-Version', '1.0')
    response.headers.set('X-Powered-By', 'Cowtown Showdown Tournament System')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}