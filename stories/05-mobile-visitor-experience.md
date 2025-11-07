# User Story: Mobile Visitor Experience

## Story
As a **mobile visitor browsing on my phone**,  
I want **a seamless mobile experience**,  
So that **I can easily learn about services and take action on my device**.

## Acceptance Criteria

### Given
- I am visiting the site on a mobile device (phone or tablet)
- I may be on varying network speeds (3G/4G/5G)
- I have limited screen space

### When
1. I load the website on my mobile device
2. I navigate through sections
3. I interact with CTAs
4. I fill out the contact form
5. I try to schedule a call

### Then
- Page should load in < 3 seconds on 4G
- Content should be readable without zooming
- Touch targets should be at least 48x48px
- Forms should be easy to fill on mobile
- Calendly modal should be mobile-optimized
- Navigation should be accessible via hamburger menu

## Technical Implementation Notes

### Responsive Breakpoints
```css
/* Tailwind breakpoints */
/* sm: 640px, md: 768px, lg: 1024px, xl: 1280px */

/* Mobile-first approach */
.container {
  @apply px-4 sm:px-6 lg:px-8;
}

.hero-text {
  @apply text-3xl sm:text-4xl lg:text-5xl;
}

.grid-services {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6;
}
```

### Mobile Navigation
```html
<!-- Mobile menu toggle -->
<button 
  id="mobile-menu-toggle"
  class="md:hidden"
  aria-label="Toggle menu"
  aria-expanded="false"
>
  <svg class="w-6 h-6"><!-- Hamburger icon --></svg>
</button>

<!-- Mobile menu -->
<div 
  id="mobile-menu"
  class="hidden fixed inset-0 z-50 bg-white md:hidden"
>
  <nav class="flex flex-col p-6">
    <a href="#value" class="py-3 text-lg">Why Spec-Driven</a>
    <a href="#services" class="py-3 text-lg">Services</a>
    <!-- etc -->
    <button 
      onclick="openCalendly()" 
      class="mt-6 btn-primary w-full"
    >
      Schedule a Call
    </button>
  </nav>
</div>
```

### Touch-Optimized Form
```html
<!-- Mobile-optimized form inputs -->
<form class="space-y-4">
  <input 
    type="text" 
    name="name"
    class="w-full px-4 py-3 text-base rounded-lg"
    placeholder="Your Name"
    autocomplete="name"
  />
  
  <input 
    type="email" 
    name="email"
    class="w-full px-4 py-3 text-base rounded-lg"
    placeholder="Work Email"
    autocomplete="email"
    inputmode="email"
  />
  
  <input 
    type="tel" 
    name="phone"
    class="w-full px-4 py-3 text-base rounded-lg"
    placeholder="Phone (optional)"
    autocomplete="tel"
    inputmode="tel"
  />
  
  <textarea 
    name="message"
    class="w-full px-4 py-3 text-base rounded-lg"
    rows="4"
    placeholder="How can we help?"
  ></textarea>
  
  <button 
    type="submit"
    class="w-full py-3 text-lg btn-primary"
  >
    Send Message
  </button>
</form>
```

### Performance Optimizations
```javascript
// Viewport meta tag
<meta name="viewport" content="width=device-width, initial-scale=1" />

// Responsive images
<picture>
  <source 
    media="(max-width: 640px)" 
    srcset="/hero-mobile.webp 640w"
  />
  <source 
    media="(min-width: 641px)" 
    srcset="/hero-desktop.webp 1920w"
  />
  <img 
    src="/hero-desktop.jpg" 
    alt="Hero image"
    loading="lazy"
    width="1920"
    height="1080"
  />
</picture>
```

## Priority: HIGH

## Dependencies
- Responsive CSS framework (Tailwind)
- Mobile menu JavaScript
- Touch-optimized Calendly widget
- Responsive images prepared

## Test Scenarios

### 1. Page Load Performance
- Test on real devices (iOS Safari, Chrome Android)
- Measure load time on 4G throttling
- Verify no horizontal scroll
- Check font sizes are readable

### 2. Navigation
- Tap hamburger menu → Menu opens
- Tap menu item → Scrolls to section → Menu closes
- Swipe to close menu (if implemented)
- Back button behavior correct

### 3. Touch Interactions
- All buttons/links have adequate tap targets (48x48px)
- No hover-dependent functionality
- Form inputs activate correct keyboard
- Smooth scrolling between sections

### 4. Form Usability
- Keyboard types: email for email, tel for phone
- Autocomplete attributes work
- Error messages visible without scrolling
- Submit button reachable without scrolling

### 5. Calendly Modal
- Opens correctly on mobile
- Scrollable if needed
- Close button accessible
- Date/time selection works on touch

### 6. Orientation Changes
- Portrait to landscape transition smooth
- Content reflows correctly
- No content cut off

## Device Testing Matrix
- **iOS**: iPhone 12/13/14 (Safari, Chrome)
- **Android**: Pixel 6/7, Samsung Galaxy S22 (Chrome, Samsung Internet)
- **Tablets**: iPad, Android tablets
- **Network**: 3G, 4G, 5G, WiFi

## Performance Targets
- **LCP**: < 3.5s on 4G
- **FID**: < 100ms
- **CLS**: < 0.1
- **Total Page Weight**: < 1MB

## Accessibility
- Font size minimum 16px
- Line height minimum 1.5
- Touch targets 48x48px minimum
- Color contrast WCAG AA compliant
- Pinch to zoom not disabled

## Common Issues to Avoid
- Horizontal scrolling
- Fixed positioning issues
- Tiny tap targets
- Viewport zooming disabled
- Desktop-only interactions
- Heavy images without responsive variants