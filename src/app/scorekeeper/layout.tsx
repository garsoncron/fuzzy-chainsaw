import React from 'react'
import type { Metadata } from 'next'

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
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <div className="min-h-screen">
          <header className="bg-amber-900 text-white p-4">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">Cowtown Showdown - Scorekeeper</h1>
            </div>
          </header>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}