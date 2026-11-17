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

test.describe('Content loading', () => {
  test('client navigation shows the new page at once, with no fade from the background', async ({ page }) => {
    // A page-wide fade from opacity 0 showed the cream body for ~0.3s before the dark hero.
    await page.goto('/');
    await page.locator('header a[href="/about"]').first().click();
    await expect(page).toHaveURL(/\/about$/);
    // The photo's layer and everything around it: only the headline text animates in.
    const media = page.locator('.page-hero > div').first();
    await expect(media).toBeVisible();
    const faded = await media.evaluate((el) => {
      for (let n: Element | null = el; n && n !== document.body; n = n.parentElement)
        if (n.getAnimations().some((a) => a.playState === 'running') || parseFloat(getComputedStyle(n).opacity) < 1) return true;
      return false;
    });
    expect(faded).toBe(false);
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
