# Frontend Task: Western Theme Implementation

## Overview
Implement the western/Calgary Stampede theme throughout the website, including typography, colors, UI elements, and animations.

## Theme Configuration

### 1. Color System Update
**File**: `src/app/(frontend)/globals.css`

```css
@layer base {
  :root {
    /* Tournament Brand Colors */
    --cowtown-brown: 25 61% 36%; /* #934F25 */
    --cowtown-dark-brown: 20 63% 23%; /* #5E2713 */
    --cowtown-gold: 43 51% 58%; /* #D6AC4D */
    
    /* Update existing variables */
    --primary: var(--cowtown-brown);
    --primary-foreground: 0 0% 98%;
    
    --accent: var(--cowtown-gold);
    --accent-foreground: var(--cowtown-dark-brown);
    
    /* Game-specific colors */
    --power-play: 207 90% 54%; /* #2196F3 */
    --penalty-kill: 14 100% 57%; /* #FF5722 */
    
    /* Western UI Elements */
    --border-wood: 25 30% 45%;
    --bg-leather: 20 25% 15%;
    --text-rope: 35 20% 70%;
  }
}
```

### 2. Tailwind Configuration
**File**: `tailwind.config.mjs`

```javascript
theme: {
  extend: {
    colors: {
      cowtown: {
        brown: '#934F25',
        'dark-brown': '#5E2713',
        gold: '#D6AC4D',
        cream: '#FFF8E7',
      },
      game: {
        'power-play': '#2196F3',
        'penalty-kill': '#FF5722',
      },
      western: {
        wood: '#8B6F47',
        leather: '#3E2723',
        rope: '#D7CCC8',
      }
    },
    fontFamily: {
      western: ['var(--font-western)', 'serif'],
      display: ['var(--font-western)', 'serif'],
      body: ['var(--font-geist-sans)', 'sans-serif'],
    },
    backgroundImage: {
      'wood-texture': "url('/textures/wood.jpg')",
      'leather-texture': "url('/textures/leather.jpg')",
      'rope-border': "url('/textures/rope-border.svg')",
    },
    animation: {
      'lasso-spin': 'lasso 2s ease-in-out infinite',
      'tumble-weed': 'tumble 10s linear infinite',
      'horseshoe-bounce': 'horseshoe 0.5s ease-out',
    }
  }
}
```

### 3. Western Fonts
**File**: `src/app/(frontend)/layout.tsx`

```typescript
import { Rye, Geist, Geist_Mono } from 'next/font/google'

const rye = Rye({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-western',
})

// Alternative western fonts to consider:
// - Smokum
// - Bungee Shade
// - Alfa Slab One
```

## UI Components Styling

### 1. Western Button Variants
**File**: `src/components/ui/western-button.tsx`

```typescript
const westernVariants = {
  wood: 'bg-western-wood text-white border-2 border-cowtown-dark-brown shadow-[0_4px_0_0_theme(colors.cowtown.dark-brown)] active:shadow-none active:translate-y-1',
  leather: 'bg-western-leather text-cowtown-gold border border-cowtown-gold rounded-none',
  gold: 'bg-gradient-to-b from-cowtown-gold to-yellow-600 text-cowtown-dark-brown font-bold',
  rope: 'border-4 border-western-rope bg-cowtown-cream text-cowtown-dark-brown rounded-full',
}
```

### 2. Western Card Styles
**File**: `src/components/ui/western-card.tsx`

```typescript
export const WesternCard = ({ variant = 'wood', children, className }) => {
  const variants = {
    wood: 'bg-wood-texture bg-cover border-4 border-cowtown-dark-brown rounded-none shadow-xl',
    wanted: 'bg-cowtown-cream border-8 border-double border-cowtown-dark-brown transform rotate-1 hover:rotate-0 transition-transform',
    saloon: 'bg-gradient-to-b from-western-wood to-cowtown-dark-brown border-t-8 border-cowtown-gold',
  }
  
  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  )
}
```

### 3. Western Typography Styles
**File**: `src/styles/western-typography.css`

```css
.western-heading {
  @apply font-western text-cowtown-dark-brown;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
}

.western-display {
  @apply western-heading text-4xl md:text-6xl lg:text-7xl;
  background: linear-gradient(180deg, #D6AC4D 0%, #B8860B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
}

.western-badge {
  @apply inline-block px-3 py-1 bg-cowtown-gold text-cowtown-dark-brown;
  clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%);
}

.western-divider {
  @apply relative overflow-hidden h-8 my-8;
  background-image: url('/images/rope-divider.svg');
  background-repeat: repeat-x;
  background-position: center;
}
```

## Page-Specific Western Elements

### 1. Homepage Hero
```typescript
// Western-themed hero section
<section className="relative overflow-hidden bg-gradient-to-b from-cowtown-cream to-white">
  {/* Animated tumbleweed */}
  <div className="absolute bottom-0 animate-tumble-weed">
    <Image src="/images/tumbleweed.svg" alt="" />
  </div>
  
  {/* Western border frame */}
  <div className="absolute inset-0 pointer-events-none">
    <Image src="/images/western-frame.svg" alt="" fill className="object-cover" />
  </div>
  
  <div className="relative z-10 text-center py-20">
    <h1 className="western-display">Cowtown Showdown</h1>
    <p className="western-badge text-xl mt-4">Senior Men's Lacrosse</p>
  </div>
</section>
```

### 2. Team Cards
```typescript
// Western "Wanted Poster" style team cards
<WesternCard variant="wanted" className="hover:scale-105 transition-transform">
  <div className="text-center p-6">
    <h3 className="western-heading text-2xl">WANTED</h3>
    <div className="my-4 relative h-32 w-32 mx-auto">
      <Image src={team.logo} alt={team.name} fill className="object-contain sepia-[0.3]" />
    </div>
    <h4 className="font-western text-xl">{team.name}</h4>
    <p className="text-sm mt-2">Division: {team.division}</p>
    <div className="mt-4 text-2xl font-bold">
      REWARD: {team.wins} WINS
    </div>
  </div>
</WesternCard>
```

### 3. Scoreboard Design
```typescript
// Saloon-style scoreboard
<div className="bg-western-wood rounded-t-3xl border-4 border-cowtown-dark-brown">
  {/* Swinging saloon doors animation for live games */}
  <div className="relative">
    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
      <span className="western-badge animate-pulse">LIVE</span>
    </div>
    
    {/* Wood grain header */}
    <div className="bg-wood-texture bg-cover p-4 rounded-t-xl">
      <h2 className="western-heading text-white text-center text-2xl">
        Score Board
      </h2>
    </div>
    
    {/* Scores */}
    <div className="bg-cowtown-cream p-6">
      {/* Game scores here */}
    </div>
  </div>
</div>
```

### 4. Navigation Bar
```typescript
// Western saloon-style navigation
<nav className="bg-western-leather border-b-4 border-cowtown-gold">
  <div className="container mx-auto">
    {/* Logo with sheriff badge style */}
    <div className="flex items-center">
      <div className="relative">
        <Image src="/logo-badge.svg" alt="Cowtown Showdown" width={60} height={60} />
        <div className="absolute inset-0 animate-spin-slow">
          <Image src="/sheriff-star.svg" alt="" fill />
        </div>
      </div>
      
      {/* Navigation items with wood plank style */}
      <ul className="flex space-x-1 ml-8">
        <li>
          <a href="/schedule" className="western-nav-link">
            Schedule
          </a>
        </li>
        {/* More nav items */}
      </ul>
    </div>
  </div>
</nav>
```

## Animations & Interactions

### 1. Western Animations
```css
@keyframes lasso {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes tumble {
  0% { transform: translateX(-100px) rotate(0deg); }
  100% { transform: translateX(calc(100vw + 100px)) rotate(720deg); }
}

@keyframes horseshoe {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}

@keyframes swing-doors {
  0%, 100% { transform: rotateY(0deg); }
  50% { transform: rotateY(25deg); }
}
```

### 2. Hover Effects
```css
.western-hover-lift {
  @apply transition-all duration-300;
  @apply hover:translate-y-[-4px] hover:shadow-2xl;
}

.western-hover-glow {
  @apply transition-all duration-300;
  @apply hover:shadow-[0_0_20px_rgba(214,172,77,0.5)];
}

.western-hover-shake {
  @apply hover:animate-[shake_0.5s_ease-in-out];
}
```

## Loading States

### Western Spinner
```typescript
export const WesternSpinner = () => (
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 animate-lasso-spin">
      <Image src="/images/horseshoe.svg" alt="Loading..." fill />
    </div>
  </div>
)
```

### Skeleton Screens
```typescript
export const WesternSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-western-rope rounded w-3/4 mb-2" />
    <div className="h-4 bg-western-rope rounded w-1/2" />
  </div>
)
```

## Mobile Adaptations

1. Simplified textures on mobile for performance
2. Reduced animations on low-power devices
3. Touch-friendly western UI elements
4. Appropriate font sizes for readability

## Accessibility Considerations

1. Sufficient contrast ratios with western colors
2. Readable fonts alongside decorative western fonts
3. Proper focus states with western styling
4. Reduced motion options for animations

## Asset Requirements

### Images Needed
- `/textures/wood.jpg` - Wood grain texture
- `/textures/leather.jpg` - Leather texture
- `/images/rope-divider.svg` - Rope divider graphic
- `/images/western-frame.svg` - Decorative frame
- `/images/tumbleweed.svg` - Tumbleweed animation
- `/images/horseshoe.svg` - Loading spinner
- `/images/sheriff-star.svg` - Badge decoration
- `/logo-badge.svg` - Tournament logo in badge style

### Icon Set
- Western-themed icons for navigation
- Cowboy hat for team captain indicator
- Horseshoe for wins
- Lasso for goals
- Badge for achievements