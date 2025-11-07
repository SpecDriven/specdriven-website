# Code Documentation & Developer Guide — Spec-Driven Consulting Website

## Overview
A fast static marketing site deployed on Cloudflare Pages to generate qualified leads and drive call bookings with Product leadership. Built with Astro + Tailwind, integrating Calendly (modal on intent) and Web3Forms (free tier) with UTM attribution capture.

Primary CTA: Schedule a Call (Calendly modal), secondary CTA: Contact Form (Web3Forms). Blog to be added later with Astro Content Collections.

---

## Tech Stack
- Framework: Astro + TypeScript
- Styling: Tailwind CSS
- Forms: Web3Forms (free tier)
- Scheduling: Calendly (popup modal, load-on-intent)
- Analytics: Cloudflare Web Analytics (cookie-free)
- Hosting: Cloudflare Pages (connected to GitHub)

---

## Repository Structure (proposed)
```
/
├─ src/
│  ├─ pages/
│  │  └─ index.astro                      # Single-page landing
│  ├─ components/
│  │  ├─ Header.astro                     # Sticky header with CTA
│  │  ├─ Footer.astro
│  │  ├─ Hero.astro
│  │  ├─ ValueProps.astro
│  │  ├─ Services.astro
│  │  ├─ HowItWorks.astro
│  │  ├─ Personas.astro
│  │  ├─ ToolsReferences.astro
│  │  ├─ About.astro
│  │  ├─ CTABar.astro
│  │  ├─ CalendlyModal.astro              # Modal, loads embed script on demand
│  │  ├─ ContactForm.astro                # Web3Forms integration
│  │  └─ PrivacyNote.astro                # Linked from consent checkbox
│  ├─ lib/
│  │  ├─ utm.ts                           # Capture/persist UTM & referrer (90 days)
│  │  └─ analytics.ts                     # Cloudflare Web Analytics snippet loader
│  ├─ styles/
│  │  └─ tailwind.css
│  └─ content/ (future blog)
│     ├─ config.ts                        # Content Collections config (future)
│     └─ blog/                            # MD/MDX posts (future)
├─ public/
│  ├─ favicon.ico
│  ├─ og-image.png
│  └─ robots.txt
├─ .github/workflows/
│  └─ ci.yml                              # Build + basic checks
├─ .env.example                           # Populate VITE_* variables
├─ astro.config.mjs
├─ tailwind.config.cjs
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## NPM Scripts
- dev: astro dev
- build: astro build
- preview: astro preview
- lint: eslint .
- format: prettier --write .
- typecheck: tsc --noEmit

---

## Environment Variables (.env)
Use Vite-style client env vars (exposed to client as needed):
- VITE_CALENDLY_URL = "https://calendly.com/your-scheduling-link" (placeholder)
- VITE_WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_KEY" (placeholder)
- VITE_CONTACT_EMAIL = "leads@your-domain" (placeholder for display only)

Commit .env.example with placeholder values. Do not commit real keys.

---

## UI Architecture & Sections
- Header: Logo, nav anchors, sticky "Schedule a Call" CTA (opens Calendly modal)
- Hero: Message to Product leadership: “Align PM, Dev, and Test around living specs to turn strategy into shipped outcomes” + CTA buttons (Schedule Call, Contact Form anchor)
- Value Props: Engineering maturity, AI agent ROI, traceability, maintainable tests
- Services: Assessment, Coaching, Requirements & Spec-driven dev, CI/CD, Tests, Architecture
- How It Works: Short 3-step process (Assess → Coach → Enable)
- Personas: PM, Tester, Dev, UX, AI agent; benefits per persona
- Tools & References: Aha!, Figma, Jira, XRay; Event Modeling, On.auto, reference links
- About: Brief mission and credibility
- Contact: Calendly CTA + Web3Forms-based contact form
- Footer: Links (Privacy, References), minimal nav

---

## Calendly Integration (Modal, Load-on-Intent)
- Do not load embed.js at page load. Defer until user clicks CTA.
- Implementation outline:
  1) On click, dynamically import the script: https://assets.calendly.com/assets/external/widget.js
  2) Call window.Calendly.initPopupWidget({ url: import.meta.env.VITE_CALENDLY_URL })
  3) Provide a fallback <a href={VITE_CALENDLY_URL} target="_blank" rel="noopener"> if script fails
- Accessibility: focus-trap inside modal; ESC to close; aria-modal=true, role=dialog

---

## Contact Form (Web3Forms)
- Fields (Recommended): Name, Email, Company, Role, Phone (optional), Message
- Consent: Required “I agree to the Privacy Policy” checkbox (link to /privacy or #privacy)
- Anti-spam: Honeypot field (hidden). Use Web3Forms’ built-in spam filters; no CAPTCHA at launch.
- Attribution: Add hidden inputs for utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, landing_page. Populate from lib/utm.ts.
- Submission: POST to https://api.web3forms.com/submit as JSON via fetch; include access_key
- Success UX: Inline success message; optionally scroll to a confirmation anchor
- Failure UX: Accessible error alert with retry guidance

Example payload (JSON):
```json
{
  "access_key": "YOUR_WEB3FORMS_KEY",
  "subject": "Spec-Driven Consulting Contact",
  "from_name": "Site Lead Form",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "company": "Example Co",
  "role": "Head of Product",
  "phone": "+1 555 0100",
  "message": "Looking for an assessment.",
  "utm_source": "linkedin",
  "utm_medium": "cpc",
  "utm_campaign": "q1-assessment",
  "utm_term": "spec driven",
  "utm_content": "hero-cta",
  "referrer": "https://referrer.example",
  "landing_page": "https://specdriven.app/",
  "consent": true,
  "botcheck": ""  
}
```

Note: Keep under free-tier monthly submission limits. No paid features required.

---

## UTM/Referrer Capture (lib/utm.ts)
- On first visit, parse window.location for UTM params; capture document.referrer
- Persist in localStorage for 90 days; refresh TTL on return visits
- Expose helper getAttribution() to return values for hidden form inputs
- Fallback if blocked: include referrer only; do not block form if UTMs missing

---

## Cloudflare Web Analytics
- Add the measurement script snippet site-wide (defer). No cookies or consent banners required by default.
- Verify domain in Cloudflare dashboard. Exclude preview deployments from prod metrics where desired.

---

## Accessibility Guidelines
- All interactive elements keyboard accessible; visible focus states
- Proper labels for inputs; associate errors via aria-describedby
- Color contrast AA minimum; avoid relying on color alone
- Modal focus trapping and ESC to close; restore focus to trigger on close
- Alt text for images; semantic HTML landmarks (header, main, footer)

---

## Coding Standards
- TypeScript: strict mode enabled
- Components: PascalCase; pages: kebab-case
- Styling: Tailwind utility-first; extract UI patterns into small components
- Linting/Format: ESLint + Prettier (recommended defaults)
- Commits: Conventional Commits (feat:, fix:, docs:, chore:)

---

## Local Development
1) Prereqs: Node 18+
2) Clone repo; npm install
3) cp .env.example .env and fill placeholders (Calendly URL, Web3Forms key, contact email)
4) npm run dev
5) Open http://localhost:4321

---

## Deployment — Cloudflare Pages (GitHub integration)
Reference: developers.cloudflare.com/pages

1) Push repo to GitHub
2) In Cloudflare Dashboard → Pages → Create project → Connect to GitHub → select repo
3) Build settings:
   - Framework preset: Astro (or None)
   - Build command: npm run build
   - Build output directory: dist
   - Node version: 18 (set in Pages settings or via .nvmrc)
4) Environment variables (Project > Settings > Environment variables):
   - VITE_CALENDLY_URL = your URL
   - VITE_WEB3FORMS_ACCESS_KEY = your key
   - VITE_CONTACT_EMAIL = your email address
5) Set custom domain: specdriven.app → Pages project → Custom domains → Add → Use existing Cloudflare zone; Pages auto-configures DNS
6) Preview deployments: Enable for pull requests; share preview URLs for review

Rollbacks: Use Pages deployments list to promote a prior successful build.

---

## Minimal QA/Smoke (pre-release)
- Page builds without errors
- All navigation anchors work
- Sticky CTA opens Calendly modal; fallback link opens Calendly in new tab
- Form validation messages appear; submission succeeds against Web3Forms test (or real) key
- Accessibility spot-check: keyboard nav and modal behavior

---

## SEO & Metadata
- Title, meta description emphasizing Product leadership outcomes
- Open Graph/Twitter card image
- robots.txt allow all; sitemap.xml optional (Astro integration available)

---

## Future Blog (Astro Content Collections)
- Define content collections in src/content/config.ts
- Posts as MD/MDX in src/content/blog
- Route at /blog with list page; individual post pages
- Authoring: PR-based workflow; add CI to validate frontmatter

---

## Security & Privacy
- No backend; secrets limited to public form key usage
- Do not expose private emails beyond display text in page copy
- Add Privacy Policy page or section; consent checkbox links to it
- Keep dependencies updated; renovate optional

---

## Maintenance
- Update Calendly URL via env var
- Rotate Web3Forms key if compromised
- Validate links quarterly; update references
- Monitor Analytics for performance and CTA conversion trends

---

## Appendix: Implementation Notes
- Modal: load Calendly script on-demand; clean up on close to reduce memory
- Form: use fetch with JSON; handle 200 OK/4xx gracefully; disable button while submitting; prevent duplicate submits
- UTM: use a 90-day rolling TTL; serialize as a single JSON blob in localStorage with created_at; handle parse errors safely
