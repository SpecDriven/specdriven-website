import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Spec-Driven Consulting/);

    // Check main heading is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test sticky header navigation
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Test navigation links (adjust selectors based on actual implementation)
    const navLinks = header.locator('nav a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Test that nav links have valid href attributes
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('should have primary CTA buttons', async ({ page }) => {
    // Test main "Schedule a Call" CTA
    const scheduleButton = page.getByRole('button', { name: /schedule.*call/i });
    await expect(scheduleButton).toBeVisible();
    await expect(scheduleButton).toBeEnabled();
  });

  test('should display all required sections', async ({ page }) => {
    // Hero section
    await expect(page.locator('section').first()).toBeVisible();

    // Check for key content sections (adjust based on actual implementation)
    const sections = [
      'Value Props',
      'Services',
      'How It Works',
      'Contact'
    ];

    for (const sectionName of sections) {
      // This is a generic check - adjust selectors based on your actual implementation
      await expect(page.locator(`text=${sectionName}`).first()).toBeVisible();
    }
  });

  test('should be mobile responsive', async ({ page, isMobile }) => {
    if (isMobile) {
      // Test mobile-specific elements
      await expect(page.locator('header')).toBeVisible();

      // Check that content doesn't overflow horizontally
      const body = page.locator('body');
      const boundingBox = await body.boundingBox();
      const viewportSize = page.viewportSize();

      if (boundingBox && viewportSize) {
        expect(boundingBox.width).toBeLessThanOrEqual(viewportSize.width);
      }
    }
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check essential meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/);

    // Check for favicon
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (adjust as needed)
    const significantErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('Third-party') &&
      !error.includes('Calendly') // Calendly errors are expected before user interaction
    );

    expect(significantErrors).toHaveLength(0);
  });
});