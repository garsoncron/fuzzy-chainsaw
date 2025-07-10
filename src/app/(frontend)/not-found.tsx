import Link from 'next/link'
import React from 'react'
import { 
  Calendar, 
  Trophy, 
  Users, 
  BarChart3,
  Home,
  Instagram,
  Facebook,
  Twitter,
  ChevronRight
} from 'lucide-react'

import { Button } from '@/components/ui/button'

const links = [
  {
    name: 'Tournament Schedule',
    href: '/schedule',
    description: 'View all 22 games across 3 days of competition.',
    icon: Calendar,
  },
  {
    name: 'Teams & Rosters',
    href: '/teams',
    description: 'Meet the 8 teams competing for the championship.',
    icon: Users,
  },
  {
    name: 'Live Standings',
    href: '/standings',
    description: 'Track team rankings with our 5-point tournament system.',
    icon: Trophy,
  },
  {
    name: 'Tournament Stats',
    href: '/tournament',
    description: 'Player stats, game highlights, and three stars.',
    icon: BarChart3,
  },
]

const social = [
  {
    name: 'Instagram',
    href: '#',
    icon: Instagram,
  },
  {
    name: 'Facebook', 
    href: '#',
    icon: Facebook,
  },
  {
    name: 'Twitter',
    href: '#',
    icon: Twitter,
  },
]

export default function NotFound() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-6 pt-10 pb-16 sm:pb-24 lg:px-8">
        {/* Western-styled logo placeholder */}
        <div className="mx-auto h-16 w-auto sm:h-20 flex items-center justify-center">
          <div className="text-4xl font-bold text-[hsl(var(--primary-brown))] sm:text-5xl font-western">
            🤠 COWTOWN SHOWDOWN
          </div>
        </div>
        
        <div className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <p className="text-base/8 font-semibold text-[hsl(var(--primary-brown))]">404</p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-balance text-[hsl(var(--dark-brown))] sm:text-6xl font-western">
            Well, partner, this trail&apos;s gone cold
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">
            Looks like this page wandered off into the prairie. Don&apos;t worry, we&apos;ll get you back to the action faster than a faceoff win.
          </p>
        </div>
        
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">Tournament pages</h2>
          <ul role="list" className="-mt-6 divide-y divide-gray-200 border-b border-gray-200 bg-white/50 backdrop-blur-sm rounded-lg shadow-lg">
            {links.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex gap-x-6 py-6 px-6 hover:bg-[hsl(var(--golden))]/10 transition-colors">
                <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-[hsl(var(--primary-brown))] shadow-sm">
                  <link.icon className="size-6 text-white" />
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm/6 font-semibold text-[hsl(var(--dark-brown))]">
                    <Link href={link.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {link.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm/6 text-gray-600">{link.description}</p>
                </div>
                <div className="flex-none self-center">
                  <ChevronRight className="size-5 text-[hsl(var(--primary-brown))]" />
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-10 flex justify-center">
            <Button asChild className="bg-[hsl(var(--primary-brown))] hover:bg-[hsl(var(--dark-brown))] text-white">
              <Link href="/">
                <Home className="mr-2 size-4" />
                Back to the ranch
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 bg-white/30 backdrop-blur-sm py-6 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 sm:flex-row lg:px-8">
          <p className="text-sm/7 text-gray-600">
            &copy; 2024 Cowtown Showdown. Proudly supporting Senior Men&apos;s Box Lacrosse.
          </p>
          <div className="hidden sm:block sm:h-7 sm:w-px sm:flex-none sm:bg-gray-300" />
          <div className="flex gap-x-4">
            {social.map((item, itemIdx) => (
              <a key={itemIdx} href={item.href} className="text-gray-500 hover:text-[hsl(var(--primary-brown))] transition-colors">
                <span className="sr-only">{item.name}</span>
                <item.icon className="size-6" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
