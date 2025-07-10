import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Button } from './button'
import { Badge } from './badge'
import { useState } from 'react'
import { Star, AlertTriangle, Plus, Settings, Users, Trophy } from 'lucide-react'

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A modal dialog component built with **Radix UI Dialog** primitive. Perfect for scorekeeper 
actions, confirmations, and detailed information display.

### Features
- Built with Radix UI for full accessibility
- Backdrop blur and smooth animations
- Keyboard navigation and focus management
- Escape key to close
- Portal rendering to avoid z-index issues

### Common Uses
- Three stars selection in tournament games
- Goal/penalty entry forms for scorekeepers
- Confirmation dialogs for critical actions
- Player selection interfaces
- Game settings and configurations
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the dialog is open',
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Called when the dialog open state changes',
    },
  },
  args: {
    onOpenChange: fn(),
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dialog>

// Basic dialog
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a basic dialog with a title, description, and action buttons.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Three stars selection dialog
function ThreeStarsSelectionComponent() {
  const [selectedStars, setSelectedStars] = useState({
    first: '',
    second: '',
    third: '',
  })
    
    const players = [
      { id: '1', name: 'Connor McDavid', team: 'Calgary Bears' },
      { id: '2', name: 'Leon Draisaitl', team: 'Edmonton Storm' },
      { id: '3', name: 'Quinn Hughes', team: 'Vancouver Thunder' },
      { id: '4', name: 'Stuart Skinner', team: 'Calgary Bears' },
      { id: '5', name: 'Mike Smith', team: 'Edmonton Storm' },
    ]
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Star className="mr-2 h-4 w-4" />
            Select Three Stars
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500 fill-current" />
              Three Stars Selection
            </DialogTitle>
            <DialogDescription>
              Select the three stars of the game based on player performance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                <Star className="inline mr-1 h-4 w-4 text-yellow-500 fill-current" />
                First Star
              </label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedStars.first}
                onChange={(e) => setSelectedStars(prev => ({ ...prev, first: e.target.value }))}
              >
                <option value="">Select player...</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.team})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                <Star className="inline mr-1 h-4 w-4 text-gray-400 fill-current" />
                Second Star
              </label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedStars.second}
                onChange={(e) => setSelectedStars(prev => ({ ...prev, second: e.target.value }))}
              >
                <option value="">Select player...</option>
                {players.filter(p => p.id !== selectedStars.first).map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.team})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                <Star className="inline mr-1 h-4 w-4 text-amber-600 fill-current" />
                Third Star
              </label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedStars.third}
                onChange={(e) => setSelectedStars(prev => ({ ...prev, third: e.target.value }))}
              >
                <option value="">Select player...</option>
                {players.filter(p => p.id !== selectedStars.first && p.id !== selectedStars.second).map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.team})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button disabled={!selectedStars.first || !selectedStars.second || !selectedStars.third}>
              Save Three Stars
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}

export const ThreeStarsSelection: Story = {
  name: 'Tournament: Three Stars Selection',
  render: () => <ThreeStarsSelectionComponent />,
}

// Goal recording dialog
function GoalRecordingComponent() {
  const [goalData, setGoalData] = useState({
    scorer: '',
    assist1: '',
    assist2: '',
    goalType: 'even_strength',
  })
    
    const homePlayers = [
      { id: '1', name: 'Connor McDavid', number: '97' },
      { id: '2', name: 'Leon Draisaitl', number: '29' },
      { id: '3', name: 'Stuart Skinner', number: '74' },
    ]
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Goal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Goal - Calgary Bears</DialogTitle>
            <DialogDescription>
              Period 2 • 7:23 remaining
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Scorer *</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={goalData.scorer}
                onChange={(e) => setGoalData(prev => ({ ...prev, scorer: e.target.value }))}
              >
                <option value="">Select scorer...</option>
                {homePlayers.map(player => (
                  <option key={player.id} value={player.id}>
                    #{player.number} {player.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Assist</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={goalData.assist1}
                  onChange={(e) => setGoalData(prev => ({ ...prev, assist1: e.target.value }))}
                >
                  <option value="">None</option>
                  {homePlayers.filter(p => p.id !== goalData.scorer).map(player => (
                    <option key={player.id} value={player.id}>
                      #{player.number} {player.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Secondary Assist</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={goalData.assist2}
                  onChange={(e) => setGoalData(prev => ({ ...prev, assist2: e.target.value }))}
                >
                  <option value="">None</option>
                  {homePlayers.filter(p => p.id !== goalData.scorer && p.id !== goalData.assist1).map(player => (
                    <option key={player.id} value={player.id}>
                      #{player.number} {player.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Goal Type</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={goalData.goalType}
                onChange={(e) => setGoalData(prev => ({ ...prev, goalType: e.target.value }))}
              >
                <option value="even_strength">Even Strength</option>
                <option value="power_play">Power Play</option>
                <option value="short_handed">Short Handed</option>
                <option value="penalty_shot">Penalty Shot</option>
                <option value="empty_net">Empty Net</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button disabled={!goalData.scorer}>
              Record Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}

export const GoalRecording: Story = {
  name: 'Scorekeeper: Goal Recording',
  render: () => <GoalRecordingComponent />,
}

// Confirmation dialog
export const ConfirmationDialog: Story = {
  name: 'Confirmation: Delete Game',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Delete Game
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this game? This action cannot be undone.
            All game statistics and scores will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="text-sm">
            <div className="font-medium">Game 5: Calgary Bears vs Edmonton Storm</div>
            <div className="text-muted-foreground">July 15, 2024 • 2:00 PM</div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">
            Delete Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Team settings dialog
export const TeamSettings: Story = {
  name: 'Settings: Team Configuration',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Team Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Team Settings</DialogTitle>
          <DialogDescription>
            Configure team information and roster settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
              🐻
            </div>
            <div>
              <h3 className="font-semibold">Calgary Bears</h3>
              <p className="text-sm text-muted-foreground">Calgary, Alberta</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Primary Color</label>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded border bg-amber-600"></div>
                <input type="text" className="flex-1 p-2 border rounded-md" value="#D97706" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded border bg-amber-200"></div>
                <input type="text" className="flex-1 p-2 border rounded-md" value="#FED7AA" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Captain</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md" 
              value="Connor McDavid"
              placeholder="Team captain name"
            />
          </div>
          
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Active Roster</span>
              <Badge variant="outline" className="text-xs">
                <Users className="mr-1 h-3 w-3" />
                20 players
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum 20 players allowed on game roster
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Mobile responsive dialog
export const MobileDialog: Story = {
  name: 'Mobile: Quick Actions',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Quick Actions</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Quick Actions</DialogTitle>
          <DialogDescription>
            Choose an action for the current game
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-20">
            <div className="text-center">
              <Plus className="mx-auto mb-1 h-6 w-6" />
              <div className="text-sm">Goal</div>
            </div>
          </Button>
          <Button variant="destructive" className="h-20">
            <div className="text-center">
              <div className="mx-auto mb-1 h-6 w-6 rounded-full bg-white flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-current"></div>
              </div>
              <div className="text-sm">Penalty</div>
            </div>
          </Button>
          <Button variant="outline" className="h-20">
            <div className="text-center">
              <div className="mx-auto mb-1 h-6 w-6 rounded-full border-2 border-current"></div>
              <div className="text-sm">Faceoff</div>
            </div>
          </Button>
          <Button variant="secondary" className="h-20">
            <div className="text-center">
              <Star className="mx-auto mb-1 h-6 w-6" />
              <div className="text-sm">3 Stars</div>
            </div>
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" className="w-full">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Loading state dialog
export const LoadingDialog: Story = {
  name: 'State: Loading',
  render: () => (
    <Dialog defaultOpen>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Saving Game Data</DialogTitle>
          <DialogDescription>
            Please wait while we save the game statistics...
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="text-sm">Uploading...</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button disabled>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Saving...
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Success state dialog
export const SuccessDialog: Story = {
  name: 'State: Success',
  render: () => (
    <Dialog defaultOpen>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-700">
            <Trophy className="mr-2 h-5 w-5" />
            Goal Recorded!
          </DialogTitle>
          <DialogDescription>
            The goal has been successfully added to the game.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="text-sm">
            <div className="font-medium">Connor McDavid (#97)</div>
            <div className="text-muted-foreground">Power play goal • Period 2 • 7:23</div>
            <div className="mt-2">
              <Badge className="bg-green-600 text-white">Calgary Bears: 9</Badge>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button className="w-full">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Controlled dialog example
function ControlledDialogComponent() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Controlled Dialog
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Dialog</DialogTitle>
            <DialogDescription>
              This dialog is controlled by external state.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Dialog is open: {open ? 'Yes' : 'No'}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const ControlledDialog: Story = {
  name: 'Controlled Dialog',
  render: () => <ControlledDialogComponent />,
}