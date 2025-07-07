import type { Meta, StoryObj } from '@storybook/react'
import { TournamentInfo } from './Component'

const meta: Meta<typeof TournamentInfo> = {
  title: 'Blocks/TournamentInfo',
  component: TournamentInfo,
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
type Story = StoryObj<typeof TournamentInfo>

export const Default: Story = {
  args: {
    block: {
      blockType: 'tournamentInfo',
      title: 'About the Cowtown Showdown',
      description: 'The premier Senior Men\'s box lacrosse tournament in Calgary, featuring 8 teams competing over 3 days with live scoring, real-time updates, and western hospitality.',
      stats: [
        { number: '8', label: 'Teams' },
        { number: '22', label: 'Games' },
        { number: '3', label: 'Days' },
        { number: '5', label: 'Points System' },
      ],
      highlights: [
        {
          icon: 'trophy',
          title: 'Championship Format',
          description: 'Pool play followed by medal games with the top teams advancing to championship and bronze medal games.',
        },
        {
          icon: 'clock',
          title: 'Live Scoring',
          description: 'Real-time game updates with live scoring, statistics, and three stars recognition after each game.',
        },
        {
          icon: 'star',
          title: 'Western Hospitality',
          description: 'Experience Calgary\'s western culture with our Stampede-themed tournament atmosphere and local hospitality.',
        },
      ],
    },
  },
}

export const Minimal: Story = {
  args: {
    block: {
      blockType: 'tournamentInfo',
      title: 'Tournament Information',
      description: 'Basic tournament details and information.',
      stats: [
        { number: '8', label: 'Teams' },
        { number: '3', label: 'Days' },
      ],
      highlights: [
        {
          icon: 'trophy',
          title: 'Competition',
          description: 'Competitive lacrosse tournament.',
        },
      ],
    },
  },
}

export const WithManyStats: Story = {
  args: {
    block: {
      blockType: 'tournamentInfo',
      title: 'Tournament by the Numbers',
      description: 'Comprehensive statistics about the Cowtown Showdown tournament.',
      stats: [
        { number: '8', label: 'Teams' },
        { number: '22', label: 'Games' },
        { number: '3', label: 'Days' },
        { number: '160', label: 'Players' },
        { number: '5', label: 'Points System' },
        { number: '12', label: 'Minute Periods' },
        { number: '2', label: 'Medal Games' },
        { number: '1', label: 'Championship' },
      ],
      highlights: [
        {
          icon: 'users',
          title: 'Elite Competition',
          description: 'Top senior men\'s lacrosse teams from across the region.',
        },
        {
          icon: 'mapPin',
          title: 'Calgary Location',
          description: 'Hosted in the heart of Calgary with easy access and amenities.',
        },
      ],
    },
  },
}

export const Mobile: Story = {
  args: {
    block: {
      blockType: 'tournamentInfo',
      title: 'Cowtown Showdown',
      description: 'Premier lacrosse tournament in Calgary.',
      stats: [
        { number: '8', label: 'Teams' },
        { number: '22', label: 'Games' },
        { number: '3', label: 'Days' },
        { number: '5', label: 'Points' },
      ],
      highlights: [
        {
          icon: 'trophy',
          title: 'Championship',
          description: 'Compete for the championship title.',
        },
        {
          icon: 'clock',
          title: 'Live Updates',
          description: 'Follow games with real-time scoring.',
        },
      ],
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}