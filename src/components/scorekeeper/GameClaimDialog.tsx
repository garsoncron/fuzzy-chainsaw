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
  currentUser: any
  onClaim: () => void
}

export function GameClaimDialog({ open, onOpenChange, game, currentUser, onClaim }: GameClaimDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClaim = async () => {
    if (!game) return

    setIsLoading(true)
    setError(null)

    try {
      console.log('🎮 Claiming game:', game.id)
      
      // Make the claim request to the API
      const response = await fetch(`/api/games/${game.id}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      })

      console.log('📡 Response status:', response.status)
      const responseData = await response.json()
      console.log('📊 Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to claim game')
      }

      console.log('✅ Game claimed successfully!')
      onClaim()
      onOpenChange(false)
    } catch (err) {
      console.error('❌ Claim error:', err)
      setError(err instanceof Error ? err.message : 'Failed to claim game')
    } finally {
      setIsLoading(false)
    }
  }

  if (!game) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary-brown dark:text-golden">🤠 Claim Game</DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300">
            Are you sure you want to claim this game for scoring?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Game Details */}
          <div className="p-4 bg-amber-50 dark:bg-gray-700 rounded-lg border border-primary-brown/20">
            <h3 className="font-semibold text-lg mb-2 text-primary-brown dark:text-golden">Game {game.gameNumber}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-800 dark:text-gray-200">Teams:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {typeof game.homeTeam === 'object' ? game.homeTeam.name : 'TBD'} vs{' '}
                  {typeof game.awayTeam === 'object' ? game.awayTeam.name : 'TBD'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-800 dark:text-gray-200">Scheduled:</span>
                <span className="text-gray-900 dark:text-gray-100">{formatDateTime(game.scheduledTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-800 dark:text-gray-200">Type:</span>
                <span className="capitalize text-gray-900 dark:text-gray-100">{game.gameType} Game</span>
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

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 border-primary-brown/30 text-primary-brown hover:bg-primary-brown/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClaim}
            disabled={isLoading}
            className="flex-1 bg-primary-brown hover:bg-dark-brown text-white"
          >
            {isLoading ? '🔄 Claiming...' : '🤝 Claim Game'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}