# Magic Patterns Component Prompts - Cowtown Showdown

## Base Style Guide (Use with every component prompt)

You are designing components for the Cowtown Showdown Senior Men's lacrosse tournament website. Use this style guide for all components:

**Typography:**
- Display Font: Tiffany Gothic CC (tournament wordmark only, maximum 1-2 uses)
- Body/UI: Geist Sans for all headings, body text, interface elements
- Icons: Phosphorus Icons for all UI elements
- Data: Use tabular-nums for statistics and scores

**Color Palette:**
- Primary: Rich Brown (#934F25), Dark Brown (#5E2713), Golden (#D6AC4D)
- System: Success Green (#2E7D32), Warning Amber (#F57C00), Error Red (#C62828), Live Blue (#2196F3), Penalty Orange (#FF5722)
- Neutrals: Off-White (#FAFAFA), Charcoal (#263238), Black (#000000)

**Design Principles:**
- Mobile-first with 44px minimum touch targets
- Card-based layouts with subtle shadows
- Team color integration as accents
- Western theme through selective use of display font and colors
- Real-time indicators with pulsing animations
- WCAG 2.1 AA accessibility compliance

---

## ATOMS

### Button Component

**Prompt:** Create a comprehensive button component system for the Cowtown Showdown lacrosse tournament. Design buttons that work across all tournament interfaces from public website to scorekeeper tools.

**Variants Required:**
- **Primary**: Rich brown (#934F25) background, white text, for main actions
- **Secondary**: Outline style with brown border, brown text on white background
- **Destructive**: Error red background for delete/cancel actions
- **Ghost**: Transparent with hover background, subtle interaction
- **Link**: Text-only styling that looks like a link

**Sizes Required:**
- **Small (sm)**: 36px height, 12px text, compact spacing
- **Default**: 40px height, 14px text, standard padding
- **Large (lg)**: 44px height, 16px text, generous padding for mobile
- **Icon**: 40x40px square for icon-only buttons

**States to Include:**
- Normal state with proper contrast
- Hover with color transition and subtle scale
- Active with pressed appearance (scale 0.95)
- Disabled with reduced opacity and no interaction
- Loading with spinner and disabled state

**Features:**
- Ripple effect animation on click
- Phosphorus icons integration
- Consistent border radius (4px)
- Touch-friendly sizing for mobile
- Focus indicators for accessibility

**Use Cases:** Form submissions, navigation, game actions, scorekeeper controls, media interactions.

### Input Component

**Prompt:** Design a versatile input component system for tournament data entry, search, and forms. Optimize for both desktop administration and mobile scorekeeper use.

**Types Required:**
- **Text**: Standard text entry with placeholder
- **Email**: Email validation styling
- **Number**: Numeric input with proper keyboard on mobile
- **Password**: With show/hide toggle button
- **Search**: With search icon and clear button

**Features:**
- **Height**: Consistent 40px for touch-friendly interaction
- **Floating Labels**: Animate label above input on focus/content
- **Clear Button**: X icon for search and long text inputs
- **Icons**: Phosphorus icons for input types (search, email, etc.)
- **Validation States**: Success, error, and warning styling

**States:**
- Normal with subtle border
- Focus with primary color border and glow
- Error with red border and error message
- Disabled with reduced opacity
- Filled with content styling

**Mobile Optimizations:**
- Proper input types to trigger correct keyboards
- Adequate spacing for thumb interaction
- Auto-zoom prevention with proper font sizing

**Accessibility:**
- Proper labels and ARIA attributes
- High contrast ratios
- Focus indicators
- Error message association

### Badge Component

**Prompt:** Create a comprehensive badge system for tournament status indicators, team identification, and data categorization. Design for both informational and interactive use cases.

**Variants Required:**
- **Default**: Neutral gray background for general information
- **Secondary**: Light background variant
- **Destructive**: Red background for warnings/errors
- **Outline**: Border-only style for subtle emphasis
- **Live**: Animated green badge with pulsing dot for live games
- **Power-Play**: Blue background for power play indicators
- **Penalty-Kill**: Orange background for penalty situations

**Sizes:**
- **Small**: 20px height, 12px text, tight padding
- **Default**: 24px height, 14px text, standard padding

**Special Badges:**
- **Live Badge**: Green background with pulsing dot animation and "LIVE" text
- **Team Badges**: Integration with team colors as background
- **Status Badges**: Scheduled (gray), Live (green), Final (dark gray), Overtime (orange)
- **Position Badges**: Different colors for player positions (offense, defense, goalie)

**Features:**
- Rounded corners (full border radius)
- Consistent text styling with medium weight
- Icon integration (Phosphorus icons)
- Animation support for live indicators
- Team color theming capability

**Usage:** Game status, player positions, live indicators, team identification, content categorization.

### LiveIndicator Component

**Prompt:** Design a distinctive live indicator component that clearly communicates real-time status across the tournament website. Make it attention-grabbing but not distracting.

**Design Requirements:**
- **Size**: 8px dot with 16px pulse area for proper touch target
- **Colors**: Green (#00FF00) for live games, Orange for intermission, Gray for offline
- **Animation**: 2-second infinite pulse (opacity 0.4 to 1.0)
- **Positioning**: Flexible placement (inline, absolute, or floating)

**Variants:**
- **Dot Only**: Simple pulsing dot
- **With Text**: Dot + "LIVE" text combination
- **Large**: Bigger version for prominent placement
- **Subtle**: Reduced animation for less prominent areas

**States:**
- **Live**: Bright green with pulse animation
- **Intermission**: Orange with slower pulse
- **Pre-Game**: Yellow with gentle fade
- **Offline**: Static gray dot
- **Error**: Red with fast pulse

**Implementation Notes:**
- Use CSS animations for smooth performance
- Include "sr-only" text for screen readers
- Pause animation on hover for accessibility
- Ensure sufficient contrast ratios

### CountdownTimer Component

**Prompt:** Create a versatile countdown timer component for various tournament timing needs. Design for both large display and compact inline use.

**Format Options:**
- **MM:SS**: Standard minutes and seconds
- **HH:MM:SS**: For longer countdowns (tournament start)
- **SS**: Seconds only for shot clocks

**Sizes:**
- **Large**: 32px text for main timers (game periods)
- **Medium**: 20px text for countdown displays
- **Small**: 16px text for inline use

**Features:**
- **Font**: Geist Sans with tabular-nums for consistent spacing
- **Color Logic**: Inherit color, red when < 2:00 remaining
- **Animations**: Smooth countdown with second transitions
- **States**: Running, paused, expired, warning

**Additional Features:**
- Pause indicator (pause icon overlay)
- Expiry flash animation
- Audio alert capability (optional)
- Fullscreen mode for main game timer

**Use Cases:** Period timers, shot clocks, penalty timers, tournament countdown, warmup timers.

### TeamColorSwatch Component

**Prompt:** Design a team color swatch component that displays team colors in various contexts throughout the tournament site. Support both primary/secondary color combinations and single color displays.

**Sizes:**
- **Small**: 24x24px for inline use
- **Default**: 32x32px for standard display
- **Large**: 48x48px for prominent placement

**Display Options:**
- **Split**: Primary/secondary colors divided diagonally or vertically
- **Gradient**: Smooth gradient from primary to secondary
- **Single**: Primary color only
- **Border**: White 1px border for contrast on light backgrounds

**Interactive States:**
- **Normal**: Standard display
- **Hover**: Scale 1.1 with subtle shadow
- **Active**: Slight press effect
- **Disabled**: Reduced opacity

**Team Integration:**
- Dynamic color application via CSS variables
- Support for all 8 tournament teams
- Fallback colors for missing team data
- Accessibility considerations for color-blind users

**Usage:** Team identification, color coding, visual team association, navigation accents.

### StatNumber Component

**Prompt:** Create a statistical number display component optimized for tournament data. Design for clear readability and consistent alignment across tables and cards.

**Sizes Required:**
- **XS**: 14px for compact tables
- **Small**: 18px for secondary stats
- **Medium**: 24px for primary stats
- **Large**: 32px for featured numbers
- **XL**: 48px for prominent scores

**Features:**
- **Font**: Geist Sans with tabular-nums for perfect alignment
- **Colors**: Default, positive (green), negative (red), neutral
- **Trends**: Optional arrow indicators for up/down trends
- **Animation**: Number change animation with brief highlight

**Variants:**
- **Default**: Standard black text
- **Highlighted**: Emphasized styling for leaders
- **Muted**: Reduced opacity for secondary importance
- **Colored**: Success/warning/error color coding

**Special Features:**
- Change animation (flash background on update)
- Trend arrows (up/down indicators)
- Percentage formatting
- Large number abbreviation (1.2K, 15.3K)
- Loading skeleton state

**Usage:** Scoreboards, statistics tables, player stats, team comparisons, standings.

### SocialIcon Component

**Prompt:** Design a social media icon component system for tournament social integration and sharing. Support major platforms with consistent styling and hover effects.

**Platforms Required:**
- **Twitter/X**: Official tournament updates
- **Instagram**: Photo and video content
- **YouTube**: Live streams and highlights
- **Facebook**: Community engagement
- **TikTok**: Short-form content

**Sizes:**
- **Default**: 24x24px for standard use
- **Footer**: 32x32px for footer placement
- **Large**: 40x40px for prominent social sections

**States:**
- **Default**: Grayscale (#666666) for subtle appearance
- **Hover**: Full brand color with 200ms transition
- **Active**: Slight scale down (0.95)
- **Disabled**: Very light gray with no interaction

**Features:**
- Phosphorus Icons for consistent icon style
- Brand color integration on hover
- Smooth transitions
- Touch-friendly sizing
- External link indication

**Usage:** Footer links, sharing buttons, social media integration, content attribution.

---

## MOLECULES

### GameCard Component

**Prompt:** Create a comprehensive game card component that adapts to different contexts throughout the tournament website. Design for both list views and grid layouts with full responsiveness.

**Card Variants:**
- **Compact**: Small version for tickers and dense lists
- **Standard**: Default size for game grids
- **Expanded**: Large version with detailed information
- **Live**: Enhanced version with real-time updates

**Content Elements:**
- **Game Header**: Game number, type (Pool/Medal), day indicator
- **Team Section**: Team logos (60px), names, colors as accents
- **Score Display**: Large numbers with tabular-nums, live updates
- **Status**: Badge showing scheduled/live/final with appropriate colors
- **Timing**: Period, time remaining, or scheduled time
- **Venue**: Rink information and location
- **Actions**: Watch button, stats link, share options

**States:**
- **Scheduled**: Gray color scheme, countdown timer
- **Live**: Green accent border, pulsing live indicator, real-time score
- **Intermission**: Orange accent, intermission badge
- **Final**: Muted colors, three stars display, final score
- **Overtime**: Special overtime indicator and styling

**Interactive Features:**
- Hover effect with scale and shadow
- Expandable sections for detailed stats
- Click to navigate to game detail
- Swipe actions on mobile (stats/media)
- Team color integration

**Mobile Optimizations:**
- Single column layout
- Reduced information density
- Touch-friendly buttons
- Swipe gesture support

**Real-time Features:**
- Score flash animation on updates
- Live indicator pulse
- Connection status display
- Optimistic updates

### LiveGameTicker Component

**Prompt:** Design a horizontal scrolling ticker component for displaying multiple live games simultaneously. Optimize for continuous viewing and real-time updates.

**Layout:**
- **Height**: 80px desktop, 100px mobile
- **Scroll**: Horizontal momentum scrolling
- **Cards**: Compact game information cards
- **Spacing**: Consistent gaps between cards

**Content per Card:**
- Team logos (40px)
- Current score (large, tabular-nums)
- Period and time
- Live indicator with pulse
- Power play/penalty status icons

**Features:**
- **Auto-scroll**: Continuous scrolling with pause on hover
- **Manual Control**: Scroll arrows for navigation
- **Keyboard Support**: Arrow key navigation
- **Touch Gestures**: Swipe scrolling with momentum
- **Real-time Updates**: Smooth animation for score changes

**Responsive Behavior:**
- Desktop: Multiple games visible, smaller cards
- Mobile: Single game focus with horizontal swipe
- Tablet: Hybrid approach with 2-3 visible games

**Performance:**
- Virtual scrolling for many games
- Efficient re-rendering
- Smooth 60fps scrolling
- Connection state management

**Empty States:**
- "No live games" message
- Next scheduled game preview
- Link to full schedule

### TeamCard Component

**Prompt:** Create a comprehensive team card component for showcasing tournament teams. Design for both grid displays and individual team highlighting.

**Sizes:**
- **Grid**: 280x340px desktop, full-width mobile
- **Compact**: Smaller version for quick reference
- **Featured**: Larger prominent display

**Content Structure:**
- **Header**: Large team logo (120px), team color background
- **Team Info**: Team name (H3), city/province, established year
- **Captain Info**: Captain name with contact badge (expandable)
- **Quick Stats**: Current rank, record (W-L-T), tournament points, top scorer
- **Color Accent**: Team color swatch and border integration

**Interactive States:**
- **Normal**: Standard card appearance
- **Hover**: Scale transform, reveal full team colors, shadow increase
- **Loading**: Skeleton placeholder with team logo area
- **Selected**: Active state for team comparison tools

**Features:**
- Team color theming throughout card
- Expandable captain information
- Click navigation to team profile
- Hover animations with team color reveal
- Loading states with skeleton screens

**Data Display:**
- Current standing with rank badge
- Win-loss-tie record
- Tournament points (large number)
- Top scorer with stats
- Team colors prominently displayed

### PlayerSelectDialog Component

**Prompt:** Design a player selection modal optimized for fast player lookup during live game scoring. Prioritize speed and accuracy for scorekeeper use.

**Modal Specifications:**
- **Size**: 90% width mobile, 600px max desktop
- **Layout**: Grid view and list view toggle
- **Height**: Responsive, max 80vh with scroll

**Search Features:**
- **Search Bar**: Instant search by name or jersey number
- **Filters**: Position filter (All, Offense, Defense, Goalie)
- **Recent Players**: Quick access to recently selected players
- **Team Toggle**: Switch between home/away teams

**Player Display:**
- **Photo**: Player photo or silhouette placeholder
- **Jersey Number**: Large, prominent display
- **Name**: First and last name, clear typography
- **Position**: Position badge with color coding
- **Handedness**: Icon indicator (L/R)

**Interaction:**
- **Touch Targets**: Minimum 44px height for mobile
- **Keyboard Navigation**: Arrow keys, enter to select, escape to close
- **Quick Select**: Number key shortcuts (press jersey number)
- **Recent History**: Smart suggestions based on game context

**Mobile Optimizations:**
- Full-screen takeover on mobile
- Large touch targets
- Swipe gestures for navigation
- Haptic feedback on selection

### StatComparison Component

**Prompt:** Create a visual statistics comparison component for displaying head-to-head team or player statistics. Design for clear data visualization and easy comparison.

**Layout Options:**
- **Side-by-Side**: Horizontal bars or numbers
- **Stacked**: Vertical layout for mobile
- **Centered**: Comparison with center divider

**Visual Elements:**
- **Labels**: Clear category names (Goals, Shots, Faceoffs)
- **Values**: Large numbers with tabular-nums
- **Bars**: Visual bars showing relative performance
- **Colors**: Winner in bold/highlighted, loser muted
- **Indicators**: Icons or symbols for each category

**Categories:**
- **Offensive**: Goals, assists, shots, shooting %
- **Defensive**: Saves, blocks, steals, penalties
- **Special Teams**: Power play %, penalty kill %
- **Possession**: Faceoff %, loose balls, turnovers

**Animations:**
- **Load Animation**: Bars fill from 0 to final value
- **Update Animation**: Smooth transitions on data change
- **Highlight**: Brief flash on significant changes

**Responsive Design:**
- Desktop: Side-by-side with visual bars
- Mobile: Stacked layout with compact numbers
- Tablet: Hybrid approach based on available space

### NavigationDropdown Component

**Prompt:** Design a sophisticated dropdown navigation component for complex tournament navigation. Support both hover (desktop) and click (mobile) interactions.

**Trigger Options:**
- **Hover**: Desktop activation on mouse enter
- **Click**: Mobile and accessible activation
- **Focus**: Keyboard navigation support
- **Touch**: Touch-friendly mobile interaction

**Content Structure:**
- **Multi-Column**: Organize content in logical columns
- **Sections**: Group related navigation items
- **Icons**: Phosphorus icons for visual hierarchy
- **Descriptions**: Brief descriptions for major sections

**Animation:**
- **Entry**: Fade + slide down (200ms ease-out)
- **Exit**: Fade + slide up (150ms ease-in)
- **Stagger**: Subtle stagger for multi-column content

**Sections for Tournament:**
- **Games**: Live games, schedule, results
- **Teams**: Team profiles, rosters, standings
- **Stats**: Player stats, team stats, leaders
- **Media**: Photos, videos, highlights

**Mobile Behavior:**
- Full-width dropdown
- Touch-friendly spacing
- Clear close button
- Scroll support for long content

**Accessibility:**
- Keyboard navigation (tab, arrow keys)
- Escape key to close
- Screen reader support
- Focus management

### PeriodScoreBreakdown Component

**Prompt:** Create a period-by-period score breakdown component for detailed game analysis. Support expandable details and responsive design.

**Layout:**
- **Horizontal Periods**: P1, P2, P3, OT (if applicable)
- **Team Rows**: Home and away team scores per period
- **Totals**: Final score prominently displayed
- **Visual Hierarchy**: Period winners highlighted

**Content Elements:**
- **Period Headers**: P1, P2, P3, OT with time indicators
- **Scores**: Large numbers per period with team colors
- **Winners**: Highlight period winners with bold text/color
- **Totals**: Final scores in larger, prominent display

**Expandable Details:**
- **Goals**: Click period to see goals scored
- **Time Stamps**: When goals were scored in period
- **Scorers**: Player names and assist information
- **Penalties**: Major penalties in each period

**Team Color Integration:**
- Team color accents for scores
- Winner highlighting with team colors
- Subtle background color for team rows

**Mobile Adaptations:**
- Swipeable if too wide for screen
- Collapsible details for space saving
- Touch-friendly expansion controls

**States:**
- **In Progress**: Current period highlighted
- **Completed**: All periods filled
- **Live**: Real-time updates with animations

---

## ORGANISMS

### LiveDashboard Component

**Prompt:** Design a comprehensive live games dashboard for displaying multiple simultaneous games with real-time updates. Optimize for tournament officials and dedicated fans.

**Layout Structure:**
- **Grid**: 2x2 desktop, single column mobile
- **Priority**: Closest games and medal games first
- **Spacing**: Adequate gaps for clear separation
- **Responsive**: Adapts to screen size and game count

**Game Card Features:**
- **Larger Format**: More detailed than standard game cards
- **Score Emphasis**: Large, prominent score display
- **Shot Counters**: Shots on goal for each team
- **Penalty Status**: Current penalties and timers
- **Events Feed**: Last 3-5 game events
- **Period Timer**: Countdown with warning colors

**Real-time Elements:**
- **Auto-refresh**: Every second for live data
- **Connection Status**: Online/offline indicator
- **Update Animations**: Flash on score changes
- **Priority Sorting**: Recently updated games move up

**Interactive Features:**
- **Expand Details**: Click for full game information
- **Swipe Actions**: Mobile gestures for quick actions
- **Keyboard Shortcuts**: Quick navigation between games
- **Fullscreen Mode**: Focus on single game

**Empty States:**
- **No Live Games**: Clear message with next game info
- **Connection Error**: Retry mechanism and offline mode
- **Loading**: Skeleton screens for each game slot

### StandingsTable Component

**Prompt:** Create a comprehensive tournament standings table that clearly displays the complex 5-point system. Ensure mobile responsiveness and sortable functionality.

**Table Structure:**
- **Sticky Header**: Always visible column headers
- **Frozen Columns**: Rank and team name frozen on mobile scroll
- **Sortable Columns**: Click headers to sort by any metric
- **Expandable Rows**: Period details on mobile

**Columns Required:**
- **Rank**: Position with movement indicators (↑↓)
- **Team**: Logo, name, and team colors
- **GP**: Games played
- **Record**: W-L-T format
- **PTS**: Tournament points (sortable, default)
- **Period Record**: Expandable P1-P2-P3 breakdown
- **Goals**: For/against with difference
- **Average**: Goal average calculation
- **Form**: Last 3 games (W/L/T indicators)

**Visual Elements:**
- **Playoff Line**: Visual separator for medal game positions
- **Team Colors**: Subtle integration throughout row
- **Badges**: Clinched, eliminated, or qualified indicators
- **Highlighting**: User's favorite team or current leaders

**Interactive Features:**
- **Row Hover**: Highlight entire row on hover
- **Expandable**: Click row for detailed period breakdown
- **Sorting**: Animated column sorting
- **Column Toggle**: Show/hide optional columns

**Mobile Optimizations:**
- **Horizontal Scroll**: With frozen rank/team columns
- **Simplified View**: Core columns only with expand option
- **Touch Sorting**: Large, touch-friendly sort controls

### TeamShowcase Component

**Prompt:** Design a dynamic team showcase component that displays all 8 tournament teams in an engaging grid layout. Include filtering, searching, and comparison features.

**Grid Layout:**
- **Desktop**: 2x4 grid with equal spacing
- **Tablet**: 2x4 maintained or 4x2 based on orientation
- **Mobile**: Single column with full-width cards

**Team Card Integration:**
- Use TeamCard component as base
- Consistent sizing and spacing
- Hover effects with team color reveals
- Click navigation to team profiles

**Filter and Search:**
- **Sort Options**: Standings, alphabetical, province
- **Search Bar**: Real-time search by team name or city
- **Reset Button**: Clear all filters quickly
- **Active Filters**: Visual indication of applied filters

**Animation Features:**
- **Staggered Load**: Cards appear with sequential delay
- **Filter Animation**: Smooth transitions when filtering
- **Hover States**: Coordinated hover effects
- **Loading States**: Skeleton screens for each position

**Team Comparison Tool:**
- **Selection Mode**: Click to select teams for comparison
- **Compare Button**: Appears when 2 teams selected
- **Head-to-Head**: Display comparison statistics
- **Common Opponents**: Show mutual game results

**Performance:**
- **Virtual Grid**: For large team lists (future expansion)
- **Optimized Images**: Lazy loading for team logos
- **Smooth Scrolling**: 60fps grid interactions

### HeroSlider Component

**Prompt:** Create a prominent hero slider component for the tournament homepage. Feature tournament branding, key announcements, and call-to-action elements.

**Slider Specifications:**
- **Desktop**: 500px height, full-width
- **Mobile**: 350px height, optimized for portrait
- **Slides**: 3-5 slides maximum for performance
- **Auto-advance**: 5-second intervals with pause on hover

**Slide Content Types:**
- **Tournament Branding**: Wordmark, dates, location
- **Featured Games**: Upcoming or live game highlights
- **News/Announcements**: Important tournament updates
- **Highlights**: Video thumbnails or photo galleries

**Interactive Controls:**
- **Dots**: Page indicators with click navigation
- **Arrows**: Previous/next navigation
- **Keyboard**: Arrow key support
- **Touch**: Swipe gestures on mobile
- **Auto-pause**: Stop on user interaction

**Visual Features:**
- **Gradient Overlay**: Dark gradient for text readability
- **Parallax Effect**: Subtle background movement
- **Video Support**: Background video capability
- **Lazy Loading**: Load slides as needed

**Content Elements:**
- **Primary Text**: Tournament wordmark in Tiffany Gothic CC
- **Secondary Text**: Dates, location, description
- **CTAs**: Primary and secondary action buttons
- **Media**: Background images or videos

**Accessibility:**
- **Reduced Motion**: Respect user preferences
- **Focus Management**: Proper keyboard navigation
- **Screen Readers**: Alternative content for images
- **Color Contrast**: Ensure text readability

### ScheduleCalendar Component

**Prompt:** Design a comprehensive schedule calendar component with multiple view modes. Support day, tournament, and list views with filtering capabilities.

**View Modes:**
- **Day View**: Single day with time slots
- **Tournament View**: 3-day overview
- **List View**: Chronological game listing
- **Team View**: Matrix of teams vs. time slots

**Calendar Features:**
- **Time Slots**: 30-minute increments, 8 AM to 10 PM
- **Game Blocks**: Colored blocks representing games
- **Team Colors**: Game blocks use team color combinations
- **Duration**: Visual representation of game length
- **Conflicts**: Clear indication of scheduling conflicts

**Interactive Elements:**
- **Click Games**: Popover with game details
- **Hover Details**: Quick game information
- **Navigate Days**: Previous/next day controls
- **Time Navigation**: Jump to specific times
- **Filter Options**: By team, game type, status

**Game Block Content:**
- **Teams**: Abbreviated team names or logos
- **Time**: Start time clearly displayed
- **Venue**: Rink information
- **Status**: Live indicator or final score
- **Game Number**: Reference number

**Mobile Adaptations:**
- **Agenda View**: List-style for better mobile UX
- **Day Focus**: Single day view with navigation
- **Touch Scrolling**: Smooth time slot navigation
- **Simplified Blocks**: Essential information only

**Export Features:**
- **PDF Download**: Printable schedule
- **Calendar Export**: iCal format
- **Share Options**: Social media and email sharing

---

## Usage Instructions

### For Individual Components:
1. **Copy the Base Style Guide** (first section) for every component
2. **Add the specific component prompt** you want to generate
3. **Customize** with any specific requirements or variations
4. **Generate** the component in Magic Patterns

### For Consistency:
- Always include the base style guide
- Reference other components when they should work together
- Maintain the western theme and tournament branding
- Ensure mobile-first responsive design
- Include proper accessibility considerations

### For Complex Components:
- Break down into smaller parts if needed
- Reference atom and molecule components they should use
- Specify exact interactions and animations
- Include all necessary states and variations

### Tips:
- Use specific measurements and sizing
- Reference Phosphorus Icons for all UI elements
- Include team color integration where appropriate
- Specify touch targets and mobile optimizations
- Always consider real-time update capabilities

---

## LAYOUT COMPONENTS

### Header with Mega Navigation

**Prompt:** Create a comprehensive header component for the Cowtown Showdown tournament website. Design a sticky navigation system with mega menu dropdowns that work seamlessly across all devices.

**Header Layout:**
- **Desktop (1024px+)**: 3-section layout with logo, navigation, and actions
- **Mobile (< 1024px)**: Condensed layout with hamburger menu
- **Height**: 80px desktop, 64px mobile
- **Background**: White with subtle shadow on scroll
- **Sticky**: Fixed position with smooth scroll behavior

**Desktop Header Sections:**
- **Left (Logo)**: Tournament wordmark in Tiffany Gothic CC, 180px width
- **Center (Navigation)**: Primary navigation with mega menu dropdowns
- **Right (Actions)**: Live games indicator, search, user account (120px width)

**Primary Navigation Items:**
1. **Tournament** - Overview, schedule, standings, bracket, rules
2. **Teams** - All teams, rosters, stats, head-to-head  
3. **Games** - Live games, results, highlights, schedule
4. **Stats** - Leaders, team stats, player stats, records
5. **Media** - Photos, videos, highlights, social

**Mega Menu Structure (Use NavigationDropdown component):**

**Tournament Dropdown (3 columns):**
- **Column 1: Quick Access**
  - Tournament Overview (with icon)
  - Today's Schedule (with game count)
  - Live Games (with live indicator if active)
  - Current Standings (with top team)
  - Tournament Rules (PDF download)
- **Column 2: Information**
  - 5-Point System Explained
  - Venue Information (with map link)
  - Schedule Download (PDF button)
  - Contact Information (phone/email)
- **Column 3: Featured**
  - Featured live game card (if active)
  - Latest tournament news (with thumbnail)
  - Social media highlights

**Teams Dropdown (3 columns):**
- **Column 1: Team Grid**
  - 8 team logos in 2x4 grid (40px each)
  - Team colors and abbreviated names
  - Hover for full team name
  - Click to team profile
- **Column 2: Quick Stats**
  - Current standings (top 4 teams)
  - Team leaders (top scorer, goalie)
  - Recent results (last 3 games)
- **Column 3: Team Tools**
  - Compare Teams (with team selection)
  - Roster Search (search input)
  - Team Statistics (link)
  - Head-to-Head Records (link)

**Games Dropdown (3 columns):**
- **Column 1: Live Games**
  - Active games with live scores
  - Live indicator and time remaining
  - Quick access to streams
  - "No live games" state
- **Column 2: Schedule**
  - Today's games (with times)
  - Tomorrow's games preview
  - Week overview link
- **Column 3: Results**
  - Recent finals (last 3)
  - Highlights available (video icons)
  - Three stars awards

**Stats Dropdown (3 columns):**
- **Column 1: Leaders**
  - Top 3 scorers (with stats)
  - Top 3 goalies (with save %)
  - Leading teams (by points)
- **Column 2: Categories**
  - Player Statistics (by position)
  - Team Statistics (offense/defense)
  - Goalie Statistics (detailed)
  - Advanced Metrics (analytics)
- **Column 3: Records**
  - Tournament Records (all-time)
  - Individual Achievements (this year)
  - Team Milestones (notable)

**Media Dropdown (3 columns):**
- **Column 1: Latest**
  - Recent photos (thumbnail grid)
  - Latest videos (with play buttons)
  - Live stream (if active)
- **Column 2: Highlights**
  - Game highlights (by date)
  - Player spotlights (featured)
  - Behind the scenes content
- **Column 3: Social**
  - Instagram feed (latest 4)
  - Twitter updates (recent)
  - YouTube channel link

**Header Right Section:**
- **Live Games Indicator**: Pulsing red dot when games are live
- **Search Button**: Magnifying glass icon, opens search modal
- **User Account**: Avatar/login button with dropdown menu

**Mobile Header:**
- **Hamburger Menu**: Opens slide-out navigation panel
- **Logo**: Condensed tournament logo
- **Live Indicator**: Compact live games indicator
- **Search**: Icon button for mobile search

**Mobile Navigation Panel:**
- **Slide-out**: Full-height panel from right
- **Accordion Sections**: Collapsible navigation sections
- **Touch Targets**: Minimum 44px for all links
- **Close Button**: X icon in top-right corner

**Interactive Features:**
- **Smooth Hover**: 200ms transitions on all interactive elements
- **Keyboard Navigation**: Tab support through all menus
- **Accessibility**: ARIA labels and focus management
- **Real-time Updates**: Live game counts and indicators

**Performance:**
- **Lazy Loading**: Mega menu content loads on first hover
- **Caching**: Navigation data cached for performance
- **Responsive Images**: Optimized logos and thumbnails

### Footer Component

**Prompt:** Create a comprehensive footer component for the Cowtown Showdown tournament website. Design a multi-column layout with tournament information, links, resources, and social integration.

**Footer Layout:**
- **Desktop**: 4 columns with equal width
- **Tablet**: 2 columns with 2 rows
- **Mobile**: Single column with accordion sections
- **Background**: Dark brown (#5E2713) with golden accents
- **Text Color**: Off-white (#FAFAFA) for readability

**Column 1: Tournament Information**
- **Tournament Logo**: Tiffany Gothic CC wordmark in golden color
- **Event Details**: 
  - Dates: July 12-14, 2024
  - Location: Calgary, Alberta
  - Venue: Scotiabank Saddledome
- **Tagline**: "Only the best come to the west" (styled in golden)
- **Tournament Badge**: Official tournament seal/logo

**Column 2: Quick Links**
- **Tournament Section**:
  - Schedule (with Phosphorus calendar icon)
  - Standings (with trophy icon)
  - Rules & Format (with document icon)
  - Venue Information (with map icon)
- **Teams Section**:
  - All Teams (with team icon)
  - Rosters (with users icon)
  - Statistics (with chart icon)
- **Contact Section**:
  - Tournament Office (with phone icon)
  - Media Inquiries (with mail icon)
  - Volunteer Information (with hand icon)

**Column 3: Resources**
- **For Teams Section**:
  - Captain Resources (with crown icon)
  - Game Sheets (with document icon)
  - Team Contacts (with address book icon)
  - Tournament Handbook (with book icon)
- **For Media Section**:
  - Press Releases (with news icon)
  - Media Kit (with folder icon)
  - Photo Gallery (with camera icon)
  - Interview Requests (with microphone icon)
- **For Fans Section**:
  - Parking Information (with car icon)
  - Concessions (with food icon)
  - Accessibility (with accessibility icon)
  - FAQs (with question icon)

**Column 4: Connect & Follow**
- **Social Media Links** (using SocialIcon component):
  - Instagram: @cowtownshowdown
  - Twitter/X: @cowtownlacrosse
  - Facebook: Cowtown Showdown
  - YouTube: Cowtown Lacrosse
  - TikTok: @cowtownlax
- **Newsletter Signup**:
  - Email input field (full width)
  - Subscribe button (primary golden color)
  - "Get tournament updates" label
  - Privacy note (small text)

**Footer Bottom Section:**
- **Sponsors**: Horizontal scrolling sponsor logos (SponsorBanner component)
- **Copyright**: © 2024 Cowtown Showdown. All rights reserved.
- **Legal Links**: Privacy Policy | Terms of Service | Code of Conduct
- **Powered By**: "Tournament management by [System Name]"

**Interactive Features:**
- **Link Hover**: Golden color transition on hover
- **Social Icons**: Grayscale to full color on hover
- **Newsletter**: Real-time email validation
- **Sponsor Scroll**: Smooth horizontal scrolling

**Mobile Adaptations:**
- **Accordion Sections**: Collapsible sections with + and - icons
- **Priority Order**: Tournament info, Quick Links, Social, Resources
- **Social Prominence**: Social media links more prominent
- **Newsletter**: Simplified single-column layout
- **Sponsor Carousel**: Touch-friendly carousel with dots

**Responsive Behavior:**
- **1024px+**: Full 4-column layout
- **768px-1023px**: 2x2 grid layout
- **< 768px**: Single column with accordion sections

**Accessibility:**
- **High Contrast**: White text on dark brown background
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Tab through all links and form elements
- **Screen Reader**: Proper heading hierarchy and ARIA labels

**Design Details:**
- **Dividers**: Subtle golden lines between sections
- **Typography**: Geist Sans for all text, varying weights
- **Icons**: Phosphorus icons throughout for visual hierarchy
- **Spacing**: Consistent vertical rhythm and padding
- **Branding**: Western theme through color and typography choices