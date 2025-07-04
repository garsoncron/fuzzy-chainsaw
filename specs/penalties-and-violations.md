# Cowtown Showdown Penalties and Rule Violations

This document provides comprehensive information about penalties and rule violations in the Cowtown Showdown tournament, following RMLL Modified (OLA Modified) box lacrosse rules.

## Penalty Overview

Penalties in box lacrosse are infractions that result in a player being removed from play for a specified duration. The penalized team plays short-handed during this time unless coincidental penalties are assessed.

### Penalty Types and Durations

```typescript
type PenaltyDuration = '30s' | '1min' | '2min' | '3min' | '5min' | '10min' | 'game' | 'penalty_shot'
type PenaltyType = 'minor' | 'major' | 'misconduct' | 'game_misconduct' | 'penalty_shot'
```

## Minor Penalties (2 minutes)

Minor penalties are the most common infractions and result in the player serving 2 minutes in the penalty box.

### Slashing
- **Description**: Striking an opponent with the stick
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Can be called on any forceful stick contact to opponent's body or stick

### Tripping
- **Description**: Using stick, hands, arms, feet or legs to trip an opponent
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Includes any action that causes opponent to fall

### Interference
- **Description**: Impeding the progress of an opponent not in possession of the ball
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Player must be within 5 feet of loose ball to make contact

### Holding
- **Description**: Using hands or stick to hold an opponent or opponent's equipment
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Includes grabbing jersey, stick, or any body part

### Illegal Pick
- **Description**: Using unequal pressure and creating movement or altering position of opposing player
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Player setting pick must remain stationary

### Cross Checking
- **Description**: Checking an opponent with the shaft of the stick while both hands are on the stick
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Stick must be off the ground and extended

### Elbowing
- **Description**: Checking an opponent with the elbow
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Contact must be deliberate

### Roughing
- **Description**: Unnecessary physical contact or aggressive play
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Often called after whistle or away from play

### Unsportsmanlike Conduct
- **Description**: Conduct contrary to the spirit of fair play
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Includes verbal abuse, gestures, arguing with officials

### Delay of Game
- **Description**: Deliberately delaying the game or not being ready to play
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Team loses 1 tournament point if not ready at game start

### Illegal Substitution
- **Description**: Having too many players on the floor
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: More than 5 runners + 1 goalie on floor

### Crease Violation
- **Description**: Entering the goalie crease while playing the ball
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Player cannot be in crease when ball enters

### Over and Back
- **Description**: Carrying, passing or allowing ball into defensive half after crossing center line
- **Duration**: 2 minutes
- **Type**: Minor
- **Key Points**: Once offensive team crosses center, cannot return to defensive half

## Major Penalties (5 minutes)

Major penalties are more serious infractions resulting in 5 minutes in the penalty box. The player cannot return even if opponent scores.

### High Sticking
- **Description**: Raising the lacrosse stick above the shoulder of opponent
- **Duration**: 5 minutes
- **Type**: Major
- **Key Points**: Stick must make contact with opponent above shoulders

### Boarding
- **Description**: Attempting to push any player into the boards
- **Duration**: 5 minutes
- **Type**: Major
- **Key Points**: Violent or dangerous contact with boards

### Face Masking
- **Description**: Grabbing another player's face mask
- **Duration**: 5 minutes
- **Type**: Major
- **Key Points**: Extremely dangerous, automatic major

### Fighting
- **Description**: Engaging in fisticuffs or aggressive physical altercation
- **Duration**: 5 minutes
- **Type**: Major
- **Key Points**: Both players receive penalties, possible game misconduct

### Spearing
- **Description**: Leading with the helmet to make contact
- **Duration**: 5 minutes
- **Type**: Major
- **Key Points**: Using helmet as weapon, very dangerous

### Checking from Behind
- **Description**: Checking an opponent from behind into the boards
- **Duration**: 5 minutes
- **Type**: Major
- **Key Points**: Opponent in vulnerable position, unable to protect themselves

## Misconduct Penalties

### Misconduct (10 minutes)
- **Description**: Serious violation warranting removal from game for 10 minutes
- **Duration**: 10 minutes
- **Type**: Misconduct
- **Key Points**: Team does not play short-handed, substitute allowed

### Game Misconduct
- **Description**: Ejection from the game for serious violations
- **Duration**: Remainder of game
- **Type**: Game Misconduct
- **Key Points**: Player must leave bench area, possible suspension

## Special Penalties

### Penalty Shot
- **Description**: Awarded for severe infractions preventing clear scoring opportunities
- **Duration**: N/A
- **Type**: Penalty Shot
- **Key Points**: 
  - Fouled player takes shot from center
  - All other players behind center line
  - Goalie cannot leave crease until shot taken

## Rule Violations (Non-Penalty)

These violations result in change of possession rather than penalties, unless they're repeated or flagrant.

### Shot Clock Violation (30 seconds)
- **Description**: Team must take shot on goal within 30 seconds of gaining possession
- **Result**: Change of possession
- **Key Points**: 
  - Clock resets on shot hitting goalie or goal
  - Clock resets on change of possession
  - No reset for shot going wide

### Eight-Second Count
- **Description**: Team must advance ball with both feet across centre line within 8 seconds
- **Result**: Change of possession
- **Key Points**:
  - Starts when team gains possession in defensive half
  - Both player's feet must cross center
  - Shot clock resets if timeout called

### Four-Second Count
- **Description**: When team gains possession in their crease, player must vacate within 4 seconds
- **Result**: Change of possession
- **Key Points**:
  - Goalie or runner can possess in crease
  - Must completely exit crease
  - Count starts on possession

### Over and Back (Non-Penalty)
- **Description**: Team cannot return ball to defensive half once in offensive half
- **Result**: Change of possession
- **Key Points**:
  - May not restart within 24-foot dotted line
  - Both feet must be across center before violation
  - Deflections off opponent don't count

### Traditional Stick Violation
- **Description**: No traditional player sticks allowed except for goalies
- **Result**: Equipment violation, player must change stick
- **Key Points**:
  - Only goalies may use traditional pockets
  - All runners must use mesh pockets

### Fast Restart Violation
- **Description**: Offending team must immediately put ball down and move 6 feet away
- **Result**: Minor penalty if not complied with
- **Key Points**:
  - Player must drop ball immediately
  - Must retreat 6 feet
  - Delay results in delay of game penalty

### Illegal Substitution (Non-Penalty)
- **Description**: Improper player change during play
- **Result**: Change of possession
- **Key Points**:
  - Players must change through substitution area
  - Cannot change during play stoppage without permission

## Penalty Administration

### Power Play Rules
- Team with penalty plays short-handed
- If short-handed team scores, minor penalty ends
- Major penalties are served in full regardless of goals
- Maximum 2-player advantage (5-on-3)

### Coincidental Penalties
- Equal penalties to both teams
- Teams play at even strength
- Players serve full time
- No early release for goals

### Delayed Penalties
- Play continues if non-offending team has possession
- Whistle blown when offending team touches ball
- Goalie can be pulled for extra attacker

### Penalty Tracking
```typescript
interface Penalty {
  id: string
  game: Game
  period: number | string
  time: string
  player: Player
  team: Team
  infraction: string
  duration: PenaltyDuration
  penaltyType: PenaltyType
  coincidental: boolean
  delayedPenalty: boolean
  startTime: Date
  endTime?: Date
  gameTime: number
  description?: string
}
```

## Tournament-Specific Penalty Rules

### Penalty Minute Tracking
- All penalty minutes count toward team total
- Used as 4th tiebreaker for standings
- Misconduct penalties count as 10 minutes
- Game misconducts count as 10 minutes

### Suspension Policy
- Fighting: 1 game suspension
- 2nd fighting major: Tournament ejection
- Match penalty: Minimum 1 game suspension
- Accumulation of 3 game misconducts: Tournament ejection

### Penalty Shot Procedures
1. All players except shooter and goalie behind center
2. Shooter starts from center on whistle
3. Must maintain forward motion
4. Shot must be taken within 5 seconds
5. No rebound allowed
6. If goal scored, face-off at center
7. If saved/missed, face-off in offensive zone

## Officials and Enforcement

### Referee Signals
- Arm raised: Delayed penalty
- Both arms up: Goal
- Washout motion: No goal/No penalty
- Pointing to penalty box: Penalty called

### Video Review
- Not available for penalty calls
- Judgment of officials is final
- Coaches cannot challenge penalties

### Penalty Reporting
- Scorekeeper must record:
  - Player number and name
  - Infraction type
  - Time of penalty
  - Duration
  - Period
  - Whether coincidental or delayed

## Best Practices for Scorekeepers

### Recording Penalties
1. Stop game clock when penalty called
2. Record all required information
3. Confirm with referee on infraction and duration
4. Start penalty time when player enters box
5. Monitor penalty clock
6. Alert when penalty expires

### Common Scenarios
- **Multiple penalties same play**: Stack in order called
- **Penalty during power play**: Team may go down 2 players
- **Goalie penalty**: Served by player on floor at time
- **Penalty at period end**: Carries over to next period
- **Penalty in overtime**: Sudden death continues 4-on-3

## Quick Reference Card

### Minor Penalties (2 min)
- Slashing, Tripping, Interference
- Holding, Illegal Pick, Cross Checking
- Elbowing, Roughing, Unsportsmanlike
- Delay of Game, Illegal Substitution
- Crease Violation, Over and Back

### Major Penalties (5 min)
- High Sticking, Boarding
- Face Masking, Fighting
- Spearing, Checking from Behind

### Misconducts
- 10-minute misconduct
- Game misconduct (ejection)

### Rule Violations (Loss of Possession)
- 30-second shot clock
- 8-second count
- 4-second crease count
- Over and back
- Illegal equipment