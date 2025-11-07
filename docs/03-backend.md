# Backend Architecture Specification

## Overview
- Deployment: Static site on Cloudflare Pages (no servers to manage)
- Backend scope: None at launch; use third-party services for form handling and scheduling
- Integrations:
  - Web3Forms (free tier) for contact form submission and email delivery
  - Calendly modal for scheduling

## Goals and Constraints
- Zero-maintenance backend; keep the stack static
- Fast page load, minimal JS
- Reliable lead capture with low friction
- Protect against basic spam without adding user friction
- PII minimization; only collect what’s needed

## Architecture
- Client-only app (Astro) serves a static HTML/CSS/JS bundle via Cloudflare Pages
- Contact form submits directly to Web3Forms HTTPS endpoint
- Calendly opens in a modal; scheduling occurs on Calendly’s domain

### Data Flow
1. User opens site (static assets from Cloudflare Pages CDN)
2. User clicks “Schedule a Call” → Calendly modal opens → user books time on Calendly → Calendly emails calendar invites
3. User completes contact form → browser POSTs to Web3Forms API → Web3Forms validates → sends email to recipient inbox → returns JSON response

### No First-Party Backend
- No Cloudflare Workers, KV, Durable Objects, or databases at launch
- No server-side rendering

## Contact Form
- Provider: Web3Forms (free tier, <250 submissions/mo)
- Endpoint: POST https://api.web3forms.com/submit
- Spam protection: Honeypot field enabled; no CAPTCHA initially
- Expected fields (subject to minor UI copy changes):
  - access_key (provided by Web3Forms)
  - name (string, required)
  - email (string, required)
  - company (string, optional)
  - message (string, required)
  - phone (string, optional, if displayed)
  - source_url (auto-filled from window.location)
  - utm_source / utm_medium / utm_campaign (optional for attribution)
  - botcheck (hidden honeypot)

### Example Request Payload (JSON)
```
{
  "access_key": "YOUR_WEB3FORMS_ACCESS_KEY",
  "name": "Jane Product",
  "email": "jane@company.com",
  "company": "Acme Co",
  "message": "We want an engineering maturity assessment.",
  "source_url": "https://spec-driven.consulting/",
  "utm_source": "linkedin",
  "utm_medium": "organic",
  "utm_campaign": "launch",
  "botcheck": ""
}
```

### Success Response (Web3Forms)
```
{
  "success": true,
  "message": "Submission successful."
}
```

### Client-Side Handling
- On success: show confirmation, optionally offer Calendly CTA
- On failure: show retry message and provide mailto link fallback

## Email Delivery
- Recipient: Single inbox (provide address; e.g., leads@yourdomain.com)
- Configure recipient within Web3Forms settings or form data per provider docs
- Optional CC/BCC can be added later if needed

## Security and Privacy
- TLS end-to-end (HTTPS)
- No secrets stored server-side; the Web3Forms access key is public-by-design for client submission
- Restrict allowed domains in Web3Forms dashboard to prevent abuse
- Minimal PII: name, email, company, message; avoid storing data in the client beyond submission
- Content Security Policy (CSP) to allow:
  - scripts: self, Calendly, Web3Forms
  - connect: Web3Forms API
  - frame: Calendly domains
- Accessibility: ensure form labels, ARIA for modal

## Calendly Integration
- Use Calendly inline script to power a modal
- Trigger from sticky header CTA and from a prominent “Schedule” section
- Keep Calendly script lazy-loaded and initialize only on intent

## Error and Edge Cases
- Network failure to Web3Forms → display fallback (mailto) and encourage Calendly booking
- Web3Forms rate limits or downtime → display friendly error; consider Worker fallback in future
- Spam inflow → add hCaptcha/Turnstile or route via a Worker for stronger filtering later

## Observability
- Basic: console logging suppressed in production; lightweight analytics can be added later
- Form submission success/failure events can be tracked with a simple analytics snippet when introduced

## Future Enhancements (Post-launch)
- Cloudflare Worker for:
  - server-side spam filtering (Turnstile/hCaptcha verification)
  - sending via transactional email (e.g., SendGrid/SES)
  - CRM forwarding (HubSpot/Pipedrive) via webhook
- Persist UTM/referrer and include in submissions automatically
- Webhooks from Calendly to CRM (optional)

## Configuration
- Environment variables (build-time via Astro/Vite):
  - VITE_CALENDLY_URL = "https://calendly.com/yourspace/intro-call"
  - VITE_WEB3FORMS_ACCESS_KEY = "..."
  - VITE_CONTACT_EMAIL = "leads@yourdomain.com" (for mailto fallback)
- CSP headers configured via _headers file on Cloudflare Pages

## Out of Scope (for launch)
- User authentication
- Database or file storage
- Custom APIs or server-side rendering
- CRM integration
