/**
 * @description Wrapper for GameCard to handle type compatibility during development
 */

'use client'

import React from 'react'
import { GameCard } from './GameCard'

// Basic type definitions for compatibility
type Team = {
  id: string
  name: string
  city: string
  province?: string
  slug: string
  primaryColor?: string
  secondaryColor?: string
}

type Game = {
  id: string
  gameNumber: string
  gameType: 'pool' | 'medal'
  day: string
  scheduledTime: string
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  homeTeam: string | Team
  awayTeam: string | Team
  homeScore: number
  awayScore: number
  currentPeriod?: string
  periodTimeRemaining?: number
  totalGamePoints?: {
    home: number
    away: number
  }
  threeStars?: {
    first?: string
    second?: string
    third?: string
  }
  youtubeUrl?: string
  slug?: string
}

interface GameCardWrapperProps {
  game: Game
  showDay?: boolean
  showTournamentPoints?: boolean
  showThreeStars?: boolean
  compact?: boolean
  className?: string
}

export function GameCardWrapper(props: GameCardWrapperProps) {
  // Convert game to expected format
  const gameWithTeams = {
    ...props.game,
    homeTeam: typeof props.game.homeTeam === 'object' ? props.game.homeTeam : {
      id: props.game.homeTeam,
      name: 'TBD',
      city: '',
      slug: ''
    },
    awayTeam: typeof props.game.awayTeam === 'object' ? props.game.awayTeam : {
      id: props.game.awayTeam,
      name: 'TBD',
      city: '',
      slug: ''
    },
    slug: props.game.slug || props.game.id
  }

  // Pass through to actual GameCard component
  return <GameCard {...props} game={gameWithTeams as any} />
}