# YouTube Embed Content Authoring Guide

## Overview

The YouTube Embed block allows you to add YouTube videos and live streams to any page on the Cowtown Showdown website. This guide will walk you through adding, configuring, and managing YouTube content in the CMS.

## Quick Start

### Adding a YouTube Video

1. **Navigate to Pages** in the Payload CMS admin panel
2. **Create a new page** or edit an existing one
3. In the content area, click **"Add Block"**
4. Select **"YouTube Embed"** from the available blocks
5. Paste your YouTube URL into the **YouTube URL** field
6. Click **Save** to publish your changes

That's it! Your video will now appear on the page.

## Supported YouTube URL Formats

The YouTube Embed block accepts several URL formats:

### ✅ Supported Formats

- **Standard Watch URL**: `https://www.youtube.com/watch?v=VIDEO_ID`
- **Short URL**: `https://youtu.be/VIDEO_ID`
- **Live Stream URL**: `https://www.youtube.com/live/VIDEO_ID`
- **Embed URL**: `https://www.youtube.com/embed/VIDEO_ID`

### ❌ Not Supported

- Playlist URLs
- Channel URLs
- YouTube Shorts URLs
- Private or unlisted videos (unless you have access)

## Field Configuration

### Required Fields

#### YouTube URL
- **What it is**: The web address of the YouTube video
- **How to get it**: 
  1. Go to the YouTube video
  2. Click "Share" below the video
  3. Copy the URL provided
- **Example**: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

### Optional Fields

#### Title
- **What it is**: A heading that appears above the video
- **When to use**: To provide context or introduce the video
- **Example**: "Game 1 Highlights - Bears vs Eagles"

#### Autoplay
- **What it is**: Makes the video start playing automatically
- **Important**: Autoplay requires the video to be muted
- **When to use**: For background videos or live streams
- **Default**: Off (unchecked)

#### Muted
- **What it is**: Starts the video with sound muted
- **When to use**: Required for autoplay, or for background videos
- **Default**: On (checked)

#### Show Controls
- **What it is**: Shows play/pause buttons and video timeline
- **When to use**: Always, unless creating a background video
- **Default**: On (checked)

#### Aspect Ratio
- **What it is**: The shape/dimensions of the video player
- **Options**:
  - **16:9 (Widescreen)** - Standard for most YouTube videos
  - **4:3 (Standard)** - Older video format
  - **21:9 (Ultrawide)** - Cinematic format
  - **1:1 (Square)** - Social media style
- **Default**: 16:9 (Widescreen)

#### Privacy Enhanced Mode
- **What it is**: Uses YouTube's privacy-enhanced domain
- **Benefits**: Reduces tracking cookies for viewers
- **When to use**: Always recommended for visitor privacy
- **Default**: On (checked)

## Common Use Cases

### 1. Game Highlights

Perfect for showcasing memorable moments from games.

**Configuration**:
- Title: "Game 3 Highlights - Championship Match"
- Autoplay: Off
- Show Controls: On
- Aspect Ratio: 16:9

### 2. Live Game Stream

For broadcasting games in real-time.

**Configuration**:
- Title: "LIVE: Calgary Bears vs Edmonton Eagles"
- Autoplay: On
- Muted: On (required for autoplay)
- Show Controls: On
- Aspect Ratio: 16:9

### 3. Background Video

For atmospheric or decorative video content.

**Configuration**:
- Title: (leave empty)
- Autoplay: On
- Muted: On
- Show Controls: Off
- Aspect Ratio: 21:9 (for cinematic feel)

### 4. Player Interviews

For post-game interviews or player features.

**Configuration**:
- Title: "Post-Game Interview with Team Captain"
- Autoplay: Off
- Show Controls: On
- Aspect Ratio: 16:9

## Best Practices

### 1. Video Selection

- **Quality**: Use high-quality videos (720p or higher)
- **Length**: Consider your audience - shorter is often better
- **Relevance**: Ensure videos relate to the page content
- **Rights**: Only use videos you have permission to embed

### 2. Page Performance

- **Limit Videos**: Don't add too many videos to one page
- **Below the Fold**: Place videos lower on the page when possible
- **Loading Time**: Test page load speed after adding videos

### 3. Accessibility

- **Titles**: Always provide descriptive titles for screen readers
- **Context**: Add text descriptions near videos
- **Captions**: Use YouTube videos with closed captions when available

### 4. Mobile Experience

- **Preview**: Always check how videos look on mobile devices
- **Data Usage**: Consider mobile users' data limits
- **Touch Controls**: Ensure controls are easily tappable

## Managing Live Streams

### For Tournament Games

1. **Before the Game**:
   - Add the YouTube Embed block to the game page
   - Paste the live stream URL (get from your streaming team)
   - Set Autoplay: On, Muted: On
   - Save the page

2. **During the Game**:
   - The stream will automatically show as "LIVE"
   - No additional changes needed

3. **After the Game**:
   - The same URL will show the recorded game
   - Update the title from "LIVE:" to "Replay:"
   - Consider turning off autoplay

### Homepage Live Stream

The homepage automatically detects and displays live games:
- No manual intervention needed
- System checks for games with status "live" and YouTube URLs
- Stream appears in the featured section

## Troubleshooting

### Video Not Showing

**Problem**: Blank space where video should be

**Solutions**:
1. Check the URL is correct and complete
2. Ensure the video is public (not private)
3. Try copying the URL again from YouTube
4. Clear your browser cache

### "Invalid YouTube URL" Error

**Problem**: Error message when saving

**Solutions**:
1. Use the "Share" button on YouTube to get the correct URL
2. Remove any extra text or spaces
3. Make sure it's a video URL, not a channel or playlist

### Video Not Playing

**Problem**: Video loads but won't play

**Solutions**:
1. Check if the video is restricted in your region
2. Ensure browser allows YouTube embeds
3. Try a different browser
4. Check your internet connection

### Autoplay Not Working

**Problem**: Video doesn't start automatically

**Solutions**:
1. Make sure "Muted" is also checked (required for autoplay)
2. Note: Some browsers block autoplay regardless
3. Mobile devices often prevent autoplay to save data

## Tips for Success

### 1. Planning Your Content

- **Storyboard**: Plan where videos fit in your content flow
- **Balance**: Mix videos with text and images
- **Purpose**: Each video should serve a clear purpose

### 2. Creating Playlists

While playlists aren't directly supported, you can:
1. Add multiple YouTube Embed blocks
2. Arrange them in order on your page
3. Title each video in the sequence

### 3. Updating Videos

To replace a video:
1. Edit the page
2. Find the YouTube Embed block
3. Replace the URL with the new video
4. Update the title if needed
5. Save changes

### 4. SEO Considerations

- **Titles**: Use descriptive titles with keywords
- **Context**: Surround videos with relevant text
- **Descriptions**: Add text that explains the video content

## Examples

### Example 1: Game Highlights Page

```
Title: "Cowtown Showdown 2024 - Day 1 Highlights"
URL: https://www.youtube.com/watch?v=abc123
Autoplay: Off
Muted: Off
Show Controls: On
Aspect Ratio: 16:9
Privacy Enhanced: On
```

### Example 2: Live Tournament Stream

```
Title: "LIVE: Championship Game - Bears vs Eagles"
URL: https://www.youtube.com/live/xyz789
Autoplay: On
Muted: On
Show Controls: On
Aspect Ratio: 16:9
Privacy Enhanced: On
```

### Example 3: Player Feature

```
Title: "Player Spotlight: John Smith #99"
URL: https://youtu.be/def456
Autoplay: Off
Muted: Off
Show Controls: On
Aspect Ratio: 16:9
Privacy Enhanced: On
```

## Frequently Asked Questions

### Q: Can I embed private YouTube videos?
**A**: No, only public YouTube videos can be embedded. Unlisted videos work if you have the link.

### Q: Why won't my video autoplay?
**A**: Autoplay requires the video to be muted. Also, some browsers and mobile devices block autoplay to save bandwidth.

### Q: Can I embed YouTube playlists?
**A**: Currently, only individual videos are supported. To create a playlist effect, add multiple YouTube Embed blocks in sequence.

### Q: How do I know if a video is live?
**A**: YouTube automatically shows a "LIVE" indicator on live streams. The video player will display this.

### Q: Can I customize the video player colors?
**A**: No, YouTube controls the player appearance. You can only show/hide controls.

### Q: Will embedded videos slow down my page?
**A**: Videos load lazily (only when needed), but too many videos on one page can impact performance. Limit to 2-3 videos per page.

### Q: Do embedded videos work on mobile?
**A**: Yes, the YouTube Embed block is fully responsive and works on all devices.

### Q: Can I track who watches the videos?
**A**: YouTube provides basic analytics to the video owner. The website doesn't track individual video views.

## Need Help?

If you encounter issues not covered in this guide:

1. **Check the video on YouTube** - Ensure it plays correctly there
2. **Try a different video** - Test if the issue is video-specific
3. **Contact the web team** - For persistent technical issues

Remember: The YouTube Embed block is designed to be simple and reliable. When in doubt, paste the URL and use default settings!