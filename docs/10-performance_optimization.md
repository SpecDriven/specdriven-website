# Performance and Reliability Plan — Spec-Driven Consulting

Scope: Static marketing site built with Astro + Tailwind, deployed on Cloudflare Pages. Primary CTA is a sticky “Schedule a Call” button that opens a Calendly modal; secondary CTA is a contact form via Web3Forms. Blog to be added later using Astro Content Collections.

## 1) Performance Budgets (launch targets)
- LCP (mobile 4G): ≤ 3.0s
- CLS: < 0.10
- Total JavaScript (compressed transfer): ≤ 200 KB
- HTML (compressed transfer per page): ≤ 70 KB
- Images: Modern formats (AVIF/WebP) + lazy-loading; keep hero ≤ ~250 KB (desktop), ≤ ~150 KB (mobile)
- Fonts: System font stack only (no webfonts)
- Third-party: Load Calendly on interaction; Cloudflare Web Analytics deferred

Rationale: Fast, simple, and reliable for a static content-led site while minimizing complexity at launch.

## 2) Frontend Optimization
- Framework: Astro islands to minimize JS. Only hydrate:
  - Calendly modal trigger
  - Contact form enhancements (UTM capture, consent)
- JavaScript:
  - Defer all non-critical JS; no global frameworks beyond what Astro injects
  - Bundle splitting enabled by default; ensure no accidental polyfills
  - No client-side routers or heavy UI libs
- CSS (Tailwind):
  - Enable content-based purge (default with Tailwind JIT)
  - Keep custom CSS minimal; prefer utility classes
- Images:
  - Use Astro’s image optimization or build-time transforms to output AVIF/WebP, responsive sizes (1x/2x)
  - Provide width/height or CSS aspect-ratio to avoid CLS
  - Lazy-load non-critical images; preload the hero image
- Fonts:
  - System UI stack, `font-display: swap` not needed (no webfonts)
- Accessibility and CLS:
  - Reserve space for images, buttons, and the Calendly modal trigger
  - Avoid injecting DOM above the fold after render

## 3) Third-Party Loading Strategy
- Calendly:
  - Do not load Calendly script at page load
  - On first click of “Schedule a Call”, dynamically load the Calendly SDK and open the modal
  - Fallback: if script fails, open Calendly in a new tab
- Web3Forms:
  - No embed script needed; use a simple `fetch` POST
- Cloudflare Web Analytics:
  - Load via `defer` near the end of the body

Example: deferred Calendly loading (pseudo-implementation)
```html
<button id="scheduleBtn">Schedule a Call</button>
<script>
  const btn = document.getElementById('scheduleBtn');
  async function openCalendly() {
    if (!window.Calendly) {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://assets.calendly.com/assets/external/widget.js';
        s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });
    }
    // Replace with your scheduling URL
    window.Calendly && window.Calendly.initPopupWidget({ url: 'https://calendly.com/your-link' });
  }
  btn.addEventListener('click', openCalendly, { passive: true });
</script>
```

## 4) Caching, Compression, and Delivery
- Cloudflare edge features:
  - HTTP/2 and HTTP/3 enabled
  - Brotli compression enabled
  - Early Hints enabled (optional)
  - Auto Minify (HTML/CSS/JS) enabled (safe with Astro’s output)
- Cache policy via `_headers` (immutable hashed assets, cautious HTML caching):
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/index.html
  Cache-Control: no-cache, no-store, must-revalidate
```
- HTML caching strategy:
  - Don’t aggressively cache HTML to ensure instant updates on deploys
  - All static assets are hashed and cached long-term at the edge

## 5) Reliability and Degradation
- Calendly fallback:
  - If modal fails, open scheduling link in new tab
  - Provide a visible mailto: and phone number as alternative
- Web3Forms fallback:
  - On network/server error, display failure notice and show mailto: link
  - Keep client-side validations simple; never block submission on minor formatting
- Consent and privacy:
  - Required “I agree to Privacy Policy” checkbox to reduce legal risk
  - No cookies; only localStorage for UTM/referrer (90 days) included in submissions

## 6) External Service SLAs (soft targets)
- Static site TTFB at edge: < 400 ms median
- Calendly SDK load on demand: < 1.5 s on average user network
- Web3Forms submission round-trip: < 2.0 s P95
- Site availability: > 99.9% (leveraging Cloudflare Pages edge)

## 7) UTM/Referrer Capture (lightweight)
- On first visit, parse UTM params and document.referrer; store in `localStorage` for 90 days
- Include UTM fields in hidden inputs on the contact form
- On submission, POST these fields to Web3Forms
- No analytics dependency for attribution

Minimal example (pseudo-code):
```html
<script>
(function() {
  const params = new URLSearchParams(location.search);
  const utm = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
  const data = { referrer: document.referrer };
  utm.forEach(k => { if (params.get(k)) data[k] = params.get(k); });
  if (Object.keys(data).length > 0) {
    localStorage.setItem('lead_attrib', JSON.stringify({ ...data, ts: Date.now() }));
  }
})();
</script>
```

## 8) Build-Time and CI Checks (lightweight)
- Manual Lighthouse run before launch; aim to meet budgets above
- Ensure link checking and basic accessibility are part of smoke tests
- Optional local script:
```
# package.json
{
  "scripts": {
    "perf": "lighthouse http://localhost:4321 --only-categories=performance --quiet --chrome-flags=\"--headless\""
  }
}
```

## 9) Content and SEO Essentials
- Keep above-the-fold copy concise; avoid large hero videos
- Use descriptive titles/meta; social share images optimized (≤ 200 KB)
- Preload the primary hero image and the system font metrics are not required

## 10) Rollout Checklist
- Enable Brotli, HTTP/3, Auto Minify in Cloudflare
- Verify `_headers` shipped with correct cache policies
- Confirm Calendly loads only on click; fallback works
- Validate Web3Forms submission and error fallback
- Run Lighthouse (mobile) and confirm budgets
- Verify CLS visually by reserving image/container space
- Confirm Cloudflare Web Analytics script is deferred

This plan targets fast, reliable delivery with minimal complexity and clear fallbacks for third-party services.
