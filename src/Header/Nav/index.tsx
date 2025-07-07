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
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1">
        {navItems.map(({ link }, i) => {
          const isActive = link?.url ? isActiveLink(link.url) : false
          return (
            <div key={i} className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              "hover:bg-[#934F25]/10 hover:text-[#934F25]",
              isActive
                ? "bg-[#934F25]/20 text-[#934F25]"
                : "text-muted-foreground"
            )}>
              <CMSLink {...link} appearance="link" className="no-underline" />
            </div>
          )
        })}
        
        {/* Search Button */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="ml-2 hover:bg-[#934F25]/10 hover:text-[#934F25]"
        >
          <Link href="/search" aria-label="Search tournament">
            <Search className="h-4 w-4" />
          </Link>
        </Button>
      </nav>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden hover:bg-[#934F25]/10 hover:text-[#934F25]"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-[#934F25]/20 shadow-lg">
          <nav className="container mx-auto px-4 py-4 space-y-2">
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
            
            {/* Mobile Search Link */}
            <Link
              href="/search"
              className="flex items-center px-3 py-2 text-base font-medium text-muted-foreground rounded-md hover:bg-[#934F25]/10 hover:text-[#934F25] transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
