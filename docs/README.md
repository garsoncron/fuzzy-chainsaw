# Cowtown Showdown Developer Documentation

Welcome to the comprehensive developer documentation for the Cowtown Showdown lacrosse tournament website. This documentation suite provides everything developers need to understand, contribute to, and maintain this tournament management system.

## 📋 Documentation Overview

### Core Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| **[API Reference](./API_REFERENCE.md)** | Complete API endpoint documentation with examples | Backend Developers, Frontend Developers |
| **[Backend Architecture](./BACKEND_ARCHITECTURE.md)** | Backend system design, database schema, and patterns | Backend Developers, DevOps |
| **[Frontend Architecture](./FRONTEND_ARCHITECTURE.md)** | Frontend structure, components, and state management | Frontend Developers, UI/UX |
| **[Component Reference](./COMPONENT_REFERENCE.md)** | React component documentation with usage examples | Frontend Developers |

### Development Guides

| Document | Description | Audience |
|----------|-------------|----------|
| **[Testing Guide](./TESTING_GUIDE.md)** | Testing strategies, patterns, and examples | All Developers |
| **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** | Deployment processes and production setup | DevOps, System Administrators |
| **[Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md)** | Common issues and debugging procedures | All Developers, Support Team |
| **[Contributing Guidelines](./CONTRIBUTING.md)** | How to contribute to the project | New Contributors, All Developers |

## 🚀 Quick Start for New Developers

### 1. First-Time Setup

```bash
# Clone the repository
git clone https://github.com/your-org/cowtown-nextjs-1.git
cd cowtown-nextjs-1

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start database
docker-compose up -d postgres

# Run migrations and seed data
pnpm payload migrate
pnpm run seed:tournament

# Start development server
pnpm dev
```

### 2. Essential Reading

For new developers, we recommend reading the documentation in this order:

1. **[Contributing Guidelines](./CONTRIBUTING.md)** - Development workflow and standards
2. **[Backend Architecture](./BACKEND_ARCHITECTURE.md)** - System overview and database design
3. **[Frontend Architecture](./FRONTEND_ARCHITECTURE.md)** - Component structure and patterns
4. **[API Reference](./API_REFERENCE.md)** - Available endpoints and usage
5. **[Testing Guide](./TESTING_GUIDE.md)** - How to write and run tests

### 3. Role-Specific Entry Points

#### Backend Developers
- Start with [Backend Architecture](./BACKEND_ARCHITECTURE.md)
- Review [API Reference](./API_REFERENCE.md)
- Understand database schema and Payload CMS integration

#### Frontend Developers
- Begin with [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
- Study [Component Reference](./COMPONENT_REFERENCE.md)
- Learn real-time SSE implementation patterns

#### DevOps Engineers
- Focus on [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Review [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md)
- Understand scaling considerations for tournament load

#### QA Engineers
- Study [Testing Guide](./TESTING_GUIDE.md)
- Learn tournament-specific testing scenarios
- Understand performance requirements (500-900 concurrent users)

## 🏆 Tournament System Overview

The Cowtown Showdown is a real-time tournament management system featuring:

### Core Features
- **Live Scoring**: Real-time game updates via Server-Sent Events
- **Tournament Management**: 8 teams, 22 games, 5-point scoring system
- **Scorekeeper Interface**: Mobile-optimized scoring tools
- **Public Scoreboard**: Live updates for spectators
- **Three Stars Recognition**: Post-game player awards

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Payload CMS 3.x, PostgreSQL, Node.js
- **Real-time**: Server-Sent Events (SSE)
- **Deployment**: Docker, nginx, Coolify

### Performance Requirements
- **Concurrent Users**: 500-900 during tournament events
- **Real-time Latency**: <1 second for score updates
- **Uptime**: 99.9% during tournament operations
- **Mobile Support**: Tablet-optimized scorekeeper interface

## 📁 Project Structure

```
cowtown-nextjs-1/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/         # Public tournament site
│   │   ├── (payload)/          # CMS admin interface
│   │   ├── api/                # API routes
│   │   └── scorekeeper/        # Scoring interface
│   ├── blocks/                 # Content management blocks
│   ├── collections/            # Payload CMS collections
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── tournament/         # Tournament-specific components
│   │   └── scorekeeper/        # Scoring interface components
│   ├── lib/                    # Utilities and helpers
│   └── hooks/                  # Custom React hooks
├── docs/                       # Documentation (this folder)
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── docker-compose.yml          # Development environment
├── Dockerfile                  # Production container
└── package.json                # Dependencies and scripts
```

## 🔧 Development Commands

### Essential Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Run ESLint
pnpm lint:fix              # Fix linting issues
pnpm type-check            # TypeScript checking

# Testing
pnpm test                   # Run all tests
pnpm test:unit             # Unit tests only
pnpm test:int              # Integration tests
pnpm test:e2e              # End-to-end tests
pnpm test:coverage         # Generate coverage report

# Database
pnpm payload migrate        # Run database migrations
pnpm payload generate:types # Generate TypeScript types
pnpm run seed:tournament   # Seed tournament data

# Utilities
pnpm analyze               # Analyze bundle size
```

### Docker Commands

```bash
# Development with Docker
docker-compose up          # Start all services
docker-compose up -d postgres  # Start database only
docker-compose logs -f app     # Follow application logs

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🎯 Key Concepts

### Tournament Rules (RMLL Modified)
- **12-minute periods** (pool play), **15-minute periods** (medal games)
- **30-second shot clock**
- **8-second center line crossing**
- **4-second crease violation**
- **5-point tournament system**

### 5-Point Tournament System
- **2 points** for game win
- **1 point** for game tie
- **1 point** per period win
- **0.5 points** per period tie
- **Maximum 5 points** per game

### Real-time Architecture
- **SSE connections** for live updates
- **Optimistic updates** for responsive UI
- **Connection pooling** for scalability
- **Automatic reconnection** on network issues

## 🔍 Finding Information

### Common Questions

| Question | Documentation |
|----------|---------------|
| How do I add a new API endpoint? | [API Reference](./API_REFERENCE.md) + [Backend Architecture](./BACKEND_ARCHITECTURE.md) |
| How do I create a new component? | [Component Reference](./COMPONENT_REFERENCE.md) + [Frontend Architecture](./FRONTEND_ARCHITECTURE.md) |
| How do I write tests for my code? | [Testing Guide](./TESTING_GUIDE.md) |
| How do I deploy to production? | [Deployment Guide](./DEPLOYMENT_GUIDE.md) |
| The application isn't working, how do I debug? | [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md) |
| How do I contribute to the project? | [Contributing Guidelines](./CONTRIBUTING.md) |

### Search Tips

1. **Use browser search (Ctrl/Cmd + F)** in documentation files
2. **Check code examples** in each guide
3. **Review related sections** - documents are cross-referenced
4. **Look at existing code** in the repository for patterns

## 🚨 Emergency Procedures

During tournament operations, critical issues require immediate attention:

### Quick Emergency Contacts
- **System Issues**: Check [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md)
- **Deployment Problems**: See [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- **Database Issues**: Backup/recovery procedures in deployment docs

### Emergency Debugging

```bash
# Quick health check
curl http://localhost:3000/api/health

# Check application logs
docker-compose logs --tail=100 app

# Check database connectivity
docker-compose exec postgres pg_isready

# Monitor system resources
docker stats
```

## 📊 Performance Monitoring

### Key Metrics to Monitor
- **Response Time**: API endpoints < 500ms
- **SSE Connections**: Active connection count
- **Database**: Query performance and connection pool
- **Memory Usage**: Application and database memory
- **Error Rate**: Application errors and failed requests

### Monitoring Tools
- **Health Endpoint**: `/api/health`
- **Database Performance**: Built-in PostgreSQL stats
- **Application Logs**: Structured JSON logging
- **Container Stats**: Docker monitoring

## 🔄 Release Process

### Development Workflow
1. **Feature Branch**: Create from `main`
2. **Development**: Follow coding standards
3. **Testing**: Write and run tests
4. **Pull Request**: Submit for review
5. **Review**: Code review and approval
6. **Merge**: Merge to `main`
7. **Deploy**: Automatic deployment to staging

### Production Releases
- **Scheduled**: Around tournament events
- **Testing**: Thorough testing on staging
- **Documentation**: Update release notes
- **Monitoring**: Post-deployment verification

## 📚 Additional Resources

### External Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Learning Resources
- [Tournament Rules](../specs/TOURNAMENT_RULES.md)
- [Project Roadmap](../specs/PROJECT_ROADMAP.md)
- [Task Documentation](../specs/tasks/)

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions
- **Discussions**: General questions and ideas

---

## 🎯 Next Steps

### For New Contributors
1. Read [Contributing Guidelines](./CONTRIBUTING.md)
2. Set up development environment
3. Pick a "good first issue" from GitHub
4. Join the community discussions

### For Maintainers
1. Keep documentation up to date
2. Review and update performance benchmarks
3. Monitor tournament feedback
4. Plan feature roadmap

---

**Happy coding, and let's make tournament management better for everyone! 🥍**