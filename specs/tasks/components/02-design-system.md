# Component Task: Western-Themed Design System

## Overview
Extend the existing design system with western-themed components, patterns, and utilities that maintain consistency across the tournament website.

## Design Tokens

### 1. Extended Color Palette
**File**: `src/styles/design-tokens.ts`

```typescript
export const colors = {
  // Brand Colors
  cowtown: {
    brown: '#934F25',
    'dark-brown': '#5E2713',
    gold: '#D6AC4D',
    cream: '#FFF8E7',
    sand: '#F5E6D3',
  },
  
  // Game States
  game: {
    live: '#FF0000',
    'power-play': '#2196F3',
    'penalty-kill': '#FF5722',
    overtime: '#9C27B0',
    final: '#4CAF50',
  },
  
  // Western Accents
  western: {
    wood: {
      light: '#D2B48C',
      DEFAULT: '#8B6F47',
      dark: '#5D4E37',
    },
    leather: {
      light: '#8D6E63',
      DEFAULT: '#5D4037',
      dark: '#3E2723',
    },
    rope: '#D7CCC8',
    brass: '#B8860B',
    rust: '#B7410E',
  },
  
  // Semantic Colors
  success: '#2E7D32',
  warning: '#F57C00',
  error: '#C62828',
  info: '#0288D1',
}
```

### 2. Typography System
**File**: `src/styles/typography.ts`

```typescript
export const typography = {
  // Western Display Fonts
  western: {
    xs: { fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.05em' },
    sm: { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '0.05em' },
    base: { fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: '0.05em' },
    lg: { fontSize: '1.5rem', lineHeight: '2rem', letterSpacing: '0.05em' },
    xl: { fontSize: '2rem', lineHeight: '2.5rem', letterSpacing: '0.05em' },
    '2xl': { fontSize: '3rem', lineHeight: '3.5rem', letterSpacing: '0.05em' },
    '3xl': { fontSize: '4rem', lineHeight: '4.5rem', letterSpacing: '0.05em' },
  },
  
  // Body Text (Geist Sans)
  body: {
    xs: { fontSize: '0.75rem', lineHeight: '1rem' },
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    base: { fontSize: '1rem', lineHeight: '1.5rem' },
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
    xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
  },
  
  // Mono (scores, timers)
  mono: {
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem', fontFamily: 'monospace' },
    base: { fontSize: '1rem', lineHeight: '1.5rem', fontFamily: 'monospace' },
    lg: { fontSize: '1.5rem', lineHeight: '2rem', fontFamily: 'monospace' },
    xl: { fontSize: '2rem', lineHeight: '2.5rem', fontFamily: 'monospace' },
  },
}
```

### 3. Spacing & Layout
**File**: `src/styles/spacing.ts`

```typescript
export const spacing = {
  // Tournament-specific spacing
  scoreGap: '1rem',
  teamGap: '2rem',
  sectionGap: '3rem',
  
  // Card padding
  cardPadding: {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  },
  
  // Western border widths
  borderWidth: {
    thin: '2px',
    medium: '4px',
    thick: '8px',
    rope: '12px',
  },
}
```

## Core Design Components

### 1. Western Button System
**File**: `src/components/ui/western-button.tsx`

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const westernButton = cva(
  'inline-flex items-center justify-center font-western transition-all duration-200 active:scale-95',
  {
    variants: {
      variant: {
        primary: [
          'bg-cowtown-gold text-cowtown-dark-brown',
          'border-4 border-cowtown-dark-brown',
          'shadow-[4px_4px_0_0_theme(colors.cowtown.dark-brown)]',
          'hover:shadow-[2px_2px_0_0_theme(colors.cowtown.dark-brown)]',
          'active:shadow-none',
        ],
        wood: [
          'bg-gradient-to-b from-western-wood to-western-wood-dark',
          'text-white border-2 border-western-wood-dark',
          'hover:from-western-wood-light hover:to-western-wood',
        ],
        leather: [
          'bg-western-leather text-cowtown-gold',
          'border border-cowtown-gold rounded-none',
          'hover:bg-western-leather-light',
        ],
        ghost: [
          'text-cowtown-dark-brown',
          'hover:bg-cowtown-cream',
          'border-2 border-transparent',
          'hover:border-cowtown-brown',
        ],
        danger: [
          'bg-red-600 text-white',
          'border-2 border-red-800',
          'hover:bg-red-700',
        ],
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'sm',
    },
  }
)

export interface WesternButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof westernButton> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function WesternButton({
  className,
  variant,
  size,
  rounded,
  leftIcon,
  rightIcon,
  children,
  ...props
}: WesternButtonProps) {
  return (
    <button
      className={cn(westernButton({ variant, size, rounded }), className)}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
}
```

### 2. Western Card System
**File**: `src/components/ui/western-card.tsx`

```typescript
const westernCard = cva(
  'relative overflow-hidden transition-all duration-300',
  {
    variants: {
      variant: {
        wood: [
          'bg-gradient-to-br from-western-wood-light to-western-wood',
          'border-4 border-western-wood-dark',
          'shadow-xl hover:shadow-2xl',
        ],
        wanted: [
          'bg-cowtown-cream',
          'border-8 border-double border-cowtown-dark-brown',
          'transform rotate-1 hover:rotate-0',
          'shadow-lg hover:shadow-xl',
        ],
        saloon: [
          'bg-gradient-to-b from-western-wood to-cowtown-dark-brown',
          'border-t-8 border-cowtown-gold',
          'rounded-t-3xl',
        ],
        parchment: [
          'bg-gradient-to-br from-cowtown-cream to-yellow-50',
          'border-2 border-cowtown-brown',
          'shadow-md',
          'relative',
          'before:absolute before:inset-0',
          'before:bg-[url("/textures/paper.png")] before:opacity-20',
        ],
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'wood',
      padding: 'md',
    },
  }
)
```

### 3. Western Badge System
**File**: `src/components/ui/western-badge.tsx`

```typescript
const westernBadge = cva(
  'inline-flex items-center font-western text-sm',
  {
    variants: {
      variant: {
        sheriff: [
          'px-3 py-1',
          'bg-cowtown-gold text-cowtown-dark-brown',
          'clip-path-[polygon(30%_0%,_70%_0%,_100%_30%,_100%_70%,_70%_100%,_30%_100%,_0%_70%,_0%_30%)]',
        ],
        ribbon: [
          'px-4 py-1',
          'bg-gradient-to-r from-red-600 to-red-700',
          'text-white',
          'relative',
          'before:absolute before:left-0 before:border-l-[16px] before:border-l-transparent',
          'before:border-t-[24px] before:border-t-red-600',
          'after:absolute after:right-0 after:border-r-[16px] after:border-r-transparent',
          'after:border-t-[24px] after:border-t-red-700',
        ],
        wood: [
          'px-3 py-1',
          'bg-western-wood text-white',
          'border-2 border-western-wood-dark',
          'rounded-sm',
        ],
        live: [
          'px-3 py-1',
          'bg-red-500 text-white',
          'animate-pulse',
          'rounded-full',
        ],
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'sheriff',
      size: 'md',
    },
  }
)
```

### 4. Western Input System
**File**: `src/components/ui/western-input.tsx`

```typescript
const westernInput = cva(
  'w-full transition-all duration-200',
  {
    variants: {
      variant: {
        default: [
          'bg-white',
          'border-2 border-cowtown-brown',
          'focus:border-cowtown-gold focus:ring-2 focus:ring-cowtown-gold/20',
          'placeholder:text-gray-400',
        ],
        wood: [
          'bg-western-wood/10',
          'border-2 border-western-wood',
          'focus:border-western-wood-dark focus:bg-western-wood/20',
        ],
        parchment: [
          'bg-cowtown-cream',
          'border-b-2 border-cowtown-dark-brown',
          'focus:border-b-4',
          'rounded-none',
        ],
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)
```

### 5. Western Loading States
**File**: `src/components/ui/western-loading.tsx`

```typescript
export function WesternSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }
  
  return (
    <div className={`relative ${sizes[size]}`}>
      <div className="absolute inset-0 animate-spin">
        <HorseshoeIcon className="w-full h-full text-cowtown-gold" />
      </div>
    </div>
  )
}

export function WesternSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'animate-pulse bg-gradient-to-r from-western-rope via-cowtown-cream to-western-rope',
      'bg-size-200 bg-pos-0',
      className
    )} />
  )
}

export function WesternProgress({ value, max = 100 }: { value: number; max?: number }) {
  const percentage = (value / max) * 100
  
  return (
    <div className="relative h-6 bg-western-wood/20 border-2 border-western-wood rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cowtown-gold to-yellow-500"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 -mr-4">
          <StarIcon className="w-full h-full text-yellow-300 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
```

### 6. Western Icons
**File**: `src/components/ui/western-icons.tsx`

```typescript
// Custom western-themed icons
export const WesternIcons = {
  Horseshoe: (props: SVGProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C9.24 2 7 4.24 7 7v7c0 2.76 2.24 5 5 5s5-2.24 5-5V7c0-2.76-2.24-5-5-5zm3 12c0 1.65-1.35 3-3 3s-3-1.35-3-3V7c0-1.65 1.35-3 3-3s3 1.35 3 3v7z" />
    </svg>
  ),
  
  SheriffBadge: (props: SVGProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l2.39 4.84 5.34.78-3.86 3.75.91 5.33L12 14.25 7.22 16.7l.91-5.33-3.86-3.75 5.34-.78z" />
    </svg>
  ),
  
  Lasso: (props: SVGProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="8" strokeWidth="2" />
      <path d="M12 20v2m0-2c-4.4 0-8-3.6-8-8" strokeWidth="2" />
    </svg>
  ),
  
  CowboyHat: (props: SVGProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C8 2 5 4 5 7c0 1-2 1-2 3s1 3 3 3h12c2 0 3-1 3-3s-2-2-2-3c0-3-3-5-7-5z" />
    </svg>
  ),
}
```

## Utility Classes

### Western Utilities
**File**: `src/styles/western-utilities.css`

```css
/* Text Effects */
.text-western-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.text-gold-gradient {
  background: linear-gradient(180deg, #D6AC4D 0%, #B8860B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Borders */
.border-rope {
  border-image: url('/images/rope-border.svg') 30 repeat;
}

.border-wood-frame {
  border: 8px solid;
  border-image: url('/images/wood-frame.svg') 50 repeat;
}

/* Backgrounds */
.bg-western-paper {
  background-image: 
    linear-gradient(135deg, transparent 25%, rgba(255, 255, 255, 0.1) 25%),
    url('/textures/paper.png');
  background-size: 20px 20px, cover;
}

/* Clip Paths */
.clip-sheriff-badge {
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%,
    79% 91%, 50% 70%, 21% 91%, 32% 57%,
    2% 35%, 39% 35%
  );
}

.clip-banner-end {
  clip-path: polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%);
}
```

## Responsive Design Tokens

```typescript
export const breakpoints = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
}
```

## Storybook Documentation

Each design system component needs comprehensive Storybook stories:

```typescript
// Example: WesternButton.stories.tsx
export default {
  title: 'Design System/Western Button',
  component: WesternButton,
  parameters: {
    docs: {
      description: {
        component: 'Western-themed button component with multiple variants and sizes.',
      },
    },
  },
}

export const AllVariants = () => (
  <div className="space-y-4">
    <WesternButton variant="primary">Primary Button</WesternButton>
    <WesternButton variant="wood">Wood Button</WesternButton>
    <WesternButton variant="leather">Leather Button</WesternButton>
    <WesternButton variant="ghost">Ghost Button</WesternButton>
  </div>
)
```

## Accessibility Guidelines

1. **Color Contrast**: Ensure all western color combinations meet WCAG AA standards
2. **Focus States**: Clear, visible focus indicators on all interactive elements
3. **Motion**: Provide reduced motion alternatives for western animations
4. **Screen Readers**: Proper ARIA labels for decorative western elements

## Performance Guidelines

1. **Image Optimization**: Convert texture images to WebP format
2. **CSS Variables**: Use CSS custom properties for dynamic theming
3. **Tree Shaking**: Export individual components for optimal bundle size
4. **Lazy Loading**: Implement lazy loading for heavy western graphics