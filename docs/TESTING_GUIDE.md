# Testing Guide for Developers

This comprehensive guide covers testing strategies, patterns, and best practices for the Cowtown Showdown tournament website.

## Table of Contents

- [Testing Overview](#testing-overview)
- [Test Setup and Configuration](#test-setup-and-configuration)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [API Testing](#api-testing)
- [Real-time Testing](#real-time-testing)
- [Component Testing](#component-testing)
- [Database Testing](#database-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Test Data Management](#test-data-management)
- [CI/CD Integration](#cicd-integration)

## Testing Overview

### Testing Strategy

The application uses a comprehensive testing strategy covering:

1. **Unit Tests** - Individual functions and components
2. **Integration Tests** - API endpoints and database operations
3. **End-to-End Tests** - Complete user workflows
4. **Performance Tests** - Load testing for tournament scenarios
5. **Security Tests** - Authentication and authorization

### Testing Stack

- **Vitest** - Fast unit and integration testing
- **Playwright** - Cross-browser end-to-end testing
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking
- **jsdom** - DOM environment simulation

### Test Commands

```bash
# Run all tests
pnpm test

# Run specific test types
pnpm test:unit        # Unit tests only
pnpm test:int         # Integration tests only
pnpm test:e2e         # End-to-end tests only

# Watch mode (development)
pnpm test:watch       # Watch unit tests
pnpm test:e2e:ui      # Playwright UI mode

# Coverage
pnpm test:coverage    # Generate coverage report
```

## Test Setup and Configuration

### Vitest Configuration

```typescript
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        'coverage/',
        '**/*.config.*',
        '**/*.d.ts',
      ],
    },
    globals: true,
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
})
```

### Test Setup File

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Mock Next.js router
vi.mock('next/router', () => require('next-router-mock'))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock Server-Sent Events
global.EventSource = vi.fn().mockImplementation(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  close: vi.fn(),
  readyState: 1,
}))

// Mock environment variables
process.env.PAYLOAD_SECRET = 'test-secret'
process.env.DATABASE_URI = 'postgresql://test:test@localhost:5432/cowtown_test'
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/playwright-report.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Unit Testing

### Component Testing

```typescript
// tests/unit/components/GameCard.test.tsx
import { render, screen } from '@testing-library/react'
import { GameCard } from '@/components/tournament/GameCard'
import { mockGame } from '@/tests/fixtures/games'

describe('GameCard', () => {
  it('displays game information correctly', () => {
    render(<GameCard game={mockGame} />)
    
    expect(screen.getByText('Game 1')).toBeInTheDocument()
    expect(screen.getByText('Calgary Bears')).toBeInTheDocument()
    expect(screen.getByText('Edmonton Storm')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument() // Home score
    expect(screen.getByText('3')).toBeInTheDocument() // Away score
  })
  
  it('shows live indicator for live games', () => {
    const liveGame = { ...mockGame, status: 'live' }
    render(<GameCard game={liveGame} />)
    
    expect(screen.getByText('LIVE')).toBeInTheDocument()
    expect(screen.getByText('Period 2')).toBeInTheDocument()
    expect(screen.getByText('7:00')).toBeInTheDocument() // Timer
  })
  
  it('displays tournament points when enabled', () => {
    render(<GameCard game={mockGame} showTournamentPoints />)
    
    expect(screen.getByText('Points: 3.5')).toBeInTheDocument()
    expect(screen.getByText('Points: 1.5')).toBeInTheDocument()
  })
  
  it('handles compact mode correctly', () => {
    const { container } = render(<GameCard game={mockGame} compact />)
    
    expect(container.firstChild).toHaveClass('h-24')
  })
})
```

### Hook Testing

```typescript
// tests/unit/hooks/useGameState.test.ts
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '@/hooks/useGameState'
import { mockGame } from '@/tests/fixtures/games'

describe('useGameState', () => {
  it('initializes with provided game data', () => {
    const { result } = renderHook(() => useGameState(mockGame))
    
    expect(result.current.game).toEqual(mockGame)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })
  
  it('updates game state optimistically', () => {
    const { result } = renderHook(() => useGameState(mockGame))
    
    act(() => {
      result.current.updateGame({ homeScore: 6 })
    })
    
    expect(result.current.game.homeScore).toBe(6)
  })
  
  it('handles stat submission with optimistic updates', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        game: { ...mockGame, homeScore: 6 }
      }),
    })
    
    const { result } = renderHook(() => useGameState(mockGame))
    
    await act(async () => {
      await result.current.submitStat({
        type: 'goal',
        team: 'home',
        scorerId: 'player123',
      })
    })
    
    expect(result.current.game.homeScore).toBe(6)
    expect(global.fetch).toHaveBeenCalledWith(
      `/api/games/${mockGame.id}/goal`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })
})
```

### Utility Function Testing

```typescript
// tests/unit/utils/tournamentCalculations.test.ts
import { calculateTournamentPoints, calculateStandings } from '@/utilities/tournament'
import { mockGames, mockTeams } from '@/tests/fixtures'

describe('Tournament Calculations', () => {
  describe('calculateTournamentPoints', () => {
    it('calculates 5-point system correctly', () => {
      const game = {
        ...mockGames.poolGame,
        homeScore: 8,
        awayScore: 5,
        goals: [
          // Period 1: Home 3, Away 2
          ...Array(3).fill({ team: 'home', period: 1 }),
          ...Array(2).fill({ team: 'away', period: 1 }),
          // Period 2: Home 2, Away 2 (tie)
          ...Array(2).fill({ team: 'home', period: 2 }),
          ...Array(2).fill({ team: 'away', period: 2 }),
          // Period 3: Home 3, Away 1
          ...Array(3).fill({ team: 'home', period: 3 }),
          ...Array(1).fill({ team: 'away', period: 3 }),
        ],
      }
      
      const points = calculateTournamentPoints(game)
      
      expect(points).toEqual({
        home: 4.5, // 1 (P1 win) + 0.5 (P2 tie) + 1 (P3 win) + 2 (game win)
        away: 0.5, // 0 (P1 loss) + 0.5 (P2 tie) + 0 (P3 loss) + 0 (game loss)
      })
    })
    
    it('handles overtime correctly', () => {
      const overtimeGame = {
        ...mockGames.medalGame,
        homeScore: 6,
        awayScore: 5,
        currentPeriod: 'OT1',
        goals: [
          // Regular periods tied 5-5, home wins in OT
        ],
      }
      
      const points = calculateTournamentPoints(overtimeGame)
      
      expect(points.home).toBeGreaterThan(points.away)
      expect(points.home + points.away).toBeLessThanOrEqual(5)
    })
  })
  
  describe('calculateStandings', () => {
    it('sorts teams correctly by tournament points', () => {
      const standings = calculateStandings(mockTeams, mockGames.completed)
      
      expect(standings[0].tournamentPoints).toBeGreaterThanOrEqual(
        standings[1].tournamentPoints
      )
    })
    
    it('applies tiebreaker rules in correct order', () => {
      const tiedTeams = mockTeams.filter(team => 
        team.name === 'Calgary Bears' || team.name === 'Edmonton Storm'
      )
      
      const standings = calculateStandings(tiedTeams, mockGames.tieScenario)
      
      // Test specific tiebreaker scenarios
      expect(standings[0].goalAverage).toBeGreaterThanOrEqual(
        standings[1].goalAverage
      )
    })
  })
})
```

## Integration Testing

### API Route Testing

```typescript
// tests/int/api/games.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/games/[id]/goal/route'
import { getPayload } from 'payload'
import { mockUser, mockGame, mockPlayer } from '@/tests/fixtures'

describe('/api/games/[id]/goal', () => {
  let payload: any
  
  beforeAll(async () => {
    payload = await getPayload({
      config: testPayloadConfig,
    })
  })
  
  beforeEach(async () => {
    // Clean database
    await payload.delete({ collection: 'goals', where: {} })
    await payload.delete({ collection: 'games', where: {} })
    
    // Seed test data
    await payload.create({
      collection: 'games',
      data: mockGame,
    })
  })
  
  it('records a goal and updates game score', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: `/api/games/${mockGame.id}/goal`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockUser.token}`,
      },
      body: {
        scorerId: mockPlayer.id,
        team: 'home',
        period: 2,
        periodTime: 480,
        goalType: 'even_strength',
      },
    })
    
    const response = await handler(req, res)
    const data = JSON.parse(response.body)
    
    expect(response.statusCode).toBe(200)
    expect(data.success).toBe(true)
    expect(data.goal.scorer).toBe(mockPlayer.id)
    expect(data.game.homeScore).toBe(mockGame.homeScore + 1)
    
    // Verify database update
    const updatedGame = await payload.findByID({
      collection: 'games',
      id: mockGame.id,
    })
    
    expect(updatedGame.homeScore).toBe(mockGame.homeScore + 1)
  })
  
  it('validates player belongs to correct team', async () => {
    const wrongTeamPlayer = { ...mockPlayer, team: mockGame.awayTeam }
    
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        scorerId: wrongTeamPlayer.id,
        team: 'home', // Player is on away team
        period: 2,
        periodTime: 480,
      },
    })
    
    const response = await handler(req, res)
    
    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('Player must be on the scoring team')
  })
  
  it('requires authentication', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { scorerId: mockPlayer.id, team: 'home' },
    })
    
    const response = await handler(req, res)
    
    expect(response.statusCode).toBe(401)
  })
})
```

### Collection Testing

```typescript
// tests/int/collections/Teams.test.ts
import { getPayload } from 'payload'
import { testPayloadConfig } from '@/tests/config'
import { mockTeam } from '@/tests/fixtures'

describe('Teams Collection', () => {
  let payload: any
  
  beforeAll(async () => {
    payload = await getPayload({ config: testPayloadConfig })
  })
  
  beforeEach(async () => {
    await payload.delete({ collection: 'teams', where: {} })
  })
  
  it('creates a team with valid data', async () => {
    const team = await payload.create({
      collection: 'teams',
      data: mockTeam,
    })
    
    expect(team.id).toBeDefined()
    expect(team.name).toBe(mockTeam.name)
    expect(team.slug).toBe(mockTeam.slug)
    expect(team.captain.name).toBe(mockTeam.captain.name)
  })
  
  it('enforces unique team names', async () => {
    await payload.create({
      collection: 'teams',
      data: mockTeam,
    })
    
    await expect(
      payload.create({
        collection: 'teams',
        data: { ...mockTeam, slug: 'different-slug' },
      })
    ).rejects.toThrow('Team name must be unique')
  })
  
  it('validates captain email format', async () => {
    const invalidTeam = {
      ...mockTeam,
      captain: {
        ...mockTeam.captain,
        email: 'invalid-email',
      },
    }
    
    await expect(
      payload.create({
        collection: 'teams',
        data: invalidTeam,
      })
    ).rejects.toThrow('Invalid email format')
  })
  
  it('validates hex color format', async () => {
    const invalidColorTeam = {
      ...mockTeam,
      primaryColor: 'not-a-hex-color',
    }
    
    await expect(
      payload.create({
        collection: 'teams',
        data: invalidColorTeam,
      })
    ).rejects.toThrow('Must be a valid hex color')
  })
})
```

## End-to-End Testing

### Tournament Workflow Testing

```typescript
// tests/e2e/scorekeeper.e2e.ts
import { test, expect } from '@playwright/test'

test.describe('Scorekeeper Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Seed database with test tournament
    await page.goto('/test-data/seed-tournament')
    
    // Login as scorekeeper
    await page.goto('/admin')
    await page.fill('[name="email"]', 'scorekeeper@test.com')
    await page.fill('[name="password"]', 'testpassword')
    await page.click('button[type="submit"]')
  })
  
  test('complete game scoring workflow', async ({ page }) => {
    // Navigate to scorekeeper dashboard
    await page.goto('/scorekeeper')
    
    // Claim a game
    await page.click('[data-testid="claim-game-1"]')
    await expect(page).toHaveURL(/\/scorekeeper\/game\/\w+/)
    
    // Start first period
    await page.click('[data-testid="start-period-1"]')
    await expect(page.locator('[data-testid="timer"]')).toContainText('12:00')
    
    // Record a goal
    await page.click('[data-testid="home-goal-button"]')
    await page.selectOption('[data-testid="scorer-select"]', 'player123')
    await page.click('[data-testid="confirm-goal"]')
    
    // Verify score update
    await expect(page.locator('[data-testid="home-score"]')).toContainText('1')
    
    // Record a penalty
    await page.click('[data-testid="away-penalty-button"]')
    await page.selectOption('[data-testid="player-select"]', 'player456')
    await page.selectOption('[data-testid="infraction-select"]', 'slashing')
    await page.click('[data-testid="confirm-penalty"]')
    
    // Verify penalty box display
    await expect(page.locator('[data-testid="penalty-box"]')).toContainText('2:00')
    
    // Complete the game
    await page.click('[data-testid="end-game"]')
    
    // Select three stars
    await page.selectOption('[data-testid="first-star"]', 'player123')
    await page.selectOption('[data-testid="second-star"]', 'player456')
    await page.selectOption('[data-testid="third-star"]', 'player789')
    await page.click('[data-testid="save-three-stars"]')
    
    // Verify game completion
    await expect(page).toHaveURL('/scorekeeper')
    await expect(page.locator('[data-testid="completed-games"]')).toContainText('Game 1')
  })
  
  test('handles connection loss gracefully', async ({ page, context }) => {
    // Start scoring a game
    await page.goto('/scorekeeper/game/test-game-id')
    
    // Simulate network failure
    await context.setOffline(true)
    
    // Attempt to record a goal
    await page.click('[data-testid="home-goal-button"]')
    await page.selectOption('[data-testid="scorer-select"]', 'player123')
    await page.click('[data-testid="confirm-goal"]')
    
    // Verify offline indicator
    await expect(page.locator('[data-testid="connection-status"]')).toContainText('Offline')
    
    // Verify optimistic update
    await expect(page.locator('[data-testid="home-score"]')).toContainText('1')
    
    // Restore connection
    await context.setOffline(false)
    
    // Verify sync indicator
    await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected')
    
    // Verify data persistence
    await page.reload()
    await expect(page.locator('[data-testid="home-score"]')).toContainText('1')
  })
})
```

### Mobile Testing

```typescript
// tests/e2e/mobile.e2e.ts
import { test, expect, devices } from '@playwright/test'

test.use({ ...devices['iPhone 13'] })

test.describe('Mobile Tournament Experience', () => {
  test('scorekeeper interface is touch-friendly', async ({ page }) => {
    await page.goto('/scorekeeper/game/test-game-id')
    
    // Verify minimum touch target sizes (44px)
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const boundingBox = await button.boundingBox()
      
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(44)
        expect(boundingBox.width).toBeGreaterThanOrEqual(44)
      }
    }
  })
  
  test('tournament homepage is responsive', async ({ page }) => {
    await page.goto('/')
    
    // Verify mobile navigation
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Verify scoreboard layout
    const gameCards = page.locator('[data-testid="game-card"]')
    await expect(gameCards.first()).toBeVisible()
    
    // Verify horizontal scrolling works
    await gameCards.first().scrollIntoViewIfNeeded()
  })
})
```

## API Testing

### SSE Testing

```typescript
// tests/int/api/sse.test.ts
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { EventSource } from 'eventsource'

describe('Server-Sent Events', () => {
  let server: any
  let app: any
  
  beforeAll(async () => {
    app = next({ dev: false, dir: './src' })
    const handle = app.getRequestHandler()
    
    server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true)
      handle(req, res, parsedUrl)
    })
    
    await new Promise<void>((resolve) => {
      server.listen(3001, resolve)
    })
  })
  
  afterAll(async () => {
    await app.close()
    server.close()
  })
  
  test('game live updates stream', (done) => {
    const eventSource = new EventSource('http://localhost:3001/api/games/test-game-id/live')
    
    let messageCount = 0
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      expect(data.type).toBe('game-update')
      expect(data.game).toBeDefined()
      expect(data.game.id).toBe('test-game-id')
      
      messageCount++
      
      if (messageCount >= 2) {
        eventSource.close()
        done()
      }
    }
    
    eventSource.onerror = (error) => {
      eventSource.close()
      done(error)
    }
    
    // Trigger an update
    setTimeout(async () => {
      await fetch('http://localhost:3001/api/games/test-game-id/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scorerId: 'player123',
          team: 'home',
          period: 2,
          periodTime: 480,
        }),
      })
    }, 1000)
  })
  
  test('handles connection drops gracefully', async () => {
    const eventSource = new EventSource('http://localhost:3001/api/games/live')
    
    // Simulate connection drop
    eventSource.close()
    
    // Verify no memory leaks
    expect(eventSource.readyState).toBe(EventSource.CLOSED)
  })
})
```

## Real-time Testing

### Connection Management Testing

```typescript
// tests/unit/hooks/useRealtime.test.ts
import { renderHook, act } from '@testing-library/react'
import { useRealtime } from '@/hooks/useRealtime'

// Mock EventSource
const mockEventSource = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  close: vi.fn(),
  readyState: 1,
}

global.EventSource = vi.fn().mockImplementation(() => mockEventSource)

describe('useRealtime', () => {
  const mockGameId = 'test-game-id'
  const mockOnUpdate = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('establishes SSE connection on mount', () => {
    renderHook(() => useRealtime(mockGameId, mockOnUpdate))
    
    expect(global.EventSource).toHaveBeenCalledWith(
      `/api/games/${mockGameId}/live`
    )
  })
  
  it('handles connection open event', () => {
    const { result } = renderHook(() => useRealtime(mockGameId, mockOnUpdate))
    
    // Simulate connection open
    act(() => {
      const openHandler = mockEventSource.addEventListener.mock.calls.find(
        call => call[0] === 'open'
      )[1]
      openHandler()
    })
    
    expect(result.current.isConnected).toBe(true)
    expect(result.current.error).toBeNull()
  })
  
  it('handles incoming messages', () => {
    renderHook(() => useRealtime(mockGameId, mockOnUpdate))
    
    const testData = { type: 'game-update', game: { id: mockGameId } }
    
    // Simulate message
    act(() => {
      const messageHandler = mockEventSource.addEventListener.mock.calls.find(
        call => call[0] === 'message'
      )[1]
      messageHandler({ data: JSON.stringify(testData) })
    })
    
    expect(mockOnUpdate).toHaveBeenCalledWith(testData)
  })
  
  it('handles connection errors with retry', () => {
    vi.useFakeTimers()
    
    const { result } = renderHook(() => useRealtime(mockGameId, mockOnUpdate))
    
    // Simulate connection error
    act(() => {
      const errorHandler = mockEventSource.addEventListener.mock.calls.find(
        call => call[0] === 'error'
      )[1]
      errorHandler()
    })
    
    expect(result.current.isConnected).toBe(false)
    expect(result.current.error).toBe('Connection lost')
    
    // Fast-forward retry timer
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    
    // Verify reconnection attempt
    expect(global.EventSource).toHaveBeenCalledTimes(2)
    
    vi.useRealTimers()
  })
  
  it('cleans up connection on unmount', () => {
    const { unmount } = renderHook(() => useRealtime(mockGameId, mockOnUpdate))
    
    unmount()
    
    expect(mockEventSource.close).toHaveBeenCalled()
  })
})
```

## Component Testing

### Complex Component Testing

```typescript
// tests/unit/components/ScoringInterface.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScoringInterface } from '@/components/scorekeeper/ScoringInterface'
import { mockGame, mockPlayers, mockUser } from '@/tests/fixtures'

// Mock real-time hook
vi.mock('@/hooks/useRealtime', () => ({
  useRealtime: () => ({
    isConnected: true,
    error: null,
  }),
}))

describe('ScoringInterface', () => {
  const defaultProps = {
    game: mockGame,
    homeRoster: mockPlayers.home,
    awayRoster: mockPlayers.away,
    currentUser: mockUser,
  }
  
  beforeEach(() => {
    global.fetch = vi.fn()
  })
  
  it('renders game information correctly', () => {
    render(<ScoringInterface {...defaultProps} />)
    
    expect(screen.getByText('Game 1')).toBeInTheDocument()
    expect(screen.getByText('Calgary Bears')).toBeInTheDocument()
    expect(screen.getByText('Edmonton Storm')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument() // Score display
  })
  
  it('allows starting a period', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
    
    render(<ScoringInterface {...defaultProps} />)
    
    const startButton = screen.getByText('Start Period 1')
    await userEvent.click(startButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/games/${mockGame.id}/start-period`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ period: 1 }),
        })
      )
    })
  })
  
  it('records goals with proper validation', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        goal: { id: 'goal123' },
        game: { ...mockGame, homeScore: 1 },
      }),
    })
    
    render(<ScoringInterface {...defaultProps} />)
    
    // Click goal button
    const goalButton = screen.getByTestId('home-goal-button')
    await userEvent.click(goalButton)
    
    // Select scorer
    const scorerSelect = screen.getByTestId('scorer-select')
    await userEvent.selectOptions(scorerSelect, mockPlayers.home[0].id)
    
    // Confirm goal
    const confirmButton = screen.getByText('Confirm Goal')
    await userEvent.click(confirmButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/games/${mockGame.id}/goal`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            scorerId: mockPlayers.home[0].id,
            team: 'home',
            period: mockGame.currentPeriod,
            periodTime: mockGame.periodTimeRemaining,
            goalType: 'even_strength',
          }),
        })
      )
    })
  })
  
  it('displays connection status', () => {
    render(<ScoringInterface {...defaultProps} />)
    
    expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected')
  })
  
  it('handles offline mode gracefully', () => {
    // Mock disconnected state
    vi.mocked(useRealtime).mockReturnValue({
      isConnected: false,
      error: 'Connection lost',
    })
    
    render(<ScoringInterface {...defaultProps} />)
    
    expect(screen.getByTestId('connection-status')).toHaveTextContent('Offline')
    expect(screen.getByText('Actions will be queued until reconnected')).toBeInTheDocument()
  })
})
```

## Database Testing

### Test Database Setup

```typescript
// tests/config/database.ts
import { PayloadRequest } from 'payload/types'
import configPromise from '@/payload.config'

export const testPayloadConfig = {
  ...configPromise,
  db: {
    ...configPromise.db,
    url: process.env.DATABASE_TEST_URI || 'postgresql://test:test@localhost:5432/cowtown_test',
  },
}

export const setupTestDatabase = async () => {
  const payload = await getPayload({ config: testPayloadConfig })
  
  // Clear all collections
  const collections = ['teams', 'players', 'games', 'goals', 'penalties', 'faceoffs']
  
  for (const collection of collections) {
    await payload.delete({
      collection,
      where: {},
    })
  }
  
  return payload
}

export const seedTestData = async (payload: any) => {
  // Create test teams
  const teams = await Promise.all(
    mockTeams.map(team => 
      payload.create({
        collection: 'teams',
        data: team,
      })
    )
  )
  
  // Create test players
  const players = await Promise.all(
    mockPlayers.map(player => 
      payload.create({
        collection: 'players',
        data: {
          ...player,
          team: teams.find(t => t.name === player.teamName)?.id,
        },
      })
    )
  )
  
  // Create test games
  const games = await Promise.all(
    mockGames.map(game => 
      payload.create({
        collection: 'games',
        data: {
          ...game,
          homeTeam: teams.find(t => t.name === game.homeTeamName)?.id,
          awayTeam: teams.find(t => t.name === game.awayTeamName)?.id,
        },
      })
    )
  )
  
  return { teams, players, games }
}
```

### Database Migration Testing

```typescript
// tests/int/database/migrations.test.ts
import { getPayload } from 'payload'
import { runMigrations } from '@/scripts/migrate'

describe('Database Migrations', () => {
  it('runs migrations successfully', async () => {
    const payload = await getPayload({ config: testPayloadConfig })
    
    const result = await runMigrations(payload)
    
    expect(result.success).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
  
  it('handles migration rollback', async () => {
    const payload = await getPayload({ config: testPayloadConfig })
    
    // Run migration
    await runMigrations(payload)
    
    // Rollback
    const rollbackResult = await rollbackMigrations(payload)
    
    expect(rollbackResult.success).toBe(true)
  })
})
```

## Performance Testing

### Load Testing

```typescript
// tests/performance/load.test.ts
import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('handles concurrent scorekeeper sessions', async ({ browser }) => {
    const promises = []
    
    // Simulate 10 concurrent scorekeepers
    for (let i = 0; i < 10; i++) {
      promises.push(
        (async () => {
          const context = await browser.newContext()
          const page = await context.newPage()
          
          await page.goto('/scorekeeper')
          
          // Measure response time
          const startTime = Date.now()
          await page.click('[data-testid="claim-game-1"]')
          await page.waitForLoadState('networkidle')
          const endTime = Date.now()
          
          const responseTime = endTime - startTime
          expect(responseTime).toBeLessThan(3000) // 3 second threshold
          
          await context.close()
          return responseTime
        })()
      )
    }
    
    const responseTimes = await Promise.all(promises)
    const averageTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length
    
    console.log(`Average response time: ${averageTime}ms`)
    expect(averageTime).toBeLessThan(2000)
  })
  
  test('SSE connection scalability', async ({ page }) => {
    // Open multiple SSE connections
    const connections = []
    
    for (let i = 0; i < 50; i++) {
      connections.push(
        page.evaluate(() => {
          const eventSource = new EventSource('/api/games/live')
          return new Promise((resolve) => {
            eventSource.onopen = () => resolve('connected')
            eventSource.onerror = () => resolve('error')
          })
        })
      )
    }
    
    const results = await Promise.all(connections)
    const successfulConnections = results.filter(r => r === 'connected').length
    
    expect(successfulConnections).toBeGreaterThan(45) // 90% success rate
  })
})
```

## Security Testing

### Authentication Testing

```typescript
// tests/security/auth.test.ts
import { createMocks } from 'node-mocks-http'
import { authMiddleware } from '@/lib/auth'

describe('Authentication Security', () => {
  it('rejects requests without valid JWT', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/games/test-game-id/goal',
    })
    
    const response = await authMiddleware(req, res)
    
    expect(response.statusCode).toBe(401)
  })
  
  it('validates JWT signature', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid.jwt.token',
      },
    })
    
    const response = await authMiddleware(req, res)
    
    expect(response.statusCode).toBe(401)
  })
  
  it('enforces role-based access control', async () => {
    const userToken = generateTestToken({ role: 'user' })
    
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
    
    const response = await authMiddleware(req, res, { requiredRole: 'scorekeeper' })
    
    expect(response.statusCode).toBe(403)
  })
})
```

### Input Validation Testing

```typescript
// tests/security/validation.test.ts
describe('Input Validation', () => {
  it('sanitizes SQL injection attempts', async () => {
    const maliciousInput = "'; DROP TABLE teams; --"
    
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        scorerId: maliciousInput,
      },
    })
    
    const response = await handler(req, res)
    
    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('Invalid player ID')
  })
  
  it('prevents XSS in text fields', async () => {
    const xssPayload = '<script>alert("xss")</script>'
    
    const team = await payload.create({
      collection: 'teams',
      data: {
        name: xssPayload,
        slug: 'test-team',
        captain: { name: 'Test', email: 'test@test.com' },
      },
    })
    
    expect(team.name).not.toContain('<script>')
  })
})
```

## Test Data Management

### Test Fixtures

```typescript
// tests/fixtures/index.ts
export const mockTeams = [
  {
    id: 'team-bears',
    name: 'Calgary Bears',
    slug: 'calgary-bears',
    primaryColor: '#FF0000',
    captain: {
      name: 'John Smith',
      email: 'john@bears.com',
      phone: '403-555-0001',
    },
  },
  {
    id: 'team-storm',
    name: 'Edmonton Storm',
    slug: 'edmonton-storm',
    primaryColor: '#0000FF',
    captain: {
      name: 'Jane Doe',
      email: 'jane@storm.com',
      phone: '780-555-0002',
    },
  },
]

export const mockPlayers = {
  home: [
    {
      id: 'player-123',
      firstName: 'Connor',
      lastName: 'McDavid',
      jerseyNumber: 97,
      primaryPosition: 'offence',
      playerType: 'runner',
      handedness: 'left',
    },
  ],
  away: [
    {
      id: 'player-456',
      firstName: 'Leon',
      lastName: 'Draisaitl',
      jerseyNumber: 29,
      primaryPosition: 'offence',
      playerType: 'runner',
      handedness: 'left',
    },
  ],
}

export const mockGame = {
  id: 'game-123',
  gameNumber: '1',
  gameType: 'pool',
  day: 1,
  scheduledTime: new Date('2024-07-15T10:00:00Z'),
  status: 'live',
  homeTeam: mockTeams[0],
  awayTeam: mockTeams[1],
  homeScore: 5,
  awayScore: 3,
  currentPeriod: 2,
  periodTimeRemaining: 420,
  periodLength: 720,
  gamePoints: { home: 3.5, away: 1.5 },
}

export const mockUser = {
  id: 'user-123',
  email: 'scorekeeper@test.com',
  role: 'scorekeeper',
  token: 'valid.jwt.token',
}
```

### Mock Strategies

```typescript
// tests/mocks/api.ts
import { rest } from 'msw'
import { setupServer } from 'msw/node'

export const handlers = [
  rest.post('/api/games/:id/goal', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        goal: { id: 'new-goal-id' },
        game: { homeScore: 6, awayScore: 3 },
      })
    )
  }),
  
  rest.get('/api/games/:id/live', (req, res, ctx) => {
    return res(
      ctx.set('Content-Type', 'text/event-stream'),
      ctx.body('data: {"type":"game-update","game":{"id":"test-game"}}\n\n')
    )
  }),
]

export const server = setupServer(...handlers)

// Setup
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## CI/CD Integration

### GitHub Actions Configuration

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: cowtown_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Setup test database
        run: pnpm run db:migrate:test
        env:
          DATABASE_TEST_URI: postgresql://postgres:postgres@localhost:5432/cowtown_test
      
      - name: Run unit tests
        run: pnpm test:unit
      
      - name: Run integration tests
        run: pnpm test:int
        env:
          DATABASE_TEST_URI: postgresql://postgres:postgres@localhost:5432/cowtown_test
      
      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Coverage Configuration

```typescript
// vitest.config.mts (coverage section)
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        'coverage/',
        '**/*.config.*',
        '**/*.d.ts',
        'tests/',
        'src/app/(payload)/admin/',
        'payload-types.ts',
      ],
    },
  },
})
```

This comprehensive testing guide provides developers with the knowledge and tools needed to maintain high code quality and reliability for the Cowtown Showdown tournament management system. The testing strategy covers all critical aspects of the application, from individual components to complex tournament workflows, ensuring robust operation during live events.
 4. Try to access scorekeeper functions - should be denied

  Step 3.2: Test Session Extension

  Via API:
  1. Get the Bearer token for scorekeeper from localStorage
  2. Use Postman or browser console:
  fetch('/api/auth/extend-session', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  }).then(r => r.json()).then(console.log)
  3. Verify session expiry is extended by 4 hours

  Step 3.3: Test Admin Session

  1. Log in as admin
  2. Sessions should not have 4-hour expiry
  3. Check Users collection - admin should not have sessionExpiry
  set

  ---
  4. Access Control Testing

  Step 4.1: Test Collection Access

  As Scorekeeper:
  1. Try to access Teams collection - should be restricted
  2. Try to access Games collection - should have limited access
  3. Try to access AuditLogs - should be completely restricted

  As Admin:
  1. Can access Teams, Games, Players
  2. Can access Users (limited to scorekeeper management)
  3. Cannot access AuditLogs

  As Super Admin:
  1. Full access to all collections
  2. Can access AuditLogs
  3. Can manage all user roles

  Step 4.2: Test Field-Level Access

  1. Edit a User as Admin - should not see super admin permission
  fields
  2. Edit a User as Super Admin - should see all fields
  3. Verify sensitive fields are hidden appropriately

  ---
  5. Audit Logging Testing

  Step 5.1: Verify Audit Log Collection

  1. Log in as Super Admin
  2. Navigate to Security > Audit Logs
  3. Should see logged events from your testing

  Step 5.2: Generate Test Events

  Authentication Events:
  1. Log in/out several times
  2. Check audit logs for auth.login and auth.logout entries
  3. Verify IP address and user agent are recorded

  User Management Events:
  1. Create/edit/delete a test user
  2. Check for user.create, user.update, user.delete entries
  3. Change a user's role - verify user.role_change entry

  Step 5.3: Verify Audit Data

  Each audit entry should contain:
  - Action type (e.g., auth.login)
  - User ID who performed action
  - Timestamp
  - IP address
  - User agent
  - Details object with relevant data
  - Success/failure status

  ---
  6. Security Features Testing

  Step 6.1: Test Security Headers

  1. Open browser developer tools > Network tab
  2. Make any request to the site
  3. Check response headers for:
    - Content-Security-Policy
    - X-Frame-Options: DENY
    - X-Content-Type-Options: nosniff
    - Strict-Transport-Security

  Step 6.2: Test Rate Limiting

  Different Endpoint Types:

  Auth Endpoints (5 req/15min):
  // Test in browser console
  for(let i = 0; i < 10; i++) {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: 'test', password: 'test'})
    }).then(r => console.log(i, r.status))
  }

  API Endpoints (100 req/15min):
  // Test public API rate limiting
  for(let i = 0; i < 110; i++) {
    fetch('/api/games').then(r => console.log(i, r.status))
  }

  Step 6.3: Test Input Validation

  Login Endpoint:
  1. Try SQL injection in login form
  2. Try XSS payloads in form fields
  3. Verify proper sanitization

  API Endpoints:
  1. Send malformed JSON to API endpoints
  2. Try requests without authentication headers
  3. Test with invalid data types

  ---
  7. API Endpoints Testing

  Step 7.1: Test Login API

  // Test successful login
  fetch('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: 'scorekeeper@test.com',
      password: 'Score123!'
    })
  }).then(r => r.json()).then(console.log)

  Expected response:
  {
    "token": "eyJ...",
    "user": {
      "id": "...",
      "email": "scorekeeper@test.com",
      "role": "scorekeeper",
      "sessionExpiry": "2024-..."
    },
    "expiresIn": 14400
  }

  Step 7.2: Test Session Extension API

  // Get token from login response
  const token = 'your-token-here'

  fetch('/api/auth/extend-session', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(r => r.json()).then(console.log)

  Step 7.3: Test Game Claiming API

  First, create a test game in the Games collection, then:

  fetch('/api/games/GAME_ID/claim', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(r => r.json()).then(console.log)

  ---
  8. Error Handling Testing

  Step 8.1: Test Invalid Authentication

  1. Try API calls with expired tokens
  2. Try API calls with malformed tokens
  3. Try accessing admin endpoints as scorekeeper

  Step 8.2: Test Session Expiry

  1. Manually expire a scorekeeper session
  2. Try to access protected resources
  3. Verify proper error messages

  Step 8.3: Test Account Deactivation

  1. Deactivate a user account
  2. Try to log in with deactivated account
  3. If already logged in, try to access resources

  ---
  9. UI Component Testing

  Step 9.1: Test SessionTimer Component

  If implemented in the UI:
  1. Log in as scorekeeper
  2. Look for session timer display
  3. Verify countdown functionality
  4. Test extend session button

  Step 9.2: Test GameClaimManager Component

  If implemented:
  1. View available games
  2. Test claim/release functionality
  3. Verify role-based restrictions

  ---
  10. Integration Testing

  Step 10.1: End-to-End Workflow

  1. Create scorekeeper account as admin
  2. Assign games to scorekeeper
  3. Log in as scorekeeper
  4. Claim a game
  5. Verify all audit logs are created
  6. Test session expiry during game

  Step 10.2: Security Workflow

  1. Test failed login attempts
  2. Verify account lockout
  3. Check audit logs for security events
  4. Test rate limiting across different endpoints

  ---
  Expected Results Checklist

  ✅ User Management

  - Three user roles created successfully
  - Role-based access restrictions work
  - Password requirements enforced
  - Cannot delete last super admin

  ✅ Authentication

  - Login redirects based on role
  - Rate limiting prevents brute force
  - Account lockout after failed attempts
  - Secure token generation

  ✅ Session Management

  - Scorekeeper sessions expire after 4 hours
  - Session extension works properly
  - Admin sessions don't auto-expire
  - Activity tracking updates correctly

  ✅ Access Control

  - Collection access restricted by role
  - Field-level access controls work
  - API endpoints require proper authorization
  - Cross-role access properly denied

  ✅ Audit Logging

  - All critical actions logged
  - Audit entries contain required data
  - Only super admins can view audit logs
  - IP and user agent tracking works

  ✅ Security Features

  - Security headers present in responses
  - Rate limiting prevents abuse
  - Input validation/sanitization works
  - CSRF protection active (if implemented)

  ✅ API Endpoints

  - Authentication endpoint works
  - Session extension endpoint works
  - Game claiming with proper authorization
  - Proper error responses for invalid requests

  Troubleshooting Common Issues

  Users Collection Not Visible:
  - Verify you're logged in as admin/super admin
  - Check if collections are properly imported in payload.config.ts

  Session Expiry Not Working:
  - Check if sessionExpiry field is being set correctly
  - Verify middleware is checking session validity

  Rate Limiting Not Working:
  - Confirm middleware is applied correctly
  - Check if rate limiting store is functioning

  Audit Logs Empty:
  - Verify audit logging functions are being called
  - Check if AuditLogs collection is accessible

  Login Failures:
  - Verify user accounts are active
  - Check password requirements are met
  - Confirm email addresses are correct

  This testing guide should comprehensively validate all the
  authentication and security features implemented in the system.

> do i need to do any database migrations? i don't totally get
  postgres/migration files

⏺ Yes, you'll likely need database migrations since we added new collections
   and fields. Let me explain the migration process for your Payload +
  PostgreSQL setup and help you through it.

  Understanding Migrations

  What are migrations?
  - Migration files are instructions that tell PostgreSQL how to update your
   database structure
  - They ensure your database schema matches your Payload collections
  - They're like "recipes" for database changes that can be run safely

  Why do you need them?
  We added:
  - New Users collection fields (role, sessionExpiry, isActive, etc.)
  - New AuditLogs collection
  - Potential changes to existing collections

  Step-by-Step Migration Process

  1. Check Current Database State

  First, let's see what's currently in your database:

  # Check if you can connect to your database
  pnpm payload migrate:status

  This will show you:
  - Which migrations have been run
  - Which migrations are pending
  - If there are any issues

  2. Generate Migration for New Changes

  Since we added new collections and fields, Payload needs to create a
  migration:

  # This creates a new migration file based on your collection changes
  pnpm payload migrate:create

  You'll be prompted to name the migration. Use something descriptive like:
  add_user_roles_and_audit_logs

  3. Review the Generated Migration

  After running the command, check the new file in:
  src/migrations/TIMESTAMP_add_user_roles_and_audit_logs.ts

  It should contain SQL commands like:
  -- Add new columns to users table
  ALTER TABLE "users" ADD COLUMN "role" varchar DEFAULT 'scorekeeper';
  ALTER TABLE "users" ADD COLUMN "sessionExpiry" timestamp with time zone;
  ALTER TABLE "users" ADD COLUMN "isActive" boolean DEFAULT true;

  -- Create audit_logs table
  CREATE TABLE "audit_logs" (
    "id" serial PRIMARY KEY,
    "action" varchar NOT NULL,
    "userId" integer,
    -- ... other columns
  );

  4. Run the Migration

  # This applies the migration to your database
  pnpm payload migrate

  If successful, you'll see:
  ✓ Migration add_user_roles_and_audit_logs completed

  Alternative: Reset Database (If Safe)

  If you're in development and don't have important data, you can reset
  everything:

  # WARNING: This deletes all data!
  pnpm payload migrate:reset

  # Then run fresh migrations
  pnpm payload migrate

  Troubleshooting Common Issues

  Issue 1: "Column already exists"

  If you get errors about columns already existing:

  # Check what's actually in your database
  pnpm payload migrate:status

  # If needed, mark migrations as complete without running them
  pnpm payload migrate:refresh

  Issue 2: Migration Fails

  If the migration fails partway through:

  1. Check the error message
  2. Fix any issues in your collection definitions
  3. Create a new migration:
  pnpm payload migrate:create fix_migration_issues

  Issue 3: Database Connection Issues

  Make sure your .env has the correct DATABASE_URI:
  DATABASE_URI=postgresql://username:password@localhost:5432/cowtown_db

  Manual Migration Check

  If you want to verify what needs to be migrated, you can check your
  PostgreSQL database directly:

  # Connect to your database (replace with your connection details)
  psql postgresql://username:password@localhost:5432/cowtown_db

  # Check if users table has new columns
  \d users

  # Check if audit_logs table exists
  \d audit_logs

  # Exit PostgreSQL
  \q

  What to Expect in Your Migration

  Your migration should include:

  Users Table Updates:

  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" varchar DEFAULT
  'scorekeeper';
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "firstName" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastName" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "sessionExpiry" timestamp
  with time zone;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastActivity" timestamp with
   time zone;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT
  true;

  New Audit Logs Table:

  CREATE TABLE IF NOT EXISTS "audit_logs" (
      "id" serial PRIMARY KEY,
      "action" varchar NOT NULL,
      "userId" integer REFERENCES "users"("id"),
      "targetId" varchar,
      "targetType" varchar,
      "timestamp" timestamp with time zone DEFAULT now(),
      "ipAddress" varchar,
      "userAgent" text,
      "details" jsonb,
      "success" boolean DEFAULT true,
      "errorMessage" text,
      "severity" varchar DEFAULT 'info'
  );

  Quick Migration Commands Reference

  # Check migration status
  pnpm payload migrate:status

  # Create new migration
  pnpm payload migrate:create

  # Run pending migrations
  pnpm payload migrate

  # Reset database (DANGEROUS - deletes all data)
  pnpm payload migrate:reset

  # Refresh migration status
  pnpm payload migrate:refresh

  Recommended Process for You

  1. Backup first (if you have important data):
  pg_dump your_database_name > backup.sql
  2. Check status:
  pnpm payload migrate:status
  3. Create migration:
  pnpm payload migrate:create
  3. Name it: add_authentication_and_security
  4. Review the generated migration file to ensure it looks correct
  5. Run the migration:
  pnpm payload migrate
  6. Verify success:
  pnpm payload generate:types

  If You Get Stuck

  If migrations seem too complex or you run into issues:

  1. Simple Reset (if no important data):
  pnpm payload migrate:reset
  pnpm payload migrate
  2. Manual Database Update (advanced):
  You could manually run SQL commands, but migrations are safer
  3. Start Fresh (nuclear option):
    - Drop and recreate your database
    - Run pnpm payload migrate to create everything fresh

  The migration system ensures your database structure matches your code
  changes safely. Let me know if you run into any specific errors and I can
  help troubleshoot!