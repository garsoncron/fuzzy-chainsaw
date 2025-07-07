/**
 * @description Comprehensive API testing script for tournament scoring system
 * @dependencies Node.js fetch, console output
 * @notes Run with: npx ts-node src/scripts/test-api.ts
 */

interface TestResult {
  endpoint: string
  method: string
  status: number
  success: boolean
  error?: string
  responseTime: number
}

class TournamentAPITester {
  private baseUrl: string
  private authToken?: string
  private results: TestResult[] = []

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    headers: Record<string, string> = {}
  ): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
        },
      }

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body)
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, config)
      const responseTime = Date.now() - startTime

      const result: TestResult = {
        endpoint,
        method,
        status: response.status,
        success: response.ok,
        responseTime,
      }

      if (!response.ok) {
        const errorText = await response.text()
        result.error = errorText
      }

      this.results.push(result)
      return result
    } catch (error) {
      const responseTime = Date.now() - startTime
      const result: TestResult = {
        endpoint,
        method,
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      }
      
      this.results.push(result)
      return result
    }
  }

  async testGamesList() {
    console.log('\n🎮 Testing Games List API...')
    
    // Test basic games list
    await this.makeRequest('/api/games')
    
    // Test with filters
    await this.makeRequest('/api/games?status=scheduled')
    await this.makeRequest('/api/games?day=1')
    await this.makeRequest('/api/games?gameType=pool')
    await this.makeRequest('/api/games?limit=5')
    await this.makeRequest('/api/games?sortBy=scheduledTime&sortOrder=desc')
  }

  async testGameDetails(gameId: string) {
    console.log('\n📊 Testing Game Details API...')
    
    // Test game details
    await this.makeRequest(`/api/games/${gameId}`)
    
    // Test game update (requires auth)
    await this.makeRequest(`/api/games/${gameId}`, 'PUT', {
      homeScore: 5,
      awayScore: 3,
    })
  }

  async testGameManagement(gameId: string) {
    console.log('\n⚽ Testing Game Management...')
    
    // Test claim game
    await this.makeRequest(`/api/games/${gameId}/claim`, 'POST')
    
    // Test start game
    await this.makeRequest(`/api/games/${gameId}/start`, 'POST', {
      period: 1,
      periodLength: 12,
    })
    
    // Test timer updates
    await this.makeRequest(`/api/games/${gameId}/timer`, 'POST', {
      periodTimeRemaining: 600, // 10 minutes
    })
    
    // Test start new period
    await this.makeRequest(`/api/games/${gameId}/start-period`, 'POST', {
      period: 2,
    })
  }

  async testScoring(gameId: string, playerId: string) {
    console.log('\n🥅 Testing Scoring System...')
    
    // Test goal scoring
    await this.makeRequest(`/api/games/${gameId}/goal`, 'POST', {
      scorerId: playerId,
      goalType: 'even_strength',
      team: 'home',
      period: 1,
      periodTime: 300, // 5 minutes into period
    })
    
    // Test penalty recording
    await this.makeRequest(`/api/games/${gameId}/penalty`, 'POST', {
      playerId,
      infraction: 'slashing',
      team: 'home',
      period: 1,
      periodTime: 450, // 7.5 minutes into period
    })
    
    // Test faceoff recording
    await this.makeRequest(`/api/games/${gameId}/faceoff`, 'POST', {
      winnerId: playerId,
      winningTeam: 'home',
      period: 1,
      periodTime: 500,
      location: 'center',
    })
    
    // Test shot recording
    await this.makeRequest(`/api/games/${gameId}/shot`, 'POST', {
      shooterId: playerId,
      team: 'home',
      period: 1,
      periodTime: 550,
      shotType: 'wrist',
      result: 'save',
    })
    
    // Test loose ball recording
    await this.makeRequest(`/api/games/${gameId}/loose-ball`, 'POST', {
      playerId,
      team: 'home',
      period: 1,
      periodTime: 600,
      location: 'defensive_end',
      recoveryType: 'ground_ball',
    })
  }

  async testLiveUpdates(gameId: string) {
    console.log('\n📡 Testing Live Updates...')
    
    // Test SSE endpoint (just check if it accepts connections)
    await this.makeRequest(`/api/games/${gameId}/live`)
    await this.makeRequest('/api/games/live')
  }

  async testStandings() {
    console.log('\n🏆 Testing Standings API...')
    
    // Test standings
    await this.makeRequest('/api/standings')
    
    // Test cache clearing (DELETE method)
    await this.makeRequest('/api/standings', 'DELETE')
  }

  async testGameCompletion(gameId: string, playerId: string) {
    console.log('\n🏁 Testing Game Completion...')
    
    // Test end game with three stars
    await this.makeRequest(`/api/games/${gameId}/end`, 'POST', {
      threeStars: {
        first: playerId,
      },
      finalizePoints: true,
    })
    
    // Test release game
    await this.makeRequest(`/api/games/${gameId}/release`, 'POST')
  }

  async testGoalieChange(gameId: string, goalieId: string) {
    console.log('\n🥅 Testing Goalie Changes...')
    
    await this.makeRequest(`/api/games/${gameId}/goalie-change`, 'POST', {
      team: 'home',
      newGoalieId: goalieId,
      period: 2,
      periodTime: 300,
    })
  }

  async runAllTests() {
    console.log('🚀 Starting Tournament API Tests...')
    console.log(`Base URL: ${this.baseUrl}`)
    
    // You would need to get actual IDs from your database
    const testGameId = 'test-game-id'
    const testPlayerId = 'test-player-id'
    const testGoalieId = 'test-goalie-id'
    
    try {
      await this.testGamesList()
      await this.testGameDetails(testGameId)
      await this.testStandings()
      await this.testLiveUpdates(testGameId)
      
      // Tests requiring authentication
      if (this.authToken) {
        await this.testGameManagement(testGameId)
        await this.testScoring(testGameId, testPlayerId)
        await this.testGoalieChange(testGameId, testGoalieId)
        await this.testGameCompletion(testGameId, testPlayerId)
      } else {
        console.log('\n⚠️  Skipping authenticated tests (no auth token provided)')
      }
      
      this.printResults()
    } catch (error) {
      console.error('❌ Test suite failed:', error)
    }
  }

  setAuthToken(token: string) {
    this.authToken = token
  }

  printResults() {
    console.log('\n📊 TEST RESULTS')
    console.log('===============')
    
    const passed = this.results.filter(r => r.success).length
    const failed = this.results.filter(r => !r.success).length
    const total = this.results.length
    
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📊 Total: ${total}`)
    console.log(`🎯 Success Rate: ${((passed / total) * 100).toFixed(1)}%`)
    
    const avgResponseTime = this.results.reduce((acc, r) => acc + r.responseTime, 0) / total
    console.log(`⚡ Avg Response Time: ${avgResponseTime.toFixed(0)}ms`)
    
    // Show failed tests
    const failedTests = this.results.filter(r => !r.success)
    if (failedTests.length > 0) {
      console.log('\n❌ Failed Tests:')
      failedTests.forEach(test => {
        console.log(`  ${test.method} ${test.endpoint} - Status: ${test.status}`)
        if (test.error) {
          console.log(`    Error: ${test.error}`)
        }
      })
    }
    
    // Show slow tests (>1000ms)
    const slowTests = this.results.filter(r => r.responseTime > 1000)
    if (slowTests.length > 0) {
      console.log('\n🐌 Slow Tests (>1000ms):')
      slowTests.forEach(test => {
        console.log(`  ${test.method} ${test.endpoint} - ${test.responseTime}ms`)
      })
    }
  }
}

// Performance test for concurrent users
async function testConcurrency(baseUrl: string = 'http://localhost:3000') {
  console.log('\n🔥 Testing Concurrency (simulating 50 users)...')
  
  const promises = []
  const startTime = Date.now()
  
  for (let i = 0; i < 50; i++) {
    promises.push(
      fetch(`${baseUrl}/api/games/live`).catch(() => null)
    )
  }
  
  const results = await Promise.all(promises)
  const successful = results.filter(r => r && r.ok).length
  const endTime = Date.now()
  
  console.log(`✅ Successful connections: ${successful}/50`)
  console.log(`⚡ Total time: ${endTime - startTime}ms`)
  console.log(`📊 Average per request: ${(endTime - startTime) / 50}ms`)
}

// Main execution
async function main() {
  const tester = new TournamentAPITester()
  
  // Uncomment and set your auth token for authenticated tests
  // tester.setAuthToken('your-auth-token-here')
  
  await tester.runAllTests()
  await testConcurrency()
  
  console.log('\n🎉 API Testing Complete!')
}

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

export { TournamentAPITester }