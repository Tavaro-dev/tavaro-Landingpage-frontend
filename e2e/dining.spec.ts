import { test, expect } from '@playwright/test';

test.describe('Dining Enquiry Flow', () => {
  test('Submit Dining Enquiry Form', async ({ page }) => {
    await page.goto('/resorts');
    
    // Open modal
    const openBtn = page.getByRole('button', { name: /DISCOVER TAVARO DINING/i });
    await expect(openBtn).toBeVisible();
    await openBtn.click();
    
    // Check if modal opens to discover view
    const discoverHeading = page.getByRole('heading', { name: 'Discover Tavaro Dining' });
    await expect(discoverHeading).toBeVisible();

    // Click to proceed to the form
    const proceedBtn = page.getByRole('button', { name: /Plan your dining Experience/i });
    await expect(proceedBtn).toBeVisible();
    await proceedBtn.click();
    
    // Check if form view opens
    const formHeading = page.getByRole('heading', { name: 'Plan Your Experience' });
    await expect(formHeading).toBeVisible();
    
    // Select planning type
    await page.locator('#dn-planning').click();
    await page.getByRole('option', { name: 'Celebration' }).click();
    
    // Select request type
    await page.locator('#dn-request').click();
    await page.getByRole('option', { name: 'Quote' }).click();
    
    // Fill contact info
    await page.locator('#dn-name').fill('Test User');
    await page.locator('#dn-contact').fill('test@example.com');
    
    // Select date
    // Note: custom date picker has a specific implementation
    const dateTrigger = page.locator('#dn-date').locator('.custom-datepicker-trigger').first();
    // if #dn-date is the trigger itself:
    if (await dateTrigger.count() === 0) {
      await page.locator('#dn-date').click();
    } else {
      await dateTrigger.click();
    }
    await page.getByRole('button').filter({ hasText: /^15$/ }).click();
    
    // Fill guests and occasion
    await page.locator('#dn-guests').fill('50');
    await page.locator('#dn-occasion').fill('Birthday Party');
    
    // Select dining style
    await page.locator('#dn-style').click();
    await page.getByRole('option', { name: 'Buffet' }).click();
    
    // Fill gathering description
    await page.locator('#dn-desc').fill('We want a large cake and nice music.');
    
    // Submit
    const submitBtn = page.getByRole('button', { name: /SUBMIT ENQUIRY/i });
    await submitBtn.click();
    
    // Expect error state for production mode
    await expect(page.getByText('currently unavailable in production', { exact: false })).toBeVisible();
    
    // Expect form to remain open and input to remain intact
    await expect(page.locator('#dn-name')).toHaveValue('Test User');
    await expect(page.getByRole('button', { name: /SUBMIT ENQUIRY/i })).toBeVisible();
  });

  test('Escape key closes Dining Enquiry Modal and restores focus', async ({ page }) => {
    await page.goto('/resorts');
    
    const openBtn = page.getByRole('button', { name: /DISCOVER TAVARO DINING/i });
    await openBtn.click();
    
    const discoverHeading = page.getByRole('heading', { name: 'Discover Tavaro Dining' });
    await expect(discoverHeading).toBeVisible();
    
    // Close via escape
    await page.keyboard.press('Escape');
    await expect(discoverHeading).toBeHidden();
    
    // Ensure focus is restored to the button
    await expect(openBtn).toBeFocused();
  });
});
