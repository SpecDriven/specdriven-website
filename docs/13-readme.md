# Spec‑Driven Consulting — Website

Static marketing site built with Astro + Tailwind CSS and deployed on Cloudflare Pages. Primary goals: drive qualified leads and bookings for an assessment call, communicate the value of spec‑driven development for AI code agent success, and provide future growth paths (blog, gated one‑pager).

## Key outcomes
- Single‑page site with anchored sections: Hero, Value, Services, How It Works, Personas, Tools/References, About, Contact/CTA
- Primary CTA: “Schedule a Call” (Calendly popup modal)
- Secondary CTA: Contact form (Web3Forms) with inline success that re‑nudges to Calendly
- Performance‑first static build; privacy‑friendly Cloudflare Web Analytics
- Future: Blog (Astro Content Collections) and gated one‑pager download

## Audience and messaging
- Primary: Product leadership (Heads of Product/PMs)
- Hero message: “Align PM, Dev, and Test around living specs to turn strategy into shipped outcomes.”
- Support content for Engineering leaders and Test/QA personas

## Tech stack
- Framework: Astro (static), Tailwind CSS, TypeScript optional
- Hosting: Cloudflare Pages (GitHub integration, previews on PRs)
- Forms: Web3Forms (free tier), honeypot spam protection
- Scheduling: Calendly popup widget (script loaded on intent)
- Analytics: Cloudflare Web Analytics (cookie‑free)
- Icons: Lucide
- Fonts: System font stack (no webfonts)

## Prerequisites
- Cloudflare account with domain managed on Cloudflare DNS (e.g., specdriven.app)
- GitHub repo (public or private) connected to Cloudflare Pages
- Web3Forms access key (to be provided; placeholder used during development)
- Calendly scheduling URL (to be provided; placeholder used during development)
- Cloudflare Web Analytics token (to be provided)

## Env vars and placeholders
Create `.env` from `.env.example` and set:
- VITE_WEB3FORMS_ACCESS_KEY=YOUR_WEB3FORMS_KEY
- VITE_CALENDLY_URL=https://calendly.com/your-handle/intro-call
- VITE_CF_BEACON_TOKEN=your-cloudflare-analytics-token
- VITE_LEADS_TO_EMAIL=leads@your-domain (optional, used in email subject/body)

Cloudflare Pages → Project → Settings → Environment variables → Add the same `VITE_*` variables for Production and Preview.

## Quickstart (local)
1) Install prerequisites: Node 18+ (recommend 20), npm
2) Clone repo: `git clone https://github.com/your-org/your-repo.git`
3) `cd your-repo && npm install`
4) `cp .env.example .env` and fill placeholders
5) `npm run dev` → open http://localhost:4321
6) `npm run build` then `npm run preview` to test production build

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run format` — format with Prettier (if configured)

## Project structure
```
/
├─ public/                  # static assets
├─ src/
│  ├─ components/
│  │  ├─ Header.astro      # sticky header + primary CTA
│  │  ├─ Hero.astro        # PM‑focused hero
│  │  ├─ Sections/*.astro  # Value, Services, How, Personas, Tools, References, About
│  │  └─ ContactForm.astro # Web3Forms integration
│  ├─ layouts/
│  │  └─ Base.astro
│  ├─ pages/
│  │  └─ index.astro       # landing page
│  ├─ content/
│  │  └─ blog/             # future Content Collections
│  └─ lib/
│     ├─ utm.ts            # UTM capture (90‑day persistence)
│     └─ calendly.ts       # on‑demand Calendly loader
├─ .env.example
└─ tailwind.config.cjs
```

## Content to update
- Brand name: Spec‑Driven Consulting
- Domain: specdriven.app
- Hero headline + subcopy (PM‑first, as above)
- Services: 
  - Engineering maturity assessment & technical coaching
  - Requirements capture & spec‑driven development
  - CI/CD and maintainable automated tests
  - Maintainable architecture
  - Spec‑driven development coaching & staff augmentation
- Proof points: BDD/Gherkin, wiki traceability, business‑facing tests; what does/doesn’t work
- Tools: Aha!, Jira, XRay, Figma; Related work: Event Modeling; References link

## Contact form (Web3Forms)
- Fields: Name, Email, Company, Role, Phone (optional), Message
- Consent: required “I agree to the Privacy Policy” checkbox with link
- Spam protection: honeypot field `botcheck`
- Attribution: capture UTM params + referrer; persist 90 days in localStorage; include as hidden inputs
- Success: inline success message + prominent “Schedule a Call” button (opens Calendly popup)

Example Astro snippet (ContactForm.astro):
```astro
---
const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;
---
<form id="contact-form" class="space-y-4" method="POST" action="https://api.web3forms.com/submit">
  <input type="hidden" name="access_key" value={accessKey} />
  <input type="hidden" name="subject" value="New Lead — Spec‑Driven Consulting" />
  <input type="hidden" name="utm_source" id="utm_source" />
  <input type="hidden" name="utm_medium" id="utm_medium" />
  <input type="hidden" name="utm_campaign" id="utm_campaign" />
  <input type="hidden" name="utm_content" id="utm_content" />
  <input type="hidden" name="utm_term" id="utm_term" />
  <input type="hidden" name="referrer" id="referrer" />
  <input type="text" name="botcheck" id="botcheck" class="hidden" tabindex="-1" autocomplete="off" />

  <div class="grid gap-4 sm:grid-cols-2">
    <input name="name" required placeholder="Full name" class="input" />
    <input type="email" name="email" required placeholder="Work email" class="input" />
    <input name="company" required placeholder="Company" class="input sm:col-span-1" />
    <input name="role" required placeholder="Role" class="input sm:col-span-1" />
    <input name="phone" placeholder="Phone (optional)" class="input sm:col-span-2" />
  </div>
  <textarea name="message" required placeholder="What outcome are you aiming for?" class="textarea"></textarea>

  <label class="flex items-start gap-2 text-sm">
    <input type="checkbox" required />
    <span>I agree to the <a href="#" class="underline">Privacy Policy</a>.</span>
  </label>

  <button type="submit" class="btn btn-primary">Send message</button>
  <p id="form-status" class="mt-3 text-sm"></p>
</form>

<script>
  // UTM capture with 90‑day persistence
  const params = new URLSearchParams(location.search);
  const now = Date.now();
  const TTL = 1000 * 60 * 60 * 24 * 90; // 90 days
  const stored = JSON.parse(localStorage.getItem('utm') || '{}');
  if ([...params.keys()].some(k => k.startsWith('utm_'))) {
    localStorage.setItem('utm', JSON.stringify({
      ts: now,
      source: params.get('utm_source') || '',
      medium: params.get('utm_medium') || '',
      campaign: params.get('utm_campaign') || '',
      content: params.get('utm_content') || '',
      term: params.get('utm_term') || '',
      referrer: document.referrer || stored.referrer || ''
    }));
  } else if (!stored.ts || (now - stored.ts) > TTL) {
    localStorage.removeItem('utm');
  }
  const utm = JSON.parse(localStorage.getItem('utm') || '{}');
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  setVal('utm_source', utm.source);
  setVal('utm_medium', utm.medium);
  setVal('utm_campaign', utm.campaign);
  setVal('utm_content', utm.content);
  setVal('utm_term', utm.term);
  setVal('referrer', utm.referrer || document.referrer);

  // Inline submit handler
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (document.getElementById('botcheck').value) return; // bot
    status.textContent = 'Sending…';

    const formData = new FormData(form);
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      form.reset();
      status.innerHTML = 'Thanks! We\'ll get back to you shortly. ' +
        '<button id="book" class="btn btn-link">Schedule a Call</button>';
      document.getElementById('book')?.addEventListener('click', () => window.openCalendly && window.openCalendly());
    } else {
      status.textContent = 'Something went wrong. Please email us directly.';
    }
  });
</script>
```

## Calendly popup (modal on intent)
Add a global helper that lazy‑loads Calendly’s script and opens the popup. Example `src/lib/calendly.ts`:
```ts
export function openCalendly(url: string) {
  // @ts-ignore
  if (window.Calendly) {
    // @ts-ignore
    window.Calendly.initPopupWidget({ url });
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://assets.calendly.com/assets/external/widget.js';
  s.onload = () => {
    // @ts-ignore
    window.Calendly.initPopupWidget({ url });
  };
  document.head.appendChild(s);
}
// expose for inline handlers
// @ts-ignore
window.openCalendly = () => openCalendly(import.meta.env.VITE_CALENDLY_URL);
```
Use on any CTA button: `onclick="openCalendly(import.meta.env.VITE_CALENDLY_URL); return false;"`

## Cloudflare Pages deployment
Docs: https://developers.cloudflare.com/pages/

1) Connect GitHub repo
- Pages → Create a project → Connect to GitHub → select repo
- Framework preset: Astro (auto‑detected)
- Build command: `npm run build`
- Build output: `dist`
- Production branch: `main`

2) Environment variables (Project → Settings → Environment variables)
- Add `VITE_WEB3FORMS_ACCESS_KEY`, `VITE_CALENDLY_URL`, `VITE_CF_BEACON_TOKEN`
- Add to Production and Preview environments

3) Preview deployments
- Enable previews for pull requests (default on). Pages will comment with preview URLs.

4) Custom domain (Project → Custom domains)
- Add `specdriven.app` (and `www.specdriven.app` if desired)
- Set the primary domain; Pages manages DNS automatically when the zone is on Cloudflare
- Optionally add redirect from `www` → apex or vice versa

## Cloudflare Web Analytics
Docs: https://developers.cloudflare.com/analytics/web-analytics/

- Create a Web Analytics property and copy the token
- Add to site (e.g., in `Base.astro`):
```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```
- Or expose via `VITE_CF_BEACON_TOKEN` and inject dynamically

## Styling and UI
- Tailwind CSS utility classes with a minimal design system (buttons, inputs, spacing)
- System font stack for maximum performance
- Lucide icons for simple, clean visuals; minimal CSS animations only

## Performance budget (launch target)
- LCP ≤ 3.0s (mobile), CLS < 0.1
- Total JS ≤ 200KB, HTML ≤ 70KB
- Images AVIF/WebP; lazy‑load below the fold
- Third‑party scripts loaded on intent (Calendly)

## Testing (minimal smoke)
- Build succeeds locally and on Pages
- All header/nav links scroll to sections; no broken links
- Calendly popup opens from all CTAs
- Form validates client‑side; submissions succeed (use test key)
- Basic accessibility check (tab order, labels, color contrast)

## Future roadmap
- Blog via Astro Content Collections (MD/MDX in repo)
- Gated one‑pager download (short form → instant download + emailed link)
- Optional hCaptcha if spam increases
- CRM integration (e.g., HubSpot) when lead volume grows

## License
Private/proprietary. All rights reserved.

## Troubleshooting
- Build fails on Pages: ensure Node 18+ and Astro preset detected; set `NODE_VERSION` if needed
- Web3Forms 401/403: verify `VITE_WEB3FORMS_ACCESS_KEY` and that the domain/referer is allowed in Web3Forms dashboard
- Calendly not opening: confirm the script loads and `VITE_CALENDLY_URL` is valid
- Analytics not reporting: ensure the beacon script has the correct token
