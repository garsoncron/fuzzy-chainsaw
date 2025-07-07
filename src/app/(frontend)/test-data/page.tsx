/**
 * @description Test page to verify API endpoints and seeded data
 * @dependencies Payload CMS APIs, React state management
 * @accessibility Basic button navigation and screen reader friendly
 * @performance Basic data fetching for development testing
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Trophy, 
  Calendar, 
  Target,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle 
} from 'lucide-react'

interface TestResult {
  endpoint: string
  loading: boolean
  data: any
  error: string | null
  count: number
  timestamp: Date
}

export default function TestDataPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({})

  const updateResult = (key: string, update: Partial<TestResult>) => {
    setResults(prev => ({
      ...prev,
      [key]: { ...prev[key], ...update, timestamp: new Date() }
    }))
  }

  const testEndpoint = async (key: string, endpoint: string, name: string) => {
    updateResult(key, {
      endpoint,
      loading: true,
      data: null,
      error: null,
      count: 0
    })

    try {
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Handle different response formats
      let count = 0
      let responseData = data

      if (data.docs) {
        // Payload collection format
        count = data.docs.length
        responseData = {
          totalDocs: data.totalDocs,
          limit: data.limit,
          totalPages: data.totalPages,
          page: data.page,
          pagingCounter: data.pagingCounter,
          hasPrevPage: data.hasPrevPage,
          hasNextPage: data.hasNextPage,
          docs: data.docs
        }
      } else if (data.standings) {
        // Standings API format
        count = data.standings.length
        responseData = data
      } else if (Array.isArray(data)) {
        count = data.length
      } else if (data.games) {
        count = data.games.length
      }

      updateResult(key, {
        loading: false,
        data: responseData,
        error: null,
        count
      })

    } catch (error) {
      updateResult(key, {
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        count: 0
      })
    }
  }

  const testEndpoints = [
    {
      key: 'teams',
      name: 'Teams',
      endpoint: '/api/teams',
      payloadEndpoint: '/api/teams?limit=100',
      icon: Users,
      description: 'Tournament teams with captain info'
    },
    {
      key: 'players',
      name: 'Players', 
      endpoint: '/api/players',
      payloadEndpoint: '/api/players?limit=100&depth=1',
      icon: Users,
      description: 'Player rosters with team relationships'
    },
    {
      key: 'games',
      name: 'Games',
      endpoint: '/api/games',
      payloadEndpoint: '/api/games?limit=100&depth=2',
      icon: Calendar,
      description: 'Tournament schedule with team data'
    },
    {
      key: 'goals', 
      name: 'Goals',
      endpoint: '/api/goals',
      payloadEndpoint: '/api/goals?limit=50&depth=2',
      icon: Target,
      description: 'Goal scoring statistics'
    },
    {
      key: 'standings',
      name: 'Standings',
      endpoint: '/api/standings',
      payloadEndpoint: null,
      icon: Trophy,
      description: 'Calculated tournament standings'
    }
  ]

  const getStatusIcon = (result?: TestResult) => {
    if (!result) return <Clock className="h-4 w-4 text-gray-400" />
    if (result.loading) return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
    if (result.error) return <XCircle className="h-4 w-4 text-red-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getStatusColor = (result?: TestResult) => {
    if (!result) return 'gray'
    if (result.loading) return 'blue'
    if (result.error) return 'red'
    return 'green'
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const clearAllResults = () => {
    setResults({})
  }

  const testAllEndpoints = () => {
    testEndpoints.forEach(({ key, name, payloadEndpoint }) => {
      const endpoint = payloadEndpoint || `/api/${key}`
      testEndpoint(key, endpoint, name)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-western text-primary-brown mb-2">
          Tournament Data Testing
        </h1>
        <p className="text-muted-foreground mb-4">
          Verify API endpoints and seeded tournament data are working correctly.
        </p>
        
        <div className="flex space-x-2 mb-6">
          <Button onClick={testAllEndpoints} className="bg-primary-brown hover:bg-dark-brown">
            <RefreshCw className="h-4 w-4 mr-2" />
            Test All Endpoints
          </Button>
          <Button onClick={clearAllResults} variant="outline">
            Clear Results
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Test Controls */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary-brown mb-4">API Endpoints</h2>
          
          {testEndpoints.map(({ key, name, endpoint, payloadEndpoint, icon: Icon, description }) => {
            const result = results[key]
            const testEndpointUrl = payloadEndpoint || `/api/${key}`
            
            return (
              <Card key={key} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary-brown" />
                      <span>{name}</span>
                      {getStatusIcon(result)}
                    </CardTitle>
                    <Badge variant="outline" className={`text-${getStatusColor(result)}-600 border-${getStatusColor(result)}-300`}>
                      {result?.count || 0} records
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      <strong>Endpoint:</strong> {testEndpointUrl}
                    </div>
                    
                    {result?.timestamp && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Last tested:</strong> {formatTimestamp(result.timestamp)}
                      </div>
                    )}
                    
                    {result?.error && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {result.error}
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => testEndpoint(key, testEndpointUrl, name)}
                      disabled={result?.loading}
                      size="sm"
                      className="w-full"
                    >
                      {result?.loading ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          Test {name} Data
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Results Display */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary-brown mb-4">Results</h2>
          
          {Object.entries(results).length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">Click a test button to see results</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(results).map(([key, result]) => (
              <Card key={key} className="max-h-96 flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)} Data</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result)}
                      <Badge variant={result.error ? "destructive" : "default"}>
                        {result.count} records
                      </Badge>
                    </div>
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {result.endpoint} • {formatTimestamp(result.timestamp)}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  {result.error ? (
                    <div className="text-red-600 bg-red-50 p-3 rounded">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      <strong>Error:</strong> {result.error}
                    </div>
                  ) : result.data ? (
                    <div className="h-full overflow-auto">
                      <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No data to display
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {Object.keys(results).length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-primary-brown">Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(results).filter(r => !r.error && !r.loading).length}
                </div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(results).filter(r => r.error).length}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(results).filter(r => r.loading).length}
                </div>
                <div className="text-sm text-muted-foreground">Loading</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-brown">
                  {Object.values(results).reduce((sum, r) => sum + r.count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Usage Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-primary-brown">How to Use This Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>• <strong>Test All:</strong> Click "Test All Endpoints" to verify all APIs</div>
          <div>• <strong>Individual Tests:</strong> Click each endpoint button to test specific data</div>
          <div>• <strong>Data Verification:</strong> Check the JSON output for correct data structure</div>
          <div>• <strong>Error Handling:</strong> Red indicators show failed requests with error details</div>
          <div>• <strong>Record Counts:</strong> Verify expected number of teams (8), players (~160), games (22)</div>
          <div>• <strong>Relationships:</strong> Check that games include team data, players include team refs</div>
        </CardContent>
      </Card>
    </div>
  )
}