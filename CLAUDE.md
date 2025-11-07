# CLAUDE.md - Spec-Driven Consulting Website Development Guide

## Project Overview
You are building a single-page marketing website for Spec-Driven Consulting, a consulting firm that helps enterprise software organizations adopt spec-driven development with AI code generation agents. The site will be hosted on Cloudflare Pages as a static site with no backend infrastructure.

## Primary Goal
Create a fast, conversion-focused marketing site that drives qualified leads through:
1. **Primary CTA**: Schedule assessment calls via Calendly popup modal
2. **Secondary CTA**: Contact form submission via Web3Forms

## Target Audience
- **Primary**: Product leadership (Heads of Product, Directors, PMs) at enterprise organizations (≥5 PMs, ≥30 dev/testers)
- **Secondary**: Engineering leadership, Test leaders, Senior Developers, UX

## Tech Stack & Architecture

### Frontend
- **Framework**: Astro (static site generator with excellent performance)
- **Styling**: Tailwind CSS (utility-first)
- **Language**: TypeScript (optional, for type safety)
- **Icons**: Lucide icons
- **Fonts**: System font stack only (no webfonts for performance)

### Integrations
- **Scheduling**: Calendly popup widget (lazy-loaded on user intent)
- **Forms**: Web3Forms (free tier, <250 submissions/month)
- **Analytics**: Cloudflare Web Analytics (cookie-free, privacy-friendly)
- **Hosting**: Cloudflare Pages (with GitHub integration)
- **CDN/DNS**: Cloudflare

### No Backend Required
- Static site only
- No databases, no servers, no Cloudflare Workers
- All dynamic functionality via third-party services

## Key Features & Requirements

### 1. Performance Requirements
- **LCP**: ≤ 3.0s on mobile 4G
- **CLS**: < 0.10
- **Total JS**: ≤ 200KB compressed
- **HTML**: ≤ 70KB compressed per page
- **Lighthouse scores**: ≥95 desktop, ≥90 mobile

### 2. Page Sections (Single Page)
1. **Header** (sticky): Logo, nav anchors, "Schedule a Call" CTA
2. **Hero**: Headline focused on PM value prop, subhead, CTAs
3. **Value Props**: Why spec-driven development matters
4. **Services**: 7 key service offerings
5. **How It Works**: 3-step process (Assess → Pilot → Scale)
6. **Personas**: Benefits for PM, Tester, Dev, UX, AI agents
7. **What Works/Doesn't**: BDD/Gherkin best practices
8. **Tools**: Aha!, Figma, Jira, XRay integrations
9. **References**: Event Modeling, related work
10. **Contact**: Form + scheduling options
11. **Footer**: Company info, legal links

### 3. Calendly Integration
- Load script ONLY on user click (not on page load)
- Open as modal/popup to keep users on site
- Fallback: Open in new tab if script fails
- Implementation:
  ```javascript
  // Only load when user clicks CTA
  async function openCalendly() {
    if (!window.Calendly) {
      // Dynamically load script
      await loadCalendlyScript();
    }
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  }
  ```

### 4. Contact Form (Web3Forms)
- **Required fields**: Name, Email, Company, Role, Message
- **Optional**: Phone
- **Spam protection**: Honeypot field (hidden checkbox)
- **Consent**: Required privacy policy checkbox
- **Attribution**: Capture and include UTM parameters
- **Success**: Show inline success message + prompt to schedule call

### 5. Attribution Tracking
- Capture UTM parameters on first visit
- Store in localStorage for 90 days
- Include in all form submissions
- Fields: utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, landing_page

### 6. Accessibility Requirements
- All interactive elements keyboard accessible
- Proper ARIA labels and roles
- Color contrast AA minimum
- Focus trap in Calendly modal
- ESC to close modals

## Environment Variables
```bash
# .env file (create from .env.example)
VITE_CALENDLY_URL=https://calendly.com/your-handle/assessment
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_key
VITE_CONTACT_EMAIL=leads@specdriven.app
```

## File Structure
```
/
├── src/
│   ├── pages/
│   │   └── index.astro          # Single landing page
│   ├── components/
│   │   ├── Header.astro         # Sticky header with CTA
│   │   ├── Hero.astro           # Hero section
│   │   ├── sections/            # All page sections
│   │   ├── ContactForm.astro   # Web3Forms integration
│   │   └── CalendlyModal.astro # Calendly loader
│   ├── lib/
│   │   ├── utm.ts               # UTM tracking utilities
│   │   └── calendly.ts          # Calendly loader logic
│   └── styles/
│       └── tailwind.css
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
├── astro.config.mjs
├── tailwind.config.cjs
└── package.json
```

## Development Workflow

### Local Development
```bash
npm install
cp .env.example .env  # Configure environment variables
npm run dev          # Start dev server on http://localhost:4321
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing Checklist
- [ ] All navigation anchors work correctly
- [ ] Calendly modal opens from all CTAs
- [ ] Contact form validates and submits
- [ ] UTM parameters are captured and persisted
- [ ] Mobile responsive layout works
- [ ] No console errors
- [ ] Lighthouse scores meet targets

### Deployment to Cloudflare Pages
1. Push code to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: 18+
4. Set environment variables in Pages settings
5. Deploy to custom domain: specdriven.app

## Security & Privacy
- No cookies (localStorage only for attribution)
- Required consent checkbox on forms
- Honeypot spam protection
- HTTPS enforced via Cloudflare
- CSP headers configured for third-party scripts

## Content Guidelines
- **Tone**: Executive-friendly, outcomes-focused, jargon-light
- **Hero Message**: "Align PM, Dev, and Test around living specs to turn strategy into shipped outcomes"
- **Value Props**: Focus on business outcomes, not technical details
- **CTAs**: Clear, action-oriented ("Schedule Assessment Call")

## Performance Optimization Tips
1. **Images**: Use AVIF/WebP formats, lazy-load below fold
2. **Scripts**: Defer all non-critical JS
3. **Calendly**: Load only on user intent
4. **CSS**: Tailwind purges unused styles automatically
5. **Fonts**: System stack avoids download overhead

## Common Pitfalls to Avoid
- Don't load Calendly script on page load
- Don't use heavy JS frameworks (React/Vue unnecessary)
- Don't add marketing pixels initially
- Don't create multiple pages (keep it single-page)
- Don't store any PII locally

## Success Metrics
- Number of Calendly meetings scheduled per week
- Contact form submissions
- Time on page and scroll depth
- Lighthouse performance scores

## Future Enhancements (Post-Launch)
- Blog using Astro Content Collections
- Gated one-pager download with email capture
- hCaptcha if spam becomes an issue
- CRM integration (HubSpot) when volume increases

## Quick Reference Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment (automatic via GitHub integration)
git push origin main    # Triggers Cloudflare Pages deployment

# Testing
npm run test:lighthouse # Check performance metrics
npm run test:a11y      # Check accessibility
```

## Support & Documentation
- Astro docs: https://docs.astro.build
- Tailwind docs: https://tailwindcss.com/docs
- Cloudflare Pages: https://developers.cloudflare.com/pages
- Web3Forms: https://web3forms.com/docs
- Calendly: https://developer.calendly.com

Remember: This is a conversion-focused marketing site. Every decision should optimize for getting qualified leads to schedule assessment calls.