# API & Integrations Specification

## Overview
- Site type: Static marketing site hosted on Cloudflare Pages
- No custom backend or Workers at launch
- Lead capture via Web3Forms (free tier)
- Scheduling via Calendly popup modal (keeps users on-page)
- Attribution: Capture UTM parameters and referrer; persist in localStorage for 90 days; include in lead payload
- Spam protection: Honeypot + light client-side measures (no CAPTCHA initially)
- Compliance: Required consent checkbox linking to Privacy Policy

## Third-Party Endpoints

### 1) Web3Forms — Lead Submission
- Method: POST
- URL: https://api.web3forms.com/submit
- Headers: `Content-Type: application/json`
- Auth: `access_key` (public client key from Web3Forms)
- Success redirect: Optional (we will show inline success by default; redirect supported)

#### Request Payload (JSON)
```
{
  "access_key": "YOUR_WEB3FORMS_ACCESS_KEY",
  "subject": "New Lead — Spec-Driven Consulting",
  "from_name": "{{name}}",
  "name": "{{name}}",
  "email": "{{email}}",
  "company": "{{company}}",
  "role": "{{role}}",
  "phone": "{{phone}}",           // optional
  "message": "{{message}}",

  "consent": true,                  // required checkbox
  "botcheck": "",                 // honeypot: must be empty

  // Attribution: captured on first touch, persisted 90 days
  "utm_source": "{{utm_source}}",
  "utm_medium": "{{utm_medium}}",
  "utm_campaign": "{{utm_campaign}}",
  "utm_term": "{{utm_term}}",
  "utm_content": "{{utm_content}}",
  "referrer_url": "{{document.referrer}}",
  "landing_page": "{{first_page_url}}",
  "page_title": "{{document.title}}",
  "session_id": "{{uuid_v4}}"     // generated client-side
}
```

- Required fields: `access_key`, `name`, `email`, `message`, `consent`
- Optional fields: `company`, `role`, `phone`, UTM fields, `referrer_url`, `landing_page`, `page_title`, `session_id`

#### Example Fetch (client)
```js
async function submitLead(formData) {
  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY, // string constant in code (placeholder until setup)
    subject: 'New Lead — Spec-Driven Consulting',
    from_name: formData.name,
    name: formData.name,
    email: formData.email,
    company: formData.company || '',
    role: formData.role || '',
    phone: formData.phone || '',
    message: formData.message,
    consent: !!formData.consent,
    botcheck: formData.botcheck || '',
    ...getAttribution() // pulls UTM + referrer + landing_page + page_title + session_id
  };

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  return { ok: data?.success === true, data };
}
```

#### Response Shape (typical)
- Success: `200 OK` with body like `{ success: true, message: '...sent', data?: {...} }`
- Validation error: `4xx` with `{ success: false, message: 'Validation failed', errors?: {...} }`
- Service error: `5xx` with `{ success: false, message: 'Server error' }`

#### Error Handling (client)
- On failure (network or API), show inline error and provide fallback link: `mailto:[placeholder]` with prefilled subject/body
- Retry affordance: enable “Try again” after 5 seconds; disable submit button during request
- Degrade gracefully if JavaScript blocked: show `mailto:` CTA below form

#### Rate Limits & Client Throttling
- Expected volume: low (free tier adequate)
- Client measures:
  - Disable submit while request in-flight
  - Reject if submitted within 2 seconds of page load (basic bot filter)
  - Per-session throttle: max 3 submits per hour (localStorage counter)

#### Spam & Abuse Controls
- Honeypot field named `botcheck` hidden via CSS
- Time-to-submit gate (≥2s)
- Optional future: hCaptcha (Web3Forms supports it) — feature-flag off at launch

#### Security Considerations
- `access_key` is public in client; mitigate by:
  - Domain-level verification in Web3Forms
  - Avoid exposing personal inbox; use a dedicated alias
  - Monitor for abuse; enable hCaptcha if spam rises
- No PII stored on the site; data passes directly to Web3Forms

### 2) Calendly — Scheduling Modal
- Integration: Popup widget (modal) to keep users on-page
- Load strategy: Lazy-load Calendly script on first intent (click)

#### Embed Snippet
```html
<link rel="preconnect" href="https://assets.calendly.com" crossorigin>
<script>
  let calendlyLoaded = false;
  function openCalendly() {
    if (!calendlyLoaded) {
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.onload = () => {
        calendlyLoaded = true;
        Calendly.initPopupWidget({ url: 'https://calendly.com/YOUR-ORG/YOUR-EVENT' });
      };
      document.body.appendChild(s);
    } else {
      Calendly.initPopupWidget({ url: 'https://calendly.com/YOUR-ORG/YOUR-EVENT' });
    }
  }
</script>
<button onclick="openCalendly()" class="cta cta-primary">Schedule a Call</button>
```

- Accessibility: return focus to trigger on modal close; provide keyboard activation
- Fallback: CTA that opens Calendly in a new tab if script fails

## Client-Side Validation Rules
- Required: Name, Email, Message, Consent
- Email: simple RFC5322-safe regex; trim and lowercase
- Message: 10–1500 chars; strip HTML; escape dangerous characters
- Phone (optional): E.164 normalize if entered; do not require
- Company, Role: 2–80 chars; alphanumeric + punctuation; trim
- Consent: must be checked; show link to /privacy

## Attribution Capture (90 days)
```js
function getParams() {
  const url = new URL(window.location.href);
  const p = x => url.searchParams.get(x) || '';
  return {
    utm_source: p('utm_source'),
    utm_medium: p('utm_medium'),
    utm_campaign: p('utm_campaign'),
    utm_term: p('utm_term'),
    utm_content: p('utm_content'),
    referrer_url: document.referrer || '',
    landing_page: window.location.href,
    page_title: document.title
  };
}

function persistAttribution(days = 90) {
  const key = 'lead_attribution_v1';
  const ttl = Date.now() + days * 24 * 60 * 60 * 1000;
  const existing = JSON.parse(localStorage.getItem(key) || 'null');
  if (existing && existing.ttl > Date.now()) return existing.data;
  const data = { ...getParams(), session_id: crypto.randomUUID() };
  localStorage.setItem(key, JSON.stringify({ ttl, data }));
  return data;
}

function getAttribution() {
  const key = 'lead_attribution_v1';
  const entry = JSON.parse(localStorage.getItem(key) || 'null');
  return entry?.ttl > Date.now() ? entry.data : persistAttribution(90);
}
```

## Success/Failure UI
- Success: Inline success state within the form; optionally scroll into view; consider confetti for delight
- Optional: Redirect to `/thank-you` using `redirect` in Web3Forms payload
- Failure: Inline error with mailto fallback

## Content Security Policy (recommended)
- Allow only required origins:
  - `connect-src https://api.web3forms.com`
  - `script-src self https://assets.calendly.com`
  - `frame-src https://calendly.com https://assets.calendly.com`
  - `img-src self data:`

## Monitoring & Logs
- Web3Forms: email delivery to designated inbox (placeholder until provided)
- Consider enabling Cloudflare Web Analytics for page views and CTA click tracking

## Future Enhancements
- Add hCaptcha if spam increases
- Replace email delivery with CRM integration (HubSpot) when volume grows
- Server-side relay via Cloudflare Worker if stricter key protection is needed

## Dependencies
- None required beyond browser `fetch` and Calendly script
- No Node or server runtime needed
