import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

interface HeaderProps {
  liveGamesCount?: number
  nextGameTime?: string
  showLiveIndicator?: boolean
}

/**
 * @description Server component wrapper for header with CMS data fetching
 * @dependencies getCachedGlobal utility, HeaderClient component
 * @notes Fetches header navigation data from Payload CMS global with enhanced field structure
 * Debug mode active - check console for header data structure
 */
export async function Header({ 
  liveGamesCount, 
  nextGameTime, 
  showLiveIndicator 
}: HeaderProps = {}) {
  const headerData: Header = await getCachedGlobal('header', 2)()

  return (
    <HeaderClient 
      data={headerData} 
      liveGamesCount={liveGamesCount}
      nextGameTime={nextGameTime}
      showLiveIndicator={showLiveIndicator}
    />
  )
}
