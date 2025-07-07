# Team Management Guide - Cowtown Showdown CMS

This guide explains how to manage team information, player rosters, and team-related content in the Payload CMS.

## Overview

The tournament supports 8 teams with complete roster management, team profiles, and automatic integration with the public website's team pages.

## Team Management

### Creating a New Team

1. **Navigate to Teams**
   - Go to "Teams" under the "Tournament" section
   - Click "Create New"

2. **Basic Team Information**
   - **Name:** Full team name (e.g., "Calgary Bears")
   - **Slug:** URL-friendly version (auto-generated, can be customized)
   - **City:** Team's home city
   - **Province:** Team's home province

3. **Visual Branding**
   - **Logo:** Upload team logo (recommended size: 200x200px)
   - **Primary Color:** Main team color in hex format (#934F25)
   - **Secondary Color:** Secondary team color in hex format (#D6AC4D)

4. **Team Captain Information**
   - **Name:** Captain's full name
   - **Email:** Primary contact email
   - **Phone:** Contact phone number

### Team Profile Pages

Each team automatically gets a public profile page at `/teams/[team-slug]` that displays:
- Team logo and colors
- City and province
- Complete roster with positions
- Team statistics
- Game schedule
- Contact information

## Player Management

### Adding Players to a Team

1. **Navigate to Players**
   - Go to "Players" under the "Tournament" section
   - Click "Create New"

2. **Player Basic Information**
   - **First Name:** Player's first name
   - **Last Name:** Player's last name
   - **Jersey Number:** 0-99 (must be unique per team)
   - **Team:** Select from existing teams

3. **Position Information**
   - **Primary Position:** Main position (Offence, Defence, Transition, Faceoff, Goalie)
   - **Secondary Position:** Optional secondary position
   - **Player Type:** Runner or Goalie
   - **Handedness:** Left or Right

4. **Optional Information**
   - **Photo:** Player photo (optional)

### Roster Rules

- **Total Players:** Unlimited players can be on the team
- **Game Roster:** Maximum 20 players per game (18 runners + 2 goalies)
- **Jersey Numbers:** Must be unique within each team (0-99)
- **Goalie Designation:** Players marked as "Goalie" type automatically get Goalie position

### Bulk Player Import

For importing large rosters, use the CSV import feature:

1. **Prepare CSV File**
   ```csv
   firstName,lastName,jerseyNumber,primaryPosition,handedness,playerType
   John,Smith,1,offence,right,runner
   Jane,Doe,30,goalie,left,goalie
   ```

2. **Import Process**
   - Go to Players collection
   - Click "Import" button
   - Upload your CSV file
   - Map fields to correct columns
   - Review and confirm import

## Team Pages Content

### Customizing Team Profiles

The team profile pages automatically display:

1. **Team Header**
   - Team name, logo, and colors
   - City and province
   - Team statistics (games played, wins)

2. **Team Captain Contact**
   - Captain name, email, and phone
   - Primary contact for tournament communication

3. **Roster by Position**
   - Goalies listed separately
   - Runners grouped by primary position
   - Jersey numbers and handedness shown

4. **Team Schedule**
   - All games for the team
   - Home vs. away designation
   - Game status and scores
   - Links to live scoring when games are active

### Managing Team Colors

Team colors are used throughout the website:
- Team profile page accents
- Scoreboard displays
- Game cards and schedules
- Player jersey number badges

**Color Guidelines:**
- Use high contrast colors for readability
- Ensure colors work on both light and dark backgrounds
- Test colors with tournament's western theme
- Primary color should be the dominant team color
- Secondary color for accents and highlights

## Game Integration

### Team Statistics

Team pages automatically calculate and display:
- **Games Played:** Completed games count
- **Wins:** Games won by the team
- **Tournament Points:** Based on 5-point system
- **Goals For/Against:** Scoring statistics

### Game Schedule

Each team's schedule shows:
- **Game Number:** Sequential game identifier
- **Opponent:** Opposing team name
- **Date/Time:** Scheduled game time
- **Game Type:** Pool play or medal game
- **Status:** Scheduled, Live, or Final
- **Score:** Final score when game is complete

## Public Website Integration

### Teams Overview Page

The `/teams` page displays:
- Grid of all 8 teams
- Team logos and colors
- Roster counts (total, runners, goalies)
- Links to individual team profiles

### Individual Team Pages

Each team gets a dedicated page at `/teams/[slug]` with:
- Complete team information
- Full roster with positions
- Team schedule and results
- Captain contact information

## Content Management Tips

### Photo Guidelines

**Team Logos:**
- Square format preferred (200x200px minimum)
- High contrast for visibility
- PNG or SVG format for transparency
- File size under 500KB

**Player Photos:**
- Headshot style preferred
- Consistent lighting and background
- 150x200px minimum resolution
- JPG format, under 200KB

### Data Accuracy

**Before Tournament:**
- [ ] Verify all team information is current
- [ ] Confirm captain contact details
- [ ] Review player roster completeness
- [ ] Check jersey number conflicts

**During Tournament:**
- [ ] Update any roster changes
- [ ] Monitor for player additions/removals
- [ ] Verify goalie designations for games

**After Tournament:**
- [ ] Archive final rosters
- [ ] Save team photos and highlights
- [ ] Document any rule clarifications

### Troubleshooting

**Common Issues:**

**Player not appearing on team page:**
- Check player is assigned to correct team
- Verify team page is published
- Clear browser cache

**Jersey number conflicts:**
- Each number must be unique per team
- System will prevent duplicate numbers
- Update one player's number to resolve

**Team colors not displaying:**
- Verify hex color format (#000000)
- Check colors work with website theme
- Test on both desktop and mobile

**Missing team logo:**
- Check file upload was successful
- Verify image format (PNG, JPG, SVG)
- Ensure file size under 10MB

### SEO Optimization

Team pages are automatically optimized for search engines:
- **Meta titles:** Include team name and tournament
- **Meta descriptions:** Team location and tournament participation
- **Keywords:** Team name, city, lacrosse, tournament
- **Structured data:** Team and roster information

---

**Last Updated:** December 2024  
**For Questions:** Contact tournament administration team