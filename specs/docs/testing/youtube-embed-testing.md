# YouTube Embed Testing Documentation

## Overview

This document outlines the testing procedures for the YouTube embed block feature in the Cowtown Showdown tournament website. The YouTube embed block allows content authors to embed live streams and video highlights throughout the site.

## Test Environment Setup

### Prerequisites
- Node.js 18+ installed
- Access to Payload CMS admin interface
- Test YouTube URLs (both live streams and regular videos)
- Multiple devices for responsive testing

### Test Data
```
Regular Video: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Short URL: https://youtu.be/dQw4w9WgXcQ
Live Stream: https://www.youtube.com/watch?v=jfKfPfyJRdk
Invalid URL: https://www.youtube.com/not-a-valid-url
```

## Unit Tests

### 1. URL Validation Tests

```typescript
// Test file: src/lib/youtube/__tests__/validateUrl.test.ts

describe('YouTube URL Validation', () => {
  test('validates standard watch URLs', () => {
    expect(validateYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
  })
  
  test('validates short URLs', () => {
    expect(validateYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true)
  })
  
  test('validates embed URLs', () => {
    expect(validateYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true)
  })
  
  test('rejects invalid URLs', () => {
    expect(validateYouTubeUrl('https://vimeo.com/123456')).toBe(false)
  })
})
```

### 2. Video ID Extraction Tests

```typescript
// Test file: src/lib/youtube/__tests__/extractVideoId.test.ts

describe('Video ID Extraction', () => {
  test('extracts from watch URLs', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })
  
  test('extracts from short URLs', () => {
    expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })
  
  test('handles URLs with extra parameters', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120s')).toBe('dQw4w9WgXcQ')
  })
  
  test('returns null for invalid URLs', () => {
    expect(extractVideoId('not-a-url')).toBe(null)
  })
})
```

### 3. Embed URL Generation Tests

```typescript
// Test file: src/lib/youtube/__tests__/getEmbedUrl.test.ts

describe('Embed URL Generation', () => {
  test('generates basic embed URL', () => {
    const url = getEmbedUrl('dQw4w9WgXcQ')
    expect(url).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ')
  })
  
  test('includes autoplay parameters', () => {
    const url = getEmbedUrl('dQw4w9WgXcQ', { autoplay: true })
    expect(url).toContain('autoplay=1')
    expect(url).toContain('mute=1') // Should force mute
  })
  
  test('respects privacy mode', () => {
    const url = getEmbedUrl('dQw4w9WgXcQ', { privacyEnhanced: false })
    expect(url).toContain('youtube.com')
    expect(url).not.toContain('youtube-nocookie.com')
  })
})
```

## Integration Tests

### 1. Component Rendering Tests

```typescript
// Test file: src/blocks/YouTubeEmbed/__tests__/Component.test.tsx

describe('YouTubeEmbed Component', () => {
  test('renders video with valid URL', () => {
    render(<YouTubeEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />)
    expect(screen.getByTitle('YouTube video player')).toBeInTheDocument()
  })
  
  test('shows error for invalid URL', () => {
    render(<YouTubeEmbed url="invalid-url" />)
    expect(screen.getByText(/Invalid YouTube URL/)).toBeInTheDocument()
  })
  
  test('displays loading state', () => {
    render(<YouTubeEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />)
    expect(screen.getByText('Loading video...')).toBeInTheDocument()
  })
  
  test('respects aspect ratio', () => {
    const { container } = render(
      <YouTubeEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" aspectRatio="4:3" />
    )
    const wrapper = container.querySelector('[style*="padding-bottom"]')
    expect(wrapper).toHaveStyle('padding-bottom: 75%')
  })
})
```

### 2. Storybook Visual Tests

Run Storybook and manually verify:
```bash
pnpm storybook
```

Navigate to `Blocks/YouTubeEmbed` and test:
- [ ] Default story renders correctly
- [ ] Live stream story shows proper title
- [ ] Error states display appropriate messages
- [ ] All aspect ratios maintain proper proportions
- [ ] Mobile story is responsive

## E2E Tests

### 1. CMS Integration Test

```typescript
// Test file: e2e/youtube-embed.spec.ts

test('YouTube embed block in CMS', async ({ page }) => {
  // Login to admin
  await page.goto('/admin')
  await page.fill('#email', 'admin@example.com')
  await page.fill('#password', 'password')
  await page.click('button[type="submit"]')
  
  // Create new page
  await page.click('text=Pages')
  await page.click('text=Create new')
  
  // Add YouTube embed block
  await page.click('text=Add block')
  await page.click('text=YouTube Embed')
  
  // Fill in YouTube URL
  await page.fill('input[name="layout.0.url"]', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  await page.fill('input[name="layout.0.title"]', 'Test Video')
  
  // Save and preview
  await page.click('text=Save')
  await expect(page.locator('text=Successfully saved')).toBeVisible()
})
```

### 2. Frontend Display Test

```typescript
test('YouTube embed displays on frontend', async ({ page }) => {
  await page.goto('/test-page-with-video')
  
  // Check video is present
  const iframe = await page.locator('iframe[title="Test Video"]')
  await expect(iframe).toBeVisible()
  
  // Verify embed URL structure
  const src = await iframe.getAttribute('src')
  expect(src).toContain('youtube-nocookie.com/embed/')
  expect(src).toContain('controls=1')
})
```

## Manual Testing Checklist

### Content Author Testing

1. **Block Creation**
   - [ ] Can add YouTube embed block to a page
   - [ ] URL field validates properly
   - [ ] Optional fields work as expected
   - [ ] Block saves without errors

2. **URL Support**
   - [ ] Standard watch URLs work
   - [ ] Short URLs (youtu.be) work
   - [ ] Live stream URLs work
   - [ ] Invalid URLs show error message

3. **Configuration Options**
   - [ ] Title displays when provided
   - [ ] Autoplay works (with mute)
   - [ ] Controls can be hidden
   - [ ] All aspect ratios work correctly
   - [ ] Privacy mode indicator shows

### Frontend Testing

1. **Desktop Testing**
   - [ ] Video loads and plays
   - [ ] Responsive sizing works
   - [ ] Loading state appears briefly
   - [ ] Error states display correctly

2. **Mobile Testing (iOS/Android)**
   - [ ] Video is full-width on mobile
   - [ ] Touch controls work
   - [ ] Landscape rotation handled
   - [ ] Playback works inline

3. **Browser Compatibility**
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari
   - [ ] Mobile browsers

### Performance Testing

1. **Page Load**
   - [ ] Lazy loading prevents initial load blocking
   - [ ] Video doesn't autoplay without user interaction
   - [ ] Multiple videos on page don't cause issues

2. **Network Conditions**
   - [ ] Works on slow 3G
   - [ ] Handles network interruptions gracefully
   - [ ] Shows appropriate loading states

## Accessibility Testing

1. **Keyboard Navigation**
   - [ ] Can tab to video player
   - [ ] Space/Enter starts playback
   - [ ] Escape exits fullscreen

2. **Screen Reader**
   - [ ] iframe has descriptive title
   - [ ] Loading states announced
   - [ ] Error messages readable

3. **Visual**
   - [ ] Sufficient contrast for controls
   - [ ] Focus indicators visible
   - [ ] Text remains readable

## Security Testing

1. **URL Validation**
   - [ ] Only YouTube URLs accepted
   - [ ] XSS attempts blocked
   - [ ] Malformed URLs handled safely

2. **Content Security Policy**
   - [ ] CSP allows YouTube domains
   - [ ] No console errors about blocked content
   - [ ] Privacy-enhanced mode works

## Regression Testing

After any changes to YouTube embed:

1. [ ] Run all unit tests: `pnpm test`
2. [ ] Check Storybook stories still work
3. [ ] Verify existing pages with embeds still function
4. [ ] Test on scorekeeper tablets
5. [ ] Confirm live game detection still works

## Bug Reporting Template

```markdown
### Bug Description
[Clear description of the issue]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [etc.]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [e.g., Chrome 120]
- Device: [e.g., iPad Pro]
- OS: [e.g., iOS 17]

### Screenshots/Videos
[Attach any relevant media]

### Additional Context
[Any other relevant information]
```

## Test Coverage Goals

- Unit test coverage: > 90%
- Integration test coverage: > 80%
- E2E critical paths: 100%
- Manual testing: All checklist items

## Continuous Integration

GitHub Actions workflow runs:
- Unit tests on every PR
- Integration tests on merge to main
- E2E tests nightly
- Visual regression tests weekly