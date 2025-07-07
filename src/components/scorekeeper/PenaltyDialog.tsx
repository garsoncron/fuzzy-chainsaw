/**
 * @description Penalty entry dialog with RMLL infraction selection
 * @dependencies React hooks, shadcn/ui components, penalty definitions
 * @accessibility Keyboard navigation, ARIA labels, clear penalty descriptions
 * @performance Optimized for rapid penalty entry during live games
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Search, AlertTriangle, Clock } from 'lucide-react'
import type { Player } from '@/payload-types'

interface PenaltyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roster: Player[]
  teamName: string
  onSubmit: (penaltyData: any) => void
}

// RMLL Modified Rules penalty definitions
const PENALTIES = {
  minor: [
    { id: 'slashing', name: 'Slashing', duration: '2min', description: 'Illegal contact with stick' },
    { id: 'tripping', name: 'Tripping', duration: '2min', description: 'Using stick or body to trip opponent' },
    { id: 'interference', name: 'Interference', duration: '2min', description: 'Impeding player without ball' },
    { id: 'holding', name: 'Holding', duration: '2min', description: 'Restraining opponent illegally' },
    { id: 'illegal_pick', name: 'Illegal Pick', duration: '2min', description: 'Moving pick or pick within 5 yards of ball' },
    { id: 'cross_checking', name: 'Cross Checking', duration: '2min', description: 'Check with both hands on stick' },
    { id: 'elbowing', name: 'Elbowing', duration: '2min', description: 'Contact with elbow' },
    { id: 'roughing', name: 'Roughing', duration: '2min', description: 'Unnecessary physical contact' },
    { id: 'unsportsmanlike', name: 'Unsportsmanlike Conduct', duration: '2min', description: 'Poor sportsmanship' },
    { id: 'delay_of_game', name: 'Delay of Game', duration: '2min', description: 'Deliberately delaying game' },
    { id: 'illegal_substitution', name: 'Illegal Substitution', duration: '2min', description: 'Too many players or illegal change' },
    { id: 'crease_violation', name: 'Crease Violation', duration: '2min', description: 'Illegal entry into goal crease' },
    { id: 'over_and_back', name: 'Over and Back', duration: '2min', description: 'Failing to cross center line in 8 seconds' },
  ],
  major: [
    { id: 'high_sticking', name: 'High Sticking', duration: '5min', description: 'Stick contact above shoulders' },
    { id: 'boarding', name: 'Boarding', duration: '5min', description: 'Violent check into boards' },
    { id: 'face_masking', name: 'Face Masking', duration: '5min', description: 'Contact with face mask' },
    { id: 'fighting', name: 'Fighting', duration: '5min', description: 'Physical altercation' },
    { id: 'spearing', name: 'Spearing', duration: '5min', description: 'Jabbing with stick end' },
    { id: 'checking_from_behind', name: 'Checking from Behind', duration: '5min', description: 'Check from behind' },
  ],
  misconduct: [
    { id: 'misconduct', name: 'Misconduct', duration: '10min', description: 'Serious violation requiring removal' },
  ],
  game_misconduct: [
    { id: 'game_misconduct', name: 'Game Misconduct', duration: 'game', description: 'Ejection from game' },
  ],
  penalty_shot: [
    { id: 'penalty_shot', name: 'Penalty Shot', duration: 'penalty_shot', description: 'Severe infraction preventing scoring' },
  ],
}

export function PenaltyDialog({
  open,
  onOpenChange,
  roster,
  teamName,
  onSubmit,
}: PenaltyDialogProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [selectedPenalty, setSelectedPenalty] = useState<any>(null)
  const [penaltyType, setPenaltyType] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter players based on search term
  const filteredPlayers = roster.filter(player => 
    player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.jerseyNumber.toString().includes(searchTerm)
  )

  const handleSubmit = () => {
    if (!selectedPlayer || !selectedPenalty) return

    const penaltyData = {
      type: 'penalty',
      player: selectedPlayer.id,
      playerName: `${selectedPlayer.firstName} ${selectedPlayer.lastName}`,
      playerNumber: selectedPlayer.jerseyNumber,
      penalty: selectedPenalty.id,
      penaltyName: selectedPenalty.name,
      penaltyType,
      duration: selectedPenalty.duration,
      description: selectedPenalty.description,
    }

    onSubmit(penaltyData)
    handleCancel()
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedPlayer(null)
    setSelectedPenalty(null)
    setPenaltyType('')
    setSearchTerm('')
  }

  const getPenaltyTypeColor = (type: string) => {
    switch (type) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800'
      case 'major':
        return 'bg-red-100 text-red-800'
      case 'misconduct':
        return 'bg-purple-100 text-purple-800'
      case 'game_misconduct':
        return 'bg-red-900 text-white'
      case 'penalty_shot':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDurationIcon = (duration: string) => {
    if (duration === 'penalty_shot') return '🥅'
    if (duration === 'game') return '🚫'
    return <Clock className="w-3 h-3" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Penalty - {teamName} Team
          </DialogTitle>
          <DialogDescription>
            Select the player and penalty infraction
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
          {/* Player Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">1. Select Player</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name or number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Player List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => setSelectedPlayer(player)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedPlayer?.id === player.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-gray-900 w-8 text-center">
                          #{player.jerseyNumber}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {player.firstName} {player.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {player.primaryPosition}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Penalty Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">2. Select Penalty Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={penaltyType} onValueChange={setPenaltyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose penalty category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (2 minutes)</SelectItem>
                    <SelectItem value="major">Major (5 minutes)</SelectItem>
                    <SelectItem value="misconduct">Misconduct (10 minutes)</SelectItem>
                    <SelectItem value="game_misconduct">Game Misconduct</SelectItem>
                    <SelectItem value="penalty_shot">Penalty Shot</SelectItem>
                  </SelectContent>
                </Select>

                {/* Specific Penalty Selection */}
                {penaltyType && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Select specific infraction:
                    </div>
                    {PENALTIES[penaltyType as keyof typeof PENALTIES]?.map((penalty) => (
                      <div
                        key={penalty.id}
                        onClick={() => setSelectedPenalty(penalty)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                          selectedPenalty?.id === penalty.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{penalty.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {penalty.description}
                            </div>
                          </div>
                          <Badge className={getPenaltyTypeColor(penaltyType)}>
                            <span className="mr-1">{getDurationIcon(penalty.duration)}</span>
                            {penalty.duration}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary */}
        {selectedPlayer && selectedPenalty && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    #{selectedPlayer.jerseyNumber} {selectedPlayer.firstName} {selectedPlayer.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedPenalty.name} ({selectedPenalty.duration})
                  </div>
                </div>
                <Badge className={getPenaltyTypeColor(penaltyType)}>
                  {penaltyType.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedPlayer || !selectedPenalty}
            className="flex-1"
            variant="destructive"
          >
            Record Penalty
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}