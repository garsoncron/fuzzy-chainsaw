# Troubleshooting Guide

This guide covers common issues, debugging techniques, and solutions for the Cowtown Showdown tournament website.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Development Issues](#development-issues)
- [Database Problems](#database-problems)
- [Real-time Connection Issues](#real-time-connection-issues)
- [Authentication & Authorization](#authentication--authorization)
- [Performance Problems](#performance-problems)
- [Deployment Issues](#deployment-issues)
- [Tournament-Specific Issues](#tournament-specific-issues)
- [Monitoring & Debugging](#monitoring--debugging)
- [Emergency Procedures](#emergency-procedures)

## Quick Diagnostics

### System Health Check

```bash
# Quick health check script
#!/bin/bash
echo "🏥 Cowtown Showdown Health Check"
echo "================================"

# Application health
echo "📱 Application Status:"
curl -s http://localhost:3000/api/health | jq '.' || echo "❌ Application unreachable"

# Database connectivity
echo "🗃️ Database Status:"
docker-compose exec postgres pg_isready -U postgres || echo "❌ Database unavailable"

# Redis connectivity (if configured)
if [[ -n "$REDIS_URL" ]]; then
    echo "🔴 Redis Status:"
    docker-compose exec redis redis-cli ping || echo "❌ Redis unavailable"
fi

# Disk space
echo "💾 Disk Usage:"
df -h | grep -E "(Filesystem|/dev/)"

# Memory usage
echo "🧠 Memory Usage:"
free -h

# Container status
echo "🐳 Container Status:"
docker-compose ps
```

### Environment Validation

```bash
# Check required environment variables
required_vars=("DATABASE_URI" "PAYLOAD_SECRET" "NEXT_PUBLIC_SERVER_URL")

for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "❌ Missing required environment variable: $var"
    else
        echo "✅ $var is set"
    fi
done
```

## Development Issues

### Issue: `pnpm install` Fails

**Symptoms:**
- Package installation errors
- Dependency resolution conflicts
- Permission errors

**Solutions:**

```bash
# Clear package manager cache
pnpm store prune

# Remove node_modules and lockfile
rm -rf node_modules pnpm-lock.yaml

# Reinstall with specific Node version
nvm use 20
pnpm install

# If permission errors on macOS/Linux
sudo chown -R $(whoami) ~/.pnpm-store
```

### Issue: TypeScript Compilation Errors

**Symptoms:**
- `Type 'unknown' is not assignable to type...`
- `Property does not exist on type...`
- Import resolution errors

**Solutions:**

```bash
# Regenerate Payload types
pnpm payload generate:types

# Clear Next.js cache
rm -rf .next

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# Check tsconfig.json paths
cat tsconfig.json | grep -A 10 "paths"
```

### Issue: Hot Reloading Not Working

**Symptoms:**
- Changes don't reflect in browser
- Need to manually refresh page

**Solutions:**

```bash
# Check if using correct development command
pnpm dev  # Should use this, not pnpm start

# Clear Next.js cache
rm -rf .next

# Check file watcher limits on Linux
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Restart development server
pnpm dev
```

### Issue: Import/Export Errors

**Symptoms:**
- `Cannot find module`
- `Unexpected token 'export'`
- ESM/CommonJS conflicts

**Solutions:**

```typescript
// Use proper import syntax
import { Component } from '@/components/Component'  // ✅ Correct
import Component from '@/components/Component'      // ❌ May fail

// Check next.config.js webpack configuration
webpack: (config) => {
  config.resolve.extensionAlias = {
    '.js': ['.js', '.ts'],
    '.jsx': ['.jsx', '.tsx'],
  }
  return config
}
```

## Database Problems

### Issue: Database Connection Refused

**Symptoms:**
- `ECONNREFUSED` errors
- `password authentication failed`
- `database does not exist`

**Diagnosis:**

```bash
# Check database container status
docker-compose ps postgres

# Test connection manually
psql "$DATABASE_URI" -c "SELECT 1;"

# Check connection string format
echo $DATABASE_URI
# Should be: postgresql://user:password@host:port/database
```

**Solutions:**

```bash
# Start database container
docker-compose up -d postgres

# Wait for database to be ready
docker-compose exec postgres pg_isready -U postgres

# Reset database password
docker-compose exec postgres psql -U postgres -c "
  ALTER USER postgres PASSWORD 'newpassword';
"

# Create database if missing
docker-compose exec postgres psql -U postgres -c "
  CREATE DATABASE cowtown;
"
```

### Issue: Migration Failures

**Symptoms:**
- `Migration failed: column already exists`
- `relation does not exist`
- `syntax error in migration`

**Solutions:**

```bash
# Check migration status
pnpm payload migrate:status

# Reset migrations (DESTRUCTIVE - development only)
pnpm payload migrate:reset

# Manual migration rollback
pnpm payload migrate:down

# Create new migration
pnpm payload migrate:create add_missing_column

# Run specific migration
pnpm payload migrate:up
```

### Issue: Database Performance Issues

**Symptoms:**
- Slow query responses
- Timeouts during data fetching
- High CPU usage on database

**Diagnosis:**

```sql
-- Check for slow queries
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE schemaname = 'public' 
ORDER BY n_distinct DESC;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Solutions:**

```sql
-- Add indexes for common queries
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_goals_game_period ON goals(game, period);
CREATE INDEX idx_penalties_game_team ON penalties(game, team);

-- Analyze tables
ANALYZE;

-- Update statistics
VACUUM ANALYZE;
```

## Real-time Connection Issues

### Issue: SSE Connections Dropping

**Symptoms:**
- "Connection lost" indicators
- Scoreboards not updating
- Intermittent real-time updates

**Diagnosis:**

```bash
# Test SSE endpoint directly
curl -N -H "Accept: text/event-stream" http://localhost:3000/api/games/live

# Check connection count
lsof -i :3000 | wc -l

# Monitor connection logs
docker-compose logs -f app | grep -i "connection"
```

**Solutions:**

```typescript
// Implement connection retry logic
useEffect(() => {
  let eventSource: EventSource | null = null
  let retryCount = 0
  const maxRetries = 5
  
  const connect = () => {
    eventSource = new EventSource('/api/games/live')
    
    eventSource.onopen = () => {
      setIsConnected(true)
      retryCount = 0
    }
    
    eventSource.onerror = () => {
      setIsConnected(false)
      eventSource?.close()
      
      if (retryCount < maxRetries) {
        retryCount++
        setTimeout(connect, Math.pow(2, retryCount) * 1000) // Exponential backoff
      }
    }
  }
  
  connect()
  
  return () => {
    eventSource?.close()
  }
}, [])
```

### Issue: Memory Leaks in SSE Connections

**Symptoms:**
- Increasing memory usage over time
- Server becomes unresponsive
- Connection limits reached

**Solutions:**

```typescript
// Proper connection cleanup
const activeConnections = new Map<string, WritableStreamDefaultWriter>()

// Cleanup dead connections periodically
setInterval(() => {
  activeConnections.forEach((writer, connectionId) => {
    try {
      // Test if connection is still alive
      writer.write(new TextEncoder().encode('data: ping\n\n'))
    } catch (error) {
      // Remove dead connection
      activeConnections.delete(connectionId)
    }
  })
}, 30000) // Check every 30 seconds

// Limit concurrent connections
if (activeConnections.size >= MAX_CONNECTIONS) {
  return new Response('Too many connections', { status: 429 })
}
```

### Issue: SSE Events Not Received

**Symptoms:**
- EventSource connects but no messages
- Events sent but not received by client
- Browser shows connection as active but no updates

**Diagnosis:**

```bash
# Check server-side event broadcasting
docker-compose logs app | grep -i "broadcast"

# Test event format
curl -N -H "Accept: text/event-stream" http://localhost:3000/api/games/game123/live

# Verify nginx configuration (if using proxy)
nginx -t
```

**Solutions:**

```typescript
// Ensure proper SSE format
writer.enqueue(encoder.encode(
  `event: game-update\n` +
  `data: ${JSON.stringify(data)}\n\n`
))

// Add heartbeat/keepalive
setInterval(() => {
  if (writer) {
    writer.enqueue(encoder.encode('data: ping\n\n'))
  }
}, 30000)

// Handle connection errors
eventSource.onerror = (error) => {
  console.error('SSE Error:', error)
  // Implement reconnection logic
}
```

## Authentication & Authorization

### Issue: JWT Token Validation Errors

**Symptoms:**
- `Invalid token` errors
- Authentication required messages
- Token expiration issues

**Diagnosis:**

```bash
# Decode JWT token (for debugging)
echo "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." | base64 -d

# Check token expiration
node -e "
const jwt = require('jsonwebtoken');
const token = 'your-token-here';
try {
  const decoded = jwt.decode(token);
  console.log('Token expires:', new Date(decoded.exp * 1000));
} catch (e) {
  console.log('Invalid token:', e.message);
}
"
```

**Solutions:**

```typescript
// Implement token refresh
export async function refreshToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.PAYLOAD_SECRET!)
    
    // Generate new access token
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.PAYLOAD_SECRET!,
      { expiresIn: '1h' }
    )
    
    return newToken
  } catch (error) {
    throw new Error('Invalid refresh token')
  }
}

// Automatic token renewal
useEffect(() => {
  const interval = setInterval(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const decoded = jwt.decode(token)
      const expiresIn = decoded.exp * 1000 - Date.now()
      
      // Refresh if expiring in 5 minutes
      if (expiresIn < 5 * 60 * 1000) {
        refreshUserToken()
      }
    }
  }, 60000) // Check every minute
  
  return () => clearInterval(interval)
}, [])
```

### Issue: Permission Denied Errors

**Symptoms:**
- `Insufficient permissions` messages
- API endpoints returning 403 errors
- Scorekeeper functions not working

**Solutions:**

```typescript
// Check user roles in API middleware
export async function checkPermissions(req: NextRequest, requiredRole: string) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return { error: 'Authentication required', status: 401 }
  }
  
  try {
    const decoded = jwt.verify(token, process.env.PAYLOAD_SECRET!) as any
    
    if (!decoded.roles?.includes(requiredRole)) {
      return { error: 'Insufficient permissions', status: 403 }
    }
    
    return { user: decoded }
  } catch (error) {
    return { error: 'Invalid token', status: 401 }
  }
}

// Usage in API routes
const authResult = await checkPermissions(request, 'scorekeeper')
if (authResult.error) {
  return NextResponse.json({ error: authResult.error }, { status: authResult.status })
}
```

## Performance Problems

### Issue: Slow Page Load Times

**Symptoms:**
- Pages taking >3 seconds to load
- Poor Core Web Vitals scores
- Timeouts during peak usage

**Diagnosis:**

```bash
# Analyze bundle size
pnpm build
pnpm analyze

# Check image optimization
npm install -g imagemin-cli
imagemin src/media/* --out-dir=optimized

# Performance profiling
lighthouse http://localhost:3000 --output html --output-path ./report.html
```

**Solutions:**

```typescript
// Implement lazy loading
const StandingsTable = lazy(() => import('@/components/tournament/StandingsTable'))

export default function StandingsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StandingsTable />
    </Suspense>
  )
}

// Optimize images
import Image from 'next/image'

export const TeamLogo = ({ team }) => (
  <Image
    src={team.logo.url}
    alt={`${team.name} logo`}
    width={48}
    height={48}
    priority={false} // Don't prioritize below-fold images
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
  />
)

// Implement caching
export async function generateStaticParams() {
  const teams = await payload.find({ 
    collection: 'teams',
    select: { slug: true }
  })
  
  return teams.docs.map(team => ({
    slug: team.slug,
  }))
}
```

### Issue: Database Query Performance

**Symptoms:**
- Slow API responses
- Database CPU spikes
- Query timeouts

**Solutions:**

```typescript
// Optimize Payload queries
const games = await payload.find({
  collection: 'games',
  where: {
    status: { equals: 'live' }
  },
  depth: 1, // Limit depth to reduce joins
  limit: 50, // Limit results
  select: {
    id: true,
    gameNumber: true,
    homeScore: true,
    awayScore: true,
    status: true,
    // Only select needed fields
  }
})

// Implement query caching
import { CacheService } from '@/lib/cache'

export async function getStandings() {
  const cached = await CacheService.getStandings()
  if (cached) return cached
  
  const standings = await calculateStandings()
  await CacheService.setStandings(standings)
  
  return standings
}
```

### Issue: Memory Usage Growing

**Symptoms:**
- Node.js process consuming excessive memory
- Out of memory errors
- Container restarts

**Diagnosis:**

```bash
# Monitor memory usage
docker stats

# Check for memory leaks in Node.js
node --inspect=0.0.0.0:9229 server.js
# Use Chrome DevTools Memory tab

# Analyze heap dump
npm install -g heapdump
# Add to your code: require('heapdump').writeSnapshot();
```

**Solutions:**

```typescript
// Proper cleanup of event listeners
useEffect(() => {
  const handleResize = () => { /* ... */ }
  
  window.addEventListener('resize', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])

// Clear intervals and timeouts
useEffect(() => {
  const interval = setInterval(() => { /* ... */ }, 1000)
  
  return () => {
    clearInterval(interval)
  }
}, [])

// Implement connection limits
const MAX_SSE_CONNECTIONS = 1000
const activeConnections = new Set()

if (activeConnections.size >= MAX_SSE_CONNECTIONS) {
  return new Response('Connection limit exceeded', { status: 429 })
}
```

## Deployment Issues

### Issue: Docker Build Failures

**Symptoms:**
- Build process hangs or fails
- `ENOSPC: no space left on device`
- Package installation errors in container

**Solutions:**

```bash
# Clean Docker system
docker system prune -a

# Increase Docker memory/disk
# Docker Desktop: Settings > Resources

# Use .dockerignore
echo "node_modules
.next
.git
*.log" > .dockerignore

# Multi-stage build optimization
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
```

### Issue: Environment Variables Not Loading

**Symptoms:**
- `undefined` values for environment variables
- Configuration errors in production
- Database connection failures

**Solutions:**

```bash
# Check if .env file is being copied in Docker
COPY .env.production .env

# Use docker-compose environment section
services:
  app:
    environment:
      - DATABASE_URI=${DATABASE_URI}
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}

# Validate environment in container
docker-compose exec app env | grep -E "(DATABASE|PAYLOAD)"
```

### Issue: SSL/HTTPS Configuration Problems

**Symptoms:**
- Certificate errors
- Mixed content warnings
- Insecure connection warnings

**Solutions:**

```nginx
# nginx SSL configuration
server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!SHA1:!WEAK;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

## Tournament-Specific Issues

### Issue: Score Updates Not Syncing

**Symptoms:**
- Scoreboards showing different scores
- Goals recorded but not displayed
- Real-time updates delayed

**Diagnosis:**

```typescript
// Debug scoring workflow
export async function debugGoalRecording(gameId: string, goalData: any) {
  console.log('🥅 Recording goal:', { gameId, goalData })
  
  try {
    // Check game exists
    const game = await payload.findByID({ collection: 'games', id: gameId })
    console.log('🎮 Game found:', game.gameNumber)
    
    // Check player belongs to team
    const player = await payload.findByID({ collection: 'players', id: goalData.scorerId })
    console.log('👤 Player found:', player.firstName, player.lastName)
    
    // Verify team assignment
    const isValidTeam = (goalData.team === 'home' && player.team === game.homeTeam) ||
                       (goalData.team === 'away' && player.team === game.awayTeam)
    
    if (!isValidTeam) {
      throw new Error(`Player ${player.firstName} ${player.lastName} is not on the ${goalData.team} team`)
    }
    
    // Record goal
    const goal = await payload.create({ collection: 'goals', data: goalData })
    console.log('✅ Goal created:', goal.id)
    
    // Update game score
    const updatedGame = await payload.update({
      collection: 'games',
      id: gameId,
      data: {
        [`${goalData.team}Score`]: game[`${goalData.team}Score`] + 1
      }
    })
    
    console.log('📊 Score updated:', updatedGame.homeScore, '-', updatedGame.awayScore)
    
    return { goal, game: updatedGame }
  } catch (error) {
    console.error('❌ Goal recording failed:', error)
    throw error
  }
}
```

**Solutions:**

```typescript
// Implement optimistic updates with rollback
const [gameState, setGameState] = useState(initialGame)

const recordGoal = async (goalData) => {
  // Optimistic update
  setGameState(prev => ({
    ...prev,
    [`${goalData.team}Score`]: prev[`${goalData.team}Score`] + 1
  }))
  
  try {
    const result = await fetch(`/api/games/${gameId}/goal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData)
    })
    
    if (!result.ok) {
      throw new Error('Failed to record goal')
    }
    
    const { game } = await result.json()
    setGameState(game) // Confirm with server data
    
  } catch (error) {
    // Rollback optimistic update
    setGameState(initialGame)
    showError('Failed to record goal: ' + error.message)
  }
}
```

### Issue: Tournament Points Calculation Errors

**Symptoms:**
- Incorrect standings
- Point totals don't match expected 5-point system
- Tiebreaker logic not working

**Solutions:**

```typescript
// Comprehensive tournament points calculation
export function calculateTournamentPoints(game: Game) {
  const points = { home: 0, away: 0 }
  
  // Period points (1 point for win, 0.5 for tie, 0 for loss)
  for (let period = 1; period <= 3; period++) {
    const homeGoals = game.goals.filter(g => 
      g.team === 'home' && g.period === period
    ).length
    
    const awayGoals = game.goals.filter(g => 
      g.team === 'away' && g.period === period
    ).length
    
    if (homeGoals > awayGoals) {
      points.home += 1
    } else if (awayGoals > homeGoals) {
      points.away += 1
    } else {
      points.home += 0.5
      points.away += 0.5
    }
  }
  
  // Game outcome points (2 for win, 1 for tie, 0 for loss)
  if (game.homeScore > game.awayScore) {
    points.home += 2
  } else if (game.awayScore > game.homeScore) {
    points.away += 2
  } else {
    points.home += 1
    points.away += 1
  }
  
  // Validate total doesn't exceed 5 points
  if (points.home > 5 || points.away > 5) {
    console.warn('Invalid point calculation:', points)
  }
  
  return points
}

// Test calculation with known game
const testGame = {
  homeScore: 8,
  awayScore: 5,
  goals: [
    // Period 1: Home 3, Away 2 (home wins period)
    { team: 'home', period: 1 },
    { team: 'home', period: 1 },
    { team: 'home', period: 1 },
    { team: 'away', period: 1 },
    { team: 'away', period: 1 },
    // Add remaining goals...
  ]
}

console.log('Points:', calculateTournamentPoints(testGame))
// Should be: { home: 4.5, away: 0.5 } or similar valid combination
```

### Issue: Scorekeeper Interface Not Responsive

**Symptoms:**
- Buttons too small on mobile
- Interface elements overlapping
- Difficulty using on tablets

**Solutions:**

```css
/* Ensure minimum touch target sizes */
.stat-button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* Responsive grid for scorekeeper interface */
.scoring-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
}

/* Large, easy-to-tap buttons */
.quick-stat-button {
  font-size: 1.2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-stat-button:hover {
  transform: scale(1.05);
  background: var(--primary-dark);
}
```

## Monitoring & Debugging

### Debug Mode Setup

```typescript
// src/lib/debug.ts
export const DEBUG = process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true'

export function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(`🐛 [DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  }
}

export function debugTime(label: string) {
  if (DEBUG) {
    console.time(label)
  }
}

export function debugTimeEnd(label: string) {
  if (DEBUG) {
    console.timeEnd(label)
  }
}

// Usage in components
useEffect(() => {
  debugLog('Component mounted', { gameId, status })
}, [])
```

### Performance Monitoring

```typescript
// src/lib/performance.ts
export class PerformanceMonitor {
  static measureApiCall(endpoint: string, operation: () => Promise<any>) {
    const start = performance.now()
    
    return operation()
      .then(result => {
        const duration = performance.now() - start
        console.log(`⏱️ API ${endpoint}: ${duration.toFixed(2)}ms`)
        
        if (duration > 1000) {
          console.warn(`🐌 Slow API call: ${endpoint}`)
        }
        
        return result
      })
      .catch(error => {
        const duration = performance.now() - start
        console.error(`❌ API ${endpoint} failed after ${duration.toFixed(2)}ms:`, error)
        throw error
      })
  }
  
  static measureComponent(name: string, renderFn: () => JSX.Element) {
    const start = performance.now()
    const result = renderFn()
    const duration = performance.now() - start
    
    if (duration > 16) { // > 1 frame at 60fps
      console.warn(`🐌 Slow render: ${name} took ${duration.toFixed(2)}ms`)
    }
    
    return result
  }
}

// Usage
const gameData = await PerformanceMonitor.measureApiCall(
  'GET /api/games/123',
  () => fetch('/api/games/123').then(r => r.json())
)
```

### Error Tracking

```typescript
// src/lib/error-tracking.ts
export class ErrorTracker {
  static reportError(error: Error, context?: any) {
    console.error('🚨 Error occurred:', error)
    
    if (context) {
      console.error('Context:', context)
    }
    
    // Send to external service in production
    if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: context,
      })
    }
  }
  
  static reportPerformanceIssue(metric: string, value: number, threshold: number) {
    if (value > threshold) {
      console.warn(`⚠️ Performance issue: ${metric} = ${value} (threshold: ${threshold})`)
      
      // Report to monitoring service
      if (process.env.NODE_ENV === 'production') {
        // Send metric to monitoring service
      }
    }
  }
}

// Global error boundary
export class GlobalErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorTracker.reportError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    })
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>The tournament interface encountered an error. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

## Emergency Procedures

### Tournament Day Emergency Response

#### 1. Total System Failure

```bash
#!/bin/bash
# emergency-restore.sh

echo "🚨 EMERGENCY SYSTEM RESTORE PROCEDURE"
echo "====================================="

# 1. Stop all services
docker-compose down

# 2. Restore from latest backup
LATEST_BACKUP=$(ls -t /backups/db_*.sql.gz | head -1)
echo "Restoring from: $LATEST_BACKUP"

# 3. Start database only
docker-compose up -d postgres

# 4. Wait for database
sleep 10

# 5. Restore database
gunzip -c "$LATEST_BACKUP" | psql "$DATABASE_URI"

# 6. Start application
docker-compose up -d app

# 7. Verify restoration
curl -f http://localhost:3000/api/health || echo "❌ Restore failed"

echo "✅ Emergency restore completed"
```

#### 2. Scorekeeper Interface Down

```typescript
// Fallback manual scoring interface
export const EmergencyScoring = ({ gameId }) => {
  const [scores, setScores] = useState({ home: 0, away: 0 })
  
  const recordScore = async (team: 'home' | 'away') => {
    // Direct database update if API is down
    try {
      const response = await fetch('/api/emergency/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          team,
          type: 'goal',
          timestamp: new Date().toISOString(),
        }),
      })
      
      if (response.ok) {
        setScores(prev => ({
          ...prev,
          [team]: prev[team] + 1
        }))
      }
    } catch (error) {
      // Fallback: local storage
      const emergencyData = JSON.parse(
        localStorage.getItem('emergencyScoring') || '{}'
      )
      
      emergencyData[gameId] = {
        ...emergencyData[gameId],
        scores,
        lastUpdate: Date.now(),
      }
      
      localStorage.setItem('emergencyScoring', JSON.stringify(emergencyData))
    }
  }
  
  return (
    <div className="emergency-scoring">
      <h2>🚨 Emergency Scoring Mode</h2>
      <div className="score-display">
        <button onClick={() => recordScore('home')}>
          Home: {scores.home}
        </button>
        <button onClick={() => recordScore('away')}>
          Away: {scores.away}
        </button>
      </div>
    </div>
  )
}
```

#### 3. Database Recovery

```sql
-- Emergency read-only mode
ALTER DATABASE cowtown SET default_transaction_read_only = on;

-- Check for corruption
SELECT pg_stat_database.datname, pg_database_size(pg_stat_database.datname)
FROM pg_stat_database;

-- Repair if needed
REINDEX DATABASE cowtown;
VACUUM FULL;

-- Re-enable writes
ALTER DATABASE cowtown SET default_transaction_read_only = off;
```

### Contact Information

```
🚨 Emergency Contacts:
- System Administrator: admin@tournament.com
- Database Administrator: dba@tournament.com  
- Tournament Director: director@tournament.com
- 24/7 Support Hotline: +1-800-SUPPORT

📋 Quick Reference:
- Health Check: http://yourdomain.com/api/health
- Admin Panel: http://yourdomain.com/admin
- Emergency Mode: Add ?emergency=true to any URL
```

This troubleshooting guide should help developers quickly identify and resolve common issues with the Cowtown Showdown tournament system. Keep this guide accessible during tournament operations for quick reference.