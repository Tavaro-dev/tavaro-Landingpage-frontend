import { test, expect, type Page } from '@playwright/test';

// How content appears: page fade, scroll reveals, print.

/** Reveal blocks by position relative to the viewport, and how many are invisible. */
const reveals = (page: Page) =>
  page.evaluate(() => {
    const els = [...document.querySelectorAll('.reveal, .reveal-stagger > *')] as HTMLElement[];
    const hidden = (el: HTMLElement) => parseFloat(getComputedStyle(el).opacity) < 0.5;
    const above = els.filter((el) => el.getBoundingClientRect().bottom <= 0);
    return { total: els.length, above: above.length, aboveHidden: above.filter(hidden).length, hidden: els.filter(hidden).length };
  });

/** The PageTransition wrapper: the body child that holds the page content. */
const wrapperAnimations = (page: Page) =>
  page.evaluate(() => {
    const wrapper = document.querySelector('h1')!.closest('body > div')!;
    return wrapper.getAnimations().length;
  });

test.describe('Content loading', () => {
  test('first load is not faded; client navigation is', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
    expect(await wrapperAnimations(page)).toBe(0);

    await page.locator('header a[href="/about"]').first().click();
    await expect(page).toHaveURL(/\/about$/);
    await expect.poll(() => wrapperAnimations(page)).toBe(1);
  });

  test('sections above a restored scroll position stay visible', async ({ page }) => {
    await page.goto('/resorts');
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * 0.6, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.reload();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
    await page.waitForTimeout(500);

    const r = await reveals(page);
    expect(r.above).toBeGreaterThan(0);
    expect(r.aboveHidden).toBe(0);
  });

  test('sections jumped past (anchor link, instant scroll) are revealed', async ({ page }) => {
    await page.goto('/resorts');
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(300);
    const r = await reveals(page);
    expect(r.above).toBeGreaterThan(0);
    expect(r.aboveHidden).toBe(0);
  });

  test('the hero headline is the largest contentful paint', async ({ page }) => {
    // An element at opacity 0 at first paint never counts, so a fade-in
    // headline left the header logo as the page's LCP element.
    await page.addInitScript(() => {
      (window as unknown as { lcp: string[] }).lcp = [];
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as (PerformanceEntry & { element?: Element })[]) {
          (window as unknown as { lcp: string[] }).lcp.push(e.element?.tagName ?? '');
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    for (const path of ['/', '/about']) {
      await page.goto(path, { waitUntil: 'load' });
      await expect.poll(() => page.evaluate(() => (window as unknown as { lcp: string[] }).lcp.at(-1))).toBe('H1');
    }
  });

  test('printing shows every section', async ({ page }) => {
    await page.goto('/resorts');
    await page.waitForTimeout(500);
    expect((await reveals(page)).hidden).toBeGreaterThan(0); // below the fold, waiting to reveal
    await page.emulateMedia({ media: 'print' });
    expect((await reveals(page)).hidden).toBe(0);
  });
});
