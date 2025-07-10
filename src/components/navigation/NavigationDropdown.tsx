'use client'

import React, { useEffect, useState, useRef } from 'react'
import { ChevronDown, X, Trophy, Calendar, Activity, BarChart, Info, User, Medal, Video, Star, Camera, Search, Users } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

/**
 * @description Custom hook for managing dropdown interactions
 * @accessibility Handles keyboard navigation and click outside behavior
 * @performance Optimized event listeners with cleanup
 */
const useDropdownInteraction = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return {
    isOpen,
    setIsOpen,
    isMobile,
    dropdownRef,
  }
}

/**
 * @description Individual navigation item component
 * @accessibility Full ARIA labeling and keyboard support
 * @performance Memoized to prevent unnecessary re-renders
 */
const NavigationItem = React.memo(({ 
  item, 
  icon: Icon 
}: { 
  item: {
    label: string
    href: string
    badge?: string
    isLive?: boolean
    isPDF?: boolean
  }
  icon: React.ComponentType<{ className?: string; size?: number }>
}) => (
  <li className="group">
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
        "hover:bg-[#934F25]/10 hover:text-[#934F25]",
        "focus:outline-none focus:ring-2 focus:ring-[#934F25]/20",
        "group-hover:translate-x-1"
      )}
    >
      <Icon className="w-5 h-5 text-[#934F25]/70" />
      <div className="flex-1">
        <span className="block font-medium text-gray-900">
          {item.label}
        </span>
      </div>
      {item.badge && (
        <Badge 
          variant="secondary" 
          className="text-xs bg-[#D6AC4D]/20 text-[#5E2713] border-[#D6AC4D]/40"
        >
          {item.badge}
        </Badge>
      )}
      {item.isLive && (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      )}
      {item.isPDF && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          PDF
        </span>
      )}
    </Link>
  </li>
))

NavigationItem.displayName = 'NavigationItem'

/**
 * @description Section component for organizing navigation items
 * @accessibility Proper heading structure and list semantics
 * @performance Optimized rendering with conditional content
 */
const NavigationSection = React.memo(({
  title,
  items,
  icon: Icon,
  content,
}: {
  title: string
  items?: {
    label: string
    href: string
    badge?: string
    isLive?: boolean
    isPDF?: boolean
  }[]
  icon: React.ComponentType<{ className?: string; size?: number }>
  content?: string
}) => (
  <div className="p-4 border-r border-gray-100 last:border-r-0">
    <div className="flex items-center gap-2 mb-4 text-[#934F25]">
      <Icon className="w-5 h-5" />
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    
    {items ? (
      <ul className="space-y-1">
        {items.map((item, index) => (
          <NavigationItem key={index} item={item} icon={Icon} />
        ))}
      </ul>
    ) : (
      <div className="text-gray-600">
        {content === 'LiveGameCard' && (
          <div className="bg-[#934F25]/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="font-medium">Live Game</span>
            </div>
            <p className="text-sm text-gray-600">No live games currently</p>
          </div>
        )}
        {content === 'TeamLogoGrid' && (
          <div className="grid grid-cols-2 gap-3">
            {['Team A', 'Team B', 'Team C', 'Team D'].map((team, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="w-8 h-8 bg-[#934F25]/20 rounded-full mx-auto mb-2" />
                <span className="text-sm font-medium">{team}</span>
              </div>
            ))}
          </div>
        )}
        {content === 'StatsLeaders' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Goals Leader</span>
              <span className="font-medium">Player A (12)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Assists Leader</span>
              <span className="font-medium">Player B (8)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Saves Leader</span>
              <span className="font-medium">Goalie C (45)</span>
            </div>
          </div>
        )}
        {content === 'MediaGrid' && (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
))

NavigationSection.displayName = 'NavigationSection'

/**
 * @description Main navigation dropdown component with mega menu
 * @dependencies useDropdownInteraction hook, NavigationSection component
 * @accessibility Full keyboard navigation, ARIA attributes, focus management
 * @performance Optimized hover behavior and smooth transitions
 */
export const NavigationDropdown = ({ 
  label, 
  menuType 
}: { 
  label: string
  menuType: 'tournament' | 'teams' | 'games' | 'stats' | 'media'
}) => {
  const { isOpen, setIsOpen, isMobile, dropdownRef } = useDropdownInteraction()

  const getMenuConfig = () => {
    switch (menuType) {
      case 'tournament':
        return {
          columns: [
            {
              title: "Quick Access",
              icon: Trophy,
              items: [
                { label: "Tournament Overview", href: "/tournament" },
                { label: "Today's Schedule", href: "/tournament/schedule", badge: "6 games" },
                { label: "Live Games", href: "/games/live", isLive: true },
                { label: "Current Standings", href: "/tournament/standings" },
                { label: "Tournament Rules", href: "/rules.pdf", isPDF: true }
              ]
            },
            {
              title: "Information",
              icon: Info,
              items: [
                { label: "5-Point System Explained", href: "/tournament/rules#scoring" },
                { label: "Venue Information", href: "/tournament/venue" },
                { label: "Schedule Download", href: "/schedule.pdf", isPDF: true },
                { label: "Contact Information", href: "/contact" }
              ]
            },
            {
              title: "Featured",
              icon: Activity,
              content: "LiveGameCard"
            }
          ]
        }
      case 'teams':
        return {
          columns: [
            {
              title: "All Teams",
              icon: Users,
              content: "TeamLogoGrid"
            },
            {
              title: "Team Tools",
              icon: Search,
              items: [
                { label: "Compare Teams", href: "/teams/compare" },
                { label: "Roster Search", href: "/teams/search" },
                { label: "Team Statistics", href: "/teams/stats" },
                { label: "Head-to-Head", href: "/teams/head-to-head" }
              ]
            },
            {
              title: "Quick Stats",
              icon: BarChart,
              content: "TeamStandingsPreview"
            }
          ]
        }
      case 'games':
        return {
          columns: [
            {
              title: "Live Games",
              icon: Activity,
              content: "LiveGamesList"
            },
            {
              title: "Schedule",
              icon: Calendar,
              items: [
                { label: "Today's Games", href: "/games/today", badge: "6" },
                { label: "Tomorrow's Games", href: "/games/tomorrow", badge: "4" },
                { label: "Full Schedule", href: "/tournament/schedule" }
              ]
            },
            {
              title: "Results",
              icon: BarChart,
              content: "RecentResults"
            }
          ]
        }
      case 'stats':
        return {
          columns: [
            {
              title: "Leaders",
              icon: Trophy,
              content: "StatsLeaders"
            },
            {
              title: "Categories",
              icon: BarChart,
              items: [
                { label: "Player Statistics", href: "/stats/players" },
                { label: "Team Statistics", href: "/stats/teams" },
                { label: "Goalie Statistics", href: "/stats/goalies" },
                { label: "Advanced Metrics", href: "/stats/advanced" }
              ]
            },
            {
              title: "Records",
              icon: Medal,
              items: [
                { label: "Tournament Records", href: "/stats/records" },
                { label: "Individual Achievements", href: "/stats/achievements" },
                { label: "Team Milestones", href: "/stats/milestones" }
              ]
            }
          ]
        }
      case 'media':
        return {
          columns: [
            {
              title: "Latest",
              icon: Camera,
              content: "MediaGrid"
            },
            {
              title: "Highlights",
              icon: Video,
              items: [
                { label: "Game Highlights", href: "/media/highlights" },
                { label: "Player Spotlights", href: "/media/players" },
                { label: "Behind the Scenes", href: "/media/behind-scenes" }
              ]
            },
            {
              title: "Social",
              icon: Star,
              content: "SocialFeed"
            }
          ]
        }
      default:
        return { columns: [] }
    }
  }

  const menuConfig = getMenuConfig()

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium",
          "hover:bg-[#934F25]/10 hover:text-[#934F25] transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-[#934F25]/20",
          isOpen ? "bg-[#934F25]/10 text-[#934F25]" : "text-muted-foreground"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen ? "rotate-180" : ""
        )} />
      </Button>

      <div
        className={cn(
          "absolute left-0 mt-2 bg-white shadow-2xl rounded-lg border border-gray-200 z-50",
          "transition-all duration-300 ease-out transform origin-top",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-2 pointer-events-none",
          isMobile 
            ? "w-screen max-w-sm -translate-x-4" 
            : "w-[900px] max-w-[90vw]"
        )}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        {/* Mobile close button */}
        {isMobile && (
          <div className="flex justify-end p-4 border-b border-gray-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Menu content */}
        <div className={cn(
          "p-2",
          isMobile 
            ? "space-y-2" 
            : `grid grid-cols-${menuConfig.columns.length} gap-0`
        )}>
          {menuConfig.columns.map((section, index) => (
            <NavigationSection key={index} {...section} />
          ))}
        </div>
      </div>
    </div>
  )
}