# Style Guide Proposal - Spec-Driven Consulting

## Proposed Direction: "Technical Authority"
A sophisticated, premium aesthetic that conveys expertise, innovation, and trust. Moving away from generic SaaS blue/white to something more distinctive and memorable.

## Color Palette

### Primary Colors
```css
/* Deep Charcoal - Primary text and headers */
--color-charcoal: #1C1F26;

/* Warm White - Backgrounds */
--color-cream: #FAFAF9;

/* Rich Indigo - Primary brand color */
--color-indigo: #4338CA;

/* Electric Purple - Innovation accent */
--color-purple: #7C3AED;
```

### Secondary Colors
```css
/* Success States - Emerald */
--color-emerald: #10B981;

/* Warning/Attention - Amber */
--color-amber: #F59E0B;

/* Error States - Rose */
--color-rose: #F43F5E;

/* Neutral Grays */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;
```

### Gradient Accents
```css
/* Hero gradient - subtle depth */
--gradient-hero: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);

/* CTA gradient - attention grabbing */
--gradient-cta: linear-gradient(135deg, #7C3AED 0%, #4338CA 100%);

/* Success gradient */
--gradient-success: linear-gradient(135deg, #10B981 0%, #059669 100%);
```

## Typography

### Font Stack
```css
/* Headers - Modern serif for authority */
--font-heading: 'Fraunces', 'Georgia', serif;

/* Body - Clean sans-serif for readability */
--font-body: 'Inter', -apple-system, system-ui, sans-serif;

/* Code/Technical - Monospace */
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

### Type Scale
```css
/* Display - Hero headlines */
--text-display: clamp(2.5rem, 5vw, 4rem);
--leading-display: 1.1;
--tracking-display: -0.02em;

/* H1 - Section headers */
--text-h1: clamp(2rem, 4vw, 3rem);
--leading-h1: 1.2;

/* H2 - Subsection headers */
--text-h2: clamp(1.5rem, 3vw, 2rem);
--leading-h2: 1.3;

/* H3 - Card headers */
--text-h3: 1.25rem;
--leading-h3: 1.4;

/* Body - Main content */
--text-body: 1.0625rem; /* 17px */
--leading-body: 1.6;

/* Small - Supporting text */
--text-small: 0.875rem;
--leading-small: 1.5;
```

## Visual Design System

### Spacing
```css
/* Consistent spacing scale */
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
--space-3xl: 4rem;     /* 64px */
--space-4xl: 6rem;     /* 96px */
```

### Border Radius
```css
/* Sophisticated, not too rounded */
--radius-sm: 0.25rem;   /* 4px - buttons, inputs */
--radius-md: 0.5rem;    /* 8px - cards */
--radius-lg: 0.75rem;   /* 12px - modals */
--radius-xl: 1rem;      /* 16px - feature cards */
--radius-2xl: 1.5rem;   /* 24px - hero elements */
```

### Shadows
```css
/* Subtle depth hierarchy */
--shadow-xs: 0 1px 2px rgba(28, 31, 38, 0.05);
--shadow-sm: 0 2px 4px rgba(28, 31, 38, 0.06);
--shadow-md: 0 4px 6px rgba(28, 31, 38, 0.07);
--shadow-lg: 0 10px 15px rgba(28, 31, 38, 0.1);
--shadow-xl: 0 20px 25px rgba(28, 31, 38, 0.1);
--shadow-2xl: 0 25px 50px rgba(28, 31, 38, 0.15);

/* Colored shadows for CTAs */
--shadow-indigo: 0 10px 25px rgba(67, 56, 202, 0.25);
--shadow-purple: 0 10px 25px rgba(124, 58, 237, 0.25);
```

## Component Styles

### Buttons
```css
/* Primary CTA - Gradient with depth */
.btn-primary {
  background: var(--gradient-cta);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  box-shadow: var(--shadow-purple);
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(124, 58, 237, 0.3);
}

/* Secondary - Outlined */
.btn-secondary {
  background: transparent;
  color: var(--color-indigo);
  border: 2px solid var(--color-indigo);
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--color-indigo);
  color: white;
}
```

### Cards
```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-100);
  transition: all 0.3s;
}

.card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

/* Feature card with gradient border */
.card-feature {
  position: relative;
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
}

.card-feature::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: var(--radius-xl);
  padding: 2px;
  background: var(--gradient-hero);
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
```

### Forms
```css
.input {
  background: white;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  font-size: var(--text-body);
  transition: all 0.2s;
}

.input:focus {
  border-color: var(--color-indigo);
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.1);
  outline: none;
}
```

## Layout Principles

### Grid System
- 12-column grid on desktop
- 6-column on tablet
- 4-column on mobile
- Max container width: 1280px
- Consistent gutters: 32px desktop, 24px tablet, 16px mobile

### Section Spacing
```css
.section {
  padding-top: var(--space-4xl);
  padding-bottom: var(--space-4xl);
}

@media (max-width: 768px) {
  .section {
    padding-top: var(--space-3xl);
    padding-bottom: var(--space-3xl);
  }
}
```

## Animation & Interaction

### Transitions
```css
/* Smooth, not too fast */
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 350ms ease;
```

### Hover States
- Buttons: Lift with shadow
- Cards: Subtle lift and shadow increase
- Links: Color change with underline
- Images: Subtle zoom (scale 1.05)

### Micro-animations
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Visual Elements

### Icons
- Style: Outlined/line icons for most uses
- Size: 20px (small), 24px (default), 32px (large)
- Color: Inherit from parent text color
- Library: Lucide icons (consistent, clean)

### Illustrations
- Style: Abstract geometric shapes
- Colors: Use brand gradient colors
- Purpose: Support concepts, not decoration
- Placement: Hero section, empty states, feature highlights

### Patterns
```css
/* Subtle dot pattern for backgrounds */
.pattern-dots {
  background-image: radial-gradient(
    circle at 1px 1px,
    var(--color-gray-300) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
  opacity: 0.3;
}

/* Gradient mesh for hero */
.pattern-mesh {
  background-image:
    radial-gradient(at 40% 20%, var(--color-purple) 0px, transparent 50%),
    radial-gradient(at 80% 0%, var(--color-indigo) 0px, transparent 50%),
    radial-gradient(at 0% 50%, var(--color-emerald) 0px, transparent 50%);
  opacity: 0.1;
}
```

## Responsive Behavior

### Breakpoints
```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Large desktop */
```

### Mobile Considerations
- Increase touch targets to 48x48px minimum
- Reduce font weights on mobile (600 → 500)
- Simplify shadows on mobile
- Stack elements vertically
- Hide decorative elements if needed

## Accessibility

### Color Contrast
- Normal text: 7:1 minimum
- Large text: 4.5:1 minimum
- Interactive elements: 3:1 minimum
- Focus indicators: 3:1 minimum

### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--color-indigo);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Brand Voice in Design

### Visual Personality Traits
- **Sophisticated**: Not startup-y, more enterprise
- **Authoritative**: Deep colors, strong typography
- **Innovative**: Purple accents, modern gradients
- **Trustworthy**: Consistent spacing, clear hierarchy
- **Technical**: Monospace accents, code snippets
- **Human**: Warm whites, not stark white

### What to Avoid
- Generic "SaaS blue" (#0066CC types)
- Overly playful or casual elements
- Too many bright colors
- Cluttered layouts
- Stock corporate photos
- Excessive animations

## Implementation Priority

### Phase 1: Foundation
1. Color palette update
2. Typography implementation
3. Basic component styles
4. Layout grid system

### Phase 2: Enhancement
1. Gradient accents
2. Shadow system
3. Hover/interaction states
4. Icon integration

### Phase 3: Polish
1. Micro-animations
2. Background patterns
3. Illustration/graphics
4. Loading states

This style guide moves away from minimal white/blue to create a sophisticated, technical, and memorable brand presence that stands out in the enterprise consulting space.