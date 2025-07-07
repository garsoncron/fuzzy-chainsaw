/**
 * @description Dialog for claiming games with confirmation
 * @dependencies React, Dialog component, API calls
 * @accessibility Focus management, keyboard navigation, screen reader support
 * @performance Optimistic updates, error handling
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
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Game } from '@/payload-types'

interface GameClaimDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  game: Game | null
  onClaim: () => void
}

export function GameClaimDialog({ open, onOpenChange, game, onClaim }: GameClaimDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClaim = async () => {
    if (!game) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/games/${game.id}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to claim game')
      }

      onClaim()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim game')
    } finally {
      setIsLoading(false)
    }
  }

  if (!game) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Claim Game</DialogTitle>
          <DialogDescription>
            Are you sure you want to claim this game for scoring?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Game Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Game {game.gameNumber}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Teams:</span>
                <span>
                  {typeof game.homeTeam === 'object' ? game.homeTeam.name : 'TBD'} vs{' '}
                  {typeof game.awayTeam === 'object' ? game.awayTeam.name : 'TBD'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Scheduled:</span>
                <span>{formatDateTime(game.scheduledTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span className="capitalize">{game.gameType} Game</span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• You can only manage one game at a time</li>
              <li>• You must release this game before claiming another</li>
              <li>• You can edit game statistics during and after the game</li>
              <li>• Three stars must be selected immediately after the game</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClaim}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Claiming...' : 'Claim Game'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}