/**
 * @description Tournament point calculation utilities for the 5-point system
 * @dependencies Payload types
 * @notes Implements RMLL-style tournament point system with period scoring
 */

export interface PeriodScore {
  home: number
  away: number
}

export interface GamePeriodScores {
  period1: PeriodScore
  period2: PeriodScore
  period3: PeriodScore
}

export interface TournamentPoints {
  periodPoints: {
    home: number
    away: number
  }
  finalGamePoints: {
    home: number
    away: number
  }
  totalPoints: {
    home: number
    away: number
  }
}

/**
 * Calculate period points based on period scores
 * 1 point for period win, 0.5 points for period tie, 0 points for period loss
 */
export function calculatePeriodPoints(
  period1Home: number,
  period1Away: number,
  period2Home: number,
  period2Away: number,
  period3Home: number,
  period3Away: number
): { home: number; away: number } {
  let homePoints = 0
  let awayPoints = 0

  // Period 1
  if (period1Home > period1Away) {
    homePoints += 1
  } else if (period1Away > period1Home) {
    awayPoints += 1
  } else {
    homePoints += 0.5
    awayPoints += 0.5
  }

  // Period 2
  if (period2Home > period2Away) {
    homePoints += 1
  } else if (period2Away > period2Home) {
    awayPoints += 1
  } else {
    homePoints += 0.5
    awayPoints += 0.5
  }

  // Period 3
  if (period3Home > period3Away) {
    homePoints += 1
  } else if (period3Away > period3Home) {
    awayPoints += 1
  } else {
    homePoints += 0.5
    awayPoints += 0.5
  }

  return { home: homePoints, away: awayPoints }
}

/**
 * Calculate final game points based on total score
 * 2 points for win, 1 point for tie, 0 points for loss
 */
export function calculateFinalGamePoints(
  homeScore: number,
  awayScore: number
): { home: number; away: number } {
  if (homeScore > awayScore) {
    return { home: 2, away: 0 }
  } else if (awayScore > homeScore) {
    return { home: 0, away: 2 }
  } else {
    return { home: 1, away: 1 }
  }
}

/**
 * Calculate complete tournament points for a game
 * Maximum 5 points per team per game
 */
export function calculateTournamentPoints(
  homeScore: number,
  awayScore: number,
  period1Home: number,
  period1Away: number,
  period2Home: number,
  period2Away: number,
  period3Home: number,
  period3Away: number
): TournamentPoints {
  const periodPoints = calculatePeriodPoints(
    period1Home,
    period1Away,
    period2Home,
    period2Away,
    period3Home,
    period3Away
  )

  const finalGamePoints = calculateFinalGamePoints(homeScore, awayScore)

  const totalPoints = {
    home: periodPoints.home + finalGamePoints.home,
    away: periodPoints.away + finalGamePoints.away,
  }

  return {
    periodPoints,
    finalGamePoints,
    totalPoints,
  }
}

/**
 * Calculate goal average for tiebreaker purposes
 * Goal average = Goals For ÷ (Goals For + Goals Against)
 */
export function calculateGoalAverage(goalsFor: number, goalsAgainst: number): number {
  const totalGoals = goalsFor + goalsAgainst
  if (totalGoals === 0) return 0
  return goalsFor / totalGoals
}

/**
 * Calculate standings for all teams based on their games
 */
export interface TeamRecord {
  teamId: string
  teamName: string
  gamesPlayed: number
  wins: number
  losses: number
  ties: number
  tournamentPoints: number
  goalsFor: number
  goalsAgainst: number
  goalDifferential: number
  goalAverage: number
  periodWins: number
  periodLosses: number
  periodTies: number
}

export function sortStandings(teams: TeamRecord[]): TeamRecord[] {
  return teams.sort((a, b) => {
    // Primary: Tournament points (descending)
    if (a.tournamentPoints !== b.tournamentPoints) {
      return b.tournamentPoints - a.tournamentPoints
    }

    // Tiebreaker 1: Goal average (descending)
    if (a.goalAverage !== b.goalAverage) {
      return b.goalAverage - a.goalAverage
    }

    // Tiebreaker 2: Goal differential (descending)
    if (a.goalDifferential !== b.goalDifferential) {
      return b.goalDifferential - a.goalDifferential
    }

    // Tiebreaker 3: Goals for (descending)
    if (a.goalsFor !== b.goalsFor) {
      return b.goalsFor - a.goalsFor
    }

    // Final tiebreaker: Alphabetical by team name
    return a.teamName.localeCompare(b.teamName)
  })
}

/**
 * Validate period scores don't exceed total game score
 */
export function validatePeriodScores(
  totalHomeScore: number,
  totalAwayScore: number,
  period1Home: number,
  period1Away: number,
  period2Home: number,
  period2Away: number,
  period3Home: number,
  period3Away: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  const periodTotalHome = period1Home + period2Home + period3Home
  const periodTotalAway = period1Away + period2Away + period3Away

  if (periodTotalHome > totalHomeScore) {
    errors.push('Home period goals exceed total home score')
  }

  if (periodTotalAway > totalAwayScore) {
    errors.push('Away period goals exceed total away score')
  }

  // Check for negative scores
  if (period1Home < 0 || period1Away < 0 || period2Home < 0 || period2Away < 0 || period3Home < 0 || period3Away < 0) {
    errors.push('Period scores cannot be negative')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Format time remaining as MM:SS
 */
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Convert MM:SS time string to seconds
 */
export function parseTimeToSeconds(timeString: string): number {
  const [minutes, seconds] = timeString.split(':').map(Number)
  if (isNaN(minutes) || isNaN(seconds)) return 0
  return minutes * 60 + seconds
}