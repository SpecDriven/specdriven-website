# Testing Plan — Spec-Driven Consulting Website (Static, Cloudflare Pages)

## Objectives
- Ensure the static site builds cleanly, key user paths work, and forms submit (mocked) without regressions.
- Validate minimal accessibility and basic analytics/UTM tracking are in place.
- Keep tests lightweight and fast to support rapid iteration.

## Scope (Launch)
- Single-page Astro site with Tailwind CSS
- Calendly modal via sticky CTA button
- Contact form via Web3Forms (free tier) with honeypot and required privacy consent
- UTM/referrer capture in localStorage (90 days) and included in form payload
- Cloudflare Web Analytics beacon

Out of scope (for now): cross-browser matrix, visual regression, performance budgets, contract tests, CRM/webhook integrations.

## Environments
- Local: `npm run dev`
- Preview: Cloudflare Pages preview deployments (per PR)
- Production: Cloudflare Pages production (main branch)

## Tooling
- Node.js 20.x
- Playwright (Chromium only) for smoke E2E
- axe-core via Playwright for basic a11y
- GitHub Actions for CI (pre-deploy on PR and main)

## Pass/Fail Criteria
- Build completes without errors
- All smoke tests pass on Chromium desktop (1280x800) and mobile (375x812)
- No serious accessibility violations (axe: critical/serious = 0) on homepage state

## Test Cases (Smoke)

1) Build integrity
- Command: `npm run build` (Astro)
- Expect: Build completes without errors; output in `dist/`

2) Navigation and CTAs
- Header nav links scroll to sections or set hash correctly
- Sticky “Schedule a Call” CTA is visible on load and on scroll
- External links (References, LinkedIn, docs) open in new tab with `rel="noopener noreferrer"`

3) Calendly modal
- Clicking any “Schedule a Call” button loads the Calendly modal on demand
- Expect Calendly iframe present in DOM after click
- Modal can be closed via close control; focus returns to triggering button

4) Contact form validation and submission (mocked)
- Required fields: Name, Email, Company, Role, Message; Phone optional
- Privacy checkbox is required; submission blocked without it
- Honeypot (hidden) field present and remains empty
- On valid submit, intercept POST to Web3Forms endpoint and return `{ success: true }` to verify success UI path (no real email sent)
- Error path: simulate `{ success: false }` and show error UI state

5) UTM/referrer tracking
- Visiting with `?utm_source=test&utm_medium=ads&utm_campaign=launch` stores values in `localStorage` for 90 days
- First external referrer (if any) stored alongside UTM
- Hidden fields in the form include stored UTM + referrer on submit

6) Analytics beacon
- Cloudflare Web Analytics script present and loads on production and preview (guarded from local if desired)

7) Basic accessibility (axe)
- Homepage at default state: 0 critical/serious violations
- After opening Calendly modal: ignore third-party iframe; check that page retains no new violations (allowlisting iframe as needed)
- Form: inputs have associated labels; color contrast meets AA; keyboard navigation reaches CTA and form controls

8) Responsive sanity
- Desktop (1280x800) and mobile (375x812) layouts render without layout shifts; sticky CTA visible and tappable on mobile

## Implementation Details

### Suggested NPM Scripts
- `test:smoke`: Playwright tests (Chromium only)
- `test:a11y`: Axe checks via Playwright
- `ci:test`: `npm run build && npm run test:smoke && npm run test:a11y`

### Playwright Setup (Chromium only)
- Install: `npm i -D @playwright/test` then `npx playwright install chromium`
- Config (playwright.config.ts):
  - projects: one for desktop, one for mobile viewport
  - retries: 1
  - use: `baseURL` from env, `trace: "retain-on-failure"`

### Example Smoke Test (high-level)
```ts
import { test, expect } from '@playwright/test';

const sections = ['#services', '#how-it-works', '#personas', '#references', '#contact'];

test('build and key flows', async ({ page }) => {
  await page.goto('/');

  // Nav links
  for (const hash of sections) {
    await page.click(`a[href="${hash}"]`);
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
  }

  // Calendly modal appears on CTA click
  await page.getByRole('button', { name: /schedule a call/i }).first().click();
  await expect(page.locator('iframe[src*="calendly"]')).toBeVisible();
  // Close modal if applicable
  await page.keyboard.press('Escape');

  // UTM persistence
  await page.goto('/?utm_source=test&utm_medium=ads&utm_campaign=launch');
  await expect(page.evaluate(() => localStorage.getItem('utm_source'))).resolves.toBe('test');

  // Form validation and mocked submit
  await page.goto('/');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="company"]', 'SpecDriven Inc');
  await page.fill('input[name="role"]', 'Head of Product');
  await page.fill('textarea[name="message"]', 'Interested in assessment.');
  await page.check('input[name="privacyConsent"]');

  // Intercept Web3Forms
  await page.route('https://api.web3forms.com/submit', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });

  await page.click('button[type="submit"]');
  await expect(page.getByText(/thank you|we received/i)).toBeVisible();
});
```

### Basic Accessibility Check
- Use `@axe-core/playwright` or run axe via script on homepage and form view
- Threshold: 0 critical/serious issues; ignore third-party iframe nodes via `rules`/`exclude`

### GitHub Actions (CI)
Minimal workflow to run on PRs and main. Cloudflare Pages will deploy after merge to main.
```yaml
name: ci
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:smoke
      - run: npm run test:a11y
```

## Manual QA Checklist (Release)
- [ ] Site renders correctly on latest Chrome desktop and iOS Safari
- [ ] Sticky CTA visible and works; Calendly modal opens/closes
- [ ] All header/footer links work and open in correct context (same/new tab)
- [ ] Contact form validates required fields; privacy checkbox required
- [ ] Mocked submission shows success; real submission toggled off in CI
- [ ] UTM parameters persist after navigation and appear in hidden form fields
- [ ] Cloudflare Web Analytics beacon present (verify in network tab)
- [ ] No high-severity axe violations

## Known Limitations
- Tests run only on Chromium; Firefox/Safari not covered
- No visual regression or performance budget checks
- Third-party widgets (Calendly) are tested for presence/state, not contract

## Future Enhancements
- Add Lighthouse CI with basic budgets (TTI/CLS)
- Expand Playwright to Firefox and WebKit
- Visual regression (Playwright snapshots or Chromatic-like tooling)
- Contract tests for form service/webhooks once CRM is introduced
- Add hCaptcha if spam appears
