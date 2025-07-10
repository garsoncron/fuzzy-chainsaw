'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import type { Header } from '@/payload-types'
import { LiveGameIndicator, LiveGameIndicatorCompact } from '@/components/ui/LiveGameIndicator'
import { resolveLinkUrl } from '@/utilities/resolveLinkUrl'

interface HeaderClientProps {
  data: Header
  liveGamesCount?: number
  nextGameTime?: string
  showLiveIndicator?: boolean
}

/**
 * @description
 * Enhanced header client component with western theme, responsive navigation, and CMS integration.
 * Features desktop navigation menu with dropdown support and mobile slide-out menu.
 * Maintains Cowtown Showdown branding with western/Calgary Stampede theme.
 *
 * @dependencies useHeaderTheme provider, Headless UI components, resolveLinkUrl utility
 * @accessibility Full ARIA labeling and keyboard navigation support
 * @performance Optimized state management and theme switching
 */
export const HeaderClient: React.FC<HeaderClientProps> = ({ 
  data, 
  liveGamesCount = 0,
  nextGameTime,
  showLiveIndicator = true 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const _pathname = usePathname()

  // Mock navigation when no CMS data
  const fallbackNavigation = [
    { title: 'Tournament', href: '/tournament', subItems: [
      { name: 'Schedule', href: '/tournament/schedule' },
      { name: 'Standings', href: '/tournament/standings' },
      { name: 'Rules', href: '/tournament/rules' }
    ]},
    { title: 'Teams', href: '/teams', subItems: [] },
    { title: 'Games', href: '/games', subItems: [
      { name: 'All Games', href: '/games' },
      { name: 'Live Dashboard', href: '/games/live' }
    ]},
    { title: 'Media', href: '/media', subItems: [] }
  ]

  const navigation = data.headerColumns && data.headerColumns.length > 0 
    ? data.headerColumns 
    : fallbackNavigation.map((item, index) => ({
        id: `fallback-${index}`,
        title: { 
          title: item.title, 
          enableLink: true, 
          link: { 
            type: 'custom', 
            url: item.href,
            label: item.title
          } 
        },
        subMenuItems: item.subItems.length > 0 ? item.subItems.map((sub, subIndex) => ({
          id: `fallback-sub-${index}-${subIndex}`,
          linkText: sub.name,
          link: { 
            type: 'custom', 
            url: sub.href,
            label: sub.name
          }
        })) : null
      }))


  return (
    <header className="bg-white border-b border-gray-200">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Cowtown Showdown</span>
            {data.logo && typeof data.logo === 'object' && data.logo.url ? (
              <Image
                alt="Cowtown Showdown"
                src={data.logo.url}
                className="h-8 w-auto"
                width={140}
                height={32}
                priority
              />
            ) : (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-indigo-600 rounded"></div>
                <span className="font-bold text-gray-900">COWTOWN SHOWDOWN</span>
              </div>
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Desktop navigation */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {navigation.map((column) => (
            <div key={column.id}>
              {column.subMenuItems && Array.isArray(column.subMenuItems) && column.subMenuItems.length > 0 ? (
                <Popover className="relative">
                  <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                    {column.title?.title}
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                  </PopoverButton>

                  <PopoverPanel
                    transition
                    className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="p-4">
                      {column.subMenuItems.map((item) => (
                        <div
                          key={item.id}
                          className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                        >
                          <div className="flex-auto">
                            <Link href={resolveLinkUrl(item.link)} className="block font-semibold text-gray-900">
                              {item.linkText}
                              <span className="absolute inset-0" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverPanel>
                </Popover>
              ) : (
                <Link href={resolveLinkUrl(column.title?.link)} className="text-sm/6 font-semibold text-gray-900">
                  {column.title?.title}
                </Link>
              )}
            </div>
          ))}
        </PopoverGroup>

        {/* Right side - Live indicator and CTA */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {showLiveIndicator && (
            <LiveGameIndicator 
              liveGamesCount={liveGamesCount}
              nextGameTime={nextGameTime}
              size="small"
            />
          )}
          <Link 
            href={data.cta?.link ? resolveLinkUrl(data.cta.link) : '/tournament/schedule'} 
            className="text-sm/6 font-semibold text-gray-900"
          >
            {data.cta?.ctaText || 'View Schedule'} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Cowtown Showdown</span>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-indigo-600 rounded"></div>
                <span className="font-bold text-gray-900">COWTOWN</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((column) => (
                  <div key={column.id}>
                    {column.subMenuItems && Array.isArray(column.subMenuItems) && column.subMenuItems.length > 0 ? (
                      <Disclosure as="div" className="-mx-3">
                        <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                          {column.title?.title}
                          <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-[open]:rotate-180" />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2 space-y-2">
                          {column.subMenuItems.map((item) => (
                            <DisclosureButton
                              key={item.id}
                              as={Link}
                              href={resolveLinkUrl(item.link)}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.linkText}
                            </DisclosureButton>
                          ))}
                        </DisclosurePanel>
                      </Disclosure>
                    ) : (
                      <Link
                        href={resolveLinkUrl(column.title?.link)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {column.title?.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="py-6">
                {showLiveIndicator && liveGamesCount > 0 && (
                  <div className="mb-4">
                    <LiveGameIndicatorCompact 
                      liveGamesCount={liveGamesCount}
                      nextGameTime={nextGameTime}
                    />
                  </div>
                )}
                <Link
                  href={data.cta?.link ? resolveLinkUrl(data.cta.link) : '/tournament/schedule'}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {data.cta?.ctaText || 'View Schedule'}
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}