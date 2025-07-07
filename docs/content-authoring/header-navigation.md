# Header Navigation Content Authoring Guide

This guide explains how to manage and author content for the Cowtown Showdown tournament website header using the Payload CMS admin interface.

## Overview

The header navigation is managed through Payload CMS Global settings, allowing you to dynamically configure navigation menu items without code changes. The header features western theming, live tournament indicators, and responsive mobile navigation.

## Accessing Header Settings

1. **Login to Admin Panel**
   - Navigate to `/admin` 
   - Login with your admin credentials

2. **Navigate to Globals**
   - Click on "Globals" in the left sidebar
   - Select "Header" from the globals list

## Header Navigation Structure

### Navigation Items Configuration

The header supports multiple navigation items with the following structure:

```
Home | Schedule | Standings | Teams | Stats | Scores | About | Register
```

### Required Navigation Items

For optimal tournament experience, include these core navigation items:

| Label | URL | Description |
|-------|-----|-------------|
| Home | `/` | Tournament homepage with live scores |
| Schedule | `/schedule` | Tournament schedule and game times |
| Standings | `/standings` | Team standings with 5-point system |
| Teams | `/teams` | Team profiles and rosters |
| Stats | `/stats` | Player and team statistics |
| Scores | `/scores` | Live scores and game center |
| About | `/about` | Tournament info, rules, venue details |
| Register | `/register` | Team registration form |

## Adding Navigation Items

### Step 1: Add New Navigation Item

1. In the Header global settings, find the "Nav Items" section
2. Click "Add Item" to create a new navigation entry
3. Configure the link settings:

### Step 2: Link Configuration Options

**Internal Page Link:**
- Type: `Reference`
- Reference: Select existing page from dropdown
- Label: Display text (e.g., "Teams")

**Custom URL Link:**
- Type: `Custom URL`
- URL: Enter full path (e.g., `/schedule`)
- Label: Display text (e.g., "Schedule")

**External Link:**
- Type: `Custom URL`
- URL: Full external URL (e.g., `https://example.com`)
- Label: Display text
- ✅ Check "Open in New Tab" for external links

### Step 3: Navigation Order

- Use drag-and-drop to reorder navigation items
- Recommended order: Home → Schedule → Standings → Teams → Stats → Scores → About → Register
- Most important items should be positioned first (left side on desktop)

## Content Guidelines

### Navigation Labels

**Best Practices:**
- Keep labels concise (1-2 words maximum)
- Use title case (e.g., "Live Scores" not "live scores")
- Be descriptive and clear
- Avoid technical jargon

**Examples:**
✅ **Good:** Teams, Schedule, Standings, Stats
❌ **Avoid:** Team Management System, Game Scheduling Interface

### URL Structure

**Internal URLs:**
- Use clean, descriptive paths: `/teams`, `/schedule`, `/standings`
- Avoid file extensions: `/about` not `/about.html`
- Use lowercase with hyphens: `/team-stats` not `/teamStats`

**External URLs:**
- Always use full URLs: `https://example.com/registration`
- Ensure links are secure (HTTPS)
- Test external links before publishing

## Live Tournament Features

The header automatically displays live tournament information when configured:

### Live Games Indicator
- Shows red pulsing badge when games are active
- Displays count: "2 Live Games" or "1 Live Game"
- Automatically updates during tournament

### Next Game Timer
- Shows next scheduled game time
- Format: "Next: 2:30 PM" or "Next: 10:00 AM Tomorrow"
- Helpful for attendees planning arrival

### Implementation
These features are controlled by the website's live scoring system and don't require manual content entry.

## Mobile Navigation

The header automatically provides mobile-friendly navigation:

- **Hamburger Menu:** Three-line menu icon on mobile devices
- **Full-Screen Menu:** Taps to reveal full navigation list
- **Touch-Friendly:** Large tap targets for easy mobile use
- **Auto-Close:** Menu closes when navigating to new page

No additional configuration needed - responsive behavior is automatic.

## Advanced Configuration

### Search Functionality

The header includes a search icon that links to `/search`. Ensure you have:
- Search page configured at `/search` URL
- Search functionality enabled in Payload settings
- Appropriate search content indexed

### Custom Styling

The header uses the tournament's western theme colors:
- **Primary Brown:** `#934F25` - Main brand color
- **Golden:** `#D6AC4D` - Accent color for icons
- **Dark Brown:** `#5E2713` - Darker variant

Colors are applied automatically - no manual configuration needed.

## Content Testing

### Pre-Launch Checklist

Before publishing navigation changes:

1. **Test All Links**
   - Click each navigation item
   - Verify correct page loads
   - Check external links open in new tabs

2. **Mobile Testing**
   - Test on mobile device or browser dev tools
   - Verify hamburger menu opens/closes
   - Ensure all links work on mobile

3. **Content Review**
   - Check spelling and grammar
   - Verify labels are clear and consistent
   - Ensure proper capitalization

### Tournament Day Setup

**Before Tournament Starts:**
- Verify all navigation links work
- Test mobile navigation thoroughly
- Ensure live game features display correctly
- Have backup contact for urgent navigation changes

**During Tournament:**
- Monitor live game indicators
- Check that navigation remains functional
- Be prepared to add emergency announcements if needed

## Troubleshooting

### Common Issues

**Navigation Item Not Appearing:**
- Check item is saved and published
- Verify URL is correct and page exists
- Clear browser cache and refresh

**Mobile Menu Not Working:**
- Check JavaScript is enabled
- Try different mobile device/browser
- Contact technical support if issue persists

**External Links Not Opening:**
- Verify URL includes `https://`
- Check "Open in New Tab" is enabled
- Test link directly in address bar

### Emergency Changes

For urgent navigation updates during the tournament:
1. Login to admin panel
2. Navigate to Header global settings
3. Make necessary changes
4. Save and publish immediately
5. Changes appear within 1-2 minutes

## Best Practices Summary

1. **Keep It Simple:** 6-8 main navigation items maximum
2. **Test Everything:** Verify all links before tournament
3. **Mobile First:** Always test mobile navigation
4. **Clear Labels:** Use descriptive, concise navigation labels
5. **Logical Order:** Most important pages first
6. **External Links:** Always open in new tabs
7. **Regular Updates:** Review navigation quarterly for improvements

## Support

For technical assistance with header navigation:
- **Documentation:** Refer to this guide and Payload CMS documentation
- **Testing:** Use Storybook at `/storybook` to preview components
- **Emergency Support:** Contact technical team during tournament hours

---

*This guide is part of the Cowtown Showdown tournament website documentation. Last updated with enhanced western theme and live tournament features.*