import type { Meta, StoryObj } from '@storybook/react'
import { Rules } from './Component'

const meta: Meta<typeof Rules> = {
  title: 'Blocks/Rules',
  component: Rules,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    block: {
      control: 'object',
    },
  },
}

export default meta
type Story = StoryObj<typeof Rules>

export const Default: Story = {
  args: {
    block: {
      blockType: 'rules',
      title: 'RMLL Modified Rules',
      subtitle: 'The Cowtown Showdown follows RMLL (Rocky Mountain Lacrosse League) modified rules for senior men\'s box lacrosse.',
      ruleCategories: [
        {
          categoryTitle: 'Game Format',
          rules: [
            { rule: '12-minute periods for pool play games, 15-minute periods for medal games' },
            { rule: 'Stop time only in the last 2 minutes of the 3rd period' },
            { rule: '2-minute breaks between periods' },
            { rule: '5-minute sudden death overtime for medal games only' },
          ],
        },
        {
          categoryTitle: 'Playing Rules',
          rules: [
            { rule: '30-second shot clock - must shoot within 30 seconds of possession' },
            { rule: '4-second crease count - goalie must exit crease within 4 seconds' },
            { rule: '8-second count to cross center line after gaining possession' },
            { rule: 'No traditional sticks allowed (except goalies)' },
            { rule: 'Immediate restart after violations (6 feet away from violation)' },
          ],
        },
        {
          categoryTitle: 'Scoring System',
          rules: [
            { rule: '2 points for game win, 1 point for game tie, 0 points for game loss' },
            { rule: '1 point for winning a period, 0.5 points for tying a period' },
            { rule: 'Maximum 5 points possible per game' },
            { rule: 'Tiebreaker: head-to-head points, then goal average' },
          ],
        },
        {
          categoryTitle: 'Team Composition',
          rules: [
            { rule: 'Maximum 20 players on game roster (18 runners + 2 goalies)' },
            { rule: 'Unlimited total players allowed on team' },
            { rule: '2 timeouts per game (cannot use both in same period)' },
            { rule: '1 additional timeout available in overtime' },
          ],
        },
      ],
      additionalInfo: 'All other rules follow standard OLA modified box lacrosse rules. Referees have final authority on all rule interpretations and game situations.',
    },
  },
}

export const BasicRules: Story = {
  args: {
    block: {
      blockType: 'rules',
      title: 'Tournament Rules',
      subtitle: 'Essential rules for tournament play.',
      ruleCategories: [
        {
          categoryTitle: 'Game Format',
          rules: [
            { rule: '12-minute periods for regular games' },
            { rule: '2-minute breaks between periods' },
          ],
        },
        {
          categoryTitle: 'Scoring',
          rules: [
            { rule: '2 points for win, 1 for tie, 0 for loss' },
            { rule: '1 point for period win, 0.5 for period tie' },
          ],
        },
      ],
      additionalInfo: 'Contact tournament organizers for clarifications.',
    },
  },
}

export const PenaltyRules: Story = {
  args: {
    block: {
      blockType: 'rules',
      title: 'Penalty Guidelines',
      subtitle: 'Common penalties and their durations in tournament play.',
      ruleCategories: [
        {
          categoryTitle: 'Minor Penalties (2 minutes)',
          rules: [
            { rule: 'Slashing - striking opponent with stick' },
            { rule: 'Tripping - causing opponent to fall' },
            { rule: 'Interference - impeding player without ball' },
            { rule: 'Holding - grabbing opponent or equipment' },
            { rule: 'Cross checking - checking with shaft of stick' },
            { rule: 'Unsportsmanlike conduct - arguing, taunting' },
          ],
        },
        {
          categoryTitle: 'Major Penalties (5 minutes)',
          rules: [
            { rule: 'High sticking - contact above shoulders' },
            { rule: 'Boarding - dangerous check into boards' },
            { rule: 'Fighting - throwing punches or wrestling' },
            { rule: 'Checking from behind - dangerous blind-side check' },
          ],
        },
        {
          categoryTitle: 'Misconduct Penalties',
          rules: [
            { rule: 'Game misconduct - ejection from current game' },
            { rule: 'Gross misconduct - ejection plus suspension' },
            { rule: 'Match penalty - ejection pending review' },
          ],
        },
      ],
      additionalInfo: 'Referees may assess additional penalties based on severity and intent. Accumulated penalties may result in suspensions.',
    },
  },
}

export const Mobile: Story = {
  args: {
    block: {
      blockType: 'rules',
      title: 'Tournament Rules',
      subtitle: 'Key rules for competition.',
      ruleCategories: [
        {
          categoryTitle: 'Game Format',
          rules: [
            { rule: '12-minute periods' },
            { rule: '30-second shot clock' },
          ],
        },
        {
          categoryTitle: 'Scoring',
          rules: [
            { rule: '2 points for win' },
            { rule: '1 point for period win' },
          ],
        },
      ],
      additionalInfo: 'Full rules available on tournament website.',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}