# Claude Code Agent Prompt: Cowtown Showdown Header Implementation

## Task Overview
Create a comprehensive header component with mega navigation for the Cowtown Showdown lacrosse tournament website using Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Design Requirements

### Color Palette
```css
--primary-brown: #934F25;
--dark-brown: #5E2713;
--golden: #D6AC4D;
--live-indicator: #00FF00;
--background: #FAFAFA;
--foreground: #0C0A09;
```

### Typography
- Display Font: Tiffany Gothic CC (for logo only)
- Body/UI: Geist Sans
- Icons: Phosphorus Icons

## Header Component Structure

### 1. Main Header Container
Create a sticky header with the following specifications:
- **Desktop Height**: 80px
- **Mobile Height**: 64px
- **Background**: White with shadow on scroll
- **Position**: Fixed/sticky top
- **Z-index**: 50

### 2. Desktop Layout (≥1024px)
Three-section horizontal layout:

#### Left Section (Logo)
- Tournament wordmark "COWTOWN SHOWDOWN" in Tiffany Gothic CC
- Width: 180px
- Link to homepage
- Golden color (#D6AC4D) on hover

#### Center Section (Navigation)
Primary navigation items with mega menu dropdowns:
1. **Tournament**
2. **Teams**
3. **Games**
4. **Stats**
5. **Media**

#### Right Section (Actions)
- Live games indicator (pulsing red dot when games active)
- Search button (Phosphorus MagnifyingGlass icon)
- User account menu (Phosphorus User icon)

### 3. Mobile Layout (<1024px)
- Hamburger menu (left)
- Condensed logo (center)
- Live indicator + search (right)

## Mega Menu Implementation

### Use the Existing NavigationDropdown Pattern
Extend the provided NavigationDropdown component with these features:

### Tournament Dropdown (3 columns)
```typescript
const tournamentMenu = {
  columns: [
    {
      title: "Quick Access",
      items: [
        { label: "Tournament Overview", icon: "Trophy", href: "/tournament" },
        { label: "Today's Schedule", icon: "Calendar", badge: "6 games", href: "/tournament/schedule" },
        { label: "Live Games", icon: "Activity", isLive: true, href: "/games/live" },
        { label: "Current Standings", icon: "ChartBar", href: "/tournament/standings" },
        { label: "Tournament Rules", icon: "FileText", isPDF: true, href: "/rules.pdf" }
      ]
    },
    {
      title: "Information",
      items: [
        { label: "5-Point System Explained", icon: "Info", href: "/tournament/rules#scoring" },
        { label: "Venue Information", icon: "MapPin", href: "/tournament/venue" },
        { label: "Schedule Download", icon: "Download", isPDF: true, href: "/schedule.pdf" },
        { label: "Contact Information", icon: "Phone", href: "/contact" }
      ]
    },
    {
      title: "Featured",
      content: "LiveGameCard" // Component to show featured live game
    }
  ]
}
```

### Teams Dropdown (3 columns)
```typescript
const teamsMenu = {
  columns: [
    {
      title: "All Teams",
      content: "TeamLogoGrid" // 2x4 grid of team logos
    },
    {
      title: "Quick Stats",
      content: "TeamStandingsPreview" // Top 4 teams with stats
    },
    {
      title: "Team Tools",
      items: [
        { label: "Compare Teams", icon: "GitCompare", href: "/teams/compare" },
        { label: "Roster Search", icon: "Search", href: "/teams/search" },
        { label: "Team Statistics", icon: "ChartBar", href: "/teams/stats" },
        { label: "Head-to-Head", icon: "Users", href: "/teams/head-to-head" }
      ]
    }
  ]
}
```

### Games Dropdown (3 columns)
```typescript
const gamesMenu = {
  columns: [
    {
      title: "Live Games",
      content: "LiveGamesList" // Shows active games or "No live games"
    },
    {
      title: "Schedule",
      items: [
        { label: "Today's Games", badge: "6", href: "/games/today" },
        { label: "Tomorrow's Games", badge: "4", href: "/games/tomorrow" },
        { label: "Full Schedule", icon: "Calendar", href: "/tournament/schedule" }
      ]
    },
    {
      title: "Results",
      content: "RecentResults" // Last 3 completed games
    }
  ]
}
```

### Stats Dropdown (3 columns)
```typescript
const statsMenu = {
  columns: [
    {
      title: "Leaders",
      content: "StatsLeaders" // Top 3 scorers, goalies, teams
    },
    {
      title: "Categories",
      items: [
        { label: "Player Statistics", icon: "User", href: "/stats/players" },
        { label: "Team Statistics", icon: "Users", href: "/stats/teams" },
        { label: "Goalie Statistics", icon: "Shield", href: "/stats/goalies" },
        { label: "Advanced Metrics", icon: "TrendingUp", href: "/stats/advanced" }
      ]
    },
    {
      title: "Records",
      items: [
        { label: "Tournament Records", icon: "Trophy", href: "/stats/records" },
        { label: "Individual Achievements", icon: "Medal", href: "/stats/achievements" },
        { label: "Team Milestones", icon: "Flag", href: "/stats/milestones" }
      ]
    }
  ]
}
```

### Media Dropdown (3 columns)
```typescript
const mediaMenu = {
  columns: [
    {
      title: "Latest",
      content: "MediaGrid" // Thumbnails of recent photos/videos
    },
    {
      title: "Highlights",
      items: [
        { label: "Game Highlights", icon: "Video", href: "/media/highlights" },
        { label: "Player Spotlights", icon: "Star", href: "/media/players" },
        { label: "Behind the Scenes", icon: "Camera", href: "/media/behind-scenes" }
      ]
    },
    {
      title: "Social",
      content: "SocialFeed" // Instagram/Twitter previews
    }
  ]
}
```

## Implementation Requirements

### 1. Create Header Component Structure
```typescript
// src/components/layout/Header.tsx
export function Header() {
  // Implement sticky header with scroll shadow
  // Desktop: 3-section layout
  // Mobile: Condensed with hamburger
}
```

### 2. Extend NavigationDropdown
- Add support for 3-column layouts
- Handle different content types (items, components, grids)
- Implement hover behavior for desktop
- Add mobile slide-out panel

### 3. Create Supporting Components
- `LiveGameIndicator`: Pulsing dot when games are live
- `TeamLogoGrid`: 2x4 grid of team logos for Teams dropdown
- `LiveGameCard`: Featured game display for Tournament dropdown
- `StatsLeaders`: Top performers display for Stats dropdown
- `MediaGrid`: Photo/video thumbnails for Media dropdown

### 4. Mobile Navigation Panel
- Full-height slide-out from right
- Accordion sections for each navigation item
- Touch-friendly with 44px minimum targets
- Close button and backdrop

### 5. Interactive Features
- Smooth hover transitions (200ms)
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Real-time update integration

### 6. Performance Optimizations
- Lazy load mega menu content
- Use React.memo for static sections
- Implement virtual scrolling for long lists
- Optimize images with next/image

## Accessibility Requirements
- Proper ARIA attributes for navigation
- Keyboard navigation (Tab, Arrow keys, Escape)
- Focus trapping in mobile menu
- Screen reader announcements
- High contrast mode support

## State Management
```typescript
interface HeaderState {
  isScrolled: boolean
  isMobileMenuOpen: boolean
  activeDropdown: string | null
  hasLiveGames: boolean
  unreadNotifications: number
}
```

## Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

## Testing Checklist
- [ ] Sticky header works on scroll
- [ ] Shadow appears when scrolled
- [ ] Mega menus open on hover (desktop)
- [ ] Mega menus open on click (mobile)
- [ ] Mobile menu slides smoothly
- [ ] All links are functional
- [ ] Live indicator pulses when games active
- [ ] Search opens modal/drawer
- [ ] User menu shows login/account options
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Performance is smooth

## Additional Notes
- Use Phosphorus Icons throughout (import from @phosphor-icons/react)
- Maintain western theme through color choices
- Ensure all interactive elements have hover/focus states
- Test on actual mobile devices for touch interactions
- Consider using Framer Motion for smooth animations

## Example Component Usage
```tsx
import { Header } from '@/components/layout/Header'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

Remember to follow the existing project patterns and maintain consistency with the Cowtown Showdown design system throughout the implementation.