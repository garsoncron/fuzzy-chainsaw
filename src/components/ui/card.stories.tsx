import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Calendar, Clock, MapPin, Users, Star, Trophy } from 'lucide-react'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexible card component built with compound components pattern. Perfect for displaying game information, 
team details, tournament statistics, and other structured content.

### Components
- **Card**: The container element
- **CardHeader**: Header section with title and description
- **CardTitle**: Main heading (h3 by default)
- **CardDescription**: Subtitle/description text
- **CardContent**: Main content area
- **CardFooter**: Footer section for actions

### Usage
Cards are the primary container for tournament information including game cards, team profiles, 
statistics displays, and scorekeeper interfaces.
        `,
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

// Basic card
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

// Game card example
export const GameCard: Story = {
  name: 'Tournament: Game Card',
  render: () => (
    <Card className="w-[400px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Game 1</CardTitle>
          <Badge className="bg-red-500 text-white animate-pulse">
            <div className="mr-1 h-2 w-2 rounded-full bg-white"></div>
            LIVE
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm">
          <Calendar className="mr-1 h-4 w-4" />
          July 15, 2024 • 10:00 AM
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              🐻
            </div>
            <div>
              <div className="font-semibold">Calgary Bears</div>
              <div className="text-2xl font-bold">8</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Period 2</div>
            <div className="text-sm font-mono">7:00</div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="font-semibold">Edmonton Storm</div>
              <div className="text-2xl font-bold">5</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              ⚡
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tournament Points: 3.5</span>
          <span>Tournament Points: 1.5</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Game Details
        </Button>
      </CardFooter>
    </Card>
  ),
}

// Team profile card
export const TeamProfile: Story = {
  name: 'Tournament: Team Profile',
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
            🐻
          </div>
          <div>
            <CardTitle>Calgary Bears</CardTitle>
            <CardDescription>Calgary, Alberta</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>20 Players</span>
          </div>
          <div className="flex items-center">
            <Trophy className="mr-2 h-4 w-4" />
            <span>5-0 Record</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Pool A</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-2 h-4 w-4" />
            <span>18.5 Points</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="text-sm font-medium mb-2">Captain</div>
          <div className="text-sm">
            <div>Connor McDavid</div>
            <div className="text-muted-foreground">connor@calgarybears.com</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

// Statistics card
export const StatsCard: Story = {
  name: 'Tournament: Statistics',
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="text-lg">Tournament Leaders</CardTitle>
        <CardDescription>Top performers this tournament</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">Goals</div>
            <div className="text-muted-foreground">Connor McDavid</div>
          </div>
          <div className="text-2xl font-bold">12</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">Assists</div>
            <div className="text-muted-foreground">Leon Draisaitl</div>
          </div>
          <div className="text-2xl font-bold">15</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">Saves</div>
            <div className="text-muted-foreground">Stuart Skinner</div>
          </div>
          <div className="text-2xl font-bold">48</div>
        </div>
      </CardContent>
    </Card>
  ),
}

// Scorekeeper interface card
export const ScorekeeperCard: Story = {
  name: 'Scorekeeper: Quick Actions',
  render: () => (
    <Card className="w-[320px]">
      <CardHeader>
        <CardTitle className="text-lg">Calgary Bears</CardTitle>
        <CardDescription>Home Team • Period 2</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-16">
            <div className="text-center">
              <div className="text-2xl mb-1">+</div>
              <div className="text-sm">Goal</div>
            </div>
          </Button>
          <Button variant="destructive" className="h-16">
            <div className="text-center">
              <div className="text-2xl mb-1">!</div>
              <div className="text-sm">Penalty</div>
            </div>
          </Button>
          <Button variant="outline" className="h-16">
            <div className="text-center">
              <div className="text-2xl mb-1">○</div>
              <div className="text-sm">Faceoff</div>
            </div>
          </Button>
          <Button variant="secondary" className="h-16">
            <div className="text-center">
              <div className="text-2xl mb-1">🥅</div>
              <div className="text-sm">Shot</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

// Schedule card
export const ScheduleCard: Story = {
  name: 'Tournament: Schedule Item',
  render: () => (
    <Card className="w-[400px]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Game</div>
              <div className="text-lg font-bold">5</div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">Calgary Bears</span>
              <span className="text-muted-foreground">vs</span>
              <span className="font-medium">Vancouver Thunder</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              11:00 AM
            </div>
            <Badge variant="outline">Upcoming</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

// Compact variations
export const CompactCard: Story = {
  name: 'Compact Game Card',
  render: () => (
    <Card className="w-[300px]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Game 3</div>
            <Badge variant="secondary" className="text-xs">Final</Badge>
          </div>
          <div className="text-xs text-muted-foreground">2:15 PM</div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm">
            <div>Calgary Bears</div>
            <div className="font-bold">12</div>
          </div>
          <div className="text-xs text-muted-foreground">vs</div>
          <div className="text-sm text-right">
            <div>Edmonton Storm</div>
            <div className="font-bold">9</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

// Error state
export const ErrorCard: Story = {
  name: 'Error State',
  render: () => (
    <Card className="w-[350px] border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800">Connection Error</CardTitle>
        <CardDescription className="text-red-600">
          Unable to load game data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-red-700">
          Please check your internet connection and try again.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Retry
        </Button>
      </CardFooter>
    </Card>
  ),
}

// Loading state
export const LoadingCard: Story = {
  name: 'Loading State',
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </CardContent>
    </Card>
  ),
}

// Interactive card
export const InteractiveCard: Story = {
  name: 'Interactive (Hover)',
  render: () => (
    <Card className="w-[350px] cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle>Clickable Game Card</CardTitle>
        <CardDescription>Hover to see interaction</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card responds to hover and can be clicked for navigation.</p>
      </CardContent>
    </Card>
  ),
}

// Mobile responsive
export const MobileCard: Story = {
  name: 'Mobile Responsive',
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Game 1</CardTitle>
          <Badge className="text-xs">LIVE</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div>Calgary Bears</div>
          <div className="font-bold text-lg">8</div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>Edmonton Storm</div>
          <div className="font-bold text-lg">5</div>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          Period 2 • 7:00 remaining
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}