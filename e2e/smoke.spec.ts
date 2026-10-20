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
  '/resorts/things-to-do/explore',
  '/resorts/things-to-do/create',
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

  test('Things to Do modal opens from Resorts page and navigates to dedicated pages', async ({ page }) => {
    await page.goto('/resorts');

    // Click Things to do in quickNav
    const thingsToDoBtn = page.getByRole('button', { name: /Things to do/i });
    await expect(thingsToDoBtn).toBeVisible();
    await thingsToDoBtn.click();

    // Verify modal dialog is open with title
    const modal = page.locator('.ttd-modal-container');
    await expect(modal).toBeVisible();

    const modalHeading = modal.getByRole('heading', { name: /How would you like to spend your time\?/i });
    await expect(modalHeading).toBeVisible();

    // Verify option 1
    const exploreCard = modal.getByRole('link', { name: /Explore at Your Own Pace/i });
    await expect(exploreCard).toBeVisible();

    // Verify option 2
    const createCard = modal.getByRole('link', { name: /Create Your Experience/i });
    await expect(createCard).toBeVisible();

    // Click option 1 and verify navigation
    await exploreCard.click();
    await expect(page).toHaveURL(/.*\/resorts\/things-to-do\/explore/);
    await expect(page.getByRole('heading', { name: /A little more room to be\./i, level: 1 })).toBeVisible();
  });

  test('Explore at Your Own Pace page renders all sections and activities', async ({ page }) => {
    await page.goto('/resorts/things-to-do/explore');

    // Hero title and eyebrow
    await expect(page.getByRole('heading', { name: /A little more room to be\./i, level: 1 })).toBeVisible();
    await expect(page.getByText('EXPLORE AT YOUR OWN PACE', { exact: true })).toBeVisible();

    // 4 Category tab options
    await expect(page.locator('.showcase-tab-btn', { hasText: 'Dine' })).toBeVisible();
    await expect(page.locator('.showcase-tab-btn', { hasText: 'Unwind' })).toBeVisible();
    await expect(page.locator('.showcase-tab-btn', { hasText: 'Play' })).toBeVisible();
    await expect(page.locator('.showcase-tab-btn', { hasText: 'Explore' })).toBeVisible();

    // Verify category tab switching and activity chips in each panel
    await expect(page.locator('.showcase-chip', { hasText: 'Màre — poolside coffee & dining' })).toBeVisible();

    await page.locator('.showcase-tab-btn', { hasText: 'Unwind' }).click();
    await expect(page.locator('.showcase-chip', { hasText: 'Time in the Mango Grove' })).toBeVisible();

    await page.locator('.showcase-tab-btn', { hasText: 'Play' }).click();
    await expect(page.locator('.showcase-chip', { hasText: 'Lawn games' })).toBeVisible();

    await page.locator('.showcase-tab-btn', { hasText: 'Explore' }).click();
    await expect(page.locator('.showcase-chip', { hasText: 'Tree Deck' })).toBeVisible();

    // Closing section
    await expect(page.getByRole('heading', { name: 'Explore at Your Own Pace' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Resorts Overview/i })).toBeVisible();
  });

  test('Create Your Experience page renders categories and opens enquiry modal from CTA', async ({ page }) => {
    await page.goto('/resorts/things-to-do/create');

    // Hero title and eyebrow
    await expect(page.getByRole('heading', { name: /Something special, made yours\./i, level: 1 })).toBeVisible();
    await expect(page.getByText('CREATE YOUR EXPERIENCE', { exact: true })).toBeVisible();

    // Key category tabs
    await expect(page.locator('.showcase-tab-btn', { hasText: 'Wellness' })).toBeVisible();
    await expect(page.locator('.showcase-tab-btn', { hasText: 'Movement' })).toBeVisible();
    await expect(page.locator('.showcase-tab-btn', { hasText: 'Create' })).toBeVisible();
    await expect(page.locator('.showcase-tab-btn', { hasText: 'Gather' })).toBeVisible();

    // Verify category tab switching and activity chips in each panel
    await expect(page.locator('.showcase-chip', { hasText: 'Hatha Yoga' })).toBeVisible();

    await page.locator('.showcase-tab-btn', { hasText: 'Movement' }).click();
    await expect(page.locator('.showcase-chip', { hasText: 'Animal Flow' })).toBeVisible();

    await page.locator('.showcase-tab-btn', { hasText: 'Create' }).click();
    await expect(page.locator('.showcase-chip', { hasText: 'Art Workshops' })).toBeVisible();

    await page.locator('.showcase-tab-btn', { hasText: 'Gather' }).click();
    await expect(page.locator('.showcase-chip', { hasText: 'Private Dining' })).toBeVisible();

    // Enquire about experience CTA
    const arrangeBtn = page.locator('.showcase-panel.active .showcase-enquire-btn');
    await expect(arrangeBtn).toBeVisible();
    await arrangeBtn.click();

    // Verify modal opened
    const modal = page.locator('.exp-modal-card');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: /Arrange an Experience/i })).toBeVisible();
    await expect(modal.getByLabel(/Full Name/i)).toBeVisible();

    // Close modal via Escape
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });
});
