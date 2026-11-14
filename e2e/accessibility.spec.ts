import { test, expect } from '@playwright/test';

test.describe('Accessibility Regressions', () => {
  test('CustomSelect accessibility', async ({ page }) => {
    await page.goto('/contact');
    
    // Find the select trigger on contact page
    const trigger = page.locator('.custom-select-trigger').first();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    
    // Select an option
    await page.getByRole('option', { name: 'Planning an Event' }).click();
    await expect(trigger).toHaveText('Planning an Event');
    
    // Press escape to close
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('CustomDatePicker accessibility', async ({ page }) => {
    await page.goto('/resorts');

    // Open Plan Your Event modal to access datepicker
    const openBtn = page.getByRole('button', { name: 'Plan Your Event' }).first();
    await openBtn.click();

    const checkinTrigger = page.locator('.custom-datepicker-trigger').first();
    
    // Should be keyboard accessible
    await checkinTrigger.focus();
    
    // Open calendar
    await checkinTrigger.click();
    // The calendar is named "<Month> <Year>"; select by name since it now renders inside the event modal dialog.
    const dialog = page.getByRole('dialog', { name: /^\w+ \d{4}$/ });
    await expect(dialog).toBeVisible();
    
    // Select a date
    const dayBtn = dialog.getByRole('button').filter({ hasText: /^15$/ }).first();
    await dayBtn.click();
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

  test('Things to Do Modal accessibility and dismissal behavior', async ({ page }) => {
    await page.goto('/resorts');

    const trigger = page.getByRole('button', { name: /Things to do/i });
    await expect(trigger).toBeVisible();
    await trigger.click();

    // Exposed as a named dialog (native <dialog> opened with showModal(), so it is modal by definition)
    const modal = page.locator('.ttd-modal-container');
    await expect(modal).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'How would you like to spend your time?' })).toBeVisible();

    // Test Escape key closes modal and restores focus
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    await expect(trigger).toBeFocused();

    // Reopen and test backdrop click closes modal
    await trigger.click();
    await expect(modal).toBeVisible();
    // Click outside container on the backdrop
    await page.locator('.ttd-modal-backdrop').click({ position: { x: 10, y: 10 } });
    await expect(modal).toBeHidden();
  });

  test('Mobile navigation accessibility', async ({ page }) => {
    // Force mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuBtn = page.getByRole('button', { name: 'Open menu' });
    await menuBtn.click();
    
    const mobileNav = page.getByRole('dialog', { name: 'Menu' });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('button', { name: 'Close menu' })).toBeFocused();
    
    // Close button works
    await mobileNav.getByRole('button', { name: 'Close menu' }).click();
    await expect(mobileNav).toBeHidden();
    
    // Escape closes it
    await menuBtn.click();
    await expect(mobileNav).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(mobileNav).toBeHidden();
    
    // Focus returns
    await expect(menuBtn).toBeFocused();
  });
});
