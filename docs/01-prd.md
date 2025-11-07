# Spec-Driven Consulting — Website Plan

## Summary
A fast, clear, single-page marketing site hosted on Cloudflare Pages that speaks primarily to Product leadership at enterprise software organizations. The site promotes spec-driven development and AI-agent enablement, with the primary conversion being scheduled assessment calls (Calendly), and a secondary contact form. Future expansion will add a blog and a downloadable one-pager/email capture.

## Mission & Value Proposition
- Mission: Help development organizations adopt spec-driven development with AI code generation agents.
- Core value: Align PM, Dev, and Test around living specs to turn strategy into shipped outcomes, without incurring technical debt from ungoverned AI usage.

## Target Audience
- Primary: Product leadership (Heads of Product, Directors, PMs) at enterprise-scale orgs (≥5 PMs, ≥30 dev/testers).
- Secondary: Engineering leadership, Test leaders, Senior Developers, UX.

## Primary CTA and Goals
- Primary CTA: Schedule an assessment call (Calendly embed + prominent buttons).
- Secondary CTA: Contact form (for teams preferring email outreach) and “Talk to an expert.”
- Future CTA: Download a one-pager and/or subscribe to mailing list (gated by email), introduced alongside the blog.

### Success Metrics
- Must-have: Number of scheduled Calendly meetings per week.
- Supporting: Contact form submissions; qualified leads; time-on-page; scroll depth to Services/How It Works.
- Quality: Lighthouse ≥95 Performance/Accessibility/Best Practices/SEO on desktop, ≥90 on mobile.

## Site Structure (single-page MVP)
1. Hero
   - H1: “Align PM, Dev, and Test around living specs to turn strategy into shipped outcomes.”
   - Subhead: “Spec-driven workflows that let AI agents deliver value without adding debt.”
   - CTAs: “Schedule Assessment Call” (primary), “Contact Us” (secondary).
   - Social proof/credibility badges (logos/affiliations) — optional if available.
2. Value / Why Now
   - Problem: AI agents can create design drift and debt without guardrails.
   - Outcome: Predictable delivery, traceability, and sustainable velocity.
3. Services
   - Engineering maturity assessment and technical coaching.
   - Requirements capture and spec-driven development.
   - CI/CD and impactful, maintainable automated tests.
   - Maintainable architecture.
   - Spec-driven development coaching and staff augmentation.
   - Effective automated tests coaching and staff augmentation.
4. How It Works (Spec-Driven Flow)
   - Discovery → Spec by Example (Given/When/Then) → Traceability → AI agent implementation → Automated tests → CI/CD checks.
   - Emphasize collaboration between PM, Dev, Test; living specs as source of truth.
5. Personas
   - PM: clarity of business value; communicates to UX/Dev/Test.
   - Tester: big picture; positive/negative scenarios; specification by example.
   - Dev: purpose + scenarios; automates scenarios; traceability.
   - UX: supports scenario-driven design (brief callout).
   - AI agents: stateless; require external memory; context size/cost management.
6. What Works vs. What Doesn’t
   - Works: BDD/Gherkin/Given-When-Then, wiki-based specs, traceability from business-facing tests.
   - Doesn’t: Executable specs via Cucumber that break pipelines on typos; unnecessary complexity.
7. Tools & Integrations (experience with)
   - Aha! (PM), Figma (UX), Jira (PM/Dev), XRay for Jira (test mgmt), plus CI/CD stacks.
8. Related Work & References
   - Event Modeling (Adam Dymitruk), On.auto (Sam Hatoum), Martin Dilger.
   - Reference article: “Spec-driven development: 10 things to know about specs” (ainativedev.io/news/...)
9. About / Why Us
   - Experience enabling teams to safely harness AI agents with robust specs and tests.
   - Focus on maintainability, predictable outcomes, and measurable maturity growth.
10. Footer
   - Company name: Spec-Driven Consulting.
   - Contact email, location (if desired), basic legal links.

## Content Guidelines
- Tone: Executive-friendly, outcomes-focused, jargon-light; back up claims with concrete practices.
- Visual style: Clean, modern, high-contrast, minimal color palette; trustworthy and enterprise-leaning.
- Copy pillars:
  - Align on outcomes with living specs.
  - Enable AI agents within guardrails.
  - Build effective automated tests that empower agents and humans.
  - Achieve traceability from business value to shipped code.

## Features (MSC)
- Must
  - Single-page static site on Cloudflare Pages.
  - Hero with H1/subhead, clear CTAs (Calendly + Contact form).
  - Services, How It Works, Personas, What Works/Doesn’t, Tools, References, About.
  - Calendly inline embed + fallback link.
  - Contact form with spam protection (e.g., Cloudflare Turnstile) and reliable delivery.
  - Basic SEO (title, meta, Open Graph/Twitter, sitemap, robots.txt), schema for Organization.
  - Privacy-friendly analytics (Cloudflare Web Analytics).
  - Performance and accessibility standards as above.
- Should
  - Testimonials/Logo bar if available.
  - FAQ addressing AI agents, specs, tests, ROI, and engagement model.
  - One-pager download/email capture wiring prepared (hidden until ready).
  - Structured data for Services/FAQ if applicable.
- Could
  - Blog as second page with Markdown content.
  - Lightweight CMS workflow (git-based content) for easy updates.
  - Case studies section/cards.
  - Multilingual support.

## Technical Constraints & Assumptions
- Hosting: Cloudflare Pages (static-first). Use framework with excellent static export and Markdown support for future blog.
- Contact form: either third-party form backend (e.g., Formspark/Formspree) or Cloudflare Pages Functions + email service; protected by Turnstile.
- Calendly: embedded widget and CTA buttons.
- Analytics: Cloudflare Web Analytics.

## Risks & Mitigations
- Risk: Overly technical messaging for PMs.
  - Mitigation: Lead with outcomes; keep implementation details in deeper sections.
- Risk: Form delivery issues/spam.
  - Mitigation: Turnstile + proven form backend; add confirmation page and success email.
- Risk: Scope creep (blog, case studies) delaying launch.
  - Mitigation: Ship single-page MVP; stub future navigation and content hooks.

## Out of Scope (MVP)
- Executable spec tooling, custom CRMs, full CMS.
- Complex animations; bespoke illustrations.
- Multi-language content.
- Blog content and one-pager asset (will be added later).

## Acceptance Criteria (MVP)
- Deployed on Cloudflare Pages under desired domain.
- All sections present with draft copy and accessible navigation.
- Calendly embed functions on desktop and mobile.
- Contact form submits reliably and is spam-protected; success message shown.
- Lighthouse scores meet targets; basic SEO metadata present.
- Cloudflare analytics receiving events.
