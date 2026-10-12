import { test, expect } from '@playwright/test';

test.describe('Header Scroll and Route Transitions', () => {
  test('header starts transparent and adds scrolled class when scrolled down', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('.site-header');
    await expect(header).toBeVisible();

    // Initial state: not scrolled
    await expect(header).not.toHaveClass(/scrolled/);

    // Scroll past 40px threshold
    await page.evaluate(() => window.scrollTo(0, 150));
    await expect(header).toHaveClass(/scrolled/);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).not.toHaveClass(/scrolled/);
  });

  test('header handles non-home routes with immediate nav-visible and hero-less routes with no-hero', async ({ page }) => {
    // Non-home route with hero
    await page.goto('/about');
    const headerAbout = page.locator('.site-header');
    await expect(headerAbout).toHaveClass(/nav-visible/);
    await expect(headerAbout).not.toHaveClass(/no-hero/);

    // Hero-less route
    await page.goto('/resorts/accommodations');
    const headerAccommodations = page.locator('.site-header');
    await expect(headerAccommodations).toHaveClass(/no-hero/);
  });

  test('header transitions cleanly during client-side navigation', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('.site-header');
    await expect(header).toHaveClass(/home/);

    // Navigate to about via main nav
    await page.getByRole('link', { name: 'About' }).first().click();
    await expect(page).toHaveURL(/.*\/about/);
    await expect(header).not.toHaveClass(/home/);
    await expect(header).toHaveClass(/nav-visible/);

    // Navigate back to home via header logo
    await header.locator('.logo').click();
    await expect(page).toHaveURL(/.*\//);
    await expect(header).toHaveClass(/home/);
  });
});
