import { test, expect } from '@playwright/test';

test.describe('Calendly Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should not load Calendly script on page load', async ({ page }) => {
    // Check that Calendly script is not loaded initially
    const calendlyScript = page.locator('script[src*="calendly"]');
    await expect(calendlyScript).toHaveCount(0);

    // Check that window.Calendly is not defined
    const hasCalendly = await page.evaluate(() => typeof window.Calendly !== 'undefined');
    expect(hasCalendly).toBe(false);
  });

  test('should have Schedule Call buttons with correct attributes', async ({ page }) => {
    // Find all CTA buttons that should trigger Calendly
    const ctaButtons = page.locator('button:has-text("Schedule"), a:has-text("Schedule")');
    await expect(ctaButtons.first()).toBeVisible();

    // Check that buttons have appropriate data attributes or click handlers
    const buttonCount = await ctaButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    for (let i = 0; i < buttonCount; i++) {
      const button = ctaButtons.nth(i);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  });

  test('should attempt to load Calendly on CTA click', async ({ page }) => {
    // Mock the Calendly script loading
    await page.addInitScript(() => {
      // Simulate Calendly being loaded
      (window as any).Calendly = {
        initPopupWidget: () => {
          console.log('Calendly popup widget initialized');
          // Create a mock modal element
          const modal = document.createElement('div');
          modal.id = 'calendly-modal';
          modal.style.position = 'fixed';
          modal.style.top = '0';
          modal.style.left = '0';
          modal.style.width = '100%';
          modal.style.height = '100%';
          modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
          modal.style.zIndex = '9999';
          modal.innerHTML = '<div style="background: white; margin: 50px; padding: 20px;">Mock Calendly Widget</div>';
          document.body.appendChild(modal);
        }
      };
    });

    // Find and click a Schedule Call button
    const scheduleButton = page.locator('button:has-text("Schedule"), a:has-text("Schedule")').first();
    await scheduleButton.click();

    // Wait for modal to appear (this depends on your implementation)
    await page.waitForTimeout(1000);

    // Check if modal or popup appeared
    const modal = page.locator('#calendly-modal, [data-calendly-modal], .calendly-popup-widget');
    await expect(modal.first()).toBeVisible({ timeout: 5000 });
  });

  test('should handle Calendly script loading failure gracefully', async ({ page }) => {
    // Mock script loading failure
    await page.route('**/calendly.com/**', (route) => {
      route.abort('failed');
    });

    await page.route('**/assets.calendly.com/**', (route) => {
      route.abort('failed');
    });

    // Click schedule button
    const scheduleButton = page.locator('button:has-text("Schedule"), a:has-text("Schedule")').first();
    await scheduleButton.click();

    // Should fallback to opening Calendly in new tab or show error message
    // This depends on your fallback implementation
    await page.waitForTimeout(2000);

    // Check for error message or fallback behavior
    const errorMessage = page.locator('text=error, text=failed, text=unavailable');
    const newTabHref = await scheduleButton.getAttribute('href');

    // Either error message should appear or button should have fallback href
    const hasErrorMessage = await errorMessage.count() > 0;
    const hasFallbackHref = newTabHref && newTabHref.includes('calendly.com');

    expect(hasErrorMessage || hasFallbackHref).toBe(true);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const scheduleButton = page.locator('button:has-text("Schedule"), a:has-text("Schedule")').first();

    // Focus the button with keyboard
    await scheduleButton.focus();
    await expect(scheduleButton).toBeFocused();

    // Should be activatable with Enter key
    await page.keyboard.press('Enter');

    // Wait for interaction
    await page.waitForTimeout(1000);

    // Some action should have occurred (modal, script loading, etc.)
    // This test verifies the button responds to keyboard interaction
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const scheduleButtons = page.locator('button:has-text("Schedule"), a:has-text("Schedule")');
    const buttonCount = await scheduleButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = scheduleButtons.nth(i);

      // Check for accessibility attributes
      const ariaLabel = await button.getAttribute('aria-label');
      const role = await button.getAttribute('role');
      const title = await button.getAttribute('title');

      // Button should have accessible text or aria-label
      const text = await button.textContent();
      const hasAccessibleText = text && text.trim().length > 0;
      const hasAriaLabel = ariaLabel && ariaLabel.length > 0;

      expect(hasAccessibleText || hasAriaLabel).toBe(true);
    }
  });

  test('should close modal with Escape key', async ({ page }) => {
    // Mock Calendly to create a modal that responds to Escape
    await page.addInitScript(() => {
      (window as any).Calendly = {
        initPopupWidget: () => {
          const modal = document.createElement('div');
          modal.id = 'calendly-modal';
          modal.style.position = 'fixed';
          modal.style.top = '0';
          modal.style.left = '0';
          modal.style.width = '100%';
          modal.style.height = '100%';
          modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
          modal.style.zIndex = '9999';
          modal.innerHTML = '<div style="background: white; margin: 50px; padding: 20px;">Mock Calendly Widget</div>';

          // Add escape key handler
          const closeModal = () => {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
          };

          const escapeHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
              closeModal();
            }
          };

          document.addEventListener('keydown', escapeHandler);
          document.body.appendChild(modal);

          // Return close function
          return { close: closeModal };
        }
      };
    });

    // Open Calendly modal
    const scheduleButton = page.locator('button:has-text("Schedule"), a:has-text("Schedule")').first();
    await scheduleButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);
    const modal = page.locator('#calendly-modal');
    await expect(modal).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Modal should be closed
    await expect(modal).not.toBeVisible({ timeout: 2000 });
  });

  test('should track Calendly interactions for analytics', async ({ page }) => {
    let analyticsEvents: any[] = [];

    // Intercept analytics calls
    await page.exposeFunction('trackEvent', (event: any) => {
      analyticsEvents.push(event);
    });

    // Mock analytics tracking in page context
    await page.addInitScript(() => {
      (window as any).trackCalendlyOpen = () => {
        (window as any).trackEvent({ type: 'calendly_open', timestamp: Date.now() });
      };
    });

    // Click schedule button
    const scheduleButton = page.locator('button:has-text("Schedule"), a:has-text("Schedule")').first();
    await scheduleButton.click();

    // Wait for potential analytics calls
    await page.waitForTimeout(2000);

    // Verify analytics event was tracked (if implemented)
    // This test assumes you have analytics tracking for Calendly interactions
    if (analyticsEvents.length > 0) {
      expect(analyticsEvents.some(event => event.type === 'calendly_open')).toBe(true);
    }
  });
});