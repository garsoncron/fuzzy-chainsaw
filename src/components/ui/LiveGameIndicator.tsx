'use client'

import React from 'react'
import { Activity, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/cn'

/**
 * @description Live game indicator component with pulsing animation
 * @accessibility Proper ARIA labels and semantic markup
 * @performance Optimized animation with CSS transforms
 */
export const LiveGameIndicator = ({
  liveGamesCount = 0,
  nextGameTime,
  className,
  showText = true,
  size = 'default'
}: {
  liveGamesCount?: number
  nextGameTime?: string
  className?: string
  showText?: boolean
  size?: 'small' | 'default' | 'large'
}) => {
  const hasLiveGames = liveGamesCount > 0
  const hasNextGame = Boolean(nextGameTime)

  if (!hasLiveGames && !hasNextGame) {
    return null
  }

  const sizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base'
  }

  const dotSizeClasses = {
    small: 'w-1.5 h-1.5',
    default: 'w-2 h-2',
    large: 'w-2.5 h-2.5'
  }

  return (
    <div className={cn(
      "flex items-center gap-4",
      sizeClasses[size],
      className
    )}>
      {/* Live Games Indicator */}
      {hasLiveGames && (
        <Badge 
          variant="default" 
          className={cn(
            "bg-red-600 text-white border-red-600",
            "animate-pulse transition-all duration-300",
            "hover:bg-red-700 hover:scale-105",
            sizeClasses[size]
          )}
          aria-label={`${liveGamesCount} live ${liveGamesCount === 1 ? 'game' : 'games'}`}
        >
          <div className={cn(
            "bg-white rounded-full mr-2",
            dotSizeClasses[size]
          )} />
          <Activity className="w-3 h-3 mr-1" />
          {showText && (
            <>
              {liveGamesCount} Live {liveGamesCount === 1 ? 'Game' : 'Games'}
            </>
          )}
        </Badge>
      )}

      {/* Next Game Time */}
      {hasNextGame && (
        <div className={cn(
          "flex items-center text-muted-foreground",
          "transition-colors duration-200 hover:text-[#934F25]",
          sizeClasses[size]
        )}>
          <Clock className="w-4 h-4 mr-2" />
          {showText && (
            <span>Next: {nextGameTime}</span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * @description Compact version for mobile header
 * @accessibility Maintains semantic meaning in smaller space
 * @performance Optimized for mobile rendering
 */
export const LiveGameIndicatorCompact = ({
  liveGamesCount = 0,
  nextGameTime,
  className
}: {
  liveGamesCount?: number
  nextGameTime?: string
  className?: string
}) => {
  const hasLiveGames = liveGamesCount > 0
  const hasNextGame = Boolean(nextGameTime)

  if (!hasLiveGames && !hasNextGame) {
    return null
  }

  return (
    <div className={cn(
      "flex items-center gap-2 text-xs",
      className
    )}>
      {hasLiveGames && (
        <Badge 
          variant="default" 
          className="bg-red-600 text-white animate-pulse px-2 py-1"
          aria-label={`${liveGamesCount} live games`}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full mr-1" />
          {liveGamesCount} Live
        </Badge>
      )}

      {hasNextGame && (
        <div className="flex items-center text-muted-foreground">
          <Clock className="w-3 h-3 mr-1" />
          <span className="truncate max-w-[100px]">
            {nextGameTime}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * @description Simple pulsing dot indicator
 * @accessibility Screen reader friendly with proper labeling
 * @performance Minimal DOM and CSS for maximum performance
 */
export const LiveGameDot = ({
  isLive = false,
  size = 'default',
  className
}: {
  isLive?: boolean
  size?: 'small' | 'default' | 'large'
  className?: string
}) => {
  if (!isLive) {
    return null
  }

  const sizeClasses = {
    small: 'w-2 h-2',
    default: 'w-3 h-3',
    large: 'w-4 h-4'
  }

  return (
    <div 
      className={cn(
        "bg-red-500 rounded-full animate-pulse",
        sizeClasses[size],
        className
      )}
      aria-label="Live game indicator"
      role="status"
    />
  )
}