/**
 * @description Three stars selection dialog for post-game recognition
 * @dependencies React hooks, shadcn/ui components, player data
 * @accessibility Keyboard navigation, clear star hierarchy, screen reader support
 * @performance Optimized for immediate post-game selection
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
import { Crown, Star, Search, Trophy } from 'lucide-react'
import type { Player } from '@/payload-types'

interface ThreeStarsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameId: string
  homeRoster: Player[]
  awayRoster: Player[]
  onSubmit: (stars: {
    first: Player | null
    second: Player | null
    third: Player | null
  }) => void
}

export function ThreeStarsDialog({
  open,
  onOpenChange,
  gameId,
  homeRoster,
  awayRoster,
  onSubmit,
}: ThreeStarsDialogProps) {
  const [firstStar, setFirstStar] = useState<Player | null>(null)
  const [secondStar, setSecondStar] = useState<Player | null>(null)
  const [thirdStar, setThirdStar] = useState<Player | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const allPlayers = [...homeRoster, ...awayRoster]
  
  // Filter players based on search term
  const filteredPlayers = allPlayers.filter(player => 
    player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.jerseyNumber.toString().includes(searchTerm)
  )

  const isPlayerSelected = (player: Player): boolean => {
    return firstStar?.id === player.id || 
           secondStar?.id === player.id || 
           thirdStar?.id === player.id
  }

  const getStarNumber = (player: Player): number | null => {
    if (firstStar?.id === player.id) return 1
    if (secondStar?.id === player.id) return 2
    if (thirdStar?.id === player.id) return 3
    return null
  }

  const handlePlayerClick = (player: Player) => {
    const starNumber = getStarNumber(player)
    
    if (starNumber) {
      // Remove player from their current star position
      if (starNumber === 1) setFirstStar(null)
      if (starNumber === 2) setSecondStar(null)
      if (starNumber === 3) setThirdStar(null)
    } else {
      // Add player to next available star position
      if (!firstStar) {
        setFirstStar(player)
      } else if (!secondStar) {
        setSecondStar(player)
      } else if (!thirdStar) {
        setThirdStar(player)
      }
    }
  }

  const handleSubmit = () => {
    onSubmit({
      first: firstStar,
      second: secondStar,
      third: thirdStar,
    })
    handleCancel()
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFirstStar(null)
    setSecondStar(null)
    setThirdStar(null)
    setSearchTerm('')
  }

  const getTeamName = (player: Player): string => {
    return homeRoster.find(p => p.id === player.id) ? 'Home' : 'Away'
  }

  const getStarIcon = (starNumber: number) => {
    switch (starNumber) {
      case 1:
        return <Crown className="w-5 h-5 text-golden" />
      case 2:
        return <Star className="w-5 h-5 text-gray-400" />
      case 3:
        return <Star className="w-5 h-5 text-amber-600" />
      default:
        return null
    }
  }

  const getStarColor = (starNumber: number) => {
    switch (starNumber) {
      case 1:
        return 'bg-golden/20 text-primary-brown border-golden'
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-400'
      case 3:
        return 'bg-amber-100 text-amber-800 border-amber-400'
      default:
        return ''
    }
  }

  const canSubmit = firstStar !== null // At least first star is required

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-golden" />
            Select Three Stars
          </DialogTitle>
          <DialogDescription>
            Choose the top three players from the game. First star is required, 
            second and third stars are optional.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
          {/* Selected Stars */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Selected Stars</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* First Star */}
                <div className={`p-4 rounded-lg border-2 ${firstStar ? getStarColor(1) : 'border-dashed border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    {getStarIcon(1)}
                    <div className="flex-1">
                      <div className="font-semibold">First Star</div>
                      {firstStar ? (
                        <div>
                          <div className="text-lg">
                            #{firstStar.jerseyNumber} {firstStar.firstName} {firstStar.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getTeamName(firstStar)} • {firstStar.primaryPosition}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Click a player to select</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Second Star */}
                <div className={`p-4 rounded-lg border-2 ${secondStar ? getStarColor(2) : 'border-dashed border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    {getStarIcon(2)}
                    <div className="flex-1">
                      <div className="font-semibold">Second Star</div>
                      {secondStar ? (
                        <div>
                          <div className="text-lg">
                            #{secondStar.jerseyNumber} {secondStar.firstName} {secondStar.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getTeamName(secondStar)} • {secondStar.primaryPosition}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Optional</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Third Star */}
                <div className={`p-4 rounded-lg border-2 ${thirdStar ? getStarColor(3) : 'border-dashed border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    {getStarIcon(3)}
                    <div className="flex-1">
                      <div className="font-semibold">Third Star</div>
                      {thirdStar ? (
                        <div>
                          <div className="text-lg">
                            #{thirdStar.jerseyNumber} {thirdStar.firstName} {thirdStar.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getTeamName(thirdStar)} • {thirdStar.primaryPosition}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">Optional</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Player Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Select Players</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                </div>

                {/* Player List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPlayers.map((player) => {
                    const starNumber = getStarNumber(player)
                    const isSelected = isPlayerSelected(player)
                    
                    return (
                      <div
                        key={player.id}
                        onClick={() => handlePlayerClick(player)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                          isSelected 
                            ? `${getStarColor(starNumber!)}` 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-xl font-bold text-gray-900 w-8 text-center">
                              #{player.jerseyNumber}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {player.firstName} {player.lastName}
                              </div>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {getTeamName(player)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {player.primaryPosition}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="flex items-center gap-2">
                              {getStarIcon(starNumber!)}
                              <span className="text-sm font-medium">
                                {starNumber === 1 ? '1st' : starNumber === 2 ? '2nd' : '3rd'} Star
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Instructions:</strong> Click players to assign them as stars. 
            Click again to remove. First star is required, others are optional.
            Stars are typically awarded for outstanding performance, game-winning goals, 
            exceptional saves, or overall excellence.
          </div>
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
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1"
          >
            Confirm Three Stars
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}