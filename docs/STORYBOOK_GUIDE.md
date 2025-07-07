# Storybook Development Guide

This guide covers how to use Storybook effectively for component development and testing in the Cowtown Showdown tournament website project.

## Overview

Storybook is set up to provide comprehensive component documentation, testing environments, and development workflows for all UI components, tournament features, and content blocks.

## Getting Started

### Starting Storybook

```bash
# Start Storybook development server
pnpm storybook

# Storybook will be available at http://localhost:6006
```

### Building Storybook

```bash
# Build static Storybook for deployment
pnpm build-storybook

# Output will be in storybook-static/ directory
```

## Story Organization

Stories are organized into logical categories that mirror the project structure:

### UI Components (`src/components/ui/`)
- **Button**: All button variants, sizes, and states
- **Card**: Card layouts and compositions
- **Badge**: Status indicators and labels
- **Dialog**: Modal dialogs and confirmations

### Tournament Components (`src/components/tournament/`)
- **GameCard**: Individual game displays
- **Scoreboard**: Live tournament scoreboard
- **StandingsTable**: Tournament standings with 5-point system

### Scorekeeper Components (`src/components/scorekeeper/`)
- **ScoreBoard**: Live game scoring interface
- **Timer**: Period timer with controls
- **StatButtons**: Statistics entry interface

### Content Blocks (`src/blocks/`)
- **Banner**: Alert and announcement banners
- **CallToAction**: Conversion-focused content blocks
- **MediaBlock**: Image and video content

## Story Conventions

### Naming Convention
Stories follow a consistent naming pattern:
- **Default**: Basic component with default props
- **Variants**: Named variations (e.g., "Live Game", "Final Score")
- **States**: Different component states (e.g., "Loading", "Error")
- **Responsive**: Device-specific views (e.g., "Mobile", "Tablet")
- **Context**: Integration examples (e.g., "Tournament Homepage")

### Required Stories
Every component should have at least:
1. **Default**: Basic usage example
2. **Variants**: All major prop combinations
3. **Edge Cases**: Error states, empty data, loading
4. **Mobile**: Mobile-responsive view
5. **Accessibility**: High contrast, large text examples

## Mock Data

Mock data is centralized in `/src/stories/fixtures/index.ts`:

```typescript
import { mockTeams, mockGames, mockPlayers } from '@/stories/fixtures'

// Use in stories
export const LiveGame: Story = {
  args: {
    game: mockGames[0],
    teams: mockTeams,
  },
}
```

### Available Mock Data
- `mockTeams`: 8 tournament teams with realistic data
- `mockGames`: Various game states and scenarios
- `mockPlayers`: Player rosters for all teams
- Tournament-specific scenarios (championships, overtimes, etc.)

## Documentation Standards

### Component Documentation
Each story file includes comprehensive documentation:

```typescript
const meta: Meta<typeof Component> = {
  title: 'Category/ComponentName',
  component: Component,
  parameters: {
    docs: {
      description: {
        component: `
Detailed component description including:
- Primary purpose and use cases
- Key features and capabilities
- Tournament-specific context
- Integration guidelines
        `,
      },
    },
  },
  // ... argTypes and other config
}
```

### Story Descriptions
Important stories include contextual descriptions:

```typescript
export const TournamentScenario: Story = {
  name: 'Championship Game',
  args: { /* props */ },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates component behavior during championship games with overtime scenarios.',
      },
    },
  },
}
```

## Development Workflow

### Component Development
1. **Create Component**: Build the React component
2. **Add Stories**: Create comprehensive story file
3. **Test Scenarios**: Verify all use cases work
4. **Document**: Add proper documentation
5. **Review**: Ensure consistency with existing patterns

### Testing with Storybook
- **Visual Testing**: Check component appearance across stories
- **Interaction Testing**: Test user interactions
- **Responsive Testing**: Verify mobile/tablet layouts
- **Accessibility Testing**: Check contrast, focus, keyboard navigation

### Story-Driven Development (SDD)
1. **Write Stories First**: Define component API through stories
2. **Implement Component**: Build to satisfy story requirements
3. **Iterate**: Refine based on story feedback
4. **Document**: Complete documentation for handoff

## Tournament-Specific Features

### Live Game Simulation
Many stories simulate live tournament scenarios:

```typescript
export const LiveUpdates: Story = {
  name: 'Live Score Updates',
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm font-medium text-yellow-800">
            ⚡ This component updates in real-time during live games
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}
```

### Tournament Context
Stories often include tournament context decorators:

```typescript
decorators: [
  (Story) => (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-primary-brown">
          Scorekeeper Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Game 5 • Day 2 • Pool Play
        </p>
      </div>
      <Story />
    </div>
  ),
],
```

## Responsive Design Testing

### Viewport Configuration
Responsive stories use predefined viewports:

```typescript
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1', // 375px
    },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet', // 768px
    },
  },
}
```

### Available Viewports
- `mobile1`: 375px (iPhone SE)
- `mobile2`: 414px (iPhone Plus)
- `tablet`: 768px (iPad)
- `desktop`: 1024px (Standard desktop)

## Accessibility Testing

### High Contrast Mode
```typescript
export const HighContrast: Story = {
  decorators: [
    (Story) => (
      <div style={{ filter: 'contrast(1.5)' }}>
        <Story />
      </div>
    ),
  ],
}
```

### Large Text Support
```typescript
export const LargeText: Story = {
  decorators: [
    (Story) => (
      <div style={{ fontSize: '1.25em' }}>
        <Story />
      </div>
    ),
  ],
}
```

### Focus Testing
Test keyboard navigation and focus management in interactive stories.

## Performance Considerations

### Large Datasets
When testing with large datasets:

```typescript
export const LoadTesting: Story = {
  args: {
    teams: Array.from({ length: 100 }, (_, i) => createMockTeam(i)),
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests component performance with large datasets (100+ items).',
      },
    },
  },
}
```

### Real-time Updates
Simulate high-frequency updates for live scoring components:

```typescript
export const RapidUpdates: Story = {
  name: 'High Frequency Updates',
  // Component that updates every second
}
```

## Integration Testing

### Full Page Context
Test components within realistic page layouts:

```typescript
export const TournamentHomepage: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50">
        <header>/* Tournament header */</header>
        <main>
          <Story />
        </main>
        <footer>/* Tournament footer */</footer>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}
```

## Error State Testing

### Network Errors
```typescript
export const ConnectionError: Story = {
  decorators: [
    (Story) => (
      <div>
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-sm font-medium text-red-800">
            Connection Error: Unable to load data
          </p>
        </div>
        <div style={{ opacity: 0.7, pointerEvents: 'none' }}>
          <Story />
        </div>
      </div>
    ),
  ],
}
```

### Loading States
```typescript
export const LoadingState: Story = {
  render: () => (
    <div className="animate-pulse">
      {/* Loading skeleton */}
    </div>
  ),
}
```

## Best Practices

### Story Organization
- **Group Related Stories**: Use story groups for variants
- **Logical Progression**: Order from simple to complex
- **Clear Naming**: Use descriptive, searchable names
- **Consistent Structure**: Follow established patterns

### Documentation
- **Component Purpose**: Clear description of what it does
- **Tournament Context**: How it fits in the tournament workflow
- **Usage Guidelines**: When and how to use
- **Technical Notes**: Important implementation details

### Testing Coverage
- **All Props**: Test every prop combination
- **Edge Cases**: Empty states, errors, loading
- **User Interactions**: Click, hover, keyboard navigation
- **Responsive Behavior**: Mobile, tablet, desktop
- **Accessibility**: Screen readers, high contrast, keyboard-only

### Performance
- **Realistic Data**: Use tournament-sized datasets
- **Memory Usage**: Monitor for memory leaks in long-running stories
- **Render Performance**: Test with many components on screen

## Deployment

### Static Build
Storybook can be built as a static site for deployment:

```bash
pnpm build-storybook
```

Deploy the `storybook-static/` directory to any static hosting service.

### Integration with CI/CD
Consider integrating Storybook builds into your deployment pipeline for:
- Visual regression testing
- Component documentation hosting
- Design system validation
- Automated accessibility testing

## Troubleshooting

### Common Issues

**Missing Mock Data**
- Check that mock data is properly imported
- Verify mock data structure matches component props

**Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check for missing CSS imports
- Verify component classes are applied correctly

**TypeScript Errors**
- Run `pnpm payload generate:types` to update Payload types
- Check story prop types match component interfaces
- Verify mock data matches expected types

**Performance Issues**
- Limit large dataset stories
- Use React.memo for expensive components
- Optimize mock data generation

### Getting Help
- Check existing stories for patterns
- Refer to Storybook documentation
- Ask team members for component-specific guidance
- Review tournament requirements in `/specs/` directory

## Conclusion

Storybook serves as the development environment, testing platform, and documentation system for all UI components in the Cowtown Showdown project. By following these guidelines, you can ensure consistent, well-tested, and well-documented components that meet tournament requirements and provide excellent user experience.