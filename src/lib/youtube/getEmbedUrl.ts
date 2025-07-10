/**
 * YouTube embed URL generation options
 */
export interface YouTubeEmbedOptions {
  autoplay?: boolean
  mute?: boolean
  controls?: boolean
  loop?: boolean
  start?: number // Start time in seconds
  end?: number // End time in seconds
  showinfo?: boolean
  rel?: boolean // Show related videos
  modestbranding?: boolean
  playsinline?: boolean
  privacyEnhanced?: boolean
  cc_load_policy?: boolean // Show closed captions
  iv_load_policy?: 1 | 3 // 1 = show annotations, 3 = hide
  hl?: string // Language code
  color?: 'red' | 'white' // Progress bar color
}

/**
 * Generate YouTube embed URL with specified options
 * 
 * @param videoId - YouTube video ID
 * @param options - Embed options
 * @returns Complete embed URL
 */
export function getEmbedUrl(videoId: string, options: YouTubeEmbedOptions = {}): string {
  if (!videoId) return ''
  
  const {
    autoplay = false,
    mute = false,
    controls = true,
    loop = false,
    start,
    end,
    showinfo = false,
    rel = false,
    modestbranding = true,
    playsinline = true,
    privacyEnhanced = true,
    cc_load_policy = false,
    iv_load_policy = 3,
    hl,
    color = 'red'
  } = options
  
  // Use privacy-enhanced domain if requested
  const domain = privacyEnhanced ? 'youtube-nocookie.com' : 'youtube.com'
  
  // Build query parameters
  const params = new URLSearchParams()
  
  // Core parameters
  params.set('autoplay', autoplay ? '1' : '0')
  params.set('mute', (mute || autoplay) ? '1' : '0') // Force mute if autoplay
  params.set('controls', controls ? '1' : '0')
  params.set('rel', rel ? '1' : '0')
  params.set('modestbranding', modestbranding ? '1' : '0')
  params.set('playsinline', playsinline ? '1' : '0')
  params.set('showinfo', showinfo ? '1' : '0')
  params.set('iv_load_policy', String(iv_load_policy))
  params.set('color', color)
  
  // Optional parameters
  if (loop) {
    params.set('loop', '1')
    params.set('playlist', videoId) // Required for loop to work
  }
  
  if (start !== undefined && start > 0) {
    params.set('start', String(start))
  }
  
  if (end !== undefined && end > 0) {
    params.set('end', String(end))
  }
  
  if (cc_load_policy) {
    params.set('cc_load_policy', '1')
  }
  
  if (hl) {
    params.set('hl', hl)
  }
  
  return `https://www.${domain}/embed/${videoId}?${params.toString()}`
}

/**
 * Generate YouTube nocookie embed URL (privacy-enhanced)
 * 
 * @param videoId - YouTube video ID
 * @param options - Embed options (without privacyEnhanced)
 * @returns Privacy-enhanced embed URL
 */
export function getNoCookieEmbedUrl(videoId: string, options: Omit<YouTubeEmbedOptions, 'privacyEnhanced'> = {}): string {
  return getEmbedUrl(videoId, { ...options, privacyEnhanced: true })
}

/**
 * Generate YouTube Live embed URL with optimized settings
 * 
 * @param videoId - YouTube video ID
 * @param options - Additional embed options
 * @returns Live-optimized embed URL
 */
export function getLiveEmbedUrl(videoId: string, options: YouTubeEmbedOptions = {}): string {
  return getEmbedUrl(videoId, {
    ...options,
    autoplay: true,
    mute: true, // Required for autoplay
    playsinline: true,
    modestbranding: true,
    rel: false,
  })
}