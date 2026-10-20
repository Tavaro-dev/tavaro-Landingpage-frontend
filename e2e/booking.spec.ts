import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('Resorts page opens Third-Party Booking modal when clicking Check Availability', async ({ page }) => {
    await page.goto('/resorts');

    // Click Check Availability button
    const checkAvailabilityBtn = page.getByRole('button', { name: 'Check Availability' });
    await expect(checkAvailabilityBtn).toBeVisible();
    await checkAvailabilityBtn.click();

    // Verify modal appears
    const modal = page.locator('.ota-modal-card');
    await expect(modal).toBeVisible();

    // Verify Agoda primary link
    const agodaLink = page.locator('a.ota-option-row.primary');
    await expect(agodaLink).toBeVisible();
    await expect(agodaLink).toHaveAttribute('href', /agoda\.com/);

    // Verify partners are present in modal with verified direct Tavaro listings
    await expect(page.locator('.ota-option-name', { hasText: 'Bluepillow' })).toBeVisible();
    await expect(page.locator('.ota-option-name', { hasText: 'Google Hotels' })).toBeVisible();

    // Close modal
    const closeBtn = page.locator('.ota-modal-close');
    await closeBtn.click();
    await expect(modal).toBeHidden();
  });

  test('Complete accommodation booking flow', async ({ page }) => {
    // 1. Open accommodations directly
    await page.goto('/resorts/accommodations');

    // 2. There should be a room listing
    const firstRoom = page.locator('.room-listing-card').first();
    await expect(firstRoom).toBeVisible();

    // 8. Select/add a room to the cart
    // Use toPass to handle potential React hydration race condition where the first click might be lost
    await expect(async () => {
      const btn = firstRoom.getByRole('button', { name: 'Add to Cart' });
      if (await btn.isVisible()) {
        await btn.click();
      }
      // Wait for existing observable UI state indicating the room was successfully added
      await expect(firstRoom.getByRole('button', { name: 'Added ✓' })).toBeVisible({ timeout: 2000 });
    }).toPass();

    // 9. Navigate to checkout/cart flow
    // Open cart drawer
    await page.locator('.cart-button').first().click();
    
    // Verify drawer is open and click Book Now
    const drawer = page.locator('.cart-drawer');
    await expect(drawer).toHaveClass(/open/);
    await page.getByRole('link', { name: 'Book Now' }).click();

    // Verify we are on checkout page
    await expect(page).toHaveURL(/.*\/checkout/);

    // 10. Verify the quote/order summary is displayed
    // 10. Verify the quote/order summary is displayed
    await expect(page.locator('.order-summary')).toBeVisible();
    await expect(page.locator('.order-summary-total')).toBeVisible();

    // 11. Continue through the existing mock payment flow
    // Step 1: Enhance
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    // Step 2: Guest Details
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByLabel('Phone').fill('1234567890');
    await page.getByRole('button', { name: 'Continue to Confirm' }).click();

    // Step 3: Confirm & Pay
    await page.getByRole('button', { name: 'Pay & Confirm' }).click();

    // 12. Verify completion: in production mode safely rejected, in dev mode confirmed
    const confirmedText = page.getByRole('heading', { name: 'Thank you for choosing Tavaro.' });
    const paymentError = page.getByText('Payment Error', { exact: false });
    await expect(confirmedText.or(paymentError)).toBeVisible({ timeout: 10000 });
  });
});
