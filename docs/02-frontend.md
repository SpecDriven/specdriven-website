# Frontend Implementation Spec — Spec-Driven Consulting website

## Overview
- Goal: High-converting single-page marketing site that drives scheduling of assessment calls, with secondary contact form.
- Audience focus: Product leadership (primary), with supporting content for PM, Dev, Test, UX.
- Hosting: Cloudflare Pages (static). Future blog as second page using Astro Content Collections.

## Tech stack
- Framework: Astro (static output)
- Styling: Tailwind CSS
- Language: TypeScript where applicable
- Interactivity: Astro Islands with small vanilla/Preact components as needed
- Forms: Web3Forms (free tier, <250 submissions/mo)
- Scheduling: Calendly popup widget (lazy-loaded on intent)
- Analytics (optional): Cloudflare Web Analytics or Plausible (script deferred)

## Information architecture & sections (single page)
1. Header (sticky)
   - Logo/brand: “Spec-Driven Consulting”
   - Nav anchors: Value, Services, How it works, Personas, Tools, References, About, Contact
   - Primary CTA: “Schedule a Call” (opens Calendly popup)
2. Hero
   - Headline: “Align PM, Dev, and Test around living specs to turn strategy into shipped outcomes.”
   - Subhead: Emphasize engineering maturity, AI agent ROI, testing, maintainability.
   - CTAs: Primary “Schedule a Call” (Calendly modal), Secondary “Email/Call” (mailto/tel)
3. Value (Why it matters)
   - Points: Faster alignment and delivery; Reduce design drift and tech debt; Guardrails for AI agents; Traceability from business-facing tests.
4. Services
   - Engineering maturity assessment & technical coaching
   - Requirements capture & spec-driven development
   - CI/CD
   - Impactful and maintainable automated tests
   - Maintainable architecture
   - Spec-driven development coaching & staff augmentation
   - Effective automated tests coaching & staff augmentation
5. How it works
   - 3-step flow: Assess → Pilot → Scale. Include high-level deliverables and outcomes.
6. Personas
   - PM: business value, communication to UX/Dev/Test
   - Tester: positive/negative scenarios, specification by example
   - Dev: purpose + scenarios, automation, traceability
   - UX: collaboration with Figma, spec mapping to flows
   - AI: stateless, in-context learning, external memory, token-cost awareness
7. What works / What doesn’t
   - Works: BDD/Gherkin/Given-When-Then, wikis, traceability from business-facing tests
   - Doesn’t: Executable specs/Cucumber for PM edits (pipeline fragility, added dev complexity)
8. Tools
   - Aha!, Figma, Jira, XRay for Jira
9. Related work & references
   - Event Modeling (Adam Dimitruk)
   - On.auto (Sam Hatoum)
   - Martin Dilger
   - Article: “Spec-driven development: 10 things…” (ainativedev.io link)
10. Schedule/Contact section
   - Reaffirm CTA, show trust badges/logos (when available)
   - Contact form (Web3Forms) as secondary path
11. Footer
   - Company info, email, phone, social, legal (Privacy, Terms)

## Component design
- Layout.astro: global header (sticky), footer, slot for sections, SEO tags
- Header.astro
  - Sticky top, shadow on scroll
  - CTA button triggers Calendly popup modal
- Hero.astro
  - Headline, subhead, social proof area
  - Primary CTA (Calendly), Secondary CTAs (mailto, tel)
- Section components: Value.astro, Services.astro, HowItWorks.astro, Personas.astro, Tools.astro, References.astro, Contact.astro
- CalendlyLauncher.tsx (island)
  - Lazy-load Calendly widget JS on first click
  - openPopupWidget(url) call
- ContactForm.astro
  - Web3Forms action with honeypot field, success/failure states

## Interactivity & state
- Minimal client state only for:
  - Calendly modal trigger (no global state lib needed)
  - Contact form pending/success UI (local component state)
- Use an “island” for Calendly launcher; keep rest static for performance

## Styling & branding
- Tailwind presets
  - Colors (example):
    - Primary: slate-900 / slate-700 (text/buttons)
    - Accent: indigo-600 → indigo-500 (CTAs)
    - Background: white, slate-50 sections
  - Typography: system font stack or Inter
  - Buttons: solid primary for CTAs; outline for secondary
  - Cards: subtle borders, rounded-xl, md:shadow
- Responsive layout
  - Mobile-first sections, avoid inline Calendly embed to reduce layout bloat

## Accessibility
- Color contrast AA or better
- Keyboard focus visible, skip-to-content link
- ARIA for nav and form inputs
- Calendly modal: focus trap, aria-modal, escape to close (Calendly widget handles popup; ensure button has aria-label)

## Performance & SEO
- Lighthouse targets: 90+ across metrics
- Images optimized (SVG logos; responsive images via Astro)
- JS budget: keep <50KB shipped by default (lazy-load Calendly only on click)
- SEO
  - Title: “Spec-Driven Consulting — Align PM, Dev, Test with Living Specs”
  - Meta description emphasizing outcomes and AI agent guardrails
  - OpenGraph + Twitter cards
  - JSON-LD: Organization + WebSite + ContactPoint

## Integrations
- Calendly
  - Use popup widget: https://assets.calendly.com/assets/external/widget.js
  - Lazy load script on first CTA click to keep TTI fast
  - Config: ENV var or site setting for Calendly URL (e.g., https://calendly.com/your-handle/assessment)
- Web3Forms (free tier)
  - Form action: https://api.web3forms.com/submit
  - Required hidden input: access_key (public key from Web3Forms dashboard)
  - Add honeypot: <input type="checkbox" name="botcheck" class="hidden" style="display:none" tabindex="-1" autocomplete="off">
  - Set redirect or show inline success message using fetch
  - Don’t collect sensitive data; include consent checkbox

## Example snippets
- Calendly launcher island (Preact)
```tsx
// src/components/CalendlyLauncher.tsx
import { useState } from 'preact/hooks';

export function CalendlyLauncher({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  const open = async () => {
    if (!loaded) {
      await import('https://assets.calendly.com/assets/external/widget.js');
      setLoaded(true);
    }
    // @ts-ignore
    window.Calendly?.initPopupWidget({ url });
  };
  return (
    <button onClick={open} class="btn btn-primary" aria-label="Schedule a call">
      Schedule a Call
    </button>
  );
}
```

- Contact form (Astro)
```astro
---
const accessKey = import.meta.env.PUBLIC_WEB3FORMS_KEY; // public env var
---
<form action="https://api.web3forms.com/submit" method="POST" class="space-y-4">
  <input type="hidden" name="access_key" value={accessKey} />
  <input type="text" name="name" placeholder="Your name" required class="input" />
  <input type="email" name="email" placeholder="Your email" required class="input" />
  <input type="text" name="company" placeholder="Company" class="input" />
  <textarea name="message" placeholder="What are you looking to achieve?" required class="textarea" />
  <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" />
  <label class="flex items-start gap-2 text-sm">
    <input type="checkbox" required />
    <span>I agree to the processing of my information and to be contacted.</span>
  </label>
  <button type="submit" class="btn btn-outline">Send</button>
</form>
```

## Content guidelines (initial copy cues)
- Hero: Clear promise for product leaders; outcome-focused.
- Services: Bulleted clarity, avoid jargon, tie back to outcomes and risk reduction.
- How it works: Simple 3 steps with tangible deliverables.
- Evidence: Reference tools and related work to build trust.
- CTAs: Repeat “Schedule a Call” frequently but unobtrusively.

## File structure
```
/
  src/
    components/
      CalendlyLauncher.tsx
      Header.astro
      Footer.astro
      sections/
        Hero.astro
        Value.astro
        Services.astro
        HowItWorks.astro
        Personas.astro
        Tools.astro
        References.astro
        Contact.astro
    layouts/
      BaseLayout.astro
  public/
    images/
  pages/
    index.astro
    blog/ (future)
  tailwind.config.cjs
  astro.config.mjs
```

## Cloudflare Pages setup (clear steps)
1. Repo: Push code to GitHub/GitLab.
2. In Cloudflare dashboard → Pages → Create project → Connect to repo.
3. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 18+ (set in Pages settings or via `.nvmrc`)
4. Environment variables (Project → Settings → Environment variables):
   - `PUBLIC_CALENDLY_URL` = your Calendly scheduling link
   - `PUBLIC_WEB3FORMS_KEY` = your Web3Forms access key (public)
   - `PUBLIC_CONTACT_EMAIL` / `PUBLIC_CONTACT_PHONE` for rendering
5. Production branch: `main` (or your default). Each push triggers deploy.
6. Custom domain: Add your domain, update DNS in Cloudflare to point to Pages.
7. Caching: Default static; enable asset hashing via Astro for cache-busting.

## Future blog (second page)
- Use Astro content collections for markdown posts.
- Route: `/blog/` index with “Articles coming soon” placeholder.
- RSS generation optional later.

## Legal & privacy
- Simple Privacy Policy covering forms and Calendly linkouts.
- Cookie policy: if using privacy-friendly analytics, cookie banner likely unnecessary.
