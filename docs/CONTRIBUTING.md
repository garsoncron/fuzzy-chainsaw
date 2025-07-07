# Contributing to Cowtown Showdown

Thank you for your interest in contributing to the Cowtown Showdown tournament website! This guide will help you get started with development and ensure that your contributions align with the project's standards.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Submission Guidelines](#submission-guidelines)
- [Issue Reporting](#issue-reporting)
- [Documentation](#documentation)
- [Release Process](#release-process)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js**: ^18.20.2 || >=20.9.0
- **pnpm**: v9 or v10
- **Docker**: Latest stable version
- **Git**: Latest version

### Development Setup

1. **Fork and Clone the Repository**

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/cowtown-nextjs-1.git
cd cowtown-nextjs-1

# Add upstream remote
git remote add upstream https://github.com/original-owner/cowtown-nextjs-1.git
```

2. **Install Dependencies**

```bash
# Install project dependencies
pnpm install

# Verify installation
pnpm --version
node --version
```

3. **Environment Setup**

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
# Minimum required variables:
# DATABASE_URI=postgresql://postgres:postgres@localhost:5432/cowtown_dev
# PAYLOAD_SECRET=your-32-character-secret-key-here
# NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

4. **Database Setup**

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run migrations
pnpm payload migrate

# Seed with tournament data (optional)
pnpm run seed:tournament
```

5. **Start Development Server**

```bash
# Start development server
pnpm dev

# Visit http://localhost:3000 to verify setup
```

### Project Structure Familiarity

Please review the project structure and key documentation:

- **[Architecture Documentation](./BACKEND_ARCHITECTURE.md)** - Backend system design
- **[Frontend Architecture](./FRONTEND_ARCHITECTURE.md)** - Frontend patterns and components
- **[API Reference](./API_REFERENCE.md)** - API endpoints and usage
- **[Testing Guide](./TESTING_GUIDE.md)** - Testing strategies and patterns

## Development Workflow

### Branching Strategy

We use a feature branch workflow based on the main branch:

```bash
# Always start from the latest main
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# OR for bug fixes
git checkout -b fix/issue-description

# OR for documentation
git checkout -b docs/documentation-topic
```

### Branch Naming Conventions

- **Features**: `feature/tournament-scoring-improvements`
- **Bug Fixes**: `fix/sse-connection-memory-leak`
- **Documentation**: `docs/api-endpoint-examples`
- **Refactoring**: `refactor/component-organization`
- **Performance**: `perf/database-query-optimization`

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Format: type(scope): description
# Examples:

feat(scoring): add penalty shot support to goal recording
fix(sse): resolve memory leak in connection cleanup
docs(api): update authentication examples
test(components): add GameCard component tests
refactor(database): optimize standings calculation query
perf(frontend): implement lazy loading for standings table
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `chore`: Maintenance tasks

### Development Process

1. **Create and Switch to Feature Branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes Following Code Standards**

See [Code Standards](#code-standards) section below.

3. **Test Your Changes**

```bash
# Run all tests
pnpm test

# Run linting
pnpm lint:fix

# Run type checking
pnpm type-check

# Test build
pnpm build
```

4. **Commit Changes**

```bash
# Stage changes
git add .

# Commit with conventional message
git commit -m "feat(tournament): add three stars selection dialog"
```

5. **Keep Branch Updated**

```bash
# Regularly sync with upstream
git fetch upstream
git rebase upstream/main
```

6. **Push and Create Pull Request**

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Code Standards

### TypeScript Guidelines

1. **Strong Typing**

```typescript
// ✅ Use specific types
interface GameScoreProps {
  homeScore: number
  awayScore: number
  gameStatus: 'scheduled' | 'live' | 'final'
}

// ❌ Avoid any types
function updateScore(data: any) {
  // Don't do this
}

// ✅ Use proper typing
function updateScore(data: GameScoreUpdate) {
  // Much better
}
```

2. **Component Props Interface**

```typescript
// ✅ Define props interface
interface GameCardProps {
  game: Game
  showTournamentPoints?: boolean
  showThreeStars?: boolean
  compact?: boolean
  onGameSelect?: (gameId: string) => void
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  showTournamentPoints = false,
  showThreeStars = false,
  compact = false,
  onGameSelect,
}) => {
  // Component implementation
}
```

3. **Utility Functions**

```typescript
// ✅ Pure functions with proper typing
export function calculateTournamentPoints(game: Game): TournamentPoints {
  const points = { home: 0, away: 0 }
  
  // Implementation...
  
  return points
}

// ✅ Error handling
export async function fetchGameData(gameId: string): Promise<Game> {
  try {
    const response = await fetch(`/api/games/${gameId}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch game: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Game fetch error:', error)
    throw error
  }
}
```

### React Component Guidelines

1. **Functional Components**

```typescript
// ✅ Use functional components with hooks
export const ScoringInterface: React.FC<ScoringInterfaceProps> = ({
  game,
  currentUser,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleGoal = useCallback(async (goalData: GoalData) => {
    // Implementation
  }, [game.id])
  
  return (
    <div className="scoring-interface">
      {/* Component JSX */}
    </div>
  )
}
```

2. **Custom Hooks**

```typescript
// ✅ Create reusable hooks
export function useGameState(initialGame: Game) {
  const [game, setGame] = useState(initialGame)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const updateGame = useCallback((updates: Partial<Game>) => {
    setGame(prev => ({ ...prev, ...updates }))
  }, [])
  
  const submitStat = useCallback(async (stat: StatSubmission) => {
    // Implementation with optimistic updates
  }, [game.id])
  
  return {
    game,
    isLoading,
    error,
    updateGame,
    submitStat,
  }
}
```

3. **Error Boundaries**

```typescript
// ✅ Implement error boundaries for critical components
export class ScorekeeperErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  { hasError: boolean; error?: Error }
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Scorekeeper interface error:', error, errorInfo)
    // Report to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Scoring Interface Error</h2>
          <p>Please refresh the page or contact support.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### CSS/Styling Guidelines

1. **Tailwind CSS Classes**

```typescript
// ✅ Use utility classes with logical grouping
<div className={cn(
  // Layout
  'flex items-center justify-between',
  // Spacing
  'p-4 mb-6',
  // Appearance
  'bg-white border border-gray-200 rounded-lg shadow-sm',
  // Responsive
  'sm:p-6 md:mb-8',
  // State variants
  {
    'ring-2 ring-blue-500': isActive,
    'opacity-50': isDisabled,
  }
)}>
```

2. **Component Variants**

```typescript
// ✅ Use class-variance-authority for component variants
import { cva, type VariantProps } from 'class-variance-authority'

const gameCardVariants = cva(
  'rounded-lg border transition-all duration-200',
  {
    variants: {
      status: {
        scheduled: 'border-gray-200 bg-white',
        live: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20',
        final: 'border-green-200 bg-green-50',
      },
      size: {
        compact: 'p-3',
        default: 'p-4',
        expanded: 'p-6',
      },
    },
    defaultVariants: {
      status: 'scheduled',
      size: 'default',
    },
  }
)

interface GameCardProps extends VariantProps<typeof gameCardVariants> {
  game: Game
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  status,
  size,
  ...props
}) => {
  return (
    <div 
      className={gameCardVariants({ status, size })}
      {...props}
    >
      {/* Card content */}
    </div>
  )
}
```

### API Development Guidelines

1. **Route Handlers**

```typescript
// ✅ Proper API route structure
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Input validation
    const body = await request.json()
    const validatedData = goalSchema.parse(body)
    
    // Authentication check
    const user = await authenticateRequest(request)
    if (!user || !user.roles?.includes('scorekeeper')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // Business logic
    const result = await recordGoal(params.id, validatedData)
    
    // Response
    return NextResponse.json({
      success: true,
      data: result,
    })
    
  } catch (error) {
    console.error('Goal recording error:', error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

2. **Input Validation**

```typescript
// ✅ Use Zod for validation
import { z } from 'zod'

const goalSchema = z.object({
  scorerId: z.string().uuid(),
  assistId: z.string().uuid().optional(),
  secondaryAssistId: z.string().uuid().optional(),
  goalType: z.enum(['even_strength', 'power_play', 'short_handed', 'penalty_shot', 'empty_net']),
  team: z.enum(['home', 'away']),
  period: z.union([z.number().min(1).max(3), z.literal('OT1'), z.literal('OT2')]),
  periodTime: z.number().min(0).max(900),
  description: z.string().optional(),
})

type GoalData = z.infer<typeof goalSchema>
```

## Testing Requirements

### Test Coverage Requirements

All new code must include appropriate tests:

- **Unit Tests**: Functions, utilities, hooks
- **Component Tests**: React components
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical user workflows

### Writing Tests

1. **Component Tests**

```typescript
// tests/components/GameCard.test.tsx
import { render, screen } from '@testing-library/react'
import { GameCard } from '@/components/tournament/GameCard'
import { mockGame } from '@/tests/fixtures'

describe('GameCard', () => {
  it('displays game information correctly', () => {
    render(<GameCard game={mockGame} />)
    
    expect(screen.getByText('Game 1')).toBeInTheDocument()
    expect(screen.getByText('Calgary Bears')).toBeInTheDocument()
    expect(screen.getByText('Edmonton Storm')).toBeInTheDocument()
  })
  
  it('shows live indicator for live games', () => {
    const liveGame = { ...mockGame, status: 'live' }
    render(<GameCard game={liveGame} />)
    
    expect(screen.getByText('LIVE')).toBeInTheDocument()
    expect(screen.getByTestId('live-indicator')).toHaveClass('animate-pulse')
  })
})
```

2. **API Tests**

```typescript
// tests/api/games.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/games/[id]/goal/route'

describe('/api/games/[id]/goal', () => {
  it('records a goal successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/games/game123/goal',
      headers: {
        'Authorization': `Bearer ${validToken}`,
        'Content-Type': 'application/json',
      },
      body: {
        scorerId: 'player123',
        team: 'home',
        period: 2,
        periodTime: 480,
        goalType: 'even_strength',
      },
    })
    
    const response = await handler(req, res)
    const data = JSON.parse(response.body)
    
    expect(response.statusCode).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.goal).toBeDefined()
  })
})
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test types
pnpm test:unit
pnpm test:int
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Submission Guidelines

### Pull Request Process

1. **Pre-submission Checklist**

```bash
# ✅ Run all checks before submitting
pnpm lint:fix
pnpm type-check
pnpm test
pnpm build

# ✅ Update documentation if needed
# Update relevant .md files in /docs
# Add JSDoc comments for new functions
# Update API documentation for new endpoints
```

2. **Pull Request Template**

Use this template for your pull request description:

```markdown
## Description
Brief description of the changes and their purpose.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Tournament Impact
- [ ] No impact on tournament operations
- [ ] Minor impact (cosmetic changes, non-critical features)
- [ ] Major impact (scoring system, real-time updates, critical features)

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's code style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

3. **Review Process**

- All pull requests require at least one approval
- Automated checks must pass (CI/CD pipeline)
- Tournament-critical changes require additional review
- Breaking changes require discussion and approval

### Code Review Guidelines

When reviewing code:

1. **Functionality**: Does the code work as intended?
2. **Performance**: Will this impact tournament operations?
3. **Security**: Are there any security vulnerabilities?
4. **Maintainability**: Is the code readable and well-structured?
5. **Testing**: Is there adequate test coverage?
6. **Documentation**: Are changes properly documented?

## Issue Reporting

### Bug Reports

Use the following template for bug reports:

```markdown
## Bug Description
A clear and concise description of what the bug is.

## Tournament Impact
- [ ] Critical (tournament operations affected)
- [ ] High (important features not working)
- [ ] Medium (minor features affected)
- [ ] Low (cosmetic issues)

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
A clear description of what actually happened.

## Environment
- Browser: [e.g. Chrome 91, Safari 14]
- Device: [e.g. Desktop, iPhone 12, iPad]
- OS: [e.g. macOS Big Sur, Windows 10]
- Node.js version: [e.g. 18.20.2]

## Screenshots
If applicable, add screenshots to help explain your problem.

## Additional Context
Add any other context about the problem here.
```

### Feature Requests

```markdown
## Feature Description
A clear and concise description of the feature you'd like to see.

## Problem Statement
Describe the problem this feature would solve.

## Proposed Solution
Describe the solution you'd like to see implemented.

## Tournament Use Case
How would this feature benefit tournament operations?

## Alternative Solutions
Describe any alternative solutions you've considered.

## Additional Context
Add any other context or screenshots about the feature request.
```

### Performance Issues

```markdown
## Performance Issue Description
Describe what is performing slowly or inefficiently.

## Impact on Tournament Operations
How does this affect the tournament experience?

## Performance Metrics
- Page load time: [e.g. 5 seconds]
- API response time: [e.g. 2 seconds]
- Memory usage: [e.g. 500MB]

## Steps to Reproduce
1. Go to '...'
2. Perform action '...'
3. Observe slow performance

## Environment
- Concurrent users: [e.g. 200]
- Network conditions: [e.g. WiFi, 4G]
- Device specifications: [e.g. iPhone 12, MacBook Pro]

## Additional Context
Any other relevant information.
```

## Documentation

### Documentation Standards

1. **Code Documentation**

```typescript
/**
 * Calculates tournament points using the 5-point system.
 * 
 * @description The 5-point system awards:
 * - 2 points for game win, 1 for tie, 0 for loss
 * - 1 point per period win, 0.5 per period tie, 0 per period loss
 * - Maximum 5 points per game possible
 * 
 * @param game - The completed game with goals and final scores
 * @returns Tournament points for home and away teams
 * 
 * @example
 * ```typescript
 * const points = calculateTournamentPoints({
 *   homeScore: 8,
 *   awayScore: 5,
 *   goals: [...] // Period-by-period goals
 * })
 * // Returns: { home: 4.5, away: 0.5 }
 * ```
 */
export function calculateTournamentPoints(game: Game): TournamentPoints {
  // Implementation...
}
```

2. **API Documentation**

When adding new API endpoints, update the API documentation:

```typescript
/**
 * @api {post} /api/games/:id/goal Record Goal
 * @apiName RecordGoal
 * @apiGroup Games
 * @apiVersion 1.0.0
 * 
 * @apiDescription Records a goal in a tournament game and updates the score.
 * 
 * @apiParam {String} id Game ID
 * 
 * @apiBody {String} scorerId Player ID who scored
 * @apiBody {String} [assistId] Player ID for primary assist
 * @apiBody {String} [secondaryAssistId] Player ID for secondary assist
 * @apiBody {String="even_strength","power_play","short_handed","penalty_shot","empty_net"} goalType Type of goal
 * @apiBody {String="home","away"} team Scoring team
 * @apiBody {Number|String} period Period number (1-3) or "OT1", "OT2"
 * @apiBody {Number} periodTime Time remaining in period (seconds)
 * @apiBody {String} [description] Optional goal description
 * 
 * @apiSuccess {Boolean} success Operation success status
 * @apiSuccess {Object} goal Created goal object
 * @apiSuccess {Object} game Updated game object with new score
 * 
 * @apiError {Object} error Error information
 * @apiError {String} error.message Error description
 * 
 * @apiExample {curl} Example usage:
 * curl -X POST http://localhost:3000/api/games/game123/goal \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_TOKEN" \
 *   -d '{
 *     "scorerId": "player123",
 *     "assistId": "player456",
 *     "goalType": "power_play",
 *     "team": "home",
 *     "period": 2,
 *     "periodTime": 480
 *   }'
 */
```

3. **Component Documentation**

Update Storybook stories for new components:

```typescript
// GameCard.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import { GameCard } from './GameCard'

const meta: Meta<typeof GameCard> = {
  title: 'Tournament/GameCard',
  component: GameCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays game information with real-time updates for tournament scoreboards.',
      },
    },
  },
  argTypes: {
    game: {
      description: 'Game object with teams, scores, and status',
    },
    showTournamentPoints: {
      description: 'Whether to display tournament points earned',
      control: 'boolean',
    },
    showThreeStars: {
      description: 'Whether to display three stars selection',
      control: 'boolean',
    },
    compact: {
      description: 'Compact display mode for mobile',
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof GameCard>

export const Default: Story = {
  args: {
    game: mockGame,
  },
}

export const LiveGame: Story = {
  args: {
    game: {
      ...mockGame,
      status: 'live',
      currentPeriod: 2,
      periodTimeRemaining: 420,
    },
  },
}

export const CompactMode: Story = {
  args: {
    game: mockGame,
    compact: true,
  },
}
```

## Release Process

### Version Management

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Breaking changes
- **MINOR** version: New features (backward compatible)
- **PATCH** version: Bug fixes (backward compatible)

### Release Preparation

1. **Update Version**

```bash
# Update package.json version
npm version patch  # or minor, major

# Update CHANGELOG.md
# Document all changes since last release
```

2. **Release Notes Template**

```markdown
# Release v1.2.3

## 🚀 New Features
- Add three stars selection dialog for post-game recognition
- Implement penalty shot goal type support
- Add mobile-optimized scorekeeper interface

## 🐛 Bug Fixes
- Fix SSE connection memory leak during extended tournament operation
- Resolve tournament points calculation edge case for tied periods
- Fix responsive layout issues on iPad devices

## 🔧 Improvements
- Optimize database queries for standings calculation
- Improve error handling in real-time connection management
- Enhance loading states for better user experience

## 📚 Documentation
- Update API documentation with new endpoints
- Add troubleshooting guide for common deployment issues
- Improve contributing guidelines with code examples

## ⚠️ Breaking Changes
None in this release.

## 🏆 Tournament Impact
This release improves reliability and user experience during tournament operations. All changes are backward compatible and safe for deployment during events.

## 🚀 Deployment
No special deployment steps required. Standard deployment process applies.
```

3. **Pre-release Testing**

```bash
# Run full test suite
pnpm test

# Build and test production build
pnpm build
pnpm start

# Test deployment process
./scripts/deploy.sh --dry-run
```

### Deployment Schedule

- **Development**: Continuous deployment to staging
- **Staging**: Weekly releases for testing
- **Production**: Releases scheduled around tournament events
- **Hotfixes**: Emergency releases for critical issues

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment:

1. **Be Respectful**: Treat all contributors with respect and courtesy
2. **Be Collaborative**: Work together to improve the tournament experience
3. **Be Constructive**: Provide helpful feedback and suggestions
4. **Be Patient**: Remember that everyone has different experience levels

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests, discussions
- **Pull Requests**: Code review and collaboration
- **Documentation**: Project knowledge sharing

### Recognition

Contributors are recognized in:

- **CONTRIBUTORS.md**: List of all contributors
- **Release Notes**: Acknowledgment of significant contributions
- **Documentation**: Credit for major documentation improvements

### Getting Help

If you need help:

1. **Check Documentation**: Review existing docs in `/docs` folder
2. **Search Issues**: Look for similar problems or questions
3. **Create Issue**: Open a new issue with detailed information
4. **Ask Questions**: Use GitHub Discussions for general questions

### Tournament Season Considerations

During tournament season (typically summer months):

- **Critical Bug Fixes**: Expedited review and deployment
- **New Features**: Thorough testing required before tournament events
- **Breaking Changes**: Avoided during active tournament periods
- **Documentation**: Tournament-day emergency procedures maintained

---

Thank you for contributing to the Cowtown Showdown tournament website! Your efforts help make lacrosse tournaments more exciting and well-organized for players, teams, and fans.