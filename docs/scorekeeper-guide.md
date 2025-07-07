# Scorekeeper Interface Guide

## Overview

The Cowtown Showdown scorekeeper interface is a mobile-optimized real-time scoring system designed for tournament officials to manage live games efficiently during the tournament.

## Getting Started

### Access Requirements
- **Role**: Scorekeeper or Admin
- **Device**: Tablet or smartphone (portrait orientation recommended)
- **Connection**: Stable internet required for real-time sync

### Login Process
1. Navigate to `/scorekeeper` 
2. Sign in with scorekeeper credentials
3. Access the games dashboard

## Game Management Workflow

### 1. Claiming a Game

**Dashboard Overview**
- View all scheduled games
- Filter by day, status, or search teams
- See which games are available vs. claimed

**Claiming Process**
1. Find your assigned game in the list
2. Click "Claim Game" button
3. Review game details in confirmation dialog
4. Confirm to claim the game

**Important Constraints**
- Only one game per scorekeeper at a time
- Must release current game before claiming another
- Cannot claim games already assigned to others

### 2. Pre-Game Setup

**Before Starting**
1. Verify team rosters are loaded
2. Set starting goalies for both teams
3. Confirm game type (Pool Play = 12min periods, Medal = 15min periods)
4. Check that all required equipment is ready

### 3. Live Game Management

#### Starting the Game
1. Click "Start Game" in Period Controls
2. This automatically begins Period 1
3. Timer starts countdown from full period length

#### Recording Statistics

**Goals**
1. Click "Goal" button
2. Select Home or Away team
3. Choose scoring player from roster
4. Goal automatically updates score

**Shots**
1. Click "Shot" button  
2. Select team and shooter
3. Tracks shots on goal for goalie stats

**Penalties**
1. Click "Penalty" button
2. Select offending team
3. Choose player from roster
4. Select penalty category (Minor, Major, etc.)
5. Choose specific infraction from RMLL rule set
6. Penalty duration auto-calculated

**Faceoffs**
1. Click "Faceoff" button
2. Select winning team
3. Choose faceoff specialist

**Timeouts**
- Use quick timeout buttons for each team
- Automatically tracks timeout usage
- Teams get 2 timeouts per game

**Goalie Changes**
1. Click "Goalie" button
2. Select team
3. Choose new goalie from roster
4. Tracks goalie statistics and playing time

#### Timer Management
- **Start/Stop**: Control period timer
- **Reset**: Return to full period time
- **End**: Immediately end current period

#### Period Controls
- **End Period**: Completes current period
- **Start Next Period**: Begins next period with full timer
- **Overtime**: Available for medal games only
- **End Game**: Finalizes game and moves to three stars

### 4. Post-Game Tasks

#### Three Stars Selection
**Required immediately after game ends**
1. Select 1st Star (required)
2. Select 2nd Star (optional)
3. Select 3rd Star (optional)
4. Stars can be from either team
5. **Important**: Cannot be changed once submitted

## Interface Features

### Mobile Optimization
- **Touch Targets**: All buttons 44px minimum for easy tapping
- **High Contrast**: Clear visibility in outdoor conditions
- **Portrait Layout**: Optimized for tablet portrait orientation
- **Quick Actions**: Minimal taps for common statistics

### Real-Time Features
- **Live Connection**: Green indicator shows real-time sync
- **Offline Mode**: Red indicator, stats queue for later sync
- **Auto-Reconnect**: Automatic reconnection if connection lost
- **Optimistic Updates**: Instant local updates

### Error Handling
- **Undo**: Undo last action if mistake made
- **Edit Events**: Modify statistics after entry (via Game Log)
- **Connection Recovery**: Automatic sync when reconnected
- **Validation**: Prevents invalid entries

## Game Rules Integration

### RMLL Modified Rules
- **Shot Clock**: 30 seconds
- **Crease Count**: 4 seconds
- **Over and Back**: 8 seconds to cross center
- **Stop Time**: Last 2 minutes of 3rd period only

### 5-Point Tournament System
**Automatic Calculation**
- **Game Win**: 2 points
- **Game Tie**: 1 point  
- **Period Win**: 1 point each
- **Period Tie**: 0.5 points each
- **Maximum**: 5 points per game possible

### Overtime Rules
- **Pool Games**: No overtime, games can end in ties
- **Medal Games**: 5-minute sudden death periods
- **Multiple OT**: Continue until goal scored

## Troubleshooting

### Connection Issues
- **Red Connection Indicator**: 
  - Continue entering stats (they'll queue)
  - System will auto-sync when connection restored
  - Try refreshing page if connection doesn't restore

### Game Access Issues
- **"Access Denied"**: 
  - Ensure you've claimed the game first
  - Check that another scorekeeper hasn't claimed it
  - Contact admin if persistent

### Statistics Errors
- **Wrong Player Selected**: Use "Undo Last Action"
- **Wrong Team**: Delete event from Game Log and re-enter
- **Missing Statistics**: Add via appropriate stat button

### Timer Issues
- **Timer Not Starting**: Ensure game status is "Live"
- **Wrong Time**: Use Reset button to restore full period
- **Period Stuck**: Use Period Controls to manually advance

## Best Practices

### Before Tournament
1. **Test System**: Practice with test games
2. **Device Prep**: Charge devices, test internet
3. **Backup Plan**: Have paper scoresheet ready
4. **Roster Review**: Familiarize with team rosters

### During Games
1. **Stay Connected**: Monitor connection indicator
2. **Enter Stats Immediately**: Don't wait until period breaks
3. **Verify Entries**: Check Game Log for accuracy
4. **Communicate**: Coordinate with referees on penalties
5. **Focus on Flow**: Prioritize game flow over perfect stat timing

### Post-Game
1. **Three Stars First**: Select immediately after game
2. **Review Game Log**: Verify all statistics
3. **Release Game**: If managing multiple games
4. **Report Issues**: Note any problems for tournament director

## Emergency Procedures

### System Failure
1. **Switch to Paper**: Continue on backup scoresheet
2. **Contact IT**: Report technical issues immediately
3. **Post-Game Entry**: Enter stats when system restored

### Disputed Statistics
1. **Referee Consultation**: Verify with game officials
2. **Edit via Game Log**: Correct disputed entries
3. **Tournament Director**: Escalate major disputes

### Connection Loss
1. **Continue Scoring**: Stats will queue locally
2. **Monitor Status**: Watch for reconnection
3. **Manual Sync**: Refresh page if needed after reconnection

## Support Contacts

- **Technical Issues**: IT Support on-site
- **Rule Questions**: Tournament Director
- **Emergency**: Tournament Control Table

---

*This guide covers the essential functions of the scorekeeper interface. For additional features or troubleshooting, consult the on-site technical support team.*