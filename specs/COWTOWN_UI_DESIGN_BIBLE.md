# Cowtown Showdown UX/UI Design Bible

## Table of Contents

1. [Project Overview](#project-overview)
2. [Design System](#design-system)
   - [Color Palette](#color-palette)
   - [Typography](#typography)
   - [Spacing & Layout](#spacing--layout)
   - [Border Radius & Shadows](#border-radius--shadows)
   - [Animations](#animations)
3. [Component Library](#component-library)
   - [Atoms](#atoms)
   - [Molecules](#molecules)
   - [Organisms](#organisms)
   - [Templates](#templates)
4. [Screen Inventory](#screen-inventory)
   - [Public Tournament Website](#public-tournament-website)
   - [Scorekeeper Interface](#scorekeeper-interface)
5. [Design Patterns](#design-patterns)
6. [API & Data Reference](#api--data-reference)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [Implementation Notes](#implementation-notes)

---

## Project Overview

The Cowtown Showdown is a Senior Men's box lacrosse tournament website featuring real-time scoring, tournament management, and a distinctive Western/Calgary Stampede theme. The design system must support:

- **500-900 concurrent users** during peak tournament times
- **Mobile-first scorekeeper interface** optimized for tablets
- **Real-time updates** with live game scoring
- **Western Gothic aesthetic** with modern functionality
- **Accessibility standards** for all users

### Brand Identity

- **Theme**: Western/Calgary Stampede
- **Tone**: Competitive, exciting, traditional
- **Key Visual Elements**: Wood textures, rope patterns, western typography
- **Color Story**: Earth tones (browns) with golden accents

---

## Design System

### Color Palette

#### Primary Tournament Colors

```
Primary Brown: #934F25 (HSL: 28, 57%, 37%)
Dark Brown: #5E2713 (HSL: 26, 49%, 25%)
Golden: #D6AC4D (HSL: 46, 69%, 58%)
```

#### Game Status Colors

```
Power Play: #2196F3 (Blue)
Penalty Kill: #FF5722 (Orange)
Live Indicator: #00FF00 (Green)
Final Game: #999999 (Gray)
Overtime: #FFA500 (Orange)
```

#### UI Colors - Light Theme

```
Background: #FFFFFF
Foreground: #0C0A09
Card: #F5F5F4
Border: #CCCCCC
Input: #E7E5E4
Success: #86EFAC
Warning: #FDE68A
Error: #FCA5A5
```

#### UI Colors - Dark Theme

```
Background: #0C0A09
Foreground: #FAFAF9
Card: #1C1917
Border: #3F3F46
Input: #27272A
Success: #065F46
Warning: #78350F
Error: #7F1D1D
```

#### Gradient Overlays (Inspired by NLL)

```css
/* Hero Gradient */
--hero-gradient: linear-gradient(180deg, rgba(12, 10, 9, 0) 0%, rgba(12, 10, 9, 0.8) 100%);

/* Card Hover Gradient */
--card-hover-gradient: linear-gradient(
  135deg,
  rgba(147, 79, 37, 0.1) 0%,
  rgba(214, 172, 77, 0.1) 100%
);

/* Live Game Glow */
--live-glow: radial-gradient(ellipse at center, rgba(0, 255, 0, 0.2) 0%, transparent 70%);

/* Western Sunset */
--western-sunset: linear-gradient(135deg, #934f25 0%, #d6ac4d 50%, #5e2713 100%);

/* Glass Morphism */
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
```

#### Team-Specific Theming

```css
/* Dynamic team colors applied via CSS variables */
.team-theme {
  --team-primary: var(--team-color-primary);
  --team-secondary: var(--team-color-secondary);
  --team-gradient: linear-gradient(135deg, var(--team-primary) 0%, var(--team-secondary) 100%);
  --team-accent: color-mix(in srgb, var(--team-primary) 20%, var(--background));
}

/* Example: Calgary Bears */
.team-calgary-bears {
  --team-color-primary: #c41e3a;
  --team-color-secondary: #ffb81c;
}
```

#### Surface Textures

```css
/* Subtle Western Textures */
--texture-leather: url('/textures/leather-subtle.png');
--texture-wood: url('/textures/wood-grain.png');
--texture-paper: url('/textures/vintage-paper.png');

/* Applied with low opacity */
.textured-surface {
  background-image: var(--texture-wood);
  background-blend-mode: multiply;
  opacity: 0.03;
}
```

### Typography

#### Font Strategy

- **Display Font**: Tiffany Gothic CC - Used extremely sparingly for maximum impact
- **Primary Font**: Geist Sans - Used for ALL headings, body text, UI elements, and numbers
- **Icons**: Phosphorus Icons - Consistent icon library for all UI elements
- **Number Alignment**: Use `font-variant-numeric: tabular-nums` for consistent number widths

#### Typography Scale & Usage

##### Display Levels (Tiffany Gothic CC - Maximum 1-2 per page)

**Display Hero**

- Desktop: 56px / 64px line height / 400 weight
- Mobile: 48px / 56px line height / 400 weight
- Usage: Main "Cowtown Showdown" wordmark only

**Display Feature**

- Desktop: 40px / 48px line height / 400 weight
- Mobile: 36px / 44px line height / 400 weight
- Usage: Championship game announcements, special banners

##### Heading Levels (Geist Sans)

**H1 - Page Title**

- Desktop: 40px / 48px line height / 700 weight
- Mobile: 32px / 40px line height / 700 weight
- Usage: Main page titles, hero sections

**H2 - Section Title**

- Desktop: 32px / 40px line height / 600 weight
- Mobile: 24px / 32px line height / 600 weight
- Usage: Major section headers

**H3 - Subsection Title**

- Desktop: 24px / 32px line height / 600 weight
- Mobile: 20px / 28px line height / 600 weight
- Usage: Card titles, subsections

**H4 - Component Title**

- Desktop: 20px / 28px line height / 600 weight
- Mobile: 18px / 24px line height / 600 weight
- Usage: Smaller component headers

**H5 - Small Title**

- Desktop: 18px / 24px line height / 600 weight
- Mobile: 16px / 20px line height / 600 weight
- Usage: List headers, small sections

**H6 - Micro Title**

- Desktop: 16px / 20px line height / 600 weight
- Mobile: 14px / 18px line height / 600 weight
- Usage: Table headers, small labels

##### Body Text (Geist Sans)

**Body Large**

- Size: 18px / 28px line height / 400 weight
- Usage: Lead paragraphs, important body text

**Body Base**

- Size: 16px / 26px line height / 400 weight
- Usage: Standard body text, descriptions

**Body Small**

- Size: 14px / 21px line height / 400 weight
- Usage: Secondary text, captions

**Body XSmall**

- Size: 12px / 18px line height / 400 weight
- Usage: Disclaimers, timestamps

##### UI Text (Geist Sans)

**Button Text**

- Large: 16px / 20px line height / 500 weight
- Medium: 14px / 18px line height / 500 weight
- Small: 12px / 16px line height / 500 weight

**Label Text**

- Size: 14px / 18px line height / 500 weight
- Usage: Form labels, input labels

**Navigation**

- Desktop: 16px / 20px line height / 500 weight
- Mobile: 14px / 18px line height / 500 weight

**Badge/Tag**

- Size: 12px / 16px line height / 600 weight
- Usage: Status badges, tags

##### Data & Statistics (Geist Sans + Tabular Nums)

**Score Display**

- Size: 48px / 56px line height / 700 weight
- CSS: `font-variant-numeric: tabular-nums`
- Usage: Live game scores

**Timer Display**

- Size: 32px / 40px line height / 600 weight
- CSS: `font-variant-numeric: tabular-nums`
- Usage: Period timers

**Stat Numbers**

- Large: 24px / 32px line height / 600 weight
- Medium: 18px / 24px line height / 500 weight
- Small: 14px / 18px line height / 400 weight
- CSS: `font-variant-numeric: tabular-nums`

##### Live Game Typography (Inspired by NLL/OJLL)

**Live Indicator Text**

- Size: 12px / 16px line height / 600 weight
- Text Transform: UPPERCASE
- Letter Spacing: 0.05em
- Color: #00FF00 with pulsing animation
- Usage: "LIVE" badge on active games

**Countdown Timer**

- Size: 20px / 24px line height / 600 weight
- CSS: `font-variant-numeric: tabular-nums; font-feature-settings: "tnum"`
- Color: Inherit with red when < 2:00
- Usage: Shot clock, penalty timers

**Stat Comparison**

- Winner: 16px / 20px / 700 weight
- Loser: 16px / 20px / 400 weight
- CSS: `font-variant-numeric: tabular-nums`
- Usage: Head-to-head stat displays

**Ticker Text**

- Size: 14px / 18px line height / 500 weight
- Animation: Horizontal scroll for overflow
- Usage: Live game updates ticker

#### Visual Hierarchy Examples

##### Homepage Hero

```
[Tiffany Gothic CC] COWTOWN SHOWDOWN - 56px Display Hero
[Geist Sans] Senior Men's Box Lacrosse Tournament - H2 (32px)
[Geist Sans] July 12-14, 2024 • Calgary, Alberta - Body Base (16px)
```

##### Game Card

```
[Geist Sans] Game 7 - Pool Play - Label (14px)
[Geist Sans] Calgary Bears - H4 (20px)
[Geist Sans] 8 - 5 - Score Display (48px) + tabular-nums
[Geist Sans] Okotoks Raiders - H4 (20px)
[Geist Sans] Final - 3rd Period - Body Small (14px)
```

##### Standings Table

```
[Geist Sans] Tournament Standings - H2 (32px)
[Geist Sans] Team Names - Body Base (16px)
[Geist Sans] Numbers - Body Base (16px) + tabular-nums
[Geist Sans] Headers - H6 (16px/600 weight)
```

#### Design Principles

1. **Restraint with Display Font**
   - Never use Tiffany Gothic CC for body text or UI components
   - Maximum 2 instances per page
   - Only for major branding moments

2. **Consistent Hierarchy**
   - Clear size and weight differences between levels
   - Single primary font (Geist Sans) for readability
   - Mobile scales maintain hierarchy

3. **Functional Typography**
   - UI text sized for touch targets (min 14px)
   - Tabular nums for data alignment
   - High contrast ratios for accessibility

4. **Western Theme Expression**
   - Theme comes through selective display font use
   - Color and imagery carry western aesthetic
   - Typography remains functional first

#### Implementation Notes

**CSS for Number Alignment:**

```css
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

**Font Loading:**

```css
/* Tiffany Gothic CC - Custom font import */
@font-face {
  font-family: 'Tiffany Gothic CC';
  src:
    url('/fonts/TiffanyGothicCC.woff2') format('woff2'),
    url('/fonts/TiffanyGothicCC.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* Geist Sans - Vercel font */
@import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&display=swap');
```

**Usage Guidelines:**

- Tiffany Gothic CC: Tournament wordmark, championship banners only
- Geist Sans: Everything else (headings, body, UI, numbers)
- Phosphorus Icons: All UI icons and interactive elements
- Tabular nums: All numerical data (scores, stats, timers)

### Spacing & Layout

#### Container System

```
Container Max Widths:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1376px

Container Padding:
- Mobile: 16px
- Tablet: 32px
- Desktop: 32px
```

#### Spacing Scale (8px base)

```
0: 0px
1: 8px
2: 16px
3: 24px
4: 32px
5: 40px
6: 48px
8: 64px
10: 80px
12: 96px
16: 128px
```

#### Grid System

- 12-column grid on desktop
- 6-column grid on tablet
- 4-column grid on mobile
- Gap: 16px (mobile) / 24px (tablet) / 32px (desktop)

### Border Radius & Shadows

#### Border Radius

```
None: 0px
Sm: 2px
Base: 4px (--radius: 0.2rem)
Md: 6px
Lg: 8px
Full: 9999px
```

#### Shadows

```
Shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Shadow-md: 0 4px 6px rgba(0,0,0,0.1)
Shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
Shadow-xl: 0 20px 25px rgba(0,0,0,0.1)
```

### Animations

#### Transition Timing

```
Fast: 150ms ease-in-out
Base: 200ms ease-in-out
Slow: 300ms ease-in-out
```

#### Key Animations

1. **Live Pulse**: 2s infinite opacity animation
2. **Accordion**: 200ms ease-out expand/collapse
3. **Hover States**: 150ms color/background transitions
4. **Loading Spinner**: 600ms rotation

---

## Component Library

### Atoms

#### Button

**Variants**: default, destructive, ghost, link, outline, secondary
**Sizes**: sm (36px), default (40px), lg (44px), icon (40x40px)
**States**: normal, hover, active, disabled, loading
**Animations**: 150ms scale 0.95 on press, ripple effect on click

#### Input

**Types**: text, email, number, password, search
**States**: normal, focus, error, disabled
**Height**: 40px (touch-friendly)
**Features**: Floating labels, clear button for search

#### Badge

**Variants**: default, secondary, destructive, outline, live, power-play, penalty-kill
**Sizes**: sm, default
**Usage**: Game status, team indicators, counts
**Live Badge**: Pulsing green dot + "LIVE" text

#### Checkbox

**Size**: 20x20px
**States**: unchecked, checked, indeterminate, disabled
**Animation**: 200ms spring transition

#### LiveIndicator (New)

**Size**: 8px dot with 16px pulse area
**Colors**: Green (#00FF00) for live, Orange for intermission
**Animation**: 2s infinite pulse (opacity 0.4 to 1.0)
**Usage**: Game cards, scoreboards, headers

#### CountdownTimer (New)

**Format**: MM:SS or HH:MM:SS
**Font**: Geist Sans with tabular-nums
**Colors**: Inherit, red when < 2:00
**Features**: Smooth countdown, pause indicator

#### TeamColorSwatch (New)

**Size**: 24x24px or 32x32px
**Display**: Primary/secondary split or gradient
**Border**: 1px white for contrast
**Hover**: Scale 1.1 with shadow

#### StatNumber (New)

**Sizes**: xs (14px), sm (18px), md (24px), lg (32px), xl (48px)
**Font**: Geist Sans with tabular-nums
**Colors**: Default, positive (green), negative (red)
**Features**: Change animation, trend arrow

#### SocialIcon (New)

**Size**: 24x24px standard, 32x32px footer
**Platforms**: Twitter/X, Instagram, YouTube, Facebook, TikTok
**States**: Grayscale default, color on hover
**Animation**: 200ms color transition

#### ProgressBar (New)

**Height**: 4px or 8px
**Colors**: Primary, success, warning, danger
**Animation**: Indeterminate shimmer or determinate fill
**Usage**: Loading states, shot clocks, upload progress

#### Divider (New)

**Types**: Solid, dashed, dotted, western (rope pattern)
**Thickness**: 1px, 2px, 4px
**Colors**: Border color, with opacity variants
**Spacing**: Vertical margin options

#### IconButton (New)

**Size**: 32x32px, 40x40px, 48x48px
**Variants**: Filled, outlined, ghost
**States**: Normal, hover, active, disabled
**Tooltip**: On hover with 500ms delay

### Molecules

#### GameCard

**Size**: Responsive (full-width mobile, fixed desktop)
**Content**: Teams, scores, time, status, venue
**States**: scheduled, live, final, overtime
**Features**: Team color accents, live indicator, expandable stats
**Animation**: Slide up on enter, glow on score change

#### PlayerSelectDialog

**Purpose**: Select player for stat attribution
**Features**: Search, position filter, jersey number display
**Size**: Modal (90% mobile, 600px desktop)
**Layout**: Grid view or list view toggle

#### Timer

**Display**: MM:SS format with period indicator
**Controls**: Start/Stop, Reset, Period advance
**States**: running, paused, expired, warning (< 2:00)
**Features**: Audio alert option, fullscreen mode

#### StatButton

**Size**: 60x60px (mobile optimized)
**Types**: Goal, Assist, Penalty, Shot, Faceoff, Loose Ball
**States**: normal, pressed, disabled, pending
**Feedback**: Haptic on mobile, visual confirmation

#### LiveGameTicker (New)

**Height**: 80px desktop, 100px mobile
**Layout**: Horizontal scroll with momentum
**Content**: Compact game cards (teams, score, time)
**Features**: Pause on hover, keyboard navigation
**Update**: Real-time with subtle animations

#### TeamCard (New)

**Size**: 280x340px desktop, full-width mobile
**Content**: Logo, name, city, record, captain
**Hover**: Reveal team colors, scale transform
**Click**: Navigate to team profile
**Loading**: Skeleton with logo placeholder

#### StatComparison (New)

**Layout**: Side-by-side bars or numbers
**Visual**: Winner bold, loser muted
**Categories**: Goals, shots, faceoffs, penalties
**Animation**: Animated fill on load
**Mobile**: Stacked vertical layout

#### MediaCard (New)

**Types**: Photo, video, article
**Size**: 16:9 aspect ratio maintained
**Overlay**: Gradient with title/meta
**Hover**: Zoom image, play button for video
**Loading**: Blur-up image technique

#### NavigationDropdown (New)

**Trigger**: Hover (desktop) or click (mobile)
**Animation**: Fade + slide down
**Content**: Multi-column with sections
**Features**: Keyboard navigation, escape to close

#### PeriodScoreBreakdown (New)

**Layout**: Horizontal periods with scores
**Visual**: Team colors, winner highlighted
**Details**: Expandable to show goals
**Mobile**: Swipeable if needed

#### PlayerStatRow (New)

**Content**: Photo, name, number, stats
**Hover**: Highlight row, show additional stats
**Click**: Navigate to player profile
**Mobile**: Truncate name, prioritize key stats

#### SearchAutocomplete (New)

**Trigger**: Type 2+ characters
**Results**: Grouped by type (teams, players, games)
**Visual**: Icons for result types
**Navigation**: Arrow keys + enter
**Mobile**: Full-screen takeover

#### NotificationToast (New)

**Position**: Top-right desktop, top mobile
**Types**: Success, error, warning, info, goal
**Duration**: 4s default, persistent for errors
**Actions**: Dismiss, undo, view details
**Queue**: Stack up to 3, older auto-dismiss

### Organisms

#### Scoreboard

**Layout**: Horizontal (desktop) / Vertical (mobile)
**Refresh**: Real-time via SSE
**Features**: Live indicator, scores, period, time
**Variations**: Compact (ticker), Standard, Expanded (with stats)
**Animation**: Score flash on update, smooth transitions

#### StandingsTable

**Columns**: Rank, Team, GP, W-L-T, Points, GF-GA, Period Record
**Features**: Sortable, expandable on mobile, sticky header
**Highlight**: Playoff positions, team's own row
**Mobile**: Horizontal scroll with frozen rank/team columns

#### ScoringInterface

**Layout**: Fixed header with score, scrollable stats area
**Sections**: Score display, timer, stat buttons, game log
**Mobile**: Full-screen takeover with gesture support
**Features**: Undo/redo, offline queue, period transitions

#### GamesDashboard

**Layout**: Card grid with responsive columns
**Filters**: Day selection, status filter, search
**Actions**: Claim game, view details, quick stats
**States**: Loading, empty, error with retry

#### LiveGameTicker

**Layout**: Horizontal scrolling container
**Height**: 80px desktop / 100px mobile
**Content**: Mini game cards with scores, status, time
**Features**: Auto-scroll pause on hover, keyboard nav, click to expand
**Update**: Real-time with SSE, smooth scroll to new games

#### MegaMenu

**Trigger**: Hover on desktop, click on mobile
**Layout**: Full-width dropdown with columns
**Sections**: Teams (logos grid), Quick Stats, Schedule Preview, Featured Media
**Animation**: Slide down with fade (200ms)
**Features**: Smart positioning, keyboard navigation

#### HeroSlider

**Layout**: Full-width with gradient overlay
**Height**: 500px desktop / 350px mobile
**Content**: Featured games, news, highlights, announcements
**Controls**: Dots, arrows, keyboard nav, swipe on mobile
**Features**: Video backgrounds, parallax effect, lazy loading

#### InstagramFeed

**Layout**: Grid (4 cols desktop, 2 mobile)
**Content**: Latest tournament photos/videos
**API**: Instagram Basic Display API
**Features**: Lightbox view, infinite scroll option
**Loading**: Progressive with skeleton screens

#### SponsorBanner

**Layout**: Horizontal scroll or carousel
**Height**: 120px desktop, 80px mobile  
**Features**: Grayscale logos, color on hover, equal spacing
**Behavior**: Continuous scroll option, pause on hover
**Loading**: Lazy load images, show placeholders

#### LiveDashboard (New)

**Layout**: Multi-column grid of live games
**Features**: Real-time updates, expandable details
**Content**: Score, time, shots, penalties, key events
**Priority**: Show closest games first
**Mobile**: Single column with swipe actions

#### TeamShowcase (New)

**Layout**: Grid of all teams with visual hierarchy
**Content**: Logo, colors, record, top players
**Interaction**: Hover for stats, click for profile
**Features**: Filter by standings, search
**Animation**: Stagger load animation

#### TournamentBracket (New)

**Layout**: Tree structure for medal rounds
**Visual**: Team colors, scores, progression lines
**States**: Upcoming, live, completed
**Mobile**: Horizontal scroll with zoom
**Features**: Hover for game details

#### GameTimeline (New)

**Layout**: Horizontal timeline of events
**Events**: Goals, penalties, period starts/ends
**Visual**: Team colors, event icons
**Interaction**: Click to jump to event
**Mobile**: Simplified with key events only

#### StatsDashboard (New)

**Layout**: Multi-widget dashboard
**Widgets**: Top scorers, goalies, team stats, trends
**Features**: Configurable layout, refresh timer
**Visual**: Charts, tables, comparisons
**Mobile**: Stacked widgets, collapsible sections

#### VideoHighlightReel (New)

**Layout**: Carousel of video thumbnails
**Content**: Goals, saves, hits, interviews
**Player**: Inline or modal player
**Features**: Categories, search, sharing
**Loading**: Progressive video loading

#### ScheduleCalendar (New)

**Views**: Day, 3-day tournament, list
**Features**: Filter by team, venue, status
**Visual**: Color coding, time blocks
**Interaction**: Click for game details
**Mobile**: Agenda view with easy navigation

### Templates

#### TournamentLayout

**Header**: Logo, navigation, user menu
**Main**: Content area with consistent padding
**Footer**: Sponsors, links, copyright
**Responsive**: Hamburger menu on mobile

#### ScorekeeperLayout

**Header**: Minimal with game info
**Main**: Full-screen scoring interface
**Footer**: Hidden during scoring
**Optimization**: Maximum screen real estate

### Header & Navigation Structure

#### Main Header Layout
**Desktop (1024px+):**
- **Left**: Tournament logo/wordmark (Tiffany Gothic CC)
- **Center**: Primary navigation with mega menu dropdowns
- **Right**: Live games indicator, search, user account menu

**Mobile (< 1024px):**
- **Left**: Tournament logo (condensed)
- **Center**: Page title (if needed)
- **Right**: Hamburger menu + live games indicator

#### Primary Navigation Items
1. **Tournament** - Overview, schedule, standings, bracket, rules
2. **Teams** - All teams, rosters, stats, head-to-head
3. **Games** - Live games, results, highlights, schedule
4. **Stats** - Leaders, team stats, player stats, records
5. **Media** - Photos, videos, highlights, social

#### Mega Menu Structure

**Tournament Dropdown:**
- **Column 1: Quick Access**
  - Tournament Overview
  - Today's Schedule
  - Live Games
  - Current Standings
  - Tournament Rules
- **Column 2: Information**
  - 5-Point System Explained
  - Venue Information
  - Schedule Download (PDF)
  - Contact Information
- **Column 3: Featured**
  - Featured live game (if active)
  - Latest tournament news
  - Social media highlights

**Teams Dropdown:**
- **Column 1: Team Grid**
  - 8 team logos in 2x4 grid
  - Team colors and names
  - Click to team profile
- **Column 2: Quick Stats**
  - Current standings (top 4)
  - Team leaders
  - Recent results
- **Column 3: Team Tools**
  - Compare Teams
  - Roster Search
  - Team Statistics
  - Head-to-Head Records

**Games Dropdown:**
- **Column 1: Live Games**
  - Active games (if any)
  - Live scores and time
  - Quick access to streams
- **Column 2: Schedule**
  - Today's games
  - Tomorrow's games
  - Week overview
- **Column 3: Results**
  - Recent finals
  - Highlights available
  - Three stars awards

**Stats Dropdown:**
- **Column 1: Leaders**
  - Top scorers
  - Top goalies
  - Leading teams
- **Column 2: Categories**
  - Player statistics
  - Team statistics
  - Goalie statistics
  - Advanced metrics
- **Column 3: Records**
  - Tournament records
  - Individual achievements
  - Team milestones

**Media Dropdown:**
- **Column 1: Latest**
  - Recent photos
  - Latest videos
  - Live stream (if active)
- **Column 2: Highlights**
  - Game highlights
  - Player spotlights
  - Behind the scenes
- **Column 3: Social**
  - Instagram feed
  - Twitter updates
  - YouTube channel

#### Header Features
- **Sticky Navigation**: Fixed header on scroll
- **Live Games Indicator**: Pulsing indicator when games are live
- **Search Function**: Global search for teams, players, games
- **User Account**: Login/logout, scorekeeper access
- **Responsive**: Hamburger menu on mobile with slide-out panel

### Footer Structure

#### Footer Layout (4 Columns Desktop, Stacked Mobile)

**Column 1: Tournament Information**
- **Tournament Logo**: Tiffany Gothic CC wordmark
- **Event Details**: 
  - Dates: July 12-14, 2024
  - Location: Calgary, Alberta
  - Venue: Scotiabank Saddledome
- **Tagline**: "Only the best come to the west"

**Column 2: Quick Links**
- **Tournament**
  - Schedule
  - Standings
  - Rules & Format
  - Venue Information
- **Teams**
  - All Teams
  - Rosters
  - Statistics
- **Contact**
  - Tournament Office
  - Media Inquiries
  - Volunteer Information

**Column 3: Resources**
- **For Teams**
  - Captain Resources
  - Game Sheets
  - Team Contacts
  - Tournament Handbook
- **For Media**
  - Press Releases
  - Media Kit
  - Photo Gallery
  - Interview Requests
- **For Fans**
  - Parking Information
  - Concessions
  - Accessibility
  - FAQs

**Column 4: Connect & Follow**
- **Social Media Links**: (with SocialIcon component)
  - Instagram: @cowtownshowdown
  - Twitter/X: @cowtownlacrosse
  - Facebook: Cowtown Showdown
  - YouTube: Cowtown Lacrosse
  - TikTok: @cowtownlax
- **Newsletter Signup**
  - Email input field
  - Subscribe button
  - "Get tournament updates"

#### Footer Bottom Section
- **Sponsors**: Horizontal scrolling sponsor logos
- **Copyright**: © 2024 Cowtown Showdown. All rights reserved.
- **Legal Links**: Privacy Policy, Terms of Service, Code of Conduct
- **Powered By**: Tournament management system credits

#### Footer Features
- **Responsive Design**: 4 columns → 2 columns → 1 column
- **Social Integration**: Real social media feeds
- **Newsletter**: Email capture with validation
- **Sponsor Showcase**: Rotating or scrolling sponsor display
- **Quick Access**: Most important links prominently placed

#### Mobile Footer Adaptations
- **Accordion Sections**: Collapsible footer sections
- **Priority Content**: Most important links first
- **Social Prominence**: Social media links more prominent
- **Newsletter**: Simplified signup form
- **Sponsor Rotation**: Carousel for sponsor logos

---

## Site Structure & Content Map

### Information Architecture

```
/
├── / (Homepage)
├── /tournament
│   ├── /tournament/schedule
│   ├── /tournament/standings
│   ├── /tournament/bracket
│   ├── /tournament/stats
│   └── /tournament/rules
├── /teams
│   └── /teams/[slug] (8 team pages)
├── /players
│   ├── /players (All players directory)
│   └── /players/[id] (Individual player pages)
├── /games
│   ├── /games (All games listing)
│   ├── /games/live (Live games dashboard)
│   └── /games/[id] (Individual game pages)
├── /media
│   ├── /media (Gallery hub)
│   ├── /media/photos
│   ├── /media/videos
│   └── /media/highlights
├── /news
│   ├── /news (News listing)
│   └── /news/[slug] (Article pages)
├── /about
│   ├── /about/tournament
│   ├── /about/venue
│   ├── /about/volunteers
│   └── /about/sponsors
├── /contact
├── /scorekeeper (Protected)
│   ├── /scorekeeper (Dashboard)
│   └── /scorekeeper/game/[id]
└── /admin (Protected)
```

### Page-by-Page Content & Component Requirements

#### 1. Homepage (/)

**Components Used:**

- `TournamentLayout` (template)
- `HeroSlider` with tournament branding
- `LiveGameTicker` (sticky positioning)
- `GameCard` × 6-8 (today's games)
- `StatComparison` (quick stats)
- `VideoHighlightReel`
- `InstagramFeed`
- `SponsorBanner`
- `MegaMenu` (in header)

**Hero Section**

- **Content**: Tournament Logo/Wordmark (Tiffany Gothic CC), Dates & Location, Countdown Timer
- **Components**: `HeroSlider` with `Button` CTAs, `CountdownTimer`
- **Background**: Video or parallax image with `--hero-gradient` overlay
- **CTAs**: Primary "View Schedule" / "Watch Live", Secondary "Tournament Info"

**Live Game Ticker** (Sticky below hero)

- **Component**: `LiveGameTicker`
- **Content**: Active games with scores, time, status
- **Features**: Real-time SSE updates, keyboard navigation
- **Mobile**: Full width with touch scroll

**Featured Content Grid** (3 columns desktop, stacked mobile)

- **Components**:
  - `MediaCard` (YouTube stream if live)
  - `GameCard` (next upcoming game)
  - `MediaCard` (latest news)
- **Layout**: CSS Grid with gap-4

**Today's Games Section**

- **Components**: `GameCard` × 6-8 in grid
- **Features**: Filter by status, auto-refresh
- **Mobile**: Single column with reduced info

**Quick Stats Dashboard**

- **Components**:
  - `StatsDashboard` (mini version)
  - `PlayerStatRow` × 3 (top scorers)
  - `PlayerStatRow` × 3 (top goalies)
  - `StandingsTable` (compact, top 4)
- **Layout**: 4-column grid desktop, 2-column tablet, stacked mobile

**Tournament Highlights**

- **Component**: `VideoHighlightReel`
- **Content**: 6-8 recent highlights
- **Features**: Category filter, autoplay off

**Instagram Feed**

- **Component**: `InstagramFeed`
- **Layout**: 3×2 grid desktop, 2×3 mobile
- **Fallback**: Static image gallery

**Sponsor Section**

- **Component**: `SponsorBanner`
- **Animation**: Continuous scroll or static grid

**Footer Components**

- `Divider` (western style)
- `SocialIcon` × 5
- Navigation links
- Newsletter signup (`Input` + `Button`)

#### 2. Tournament Hub (/tournament)

**Components Used:**

- `TournamentLayout` (template)
- `NavigationDropdown` (sub-navigation)
- `LiveDashboard` (if games active)
- `GameCard` × N (expanded version)
- `StandingsTable` (compact)
- `ScheduleCalendar` (today view)
- `Button` grid for quick actions

**Page Header**

- **Component**: Custom header with `Badge` indicators
- **Navigation**: Tabbed navigation using `NavigationDropdown`
- **Tabs**: Overview | Schedule | Standings | Bracket | Stats | Rules

**Live Games Section** (Conditional)

- **Component**: `LiveDashboard`
- **Layout**: 2-column grid desktop, stacked mobile
- **Content**: Full game details including shots, penalties, events
- **Update**: Real-time with `ProgressBar` for period time

**Tournament Information Grid**

- **Components**: Custom info cards
- **Content**:
  - Tournament Format (pool play + medals)
  - 5-Point System (`StatComparison` visual)
  - Prize Pool breakdown
  - Important dates/times
- **Layout**: 2×2 grid desktop, stacked mobile

**Today's Schedule**

- **Component**: `ScheduleCalendar` (day view)
- **Features**:
  - Time slots on Y-axis
  - Games as blocks with team colors
  - Referee assignments
  - Venue/rink info
- **Mobile**: List view with `GameCard` components

**Standings Preview**

- **Component**: `StandingsTable` (compact)
- **Features**: Top 4 teams only, "View Full Standings" link
- **Visual**: Playoff line indicator

**Quick Actions Grid**

- **Components**: `Button` with `IconButton` variants
- **Actions**:
  - Download Schedule (PDF)
  - Venue Directions
  - Volunteer Info
  - Tournament Rules
  - Contact Organizers
- **Layout**: 3×2 grid desktop, 2×3 mobile

#### 3. Schedule (/tournament/schedule)

**Components Used:**

- `TournamentLayout` (template)
- `ScheduleCalendar` (main view)
- `GameCard` (list view)
- `NavigationDropdown` (filters)
- `Button` group (view toggles)
- `IconButton` (actions)

**View Toggle Bar**

- **Component**: `Button` group with icons
- **Options**: Calendar | List | By Team
- **Mobile**: Dropdown select instead

**Filters Section**

- **Components**:
  - `NavigationDropdown` (Day filter)
  - `Badge` group (Game type)
  - `SearchAutocomplete` (Team search)
  - `Badge` group (Status)
- **Layout**: Horizontal scroll on mobile

**Calendar View**

- **Component**: `ScheduleCalendar` (3-day view)
- **Features**:
  - Responsive grid (3 columns desktop, 1 mobile)
  - Time slots every 30 minutes
  - Game blocks with team colors
  - `LiveIndicator` for active games
  - Click for `GameCard` popover
- **Mobile**: Vertical scroll with sticky day headers

**List View**

- **Components**: `GameCard` × N grouped by day
- **Features**:
  - Expandable for full details
  - Referee assignments shown
  - `Badge` for game type/status
  - `TeamColorSwatch` for quick identification
- **Grouping**: `Divider` between days

**Team View**

- **Component**: Custom team schedule grid
- **Layout**: Team rows, game columns
- **Features**:
  - `TeamColorSwatch` in row headers
  - Compact game info in cells
  - Highlight conflicts/back-to-backs

**Export Actions**

- **Components**:
  - `Button` with download icon (PDF)
  - `Button` with calendar icon (iCal)
  - `IconButton` for share menu
- **Position**: Sticky on mobile, top-right desktop

#### 4. Standings (/tournament/standings)

**Components Used:**

- `TournamentLayout` (template)
- `StandingsTable` (full version)
- `StatComparison` (point breakdown)
- `PeriodScoreBreakdown` (in expanded rows)
- `Badge` (clinched indicators)
- `Checkbox` (column toggles)

**Main Standings Table**

- **Component**: `StandingsTable` with sticky header
- **Columns**:
  - Rank with movement indicator
  - Team (`TeamColorSwatch` + logo + name)
  - GP (Games Played)
  - Record (W-L-T)
  - PTS (Tournament Points) - sortable default
  - Period Record (expandable)
  - GF-GA (Goals For/Against)
  - DIFF (Goal Differential)
  - AVG (Goal Average)
  - L3 (Last 3 games form)
- **Features**:
  - Row hover highlights
  - Expandable rows for period details
  - Playoff line visual separator
  - `Badge` for clinched/eliminated
- **Mobile**: Horizontal scroll with frozen rank/team

**Point System Explainer**

- **Component**: Custom accordion section
- **Content**:
  - Visual `StatComparison` showing point allocation
  - Interactive example calculator
  - Period point breakdown
  - Maximum points possible (5)
- **Design**: Western-themed info box

**Tiebreaker Rules**

- **Component**: Numbered list with `Divider`
- **Display**: Collapsible section
- **Content**:
  1. Head-to-head points
  2. Head-to-head goal average
  3. Overall goal average
  4. Least penalty minutes

**Live Scenarios** (Day 2-3)

- **Component**: Custom scenario cards
- **Features**:
  - "If X wins..." calculations
  - Clinching scenarios
  - Elimination scenarios
  - Interactive toggle results
- **Update**: Refresh after each game

**Column Customization**

- **Component**: `Checkbox` group in dropdown
- **Options**: Show/hide optional columns
- **Saves**: Local storage preference

#### 5. Teams Hub (/teams)

**Components Used:**

- `TournamentLayout` (template)
- `TeamShowcase` (main grid)
- `TeamCard` × 8
- `NavigationDropdown` (filters)
- `SearchAutocomplete` (team search)

**Page Header**

- **Title**: "Tournament Teams" (H1)
- **Subtitle**: "8 Elite Senior Men's Teams"

**Team Showcase Grid**

- **Component**: `TeamShowcase`
- **Layout**: 2×4 grid desktop, 2×4 tablet, 1×8 mobile
- **Cards**: `TeamCard` with:
  - Large team logo (120px)
  - Team name (H3)
  - City, Province
  - `TeamColorSwatch` accent border
  - Captain name with `Badge`
  - Quick stats:
    - Current rank (`StatNumber`)
    - Record (W-L-T)
    - Points
    - Top scorer name
  - Hover: Expand with full colors
  - Click: Navigate to profile

**Filter Bar**

- **Components**:
  - `NavigationDropdown` (Sort by: Standings, Alphabetical, Province)
  - `SearchAutocomplete` (Find team)
  - `Button` (Reset filters)
- **Mobile**: Sticky filter button opens modal

**Team Comparison** (Optional)

- **Component**: `StatComparison`
- **Feature**: Select 2 teams to compare
- **Stats**: Head-to-head, common opponents

#### 6. Team Profile (/teams/[slug])

**Components Used:**

- `TournamentLayout` (template)
- `TeamColorSwatch` (theme accents)
- `NavigationDropdown` (tab navigation)
- `PlayerStatRow` (roster display)
- `GameCard` (schedule)
- `StatComparison` (team stats)
- `MediaCard` (photos/videos)

**Team Header**

- **Layout**: Hero section with team color gradient
- **Content**:
  - Large team logo (200px desktop, 120px mobile)
  - Team name (H1 with team colors)
  - City, Province
  - `Badge` with current standing
  - Captain info in expandable card
- **Background**: `TeamColorSwatch` gradient overlay

**Tab Navigation**

- **Component**: `NavigationDropdown` as tabs
- **Options**: Overview | Roster | Schedule | Stats | Media
- **Mobile**: Horizontal scroll tabs

**Overview Tab**

- **Components**:
  - Rich text content block
  - Team photo gallery (3-4 images)
  - "Players to Watch" cards (top 3)
  - Tournament history table
  - Social media links (`SocialIcon`)
- **Layout**: 2-column desktop, stacked mobile

**Roster Tab**

- **Components**:
  - `PlayerStatRow` × 20 max
  - Grouped by position
  - Each row contains:
    - Jersey number (`StatNumber`)
    - Player name (clickable)
    - Position `Badge`
    - Handedness icon
    - Key stats (G, A, PTS, PIM)
  - Coaching staff section
- **Features**: Sort by number/name/position/stats

**Schedule Tab**

- **Components**:
  - `GameCard` × 5 (all tournament games)
  - `PeriodScoreBreakdown` for completed
  - Head-to-head record summary
- **Layout**: Chronological list
- **Features**: Filter completed/upcoming

**Stats Tab**

- **Components**:
  - `StatsDashboard` (team totals)
  - `StatComparison` (vs tournament avg)
  - Full player stats table
  - `ProgressBar` for visual stats
- **Categories**: Offense, Defense, Special Teams, Discipline

**Media Tab**

- **Components**:
  - `MediaCard` grid
  - `VideoHighlightReel` (team-specific)
  - Photo galleries
- **Filter**: Photos/Videos/Articles

#### 7. Games Hub (/games)

**Components Used:**

- `TournamentLayout` (template)
- `LiveDashboard` (active games)
- `GameCard` (all games)
- `NavigationDropdown` (filters)
- `Badge` group (status filters)
- `SearchAutocomplete` (game/team search)

**Live Games Section** (Conditional)

- **Component**: `LiveDashboard`
- **Prominence**: Full width, top of page
- **Features**:
  - Larger cards than homepage
  - Live `StatComparison` bars
  - `CountdownTimer` for period
  - Recent events ticker
- **Empty State**: "No games currently live"

**Filter Bar**

- **Components**:
  - `Badge` group (All | Live | Final | Upcoming)
  - `NavigationDropdown` (Day 1/2/3)
  - `SearchAutocomplete` (Team filter)
  - `Input` (Game # search)
- **Position**: Sticky on scroll

**Games Grid**

- **Component**: `GameCard` grid
- **Layout**: 3 columns desktop, 2 tablet, 1 mobile
- **Sorting**: Chronological (newest first for final)
- **Features**:
  - `LiveIndicator` for active
  - Three stars `Badge` for final
  - `TeamColorSwatch` accents
  - Expandable for box score preview

**Load More**

- **Component**: `Button` or infinite scroll
- **Pagination**: 12 games per page

#### 8. Game Detail (/games/[id])

**Components Used:**

- `TournamentLayout` (template)
- `Scoreboard` (main display)
- `NavigationDropdown` (tabs)
- `GameTimeline` (events)
- `StatComparison` (team stats)
- `PlayerStatRow` (player stats)
- `PeriodScoreBreakdown`
- `MediaCard` (YouTube embed)

**Game Header**

- **Component**: Enhanced `Scoreboard`
- **Content**:
  - Large team logos (100px)
  - Big score display (`StatNumber` xl)
  - `LiveIndicator` or final status
  - Period & time (`CountdownTimer`)
  - Venue & game info
  - `TeamColorSwatch` accents
- **Layout**: Horizontal desktop, stacked mobile

**Live Stream Section** (Conditional)

- **Component**: `MediaCard` with YouTube embed
- **Features**:
  - 16:9 responsive player
  - Fullscreen support
  - No chat/comments
  - "Watch on YouTube" link
- **Position**: Above tabs on desktop, tab on mobile

**Tab Navigation**

- **Component**: `NavigationDropdown`
- **Tabs**: Box Score | Timeline | Stats | Media
- **Default**: Box Score for final, Timeline for live

**Box Score Tab**

- **Components**:
  - `PeriodScoreBreakdown` (expandable)
  - Goals list with time, scorer, assists
  - Penalty summary by period
  - Three stars display (final only)
  - Goalie stats comparison
- **Layout**: 2-column desktop, stacked mobile

**Timeline Tab**

- **Component**: `GameTimeline`
- **Features**:
  - Chronological events
  - Filter by type (goals, penalties, etc.)
  - Period dividers
  - Jump to period
- **Update**: Real-time for live games

**Stats Tab**

- **Components**:
  - `StatComparison` (team totals)
  - Shot chart visualization
  - Faceoff win % by period
  - `PlayerStatRow` tables for each team
  - Special teams efficiency
- **Layout**: Dashboard style

**Media Tab**

- **Components**:
  - `VideoHighlightReel` (game highlights)
  - `MediaCard` grid (photos)
  - Social media embeds
- **Features**: Share buttons

#### 9. Player Profile (/players/[id])

**Player Header**

- Player photo/silhouette
- Name & number
- Team logo & colors
- Position & handedness

**Stats Summary**

- Tournament totals
- Per-game averages
- Ranking badges

**Game Log**

- Game-by-game statistics
- Sortable columns

**Career Highlights** (if applicable)

- Previous tournament stats
- Awards/recognition

#### 10. Media Gallery (/media)

**Media Navigation**

- All | Photos | Videos | Highlights

**Filter Options**

- By Day
- By Team
- By Game

**Photo Gallery**

- Masonry grid layout
- Lightbox on click
- Download options
- Photographer credits

**Video Section**

- YouTube embeds
- Thumbnail grid
- View counts
- Upload dates

#### 11. Live Games (/games/live)

**Full-Screen Live Dashboard**

- All active games in grid
- Larger cards than ticker
- Auto-refresh every second
- Includes:
  - Full box score preview
  - Shot counters
  - Penalty status
  - Key events log

---

## Screen Inventory

### Public Tournament Website

1. **Homepage**
   - Hero section with tournament branding
   - Live scoreboard widget
   - Featured YouTube stream
   - Upcoming games (next 3)
   - Recent results (last 3)
   - Quick links grid

2. **Tournament Hub** (`/tournament`)
   - Live games display (prominent)
   - Today's full schedule
   - Recent finals
   - Embedded stream for featured game
   - Tournament info blocks

3. **Schedule** (`/schedule`)
   - Toggle: Calendar vs List view
   - Filters: By day, by team
   - Game cards with all details
   - Print-friendly version

4. **Standings** (`/standings`)
   - Full standings table
   - 5-point system explanation
   - Tiebreaker rules
   - Visual indicators for positions
   - Mobile: Collapsible rows

5. **Teams** (`/teams`)
   - 8 team cards in grid
   - Team logo, colors, city
   - Captain info (hidden by default)
   - Link to full profile

6. **Team Profile** (`/teams/[slug]`)
   - Team header with branding
   - Full roster table
   - Team schedule (past/future)
   - Team statistics
   - Recent game results

7. **Posts/News** (`/posts`)
   - Blog-style listing
   - Featured post hero
   - Category filter
   - Pagination
   - Social sharing

8. **Search** (`/search`)
   - Search input with filters
   - Results grouped by type
   - No results state
   - Search suggestions

9. **CMS Pages** (`/[slug]`)
   - Flexible content blocks
   - Tournament rules
   - Venue information
   - Contact/About pages

### Scorekeeper Interface

10. **Scorekeeper Dashboard** (`/scorekeeper`)
    - Games grouped by day
    - Claim/release buttons
    - Live game indicators
    - User session info
    - Quick stats overview

11. **Game Scoring** (`/scorekeeper/game/[id]`)
    - Fixed score header
    - Period timer (prominent)
    - Stat button grid
    - Player selection modal
    - Game event log
    - Period management
    - Three stars selection

---

## Design Patterns

### Western Theme Implementation

1. **Headers**: Use `.font-western` for impact
2. **Backgrounds**: Subtle wood grain or leather textures
3. **Borders**: Rope-style or distressed edges for featured content
4. **Colors**: Earth tones with golden accents
5. **Icons**: Western-themed where appropriate (stars, badges)

### Mobile Optimization

1. **Touch Targets**: Minimum 44x44px
2. **Thumb Zones**: Primary actions in bottom 2/3
3. **Gestures**: Swipe for common actions
4. **Orientation**: Support both portrait and landscape
5. **Offline**: Show cached data with sync indicators

### Real-time Updates

1. **Live Indicators**: Pulsing dot for active games
2. **Score Changes**: Brief highlight animation
3. **Status Changes**: Color transition
4. **Connection State**: Show when offline
5. **Update Frequency**: 1 second for live games

### Interactive Pattern Library

#### Hover Effects & Transforms

```css
/* Team Card Hover (Inspired by NLL) */
.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  background: var(--card-hover-gradient);
  border-color: var(--team-primary);
}

/* Game Card Hover */
.game-card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--live-indicator);
}

/* Player Row Hover */
.player-row:hover {
  background-color: var(--card-hover-gradient);
  border-left: 3px solid var(--team-primary);
}

/* Logo Hover (Sponsor Banner) */
.sponsor-logo:hover {
  filter: grayscale(0) brightness(1.1);
  transform: scale(1.1);
}

/* Button Hover States */
.button-primary:hover {
  background: linear-gradient(135deg, var(--primary-brown) 0%, var(--golden) 100%);
  box-shadow: 0 4px 8px rgba(147, 79, 37, 0.3);
}

.button-secondary:hover {
  background: var(--card);
  color: var(--primary-brown);
  border-color: var(--primary-brown);
}
```

#### Animation Keyframes

```css
/* Score Update Flash */
@keyframes scoreFlash {
  0% {
    background-color: var(--golden);
  }
  100% {
    background-color: transparent;
  }
}

/* Live Pulse Animation */
@keyframes livePulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

/* Slide In Animation */
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Shimmer Loading */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

/* Bounce In (For Goals) */
@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Shake (For Errors) */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
```

#### Swipe Gestures (Mobile)

```javascript
// Game Card Swipe Actions
const gameCardSwipeConfig = {
  left: {
    action: 'showStats',
    threshold: 100,
    icon: '📊',
    color: 'var(--primary-brown)',
  },
  right: {
    action: 'showMedia',
    threshold: 100,
    icon: '📸',
    color: 'var(--golden)',
  },
}

// Photo Gallery Swipe
const gallerySwipeConfig = {
  left: 'nextImage',
  right: 'prevImage',
  threshold: 50,
  velocity: 0.3,
}

// Tab Navigation Swipe
const tabSwipeConfig = {
  left: 'nextTab',
  right: 'prevTab',
  threshold: 80,
  elasticity: 0.2,
}
```

#### Loading States & Skeletons

```css
/* Skeleton Base */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

/* Game Card Skeleton */
.game-card-skeleton {
  height: 120px;
  border-radius: 8px;
  margin-bottom: 16px;
}

/* Player Row Skeleton */
.player-row-skeleton {
  height: 60px;
  border-radius: 4px;
  margin-bottom: 8px;
}

/* Team Logo Skeleton */
.team-logo-skeleton {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
```

#### Micro-animations

```css
/* Live Badge Pulse */
.live-badge {
  animation: livePulse 2s infinite;
  color: #00ff00;
}

/* Score Change Flash */
.score-change {
  animation: scoreFlash 500ms ease-out;
}

/* Button Press Feedback */
.button:active {
  transform: scale(0.95);
  transition: transform 150ms ease-out;
}

/* Card Entry Stagger */
.card-enter {
  animation: slideInUp 300ms ease-out;
}

.card-enter:nth-child(1) {
  animation-delay: 0ms;
}
.card-enter:nth-child(2) {
  animation-delay: 100ms;
}
.card-enter:nth-child(3) {
  animation-delay: 200ms;
}

/* Tab Switch Slide */
.tab-content-enter {
  animation: slideInRight 200ms ease-out;
}

.tab-content-exit {
  animation: slideOutLeft 200ms ease-out;
}

/* Goal Celebration */
.goal-celebration {
  animation: bounceIn 600ms ease-out;
}

/* Error Shake */
.error-shake {
  animation: shake 500ms ease-out;
}
```

#### Progressive Enhancement Patterns

```javascript
// Base Experience: Static HTML/CSS
const baseExperience = {
  navigation: 'standard-links',
  updates: 'page-refresh',
  interactions: 'hover-focus-only',
}

// Enhanced: JavaScript interactions
const enhancedExperience = {
  navigation: 'spa-routing',
  updates: 'ajax-polling',
  interactions: 'click-tap-keyboard',
}

// Optimal: Real-time updates
const optimalExperience = {
  navigation: 'spa-routing',
  updates: 'sse-realtime',
  interactions: 'touch-gestures-voice',
}

// Feature Detection
const features = {
  touch: 'ontouchstart' in window,
  sse: !!window.EventSource,
  websockets: !!window.WebSocket,
  serviceWorker: 'serviceWorker' in navigator,
}
```

#### Touch & Gesture Patterns

```css
/* Touch-friendly Sizing */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 8px;
}

/* Thumb-friendly Zones */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: var(--background);
  border-top: 1px solid var(--border);
}

/* Swipe Indicators */
.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  font-size: 24px;
}

.swipe-indicator.left {
  left: 16px;
}

.swipe-indicator.right {
  right: 16px;
}
```

#### Accessibility Patterns

```css
/* Focus Indicators */
.focus-visible {
  outline: 2px solid var(--primary-brown);
  outline-offset: 2px;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High Contrast */
@media (prefers-contrast: high) {
  .live-indicator {
    background: #000;
    color: #fff;
    border: 2px solid #fff;
  }
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

#### Real-time Update Patterns

```javascript
// Connection State Management
const connectionStates = {
  connecting: { color: 'orange', text: 'Connecting...' },
  connected: { color: 'green', text: 'Live' },
  disconnected: { color: 'red', text: 'Offline' },
  reconnecting: { color: 'orange', text: 'Reconnecting...' },
}

// Optimistic Updates
const optimisticUpdate = {
  immediate: true,
  rollbackOnError: true,
  retryCount: 3,
  retryDelay: 1000,
}

// Batch Updates
const batchUpdate = {
  interval: 1000,
  maxBatchSize: 10,
  priorityQueue: ['goals', 'period-end', 'game-start'],
}
```

### Performance Optimization Patterns

#### Image Optimization (NLL/OJLL Inspired)

```typescript
// Next.js Image with progressive loading
<Image
  src={teamLogo}
  placeholder="blur"
  blurDataURL={teamLogoBlur}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
  priority={isAboveFold}
  quality={85}
  loading={isAboveFold ? 'eager' : 'lazy'}
/>

// Responsive image sets
const logoSizes = {
  mobile: 'w-20 h-20',
  tablet: 'w-24 h-24',
  desktop: 'w-32 h-32'
};

// WebP with fallback
<picture>
  <source srcSet={`${teamLogo}.webp`} type="image/webp" />
  <img src={`${teamLogo}.jpg`} alt="Team Logo" />
</picture>
```

#### Real-time Connection Management

```typescript
// SSE with exponential backoff
class GameSSEManager {
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private baseReconnectDelay = 1000

  connect(gameId: string) {
    const eventSource = new EventSource(`/api/games/${gameId}/live`)

    eventSource.onopen = () => {
      this.reconnectAttempts = 0
    }

    eventSource.onerror = () => {
      eventSource.close()
      this.handleReconnect()
    }

    // Handle page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        eventSource.close()
      } else {
        this.connect(gameId)
      }
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts)
      setTimeout(() => this.connect(gameId), delay)
      this.reconnectAttempts++
    }
  }
}

// Connection pooling for multiple games
class ConnectionPool {
  private connections = new Map<string, EventSource>()
  private subscribers = new Map<string, Set<Function>>()

  subscribe(gameId: string, callback: Function) {
    if (!this.connections.has(gameId)) {
      this.createConnection(gameId)
    }

    if (!this.subscribers.has(gameId)) {
      this.subscribers.set(gameId, new Set())
    }

    this.subscribers.get(gameId)!.add(callback)
  }
}
```

#### Virtual Scrolling Implementation

```typescript
// Virtual list for large datasets
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => JSX.Element;
  overscan?: number;
}

function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length - 1
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
}
```

#### Bundle Optimization

```javascript
// Route-based code splitting
const Homepage = lazy(() => import('./pages/Homepage'));
const TeamProfile = lazy(() => import('./pages/TeamProfile'));
const GameDetail = lazy(() => import('./pages/GameDetail'));

// Component-level splitting
const StatsVisualizations = lazy(() =>
  import('./components/StatsVisualizations')
);
const VideoPlayer = lazy(() => import('./components/VideoPlayer'));

// Preload critical routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
    loader: () => {
      // Preload likely next routes
      import('./pages/Schedule');
      import('./pages/Standings');
    }
  }
]);

// Dynamic imports for features
const loadFeature = async (featureName: string) => {
  switch (featureName) {
    case 'scorekeeper':
      return import('./features/scorekeeper');
    case 'analytics':
      return import('./features/analytics');
    default:
      return null;
  }
};
```

#### Caching Strategy

```typescript
// Service Worker caching
const CACHE_NAME = 'cowtown-v1'
const STATIC_CACHE = ['/', '/styles.css', '/app.js', '/manifest.json']

// Cache-first for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/static/')) {
    event.respondWith(
      caches
        .open(CACHE_NAME)
        .then((cache) => cache.match(event.request))
        .then((response) => response || fetch(event.request)),
    )
  }
})

// Network-first for API calls
if (event.request.url.includes('/api/')) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
        }
        return response
      })
      .catch(() => caches.match(event.request)),
  )
}

// SWR (Stale-While-Revalidate) for content
const swr = async (request: Request) => {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request).then((response) => {
    cache.put(request, response.clone())
    return response
  })

  return cached || fetchPromise
}
```

#### Memory Management

```typescript
// Cleanup on component unmount
useEffect(() => {
  const eventSource = new EventSource('/api/games/live')
  const intervalId = setInterval(() => {
    // Periodic cleanup
  }, 30000)

  return () => {
    eventSource.close()
    clearInterval(intervalId)
  }
}, [])

// Weak references for large objects
const gameDataCache = new WeakMap()

// Limit concurrent connections
const MAX_CONCURRENT_CONNECTIONS = 3
const connectionQueue = new Set()

// Debounced updates
const debouncedUpdate = useMemo(() => debounce(updateFunction, 300), [updateFunction])
```

#### Progressive Enhancement Levels

```typescript
// Level 1: Base HTML/CSS
const baseExperience = {
  navigation: 'page-reload',
  updates: 'manual-refresh',
  interactions: 'click-only',
  performance: 'server-rendered',
}

// Level 2: Basic JavaScript
const enhancedExperience = {
  navigation: 'spa-routing',
  updates: 'ajax-polling',
  interactions: 'click-keyboard',
  performance: 'client-hydration',
}

// Level 3: Advanced Features
const modernExperience = {
  navigation: 'prefetch-routes',
  updates: 'sse-realtime',
  interactions: 'touch-gestures',
  performance: 'streaming-ssr',
}

// Level 4: Cutting Edge
const futureExperience = {
  navigation: 'view-transitions',
  updates: 'websocket-bidirectional',
  interactions: 'voice-commands',
  performance: 'edge-ssr',
}
```

#### Database Query Optimization

```typescript
// Efficient data fetching
const useGameData = (gameId: string) => {
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGameData(gameId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: gameStatus === 'live' ? 1000 : false,
    select: (data) => ({
      // Only select needed fields
      score: data.score,
      period: data.period,
      time: data.time,
      status: data.status,
    }),
  })
}

// Batch requests
const batchGameRequests = (gameIds: string[]) => {
  return Promise.all(gameIds.map((id) => fetchGameData(id)))
}

// Pagination with cursor
const useInfiniteGames = () => {
  return useInfiniteQuery({
    queryKey: ['games'],
    queryFn: ({ pageParam = null }) => fetchGames({ cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
```

#### Monitoring & Analytics

```typescript
// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'largest-contentful-paint') {
      analytics.track('LCP', entry.startTime)
    }
    if (entry.entryType === 'first-input-delay') {
      analytics.track('FID', entry.processingStart - entry.startTime)
    }
  })
})

// Error tracking
window.addEventListener('error', (event) => {
  analytics.track('JS Error', {
    message: event.message,
    filename: event.filename,
    line: event.lineno,
  })
})

// Real-time metrics
const trackGameUpdate = (gameId: string, latency: number) => {
  analytics.track('Game Update', {
    gameId,
    latency,
    timestamp: Date.now(),
  })
}
```

#### Mobile-Specific Optimizations

```typescript
// Touch event optimization
const handleTouchStart = useCallback((e: TouchEvent) => {
  e.preventDefault() // Prevent 300ms delay
}, [])

// Viewport management
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// Battery-aware features
const battery = await navigator.getBattery()
const isLowBattery = battery.level < 0.2

if (isLowBattery) {
  // Reduce animation frequency
  // Disable autoplay videos
  // Increase update intervals
}

// Network-aware loading
const connection = navigator.connection
if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
  // Load reduced quality images
  // Disable non-essential features
}
```

### Component State Patterns

#### Live Game Card States

```
1. Scheduled
   - Gray background
   - Show countdown timer
   - "Starts in X" message

2. Pre-Game (5 min before)
   - Yellow pulse border
   - "Starting Soon" badge
   - Team lineups available

3. Live
   - Green pulse indicator
   - Real-time score updates
   - Period/time countdown

4. Intermission
   - Orange background
   - "Intermission" badge
   - Next period countdown

5. Final
   - Muted colors
   - Three stars displayed
   - "View Highlights" CTA
```

#### Data Freshness Indicators

- **Live Data**: Green dot + "Live"
- **Recent (< 1 min)**: No indicator
- **Stale (> 1 min)**: Gray dot + timestamp
- **Offline**: Red dot + "Offline"

### Accessibility

1. **Color Contrast**: WCAG AA minimum
2. **Focus Indicators**: Visible ring on all interactive elements
3. **Screen Readers**: Proper ARIA labels
4. **Keyboard Navigation**: Full support
5. **Text Size**: Responsive to user preferences

---

## API & Data Reference

### Key Data Models

#### Team

```typescript
{
  id: string
  name: string // "Calgary Bears"
  slug: string // "calgary-bears"
  logo?: Media
  primaryColor?: string // Hex color
  secondaryColor?: string // Hex color
  city: string
  province: string
  captain: {
    name: string
    email: string
    phone: string
  }
}
```

#### Player

```typescript
{
  id: string
  firstName: string
  lastName: string
  jerseyNumber: number // 0-99
  team: Team // Relationship
  primaryPosition: 'offence' | 'defence' | 'transition' | 'faceoff' | 'goalie'
  secondaryPosition?: string
  handedness: 'left' | 'right'
  playerType: 'runner' | 'goalie'
}
```

#### Game

```typescript
{
  id: string
  gameNumber: string // "1", "2", etc.
  gameType: 'pool' | 'medal'
  day: 1 | 2 | 3
  scheduledTime: Date
  status: 'scheduled' | 'live' | 'final' | 'overtime'
  homeTeam: Team
  awayTeam: Team
  homeScore: number
  awayScore: number
  currentPeriod: 0 | 1 | 2 | 3 | 'OT1' | 'OT2'
  periodTimeRemaining: number // seconds
  gamePoints: { home: number, away: number }
  periodLength: number // 12 or 15 minutes
  youtubeUrl?: string
  threeStars?: {
    first: Player
    second: Player
    third: Player
  }
}
```

### Key API Endpoints

- `GET /api/games/live` - All live games
- `GET /api/games/[id]/live` - SSE stream for game
- `POST /api/games/[id]/goal` - Record goal
- `POST /api/games/[id]/penalty` - Record penalty
- `GET /api/standings` - Current standings
- `GET /api/schedule` - Full schedule

### Real-time Events

```typescript
type GameEvent =
  | { type: 'score_update'; home: number; away: number }
  | { type: 'period_change'; period: number | string }
  | { type: 'goal'; team: 'home' | 'away'; player: Player }
  | { type: 'penalty'; team: 'home' | 'away'; player: Player; duration: string }
  | { type: 'game_status'; status: string }
  | { type: 'timer_update'; remaining: number }
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

1. **Color Contrast**
   - Normal text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - UI components: 3:1 minimum

2. **Keyboard Navigation**
   - All interactive elements reachable
   - Logical tab order
   - Skip links for main content
   - Escape key closes modals

3. **Screen Reader Support**
   - Semantic HTML structure
   - ARIA labels for icons
   - Live regions for updates
   - Form field descriptions

4. **Mobile Accessibility**
   - Touch targets 44x44px minimum
   - Adequate spacing between targets
   - Zoom support up to 200%
   - Landscape/portrait support

---

## Implementation Notes

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + CSS Modules
- **Components**: shadcn/ui base components
- **State**: React hooks + Context
- **Real-time**: Server-Sent Events (SSE)
- **CMS**: Payload CMS 3.x

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Core Web Vitals**: All green
- **Bundle Size**: < 200KB initial JS

### Real-time UI Optimization

#### SSE Implementation

```typescript
// Centralized SSE manager for all live games
class GameSSEManager {
  private connections: Map<string, EventSource> = new Map()

  subscribe(gameId: string, onUpdate: (data: GameEvent) => void) {
    // Share connections for same game
    // Implement exponential backoff
    // Handle tab visibility API
  }
}
```

#### Update Batching

```typescript
// Batch multiple updates in same render cycle
const updateQueue: GameUpdate[] = []
let rafId: number

function queueUpdate(update: GameUpdate) {
  updateQueue.push(update)
  if (!rafId) {
    rafId = requestAnimationFrame(flushUpdates)
  }
}
```

#### Caching Strategy

1. **Static Assets**: 1 year cache with hash
2. **API Responses**:
   - Live games: No cache
   - Completed games: 5 minutes
   - Teams/Players: 30 minutes
3. **Images**: Lazy load with LQIP
4. **Offline**: Service worker with stale-while-revalidate

#### Bundle Optimization

```javascript
// Route-based code splitting
const TeamProfile = lazy(() => import('./pages/TeamProfile'))
const MediaGallery = lazy(() => import('./pages/MediaGallery'))

// Component-level splitting for heavy features
const StatsVisualizations = lazy(() => import('./components/StatsViz'))
```

#### Perceived Performance

1. **Instant Feedback**: Optimistic updates
2. **Progressive Loading**: Critical content first
3. **Smooth Animations**: 60fps target
4. **Predictive Prefetch**: Next likely navigation

### Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Android 8+

### Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Development Workflow

1. Design in Figma/Penpot following this guide
2. Create components in Storybook first
3. Implement with TypeScript + Tailwind
4. Test on real devices
5. Ensure accessibility compliance
6. Optimize for performance

---

This Design Bible serves as the single source of truth for all UI/UX decisions in the Cowtown Showdown project. Update this document as the design system evolves.
