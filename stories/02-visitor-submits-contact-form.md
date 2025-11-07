# User Story: Visitor Submits Contact Form

## Story
As a **potential client visiting the website**,  
I want to **submit a contact form with my information**,  
So that **the Spec-Driven Consulting team can reach out to me**.

## Acceptance Criteria

### Given
- I am on the Spec-Driven Consulting website
- Web3Forms is properly configured
- I prefer email communication over scheduling immediately

### When
1. I scroll to the contact form section
2. I fill in the required fields (Name, Email, Company, Role, Message)
3. I optionally provide my phone number
4. I check the privacy policy consent checkbox
5. I click "Send Message"

### Then
- Form should validate all required fields
- Submission should complete within 2 seconds
- I should see a success message inline
- The success message should prompt me to schedule a call
- An email should be sent to the configured recipient
- My UTM parameters should be included if I came from a campaign

## Technical Implementation Notes

### Form Fields
- **Required**: Name, Email, Company, Role, Message, Consent
- **Optional**: Phone
- **Hidden**: UTM parameters, referrer, landing page, honeypot

### Web3Forms Integration
```javascript
// Form submission handler
async function submitForm(formData) {
  const payload = {
    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
    subject: 'New Lead — Spec-Driven Consulting',
    name: formData.name,
    email: formData.email,
    company: formData.company,
    role: formData.role,
    phone: formData.phone || '',
    message: formData.message,
    consent: true,
    // Include UTM attribution
    ...getStoredAttribution()
  };
  
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  return response.json();
}
```

### Spam Protection
- Honeypot field (hidden checkbox must remain empty)
- Time-based validation (reject if submitted < 2 seconds after page load)
- Client-side validation before submission

### Attribution Tracking
- Capture UTM parameters on first visit
- Store in localStorage for 90 days
- Include in form submission payload

## Priority: HIGH

## Dependencies
- Web3Forms account with access key
- VITE_WEB3FORMS_ACCESS_KEY environment variable
- Privacy policy page or section
- UTM tracking utilities implemented

## Test Scenarios

### 1. Happy Path
- Fill all required fields
- Check consent
- Submit → Success message
- Verify email received

### 2. Validation Errors
- Submit with empty required fields → Show field errors
- Submit without consent → Block submission
- Invalid email format → Show email error

### 3. Spam Prevention
- Fill honeypot field → Silently reject
- Submit immediately on page load → Reject

### 4. Attribution
- Visit with ?utm_source=linkedin
- Fill and submit form
- Verify UTM included in submission

### 5. Error Handling
- Web3Forms API down → Show error with mailto fallback
- Network failure → Show retry option

## Success Metrics
- Form completion rate > 60%
- Submission success rate > 95%
- Average time to complete < 2 minutes
- Spam submissions < 5%

## UI/UX Requirements
- Clear field labels and placeholders
- Inline validation messages
- Loading state during submission
- Success message with CTA to schedule call
- Mobile-responsive layout
- Accessible form controls with proper ARIA labels