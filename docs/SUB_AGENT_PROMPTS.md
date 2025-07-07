# Sub-Agent Work Prompts

## 🤖 Agent 1: Real-time Scoring API

### Your Mission
Implement the backend API system for live tournament scoring with real-time updates via Server-Sent Events (SSE).

### Context
You're working on the Cowtown Showdown lacrosse tournament website. The tournament uses a unique 5-point scoring system and requires real-time updates for 500-900 concurrent users during live games.

### Your Scope
- **Primary Files**: `/src/app/api/games/`, `/src/endpoints/`
- **Secondary Files**: `/src/lib/`, `/src/utilities/`
- **Focus**: API endpoints, real-time updates, tournament calculations

### Key Requirements
1. **Game Management API**
   - `GET /api/games` - List all games
   - `GET /api/games/[id]` - Get specific game
   - `POST /api/games/[id]/start` - Start game
   - `POST /api/games/[id]/end` - End game
   - `PUT /api/games/[id]` - Update game state

2. **Scoring API**
   - `POST /api/games/[id]/goal` - Record goal
   - `POST /api/games/[id]/penalty` - Record penalty
   - `POST /api/games/[id]/faceoff` - Record faceoff
   - `POST /api/games/[id]/shot` - Record shot
   - `POST /api/games/[id]/stats` - Record other stats

3. **Real-time Updates**
   - `GET /api/games/[id]/live` - SSE endpoint for live updates
   - `GET /api/standings/live` - SSE for standings updates
   - Broadcast changes to all connected clients

4. **Tournament Calculations**
   - 5-point system: 2 pts for game win, 1 pt per period win, 0.5 pt per period tie
   - Real-time standings updates
   - Goal average calculations for tiebreakers

### Technical Specifications
- **SSE Implementation**: Use Server-Sent Events for real-time updates
- **Database**: Use existing Payload collections (Games, Goals, Penalties, etc.)
- **Authentication**: Integrate with Payload auth for scorekeeper endpoints
- **Rate Limiting**: Implement to handle 500-900 concurrent users
- **Error Handling**: Robust error responses with proper HTTP status codes

### Success Criteria
- [ ] All game management endpoints working
- [ ] Scoring endpoints updating database correctly
- [ ] SSE streams delivering real-time updates
- [ ] Tournament point calculations accurate
- [ ] Performance tested for high concurrency
- [ ] Proper error handling and validation

### Start Here
1. Read `/docs/API_REFERENCE.md` for endpoint specifications
2. Check existing `/src/app/api/` structure
3. Review `/src/collections/` for data models
4. Implement basic game endpoints first
5. Add SSE functionality last

---

## 🤖 Agent 2: Tournament Data Integration

### Your Mission
Connect existing tournament components to real data and implement the tournament homepage with live functionality.

### Context
UI components exist with comprehensive Storybook documentation. Your job is to integrate them with real data from the API and create cohesive tournament pages.

### Your Scope
- **Primary Files**: `/src/components/tournament/`, `/src/app/(frontend)/`
- **Secondary Files**: `/src/lib/hooks/`, `/src/utilities/`
- **Focus**: Data fetching, state management, component integration

### Key Requirements
1. **Tournament Homepage**
   - Live scoreboard with current games
   - Tournament standings table
   - Next games schedule
   - Featured live stream integration
   - Real-time updates via SSE

2. **Component Data Integration**
   - Connect `Scoreboard` component to live game data
   - Update `StandingsTable` with real tournament calculations
   - Integrate `GameCard` with actual game data
   - Implement real-time score updates

3. **Data Fetching & State**
   - React hooks for API data fetching
   - SSE integration for live updates
   - Loading and error states
   - Optimistic UI updates

4. **Tournament Pages**
   - `/` - Homepage with live scoreboard
   - `/schedule` - Complete tournament schedule
   - `/standings` - Current tournament standings
   - `/games/[id]` - Individual game details

### Technical Specifications
- **Data Fetching**: Use React hooks and Next.js patterns
- **Real-time**: Subscribe to SSE streams from Agent 1's API
- **State Management**: Use React state, consider Context for shared data
- **Performance**: Optimize for mobile and high user load
- **Accessibility**: Maintain WCAG 2.1 AA compliance

### Success Criteria
- [ ] Homepage displays live tournament data
- [ ] Real-time score updates working
- [ ] All tournament pages functional
- [ ] Components properly integrated with data
- [ ] Loading states and error handling
- [ ] Mobile responsive design verified

### Start Here
1. Review existing components in Storybook
2. Check `/src/components/tournament/` for component APIs
3. Create data fetching hooks in `/src/lib/hooks/`
4. Start with homepage integration
5. Add real-time updates once basic data flow works

---

## 🤖 Agent 3: Scorekeeper Interface

### Your Mission
Complete the scorekeeper dashboard and game management interface for tournament officials to manage live games.

### Context
Scorekeeper components exist but need full integration with the API and game management workflows. This is a mobile-first interface used during live games.

### Your Scope
- **Primary Files**: `/src/app/scorekeeper/`, `/src/components/scorekeeper/`
- **Secondary Files**: Scorekeeper-specific utilities and hooks
- **Focus**: Game management, statistics entry, mobile optimization

### Key Requirements
1. **Scorekeeper Dashboard**
   - List of available games to claim
   - Current assigned game status
   - Quick access to active game controls
   - Game claiming/releasing system

2. **Live Game Interface**
   - Timer controls (start/stop/reset)
   - Score tracking for both teams
   - Statistics entry (goals, penalties, faceoffs, shots)
   - Player selection dialogs
   - Undo functionality

3. **Game Management**
   - Pre-game setup (set starting goalies)
   - Period management (start/end periods)
   - Post-game tasks (three stars selection)
   - Game state synchronization

4. **Mobile Optimization**
   - Large touch targets (44px minimum)
   - Portrait orientation priority
   - Offline capability with sync
   - High contrast for outdoor use

### Technical Specifications
- **Mobile First**: Optimize for tablet/phone scorekeeper use
- **Real-time Sync**: Integrate with Agent 1's SSE streams
- **Offline Support**: Queue actions when offline, sync when reconnected
- **Authentication**: Scorekeeper role verification
- **Touch Interface**: Large buttons, clear visual feedback

### Success Criteria
- [ ] Scorekeeper can claim and manage games
- [ ] All statistics entry working correctly
- [ ] Timer and score controls functional
- [ ] Mobile interface optimized
- [ ] Offline capability implemented
- [ ] Real-time sync with main scoreboard

### Start Here
1. Review existing scorekeeper components in Storybook
2. Check `/src/app/scorekeeper/` structure
3. Implement game claiming system first
4. Add statistics entry functionality
5. Integrate with Agent 1's API endpoints

---

## 🤖 Agent 4: Content Pages & CMS

### Your Mission
Build tournament information pages, team profiles, and content management features using the existing CMS structure.

### Context
Payload CMS is configured with content blocks. Create engaging tournament pages and ensure content authoring works smoothly for non-technical users.

### Your Scope
- **Primary Files**: `/src/app/(frontend)/pages/`, `/src/blocks/`, `/src/collections/`
- **Secondary Files**: CMS configuration, content utilities
- **Focus**: Content pages, team profiles, information architecture

### Key Requirements
1. **Tournament Information Pages**
   - `/about` - Tournament history and information
   - `/rules` - RMLL modified rules explanation
   - `/teams` - Team profiles and rosters
   - `/schedule` - Complete tournament schedule
   - `/contact` - Contact and location information

2. **Team Management**
   - Team profile pages (`/teams/[slug]`)
   - Player roster displays
   - Team statistics and history
   - Captain contact information

3. **Content Block Integration**
   - Use existing Banner, CallToAction, MediaBlock components
   - Create page layouts with flexible content blocks
   - Implement rich content editing experience
   - Responsive design for all content

4. **CMS Optimization**
   - Content authoring guides for tournament organizers
   - Preview functionality for content changes
   - Media management for team photos/logos
   - SEO optimization for tournament pages

### Technical Specifications
- **CMS Integration**: Use Payload CMS collections and blocks
- **SEO**: Proper meta tags, structured data, sitemap
- **Performance**: Optimize images, implement caching
- **Accessibility**: Semantic HTML, proper heading structure
- **Mobile**: Responsive design for all content pages

### Success Criteria
- [ ] All tournament information pages complete
- [ ] Team profiles displaying correctly
- [ ] Content blocks working in CMS
- [ ] Content authoring guides created
- [ ] SEO optimization implemented
- [ ] Mobile responsive design verified

### Start Here
1. Review existing content blocks in Storybook
2. Check `/src/blocks/` for available components
3. Create page layouts using existing patterns
4. Start with tournament info pages
5. Add team profile functionality

---

## 🤖 Agent 5: Authentication & Security

### Your Mission
Implement role-based authentication, security measures, and access control for tournament administrators and scorekeepers.

### Context
Basic Payload authentication exists. Extend it with tournament-specific roles and security measures for live tournament operations.

### Your Scope
- **Primary Files**: `/src/access/`, `/src/hooks/`, auth components
- **Secondary Files**: Security utilities, middleware
- **Focus**: Authentication, authorization, security

### Key Requirements
1. **Role-Based Access Control**
   - **Admin**: Full tournament management access
   - **Scorekeeper**: Game scoring and management only
   - **Public**: Read-only access to tournament data
   - **Team Captain**: Limited team roster management

2. **Authentication System**
   - Secure login for scorekeepers and admins
   - Session management with proper timeouts
   - Password reset functionality
   - Multi-factor authentication (optional)

3. **Security Measures**
   - API endpoint protection
   - Rate limiting for public endpoints
   - Input validation and sanitization
   - CSRF protection
   - Audit logging for critical actions

4. **Scorekeeper Management**
   - Game claiming system with exclusive access
   - Session timeout management (4 hours default)
   - Emergency admin override capabilities
   - Activity logging for tournament audit

### Technical Specifications
- **Authentication**: Extend Payload auth with custom roles
- **Authorization**: Middleware for endpoint protection
- **Security Headers**: Implement proper security headers
- **Session Management**: Secure session handling
- **Audit Trail**: Log all critical tournament actions

### Success Criteria
- [ ] Role-based access control working
- [ ] Scorekeeper login and session management
- [ ] API endpoint security implemented
- [ ] Rate limiting for public access
- [ ] Audit logging for tournament actions
- [ ] Security review completed

### Start Here
1. Review existing Payload auth configuration
2. Check `/src/access/` for current access patterns
3. Implement custom roles first
4. Add scorekeeper-specific security
5. Implement audit logging last

---

## 🔗 Cross-Agent Coordination

### Communication Points
- **Agent 1 → 2,3**: API endpoints and data structures
- **Agent 2 → 4**: Shared components and layout patterns  
- **Agent 5 → All**: Authentication patterns and security requirements

### Integration Schedule
1. **Week 1**: All agents work on core functionality independently
2. **Week 2**: Integration testing and cross-agent coordination
3. **Week 3**: Performance optimization and tournament preparation

### Shared Resources
- **Types**: Update `/src/payload-types.ts` as needed
- **Components**: Use existing UI components from Storybook
- **Documentation**: Update relevant docs as you implement
- **Testing**: Add tests for your functionality

### Success Metrics
Each agent should achieve their success criteria while maintaining:
- Code quality and testing
- Documentation updates
- Performance considerations
- Mobile responsiveness
- Security best practices

Ready to build an amazing tournament management system! 🚀