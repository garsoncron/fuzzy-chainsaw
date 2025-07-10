# Cowtown Showdown UX/UI Design Bible - Comprehensive Guide for Figma Design

## Table of Contents

1. [Project Overview](#project-overview)
2. [Design System Foundations](#design-system-foundations)
3. [Component Library](#component-library)
4. [Screen Inventory](#screen-inventory)
5. [Mock Data & Content](#mock-data--content)
6. [Responsive Design Specifications](#responsive-design-specifications)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [Implementation Notes](#implementation-notes)

---

## Project Overview

### Mission Statement
The Cowtown Showdown is a **Senior Men's box lacrosse tournament** website featuring **real-time scoring**, **tournament management**, and a distinctive **Western/Calgary Stampede theme**. The platform serves 500-900 concurrent users during peak tournament activity.

### Key Features
- **Real-time scoring** with live game updates
- **Tournament management** for 8 teams, 22 games over 3 days
- **5-point scoring system** (periods + game points)
- **Western Gothic aesthetic** with modern functionality
- **Mobile-optimized scorekeeper interface**
- **Responsive design** for all devices

### Target Audiences
1. **Tournament Spectators** - Viewing live scores, schedules, standings
2. **Team Captains** - Managing rosters, viewing team stats
3. **Scorekeepers** - Real-time game management on tablets
4. **Tournament Organizers** - Administrative oversight

### Brand Identity
- **Theme**: Western/Calgary Stampede
- **Tone**: Competitive, exciting, traditional, professional
- **Visual Elements**: Wood textures, rope patterns, western typography
- **Color Story**: Rich earth tones with golden accents

---

## Design System Foundations

### Color Palette

#### Primary Western Colors
```css
/* Main Tournament Colors */
--primary-brown: #934F25 (HSL: 28, 57%, 37%)
--dark-brown: #5E2713 (HSL: 26, 49%, 25%)
--golden: #D6AC4D (HSL: 46, 69%, 58%)
```

#### Game Status Colors
```css
/* Live Game Indicators */
--live-indicator: #00FF00 (HSL: 120, 100%, 50%)
--power-play: #2196F3 (HSL: 204, 100%, 50%)
--penalty-kill: #FF5722 (HSL: 16, 100%, 55%)
--final-game: #999999 (HSL: 0, 0%, 60%)
--overtime: #FFA500 (HSL: 39, 100%, 50%)
```

#### UI System Colors - Light Theme
```css
/* Base UI Colors */
--background: #FFFFFF
--foreground: #0C0A09
--card: #F5F5F4
--card-foreground: #0C0A09
--border: #CCCCCC
--input: #E7E5E4
--muted: #F5F5F4
--muted-foreground: #6B7280

/* Status Colors */
--success: #86EFAC
--warning: #FDE68A
--error: #FCA5A5
--destructive: #DC2626
```

#### UI System Colors - Dark Theme
```css
/* Base UI Colors - Dark */
--background: #0C0A09
--foreground: #FAFAF9
--card: #1C1917
--card-foreground: #FAFAF9
--border: #3F3F46
--input: #27272A
--muted: #44403C
--muted-foreground: #A8A29E

/* Status Colors - Dark */
--success: #065F46
--warning: #78350F
--error: #7F1D1D
--destructive: #991B1B
```

### Typography

#### Font Hierarchy
1. **Western Display Font**: 'Rye', 'Smokum', serif
   - Usage: Tournament branding, headings, hero text
   - Sizes: 48px, 36px, 24px, 18px
   - Weight: Regular (400)

2. **Primary Body Font**: 'Geist Sans', sans-serif
   - Usage: Body text, UI elements, navigation
   - Sizes: 16px, 14px, 12px, 10px
   - Weights: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)

3. **Monospace Font**: 'Geist Mono', monospace
   - Usage: Scores, timers, statistics
   - Sizes: 24px, 18px, 16px, 14px
   - Weight: Medium (500)

#### Typography Scale
```css
/* Display Sizes (Western Font) */
--text-6xl: 3.75rem (60px)
--text-5xl: 3rem (48px)
--text-4xl: 2.25rem (36px)
--text-3xl: 1.875rem (30px)
--text-2xl: 1.5rem (24px)
--text-xl: 1.25rem (20px)

/* Body Sizes (Geist Sans) */
--text-lg: 1.125rem (18px)
--text-base: 1rem (16px)
--text-sm: 0.875rem (14px)
--text-xs: 0.75rem (12px)

/* Line Heights */
--leading-none: 1
--leading-tight: 1.25
--leading-snug: 1.375
--leading-normal: 1.5
--leading-relaxed: 1.625
```

### Spacing System

#### Spacing Scale (Tailwind-based)
```css
/* Spacing Scale */
--spacing-0: 0px
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)
--spacing-4: 1rem (16px)
--spacing-5: 1.25rem (20px)
--spacing-6: 1.5rem (24px)
--spacing-8: 2rem (32px)
--spacing-10: 2.5rem (40px)
--spacing-12: 3rem (48px)
--spacing-16: 4rem (64px)
--spacing-20: 5rem (80px)
--spacing-24: 6rem (96px)
```

#### Layout Spacing
```css
/* Component Spacing */
--component-padding: 1rem (16px)
--component-margin: 1.5rem (24px)
--section-padding: 2rem (32px)
--container-padding: 1rem (16px)

/* Touch Targets */
--touch-target-minimum: 44px
--button-height: 44px
--input-height: 44px
```

### Border Radius

```css
/* Border Radius Scale */
--radius-none: 0px
--radius-sm: 0.125rem (2px)
--radius-default: 0.25rem (4px)
--radius-md: 0.375rem (6px)
--radius-lg: 0.5rem (8px)
--radius-xl: 0.75rem (12px)
--radius-2xl: 1rem (16px)
--radius-full: 9999px
```

### Shadows

```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-default: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Responsive Breakpoints

```css
/* Breakpoint System */
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px

/* Container Sizes */
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1400px
```

---

## Component Library

### Atomic Design Structure

#### Atoms (Basic Building Blocks)

##### Button Component
**Purpose**: Primary interactive element
**Variants**: Primary, Secondary, Ghost, Outline, Destructive
**States**: Default, Hover, Active, Disabled, Loading

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
  size: 'sm' | 'md' | 'lg' | 'xl'
  disabled: boolean
  loading: boolean
  fullWidth: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}
```

**Design Specifications**:
- **Primary**: Brown background (#934F25), white text, hover: darker brown
- **Secondary**: Gray background, dark text, hover: light gray
- **Ghost**: Transparent background, brown text, hover: light brown background
- **Outline**: Brown border, brown text, hover: brown background
- **Destructive**: Red background, white text, hover: darker red

**Sizes**:
- **SM**: 32px height, 12px padding, 14px font
- **MD**: 44px height, 16px padding, 16px font
- **LG**: 48px height, 20px padding, 18px font
- **XL**: 56px height, 24px padding, 20px font

##### Badge Component
**Purpose**: Status indicators and labels
**Variants**: Default, Success, Warning, Error, Live, Western

```typescript
interface BadgeProps {
  variant: 'default' | 'success' | 'warning' | 'error' | 'live' | 'western'
  size: 'sm' | 'md' | 'lg'
  pulse: boolean
  children: React.ReactNode
}
```

**Design Specifications**:
- **Default**: Gray background, dark text
- **Success**: Green background, white text
- **Warning**: Yellow background, dark text
- **Error**: Red background, white text
- **Live**: Red background, white text, pulsing animation
- **Western**: Brown background, golden text, western font

##### Input Component
**Purpose**: Form data collection
**Variants**: Default, Error, Success, Disabled

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  variant: 'default' | 'error' | 'success' | 'disabled'
  size: 'sm' | 'md' | 'lg'
  placeholder: string
  label?: string
  helperText?: string
  required: boolean
  disabled: boolean
}
```

##### Typography Components
**Purpose**: Consistent text rendering
**Components**: Heading, Body, Caption, Code

```typescript
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight: 'normal' | 'medium' | 'semibold' | 'bold'
  color: 'default' | 'muted' | 'primary' | 'golden'
  western: boolean
  children: React.ReactNode
}
```

#### Molecules (Combined Atoms)

##### Card Component
**Purpose**: Content container with consistent styling
**Variants**: Default, Elevated, Outlined, Western

```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined' | 'western'
  padding: 'sm' | 'md' | 'lg'
  hoverable: boolean
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}
```

**Design Specifications**:
- **Default**: Light background, subtle border
- **Elevated**: Drop shadow, no border
- **Outlined**: Strong border, no shadow
- **Western**: Wood texture background, rope border

##### Game Card Component
**Purpose**: Display game information
**States**: Scheduled, Live, Final, Overtime

```typescript
interface GameCardProps {
  game: {
    id: string
    gameNumber: string
    homeTeam: Team
    awayTeam: Team
    homeScore: number
    awayScore: number
    scheduledTime: string
    status: 'scheduled' | 'live' | 'final' | 'overtime'
    currentPeriod: string
    timeRemaining: string
    youtubeUrl?: string
  }
  size: 'sm' | 'md' | 'lg'
  interactive: boolean
}
```

**Visual States**:
- **Scheduled**: Gray background, team names, scheduled time
- **Live**: Green accent, live indicator, current score, period timer
- **Final**: White background, final score, period breakdown
- **Overtime**: Orange accent, "OT" indicator, current score

##### Team Card Component
**Purpose**: Display team information
**Variants**: Compact, Detailed, Roster

```typescript
interface TeamCardProps {
  team: Team
  variant: 'compact' | 'detailed' | 'roster'
  stats?: TeamStats
  players?: Player[]
  interactive: boolean
}
```

##### Player Card Component
**Purpose**: Display player information
**Variants**: Roster, Stats, Scorekeeper

```typescript
interface PlayerCardProps {
  player: Player
  variant: 'roster' | 'stats' | 'scorekeeper'
  stats?: PlayerStats
  selectable: boolean
  selected: boolean
  onSelect?: () => void
}
```

##### Scoreboard Component
**Purpose**: Live game scoring display
**Variants**: Compact, Full, Ticker

```typescript
interface ScoreboardProps {
  game: Game
  variant: 'compact' | 'full' | 'ticker'
  showPeriodBreakdown: boolean
  showGameInfo: boolean
  interactive: boolean
}
```

**Design Specifications**:
- **Compact**: Team names, scores, period/time
- **Full**: Team logos, detailed stats, period breakdown
- **Ticker**: Scrolling format for multiple games

#### Organisms (Complex Components)

##### Header Component
**Purpose**: Site navigation and branding
**Variants**: Desktop, Mobile, Scorekeeper

```typescript
interface HeaderProps {
  variant: 'desktop' | 'mobile' | 'scorekeeper'
  user?: User
  liveGamesCount: number
  nextGameTime?: string
  showLiveIndicator: boolean
}
```

**Design Specifications**:
- **Desktop**: 80px height, 3-section layout (logo, nav, actions)
- **Mobile**: 64px height, hamburger menu, slide-out panel
- **Scorekeeper**: Simplified layout, game-specific actions

##### Navigation Dropdown Component
**Purpose**: Mega menu navigation
**Variants**: Tournament, Teams, Games, Stats, Media

```typescript
interface NavigationDropdownProps {
  type: 'tournament' | 'teams' | 'games' | 'stats' | 'media'
  isOpen: boolean
  onToggle: () => void
}
```

**Design Specifications**:
- **Layout**: 3-column grid layout
- **Content**: Dynamic based on type
- **Behavior**: Hover on desktop, click on mobile

##### Game Management Panel
**Purpose**: Scorekeeper interface for game control
**Variants**: Pre-game, In-game, Post-game

```typescript
interface GameManagementProps {
  game: Game
  variant: 'pre-game' | 'in-game' | 'post-game'
  user: User
  onAction: (action: string, data: any) => void
}
```

##### Standings Table Component
**Purpose**: Tournament standings display
**Variants**: Compact, Detailed, Live

```typescript
interface StandingsTableProps {
  teams: TeamWithStats[]
  variant: 'compact' | 'detailed' | 'live'
  showTournamentPoints: boolean
  showGameStats: boolean
  interactive: boolean
}
```

---

## Screen Inventory

### Public Tournament Website

#### 1. Homepage
**Purpose**: Tournament overview and live updates
**Key Components**:
- Hero section with tournament branding
- Live games scoreboard
- Next games schedule
- Tournament standings preview
- Recent results
- Navigation to all sections

**Layout**:
- Hero: Full-width western-themed banner
- Live Games: Horizontal scrolling cards
- Content Grid: 3-column layout (standings, schedule, results)
- Footer: Tournament info and links

#### 2. Tournament Overview
**Purpose**: Tournament information and rules
**Key Components**:
- Tournament details (dates, location, format)
- 5-point system explanation
- Tournament rules and regulations
- Team list with links
- Schedule download

#### 3. Games & Schedule
**Purpose**: Complete game schedule and results
**Key Components**:
- Date-based game filtering
- Game cards with team info
- Live game indicators
- Game detail modal/page
- Time zone display

**Views**:
- **List View**: Chronological game list
- **Calendar View**: Calendar-based display
- **Live View**: Active games only
- **Results View**: Completed games

#### 4. Teams
**Purpose**: Team information and rosters
**Key Components**:
- Team grid with logos
- Team detail pages
- Player rosters
- Team statistics
- Head-to-head comparisons

**Team Detail Page**:
- Team header with logo and info
- Roster table with player details
- Game schedule
- Team statistics
- Recent results

#### 5. Statistics
**Purpose**: Player and team statistics
**Key Components**:
- Leaderboards (goals, assists, saves)
- Player search and filtering
- Team statistics comparison
- Advanced metrics
- Statistics explanations

**Categories**:
- **Player Stats**: Goals, assists, points, PIM
- **Goalie Stats**: Saves, GAA, save percentage
- **Team Stats**: Team averages and totals
- **Advanced**: Faceoffs, loose balls, blocked shots

#### 6. Live Game Detail
**Purpose**: Real-time game viewing
**Key Components**:
- Live scoreboard
- Period timer
- Game log/timeline
- Player statistics
- YouTube stream embed
- Live chat/comments

#### 7. Media & Gallery
**Purpose**: Photos, videos, and highlights
**Key Components**:
- Photo galleries
- Video highlights
- Live stream links
- Social media integration
- Player spotlights

### Scorekeeper Interface

#### 1. Login & Authentication
**Purpose**: Secure access for scorekeepers
**Key Components**:
- Login form
- Password reset
- Session management
- Role verification

#### 2. Games Dashboard
**Purpose**: Game selection and management
**Key Components**:
- Available games list
- Game claiming system
- Active game indicators
- Game history

#### 3. Scoring Interface
**Purpose**: Real-time game management
**Key Components**:
- Live scoreboard
- Period timer controls
- Stat entry buttons
- Player selection dialogs
- Game log
- Undo functionality

**Layout**:
- **Top**: Scoreboard and timer
- **Middle**: Quick action buttons
- **Bottom**: Game log and controls

#### 4. Player Management
**Purpose**: Player selection and substitution
**Key Components**:
- Team rosters
- Player search/filter
- Position indicators
- Goalie management
- Penalty box tracking

#### 5. Statistics Entry
**Purpose**: Detailed stat tracking
**Key Components**:
- Goal entry form
- Penalty dialog
- Faceoff tracking
- Shot tracking
- Loose ball recording

#### 6. Post-Game
**Purpose**: Game completion and review
**Key Components**:
- Final score confirmation
- Three stars selection
- Game summary
- Statistics review
- Game export

---

## Mock Data & Content

### Tournament Configuration

#### Tournament Info
```json
{
  "tournament": {
    "name": "Cowtown Showdown",
    "year": 2024,
    "dates": "June 14-16, 2024",
    "location": "Calgary, Alberta",
    "venue": "Foothills Fieldhouse",
    "format": "Pool Play + Medal Games",
    "teams": 8,
    "games": 22,
    "days": 3,
    "entryFee": "$1,800 per team",
    "playerFee": "$90 per player",
    "guaranteedGames": 5
  }
}
```

#### Teams Data
```json
{
  "teams": [
    {
      "id": 1,
      "name": "Calgary Mustangs",
      "slug": "calgary-mustangs",
      "city": "Calgary",
      "province": "Alberta",
      "logo": "/logos/mustangs.png",
      "primaryColor": "#8B4513",
      "secondaryColor": "#DAA520",
      "captain": {
        "name": "Jake Morrison",
        "email": "jake.morrison@email.com",
        "phone": "(403) 555-0123"
      },
      "record": {
        "wins": 3,
        "losses": 1,
        "ties": 0,
        "tournamentPoints": 13,
        "goalsFor": 45,
        "goalsAgainst": 32
      }
    },
    {
      "id": 2,
      "name": "Edmonton Stallions",
      "slug": "edmonton-stallions",
      "city": "Edmonton",
      "province": "Alberta",
      "logo": "/logos/stallions.png",
      "primaryColor": "#2F4F4F",
      "secondaryColor": "#FFD700",
      "captain": {
        "name": "Ryan McKenzie",
        "email": "ryan.mckenzie@email.com",
        "phone": "(780) 555-0145"
      },
      "record": {
        "wins": 2,
        "losses": 2,
        "ties": 0,
        "tournamentPoints": 11,
        "goalsFor": 38,
        "goalsAgainst": 41
      }
    },
    {
      "id": 3,
      "name": "Saskatoon Broncos",
      "slug": "saskatoon-broncos",
      "city": "Saskatoon",
      "province": "Saskatchewan",
      "logo": "/logos/broncos.png",
      "primaryColor": "#8B0000",
      "secondaryColor": "#FFFFFF",
      "captain": {
        "name": "Tyler Boychuk",
        "email": "tyler.boychuk@email.com",
        "phone": "(306) 555-0167"
      },
      "record": {
        "wins": 4,
        "losses": 0,
        "ties": 0,
        "tournamentPoints": 15,
        "goalsFor": 52,
        "goalsAgainst": 28
      }
    },
    {
      "id": 4,
      "name": "Vancouver Outlaws",
      "slug": "vancouver-outlaws",
      "city": "Vancouver",
      "province": "British Columbia",
      "logo": "/logos/outlaws.png",
      "primaryColor": "#000000",
      "secondaryColor": "#C0C0C0",
      "captain": {
        "name": "Connor Walsh",
        "email": "connor.walsh@email.com",
        "phone": "(604) 555-0189"
      },
      "record": {
        "wins": 1,
        "losses": 3,
        "ties": 0,
        "tournamentPoints": 8,
        "goalsFor": 29,
        "goalsAgainst": 47
      }
    },
    {
      "id": 5,
      "name": "Regina Raiders",
      "slug": "regina-raiders",
      "city": "Regina",
      "province": "Saskatchewan",
      "logo": "/logos/raiders.png",
      "primaryColor": "#006400",
      "secondaryColor": "#FFFF00",
      "captain": {
        "name": "Brad Sinclair",
        "email": "brad.sinclair@email.com",
        "phone": "(306) 555-0201"
      },
      "record": {
        "wins": 2,
        "losses": 1,
        "ties": 1,
        "tournamentPoints": 10,
        "goalsFor": 34,
        "goalsAgainst": 33
      }
    },
    {
      "id": 6,
      "name": "Winnipeg Wranglers",
      "slug": "winnipeg-wranglers",
      "city": "Winnipeg",
      "province": "Manitoba",
      "logo": "/logos/wranglers.png",
      "primaryColor": "#4B0082",
      "secondaryColor": "#FFA500",
      "captain": {
        "name": "Mike Kozlowski",
        "email": "mike.kozlowski@email.com",
        "phone": "(204) 555-0223"
      },
      "record": {
        "wins": 1,
        "losses": 2,
        "ties": 1,
        "tournamentPoints": 7,
        "goalsFor": 31,
        "goalsAgainst": 39
      }
    },
    {
      "id": 7,
      "name": "Victoria Vigilantes",
      "slug": "victoria-vigilantes",
      "city": "Victoria",
      "province": "British Columbia",
      "logo": "/logos/vigilantes.png",
      "primaryColor": "#800080",
      "secondaryColor": "#C0C0C0",
      "captain": {
        "name": "Alex Thompson",
        "email": "alex.thompson@email.com",
        "phone": "(250) 555-0245"
      },
      "record": {
        "wins": 0,
        "losses": 3,
        "ties": 1,
        "tournamentPoints": 4,
        "goalsFor": 24,
        "goalsAgainst": 44
      }
    },
    {
      "id": 8,
      "name": "Lethbridge Lawmen",
      "slug": "lethbridge-lawmen",
      "city": "Lethbridge",
      "province": "Alberta",
      "logo": "/logos/lawmen.png",
      "primaryColor": "#8B4513",
      "secondaryColor": "#DAA520",
      "captain": {
        "name": "Derek Harrison",
        "email": "derek.harrison@email.com",
        "phone": "(403) 555-0267"
      },
      "record": {
        "wins": 3,
        "losses": 1,
        "ties": 0,
        "tournamentPoints": 12,
        "goalsFor": 41,
        "goalsAgainst": 35
      }
    }
  ]
}
```

#### Player Data Examples
```json
{
  "players": [
    {
      "id": 1,
      "firstName": "Jake",
      "lastName": "Morrison",
      "displayName": "Jake Morrison",
      "jerseyNumber": 12,
      "team": "Calgary Mustangs",
      "primaryPosition": "offence",
      "secondaryPosition": "transition",
      "handedness": "right",
      "playerType": "runner",
      "photo": "/players/jake-morrison.jpg",
      "stats": {
        "gamesPlayed": 4,
        "goals": 8,
        "assists": 6,
        "points": 14,
        "penaltyMinutes": 4,
        "powerPlayGoals": 2,
        "shortHandedGoals": 1,
        "looseBalls": 12,
        "faceoffWins": 0,
        "faceoffAttempts": 0,
        "faceoffPercentage": 0
      }
    },
    {
      "id": 2,
      "firstName": "Marcus",
      "lastName": "Chen",
      "displayName": "Marcus Chen",
      "jerseyNumber": 1,
      "team": "Calgary Mustangs",
      "primaryPosition": "goalie",
      "handedness": "left",
      "playerType": "goalie",
      "photo": "/players/marcus-chen.jpg",
      "stats": {
        "gamesPlayed": 3,
        "wins": 2,
        "losses": 1,
        "goalsAllowed": 18,
        "saves": 67,
        "savePercentage": 0.788,
        "goalsAllowedAverage": 6.0,
        "minutesPlayed": 180
      }
    },
    {
      "id": 3,
      "firstName": "Dylan",
      "lastName": "MacLeod",
      "displayName": "Dylan MacLeod",
      "jerseyNumber": 7,
      "team": "Saskatoon Broncos",
      "primaryPosition": "faceoff",
      "secondaryPosition": "offence",
      "handedness": "left",
      "playerType": "runner",
      "photo": "/players/dylan-macleod.jpg",
      "stats": {
        "gamesPlayed": 4,
        "goals": 3,
        "assists": 9,
        "points": 12,
        "penaltyMinutes": 2,
        "powerPlayGoals": 1,
        "shortHandedGoals": 0,
        "looseBalls": 8,
        "faceoffWins": 34,
        "faceoffAttempts": 52,
        "faceoffPercentage": 0.654
      }
    }
  ]
}
```

#### Game Data Examples
```json
{
  "games": [
    {
      "id": 1,
      "gameNumber": "1",
      "displayName": "Game 1: Calgary Mustangs vs Edmonton Stallions",
      "slug": "game-1-mustangs-stallions",
      "gameType": "pool",
      "day": "1",
      "scheduledTime": "2024-06-14T10:00:00-06:00",
      "status": "final",
      "homeTeam": "Calgary Mustangs",
      "awayTeam": "Edmonton Stallions",
      "homeScore": 12,
      "awayScore": 8,
      "homeStartingGoalie": "Marcus Chen",
      "awayStartingGoalie": "Trevor Walsh",
      "homeCurrentGoalie": "Marcus Chen",
      "awayCurrentGoalie": "Trevor Walsh",
      "periodPoints": {
        "period1Home": 1,
        "period1Away": 0,
        "period2Home": 0.5,
        "period2Away": 0.5,
        "period3Home": 1,
        "period3Away": 0,
        "totalPeriodHome": 2.5,
        "totalPeriodAway": 0.5
      },
      "finalGamePoints": {
        "home": 2,
        "away": 0
      },
      "totalGamePoints": {
        "home": 4.5,
        "away": 0.5
      },
      "periodLength": 12,
      "currentPeriod": "3",
      "periodTimeRemaining": 0,
      "overtimeAllowed": false,
      "threeStars": {
        "first": "Jake Morrison",
        "second": "Marcus Chen",
        "third": "Dylan MacLeod"
      },
      "goals": [
        {
          "period": "1",
          "time": "2:34",
          "scorer": "Jake Morrison",
          "assist1": "Connor Walsh",
          "assist2": "Tyler Boychuk",
          "team": "Calgary Mustangs",
          "goalType": "even_strength"
        }
      ],
      "penalties": [
        {
          "period": "2",
          "time": "8:15",
          "player": "Ryan McKenzie",
          "team": "Edmonton Stallions",
          "infraction": "slashing",
          "duration": "2min",
          "penaltyType": "minor"
        }
      ]
    },
    {
      "id": 2,
      "gameNumber": "2",
      "displayName": "Game 2: Saskatoon Broncos vs Vancouver Outlaws",
      "slug": "game-2-broncos-outlaws",
      "gameType": "pool",
      "day": "1",
      "scheduledTime": "2024-06-14T11:00:00-06:00",
      "status": "live",
      "homeTeam": "Saskatoon Broncos",
      "awayTeam": "Vancouver Outlaws",
      "homeScore": 7,
      "awayScore": 4,
      "homeStartingGoalie": "Jordan Kim",
      "awayStartingGoalie": "Alex Rodriguez",
      "homeCurrentGoalie": "Jordan Kim",
      "awayCurrentGoalie": "Alex Rodriguez",
      "periodPoints": {
        "period1Home": 1,
        "period1Away": 0,
        "period2Home": 0.5,
        "period2Away": 0.5,
        "period3Home": 0,
        "period3Away": 0,
        "totalPeriodHome": 1.5,
        "totalPeriodAway": 0.5
      },
      "finalGamePoints": {
        "home": 0,
        "away": 0
      },
      "totalGamePoints": {
        "home": 1.5,
        "away": 0.5
      },
      "periodLength": 12,
      "currentPeriod": "3",
      "periodTimeRemaining": 423,
      "overtimeAllowed": false,
      "youtubeUrl": "https://youtube.com/watch?v=example"
    }
  ]
}
```

### Content Examples

#### Tournament Rules Text
```
5-POINT TOURNAMENT SYSTEM

Period Points:
• 1 point for winning a period
• 0.5 points for tying a period
• 0 points for losing a period

Game Points:
• 2 points for winning a game
• 1 point for tying a game
• 0 points for losing a game

Maximum Points: 5 per game (3 period + 2 game)

RMLL MODIFIED RULES

Game Format:
• 12-minute periods (pool play)
• 15-minute periods (medal games)
• 2-minute intermissions
• Stop time: Last 2 minutes of 3rd period only

Equipment:
• No traditional sticks (except goalies)
• Standard box lacrosse protective equipment
• RMLL-approved helmets required

Playing Rules:
• 30-second shot clock
• 4-second crease count
• 8-second count to cross center line
• Immediate restart 6 feet away from violations
• Overtime: 5-minute sudden death (medal games only)

Roster Rules:
• Maximum 20 players on game roster
• 18 runners + 2 goalies maximum
• Unlimited total roster size
• Captain must be designated
```

#### Penalty Reference
```
MINOR PENALTIES (2 minutes):
• Slashing
• Tripping
• Interference
• Holding
• Illegal Pick
• Cross Checking
• Elbowing
• Roughing
• Unsportsmanlike Conduct
• Delay of Game
• Illegal Substitution
• Crease Violation
• Over and Back

MAJOR PENALTIES (5 minutes):
• High Sticking
• Boarding
• Face Masking
• Fighting
• Spearing
• Checking from Behind

MISCONDUCT PENALTIES:
• 10 minutes (player removed)
• Game misconduct (ejection)

PENALTY SHOT:
• Awarded for severe infractions preventing clear scoring opportunities
```

---

## Responsive Design Specifications

### Breakpoint Strategy

#### Mobile First Approach
Design for mobile devices first, then enhance for larger screens

#### Screen Categories
1. **Mobile**: 320px - 767px
2. **Tablet**: 768px - 1023px
3. **Desktop**: 1024px - 1439px
4. **Large Desktop**: 1440px+

### Component Responsive Behavior

#### Header Component
- **Mobile**: 64px height, hamburger menu, slide-out panel
- **Tablet**: 72px height, condensed navigation
- **Desktop**: 80px height, full mega menu navigation

#### Game Card Component
- **Mobile**: Full width, stacked layout
- **Tablet**: 2-column grid
- **Desktop**: 3-column grid

#### Scoreboard Component
- **Mobile**: Compact vertical layout
- **Tablet**: Horizontal layout with more details
- **Desktop**: Full layout with all statistics

#### Navigation
- **Mobile**: Hamburger menu with slide-out panel
- **Tablet**: Condensed horizontal navigation
- **Desktop**: Full mega menu with 3-column dropdowns

### Touch Targets

#### Minimum Sizes
- **Buttons**: 44px minimum height
- **Links**: 44px minimum touch area
- **Form Inputs**: 44px minimum height
- **Interactive Elements**: 44px minimum in either dimension

#### Spacing for Touch
- **Between Touch Targets**: 8px minimum
- **Around Interactive Elements**: 12px minimum
- **Form Field Spacing**: 16px minimum

### Typography Scaling

#### Responsive Font Sizes
```css
/* Mobile */
--heading-1: 2rem (32px)
--heading-2: 1.5rem (24px)
--heading-3: 1.25rem (20px)
--body: 1rem (16px)

/* Tablet */
--heading-1: 2.5rem (40px)
--heading-2: 2rem (32px)
--heading-3: 1.5rem (24px)
--body: 1rem (16px)

/* Desktop */
--heading-1: 3rem (48px)
--heading-2: 2.25rem (36px)
--heading-3: 1.875rem (30px)
--body: 1.125rem (18px)
```

### Layout Patterns

#### Container Behavior
- **Mobile**: 16px padding, full width
- **Tablet**: 24px padding, max 768px width
- **Desktop**: 32px padding, max 1200px width

#### Grid Systems
- **Mobile**: 1-column layout
- **Tablet**: 2-column layout
- **Desktop**: 3-4 column layout

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal Text**: 4.5:1 minimum contrast ratio
- **Large Text**: 3:1 minimum contrast ratio
- **Non-text Elements**: 3:1 minimum contrast ratio

#### Color Usage
- **Never use color alone** to convey information
- **Provide alternative indicators** (icons, text, patterns)
- **Test with color blindness simulators**

#### Keyboard Navigation
- **All interactive elements** must be keyboard accessible
- **Visible focus indicators** required
- **Logical tab order** maintained
- **Skip links** provided for main content

#### Screen Reader Support
- **Semantic HTML** structure
- **ARIA labels** for complex interactions
- **Alternative text** for images
- **Descriptive link text**

### Tournament-Specific Accessibility

#### Live Updates
- **Screen reader announcements** for score changes
- **Status indicators** beyond color
- **Text alternatives** for visual timers

#### Scorekeeper Interface
- **Large touch targets** (44px minimum)
- **High contrast mode** support
- **Voice announcements** for critical actions
- **Simplified navigation** for efficiency

#### Real-time Content
- **Polite announcements** for non-critical updates
- **Assertive announcements** for important changes
- **Pause/resume** functionality for live feeds

---

## Implementation Notes

### Technical Specifications

#### Framework
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** with shadcn/ui components
- **Payload CMS** for content management

#### Performance Requirements
- **Core Web Vitals**: 
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- **Mobile Performance**: 90+ Lighthouse score
- **Real-time Updates**: < 1 second latency

#### Development Workflow
- **Storybook** for component development
- **Figma** for design handoff
- **Component-driven** development approach
- **Atomic design** methodology

### Design Tokens Implementation

#### CSS Custom Properties
All design tokens should be implemented as CSS custom properties for consistency and maintainability.

#### Tailwind Configuration
Extend Tailwind configuration to include tournament-specific tokens and utilities.

#### Component Variants
Use Class Variance Authority (CVA) for type-safe component variants.

### Animation Guidelines

#### Performance
- **Use transform and opacity** for animations
- **Avoid animating layout properties**
- **Prefer CSS animations** over JavaScript
- **Provide reduce motion** alternatives

#### Western Theme Animations
- **Subtle parallax** effects for depth
- **Rope/lasso** themed loading animations
- **Wood grain** texture reveals
- **Dust particle** effects for transitions

### Browser Support

#### Minimum Requirements
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: 14+
- **Chrome Mobile**: 90+

#### Progressive Enhancement
- **Core functionality** works without JavaScript
- **Enhanced features** with JavaScript enabled
- **Fallbacks** for unsupported features

---

## Design Checklist

### Before Starting Design
- [ ] Review tournament data structure
- [ ] Understand 5-point scoring system
- [ ] Familiarize with RMLL rules
- [ ] Study western theme references
- [ ] Review accessibility requirements

### During Design
- [ ] Use consistent spacing system
- [ ] Apply western color palette
- [ ] Ensure 44px touch targets
- [ ] Test color contrast ratios
- [ ] Design for all screen sizes
- [ ] Include loading and error states
- [ ] Plan for real-time updates

### Component Design
- [ ] Create all component states
- [ ] Design responsive variants
- [ ] Include accessibility considerations
- [ ] Plan for keyboard navigation
- [ ] Add focus indicators
- [ ] Test with screen readers

### Handoff Preparation
- [ ] Organize components by atomic structure
- [ ] Include detailed specifications
- [ ] Provide mock data examples
- [ ] Document interactions
- [ ] Create responsive examples
- [ ] Include accessibility notes

---

This comprehensive design bible provides all the information needed to create detailed Figma designs for the Cowtown Showdown tournament website. The western theme, tournament-specific requirements, and modern web standards are all incorporated to ensure a cohesive and functional design system.