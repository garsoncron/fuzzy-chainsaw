# Cowtown Showdown - Production Deployment Guide

## 🚀 Quick Start Deployment Options

### Option 1: Vercel (Recommended - Easiest)
**Best for:** Quick deployment, automatic scaling, global CDN

1. **Fork/Import Repository**
   ```bash
   # If repository access issues persist, create new repo:
   gh repo create garsoncron/fuzzy-chainsaw --public
   git remote set-url origin https://github.com/garsoncron/fuzzy-chainsaw.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Deploy automatically

3. **Database Setup**
   - Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for PostgreSQL
   - Get connection string and add to Vercel environment variables

### Option 2: Railway (Full-Stack)
**Best for:** Integrated database + app hosting

1. **Deploy to Railway**
   - Visit [railway.app](https://railway.app)
   - Connect GitHub repository
   - Add PostgreSQL addon
   - Configure environment variables

### Option 3: DigitalOcean App Platform
**Best for:** Predictable pricing, managed database

1. **Create Database**
   - Create managed PostgreSQL database
   - Note connection details

2. **Deploy App**
   - Connect repository to App Platform
   - Configure build/run commands
   - Set environment variables

## 🔧 Environment Variables Setup

### Required Production Variables

Copy `.env.production.example` to `.env.production.local` and configure:

```bash
# Database - PostgreSQL recommended for production
DATABASE_URI=postgresql://username:password@hostname:5432/cowtown_tournament_prod

# Security secrets - Generate strong unique values
PAYLOAD_SECRET=your-super-secure-payload-secret-here-min-32-chars
JWT_SECRET=your-jwt-signing-secret-here-min-32-chars
CSRF_SECRET=your-csrf-protection-secret-here

# Production domain - NO trailing slash
NEXT_PUBLIC_SERVER_URL=https://your-tournament-domain.com

# Optional but recommended
CRON_SECRET=your-cron-job-secret-here
PREVIEW_SECRET=your-preview-mode-secret-here
```

### Generate Secure Secrets

```bash
# Generate secure secrets (32+ characters each)
openssl rand -base64 32  # For PAYLOAD_SECRET
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For CSRF_SECRET
```

## 📊 Database Setup

### PostgreSQL (Recommended)

**Cloud Options:**
- **Neon** (Free tier available): [neon.tech](https://neon.tech)
- **Supabase** (Free tier): [supabase.com](https://supabase.com)
- **Railway** (Integrated): [railway.app](https://railway.app)
- **PlanetScale**: [planetscale.com](https://planetscale.com)

**Setup Steps:**
1. Create database instance
2. Get connection string
3. Run migrations: `pnpm payload migrate`
4. Seed tournament data: `pnpm seed:tournament`

### Tournament Data Import

**Required Data Setup:**
```bash
# 1. Create admin user (first user registration)
# Visit: https://your-domain.com/admin

# 2. Import teams (8 teams)
# Use admin panel or API endpoints

# 3. Import player rosters
# Max 20 on game roster, unlimited total

# 4. Create game schedule (22 games)
# Pool play + medal games

# 5. Create scorekeeper accounts
# Role: scorekeeper, assign to specific games
```

## 🌍 Domain & DNS Setup

### Custom Domain Configuration

1. **Purchase Domain** (recommended: tournament-focused)
   - Examples: `cowtownshowdown.com`, `tournamentname.ca`

2. **Configure DNS**
   ```
   # Vercel
   A    @    76.76.19.61
   CNAME www  your-app.vercel.app
   
   # Railway
   CNAME @    your-app.up.railway.app
   ```

3. **SSL Certificate**
   - Automatic with Vercel/Railway
   - Verify HTTPS works: `https://your-domain.com`

## 🔐 Security Checklist

### Pre-Production Security Audit

- [ ] **Environment Variables**
  - [ ] All secrets are 32+ characters
  - [ ] No secrets in code or config files
  - [ ] Production URLs configured

- [ ] **Database Security**
  - [ ] Connection uses SSL
  - [ ] Database user has minimal required permissions
  - [ ] Regular backups configured

- [ ] **Authentication**
  - [ ] Admin accounts use strong passwords
  - [ ] Scorekeeper accounts properly restricted
  - [ ] JWT expiration configured (4h scorekeepers, 24h admins)

- [ ] **API Security**
  - [ ] CSRF protection enabled
  - [ ] Rate limiting configured
  - [ ] Audit logging active

## 📈 Performance Optimization

### Production Optimizations

1. **Next.js Configuration**
   ```javascript
   // next.config.js already optimized
   - Image optimization enabled
   - Bundle analyzer ready
   - Compression enabled
   ```

2. **Database Performance**
   ```sql
   -- Key indexes (auto-created by Payload)
   CREATE INDEX idx_games_status ON games(status);
   CREATE INDEX idx_games_scheduled_time ON games(scheduled_time);
   CREATE INDEX idx_players_team ON players(team);
   ```

3. **CDN & Caching**
   - Static assets cached (auto with Vercel)
   - API responses cached where appropriate
   - Real-time updates optimized (1-second intervals)

### Load Testing for 500-900 Users

```bash
# Use Artillery.js for load testing
npm install -g artillery
artillery quick --count 100 --num 10 https://your-domain.com
```

## 🔍 Monitoring & Alerts

### Recommended Monitoring Setup

1. **Error Tracking**
   - [Sentry](https://sentry.io) for error monitoring
   - Add `SENTRY_DSN` environment variable

2. **Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com) (free)
   - Monitor: `/api/health` endpoint

3. **Performance Monitoring**
   - Vercel Analytics (built-in)
   - Google Analytics (optional)

4. **Database Monitoring**
   - Provider-specific dashboards
   - Query performance alerts

## 🚨 Emergency Procedures

### Rollback Plan

```bash
# 1. Identify last working commit
git log --oneline -10

# 2. Revert to stable version
git revert <commit-hash>
git push origin main

# 3. Emergency maintenance mode
# Deploy maintenance page if needed
```

### Common Issues & Solutions

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

**Database Connection Issues:**
- Verify connection string format
- Check firewall/security groups
- Verify SSL requirements

**Real-time Updates Not Working:**
- Check SSE endpoint accessibility
- Verify CORS configuration
- Monitor connection count

## 📋 Pre-Launch Checklist

### Technical Verification
- [ ] Build completes successfully
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate active
- [ ] Custom domain configured

### Tournament Setup
- [ ] 8 teams imported with captain info
- [ ] Player rosters loaded (max 20 on game roster)
- [ ] 22-game schedule created
- [ ] Admin accounts created
- [ ] Scorekeeper accounts created
- [ ] Game assignments configured

### Functionality Testing
- [ ] User authentication works
- [ ] Scorekeeper can claim games
- [ ] Live scoring functions
- [ ] Real-time updates working
- [ ] Three stars selection works
- [ ] Tournament standings calculate correctly
- [ ] Mobile interface responsive

### Performance Testing
- [ ] Load testing completed (500-900 users)
- [ ] Real-time updates stable under load
- [ ] Database performance acceptable
- [ ] Page load times < 3 seconds

## 🎯 Go-Live Timeline

**Day -7:** Complete technical setup
**Day -3:** Import tournament data
**Day -1:** Final testing and team training
**Day 0:** Tournament begins!

## 📞 Support Contacts

- **Technical Issues:** Check TROUBLESHOOTING_GUIDE.md
- **Database Issues:** Provider support documentation
- **Emergency:** Rollback procedures above

---

## 🔗 Useful Commands Reference

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Database
pnpm payload migrate        # Run database migrations
pnpm seed:tournament       # Seed tournament data
pnpm payload               # Access Payload CLI

# Testing
pnpm test                  # Run all tests
pnpm lint                  # Check code quality

# Deployment
git push origin main       # Deploy to production (via CI/CD)
```

**🏆 Ready to host the Cowtown Showdown tournament!**