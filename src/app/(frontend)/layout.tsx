import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'

import './globals.css'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <Providers>
      <AdminBar
        adminBarProps={{
          preview: isEnabled,
        }}
      />
      <Header />
      {children}
      <Footer />
    </Providers>
  )
}

