# User Story: Visitor Arrives from Marketing Campaign

## Story
As a **visitor arriving from a marketing campaign (social, email, ads)**,  
I want **my referral source to be tracked**,  
So that **Spec-Driven Consulting can measure campaign effectiveness**.

## Acceptance Criteria

### Given
- I click a link from LinkedIn, email, or paid ads
- The link contains UTM parameters
- This is my first visit to the site

### When
1. I land on the website with UTM parameters in the URL
2. The page captures:
   - utm_source (e.g., linkedin, google, email)
   - utm_medium (e.g., social, cpc, newsletter)  
   - utm_campaign (e.g., q1-launch, assessment-promo)
   - utm_term (optional, for paid search)
   - utm_content (optional, for A/B testing)
   - referrer URL
   - landing page URL
3. I navigate around the site
4. I eventually submit a form or schedule a call

### Then
- UTM parameters should be captured on first page load
- Attribution data should persist for 90 days in localStorage
- Data should be included in any form submission
- Parameters should not be overwritten on subsequent visits (first-touch attribution)
- The URL should remain clean after capture (no UTM params in address bar)

## Technical Implementation Notes

### Attribution Capture Logic
```javascript
// utm.ts - Attribution capture utility
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const stored = getStoredAttribution();
  
  // Only capture if UTM params present and no existing attribution
  // OR if existing attribution is expired (>90 days)
  if (!stored || isExpired(stored) || hasUTMParams(params)) {
    const attribution = {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || '',
      referrer: document.referrer || '',
      landing_page: window.location.href,
      first_seen_at: Date.now(),
      last_seen_at: Date.now()
    };
    
    localStorage.setItem('attribution', JSON.stringify(attribution));
    
    // Clean URL without page reload
    if (hasUTMParams(params)) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  } else {
    // Update last seen for existing attribution
    stored.last_seen_at = Date.now();
    localStorage.setItem('attribution', JSON.stringify(stored));
  }
}

function hasUTMParams(params) {
  return ['utm_source', 'utm_medium', 'utm_campaign']
    .some(key => params.has(key));
}

function isExpired(attribution) {
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
  return Date.now() - attribution.first_seen_at > NINETY_DAYS;
}
```

### Form Integration
```html
<!-- Hidden fields added to forms -->
<input type="hidden" name="utm_source" id="utm_source" />
<input type="hidden" name="utm_medium" id="utm_medium" />
<input type="hidden" name="utm_campaign" id="utm_campaign" />
<input type="hidden" name="utm_term" id="utm_term" />
<input type="hidden" name="utm_content" id="utm_content" />
<input type="hidden" name="referrer" id="referrer" />
<input type="hidden" name="landing_page" id="landing_page" />

<script>
  // Populate hidden fields on page load
  const attribution = getStoredAttribution();
  if (attribution) {
    Object.keys(attribution).forEach(key => {
      const field = document.getElementById(key);
      if (field) field.value = attribution[key] || '';
    });
  }
</script>
```

## Priority: HIGH

## Dependencies
- UTM tracking utility functions
- localStorage available in browser
- Form hidden fields configured
- Web3Forms configured to accept attribution fields

## Test Scenarios

### 1. First Visit with UTM
- Visit: `/?utm_source=linkedin&utm_medium=social&utm_campaign=launch`
- Verify localStorage contains attribution
- Verify URL is cleaned to `/`
- Submit form → Verify UTM data included

### 2. Return Visit (No UTM)
- First visit with UTM parameters
- Return directly to site (no UTM)
- Verify original attribution preserved
- Verify last_seen_at updated

### 3. New Campaign Visit
- First visit with campaign A
- Later visit with campaign B
- Verify campaign A attribution preserved (first-touch)

### 4. Expired Attribution
- Set attribution with date 91 days ago
- Visit with new UTM parameters
- Verify new attribution replaces old

### 5. Multiple Forms
- Set attribution
- Submit contact form → Verify attribution included
- Open Calendly → Verify attribution in URL params

## Campaign Examples

### LinkedIn Campaign
```
https://specdriven.app/?utm_source=linkedin&utm_medium=social&utm_campaign=spec-driven-launch&utm_content=hero-message
```

### Google Ads
```
https://specdriven.app/?utm_source=google&utm_medium=cpc&utm_campaign=assessment-calls&utm_term=spec-driven-development
```

### Email Newsletter
```
https://specdriven.app/?utm_source=email&utm_medium=newsletter&utm_campaign=monthly-update&utm_content=cta-button
```

## Success Metrics
- Attribution capture rate: 100% of UTM visits
- Attribution persistence: 90 days
- Form submission attribution rate: >95%
- Clean URLs after capture: 100%

## Privacy Considerations
- No PII stored in attribution
- localStorage only (no cookies)
- 90-day automatic expiration
- User can clear via browser settings