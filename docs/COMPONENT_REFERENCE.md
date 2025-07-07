# React Component Reference

This document provides comprehensive documentation for all React components in the Cowtown Showdown tournament website.

## Table of Contents

- [Component Architecture](#component-architecture)
- [UI Components](#ui-components)
- [Tournament Components](#tournament-components)
- [Scorekeeper Components](#scorekeeper-components)
- [Content Components](#content-components)
- [Block Components](#block-components)
- [Component Patterns](#component-patterns)
- [Usage Examples](#usage-examples)

## Component Architecture

### Directory Structure

```
src/
├── components/
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── tournament/      # Tournament-specific components
│   ├── scorekeeper/     # Scorekeeper interface components
│   ├── Media/           # Media handling components
│   ├── RichText/        # Rich text rendering
│   └── Link/            # Link component
├── blocks/              # Payload CMS content blocks
│   ├── Banner/
│   ├── CallToAction/
│   └── Form/
└── app/
    └── (frontend)/      # Page-level components
```

### Key Principles

1. **Server/Client Separation**: Clear boundaries with 'use client' directive
2. **Type Safety**: Full TypeScript with Payload-generated types
3. **Composition**: Compound components for flexibility
4. **Performance**: Memoization and lazy loading where appropriate
5. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## UI Components

### Button

A versatile button component with multiple variants and sizes.

```typescript
import { Button } from '@/components/ui/button'

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="destructive" size="lg">Delete</Button>
<Button variant="outline" size="icon">
  <Icon />
</Button>

// As a different element
<Button asChild>
  <Link href="/games">View Games</Link>
</Button>
```

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon' | 'clear'
- `asChild`: boolean - Render as child component
- Standard button HTML attributes

### Card

Container component with header, content, and footer sections.

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Calgary Bears vs Edmonton Storm</CardTitle>
    <CardDescription>Pool Play - Game 1</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-4xl font-bold">5 - 3</div>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

**Features:**
- Flexible composition
- Consistent spacing
- Shadow and border styling
- Responsive padding

### Badge

Small label component for status indicators and tags.

```typescript
import { Badge } from '@/components/ui/badge'

// Game status
<Badge variant="default">LIVE</Badge>
<Badge variant="secondary">FINAL</Badge>
<Badge variant="destructive">CANCELLED</Badge>
<Badge variant="outline">UPCOMING</Badge>
```

**Props:**
- `variant`: 'default' | 'secondary' | 'destructive' | 'outline'
- `className`: Additional CSS classes

### Dialog

Modal dialog component with overlay and animations.

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Select Three Stars</DialogTitle>
      <DialogDescription>
        Choose the three stars of the game
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
    <DialogFooter>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Features:**
- Portal rendering
- Focus management
- Escape key handling
- Backdrop click to close
- Smooth animations

## Tournament Components

### Scoreboard

Live tournament scoreboard displaying all games.

```typescript
import { Scoreboard } from '@/components/tournament/Scoreboard'

<Scoreboard 
  games={games}
  autoRefresh={true}
  refreshInterval={5000}
/>
```

**Props:**
```typescript
interface ScoreboardProps {
  games: Game[]
  autoRefresh?: boolean      // Default: true
  refreshInterval?: number   // Default: 5000ms
}
```

**Features:**
- Automatic game categorization (live, upcoming, recent)
- Real-time updates
- Tournament points display
- Three stars indicators
- Responsive grid layout

### GameCard

Individual game display card with live updates.

```typescript
import { GameCard } from '@/components/tournament/GameCard'

<GameCard
  game={game}
  showDay={true}
  showTournamentPoints={true}
  showThreeStars={true}
  compact={false}
/>
```

**Props:**
```typescript
interface GameCardProps {
  game: Game
  showDay?: boolean
  showTournamentPoints?: boolean
  showThreeStars?: boolean
  compact?: boolean
}
```

**Features:**
- Live game pulse animation
- Period and time display
- Power play/penalty kill indicators
- YouTube stream indicator
- Compact mode for mobile

### StandingsTable

Tournament standings with 5-point system calculations.

```typescript
import { StandingsTable } from '@/components/tournament/StandingsTable'

<StandingsTable 
  teams={teams}
  games={games}
  showTrends={true}
/>
```

**Props:**
```typescript
interface StandingsTableProps {
  teams: Team[]
  games: Game[]
  showTrends?: boolean
}
```

**Columns:**
- Rank
- Team (with logo)
- GP (Games Played)
- W-L-T (Record)
- PTS (Tournament Points)
- GF/GA (Goals For/Against)
- DIFF (Goal Differential)
- L5 (Last 5 games)

**5-Point System:**
- 2 points for game win
- 1 point per period win
- 0.5 points per period tie
- Maximum 5 points per game

### TournamentHomepage

Main tournament homepage with real-time updates.

```typescript
import { TournamentHomepage } from '@/components/tournament/TournamentHomepage'

<TournamentHomepage />
```

**Features:**
- Server-Sent Events integration
- Connection status indicator
- Game categorization
- Tournament statistics
- Team roster display
- Responsive layout

**Real-time Updates:**
```typescript
// SSE connection management
useEffect(() => {
  const eventSource = new EventSource('/api/games/live')
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    updateGames(data.games)
  }
  
  return () => eventSource.close()
}, [])
```

## Scorekeeper Components

### ScoringInterface

Main scoring interface for game management.

```typescript
import { ScoringInterface } from '@/components/scorekeeper/ScoringInterface'

<ScoringInterface
  game={game}
  homeRoster={homePlayers}
  awayRoster={awayPlayers}
  currentUser={user}
/>
```

**Props:**
```typescript
interface ScoringInterfaceProps {
  game: Game
  homeRoster: Player[]
  awayRoster: Player[]
  currentUser: User
}
```

**Layout:**
- Left: Home team stats
- Center: Score display and timer
- Right: Away team stats
- Bottom: Game log

**Features:**
- Period timer management
- Quick stat buttons
- Player selection
- Three stars dialog
- Offline queue support

### GamesDashboard

Central dashboard for scorekeepers.

```typescript
import { GamesDashboard } from '@/components/scorekeeper/GamesDashboard'

<GamesDashboard currentUser={user} />
```

**Features:**
- Available games list
- Game claiming/releasing
- One game per scorekeeper
- Real-time status updates

### Timer

Period timer component with controls.

```typescript
import { Timer } from '@/components/scorekeeper/Timer'

<Timer
  game={game}
  onPeriodStart={handlePeriodStart}
  onTimerUpdate={handleTimerUpdate}
/>
```

**Controls:**
- Start/Stop timer
- Reset timer
- Period selection
- Time adjustment

### StatButtons

Quick stat entry buttons.

```typescript
import { StatButtons } from '@/components/scorekeeper/StatButtons'

<StatButtons
  team="home"
  players={players}
  onGoal={handleGoal}
  onPenalty={handlePenalty}
  onFaceoff={handleFaceoff}
/>
```

**Button Types:**
- Goal (with assist selection)
- Penalty (with infraction)
- Faceoff (win/loss)
- Shot
- Save
- Loose ball

## Content Components

### RichText

Renders Lexical rich text content with custom blocks.

```typescript
import { RichText } from '@/components/RichText'

<RichText
  content={page.content}
  enableGutter={true}
  enableProse={true}
/>
```

**Props:**
```typescript
interface RichTextProps {
  content: SerializedLexicalNode
  enableGutter?: boolean
  enableProse?: boolean
  className?: string
}
```

**Supported Blocks:**
- Headings (h1-h6)
- Paragraphs
- Lists (ordered/unordered)
- Links
- Images
- Code blocks
- Custom blocks (Banner, CTA)

### Media

Handles image and video display.

```typescript
import { Media } from '@/components/Media'

<Media
  resource={mediaItem}
  priority={true}
  className="w-full"
/>
```

**Props:**
```typescript
interface MediaProps {
  resource: string | Media
  priority?: boolean
  className?: string
  imgClassName?: string
}
```

**Features:**
- Automatic media type detection
- Next.js Image optimization
- Video player support
- Responsive sizing

### Link

CMS-configurable link component.

```typescript
import { Link } from '@/components/Link'

<Link
  {...linkField}
  className="text-primary"
  appearance="button"
/>
```

**Props:**
```typescript
interface LinkProps {
  type?: 'reference' | 'custom'
  reference?: { value: string | Page }
  url?: string
  label?: string
  appearance?: 'default' | 'button'
  newTab?: boolean
  className?: string
  size?: ButtonProps['size']
}
```

## Block Components

### Banner

Alert/notification banner block.

```typescript
import { BannerBlock } from '@/blocks/Banner/Component'

<BannerBlock
  style="warning"
  content={richTextContent}
/>
```

**Styles:**
- `info`: Blue background
- `warning`: Yellow background
- `error`: Red background
- `success`: Green background

### CallToAction

CTA section with rich text and links.

```typescript
import { CallToActionBlock } from '@/blocks/CallToAction/Component'

<CallToActionBlock
  richText={content}
  links={[
    { link: { label: 'Register', url: '/register' } }
  ]}
/>
```

**Features:**
- Rich text content
- Multiple link support
- Button styling
- Centered layout

### Form

Dynamic form builder integration.

```typescript
import { FormBlock } from '@/blocks/Form/Component'

<FormBlock form={formConfig} />
```

**Features:**
- Dynamic field rendering
- Validation
- Submission handling
- Success/error states
- Redirect support

## Component Patterns

### Compound Components

```typescript
// Card uses compound component pattern
<Card>
  <CardHeader>
    <CardTitle />
    <CardDescription />
  </CardHeader>
  <CardContent />
  <CardFooter />
</Card>
```

### Render Props

```typescript
// Dialog trigger as child
<DialogTrigger asChild>
  <Button>Open</Button>
</DialogTrigger>
```

### Custom Hooks

```typescript
// useGame hook for real-time updates
function GameDisplay({ gameId }) {
  const { game, loading, error } = useGame(gameId)
  
  if (loading) return <Spinner />
  if (error) return <Error />
  
  return <GameCard game={game} />
}
```

### Memoization

```typescript
// Expensive calculations memoized
const sortedStandings = useMemo(() => {
  return calculateStandings(teams, games)
}, [teams, games])
```

## Usage Examples

### Complete Game Page

```typescript
import { GameCard } from '@/components/tournament/GameCard'
import { useSSE } from '@/hooks/useSSE'

export default function GamePage({ params }) {
  const { game, loading } = useSSE(`/api/games/${params.id}/live`)
  
  if (loading) return <LoadingSpinner />
  
  return (
    <div className="container mx-auto py-8">
      <GameCard 
        game={game}
        showTournamentPoints
        showThreeStars
      />
      
      {game.youtubeUrl && (
        <div className="mt-8">
          <YouTubeEmbed url={game.youtubeUrl} />
        </div>
      )}
      
      <BoxScore game={game} />
    </div>
  )
}
```

### Scorekeeper Dashboard

```typescript
import { GamesDashboard } from '@/components/scorekeeper/GamesDashboard'
import { ScoringInterface } from '@/components/scorekeeper/ScoringInterface'

export default function ScorekeeperPage() {
  const [selectedGame, setSelectedGame] = useState(null)
  const { user } = useAuth()
  
  if (!selectedGame) {
    return <GamesDashboard 
      currentUser={user}
      onGameSelect={setSelectedGame}
    />
  }
  
  return <ScoringInterface
    game={selectedGame}
    currentUser={user}
    onComplete={() => setSelectedGame(null)}
  />
}
```

### Custom Theme Integration

```typescript
// Using western theme classes
<Card className="border-primary-brown">
  <CardHeader>
    <CardTitle className="font-western text-golden">
      Cowtown Showdown
    </CardTitle>
  </CardHeader>
</Card>
```

## Performance Considerations

### Lazy Loading

```typescript
const StandingsTable = lazy(() => 
  import('@/components/tournament/StandingsTable')
)

<Suspense fallback={<TableSkeleton />}>
  <StandingsTable teams={teams} games={games} />
</Suspense>
```

### Real-time Optimization

```typescript
// Debounced updates
const debouncedUpdate = useMemo(
  () => debounce(updateGame, 1000),
  []
)

// Selective re-renders
const GameScore = memo(({ home, away }) => (
  <div>{home} - {away}</div>
), (prev, next) => 
  prev.home === next.home && prev.away === next.away
)
```

### Image Optimization

```typescript
<Media
  resource={team.logo}
  priority={index < 4} // Priority for above-fold
  className="w-24 h-24"
/>
```

## Accessibility

### ARIA Labels

```typescript
<Button
  aria-label="Start period 1"
  aria-pressed={isTimerRunning}
>
  Start
</Button>
```

### Keyboard Navigation

```typescript
<Dialog>
  {/* Automatic focus management */}
  {/* Escape key handling */}
  {/* Tab trapping */}
</Dialog>
```

### Screen Reader Support

```typescript
<div role="status" aria-live="polite">
  <span className="sr-only">
    Score updated: Home {homeScore}, Away {awayScore}
  </span>
</div>
```

## Testing Components

### Unit Testing

```typescript
import { render, screen } from '@testing-library/react'
import { GameCard } from '@/components/tournament/GameCard'

test('displays live indicator for live games', () => {
  const game = { status: 'live', homeScore: 5, awayScore: 3 }
  render(<GameCard game={game} />)
  
  expect(screen.getByText('LIVE')).toBeInTheDocument()
  expect(screen.getByText('5')).toBeInTheDocument()
})
```

### Storybook Stories

```typescript
export const LiveGame: Story = {
  args: {
    game: {
      status: 'live',
      homeTeam: { name: 'Calgary Bears' },
      awayTeam: { name: 'Edmonton Storm' },
      homeScore: 5,
      awayScore: 3,
      currentPeriod: 2,
      periodTimeRemaining: 420
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **SSE Connection Drops**
   - Check network stability
   - Implement reconnection logic
   - Monitor server capacity

2. **State Synchronization**
   - Use server as source of truth
   - Implement optimistic updates
   - Handle race conditions

3. **Performance Issues**
   - Profile with React DevTools
   - Implement virtualization for lists
   - Optimize re-renders

## Additional Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Server Components](https://react.dev/reference/react/use-server)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)