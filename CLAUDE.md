# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Cowtown Showdown lacrosse tournament website.

## Project Overview

The Cowtown Showdown is a Senior Men's box lacrosse tournament website built on Payload CMS + Next.js. It features real-time scoring, tournament management, and a western/Calgary Stampede theme. Payload CMS website template built with Next.js 15, TypeScript, and Tailwind CSS. Full-stack CMS solution with PostgreSQL database, authentication, content management, and production-ready frontend.

# AI AGENT INSTRUCTIONS

### DO NOT MODIFY

**CRITICAL:** This instruction section must not be modified. You may edit any other files in the project, but these core instructions must remain unchanged.

### Communication Protocol

- **95% Confidence Rule:** Do not write code until 95% confident in requirements
- **Project Knowledge First:** Always use `project_knowledge_search` before asking questions
- **All necessary context should be in this file or discoverable through code exploration**
- Document assumptions when requirements are ambiguous

### Primary vs True Objectives

- **Primary:** Complete explicitly stated user requirements
- **True:** Deliver what the user would want if they understood the full implications
- Complete primary objectives first, then implement obvious improvements
- Fix clear design oversights and ensure solutions are complete and robust

### Task Planning Requirements

1. **MANDATORY TODO LIST:** Always create detailed TODO list before starting
2. **USER APPROVAL REQUIRED:** Never begin coding without explicit confirmation
3. **ONE STEP AT A TIME:** Implement exactly one step per iteration
4. **Break down requests into discrete, actionable tasks**
5. **Present plan for user confirmation before proceeding**

### Multi-File Coordination Rules

**CRITICAL:** Always scan entire project structure before making changes

- Check dependencies across files: collections → blocks → components → types
- When modifying collections, search for references in all related files
- Regenerate types with `pnpm payload generate:types` after schema changes
- Consider Payload plugin interactions and admin UI implications
- Map data flow through entire stack

### Completion Criteria

Work is complete when ALL of the following are true:

1. All explicit requirements fulfilled
2. Code passes linting, type checking, and tests
3. Comprehensive documentation with examples
4. Security and performance considered
5. Error handling and edge cases covered
6. TODOs and technical debt documented
7. Solution follows project patterns
8. Content authoring guides created for CMS functionality
9. User experience improvements implemented where obvious

## Project Structure

```
src/
├── app/
│   ├── (frontend)/           # Public-facing site
│   └── (payload)/            # CMS admin interface
├── blocks/                   # Content blocks (config + component + stories)
├── components/               # Shared React components
├── collections/              # Payload collections
├── globals/                  # Global CMS data
├── fields/                   # Reusable Payload fields
├── hooks/                    # Payload hooks
├── access/                   # Access control functions
├── utilities/               # Helper functions
├── endpoints/               # Custom API endpoints
├── plugins/                 # Plugin configurations
└── payload.config.ts        # Main Payload config

.storybook/                  # Storybook configuration
```

### Key Features

- **Live Scoring System** - Real-time game updates with scorekeeper interface
- **Tournament Management** - 8 teams, pool play format, 22 games over 3 days
- **5-Point Game System** - 2 points for win, 1 point per period win, 0.5 for period tie
- **Three Stars Recognition** - Post-game player recognition
- **Western Gothic Theme** - Brand colors: #934F25, #5E2713, #D6AC4D
- **RMLL Modified Rules** - Same as OLA modified box lacrosse rules

### Core Stack

- **Frontend:** Next.js 14+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS with custom design system
- **CMS:** Payload CMS 3.x
- **Database:** MongoDB or PostgreSQL
- **Package Manager:** pnpm (v9 or v10)
- **Node:** ^18.20.2 || >=20.9.0
- **Testing:** Vitest + Playwright
- **Components:** Storybook 8+
- **Docker:** Node 22.12.0-alpine

## Essential Commands

### Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm storybook` - Start Storybook
- `pnpm payload generate:types` - Generate TypeScript types

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm generate:types` - Generate TypeScript types from Payload config
- `pnpm generate:importmap` - Generate import map for admin panel

### Testing

- `pnpm test` - Run all tests (integration + e2e)
- `pnpm test:int` - Run integration tests with Vitest
- `pnpm test:e2e` - Run end-to-end tests with Playwright

### Database & Content

- `pnpm payload` - Access Payload CLI
- `pnpm payload migrate:create` - Create new database migration
- `pnpm payload migrate` - Run pending migrations

## Architecture Overview

This is a **Payload CMS + Next.js 15** tournament website using:

- **Database**: PostgreSQL/MongoDB with Payload adapter
- **Frontend**: Next.js App Router (React 19)
- **Styling**: TailwindCSS + shadcn/ui + Western Gothic fonts
- **Editor**: Lexical rich text editor
- **Real-time**: Server-Sent Events (SSE) for live updates
- **Deployment**: Coolify server (500-900 concurrent users)

### Key Directories

**Core Application**

- `src/app/(frontend)/` - Public tournament pages
- `src/app/(payload)/` - Payload admin and API routes
- `src/app/api/games/` - Real-time game endpoints
- `src/app/scorekeeper/` - Scorekeeper interface

**Tournament Collections**

- `src/collections/Teams/` - 8 tournament teams with captain info
- `src/collections/Players/` - Player rosters (max 20 on game roster, unlimited total)
- `src/collections/Games/` - 22 scheduled games (pool play + medal games)
- `src/collections/Goals/` - Goal scoring events
- `src/collections/Penalties/` - Penalty tracking with RMLL infractions
- `src/collections/Faceoffs/` - Faceoff statistics
- `src/collections/Shots/` - Shot tracking for goalies
- `src/collections/LooseBalls/` - Loose ball recoveries
- `src/collections/Users/` - ✅ Enhanced with role-based authentication
- `src/collections/AuditLogs/` - ✅ Security and compliance audit trail

**Components**

- `src/components/Scoreboard/` - Live game scoreboard widget
- `src/components/GameCard/` - Game display cards
- `src/components/BoxScore/` - Detailed game statistics
- `src/components/ThreeStars/` - Post-game recognition
- `src/components/Auth/` - ✅ Authentication and security components
  - `LoginForm.tsx` - Tournament login interface
  - `SessionTimer.tsx` - Scorekeeper session countdown
  - `GameClaimManager.tsx` - Game claiming interface
- `src/components/scorekeeper/` - ✅ **COMPLETED** Comprehensive scorekeeper interface
  - `GamesDashboard.tsx` - Game listing and claiming interface
  - `ScoringInterface.tsx` - Main live game management interface
  - `ScoreBoard.tsx` - Real-time score display
  - `Timer.tsx` - Period timer with start/stop/reset controls
  - `StatButtons.tsx` - Statistics entry buttons (goals, penalties, etc.)
  - `PlayerSelectDialog.tsx` - Player selection for stat attribution
  - `PenaltyDialog.tsx` - RMLL penalty system integration
  - `GameLog.tsx` - Chronological game event history
  - `PeriodControls.tsx` - Period management and game flow
  - `ThreeStarsDialog.tsx` - Post-game player recognition
  - `GameClaimDialog.tsx` - Game claiming confirmation

### Tournament Data Model

**Teams Collection**

```typescript
{
  name: string // "Calgary Bears"
  slug: string // "calgary-bears"
  logo?: Media
  primaryColor?: string
  secondaryColor?: string
  city: string
  province: string
  captain: {
    name: string
    email: string
    phone: string
  }
}
```

**Players Collection**

```typescript
{
  firstName: string
  lastName: string
  jerseyNumber: number // 0-99
  team: Team // relationship
  primaryPosition: 'offence' | 'defence' | 'transition' | 'faceoff' | 'goalie'
  secondaryPosition?: string
  handedness: 'left' | 'right'
  playerType: 'runner' | 'goalie'
}
```

**Games Collection**

```typescript
{
  gameNumber: string // "1", "2", etc.
  gameType: 'pool' | 'medal' // medal games are final 2 games
  day: 1 | 2 | 3
  scheduledTime: Date
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  homeTeam: Team
  awayTeam: Team
  homeScore: number
  awayScore: number
  homeStartingGoalie: Player
  awayStartingGoalie: Player
  homeCurrentGoalie: Player
  awayCurrentGoalie: Player
  currentPeriod: 0 | 1 | 2 | 3 | 'OT1' | 'OT2' // etc
  periodTimeRemaining: number // seconds
  
  // Tournament Points (5-point system)
  gamePoints: { home: number, away: number } // Total points earned
  periodPoints: {
    period1: { home: number, away: number } // 0, 0.5, or 1
    period2: { home: number, away: number }
    period3: { home: number, away: number }
  }
  finalGamePoints: { home: number, away: number } // 0, 1, or 2
  
  // Game timing
  periodLength: number // 12 for pool, 15 for medal games
  overtimeAllowed: boolean // only for medal games
  
  youtubeUrl?: string
  threeStars?: {
    first: Player
    second: Player
    third: Player
  }
}
```

### Penalty Definitions

**Penalty Types and Durations**

```typescript
type PenaltyDuration = '30s' | '1min' | '2min' | '3min' | '5min' | '10min' | 'game' | 'penalty_shot'
type PenaltyType = 'minor' | 'major' | 'misconduct' | 'game_misconduct' | 'penalty_shot'
```

**Common Penalties**
- Minor (2 min): Slashing, Tripping, Interference, Holding, Illegal Pick, Cross Checking, Elbowing, Roughing, Unsportsmanlike Conduct, Delay of Game, Illegal Substitution, Crease Violation, Over and Back
- Major (5 min): High Sticking, Boarding, Face Masking, Fighting, Spearing, Checking from Behind
- Misconduct (10 min): Serious violations warranting removal
- Game Misconduct: Ejection from game
- Penalty Shot: Severe infractions preventing clear scoring opportunities

### Real-time Updates

**SSE Endpoints**

- `GET /api/games/:id/live` - Live game updates
- `POST /api/games/:id/stats` - Submit statistics
- `POST /api/games/:id/start-period` - Period management
- `POST /api/games/:id/goal` - Goal scoring
- `POST /api/games/:id/penalty` - Penalty tracking
- `POST /api/games/:id/faceoff` - Faceoff results
- `POST /api/games/:id/shot` - Shot tracking
- `POST /api/games/:id/loose-ball` - Loose ball recoveries
- `POST /api/games/:id/goalie-change` - Track goalie changes

**Update Frequencies**

- Score updates: < 1 second
- Stats updates: 5 seconds
- Period timer: Every second
- Penalty countdown: Every second

### Western Theme Implementation

**Typography**

- Display/Headings: Western Gothic font (Rye, Smokum, or similar)
- Body/UI: Geist Sans (Vercel font)

**Color Variables**

```css
--primary-brown: #934f25;
--dark-brown: #5e2713;
--golden: #d6ac4d;
--power-play: #2196f3;
--penalty-kill: #ff5722;
```

## Statistics Glossary

### Runner Statistics
- **GP** - Games Played
- **G** - Goals
- **A** - Assists
- **PTS** - Points (Goals + Assists)
- **PIM** - Penalty Minutes
- **PPG** - Power Play Goals
- **PPA** - Power Play Assists
- **SHG** - Short Handed Goals
- **LB** - Loose Ball Recoveries
- **TO** - Turnovers
- **CTO** - Caused Turnovers
- **BLK** - Blocked Shots
- **SOG** - Shots on Goal
- **FO** - Faceoff Wins/Attempts
- **FO%** - Faceoff Win Percentage

### Goaltender Statistics
- **MIN** - Minutes Played
- **W** - Wins
- **L** - Losses
- **GA** - Goals Allowed
- **GAA** - Goals Allowed Average
- **SV** - Saves
- **SV%** - Save Percentage

## Tournament-Specific Features

### Scorekeeper Interface

- Mobile-optimized for tablets
- Large touch targets (min 44x44px)
- Period timer controls (12-minute periods)
- Quick stat buttons (goals, shots, faceoffs, etc.)
- Undo functionality with full edit capabilities
- Offline capability with sync
- One game at a time per scorekeeper
- Claim/release game functionality
- Three stars selection (immediate, final)

### Public Features

- Scrollable homepage scoreboard (grouped by day)
- Live game updates with PP/PK indicators
- Standings with 5-point system
- Schedule with calendar/list views
- Three stars display
- YouTube Live integration:
  - Featured game stream on homepage
  - Stream embedded on game detail pages
  - Live stats alongside stream (no scorebug)

### Game Flow

1. Pre-game: Set teams and starting goalies
2. Period start: Timer begins countdown
3. During play: Track all statistics
4. Period end: Confirm stats
5. Post-game: Select three stars, calculate points

## Development Workflow

### Tournament Rules & Structure

**RMLL Modified Rules**
- 30-second shot clock
- 4-second crease count (must exit crease within 4 seconds)
- 8-second count to cross center line
- No traditional sticks (except goalies)
- Immediate restart after violations (6 feet away)
- Stop time last 2 minutes of 3rd period only
- 12-minute periods (pool play), 15-minute periods (medal games)
- 5-minute sudden death overtime (medal games only)

**5-Point Tournament System**
- 2 points for game win
- 1 point for game tie
- 0 points for game loss
- 1 point for winning a period
- 0.5 points for tying a period
- 0 points for losing a period
- Maximum 5 points per game possible

**Tiebreaker Rules (in order)**
1. Head-to-head tournament points
2. Head-to-head goal average (GF ÷ (GF + GA))
3. Overall goal average
4. Least penalty minutes

### Adding Tournament Data

1. Create 8 teams with captain contact info
2. Import player rosters via CSV/Excel:
   - Columns: Jersey, First Name, Last Name, Position, Handedness, Player Type
   - Positions: offence, defence, transition, faceoff, goalie
   - Unlimited total players, max 20 on game roster
3. Create game schedule (22 games)
4. Configure user roles (2 admins, 2-3 scorekeepers)

### Testing Live Scoring

1. Create test game in 'scheduled' status
2. Login as scorekeeper
3. Start game and test all stat buttons
4. Verify real-time updates on public site
5. Complete game and check three stars

### Deployment Checklist

- [ ] Environment variables set (DATABASE_URI, PAYLOAD_SECRET)
- [ ] Migrations run with `pnpm payload migrate`
- [ ] Teams and schedule imported
- [ ] Scorekeeper accounts created
- [ ] Real-time endpoints tested
- [ ] Mobile responsiveness verified

## Key Implementation Notes

### Scorekeeper Workflow

- Central games dashboard for claiming games
- One game per scorekeeper at a time
- Full editing capabilities during and after games
- Three stars selection immediately after game (cannot be changed)
- Offline queue with automatic sync when reconnected

### Performance Considerations

- Optimize for 500-900 concurrent users
- Cache active game states (Redis recommended)
- Minimize real-time payload size
- Use optimistic UI updates
- Database indexing on critical queries
- CDN for static assets

### Security

- Scorekeeper role restrictions
- CSRF protection on stat submissions
- Rate limiting on API endpoints
- Audit trail for all game actions

### Mobile Optimization

- Portrait orientation priority
- High contrast for outdoor use
- Prevent accidental double-taps
- Service worker for offline capability

## Environment Variables

```env
DATABASE_URI=              # PostgreSQL/MongoDB connection
PAYLOAD_SECRET=            # Payload secret key
NEXT_PUBLIC_SERVER_URL=    # Server URL for SSE
SCOREKEEPER_SESSION_TIMEOUT=14400  # 4 hours
REALTIME_UPDATE_INTERVAL=1000      # 1 second

# Authentication & Security
JWT_SECRET=                # JWT signing secret
CSRF_SECRET=               # CSRF protection secret
ADMIN_SESSION_TIMEOUT=86400        # 24 hours for admins
AUDIT_LOG_RETENTION_DAYS=365       # Audit log retention

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000        # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100        # Default max requests
```

## Tournament Configuration

- **Fee Structure**: $1,800 per team OR $90 per player
- **Roster Size**: Unlimited players allowed, max 20 on game roster (18 runners + 2 goalies)
- **Guaranteed Games**: 5 games per team
- **Game Interval**: New game every 50 minutes
- **Warmup Time**: 5 minutes before each game
- **Break Between Periods**: 2 minutes
- **Timeouts**: 2 per game (cannot use both in same period)
- **Additional OT Timeout**: 1 timeout in overtime
- **Field Dimensions**: 210' x 85' (approximately)
- **Goal Size**: 4' high x 4'6" wide

## Required Development Workflow

### 1. Before Starting Any Changes

```bash
# Verify project state
pnpm payload generate:types
pnpm lint
pnpm build

# Start development
pnpm dev              # Next.js (localhost:3000)
pnpm storybook        # Storybook (localhost:6006)
```

### 2. Multi-File Change Coordination

1. **Identify scope**: List all files that reference the component
2. **Search dependencies**: `grep -r "ComponentName" --include="*.ts" --include="*.tsx"`
3. **Update systematically**: Make changes in dependency order
4. **Regenerate types**: `pnpm payload generate:types` after schema changes
5. **Verify completeness**: Re-check all references

### 3. After Every Change

```bash
pnpm lint:fix
pnpm payload generate:types
pnpm build
pnpm test:int
```

## FILE MODIFICATION FORMAT

For EVERY file you create or modify, use this EXACT format:

```
Here's what I did and why: [Detailed explanation]

Filepath: src/components/Example.tsx

/**
 * @description
 * Component purpose and responsibilities
 *
 * @dependencies
 * - List all dependencies and their purpose
 *
 * @notes
 * - Important implementation details
 */

[COMPLETE FILE CONTENTS - NO ELLIPSIS OR PLACEHOLDERS]
```

## Storybook Requirements

Every block and component MUST have comprehensive stories:

### Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './Component'

const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    // Define interactive controls
  },
}

export default meta
type Story = StoryObj<typeof ComponentName>

// Essential stories
export const Default: Story = {
  args: {
    /* default props */
  },
}
export const Minimal: Story = {
  args: {
    /* minimal props */
  },
}
export const ErrorState: Story = {
  args: {
    /* error state */
  },
}
export const Mobile: Story = {
  args: {
    /* default props */
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
```

## Documentation Requirements

### Code Documentation Pattern

```typescript
/**
 * @description Component purpose
 * @dependencies External dependencies used
 * @accessibility ARIA labels and keyboard support
 * @performance Optimization techniques
 */

// TODO: [PRIORITY] Task description
// BUG: [CRITICAL] Issue description
// SECURITY: Important security note
```

### Content Authoring Documentation

For each new block/content type, create documentation in `/specs/docs/content-authoring/` including:

- Field configuration steps
- Content creation workflow
- Usage examples
- Common patterns

## Common Payload Patterns

### Collection Definition

```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
  },
  fields: [
    /* field definitions */
  ],
}
```

### Error Handling

```typescript
// Collection hooks
beforeChange: async ({ data, req }) => {
  try {
    // Validation logic
    return data
  } catch (error) {
    req.payload.logger.error('Validation failed:', error)
    throw new ValidationError('Specific error message')
  }
}

// React components
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

if (error) return <ErrorMessage error={error} />
if (loading) return <LoadingSpinner />
```

## Step Completion Format

```
STEP X COMPLETE. Here's what I did and why:
[Detailed explanation]

DOCUMENTATION UPDATES:
- [ ] Updated relevant documentation
- [ ] Added to Claude.md if needed
- [ ] Created content authoring guide

STORYBOOK UPDATES:
- [ ] Created comprehensive stories
- [ ] Added responsive examples
- [ ] Documented edge cases

USER INSTRUCTIONS:
- [Manual steps required]
```

## Security & Performance Checklist

### Security

- [ ] Access control configured
- [ ] Input validation implemented
- [ ] File upload restrictions
- [ ] API rate limiting considered
- [ ] Sensitive data protected

### Performance

- [ ] Database queries optimized
- [ ] Images optimized with Next.js Image
- [ ] Bundle size considered
- [ ] Caching strategy appropriate
- [ ] Large collections paginated

## Prohibited Actions

**FORBIDDEN:**

- Direct database modifications in production
- Exposing admin credentials in code
- Using `any` types instead of proper TypeScript
- Committing debug console.log statements
- Skipping error handling "temporarily"
- Hardcoding sensitive data

## Do Not Touch

- `/src/app/(payload)/admin/` - auto-generated
- `payload-types.ts` - regenerated by CLI
- `.env` files or secrets
- Core Payload plugin configurations without understanding dependencies

## Quality Assurance Checklist

Before considering any task complete:

### Code Quality

- [ ] TypeScript compilation passes
- [ ] All linting rules pass
- [ ] Tests pass
- [ ] Storybook builds without errors
- [ ] No debug statements left
- [ ] Error handling implemented

### Payload CMS Specific

- [ ] Types regenerated after schema changes
- [ ] Admin UI tested
- [ ] Access control verified
- [ ] Draft preview tested

### Documentation

- [ ] Code documented with examples
- [ ] Content authoring docs created/updated
- [ ] Storybook stories comprehensive
- [ ] TODOs and technical debt noted

---

_This Claude.md file serves as the constitution for AI-assisted development on this Payload CMS project. Update when architectural changes occur, but never compromise on core standards._
