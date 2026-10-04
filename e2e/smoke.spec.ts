import { test, expect } from '@playwright/test';

const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/experiences',
  '/mare',
  '/residences',
  '/resorts',
  '/resorts/accommodations',
  '/wellness'
];

test.describe('Smoke tests for public routes', () => {
  for (const route of publicRoutes) {
    test(`Route ${route} should load successfully`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      
      // Basic check that it didn't render an error page
      const errorHeading = page.locator('h1', { hasText: '500' });
      await expect(errorHeading).toHaveCount(0);
      const notFoundHeading = page.locator('h1', { hasText: '404' });
      await expect(notFoundHeading).toHaveCount(0);
    });
  }
});

test.describe('Navigation Smoke tests', () => {
  test('Main navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to Resorts
    await page.getByRole('link', { name: 'Resorts', exact: true }).first().click();
    await expect(page).toHaveURL(/.*\/resorts/);
    
    // Test navigation to Experiences
    await page.getByRole('link', { name: 'Experiences', exact: true }).first().click();
    await expect(page).toHaveURL(/.*\/experiences/);
  });
});
