# Functionality Task: Tournament Management System

## Overview
Implement comprehensive tournament management functionality including team registration, schedule generation, bracket management, and archival features.

## Core Features

### 1. Team Registration System

#### Registration Workflow
**File**: `src/lib/team-registration.ts`

```typescript
export class TeamRegistrationManager {
  async processSubmission(submission: TeamSubmissionData) {
    // Validate submission
    const validation = await this.validateSubmission(submission)
    if (!validation.valid) {
      throw new ValidationError(validation.errors)
    }
    
    // Create submission record
    const record = await payload.create({
      collection: 'teamSubmissions',
      data: {
        ...submission,
        status: 'pending',
        submittedAt: new Date(),
      },
    })
    
    // Send confirmation email
    await this.sendConfirmationEmail(submission.captainEmail, record.id)
    
    // Notify admins
    await this.notifyAdmins(record)
    
    return record
  }
  
  async approveTeam(submissionId: string, adminId: string) {
    const submission = await payload.findByID({
      collection: 'teamSubmissions',
      id: submissionId,
    })
    
    // Create team from submission
    const team = await payload.create({
      collection: 'teams',
      data: {
        name: submission.teamName,
        city: submission.city,
        province: submission.province,
        captain: {
          name: submission.captainName,
          email: submission.captainEmail,
          phone: submission.captainPhone,
        },
        division: await this.assignDivision(),
        divisionNumber: await this.assignDivisionNumber(),
      },
    })
    
    // Update submission status
    await payload.update({
      collection: 'teamSubmissions',
      id: submissionId,
      data: {
        status: 'approved',
        approvedBy: adminId,
        approvedAt: new Date(),
        team: team.id,
      },
    })
    
    // Send approval email with next steps
    await this.sendApprovalEmail(submission.captainEmail, team)
    
    return team
  }
  
  private async assignDivision(): Promise<'gold' | 'blue'> {
    // Logic to balance divisions
    const teams = await payload.find({
      collection: 'teams',
      where: {
        tournament: { equals: getCurrentTournamentId() },
      },
    })
    
    const goldCount = teams.docs.filter(t => t.division === 'gold').length
    const blueCount = teams.docs.filter(t => t.division === 'blue').length
    
    return goldCount <= blueCount ? 'gold' : 'blue'
  }
}
```

#### Registration Form Component
**File**: `src/components/TeamRegistration/RegistrationForm.tsx`

```typescript
export function TeamRegistrationForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<TeamSubmissionData>({})
  
  const steps = [
    { title: 'Team Information', component: TeamInfoStep },
    { title: 'Captain Details', component: CaptainDetailsStep },
    { title: 'Alternate Contact', component: AlternateContactStep },
    { title: 'Additional Information', component: AdditionalInfoStep },
    { title: 'Review & Submit', component: ReviewStep },
  ]
  
  const handleSubmit = async () => {
    try {
      const result = await submitTeamRegistration(formData)
      router.push(`/register/success?id=${result.id}`)
    } catch (error) {
      toast.error('Failed to submit registration')
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((s, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 text-center',
                i + 1 === step ? 'text-cowtown-gold' : 'text-gray-400'
              )}
            >
              <div className="western-badge mb-2">{i + 1}</div>
              <p className="text-sm">{s.title}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Current step */}
      <WesternCard variant="parchment">
        {React.createElement(steps[step - 1].component, {
          data: formData,
          onUpdate: (updates) => setFormData({ ...formData, ...updates }),
          onNext: () => setStep(step + 1),
          onBack: () => setStep(step - 1),
          onSubmit: handleSubmit,
        })}
      </WesternCard>
    </div>
  )
}
```

### 2. Schedule Generation

#### Tournament Scheduler
**File**: `src/lib/tournament-scheduler.ts`

```typescript
export class TournamentScheduler {
  constructor(
    private teams: Team[],
    private config: ScheduleConfig
  ) {}
  
  generateSchedule(): Game[] {
    const games: Game[] = []
    
    // Pool play games
    const poolGames = this.generatePoolPlay()
    games.push(...poolGames)
    
    // Playoff games (placeholders)
    const playoffGames = this.generatePlayoffPlaceholders()
    games.push(...playoffGames)
    
    // Medal games
    const medalGames = this.generateMedalGames()
    games.push(...medalGames)
    
    return this.optimizeSchedule(games)
  }
  
  private generatePoolPlay(): Game[] {
    const games: Game[] = []
    const goldTeams = this.teams.filter(t => t.division === 'gold')
    const blueTeams = this.teams.filter(t => t.division === 'blue')
    
    // Round robin within divisions
    games.push(...this.generateRoundRobin(goldTeams, 'pool', 1))
    games.push(...this.generateRoundRobin(blueTeams, 'pool', 1))
    
    return games
  }
  
  private generateRoundRobin(teams: Team[], gameType: string, startDay: number): Game[] {
    const games: Game[] = []
    
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        games.push({
          gameType,
          homeTeam: teams[i],
          awayTeam: teams[j],
          day: this.calculateGameDay(games.length, startDay),
          scheduledTime: this.calculateGameTime(games.length),
          field: this.assignField(games.length),
        })
      }
    }
    
    return games
  }
  
  private optimizeSchedule(games: Game[]): Game[] {
    // Ensure teams don't play back-to-back
    // Balance home/away games
    // Minimize travel between fields
    // Spread games across time slots
    
    return games.sort((a, b) => {
      // Sort by day, then time
      if (a.day !== b.day) return a.day - b.day
      return a.scheduledTime.getTime() - b.scheduledTime.getTime()
    })
  }
}
```

#### Schedule Management UI
**File**: `src/components/Admin/ScheduleManager.tsx`

```typescript
export function ScheduleManager() {
  const [schedule, setSchedule] = useState<Game[]>([])
  const [editingGame, setEditingGame] = useState<string | null>(null)
  
  const generateSchedule = async () => {
    const teams = await getTeams()
    const scheduler = new TournamentScheduler(teams, scheduleConfig)
    const games = scheduler.generateSchedule()
    
    // Save to database
    for (const game of games) {
      await createGame(game)
    }
    
    setSchedule(games)
    toast.success('Schedule generated successfully')
  }
  
  const adjustGameTime = async (gameId: string, newTime: Date) => {
    await updateGame(gameId, { scheduledTime: newTime })
    
    // Check for conflicts
    const conflicts = await checkScheduleConflicts(gameId)
    if (conflicts.length > 0) {
      toast.warning(`Conflicts detected with ${conflicts.length} other games`)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule Management</h2>
        <WesternButton onClick={generateSchedule}>
          Generate Schedule
        </WesternButton>
      </div>
      
      <div className="grid gap-4">
        {schedule.map(game => (
          <GameScheduleCard
            key={game.id}
            game={game}
            onEdit={() => setEditingGame(game.id)}
            onTimeChange={(time) => adjustGameTime(game.id, time)}
          />
        ))}
      </div>
    </div>
  )
}
```

### 3. Bracket Management

#### Playoff Bracket Generator
**File**: `src/lib/bracket-generator.ts`

```typescript
export class BracketGenerator {
  generatePlayoffBracket(standings: TeamStanding[]): PlayoffBracket {
    const goldTop2 = standings
      .filter(s => s.team.division === 'gold')
      .slice(0, 2)
    
    const blueTop2 = standings
      .filter(s => s.team.division === 'blue')
      .slice(0, 2)
    
    return {
      semifinals: [
        {
          id: 'semi1',
          homeTeam: goldTop2[0].team, // 1G
          awayTeam: blueTop2[1].team, // 2B
          gameNumber: 'SF1',
        },
        {
          id: 'semi2',
          homeTeam: blueTop2[0].team, // 1B
          awayTeam: goldTop2[1].team, // 2G
          gameNumber: 'SF2',
        },
      ],
      bronzeGame: {
        id: 'bronze',
        homeTeam: null, // Loser SF1
        awayTeam: null, // Loser SF2
        gameNumber: 'BRZ',
      },
      goldGame: {
        id: 'gold',
        homeTeam: null, // Winner SF1
        awayTeam: null, // Winner SF2
        gameNumber: 'GLD',
      },
    }
  }
  
  updateBracketAfterGame(gameId: string, result: GameResult) {
    if (gameId === 'semi1') {
      // Update bronze and gold games
      this.bracket.bronzeGame.homeTeam = result.loser
      this.bracket.goldGame.homeTeam = result.winner
    } else if (gameId === 'semi2') {
      this.bracket.bronzeGame.awayTeam = result.loser
      this.bracket.goldGame.awayTeam = result.winner
    }
  }
}
```

#### Interactive Bracket Component
**File**: `src/components/TournamentBracket/InteractiveBracket.tsx`

```typescript
export function InteractiveBracket({ bracket, onGameClick }: BracketProps) {
  return (
    <div className="bracket-container">
      {/* Pool Standings */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <PoolStandingsSummary division="gold" />
        <PoolStandingsSummary division="blue" />
      </div>
      
      {/* Bracket Visualization */}
      <div className="relative">
        <svg className="w-full h-96" viewBox="0 0 800 400">
          {/* Semifinals */}
          <BracketGame
            x={100}
            y={100}
            game={bracket.semifinals[0]}
            onClick={() => onGameClick(bracket.semifinals[0])}
          />
          <BracketGame
            x={100}
            y={250}
            game={bracket.semifinals[1]}
            onClick={() => onGameClick(bracket.semifinals[1])}
          />
          
          {/* Connection lines */}
          <path
            d="M 250 125 Q 300 125 300 175 T 350 175"
            stroke="#cowtown-brown"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 250 275 Q 300 275 300 225 T 350 225"
            stroke="#cowtown-brown"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Medal Games */}
          <BracketGame
            x={500}
            y={100}
            game={bracket.goldGame}
            variant="gold"
            onClick={() => onGameClick(bracket.goldGame)}
          />
          <BracketGame
            x={500}
            y={250}
            game={bracket.bronzeGame}
            variant="bronze"
            onClick={() => onGameClick(bracket.bronzeGame)}
          />
        </svg>
      </div>
    </div>
  )
}
```

### 4. 5-Point System Calculator

#### Points Calculation Engine
**File**: `src/lib/points-calculator.ts`

```typescript
export class PointsCalculator {
  calculateGamePoints(game: Game): GamePoints {
    const points = { home: 0, away: 0 }
    
    // Game win = 2 points
    if (game.status === 'final') {
      if (game.homeScore > game.awayScore) {
        points.home += 2
      } else if (game.awayScore > game.homeScore) {
        points.away += 2
      }
    }
    
    // Period wins = 1 point each
    game.periods.forEach(period => {
      if (period.homeScore > period.awayScore) {
        points.home += 1
      } else if (period.awayScore > period.homeScore) {
        points.away += 1
      }
    })
    
    return points
  }
  
  calculateStandings(teams: Team[], games: Game[]): TeamStanding[] {
    const standings = teams.map(team => ({
      team,
      wins: 0,
      losses: 0,
      overtimeWins: 0,
      periodWins: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      gamesPlayed: 0,
    }))
    
    games.forEach(game => {
      if (game.status !== 'final') return
      
      const homeStanding = standings.find(s => s.team.id === game.homeTeam.id)
      const awayStanding = standings.find(s => s.team.id === game.awayTeam.id)
      
      // Update game results
      if (game.homeScore > game.awayScore) {
        homeStanding.wins++
        awayStanding.losses++
      } else {
        awayStanding.wins++
        homeStanding.losses++
      }
      
      // Update goals
      homeStanding.goalsFor += game.homeScore
      homeStanding.goalsAgainst += game.awayScore
      awayStanding.goalsFor += game.awayScore
      awayStanding.goalsAgainst += game.homeScore
      
      // Calculate points
      const gamePoints = this.calculateGamePoints(game)
      homeStanding.points += gamePoints.home
      awayStanding.points += gamePoints.away
      
      // Track period wins
      homeStanding.periodWins += gamePoints.home - (game.homeScore > game.awayScore ? 2 : 0)
      awayStanding.periodWins += gamePoints.away - (game.awayScore > game.homeScore ? 2 : 0)
      
      homeStanding.gamesPlayed++
      awayStanding.gamesPlayed++
    })
    
    return this.applyTiebreakers(standings)
  }
  
  private applyTiebreakers(standings: TeamStanding[]): TeamStanding[] {
    return standings.sort((a, b) => {
      // 1. Total points
      if (a.points !== b.points) return b.points - a.points
      
      // 2. Head-to-head record
      const h2h = this.getHeadToHeadResult(a.team, b.team)
      if (h2h !== 0) return h2h
      
      // 3. Goal differential
      const aDiff = a.goalsFor - a.goalsAgainst
      const bDiff = b.goalsFor - b.goalsAgainst
      if (aDiff !== bDiff) return bDiff - aDiff
      
      // 4. Goals for
      if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor
      
      // 5. Goals against (fewer is better)
      return a.goalsAgainst - b.goalsAgainst
    })
  }
}
```

### 5. Tournament Archival

#### Archive System
**File**: `src/lib/tournament-archive.ts`

```typescript
export class TournamentArchiveManager {
  async archiveTournament(tournamentId: string) {
    const tournament = await getTournament(tournamentId)
    
    // Compile final results
    const archive = {
      year: tournament.year,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      teams: await this.getTeamsWithFinalRecords(tournamentId),
      champion: await this.getChampion(tournamentId),
      runnerUp: await this.getRunnerUp(tournamentId),
      bronzeMedalist: await this.getBronzeMedalist(tournamentId),
      mvp: await this.selectMVP(tournamentId),
      topScorer: await this.getTopScorer(tournamentId),
      topGoalie: await this.getTopGoalie(tournamentId),
      allTournamentTeam: await this.selectAllTournamentTeam(tournamentId),
      statistics: await this.compileTournamentStats(tournamentId),
      games: await this.getAllGames(tournamentId),
      highlights: await this.getHighlights(tournamentId),
    }
    
    // Create archive record
    const archiveRecord = await payload.create({
      collection: 'tournamentYears',
      data: archive,
    })
    
    // Generate PDF report
    const pdfUrl = await this.generateTournamentReport(archive)
    
    // Update archive with report
    await payload.update({
      collection: 'tournamentYears',
      id: archiveRecord.id,
      data: { reportPdf: pdfUrl },
    })
    
    return archiveRecord
  }
  
  private async selectMVP(tournamentId: string): Promise<Player> {
    // Get all players with stats
    const playerStats = await this.getAllPlayerStats(tournamentId)
    
    // MVP scoring algorithm
    const mvpScores = playerStats.map(ps => ({
      player: ps.player,
      score: (
        ps.goals * 3 +
        ps.assists * 2 +
        ps.gameWinningGoals * 5 +
        ps.plusMinus +
        (ps.threeStarSelections.first * 5) +
        (ps.threeStarSelections.second * 3) +
        (ps.threeStarSelections.third * 1)
      ),
    }))
    
    return mvpScores.sort((a, b) => b.score - a.score)[0].player
  }
}
```

#### Historical Stats Display
**File**: `src/components/TournamentHistory/HistoricalStats.tsx`

```typescript
export function HistoricalStats({ years }: { years: TournamentYear[] }) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [compareYears, setCompareYears] = useState<string[]>([])
  
  return (
    <div className="space-y-8">
      {/* Year selector */}
      <div className="flex gap-4 flex-wrap">
        {years.map(year => (
          <WesternBadge
            key={year.id}
            variant={selectedYear === year.id ? 'sheriff' : 'wood'}
            onClick={() => setSelectedYear(year.id)}
          >
            {year.year}
          </WesternBadge>
        ))}
      </div>
      
      {selectedYear && (
        <YearDetails year={years.find(y => y.id === selectedYear)!} />
      )}
      
      {/* Historical records */}
      <div className="grid md:grid-cols-2 gap-6">
        <RecordCard
          title="Most Goals (Tournament)"
          record={getRecord(years, 'mostGoals')}
        />
        <RecordCard
          title="Best Save Percentage"
          record={getRecord(years, 'bestSavePercentage')}
        />
        <RecordCard
          title="Longest Win Streak"
          record={getRecord(years, 'longestWinStreak')}
        />
        <RecordCard
          title="Most Championships"
          record={getRecord(years, 'mostChampionships')}
        />
      </div>
    </div>
  )
}
```

## Admin Tools

### Tournament Dashboard
**File**: `src/components/Admin/TournamentDashboard.tsx`

```typescript
export function TournamentDashboard() {
  const { tournament, isLoading } = useCurrentTournament()
  const { stats } = useTournamentStats(tournament?.id)
  
  if (isLoading) return <LoadingSpinner />
  
  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Teams Registered"
          value={stats.teamsRegistered}
          max={tournament.maxTeams}
        />
        <StatCard
          title="Games Played"
          value={stats.gamesPlayed}
          max={stats.totalGames}
        />
        <StatCard
          title="Total Goals"
          value={stats.totalGoals}
        />
        <StatCard
          title="Active Scorekeepers"
          value={stats.activeScorekeepers}
        />
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-4">
        <WesternButton onClick={() => router.push('/admin/schedule')}>
          Manage Schedule
        </WesternButton>
        <WesternButton onClick={() => router.push('/admin/teams')}>
          Team Approvals
        </WesternButton>
        <WesternButton onClick={() => router.push('/admin/brackets')}>
          Update Brackets
        </WesternButton>
        <WesternButton variant="ghost" onClick={exportTournamentData}>
          Export Data
        </WesternButton>
      </div>
      
      {/* Live Games Monitor */}
      <LiveGamesMonitor />
      
      {/* Recent Activity */}
      <RecentActivityFeed />
    </div>
  )
}
```

## Data Export/Import

### Export Functions
**File**: `src/lib/data-export.ts`

```typescript
export class DataExporter {
  async exportSchedule(format: 'csv' | 'ical' | 'pdf') {
    const games = await getAllGames()
    
    switch (format) {
      case 'csv':
        return this.generateCSV(games)
      case 'ical':
        return this.generateICalendar(games)
      case 'pdf':
        return this.generatePDFSchedule(games)
    }
  }
  
  async exportTeamRosters(format: 'csv' | 'pdf') {
    const teams = await getTeamsWithRosters()
    
    switch (format) {
      case 'csv':
        return this.generateRosterCSV(teams)
      case 'pdf':
        return this.generateRosterPDF(teams)
    }
  }
  
  async exportTournamentReport() {
    const report = await compileTournamentReport()
    return this.generateComprehensivePDF(report)
  }
}
```

## Testing & Validation

### Schedule Validation
```typescript
export function validateSchedule(games: Game[]): ValidationResult {
  const errors: string[] = []
  
  // Check for time conflicts
  games.forEach((game, i) => {
    games.slice(i + 1).forEach(other => {
      if (hasTimeConflict(game, other)) {
        errors.push(`Time conflict: Game ${game.gameNumber} and ${other.gameNumber}`)
      }
    })
  })
  
  // Check team back-to-back games
  const teamSchedules = groupGamesByTeam(games)
  teamSchedules.forEach((teamGames, teamId) => {
    if (hasBackToBackGames(teamGames)) {
      errors.push(`Team ${teamId} has back-to-back games`)
    }
  })
  
  return { valid: errors.length === 0, errors }
}
```