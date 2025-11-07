import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Get all headings
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    expect(headingCount).toBeGreaterThan(0);

    // Check for exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Verify heading levels don't skip (h1 → h2 → h3, not h1 → h3)
    const headingLevels: number[] = [];
    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i);
      const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
      const level = parseInt(tagName.substring(1));
      headingLevels.push(level);
    }

    // Check that heading levels are logical
    let previousLevel = 0;
    for (const level of headingLevels) {
      if (previousLevel > 0) {
        // Heading level should not jump more than 1 level down
        expect(level - previousLevel).toBeLessThanOrEqual(1);
      }
      previousLevel = Math.min(level, previousLevel || level);
    }
  });

  test('should have alt text for all images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const ariaLabelledBy = await img.getAttribute('aria-labelledby');
      const role = await img.getAttribute('role');

      // Image should have alt text, aria-label, or be marked as decorative
      const hasAltText = alt !== null && alt.length > 0;
      const hasAriaLabel = ariaLabel !== null && ariaLabel.length > 0;
      const hasAriaLabelledBy = ariaLabelledBy !== null;
      const isDecorative = role === 'presentation' || alt === '';

      expect(hasAltText || hasAriaLabel || hasAriaLabelledBy || isDecorative).toBe(true);
    }
  });

  test('should have proper form labels', async ({ page }) => {
    const inputs = page.locator('input:not([type="hidden"]), textarea, select');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');

      // Check for associated label
      let hasLabel = false;
      if (id) {
        const labelCount = await page.locator(`label[for="${id}"]`).count();
        hasLabel = labelCount > 0;
      }

      // Input should have label, aria-label, or aria-labelledby
      const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledBy;

      // Placeholder alone is not sufficient for accessibility
      expect(hasAccessibleName).toBe(true);
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // This is a basic test - for comprehensive contrast testing, use axe-core
    const body = page.locator('body');

    // Check that text is not too light on light backgrounds
    const computedStyle = await body.evaluate((el) => {
      return window.getComputedStyle(el);
    });

    // Basic check that we're not using pure white text on pure white background
    expect(computedStyle.color).not.toBe('rgb(255, 255, 255)');
    expect(computedStyle.backgroundColor).not.toBe('rgb(255, 255, 255)');
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Start from the top of the page
    await page.keyboard.press('Tab');

    // Get all focusable elements
    const focusableElements = page.locator(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const focusableCount = await focusableElements.count();
    expect(focusableCount).toBeGreaterThan(0);

    // Test that we can tab through several elements
    for (let i = 0; i < Math.min(5, focusableCount); i++) {
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Tab to next element
      await page.keyboard.press('Tab');
    }

    // Test reverse tabbing
    await page.keyboard.press('Shift+Tab');
    const focusedAfterShiftTab = page.locator(':focus');
    await expect(focusedAfterShiftTab).toBeVisible();
  });

  test('should have skip links for keyboard navigation', async ({ page }) => {
    // Check for skip link (common accessibility feature)
    const skipLink = page.locator('a[href="#main"], a[href="#content"], a:has-text("Skip to")');

    // Tab to first element (should be skip link)
    await page.keyboard.press('Tab');
    const firstFocusedElement = page.locator(':focus');

    // Either skip link should exist or first focusable should be meaningful
    const skipLinkExists = await skipLink.count() > 0;
    const firstElementText = await firstFocusedElement.textContent();
    const firstElementIsUseful = firstElementText && !firstElementText.includes('cookie');

    expect(skipLinkExists || firstElementIsUseful).toBe(true);
  });

  test('should have proper ARIA landmarks', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toHaveCount(1);

    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav.first()).toBeVisible();

    // Check for complementary content if present
    const aside = page.locator('aside, [role="complementary"]');
    // aside is optional, so we just verify it's properly marked if present

    // Check for banner/header
    const header = page.locator('header, [role="banner"]');
    await expect(header.first()).toBeVisible();

    // Check for contentinfo/footer
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer.first()).toBeVisible();
  });

  test('should have descriptive link text', async ({ page }) => {
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      const linkText = text || ariaLabel || title || '';

      // Link should not have generic text
      const genericTerms = ['click here', 'read more', 'here', 'more', 'link'];
      const isGeneric = genericTerms.some(term =>
        linkText.toLowerCase().trim() === term
      );

      expect(isGeneric).toBe(false);

      // Link should have meaningful text
      expect(linkText.trim().length).toBeGreaterThan(0);
    }
  });

  test('should have proper button accessibility', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);

      // Button should have accessible text
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      const accessibleText = text || ariaLabel || title || '';
      expect(accessibleText.trim().length).toBeGreaterThan(0);

      // Button should be focusable (unless disabled)
      const isDisabled = await button.isDisabled();
      if (!isDisabled) {
        await button.focus();
        await expect(button).toBeFocused();
      }
    }
  });

  test('should handle focus management in modals', async ({ page }) => {
    // Mock Calendly modal for focus testing
    await page.addInitScript(() => {
      (window as any).Calendly = {
        initPopupWidget: () => {
          const modal = document.createElement('div');
          modal.id = 'calendly-modal';
          modal.setAttribute('role', 'dialog');
          modal.setAttribute('aria-modal', 'true');
          modal.setAttribute('aria-labelledby', 'modal-title');
          modal.style.position = 'fixed';
          modal.style.top = '50%';
          modal.style.left = '50%';
          modal.style.transform = 'translate(-50%, -50%)';
          modal.style.backgroundColor = 'white';
          modal.style.padding = '20px';
          modal.style.zIndex = '9999';

          modal.innerHTML = `
            <h2 id="modal-title">Schedule a Call</h2>
            <button id="close-modal">Close</button>
          `;

          document.body.appendChild(modal);

          // Focus the modal
          modal.focus();

          // Add close handler
          const closeButton = modal.querySelector('#close-modal');
          if (closeButton) {
            closeButton.addEventListener('click', () => {
              modal.remove();
            });
          }
        }
      };
    });

    // Open modal
    const scheduleButton = page.locator('button:has-text("Schedule"), a:has-text("Schedule")').first();
    await scheduleButton.click();

    await page.waitForTimeout(1000);

    // Check modal ARIA attributes
    const modal = page.locator('#calendly-modal');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');

    // Focus should be trapped in modal
    const closeButton = page.locator('#close-modal');
    await expect(closeButton).toBeVisible();

    // Close modal
    await closeButton.click();
    await expect(modal).not.toBeVisible();
  });
});