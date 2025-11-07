# Third‑Party Libraries and Services

This document lists the libraries and services used for the static marketing site and how they’re integrated, including performance, privacy, and setup notes. Choices are optimized for a lightweight, fast, static deployment on Cloudflare Pages with minimal maintenance.

## Summary of Selections
- Site generator: Astro (static output)
- Styling: Tailwind CSS via @astrojs/tailwind
- Icons: Lucide
- Scheduling: Calendly modal (loaded on intent)
- Forms: Web3Forms (free tier) with honeypot; required consent checkbox
- Analytics: Cloudflare Web Analytics (cookie‑free)
- Hosting/CDN/DNS: Cloudflare Pages + Cloudflare DNS
- Repo/CI: GitHub with Cloudflare Pages Git integration (preview deployments for PRs)
- Content (future blog): Astro Content Collections (Markdown/MDX)
- No additional trackers/pixels at launch

## Libraries/Services and Rationale

1) Astro
- Purpose: Build a fast static site with an easy future path to a blog.
- Why: Zero JS by default, great DX, seamless Markdown/MDX support, works perfectly on Cloudflare Pages.
- License: MIT
- Notes: Static build; no server runtimes required.

2) Tailwind CSS (+ @astrojs/tailwind)
- Purpose: Utility‑first styling for rapid iteration and consistent design.
- Why: Very small runtime overhead (none at runtime), fast to iterate.
- License: MIT
- Notes: Use purge/content config to keep CSS minimal.

3) Lucide Icons
- Purpose: Clean, lightweight icon set.
- Why: Simple SVGs, tree‑shakable assets.
- License: ISC (MIT‑like)
- Notes: Inline SVGs or prebuilt icon components; no extra JS required.

4) Calendly (modal popup)
- Purpose: Primary scheduling flow.
- Why: Highest conversion with sticky CTA; load script only on intent to preserve performance.
- License: Proprietary (service). Embed allowed.
- Loading strategy: Deferred/on‑click.
- Placeholder URL: https://calendly.com/your-handle/intro-call

5) Web3Forms (free tier)
- Purpose: Contact form submission handling without a backend.
- Why: No server to maintain, email delivery, honeypot protection; suitable for low volume.
- License: SaaS (service). Free tier used; no paid features.
- Anti‑spam: Honeypot field only at launch (no captcha).
- Data: Posts form data to Web3Forms endpoint; you configure recipient email inside Web3Forms.

6) Cloudflare Web Analytics
- Purpose: Privacy‑friendly, cookie‑free analytics.
- Why: Zero consent banner needed, first‑party and lightweight.
- License: Cloudflare service.
- Loading strategy: Defer.

7) Cloudflare Pages (+ DNS)
- Purpose: Hosting, CDN, previews for PRs, custom domain on Cloudflare DNS.
- Why: Excellent static hosting, frictionless GitHub integration.
- License: Cloudflare service.

8) Future blog utilities
- Astro Content Collections for Markdown/MDX
- Optional (future): @astrojs/rss for RSS, @astrojs/sitemap for sitemaps

## Integration Details

### Calendly Modal (load on intent)
- Add a primary CTA button that loads Calendly only on click to minimize JS cost.
- Example (inline script in Astro page):
```html
<button id="schedule-btn" class="btn-primary">Schedule a Call</button>
<script>
  const btn = document.getElementById('schedule-btn');
  btn?.addEventListener('click', () => {
    const init = () => window.Calendly?.initPopupWidget({ url: 'https://calendly.com/your-handle/intro-call' });
    if (!window.Calendly) {
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      s.onload = init;
      document.body.appendChild(s);
    } else {
      init();
    }
  });
</script>
```
- Accessibility: Ensure focus trapping and ESC to close are handled by Calendly modal; provide a visible focus outline on the button.

### Web3Forms (free tier) with Honeypot + Consent
- Endpoint: https://api.web3forms.com/submit
- Access key: public key provided by Web3Forms (placeholder below). This key is public in the static form and is acceptable per their docs.
- Required fields at launch (Recommended set): Name, Email, Company, Role, Phone (optional), Message; plus consent checkbox.
- Spam protection: Built‑in honeypot (hidden field named e.g., "botcheck").
- Inline success: Show a success message; provide a strong “Schedule a Call” button that opens the Calendly modal.

Example Astro/HTML form snippet:
```html
<form action="https://api.web3forms.com/submit" method="POST" class="space-y-4" id="contact-form">
  <!-- Web3Forms public access key -->
  <input type="hidden" name="access_key" value="WEB3FORMS_ACCESS_KEY_PLACEHOLDER" />

  <!-- Metadata -->
  <input type="hidden" name="from_name" value="Spec-Driven Consulting Website" />
  <input type="hidden" name="subject" value="New Lead from Contact Form" />

  <!-- Attribution (UTM/referrer) populated by a small script) -->
  <input type="hidden" name="utm_source" id="utm_source" />
  <input type="hidden" name="utm_medium" id="utm_medium" />
  <input type="hidden" name="utm_campaign" id="utm_campaign" />
  <input type="hidden" name="utm_term" id="utm_term" />
  <input type="hidden" name="utm_content" id="utm_content" />
  <input type="hidden" name="referrer" id="referrer" />

  <!-- Honeypot -->
  <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" />

  <!-- Visible fields (Recommended set) -->
  <div class="grid md:grid-cols-2 gap-4">
    <input type="text" name="name" placeholder="Name" required class="input" />
    <input type="email" name="email" placeholder="Work email" required class="input" />
    <input type="text" name="company" placeholder="Company" required class="input" />
    <input type="text" name="role" placeholder="Role" required class="input" />
    <input type="tel" name="phone" placeholder="Phone (optional)" class="input md:col-span-2" />
  </div>
  <textarea name="message" placeholder="How can we help?" rows="5" required class="textarea"></textarea>

  <!-- Consent -->
  <label class="flex items-start gap-2 text-sm">
    <input type="checkbox" name="consent" required />
    <span>I agree to the <a href="/privacy" class="underline">Privacy Policy</a>.</span>
  </label>

  <button type="submit" class="btn-primary">Send message</button>
  <p id="form-success" class="hidden text-green-600 mt-2">Thanks — we’ll be in touch shortly.</p>
</form>

<script>
  // UTM/referrer capture (persist 90 days)
  (function() {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
    const now = Date.now();
    const ttl = 1000 * 60 * 60 * 24 * 90; // 90 days
    const stored = JSON.parse(localStorage.getItem('utm_store') || '{}');
    const data = stored.data || {};
    // Set any present UTM params (first touch wins)
    utmKeys.forEach(k => {
      if (!data[k] && params.get(k)) data[k] = params.get(k);
    });
    // Always record referrer on first touch
    if (!data.referrer && document.referrer) data.referrer = document.referrer;
    localStorage.setItem('utm_store', JSON.stringify({ data, ts: now }));
    // Expire old data
    const ts = stored.ts || now;
    if (now - ts > ttl) localStorage.setItem('utm_store', JSON.stringify({ data: {}, ts: now }));
    // Populate hidden inputs on the form
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
    set('utm_source', data.utm_source);
    set('utm_medium', data.utm_medium);
    set('utm_campaign', data.utm_campaign);
    set('utm_term', data.utm_term);
    set('utm_content', data.utm_content);
    set('referrer', data.referrer || document.referrer || '');
  })();

  // Handle inline success (basic)
  document.getElementById('contact-form')?.addEventListener('submit', function(){
    // Let Web3Forms handle the redirect/response; optionally intercept with fetch for SPA-style UX.
  });
</script>
```

Notes:
- Web3Forms free features only (no file uploads, no custom domains requirement). If spam increases, add hCaptcha later.
- Email recipients are configured inside Web3Forms; we’ll use a placeholder until you provide the actual address.

### Cloudflare Web Analytics
- Add the script per Cloudflare’s docs. Keep it deferred and after critical content.
- No cookies; no consent dialog required.

### SEO/Metadata Utilities
- Use Astro’s built‑in <head> for meta, Open Graph, and structured data snippets.
- Optional (future): @astrojs/sitemap and @astrojs/rss for blog.

## Performance and Loading Strategy
- JS budget: Basic target; keep total JS under ~200KB compressed.
- Third‑party loading:
  - Calendly: load only on click (intent).
  - Web3Forms: no JS required unless using custom fetch; form posts directly.
  - Cloudflare Analytics: defer.
- Fonts: System font stack only (no webfonts).
- Images: Prefer AVIF/WebP; lazy‑load noncritical images.

## Privacy, Consent, and Compliance
- Consent: Required “I agree to the Privacy Policy” checkbox on the contact form.
- Privacy Policy page: Link from footer and form.
- Data captured: Form fields listed above + attribution fields (UTM/referrer).
- Storage: UTM/referrer kept in localStorage for up to 90 days, submitted with the form.
- No marketing pixels at launch; minimal analytics only.

## Setup Checklist
- Calendly
  - Create/confirm booking link and replace the placeholder URL.
  - Verify timezones, availability, and confirmation email content.
- Web3Forms
  - Create account and get a public access key.
  - Configure recipient email(s) in Web3Forms dashboard.
  - Replace WEB3FORMS_ACCESS_KEY_PLACEHOLDER in the form.
- Cloudflare
  - Pages project connected to GitHub; set production branch to main.
  - Custom domain: specdriven.app with appropriate CNAME/Pages linkage.
  - Enable Cloudflare Web Analytics and add the provided script to the site.
- Repo
  - Protect main branch; enable preview deployments for PRs.

## Version Pinning (initial)
- Astro: latest stable (pin in package.json on init)
- @astrojs/tailwind: latest stable
- Tailwind CSS: latest stable
- Lucide: latest stable
- Optional future: @astrojs/mdx, @astrojs/rss, @astrojs/sitemap

## Future Options (not included at launch)
- hCaptcha for stronger spam protection
- CRM integration (HubSpot or similar) via embed or API later
- Notion/Headless CMS if non‑technical editing becomes important
- Email service (e.g., Postmark/SendGrid) if migrating off Web3Forms
