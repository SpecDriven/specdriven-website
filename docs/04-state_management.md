# State Management Specification

## Overview
Minimal, dependency-free client-side state for a static Astro + Tailwind site hosted on Cloudflare Pages. Focus areas:
- High-converting CTA via Calendly popup
- Lightweight contact form using Web3Forms
- Zero-friction spam control (honeypot)
- Marketing attribution capture (UTM/referrer) persisted client-side for later submission

No global state libraries are introduced. Use small TypeScript modules and DOM events. Astro islands are optional; default to vanilla JS modules to minimize JS.

## Technology & Constraints
- Build: Astro + Tailwind CSS
- Hosting: Cloudflare Pages (static)
- Integrations: Web3Forms (free tier), Calendly popup widget
- No backend or database
- Timeline: MVP scope; prioritize reliability and performance

## State Inventory

### Global (cross-section) state
1. Marketing Attribution
   - Keys: utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, landing_page, first_seen_at, last_seen_at
   - Source of truth: localStorage key `lead_attribution_v1`
   - Lifetime: 90 days TTL; refresh `last_seen_at` on each visit
   - Overwrite rules: Only overwrite on new visit when URL contains utm_source (or gclid) to avoid clobbering first-touch data; always update last_seen_at

2. Calendly Loader State
   - `calendlyLoaded: boolean` (lazy-load Calendly script on first intent)

3. Submission Cooldown
   - `lastSubmitAt: number` (epoch ms) to prevent rapid double submissions; 10s cooldown

### Local UI state (per-component)
1. Calendly Popup Modal
   - `isOpen: boolean`
   - `triggerOrigin: HTMLElement | null` (restore focus after close)

2. Contact Form
   - `status: 'idle' | 'submitting' | 'success' | 'error'`
   - `errors: Record<string, string>` (client-side required validation only)
   - `honeypot: string` (must remain empty)

3. Mobile Navigation
   - `isNavOpen: boolean` (for small screens)

4. Toast/Inline Messages
   - `message: { type: 'success' | 'error'; text: string } | null`

## Persistence Rules
- localStorage: `lead_attribution_v1`
  - Structure:
    ```json
    {
      "utm_source": "",
      "utm_medium": "",
      "utm_campaign": "",
      "utm_term": "",
      "utm_content": "",
      "referrer": "",
      "landing_page": "",
      "first_seen_at": 0,
      "last_seen_at": 0,
      "ttl": 90 // days
    }
    ```
- First-touch capture occurs on first page view where any UTM present (or gclid) or when no storage exists; `referrer` and `landing_page` captured once, then only `last_seen_at` updates on subsequent visits.
- Expiry check on page load; if `first_seen_at + ttl` < now, clear and recapture.

## Initialization & Event Flow
- On DOMContentLoaded:
  1. `initAttribution()` parses URL and updates storage using overwrite rules; adds hidden inputs to any form with `[data-attach-attribution]`.
  2. Bind click handlers to any `[data-calendly-trigger]` to call `openCalendly()`.
  3. Bind contact form submit handler for `[data-lead-form]`.
  4. Bind mobile nav toggles for `[data-nav-toggle]`.

## State Transitions
- Calendly
  - `openCalendly(trigger)`: ensure script loaded → compute Calendly URL with attribution params appended → open popup → set `isOpen=true` and trap focus
  - `closeCalendly()`: set `isOpen=false`, restore focus to `triggerOrigin`

- Contact Form
  - `submit` → if honeypot filled or cooldown not elapsed: abort with silent error
  - Set `status='submitting'`, disable submit button, POST to Web3Forms endpoint including attribution hidden fields
  - On 2xx: `status='success'`, show success UI; optional: set `lastSubmitAt=now`
  - On failure: `status='error'`, show error UI; re-enable submit

- Mobile Nav
  - Toggle `isNavOpen`; when open, scroll-lock body; close on route hash change or Esc

## Invalidation & Expiry
- Attribution:
  - Expire after 90 days from `first_seen_at`
  - Overwrite only when new UTM present (with `utm_source` or `gclid`), otherwise keep first-touch
  - Always update `last_seen_at` on visit
- Submission Cooldown:
  - Reject new submissions within 10 seconds of last successful or attempted submission
- UI State:
  - Reset `status` to `idle` when user edits any field after error

## Accessibility & UX
- Calendly modal: focus trap, aria-hidden/inert for background, restore focus to opener
- Keyboard: Esc closes modal and mobile nav; Enter submits form once; prevent double submit
- Reduced motion: respect `prefers-reduced-motion` for any animations
- Error messaging: inline, associated with inputs via `aria-describedby`

## Security & Privacy
- No cookies; only localStorage for non-PII attribution
- Sanitize/whitelist attribution keys before appending to URLs/hidden inputs
- Honeypot input visually hidden, not `display:none` to avoid bots skipping; use `aria-hidden="true"` and off-screen positioning
- Do not store or log form PII locally beyond the page session

## Implementation Structure (proposed)
- `src/scripts/attribution.ts`
  - `parseFromUrl(url: string): Partial<Attribution>`
  - `load(): Attribution | null`
  - `save(a: Attribution): void`
  - `initAttribution(): void` — capture, persist, attach hidden inputs to forms
  - Hidden inputs: `utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, landing_page, first_seen_at, last_seen_at`

- `src/scripts/calendly.ts`
  - `ensureCalendlyLoaded(): Promise<void>` (injects script once)
  - `openCalendly(trigger?: HTMLElement): void` (builds URL with attribution params)
  - `closeCalendly(): void`

- `src/scripts/form.ts`
  - `bindLeadForm(form: HTMLFormElement): void`
  - Handles status flags, cooldown, honeypot check, fetch POST to Web3Forms, success/error UI

- `src/scripts/nav.ts`
  - `initNav(): void` (mobile menu open/close, scroll lock)

- `src/pages/index.astro`
  - Include scripts with `client:load` for minimal hydration only where needed

## Data Included in Submissions
- User-input fields: name, work email, company, role, message (final field list defined in form markup)
- Hidden attribution fields (as above)
- Page context: current URL, timezone offset

## Performance Considerations
- No global framework runtime; vanilla TS modules
- Lazy-load Calendly script on first intent only
- Defer non-critical scripts; inline small bootstraps if necessary
- Keep JS under ~8–12 KB gzip for initial load

## Acceptance Criteria
- Calendly popup opens from sticky header CTA and section button; works on mobile/desktop; restores focus on close
- Attribution captured and persists across reloads for 90 days; included in Web3Forms submissions
- Form protects against basic bot spam via honeypot and rejects double submits within 10 seconds
- Form shows clear success/error states and is keyboard-accessible
- No console errors in modern browsers; page works with JS disabled (minus Calendly/modal behavior)

## Future Extensions
- Add hCaptcha if spam increases
- Add simple analytics (Privacy-friendly) to measure CTA conversion
- Consider storing a `lead_submitted_at` flag to adapt CTAs post-submission
- Reuse attribution for future Blog pages automatically
