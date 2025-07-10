/**
 * Validate YouTube URL format
 * 
 * @param url - URL to validate
 * @returns True if valid YouTube URL, false otherwise
 */
export function validateYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  // Comprehensive YouTube URL validation regex
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com\/(watch\?v=|embed\/|live\/|channel\/|c\/|user\/|@)|youtu\.be\/)[\w-]+(&[\w=]*)?$/
  
  return youtubeRegex.test(url)
}

/**
 * Check if URL is a YouTube Live stream URL
 * 
 * @param url - URL to check
 * @returns True if URL appears to be a live stream
 */
export function isYouTubeLiveUrl(url: string): boolean {
  if (!url) return false
  
  // Check for /live/ in the URL or live parameter
  return url.includes('/live/') || url.includes('&live=')
}

/**
 * Clean YouTube URL by removing unnecessary parameters
 * 
 * @param url - YouTube URL to clean
 * @returns Cleaned URL with only essential parameters
 */
export function cleanYouTubeUrl(url: string): string {
  if (!url) return ''
  
  try {
    const urlObj = new URL(url)
    const videoId = urlObj.searchParams.get('v')
    
    if (videoId) {
      // Reconstruct clean watch URL
      return `https://www.youtube.com/watch?v=${videoId}`
    }
    
    // For other formats, return as is but without extra params
    return urlObj.origin + urlObj.pathname
  } catch {
    // If URL parsing fails, return original
    return url
  }
}

/**
 * Get YouTube thumbnail URL from video ID
 * 
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality (default, medium, high, maxres)
 * @returns Thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  if (!videoId) return ''
  
  const qualityMap = {
    'default': 'default',
    'medium': 'mqdefault',
    'high': 'hqdefault',
    'maxres': 'maxresdefault'
  }
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}