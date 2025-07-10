'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * @description Session timer component for scorekeeper authentication
 * @dependencies UI components, React hooks
 * @accessibility ARIA live regions for screen readers
 * @security Automatic session extension and expiry handling
 */

interface SessionTimerProps {
  initialTimeRemaining: number // seconds
  onSessionExpired: () => void
  onExtendSession: () => Promise<void>
  className?: string
}

export function SessionTimer({ 
  initialTimeRemaining, 
  onSessionExpired, 
  onExtendSession,
  className = ''
}: SessionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining)
  const [isExtending, setIsExtending] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (timeRemaining <= 0) {
      onSessionExpired()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1
        
        // Show warning when 5 minutes remain
        if (newTime <= 300 && !showWarning) {
          setShowWarning(true)
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, onSessionExpired, showWarning])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleExtendSession = async () => {
    setIsExtending(true)
    try {
      await onExtendSession()
      setTimeRemaining(14400) // Reset to 4 hours
      setShowWarning(false)
    } catch (error) {
      console.error('Failed to extend session:', error)
    } finally {
      setIsExtending(false)
    }
  }

  const getVariant = () => {
    if (timeRemaining <= 300) return 'destructive' // 5 minutes
    if (timeRemaining <= 900) return 'warning' // 15 minutes
    return 'default'
  }

  const getStatusColor = () => {
    if (timeRemaining <= 300) return 'text-red-600'
    if (timeRemaining <= 900) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <Card className={`${className} ${showWarning ? 'border-yellow-500' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Session Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time remaining:</span>
            <span 
              className={`text-lg font-mono font-bold ${getStatusColor()}`}
              aria-live="polite"
              aria-label={`Session expires in ${formatTime(timeRemaining)}`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          {showWarning && (
            <Alert variant="destructive" className="border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your session will expire soon. Extend it to continue working.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={handleExtendSession}
              disabled={isExtending}
              variant={showWarning ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
            >
              {isExtending ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                  Extending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Extend Session
                </>
              )}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            Sessions automatically extend with activity. Click extend to add 4 hours.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}