# Cowtown Showdown Lacrosse Tournament Website - Product Requirements Document

## 1. Executive Summary

The Cowtown Showdown website is a comprehensive lacrosse tournament management platform built on Payload CMS/Next.js that combines western-themed branding with modern sports tournament functionality. The site will provide real-time scoring, tournament management, team registration, and archival capabilities.

## 2. Project Overview

### 2.1 Vision

Create a premier digital experience for the Cowtown Showdown Senior Men's lacrosse tournament that celebrates Calgary's western heritage while providing state-of-the-art tournament management features.

### 2.2 Technology Stack

- **CMS**: Payload CMS
- **Frontend**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: MongoDB/PostgreSQL (based on existing setup)
- **Hosting**: TBD (Vercel/Payload Cloud recommended)

## 3. Brand & Design System

### 3.1 Theme

Western/Calgary Stampede inspired design that balances modern sports aesthetics with western gothic elements.

### 3.2 Typography

- **Display/Headings**: Western Gothic font (specific font TBD - suggestions: Rye, Smokum, or custom western font)
- **Body/UI**: Geist Sans (Vercel's font family)

### 3.3 Color Palette (Official)

- **Primary Colors** (from logo):
  - Rich Brown (#934F25)
  - Dark Brown (#5E2713)
  - Golden (#D6AC4D)
- **Extended Palette**:
  - Off-White (#FAFAFA)
  - Charcoal (#263238)
  - Black (#000000)
- **System Colors**:
  - Success Green (#2E7D32)
  - Warning Amber (#F57C00)
  - Error Red (#C62828)
  - Power Play Blue (#2196F3)
  - Penalty Kill Orange (#FF5722)

### 3.4 Design Principles

- Bold western imagery with modern UI patterns
- High contrast for outdoor viewing on mobile devices
- Responsive design prioritizing mobile experience
- Accessibility compliant (WCAG 2.1 AA)

## 4. Information Architecture

### 4.1 Site Structure

```
Home
├── Schedule
│   ├── Tournament Bracket
│   └── Daily Schedule
├── Standings
├── Teams
│   └── [Team Profile Pages]
├── Stats
│   ├── Player Stats
│   └── Team Stats
├── Score Center
│   └── [Individual Game Pages]
├── About
│   ├── Tournament History
│   ├── Previous Years
│   ├── Rules
│   └── Team Registration
└── Contact
```

## 5. Data Schema

### 5.1 Collections

#### Teams

```typescript
{
  id: string
  name: string
  slug: string
  logo: Media
  primaryColor: string
  secondaryColor: string
  city: string
  province: string
  captain: {
    name: string
    email: string
    phone: string
  }
  roster: Player[] // relationship
  stats: TeamStats // virtual/computed
  createdAt: Date
  updatedAt: Date
}
```

#### Players

```typescript
{
  id: string
  firstName: string
  lastName: string
  jerseyNumber: number // 0-99
  primaryPosition: 'offence' | 'defence' | 'transition' | 'faceoff' | 'goalie'
  secondaryPosition?: 'offence' | 'defence' | 'transition' | 'faceoff' | 'goalie'
  handedness: 'left' | 'right'
  team: Team // relationship
  playerType: 'runner' | 'goalie'
  photo?: Media
  stats: PlayerStats // virtual/computed
  createdAt: Date
  updatedAt: Date
}
```

#### TeamStaff

```typescript
{
  id: string
  firstName: string
  lastName: string
  role: 'coach' | 'trainer' | 'manager' | 'other'
  team: Team // relationship
  createdAt: Date
  updatedAt: Date
}
```

#### Games

```typescript
{
  id: string
  gameNumber: string
  gameType: 'pool' | 'playoff' | 'bronze' | 'gold'
  day: 1 | 2 | 3
  scheduledTime: Date
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  homeTeam: Team // relationship
  awayTeam: Team // relationship
  homeScore: number
  awayScore: number
  // Starting goalies
  homeStartingGoalie: Player // relationship
  awayStartingGoalie: Player // relationship
  // Current goalies (for live tracking)
  homeCurrentGoalie: Player // relationship
  awayCurrentGoalie: Player // relationship
  periods: Period[]
  overtimePeriods?: OvertimePeriod[] // for medal games only
  goals: Goal[] // relationship
  penalties: Penalty[] // relationship
  faceoffs: Faceoff[] // relationship
  shots: Shot[] // relationship
  gamePoints: {
    home: number // 0-5
    away: number // 0-5
  }
  youtubeUrl?: string
  currentPeriod: 0 | 1 | 2 | 3 | 'OT1' | 'OT2' | 'OT3' // etc
  periodTimeRemaining?: number // seconds
  slug: string // auto-generated
  createdAt: Date
  updatedAt: Date
}
```

#### Faceoff

```typescript
{
  id: string
  game: Game // relationship
  period: number | string // 1, 2, 3, 'OT1', etc
  time: string // game clock
  homeFaceoffPlayer: Player // relationship
  awayFaceoffPlayer: Player // relationship
  winner: 'home' | 'away'
  gameTime: number // seconds from start
}
```

#### Shot

```typescript
{
  id: string
  game: Game // relationship
  period: number | string
  time: string
  shooter: Player // relationship
  goalie: Player // relationship (current goalie at time of shot)
  team: 'home' | 'away'
  saved: boolean
  gameTime: number // seconds from start
}
```

#### GoalieChange

```typescript
{
  id: string
  game: Game // relationship
  period: number | string
  time: string
  team: 'home' | 'away'
  previousGoalie: Player // relationship
  newGoalie: Player // relationship
  gameTime: number
}
```

#### Periods

```typescript
{
  id: string
  game: Game // relationship
  periodNumber: number
  homeScore: number
  awayScore: number
  startTime: Date
  endTime?: Date
}
```

#### Goals

```typescript
{
  id: string
  game: Game // relationship
  period: number
  time: string // "12:34"
  scorer: Player // relationship
  assist1?: Player // relationship
  assist2?: Player // relationship
  team: Team // relationship
  gameTime: number // seconds from start
}
```

#### Penalties

```typescript
{
  id: string
  game: Game // relationship
  period: number
  time: string
  player: Player // relationship
  team: Team // relationship
  infraction: string
  duration: '30s' | '1min' | '2min' | '3min' | '5min' | 'game'
  startTime: Date
  endTime?: Date
}
```

#### TournamentYear

```typescript
{
  id: string
  year: number
  champion: Team // relationship
  runnerUp: Team // relationship
  mvp: Player // relationship
  topScorer: Player // relationship
  teams: Team[] // relationship
  stats: {} // JSON blob for year stats
  photos: Media[]
}
```

#### TeamSubmission (Form Submissions)

```typescript
{
  id: string
  teamName: string
  city: string
  province: string
  captainName: string
  captainEmail: string
  captainPhone: string
  alternateContact: {
    name: string
    email: string
    phone: string
  }
  estimatedRosterSize: number
  additionalInfo?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: Date
}
```

### 5.2 Globals

#### Tournament Settings

```typescript
{
  currentYear: number
  registrationOpen: boolean
  registrationDeadline: Date
  tournamentStartDate: Date
  tournamentEndDate: Date
  maxTeams: number
  fields: Field[]
  landAcknowledgment: RichText
}
```

## 6. Features & Functionality

### 6.1 Core Features

#### Live Scoring System

- Real-time score updates
- Period-by-period scoring
- Goal scorers and assists tracking
- Penalty tracking with countdown timers
- Game status indicators (scheduled, live, final)
- Push notifications for game updates (future phase)

#### Tournament Management

- Bracket generation and management
- Automatic standings calculation
- Tiebreaker logic implementation
- Schedule management with field assignments
- Weather contingency rescheduling

#### Team & Player Management

- Team profiles with rosters
- Player statistics tracking
- Photo galleries per team
- Historical team performance

#### Statistics Engine

- Real-time stats calculation
- Player leaderboards (goals, assists, points)
- Team statistics (goals for/against, differential)
- Goalie statistics (saves, save percentage)
- Historical statistics archive

### 6.2 Content Features

#### Scoreboard Component

- Displays on all pages
- Shows:
  - Live games with real-time scores
  - Recently completed games (last 2 hours)
  - Upcoming games (next 2 hours)
- Click-through to detailed game pages

#### Game Detail Pages

- Live play-by-play updates
- Box score with period breakdown
- Scoring summary
- Penalty summary
- Game officials
- Team lineups

### 6.3 Admin Features

#### Score Entry Interface

- Mobile-optimized scoring interface
- Quick goal/penalty entry
- Period management
- Game status controls
- Offline capability with sync

#### Tournament Administration

- Bracket editing
- Schedule management
- Team approval workflow
- Bulk data import/export
- Report generation

## 7. Page Specifications

### 7.1 Homepage

- Hero section with western-themed imagery
- Live scoreboard widget
- Tournament countdown/dates
- Quick links to Schedule, Standings, Stats
- News/updates section
- Land acknowledgment
- Sponsor recognition

### 7.2 Schedule Page

- Calendar view and list view toggle
- Filter by day, team, or game type
- Field locations with maps
- Export to calendar functionality

### 7.3 Standings Page

- Pool play standings
- Playoff bracket visualization
- Tiebreaker explanations
- Update timestamp

### 7.4 Teams Page

- Grid view of all teams
- Team cards with logos and basic info
- Link to detailed team pages

### 7.5 Stats Page

- Player leaderboards
- Team statistics
- Sortable tables
- Export functionality

### 7.6 About Page

- Tournament history timeline
- Previous champions gallery
- Tournament rules (expandable sections)
- Team submission form
- Registration requirements

### 7.7 Contact Page

- Contact form
- Tournament committee information
- Venue information
- Emergency contacts

## 8. Technical Requirements

### 8.1 Performance

- Page load time < 3 seconds
- Real-time updates < 500ms latency
- Mobile-first responsive design
- Offline capability for scoring app

### 8.2 SEO

- Schema markup for sports events
- Meta tags for social sharing
- Sitemap generation
- Canonical URLs

### 8.3 Integrations

- Social media feeds (future)
- SMS notifications (future)
- Email notifications for team captains

### 8.4 Security

- Admin authentication
- Role-based access control
- API rate limiting
- Data encryption at rest

## 9. Development Phases

### Phase 1: Foundation (Week 1-2)

- Extend existing Payload collections
- Create tournament-specific collections
- Set up design system and branding
- Basic page templates

### Phase 2: Tournament Features (Week 3-4)

- Game management system
- Live scoring functionality
- Standings calculation
- Statistics engine

### Phase 3: User Features (Week 5-6)

- Team registration form
- Public-facing pages
- Scoreboard component
- Game detail pages

### Phase 4: Polish & Launch (Week 7-8)

- Performance optimization
- Mobile testing
- Content population
- Launch preparation

## 10. Success Metrics

- Page load performance
- Real-time update reliability
- Mobile usage percentage
- User engagement metrics
- Zero scoring errors during tournament
- Positive user feedback

## 11. Future Enhancements

- Mobile app for iOS/Android
- Live streaming integration
- Advanced analytics
- Merchandise store
- Ticket sales integration
- Multi-tournament support

## 12. Open Questions for Clarification

1. **Authentication**: Who needs admin access? How many scorer accounts needed?
2. **Historical Data**: Do you have data from previous years to import?
3. **Registration Process**: What's the team approval workflow?
4. **Scheduling**: How are games scheduled? Manual or algorithmic?
5. **Tiebreakers**: What are the specific tiebreaker rules?
6. **Fields**: How many fields? Need maps/directions?
7. **Sponsors**: Sponsor recognition requirements?
8. **Photography**: Professional photography integration needed?
9. **Social Media**: Which platforms need integration?
10. **Domain**: What domain will this be hosted on?
