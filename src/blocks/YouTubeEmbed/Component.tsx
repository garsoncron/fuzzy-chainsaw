/**
 * @description YouTube embed block component with responsive design and privacy features
 * @dependencies React, utility functions, UI components
 * @accessibility Iframe title, keyboard navigation support
 * @performance Lazy loading, optimized embed parameters
 */

'use client'

import React, { useMemo, useState } from 'react'
import { cn } from '@/utilities/ui'
import type { YouTubeEmbed as YouTubeEmbedProps } from '@/payload-types'

type Props = YouTubeEmbedProps & {
  className?: string
  id?: string
  blockType?: string
}

// Extract video ID from various YouTube URL formats
function extractVideoId(url: string): string | null {
  if (!url) return null

  // Remove any URL parameters that might interfere
  const cleanUrl = url.split('&')[0]

  // Try different patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

// Get the padding bottom percentage for aspect ratio
function getAspectRatioPadding(ratio: string): string {
  switch (ratio) {
    case '16:9':
      return '56.25%' // 9/16 * 100
    case '4:3':
      return '75%' // 3/4 * 100
    case '21:9':
      return '42.86%' // 9/21 * 100
    case '1:1':
      return '100%'
    default:
      return '56.25%' // Default to 16:9
  }
}

export const YouTubeEmbed: React.FC<Props> = (props) => {
  const {
    url,
    title,
    autoplay = false,
    muted = true,
    showControls = true,
    aspectRatio = '16:9',
    privacyEnhanced = true,
    className,
  } = props

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const videoId = useMemo(() => extractVideoId(url || ''), [url])

  const embedUrl = useMemo(() => {
    if (!videoId) return null

    const domain = privacyEnhanced ? 'youtube-nocookie.com' : 'youtube.com'
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted || autoplay ? '1' : '0', // Force mute if autoplay
      controls: showControls ? '1' : '0',
      rel: '0', // Don't show related videos
      modestbranding: '1', // Minimal YouTube branding
      playsinline: '1', // Play inline on mobile
    })

    return `https://www.${domain}/embed/${videoId}?${params.toString()}`
  }, [videoId, autoplay, muted, showControls, privacyEnhanced])

  if (!url) {
    return (
      <div className={cn('bg-muted rounded-lg p-8 text-center', className)}>
        <p className="text-muted-foreground">No YouTube URL provided</p>
      </div>
    )
  }

  if (!videoId || !embedUrl) {
    return (
      <div className={cn('bg-red-50 border border-red-200 rounded-lg p-8 text-center', className)}>
        <p className="text-red-700">Invalid YouTube URL. Please check the URL and try again.</p>
        <p className="text-sm text-red-600 mt-2">URL: {url}</p>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={cn('bg-red-50 border border-red-200 rounded-lg p-8 text-center', className)}>
        <p className="text-red-700">Failed to load YouTube video</p>
        <button
          onClick={() => {
            setHasError(false)
            setIsLoading(true)
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="text-2xl font-western text-primary-brown mb-4">{title}</h3>}

      <div className="relative w-full rounded-lg overflow-hidden bg-black">
        {/* Aspect ratio container */}
        <div
          className="relative w-full"
          style={{ paddingBottom: getAspectRatioPadding(aspectRatio || '16:9') }}
        >
          {/* Loading skeleton */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-brown border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading video...</p>
              </div>
            </div>
          )}

          {/* YouTube iframe */}
          <iframe
            src={embedUrl}
            title={title || 'YouTube video player'}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
          />
        </div>
      </div>

      {/* Privacy notice */}
      {privacyEnhanced && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This video uses enhanced privacy mode
        </p>
      )}
    </div>
  )
}

export default YouTubeEmbedBlock
