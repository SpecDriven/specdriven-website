import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Scroll to contact form section
    await page.locator('form').scrollIntoViewIfNeeded();
  });

  test('should display contact form with all required fields', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check required fields
    await expect(form.locator('input[name="name"]')).toBeVisible();
    await expect(form.locator('input[name="email"]')).toBeVisible();
    await expect(form.locator('input[name="company"]')).toBeVisible();
    await expect(form.locator('select[name="role"], input[name="role"]')).toBeVisible();
    await expect(form.locator('textarea[name="message"]')).toBeVisible();

    // Check optional phone field
    await expect(form.locator('input[name="phone"]')).toBeVisible();

    // Check privacy consent checkbox
    await expect(form.locator('input[type="checkbox"]')).toBeVisible();

    // Check submit button
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const form = page.locator('form');
    const submitButton = form.locator('button[type="submit"]');

    // Try to submit empty form
    await submitButton.click();

    // Check that form doesn't submit (stays on page)
    await expect(page.url()).toContain('/');

    // Check for validation messages (adjust based on your validation implementation)
    const nameField = form.locator('input[name="name"]');
    await expect(nameField).toHaveAttribute('required');

    const emailField = form.locator('input[name="email"]');
    await expect(emailField).toHaveAttribute('required');
  });

  test('should validate email format', async ({ page }) => {
    const form = page.locator('form');
    const emailField = form.locator('input[name="email"]');

    // Enter invalid email
    await emailField.fill('invalid-email');
    await emailField.blur();

    // Check HTML5 validation
    const validity = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test('should fill and submit form successfully', async ({ page }) => {
    // Intercept form submission to Web3Forms
    await page.route('**/web3forms.com/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Form submitted successfully' })
      });
    });

    const form = page.locator('form');

    // Fill out the form
    await form.locator('input[name="name"]').fill('John Doe');
    await form.locator('input[name="email"]').fill('john.doe@example.com');
    await form.locator('input[name="company"]').fill('Test Company');

    // Handle role field (could be select or input)
    const roleField = form.locator('select[name="role"], input[name="role"]');
    if (await roleField.locator('option').count() > 0) {
      await roleField.selectOption('Product Manager');
    } else {
      await roleField.fill('Product Manager');
    }

    await form.locator('input[name="phone"]').fill('+1234567890');
    await form.locator('textarea[name="message"]').fill('This is a test message for the contact form.');

    // Check privacy consent
    await form.locator('input[type="checkbox"]').check();

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for success message or redirect
    await expect(page.locator('text=success', { timeout: 10000 })).toBeVisible();
  });

  test('should have honeypot spam protection', async ({ page }) => {
    const form = page.locator('form');

    // Check for hidden honeypot field
    const honeypot = form.locator('input[name="botcheck"]');
    await expect(honeypot).toBeHidden();

    // Verify honeypot is empty by default
    const honeypotValue = await honeypot.inputValue();
    expect(honeypotValue).toBe('');
  });

  test('should capture UTM parameters', async ({ page }) => {
    // Navigate with UTM parameters
    await page.goto('/?utm_source=test&utm_medium=email&utm_campaign=test-campaign');

    // Check that UTM data is stored (this depends on your implementation)
    const utmData = await page.evaluate(() => {
      return localStorage.getItem('utm_data');
    });

    expect(utmData).toBeTruthy();

    // If UTM data is stored as JSON, parse and verify
    if (utmData) {
      const parsedData = JSON.parse(utmData);
      expect(parsedData.utm_source).toBe('test');
      expect(parsedData.utm_medium).toBe('email');
      expect(parsedData.utm_campaign).toBe('test-campaign');
    }
  });

  test('should handle form submission errors gracefully', async ({ page }) => {
    // Intercept form submission to simulate error
    await page.route('**/web3forms.com/**', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Invalid submission' })
      });
    });

    const form = page.locator('form');

    // Fill out minimal required fields
    await form.locator('input[name="name"]').fill('John Doe');
    await form.locator('input[name="email"]').fill('john.doe@example.com');
    await form.locator('input[name="company"]').fill('Test Company');
    await form.locator('textarea[name="message"]').fill('Test message');
    await form.locator('input[type="checkbox"]').check();

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Check for error handling (adjust based on your error handling implementation)
    await expect(page.locator('text=error', { timeout: 10000 })).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    const form = page.locator('form');

    // Check form has proper labels
    const inputs = form.locator('input, textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const inputType = await input.getAttribute('type');

      // Skip hidden inputs (like honeypot)
      if (inputType === 'hidden') continue;

      // Check for label association
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      const hasLabel = id && page.locator(`label[for="${id}"]`).count() > 0;
      const hasAriaLabel = ariaLabel || ariaLabelledBy;

      expect(hasLabel || hasAriaLabel).toBeTruthy();
    }

    // Check submit button is keyboard accessible
    const submitButton = form.locator('button[type="submit"]');
    await submitButton.focus();
    await expect(submitButton).toBeFocused();
  });
});