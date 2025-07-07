/**
 * @description Player selection dialog for statistics entry
 * @dependencies React hooks, shadcn/ui components, Payload types
 * @accessibility Keyboard navigation, ARIA labels, focus management
 * @performance Optimized for rapid player selection during live games
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
import { Search, User } from 'lucide-react'
import type { Player } from '@/payload-types'

interface PlayerSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roster: Player[]
  statType: string
  teamName: string
  onPlayerSelect: (player: Player, additionalData?: any) => void
}

export function PlayerSelectDialog({
  open,
  onOpenChange,
  roster,
  statType,
  teamName,
  onPlayerSelect,
}: PlayerSelectDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  // Filter players based on search term
  const filteredPlayers = roster.filter(player => 
    player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.jerseyNumber.toString().includes(searchTerm)
  )

  // Filter players by position if relevant to the stat
  const getRelevantPlayers = () => {
    if (statType === 'faceoff') {
      return filteredPlayers.filter(player => 
        player.primaryPosition === 'faceoff' || 
        player.primaryPosition === 'offence'
      )
    }
    if (statType === 'shot' || statType === 'goal') {
      return filteredPlayers.filter(player => player.playerType === 'runner')
    }
    return filteredPlayers
  }

  const relevantPlayers = getRelevantPlayers()

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player)
  }

  const handleConfirm = () => {
    if (selectedPlayer) {
      onPlayerSelect(selectedPlayer)
      setSelectedPlayer(null)
      setSearchTerm('')
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedPlayer(null)
    setSearchTerm('')
  }

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'offence':
        return 'bg-green-100 text-green-800'
      case 'defence':
        return 'bg-blue-100 text-blue-800'
      case 'transition':
        return 'bg-purple-100 text-purple-800'
      case 'faceoff':
        return 'bg-orange-100 text-orange-800'
      case 'goalie':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatDescription = () => {
    switch (statType) {
      case 'goal':
        return 'Who scored the goal?'
      case 'shot':
        return 'Who took the shot?'
      case 'faceoff':
        return 'Who won the faceoff?'
      case 'penalty':
        return 'Who committed the penalty?'
      case 'goalie_change':
        return 'Select the new goalie:'
      default:
        return 'Select a player:'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl capitalize">
            {statType} - {teamName} Team
          </DialogTitle>
          <DialogDescription>
            {getStatDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or jersey number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Player List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {relevantPlayers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No players found</p>
              </div>
            ) : (
              relevantPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedPlayer?.id === player.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-900 w-12 text-center">
                        #{player.jerseyNumber}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">
                          {player.firstName} {player.lastName}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getPositionColor(player.primaryPosition)}>
                            {player.primaryPosition}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {player.handedness} handed
                          </Badge>
                          {player.playerType === 'goalie' && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Goalie
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {selectedPlayer?.id === player.id && (
                      <div className="text-blue-500">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Position Filter Info */}
          {statType === 'faceoff' && (
            <div className="text-xs text-muted-foreground p-2 bg-gray-50 rounded">
              Showing faceoff specialists and offensive players
            </div>
          )}
          {(statType === 'shot' || statType === 'goal') && (
            <div className="text-xs text-muted-foreground p-2 bg-gray-50 rounded">
              Showing field players only (goalies excluded)
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPlayer}
            className="flex-1"
          >
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}