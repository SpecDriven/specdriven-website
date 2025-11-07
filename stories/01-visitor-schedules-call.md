# User Story: Visitor Schedules Assessment Call

## Story
As a **Product Leader visiting the website**,  
I want to **quickly schedule an assessment call**,  
So that **I can explore how spec-driven development can help my organization**.

## Acceptance Criteria

### Given
- I am on the Spec-Driven Consulting website
- The Calendly integration is properly configured
- I have a need for spec-driven development consulting

### When
1. I click on any "Schedule a Call" or "Schedule Assessment Call" button
2. The Calendly modal opens (script loads on-demand)
3. I select an available time slot
4. I provide my contact information
5. I confirm the booking

### Then
- The Calendly modal should load within 2 seconds of clicking
- I should receive a calendar invitation via email
- The modal should close and return focus to the page
- I should see a confirmation message
- The booking should be recorded in Calendly's system

## Technical Implementation Notes

### Frontend Requirements
- Lazy-load Calendly script only on first CTA click
- Multiple CTAs throughout the page (header, hero, contact section)
- Modal should be keyboard accessible (ESC to close)
- Focus trap while modal is open
- Fallback: Open Calendly in new tab if script fails

### Code Snippet
```javascript
// Calendly lazy loader
function openCalendly() {
  if (!window.Calendly) {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.onload = () => {
      window.Calendly.initPopupWidget({ 
        url: import.meta.env.VITE_CALENDLY_URL 
      });
    };
    document.head.appendChild(script);
  } else {
    window.Calendly.initPopupWidget({ 
      url: import.meta.env.VITE_CALENDLY_URL 
    });
  }
}
```

### Performance Criteria
- Script should not load until user shows intent
- Modal open time < 2 seconds on 4G connection
- No impact on initial page load performance

## Priority: HIGH

## Dependencies
- Calendly account configured with available time slots
- VITE_CALENDLY_URL environment variable set
- Sticky header CTA component implemented

## Test Scenarios
1. **Happy Path**: Click CTA → Modal opens → Select time → Confirm → Success
2. **Script Blocked**: Click CTA → Script fails → Fallback link opens in new tab
3. **Mobile**: Touch CTA → Modal is mobile-responsive → Can complete booking
4. **Keyboard**: Tab to CTA → Enter → Modal opens → ESC closes modal
5. **Multiple CTAs**: All CTAs on page trigger the same modal behavior