# Frontend Task: Page Structure & Routes

## Overview

Implement the public-facing pages for the Cowtown Showdown tournament website with western-themed design and mobile-first approach.

## Page Structure

### 1. Homepage

**Route**: `/`
**Priority**: Critical
**Components**: Hero, LiveScoreboard, TournamentInfo, Sponsors

```typescript
// src/app/(frontend)/page.tsx
```

**Sections**:

- Hero section with western-themed imagery
- Live scoreboard widget (scrollable, grouped by day)
- Tournament countdown/dates
- Quick links to Schedule, Standings, Stats
- News/updates feed
- Land acknowledgment
- Sponsor recognition grid

**Features**:

- Auto-refresh scoreboard every 5 seconds
- Smooth scroll animations
- Mobile-optimized layout
- Western gothic typography

### 2. Schedule Page

**Route**: `/schedule`
**Priority**: Critical
**Components**: ScheduleCalendar, ScheduleList, GameCard, DayFilter

```typescript
// src/app/(frontend)/schedule/page.tsx
```

**Views**:

- Calendar view (default on desktop)
- List view (default on mobile)
- Filter by day (Day 1, 2, 3)
- Filter by team
- Filter by game type (pool, playoff, medal)

**Features**:

- Toggle between calendar/list view
- Field location with map links
- Export to calendar (iCal)
- Live game indicators
- Western-themed date badges

### 3. Standings Page

**Route**: `/standings`
**Priority**: Critical
**Components**: StandingsTable, DivisionTabs, TiebreakerInfo

```typescript
// src/app/(frontend)/standings/page.tsx
```

**Sections**:

- Division tabs (Gold, Blue)
- Standings table with 5-point system
- Playoff bracket visualization
- Tiebreaker explanations
- Last updated timestamp

**5-Point System Display**:

```
Team | W | L | GF | GA | Pts | Detail
-----|---|---|----|----|-----|--------
ABC  | 2 | 1 | 15 | 12 | 4   | 2-0-2
```

Detail format: [Wins]-[OT/SO Wins]-[Period Wins]

### 4. Teams Page

**Route**: `/teams`
**Priority**: High
**Components**: TeamGrid, TeamCard, DivisionFilter

```typescript
// src/app/(frontend)/teams/page.tsx
```

**Layout**:

- Grid view of team cards
- Filter by division
- Search by team name/city
- Western-themed card design

**Team Card Info**:

- Team logo
- Team name & city
- Division badge (Gold/Blue)
- Quick stats (W-L, Last game)
- Link to team profile

### 5. Team Profile Page

**Route**: `/teams/[slug]`
**Priority**: High
**Components**: TeamHero, Roster, TeamSchedule, TeamStats

```typescript
// src/app/(frontend)/teams/[slug]/page.tsx
```

**Sections**:

- Team hero with logo and colors
- Roster table with player info
- Team schedule (past & upcoming)
- Team statistics
- Recent results
- Team staff listing

### 6. Stats Page

**Route**: `/stats`
**Priority**: High
**Components**: StatsTabs, LeaderboardTable, StatsFilters

```typescript
// src/app/(frontend)/stats/page.tsx
```

**Categories**:

- **Scoring Leaders**: Goals, Assists, Points
- **Goalie Stats**: Wins, Save %, GAA
- **Team Stats**: Goals For/Against, PP%, PK%
- **Penalty Leaders**: PIMs by player

**Features**:

- Sortable columns
- Filter by division/team
- Export to CSV
- Mobile-friendly tables
- Player profile links

### 7. Score Center (Live Games)

**Route**: `/scores`
**Priority**: Critical
**Components**: LiveGameList, GameCard, ScoreFilter

```typescript
// src/app/(frontend)/scores/page.tsx
```

**Sections**:

- Live games (auto-refresh)
- Recent games (last 2 hours)
- Upcoming games (next 2 hours)
- Filter by day/status

### 8. Game Detail Page

**Route**: `/games/[id]`
**Priority**: Critical
**Components**: GameHeader, BoxScore, PlayByPlay, GameStats

```typescript
// src/app/(frontend)/games/[id]/page.tsx
```

**Live Game Features**:

- Real-time score updates
- Period clock countdown
- Scoring summary
- Penalty box status
- Shot counter
- Three stars (post-game)

**Sections**:

- Game header with score
- Box score by period
- Scoring plays timeline
- Penalty summary
- Team stats comparison
- YouTube embed (if available)

### 9. About Page

**Route**: `/about`
**Priority**: Medium
**Components**: TournamentHistory, PreviousChampions, Rules

```typescript
// src/app/(frontend)/about/page.tsx
```

**Sections**:

- Tournament history timeline
- Previous champions gallery
- Tournament rules (collapsible)
- Venue information
- Committee members

### 10. Team Registration Page

**Route**: `/register`
**Priority**: Medium
**Components**: RegistrationForm, RegistrationInfo

```typescript
// src/app/(frontend)/register/page.tsx
```

**Form Sections**:

- Team information
- Captain details
- Alternate contact
- Roster size estimate
- Additional information

### 11. Contact Page

**Route**: `/contact`
**Priority**: Low
**Components**: ContactForm, ContactInfo, VenueMap

```typescript
// src/app/(frontend)/contact/page.tsx
```

**Sections**:

- Contact form
- Tournament committee
- Venue information
- Emergency contacts
- Social media links

## Layout Components

### Header Navigation

```typescript
// src/components/Header/TournamentHeader.tsx
```

**Desktop Menu**:

- Home | Schedule | Standings | Teams | Stats | Scores | About | Register

**Mobile Menu**:

- Hamburger menu with full navigation
- Sticky header with scroll shadow
- Quick access to live scores

### Footer

```typescript
// src/components/Footer/TournamentFooter.tsx
```

**Sections**:

- Tournament info
- Quick links
- Sponsor logos
- Social media
- Land acknowledgment

## Route Configurations

### Dynamic Routes

```typescript
// Team profiles
/teams/[slug] -> calgary-roughnecks

// Game details
/games/[id] -> game-1, game-22

// Stats with filters
/stats?category=scoring&division=gold
```

### API Routes for Pages

```typescript
// Pre-fetch data for SSG
export async function generateStaticParams() {
  const teams = await getTeams()
  return teams.map((team) => ({
    slug: team.slug,
  }))
}
```

## SEO & Meta Tags

Each page should include:

- Unique title and description
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Canonical URLs

Example:

```typescript
export const metadata: Metadata = {
  title: 'Schedule | Cowtown Showdown 2025',
  description:
    "View the complete tournament schedule for Cowtown Showdown Senior Men's Lacrosse Tournament",
  openGraph: {
    images: ['/og-schedule.jpg'],
  },
}
```

## Performance Requirements

1. **Page Load**: < 3 seconds on 3G
2. **Time to Interactive**: < 5 seconds
3. **Lighthouse Score**: > 90
4. **Core Web Vitals**: All green

## Mobile Considerations

1. Touch-friendly tap targets (min 44x44px)
2. Swipe gestures for navigation
3. Optimized images for mobile
4. Reduced data usage
5. Offline support for critical pages

## Accessibility Requirements

1. WCAG 2.1 AA compliance
2. Keyboard navigation
3. Screen reader support
4. High contrast mode
5. Focus indicators

## Testing Requirements

1. Cross-browser testing (Chrome, Safari, Firefox, Edge)
2. Mobile device testing (iOS, Android)
3. Responsive design testing
4. Performance testing
5. SEO validation
