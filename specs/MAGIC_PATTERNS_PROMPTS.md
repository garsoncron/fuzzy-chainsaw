# Magic Patterns Prompts - Cowtown Showdown

## Updated Magic Patterns Preset - Cowtown Showdown Lacrosse Tournament

### Default Style Guide Prompt

You are designing for the Cowtown Showdown Senior Men's lacrosse tournament website. This is a premier digital experience that celebrates Calgary's western heritage while providing state-of-the-art tournament management features inspired by professional lacrosse leagues like the NLL and Ontario Junior Lacrosse League.

**Brand Identity:** Combine western/Calgary Stampede aesthetics with modern sports functionality. Balance bold western imagery with professional sports data presentation. The tournament tagline is "Only the best come to the west."

**Design Approach:** Mobile-first, data-driven design that prioritizes real-time information delivery. Use sports journalism conventions with chronological feeds, action-oriented headlines, and immediate access to game data. Implement progressive disclosure for complex information.

**Color Palette:**
- Primary: Rich Brown (#934F25), Dark Brown (#5E2713), Golden (#D6AC4D)
- Neutrals: Off-White (#FAFAFA), Charcoal (#263238), Black (#000000)
- System: Success Green (#2E7D32), Warning Amber (#F57C00), Error Red (#C62828), Live Blue (#2196F3), Penalty Orange (#FF5722)

**Typography:**
- Display Font: Tiffany Gothic CC for tournament wordmark and championship banners (maximum 2 uses per page)
- Body/UI: Geist Sans for all headings, body text, interface elements, and numbers
- Data: Use tabular-nums for statistics and scores to ensure consistent alignment
- Icons: Phosphorus Icons for all UI elements and interactive components

**Key Features to Include:**
- Real-time score updates with live indicators and pulsing animations
- Mobile-optimized touch interfaces for scoring and data entry
- Professional sports color coding (green=upcoming, blue=live, gray=completed)
- Team logo integration and customizable team colors
- Interactive tournament brackets and standings tables
- Comprehensive lacrosse statistics (goals, assists, saves, faceoffs, penalties)
- Touch-friendly admin interfaces inspired by GameSheet's professional system
- Western-themed imagery balanced with modern UI patterns
- High contrast for outdoor mobile viewing
- WCAG 2.1 AA accessibility compliance

**Component Patterns:** Use card-based layouts, sortable tables with performance indicators, sticky navigation, expandable accordions, modal overlays for data entry, progress indicators, countdown timers, and status badges.

**Responsive Design:** Prioritize mobile experience with thumb-friendly touch targets (minimum 44px), swipe gestures, and optimized data tables for small screens. Scale up gracefully for tablet and desktop views.

**Animation:** Subtle micro-animations for state changes, live badge pulsing (2s infinite), score update flashes, and card hover effects. Use 150ms-300ms transitions for smooth interactions.

Create functional, working interfaces rather than static mockups. Focus on lacrosse-specific functionality while maintaining the western brand identity throughout all interactions.

---

## Individual Screen Prompts

### 1. Homepage (/)

**Prompt:** Create a dynamic homepage for the Cowtown Showdown Senior Men's lacrosse tournament. Design a mobile-first landing page that serves as the tournament's command center during live games.

**Hero Section:** Full-width hero with tournament wordmark in Tiffany Gothic CC, subtitle "Senior Men's Box Lacrosse Tournament • July 12-14, 2024 • Calgary, Alberta" in Geist Sans. Include primary CTA "View Schedule" and secondary "Watch Live" buttons. Background should have western imagery with gradient overlay.

**Live Game Ticker:** Sticky horizontal scrolling ticker below hero showing active games with team logos, scores, period/time, and pulsing "LIVE" indicators. Include power play/penalty status icons. Cards should be touch-scrollable with pause-on-hover.

**Featured Content Grid:** 3-column layout (1 column mobile) with:
- YouTube live stream embed (if active)
- Next upcoming game card with team logos and countdown
- Latest news/announcement card

**Today's Games:** Section showing 6-8 game cards in grid layout. Each card displays game number, team logos, scheduled time or live score, venue, status badge, and action buttons. Include filter buttons for game status.

**Quick Stats Dashboard:** 4-column stats preview (2 columns mobile) showing:
- Top 3 scorers with photos, stats
- Top 3 goalies with save percentages
- Current standings (top 4 teams)
- Recent highlights carousel

**Instagram Feed:** 6-photo grid from tournament with "Follow @CowtownShowdown" CTA.

**Sponsor Banner:** Horizontal scrolling logos in grayscale with color-on-hover effect.

Use Phosphorus icons throughout for navigation, stats, and interactive elements. Implement real-time update indicators and ensure all touch targets meet 44px minimum.

### 2. Tournament Hub (/tournament)

**Prompt:** Design a comprehensive tournament hub page that serves as the central information portal. Create a dashboard-style layout with tabbed navigation and live game emphasis.

**Page Header:** Tournament title with tabbed navigation (Overview | Schedule | Standings | Bracket | Stats | Rules) using horizontal scroll on mobile.

**Live Games Section:** If games are active, show full-width live dashboard with 2-column grid (1 column mobile) of expanded game cards. Include shot counters, penalty timers, and recent events feed.

**Tournament Information Grid:** 2x2 grid (stacked mobile) of info cards:
- Tournament format explanation with visual diagram
- 5-point system breakdown with interactive calculator
- Prize pool information
- Key dates and times

**Today's Schedule:** Calendar-style view with time slots on Y-axis and games as colored blocks. Include referee assignments and venue info. Switch to list view on mobile.

**Standings Preview:** Compact standings table showing top 4 teams with playoff line indicator. Include "View Full Standings" CTA.

**Quick Action Grid:** 3x2 grid of action buttons:
- Download Schedule (PDF)
- Venue Directions
- Volunteer Information
- Tournament Rules
- Team Contacts
- Contact Organizers

Use card-based layouts with subtle shadows and hover effects. Include progress indicators for tournament completion and real-time update timestamps.

### 3. Schedule (/tournament/schedule)

**Prompt:** Create a comprehensive tournament schedule page with multiple viewing options. Design for both casual fans and team personnel who need detailed game information.

**View Toggle Bar:** Button group with icons for Calendar View, List View, and Team View. Include visual indicators for active view.

**Filter Section:** Horizontal filter bar with:
- Day badges (Day 1, 2, 3) with game counts
- Game type toggle (Pool Play, Medal Games)
- Team dropdown with logos
- Status filter badges (Scheduled, Live, Final)
- Search input for game numbers

**Calendar View:** 3-day grid layout with time slots every 30 minutes. Games displayed as colored blocks with team colors. Include live indicators and clickable game details popovers.

**List View:** Grouped by day with expandable game cards showing:
- Game number and type
- Team logos and names
- Scheduled time or current status
- Venue and rink information
- Referee assignments
- Previous head-to-head results
- YouTube stream link (if available)

**Team View:** Matrix layout with teams as rows and game times as columns. Highlight conflicts and back-to-back games.

**Export Actions:** Floating action buttons for:
- Download PDF schedule
- Add to calendar (iCal)
- Share schedule

Implement sticky headers, smooth scrolling, and touch-friendly interactions. Use skeleton loading states and progressive disclosure for detailed information.

### 4. Standings (/tournament/standings)

**Prompt:** Design a comprehensive standings page that clearly displays the complex 5-point tournament system. Create an engaging data visualization that works well on mobile.

**Main Standings Table:** Full-width table with sticky header and the following columns:
- Rank (with movement indicators)
- Team (logo, name, colors)
- GP (Games Played)
- W-L-T (Win-Loss-Tie record)
- PTS (Tournament Points - sortable)
- Period Record (expandable for P1-P2-P3 breakdown)
- GF-GA (Goals For/Against)
- DIFF (Goal Differential)
- AVG (Goal Average)
- L3 (Last 3 games form with W/L/T icons)

Include playoff line visual separator and clinched/eliminated badges. Make rows expandable on mobile for period details.

**Point System Explainer:** Interactive accordion showing:
- Visual breakdown of 5-point system
- Example calculation with real game data
- Period point allocation rules
- Maximum possible points (5 per game)

**Tiebreaker Rules:** Collapsible section with numbered list:
1. Head-to-head tournament points
2. Head-to-head goal average
3. Overall goal average
4. Least penalty minutes

**Live Scenarios:** (Days 2-3) Interactive cards showing:
- "If X wins..." projections
- Clinching scenarios
- Elimination possibilities
- Playoff positioning

**Column Customization:** Dropdown with checkboxes to show/hide optional columns (saves to local storage).

Use tabular-nums for all statistics, team color accents, and smooth sorting animations. Include loading states and real-time updates.

### 5. Teams Hub (/teams)

**Prompt:** Create a visually striking teams showcase page that highlights all 8 tournament teams. Design for team discovery and comparison with western theme integration.

**Page Header:** "Tournament Teams" title with "8 Elite Senior Men's Teams" subtitle. Include tournament logo integration.

**Team Showcase Grid:** 2x4 grid (2x4 tablet, 1x8 mobile) of team cards featuring:
- Large team logo (120px)
- Team name in bold
- City, Province location
- Team color swatch accent border
- Captain name with badge
- Quick stats: current rank, record, points, top scorer
- Hover effect revealing full team colors

**Filter Bar:** Sticky filter section with:
- Sort dropdown (Standings, Alphabetical, Province)
- Team search with autocomplete
- Reset filters button

**Team Comparison Tool:** (Optional) Select 2 teams to compare with head-to-head stats, common opponents, and historical data.

Use card hover effects with subtle scaling and shadow changes. Implement staggered loading animations and team color theming throughout. Include skeleton states for loading.

### 6. Team Profile (/teams/[slug])

**Prompt:** Design a comprehensive team profile page that serves as the definitive source for team information. Create a hero section with team branding and tabbed content organization.

**Team Header:** Full-width hero section with:
- Team color gradient background
- Large team logo (200px desktop, 120px mobile)
- Team name in large text with team color accents
- City, Province information
- Current standing badge
- Captain information in expandable card
- Team color swatches prominently displayed

**Tab Navigation:** Horizontal scrolling tabs:
- Overview | Roster | Schedule | Stats | Media

**Overview Tab:** 2-column layout (stacked mobile) with:
- Team bio and description
- Team photo gallery (3-4 images)
- "Players to Watch" feature cards (top 3)
- Tournament history table
- Social media links

**Roster Tab:** 
- Player rows grouped by position
- Jersey number, name (clickable), position badge, handedness
- Key stats (G, A, PTS, PIM)
- Coaching staff section
- Sortable by various criteria

**Schedule Tab:**
- All 5 tournament games with results
- Period score breakdowns for completed games
- Head-to-head record summary
- Filter for completed/upcoming

**Stats Tab:**
- Team statistics dashboard
- Comparison vs tournament average
- Full player stats table
- Visual stat bars and charts

**Media Tab:**
- Photo gallery grid
- Video highlights reel
- Team-specific content

Use team colors as accent throughout, implement smooth tab transitions, and include responsive data tables.

### 7. Games Hub (/games)

**Prompt:** Create a comprehensive games listing page that serves as the central hub for all tournament games. Prioritize live games and provide powerful filtering options.

**Live Games Section:** (Conditional) Full-width prominence section with:
- Large expanded game cards
- Live stat comparison bars
- Period countdown timers
- Recent events ticker
- Shot counters and penalty status

**Filter Bar:** Sticky filter section with:
- Status badges (All, Live, Final, Upcoming) with game counts
- Day dropdown (Day 1, 2, 3)
- Team filter with autocomplete search
- Game number search input

**Games Grid:** 3-column layout (2 tablet, 1 mobile) of game cards featuring:
- Game number and type
- Team logos with color accents
- Score or scheduled time
- Status indicator (live pulse, final badge)
- Venue information
- Three stars for final games
- Expandable box score preview

**Load More/Pagination:** Progressive loading with "Load More" button or infinite scroll. Show 12 games per page.

**Empty States:** Appropriate messaging for "No live games" or "No results found" scenarios.

Use live indicators with pulsing animations, team color integration, and smooth loading states. Implement touch-friendly card interactions and real-time updates.

### 8. Game Detail (/games/[id])

**Prompt:** Design a comprehensive individual game page that serves as the definitive source for game information. Create a live-updating interface for active games and detailed historical view for completed games.

**Game Header:** Enhanced scoreboard section with:
- Large team logos (100px)
- Prominent score display with team colors
- Live indicator or final status
- Period and time remaining
- Venue and game information
- Team color accents throughout

**Live Stream Section:** (Conditional) YouTube embed with:
- 16:9 responsive player
- Fullscreen capability
- "Watch on YouTube" external link
- No chat/comments display

**Tab Navigation:** 
- Box Score | Timeline | Stats | Media
- Default to Box Score for final games, Timeline for live

**Box Score Tab:**
- Period score breakdown (expandable)
- Goals with time, scorer, assists
- Penalty summary by period
- Three stars display (final games)
- Goalie statistics comparison

**Timeline Tab:**
- Real-time chronological events
- Filter by event type (goals, penalties, faceoffs)
- Period dividers and markers
- Jump to period functionality

**Stats Tab:**
- Team comparison dashboard
- Shot chart visualization
- Faceoff percentages by period
- Individual player statistics tables
- Special teams efficiency

**Media Tab:**
- Game-specific video highlights
- Photo gallery
- Social media embeds
- Share functionality

Implement real-time updates for live games, smooth tab transitions, and comprehensive data visualization. Use team colors as accents and include loading states.

### 9. Live Games Dashboard (/games/live)

**Prompt:** Create a full-screen live games dashboard optimized for displaying multiple simultaneous games. Design for tournament officials, media, and dedicated fans who want comprehensive real-time information.

**Dashboard Header:** 
- "Live Games" title with current time
- Connection status indicator
- Auto-refresh toggle
- Fullscreen mode button

**Multi-Game Grid:** Responsive grid of live game cards (2x2 desktop, 1x4 mobile) featuring:
- Larger cards than standard game cards
- Real-time score updates with flash animations
- Shot counters for each team
- Penalty status and timers
- Key events feed (last 3 events)
- Period time with countdown
- Live streaming indicator

**Game Priority:** 
- Automatically prioritize closest games
- Medal games get prominence
- Recently updated games move to top

**Interaction Features:**
- Click card to expand full details
- Swipe actions on mobile
- Keyboard shortcuts for navigation
- Sound notifications toggle

**Real-time Features:**
- Auto-refresh every second
- Connection status monitoring
- Offline mode with cached data
- Update conflict resolution

**Empty State:** 
- "No games currently live" message
- Next scheduled game information
- Link to full schedule

Use prominent live indicators, smooth animations for updates, and ensure optimal performance for real-time data. Include connection status indicators and offline capabilities.

### 10. Scorekeeper Dashboard (/scorekeeper)

**Prompt:** Design a professional scorekeeper dashboard optimized for tablet use. Create a game management interface that allows scorekeepers to claim games and access their assigned contests.

**Session Header:**
- Scorekeeper name and role
- Session timer countdown
- Connection status indicator
- Logout button

**Games Grid:** Card-based layout grouped by day with:
- Game number and type
- Team logos and names
- Scheduled time or current status
- Venue and rink information
- Claim/Release buttons
- "Currently Scoring" indicator
- Quick stats overview

**Game States:**
- Available (green border)
- Claimed by user (blue border)
- Claimed by others (gray, disabled)
- In progress (orange border)
- Completed (muted colors)

**Quick Actions:**
- Claim multiple games
- View game details
- Download game sheets
- Contact tournament desk

**Filters:**
- My Games toggle
- By day selection
- By status
- Search by team

**Responsive Design:** Optimize for tablet portrait mode with:
- Large touch targets (minimum 44px)
- Thumb-friendly button placement
- Swipe gestures for actions
- Haptic feedback on interactions

Use clear visual hierarchy, professional color coding, and ensure all interactions are touch-optimized. Include loading states and error handling.

### 11. Game Scoring Interface (/scorekeeper/game/[id])

**Prompt:** Create a comprehensive game scoring interface optimized for tablet use during live games. Design for speed, accuracy, and minimal errors during high-pressure situations.

**Fixed Header:**
- Team logos and names with colors
- Live score display (large, prominent)
- Period indicator
- Game timer with start/stop controls
- Back to dashboard button

**Main Interface:** Full-screen layout with:
- Large stat entry buttons (60x60px minimum)
- Goal, Assist, Penalty, Shot, Faceoff, Loose Ball
- Player selection modal with search
- Team roster quick access
- Undo/Redo buttons prominently placed

**Game Event Log:** Scrollable sidebar showing:
- Chronological event history
- Edit/delete capabilities
- Period markers
- Time stamps

**Period Management:**
- Start/End period buttons
- Intermission timer
- Period score summary
- Goalie change tracking

**Player Selection Modal:**
- Large player photos/silhouettes
- Jersey numbers prominently displayed
- Position filtering
- Search functionality
- Recent players shortcut

**Three Stars Selection:** Post-game modal with:
- Player selection dropdowns
- Auto-suggestions based on performance
- Confirmation before submission

**Penalty Dialog:** Specialized modal with:
- RMLL penalty types
- Duration selection
- Penalty time tracking
- Player and team selection

**Error Handling:**
- Clear error messages
- Retry mechanisms
- Offline queue for actions
- Conflict resolution

Design for portrait tablet orientation with large touch targets, clear visual feedback, and professional appearance. Include haptic feedback and audio confirmations.

### 12. Login Page (/admin/login)

**Prompt:** Create a professional login page for tournament staff and scorekeepers. Design a secure, accessible interface with western theme integration.

**Page Layout:**
- Centered login form
- Tournament branding with Tiffany Gothic CC wordmark
- Western imagery background with overlay
- Responsive design for all devices

**Login Form:**
- Email/username input
- Password input with show/hide toggle
- Remember me checkbox
- Login button with loading state
- "Forgot Password?" link

**Visual Elements:**
- Tournament logo prominently displayed
- Subtle western textures
- Professional color scheme
- Clear typography hierarchy

**Security Features:**
- Input validation
- Error message display
- Rate limiting indicators
- Secure connection badge

**Role-Based Messaging:**
- Different welcome messages for roles
- Appropriate redirects after login
- Clear role identification

**Accessibility:**
- Keyboard navigation support
- Screen reader compatibility
- High contrast options
- Focus indicators

**Mobile Optimization:**
- Touch-friendly inputs
- Proper viewport settings
- Keyboard type optimization
- Thumb-friendly button placement

Use professional styling with western accents, ensure security best practices, and provide clear user feedback throughout the authentication process.

### 13. Media Gallery (/media)

**Prompt:** Create a comprehensive media gallery showcasing tournament photos, videos, and highlights. Design for both casual browsing and media personnel needs.

**Gallery Navigation:**
- Filter tabs: All | Photos | Videos | Highlights
- Day filter dropdown
- Team filter with logos
- Search functionality

**Photo Gallery:**
- Masonry grid layout
- Lightbox viewing with navigation
- Download options for media
- Photographer credits
- Lazy loading implementation

**Video Section:**
- YouTube embed grid
- Thumbnail previews
- Play counts and timestamps
- Category filtering
- Share functionality

**Highlights Reel:**
- Curated tournament moments
- Auto-playing carousel
- Social media integration
- Embed codes for sharing

**Features:**
- Infinite scroll or pagination
- Favorite/bookmark system
- Social sharing buttons
- Full-screen viewing
- Mobile swipe gestures

**Media Upload:** (Admin only)
- Drag-and-drop interface
- Batch upload capabilities
- Automatic tagging
- Progress indicators

Use responsive grid layouts, smooth lightbox transitions, and optimize for various media types. Include loading states and ensure mobile-friendly interactions.

### 14. Player Profile (/players/[id])

**Prompt:** Create an individual player profile page showcasing comprehensive tournament statistics and information. Design for both fans and media personnel.

**Player Header:**
- Large player photo or silhouette
- Player name and jersey number
- Team logo and colors
- Position and handedness
- Tournament ranking badges

**Stats Summary:**
- Tournament totals (goals, assists, points)
- Per-game averages
- League ranking indicators
- Performance badges

**Game Log:**
- Game-by-game statistics table
- Sortable columns
- Team logos and opponents
- Performance highlights

**Career Information:**
- Previous tournament participation
- Awards and recognition
- Bio information (if available)
- Social media links

**Performance Charts:**
- Statistics visualization
- Trend analysis
- Comparison to position average
- Game-by-game performance

**Media Section:**
- Player photos from tournament
- Video highlights
- Interview content
- Social media posts

**Responsive Design:**
- Mobile-optimized stats tables
- Touch-friendly navigation
- Swipe gestures for content
- Collapsible sections

Use player's team colors as accents, implement smooth data visualization, and ensure comprehensive statistics display. Include comparison features and social sharing capabilities.

---

## Usage Instructions

1. **Copy the Default Style Guide** and paste it at the beginning of each Magic Patterns session
2. **Select the appropriate screen prompt** based on what you're designing
3. **Customize the prompt** with specific content or requirements for your use case
4. **Use the components and patterns** mentioned in the Cowtown UI Design Bible
5. **Ensure consistency** across all screens by referencing the established design system

## Important Notes

- All prompts assume mobile-first design approach
- Phosphorus icons should be used consistently throughout
- Team colors should be integrated as accents where appropriate
- Real-time features should include appropriate loading and error states
- Accessibility requirements (WCAG 2.1 AA) should be maintained
- Touch targets should be minimum 44px for mobile interfaces