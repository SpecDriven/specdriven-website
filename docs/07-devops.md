# DevOps, Hosting, and Deployment Plan

Project: Spec-Driven Consulting website
Stack: Astro + Tailwind (static), Calendly modal, Web3Forms
Hosting: Cloudflare Pages + Cloudflare Web Analytics

## Objectives
- Zero-backend, low-maintenance static site
- Fast, reliable deploys from GitHub with preview environments
- Clear Cloudflare setup steps (Pages, DNS, analytics)
- Secure defaults (headers, HTTPS, caching)

## Environments & Branching
- Local: astro dev
- Preview: automatic per pull request (Cloudflare Pages Preview)
- Production: main branch
- Branch protection: require PRs for main, auto-deploy previews

## CI/CD on Cloudflare Pages (GitHub)
1) In Cloudflare Dashboard → Pages → Create project → Connect to GitHub → choose repo.
2) Framework preset: Astro (auto-detect). If manual:
   - Build command: npm ci && npm run build
   - Output directory: dist
   - Node version: 20.x (set in Pages → Settings → Builds → Node compatibility)
3) Production branch: main. Enable “Preview deployments for PRs”.
4) Environment variables (set both Production and Preview unless noted):
   - SITE_URL = https://specdriven.app (Production only)
   - CALENDLY_URL = https://calendly.com/your-slug (placeholder)
   - CONTACT_TO_EMAIL = <provide-later@specdriven.app>
   - WEB3FORMS_ACCESS_KEY = <provide-later>
   - ANALYTICS = cf (optional flag for template logic)
5) First deploy: trigger by pushing to main. Each PR gets its own preview URL.

References: developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

## Custom Domain & DNS (specdriven.app)
1) Ensure specdriven.app is on Cloudflare DNS (already confirmed).
2) In Pages → Custom domains → Add custom domain → specdriven.app and www.specdriven.app.
3) Cloudflare will auto-create/validate CNAMEs to your pages.dev host.
4) Security: Enable “Always Use HTTPS” and “Automatic HTTPS Rewrites” (SSL/TLS → Edge Certificates).
5) HSTS: Optionally enable HSTS after confirming HTTPS works everywhere.

## Caching & Performance
- Static assets: hashed filenames; cache aggressively at edge.
- HTML: short or no-cache to allow instant content updates.
- Use a _headers file at project root (or /public) to control cache + security.

Example _headers (adjust if needed):
```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

  # Content Security Policy: allow Calendly + Web3Forms; review after testing
  Content-Security-Policy: default-src 'self'; script-src 'self' https://assets.calendly.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://assets.calendly.com; img-src 'self' data: https://assets.calendly.com; font-src 'self' https://assets.calendly.com; frame-src https://calendly.com; connect-src 'self' https://api.web3forms.com https://calendly.com https://assets.calendly.com

# Cache HTML lightly
/*.html
  Cache-Control: no-cache

# Cache static assets long-term
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

Notes:
- If the Calendly modal or Web3Forms fails due to CSP, add any additional endpoints used by their latest embeds and retest.
- Cloudflare Pages respects _headers and _redirects at the project root.

## Redirects
- Provide a minimal _redirects file (optional now):
```
# Redirect www → apex (Cloudflare setting also handles this)
https://www.specdriven.app/*  https://specdriven.app/:splat  301!

# Placeholder blog path
/blog    /  302
```

## Analytics (Cloudflare Web Analytics)
Option A — Pages integration (recommended):
- In Cloudflare → Pages → Your project → Analytics → Enable Web Analytics.
- No code changes needed; Cloudflare injects the beacon.

Option B — Script tag:
- Cloudflare → Web Analytics → Create site → copy script tag → add to <head> in Astro layout.

Reference: developers.cloudflare.com/analytics/web-analytics/

## Calendly Integration (Modal, performance-friendly)
- Use a sticky header CTA that loads Calendly only on click intent.
- Implementation outline:
  - Add a button with data-calendly-url="${CALENDLY_URL}".
  - On click, dynamically load https://assets.calendly.com/assets/external/widget.js and call Calendly.initPopupWidget.
  - Ensure focus trapping and aria-modal for accessibility.

## Lead Form: Web3Forms (Free tier)
- Endpoint: POST https://api.web3forms.com/submit
- Required fields (we’ll map form names accordingly):
  - access_key (from WEB3FORMS_ACCESS_KEY)
  - name, email, company, role, phone (optional), message
  - from_name = "Spec-Driven Consulting"
  - reply_to = {{email}}
  - subject = "New lead from specdriven.app"
  - to = CONTACT_TO_EMAIL
- Spam protection: add hidden honeypot input name="botcheck" value=""; abort submit if filled.
- Success UX: use redirect query or in-page success message; record minimal telemetry in console only.
- Privacy: include required consent checkbox linking to /privacy.

Reference: web3forms.com/docs

## Attribution Capture (UTM/Referrer)
- On first visit, read UTM params and document.referrer; store in localStorage for 90 days.
- Inject hidden inputs into the form on submit: utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, landing_page, first_visit_at, last_visit_at.
- Do not set cookies.

## Secrets & Config
- Do not commit secrets.
- Store WEB3FORMS_ACCESS_KEY and CONTACT_TO_EMAIL in Cloudflare Pages → Settings → Environment variables.
- Use different values per environment if needed (e.g., test email on Preview).
- Rotate keys by adding the new secret in Pages, merge, redeploy; verify, then delete old key.

## Operations Runbook
- Deploy: merge to main → Cloudflare auto-builds → verify → done.
- Preview QA: open PR URL → verify forms (use test email), Calendly modal, headers, CSP, Lighthouse.
- Rollback: Pages → Deployments → select previous → “Set as Production”.
- Domain issues: Verify CNAMEs + SSL mode “Full (strict)”. Clear CDN cache if necessary.
- Updating headers/redirects: modify _headers/_redirects → merge to main.
- Changing contact email: update CONTACT_TO_EMAIL in Pages env vars → redeploy.
- Monitoring: Cloudflare Web Analytics, GitHub checks. Optional: add status page later.

## Security Checklist
- HTTPS enforced; HSTS enabled after validation.
- Security headers via _headers file.
- Minimal CSP with allowlist for Calendly/Web3Forms; test thoroughly.
- No third-party cookies; no PII stored client-side beyond form submission.

## Limits & Costs
- Web3Forms free tier ≤ 250 submissions/month; watch quota.
- Cloudflare Pages free tier: ample for static site, with PR previews.

## Future Enhancements (non-blocking)
- Add /blog via Astro Content Collections.
- Add hCaptcha to the form if spam appears.
- Hook into a CRM (HubSpot) via their embed or webhook.
- Uptime monitoring and synthetic checks.
