/**
 * @description
 * Utility function to resolve link URLs from CMS link objects.
 * Handles both reference-type links (internal pages/posts/teams/games) and custom-type links (external URLs, tel:, mailto:, etc.).
 *
 * @param link - The link object from the CMS
 * @returns The resolved URL string, or '#' as fallback
 */
export const resolveLinkUrl = (link: unknown): string => {
  if (!link || typeof link !== 'object') return '#'

  const linkObj = link as Record<string, unknown>

  // Handle custom type links (external URLs, tel:, mailto:, etc.)
  if (linkObj.type === 'custom') {
    // Use the custom URL if available (for external links, tel:, mailto:)
    if (typeof linkObj.url === 'string') return linkObj.url
    // Fall back to customPath for internal custom paths
    if (typeof linkObj.customPath === 'string') return linkObj.customPath
  }

  // Handle reference type links (internal pages/posts/teams/games)
  if (
    linkObj.type === 'reference' &&
    linkObj.reference &&
    typeof linkObj.reference === 'object'
  ) {
    const reference = linkObj.reference as Record<string, unknown>
    
    if (reference.value && typeof reference.value === 'object') {
      const referenceValue = reference.value as Record<string, unknown>
      const slug = referenceValue.slug as string
      const relationTo = reference.relationTo as string

      if (slug) {
        // For pages, use direct slug unless it's home page
        if (relationTo === 'pages') {
          const baseUrl = slug === 'home' ? '/' : `/${slug}`
          return typeof linkObj.hash === 'string' ? `${baseUrl}${linkObj.hash}` : baseUrl
        }
        // For posts, add the blog prefix
        if (relationTo === 'posts') {
          const baseUrl = `/blog/${slug}`
          return typeof linkObj.hash === 'string' ? `${baseUrl}${linkObj.hash}` : baseUrl
        }
        // For teams, add the teams prefix
        if (relationTo === 'teams') {
          const baseUrl = `/teams/${slug}`
          return typeof linkObj.hash === 'string' ? `${baseUrl}${linkObj.hash}` : baseUrl
        }
        // For games, add the games prefix
        if (relationTo === 'games') {
          const baseUrl = `/games/${slug}`
          return typeof linkObj.hash === 'string' ? `${baseUrl}${linkObj.hash}` : baseUrl
        }
      }
    }
  }

  return '#'
}