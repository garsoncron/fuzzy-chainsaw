'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Trophy, Clock } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/cn'

interface HeaderClientProps {
  data: Header
  liveGamesCount?: number
  nextGameTime?: string
  showLiveIndicator?: boolean
}

/**
 * @description Enhanced header client component with western theme and live tournament features
 * @dependencies useHeaderTheme provider, Badge from shadcn/ui, Lucide icons
 * @accessibility Full ARIA labeling and keyboard navigation support
 * @performance Optimized state management and theme switching
 */
export const HeaderClient: React.FC<HeaderClientProps> = ({ 
  data, 
  liveGamesCount = 0,
  nextGameTime,
  showLiveIndicator = true 
}) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b border-[#934F25]/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "shadow-sm"
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Tournament Branding */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            aria-label="Cowtown Showdown Home"
          >
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-[#D6AC4D]" />
              <div>
                <h1 className="text-lg font-bold text-[#934F25] leading-tight">
                  Cowtown Showdown
                </h1>
                <p className="text-xs text-muted-foreground">
                  Senior Men's Lacrosse
                </p>
              </div>
            </div>
          </Link>

          {/* Live Tournament Status - Desktop */}
          {showLiveIndicator && (
            <div className="hidden md:flex items-center space-x-4">
              {liveGamesCount > 0 && (
                <Badge 
                  variant="default" 
                  className="bg-red-600 text-white animate-pulse"
                >
                  <div className="w-2 h-2 bg-white rounded-full mr-2" />
                  {liveGamesCount} Live Game{liveGamesCount !== 1 ? 's' : ''}
                </Badge>
              )}
              
              {nextGameTime && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  Next: {nextGameTime}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <HeaderNav data={data} />
        </div>

        {/* Live Status Bar - Mobile */}
        {showLiveIndicator && (liveGamesCount > 0 || nextGameTime) && (
          <div className="md:hidden py-2 border-t border-border/40">
            <div className="flex items-center justify-between text-sm">
              {liveGamesCount > 0 && (
                <Badge 
                  variant="default" 
                  className="bg-red-600 text-white animate-pulse text-xs"
                >
                  <div className="w-2 h-2 bg-white rounded-full mr-1" />
                  {liveGamesCount} Live
                </Badge>
              )}
              
              {nextGameTime && (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  Next: {nextGameTime}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
