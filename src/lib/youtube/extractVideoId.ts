/**
 * Extract YouTube video ID from various URL formats
 * 
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID (without www)
 * 
 * @param url - YouTube URL to extract video ID from
 * @returns Video ID or null if not found/invalid
 */
export function extractVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null
  
  // Remove any URL parameters that might interfere
  const cleanUrl = url.split('&')[0]
  
  // Comprehensive regex pattern for various YouTube URL formats
  const patterns = [
    // Standard watch URL
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    // Short URL
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
    // Embed URL
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
    // Live URL
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([^&\n?#]+)/,
    // Mobile URL
    /(?:https?:\/\/)?m\.youtube\.com\/watch\?v=([^&\n?#]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern)
    if (match && match[1]) {
      // Validate that the ID looks correct (11 characters, alphanumeric + dash/underscore)
      const videoId = match[1]
      if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId
      }
    }
  }
  
  return null
}

/**
 * Extract channel ID from YouTube channel URLs
 * 
 * @param url - YouTube channel URL
 * @returns Channel ID or null if not found
 */
export function extractChannelId(url: string): string | null {
  if (!url || typeof url !== 'string') return null
  
  const patterns = [
    // Channel ID format
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([^\/\n?#]+)/,
    // Custom URL format (@username)
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([^\/\n?#]+)/,
    // Legacy username format
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([^\/\n?#]+)/,
    // C/ format (custom URL)
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([^\/\n?#]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}