# Database and Content Schema

## Overview
- Current MVP is a static site on Cloudflare Pages with no custom backend.
- Lead capture uses Web3Forms (free tier) and delivers to a single inbox.
- Calendly is used for scheduling; no local storage of PII beyond form submission.
- UTM/referrer attribution captured client-side and included in form payload.
- Blog will be implemented via Astro Content Collections (Markdown/MDX in repo).
- A future CRM (e.g., HubSpot) is the preferred system of record for leads. A lightweight Postgres fallback is outlined if a CRM is not adopted.

## Current (MVP) Data Flow (No Database)
- Website captures lead details (name, email, company, role, phone optional, message) + attribution (utm_*, referrer, landing page).
- Client posts to Web3Forms endpoint; service emails submission to target inbox.
- No server-side storage; no cookies for PII. Attribution stored in localStorage for 90 days.

## Attribution Capture (Client)
- Fields: utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer_url, landing_page_url, gclid (if present), first_visit_at, last_visit_at.
- Retention: localStorage for 90 days; appended to form submission payload.

## Content Model (Astro Content Collections)
- Collection: posts
  - Frontmatter schema (TypeScript zod):
    - slug: string
    - title: string
    - description: string
    - publishedAt: date
    - updatedAt: date | optional
    - author: string | optional
    - tags: string[] | optional
    - heroImage: string | optional
    - draft: boolean (default false)
    - canonicalUrl: string | optional
  - File location: src/content/posts/*.mdx
  - Indexing: Astro generates typed collections; no DB indexes needed.

## Future CRM Mapping (Preferred Path)
When a CRM is adopted, map fields as follows:
- Lead
  - first_name, last_name (split from Name input)
  - email (unique)
  - company
  - role/title
  - phone (optional)
  - message/notes
  - source = "Website"
  - lifecycle_stage = "Lead"
- Attribution (custom properties or activities)
  - utm_source, utm_medium, utm_campaign, utm_term, utm_content
  - referrer_url, landing_page_url
  - gclid (if applicable)
  - first_touch_at, last_touch_at
- Events (optional CRM activities)
  - submitted_contact_form
  - viewed_calendly
  - scheduled_call

## Optional Postgres Fallback (If CRM not used)
If a lightweight internal DB is needed before CRM adoption, use the following schema.

### ERD (Textual)
- leads (1) — (many) lead_events
- leads (many) — (many) tags via lead_tags

### Tables
1) leads
- id: uuid PK
- name: text NOT NULL
- email: citext NOT NULL UNIQUE
- company: text
- role: text
- phone: text
- message: text
- source: text NOT NULL DEFAULT 'web'
- status: text NOT NULL DEFAULT 'new' -- enum: new, contacted, qualified, disqualified
- utm_source: text
- utm_medium: text
- utm_campaign: text
- utm_term: text
- utm_content: text
- referrer_url: text
- landing_page_url: text
- gclid: text
- consent_marketing: boolean NOT NULL DEFAULT false
- created_at: timestamptz NOT NULL DEFAULT now()
- updated_at: timestamptz NOT NULL DEFAULT now()

Indexes:
- uq_leads_email (unique on email)
- idx_leads_created_at
- idx_leads_status

2) lead_events
- id: uuid PK
- lead_id: uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE
- type: text NOT NULL -- enum: submitted, viewed_calendly, scheduled_call, contacted
- metadata: jsonb NOT NULL DEFAULT '{}'::jsonb
- created_at: timestamptz NOT NULL DEFAULT now()

Indexes:
- idx_lead_events_lead_id
- idx_lead_events_type_created_at (type, created_at)

3) tags
- id: uuid PK
- tag: text NOT NULL UNIQUE

4) lead_tags
- lead_id: uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE
- tag_id: uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE
- PRIMARY KEY (lead_id, tag_id)

### Example Initial Migration (SQL)
- Enable citext
  - CREATE EXTENSION IF NOT EXISTS citext;
- Create tables and indexes per definitions above.

## Data Privacy & Retention
- MVP: No server-side storage; PII only flows to the target inbox via Web3Forms.
- Client-side attribution retained for 90 days in localStorage; user can clear via browser.
- If Postgres/CRM is used later:
  - Retain leads indefinitely unless deletion is requested.
  - Store consent_marketing flag; do not send marketing emails unless true.
  - Provide deletion playbook (lookup by email; delete lead and cascade events; remove from tags; submit deletion to CRM if applicable).

## Migration Plan
- Phase 1 (MVP): No DB, ensure form payload includes attribution fields.
- Phase 2 (CRM): Configure CRM properties and webhook or form integration; map fields; backfill historical emails if needed.
- Phase 3 (Optional Postgres): Deploy managed Postgres; run initial migration; build minimal admin/reporting if CRM is not yet in place.

## Notes
- Calendly events are not stored; use Calendly's own analytics or CRM integration later if needed.
- Blog content lives in the repo; future move to CMS is possible with a migration script to export frontmatter to the new system.