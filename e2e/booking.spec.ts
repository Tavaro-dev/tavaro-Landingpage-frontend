import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('Complete accommodation booking flow', async ({ page }) => {
    // 1. Open resorts page to access search form (as requested by 'Open /resorts/accommodations' and 'Submit/search')
    await page.goto('/resorts');

    // 2. Enter/select check-in date
    await page.getByText('Select check-in').click();
    await page.getByRole('button', { name: /15 [A-Z]/i }).click();

    // 3. Enter/select check-out date
    await page.getByText('Select check-out').click();
    await page.getByRole('button', { name: /17 [A-Z]/i }).click();

    // 4. Select guest count
    // Default is 2, but we can clear and fill it
    await page.getByLabel('Guests').fill('2');

    // 5. Select room type if applicable
    await page.getByText('Any Room Type').click();
    await page.getByRole('option', { name: 'Executive Rooms' }).click();

    // 6. Submit/search availability
    await page.getByRole('button', { name: 'Check Availability' }).click();

    // 7. Verify available room results appear
    await expect(page).toHaveURL(/.*\/resorts\/accommodations.*/);
    
    // There should be a room listing
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

    // 12. Verify successful booking confirmation
    // 13. Verify a booking reference is displayed
    await expect(page.locator('h1', { hasText: 'Thank you for choosing Tavaro.' })).toBeVisible();
    await expect(page.locator('text=/Booking Reference:/')).toBeVisible();
    await expect(page.locator('text=/TAV-[A-Z0-9]+/')).toBeVisible();
  });
});
