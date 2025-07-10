# Database Migration Notes for Header CMS Changes

## Changes Made

### Header Global Configuration
- Added `logo` field (upload relationship to media)
- Added `headerColumns` array field (max 4 items)
  - Each column has `title` group and `subMenuItems` array
- Added `cta` group field for call-to-action button
- Enhanced `link` fields with new properties:
  - `customPath` for internal custom paths
  - `hash` for URL fragments
  - Support for `teams` and `games` collections

## Migration Status

### Development Environment
✅ **Auto-migration recommended**: Payload CMS typically handles schema changes automatically in development when you start the server.

### Production Environment
⚠️ **Manual migration required**: For production deployments, create a proper migration file.

## Commands

### Check Migration Status
```bash
pnpm payload migrate:status
```

### Create Migration (Production)
```bash
pnpm payload migrate:create header_cms_updates
```

### Run Migrations
```bash
pnpm payload migrate
```

## Testing the Changes

1. **Start Development Server**
   ```bash
   pnpm dev
   ```
   - Payload will auto-detect schema changes
   - Visit `/admin` to see new header fields

2. **Verify TypeScript Types**
   ```bash
   pnpm payload generate:types
   ```
   - Ensures all types are current

3. **Test Header Configuration**
   - Go to `/admin/globals/header`
   - Configure logo, navigation columns, and CTA
   - Verify changes appear on frontend

## Database Tables Affected

- `header` global table (columns added)
- `media` table (for logo relationships)
- Potentially new relationship tables for header structure

## Rollback Plan

If issues occur, you can:
1. Revert the header config file changes
2. Run `pnpm payload generate:types`
3. Restart the development server

## Production Deployment Notes

Before deploying to production:
1. Create and test migration in staging environment
2. Backup database before running migrations
3. Run migration: `pnpm payload migrate`
4. Verify admin interface and frontend functionality

## Current Status

✅ Schema changes implemented
✅ TypeScript types generated
✅ Storybook stories updated
⏳ Migration creation (optional for development)
⏳ Testing in development environment