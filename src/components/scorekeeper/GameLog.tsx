/**
 * @description Game event log showing chronological game statistics
 * @dependencies React hooks, shadcn/ui components, event data types
 * @accessibility Keyboard navigation, screen reader support, clear event descriptions
 * @performance Virtualized list for high-frequency event logging
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MoreVertical, 
  Target, 
  AlertTriangle, 
  Users, 
  Clock, 
  RotateCcw,
  Crown,
  Edit2,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface GameEvent {
  id: string
  type: string
  timestamp: string
  data: any
  period: number | string
  gameTime: string
}

interface GameLogProps {
  gameId: string
  events: GameEvent[]
  onEditEvent?: (eventId: string) => void
  onDeleteEvent?: (eventId: string) => void
}

export function GameLog({
  gameId,
  events,
  onEditEvent,
  onDeleteEvent,
}: GameLogProps) {
  const [filter, setFilter] = useState<string>('all')

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return <Target className="w-4 h-4 text-green-600" />
      case 'shot':
        return <Target className="w-4 h-4 text-blue-600" />
      case 'penalty':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'faceoff':
        return <Users className="w-4 h-4 text-purple-600" />
      case 'timeout':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'goalie_change':
        return <RotateCcw className="w-4 h-4 text-orange-600" />
      case 'three_stars':
        return <Crown className="w-4 h-4 text-golden" />
      case 'start_period':
        return <div className="w-4 h-4 bg-green-500 rounded-full" />
      case 'end_period':
        return <div className="w-4 h-4 bg-red-500 rounded-full" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const getEventDescription = (event: GameEvent): string => {
    const { type, data } = event
    
    switch (type) {
      case 'goal':
        return `GOAL: #${data.playerNumber} ${data.playerName} (${data.team})`
      case 'shot':
        return `Shot: #${data.playerNumber} ${data.playerName} (${data.team})`
      case 'penalty':
        return `PENALTY: #${data.playerNumber} ${data.playerName} - ${data.penaltyName} (${data.duration})`
      case 'faceoff':
        return `Faceoff won by #${data.playerNumber} ${data.playerName} (${data.team})`
      case 'timeout':
        return `Timeout called by ${data.team} team`
      case 'goalie_change':
        return `Goalie change: #${data.playerNumber} ${data.playerName} enters (${data.team})`
      case 'three_stars':
        return `Three Stars: 1st: ${data.first?.name}, 2nd: ${data.second?.name}, 3rd: ${data.third?.name}`
      case 'start_period':
        return `Period ${data.period} started`
      case 'end_period':
        return `Period ${data.period} ended`
      case 'start_game':
        return 'Game started'
      case 'end_game':
        return 'Game ended'
      default:
        return `${type}: ${JSON.stringify(data)}`
    }
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'goal':
        return 'bg-green-100 text-green-800'
      case 'shot':
        return 'bg-blue-100 text-blue-800'
      case 'penalty':
        return 'bg-red-100 text-red-800'
      case 'faceoff':
        return 'bg-purple-100 text-purple-800'
      case 'timeout':
        return 'bg-yellow-100 text-yellow-800'
      case 'goalie_change':
        return 'bg-orange-100 text-orange-800'
      case 'three_stars':
        return 'bg-golden/20 text-primary-brown'
      case 'start_period':
      case 'end_period':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true
    return event.type === filter
  })

  const eventTypes = [...new Set(events.map(event => event.type))]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Game Log</CardTitle>
          <Badge variant="outline">
            {filteredEvents.length} events
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Controls */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
          >
            All
          </Button>
          {eventTypes.map(type => (
            <Button
              key={type}
              onClick={() => setFilter(type)}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
              className="capitalize"
            >
              {type.replace('_', ' ')}
            </Button>
          ))}
        </div>

        {/* Events List */}
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No events yet</p>
                <p className="text-sm">Game events will appear here as they happen</p>
              </div>
            ) : (
              filteredEvents
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((event, index) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    {/* Event Icon */}
                    <div className="mt-1">
                      {getEventIcon(event.type)}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {getEventDescription(event)}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getEventBadgeColor(event.type)} size="sm">
                              {event.type.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              P{event.period} • {formatTime(event.timestamp)}
                            </span>
                            {event.gameTime && (
                              <span className="text-xs text-muted-foreground">
                                @ {event.gameTime}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Event Actions */}
                        {(onEditEvent || onDeleteEvent) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onEditEvent && (
                                <DropdownMenuItem onClick={() => onEditEvent(event.id)}>
                                  <Edit2 className="w-3 h-3 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {onDeleteEvent && (
                                <DropdownMenuItem 
                                  onClick={() => onDeleteEvent(event.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-3 h-3 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.type === 'goal').length}
            </div>
            <div className="text-xs text-muted-foreground">Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {events.filter(e => e.type === 'penalty').length}
            </div>
            <div className="text-xs text-muted-foreground">Penalties</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}