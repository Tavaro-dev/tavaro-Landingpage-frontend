import { test, expect } from '@playwright/test';

test.describe('Accessibility Regressions', () => {
  test('CustomSelect accessibility', async ({ page }) => {
    await page.goto('/resorts');
    
    // Find the room type select
    const trigger = page.locator('.custom-select-trigger'); // or use role
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    
    // Select an option
    await page.getByRole('option', { name: 'Suites' }).click();
    await expect(trigger).toHaveText('Suites');
    
    // Press escape to close
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('CustomDatePicker accessibility', async ({ page }) => {
    await page.goto('/resorts');
    
    const checkinTrigger = page.locator('.custom-datepicker-trigger').first();
    
    // Should be keyboard accessible
    await checkinTrigger.focus();
    
    // Open calendar
    await checkinTrigger.click();
    const dialog = page.getByRole('dialog').first(); // the popover
    await expect(dialog).toBeVisible();
    
    // Select a date
    const dayBtn = dialog.getByRole('button').filter({ hasText: /^15$/ }); // Click 15th
    await dayBtn.click();
    
    // The field should update
    await expect(page.getByText(/15 [A-Z]/i)).toBeVisible();
    
    // Escape closes it
    await checkinTrigger.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('Modal accessibility', async ({ page }) => {
    await page.goto('/resorts');
    
    // There is a Plan Event button
    const openBtn = page.getByRole('button', { name: 'Plan Your Event' }).first();
    await openBtn.click();
    
    // Modal opens and shows title
    const modalHeading = page.getByRole('heading', { name: 'Tell us about your celebration' });
    await expect(modalHeading).toBeVisible();
    
    // Close button closes it
    const closeBtn = page.getByRole('button', { name: 'Close modal' });
    await closeBtn.click();
    await expect(modalHeading).toBeHidden();
  });

  test('Mobile navigation accessibility', async ({ page }) => {
    // Force mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuBtn = page.getByRole('button', { name: 'Open menu' });
    await menuBtn.click();
    
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).toHaveAttribute('aria-hidden', 'false');
    
    // Close button works
    const closeBtn = page.locator('.mobile-close-btn');
    await closeBtn.click();
    await expect(mobileNav).toHaveAttribute('aria-hidden', 'true');
    
    // Escape closes it
    await menuBtn.click();
    await expect(mobileNav).toHaveAttribute('aria-hidden', 'false');
    await page.keyboard.press('Escape');
    await expect(mobileNav).toHaveAttribute('aria-hidden', 'true');
    
    // Focus returns
    await expect(menuBtn).toBeFocused();
  });
});
