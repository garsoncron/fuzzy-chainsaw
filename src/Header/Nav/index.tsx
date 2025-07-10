'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'

/**
 * @description Enhanced navigation component with mobile menu and western theme styling
 * @dependencies CMSLink, Button from shadcn/ui, Lucide icons, Next.js navigation
 * @accessibility Full keyboard navigation, ARIA labels, mobile menu management
 * @performance Optimized mobile menu state and route change handling
 */
export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-[#934F25]/10 hover:text-[#934F25]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile Menu Slide-out Panel */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-[#934F25]/20 shadow-2xl z-50 transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#934F25]/20">
                <h2 className="text-lg font-bold text-[#934F25] font-western">
                  COWTOWN SHOWDOWN
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:bg-[#934F25]/10 hover:text-[#934F25]"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* Tournament Section */}
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-[#934F25] uppercase tracking-wide mb-2">
                    Tournament
                  </div>
                  <Link
                    href="/tournament"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/tournament/schedule"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Schedule
                  </Link>
                  <Link
                    href="/tournament/standings"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Standings
                  </Link>
                </div>

                {/* Teams Section */}
                <div className="space-y-1 pt-4">
                  <div className="text-sm font-semibold text-[#934F25] uppercase tracking-wide mb-2">
                    Teams
                  </div>
                  <Link
                    href="/teams"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    All Teams
                  </Link>
                  <Link
                    href="/teams/compare"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Compare Teams
                  </Link>
                </div>

                {/* Games Section */}
                <div className="space-y-1 pt-4">
                  <div className="text-sm font-semibold text-[#934F25] uppercase tracking-wide mb-2">
                    Games
                  </div>
                  <Link
                    href="/games/live"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Live Games
                  </Link>
                  <Link
                    href="/games/today"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Today&apos;s Games
                  </Link>
                  <Link
                    href="/games/results"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Results
                  </Link>
                </div>

                {/* Stats Section */}
                <div className="space-y-1 pt-4">
                  <div className="text-sm font-semibold text-[#934F25] uppercase tracking-wide mb-2">
                    Statistics
                  </div>
                  <Link
                    href="/stats/players"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Player Stats
                  </Link>
                  <Link
                    href="/stats/teams"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Team Stats
                  </Link>
                </div>

                {/* Media Section */}
                <div className="space-y-1 pt-4">
                  <div className="text-sm font-semibold text-[#934F25] uppercase tracking-wide mb-2">
                    Media
                  </div>
                  <Link
                    href="/media/highlights"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Highlights
                  </Link>
                  <Link
                    href="/media/photos"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                  >
                    Photos
                  </Link>
                </div>

                {/* Legacy CMS Navigation Items */}
                {navItems.length > 0 && (
                  <div className="space-y-1 pt-4 border-t border-[#934F25]/20">
                    <div className="text-sm font-semibold text-[#934F25] uppercase tracking-wide mb-2">
                      More
                    </div>
                    {navItems.map(({ link }, i) => {
                      const isActive = link?.url ? isActiveLink(link.url) : false
                      return (
                        <div
                          key={i}
                          className={cn(
                            "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                            "hover:bg-[#934F25]/10 hover:text-[#934F25]",
                            isActive
                              ? "bg-[#934F25]/20 text-[#934F25]"
                              : "text-muted-foreground"
                          )}
                        >
                          <CMSLink {...link} appearance="link" className="no-underline" />
                        </div>
                      )
                    })}
                  </div>
                )}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-[#934F25]/20">
                <Link
                  href="/search"
                  className="flex items-center px-3 py-2 text-base font-medium text-muted-foreground rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Tournament
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
