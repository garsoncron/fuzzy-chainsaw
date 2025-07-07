import React from 'react'
import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'

import '../(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Scorekeeper - Cowtown Showdown',
  description: 'Scorekeeper interface for the Cowtown Showdown lacrosse tournament',
  robots: 'noindex,nofollow',
}

export default function ScorekeeperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}