// Visual regression: full-page and dialog screenshots against a production build.
// Run `npm run build && npm run test:visual`; see ./README.md for baselines.
import { test, expect, type Page } from '@playwright/test';
import { EVENTS, isBookable } from '../../lib/content/events';

// The book page is only pre-rendered for events still bookable at build time.
const bookable = EVENTS.find((e) => e.ticketTypes?.length && isBookable(e));

const PAGES = [
  '/', '/about', '/contact', '/experiences', '/experiences/stillness-project', '/mare',
  '/residences', '/residences/leela', '/residences/bhairavi-nilayam', '/residences/register',
  '/resorts', '/resorts/accommodations', '/resorts/location', '/resorts/photos', '/resorts/venues',
  '/resorts/things-to-do/explore', '/resorts/things-to-do/create', '/wellness',
];

type DialogCase = { name: string; path: string; card: string; open: (p: Page) => Promise<void> };
// CSS Module classes are hashed as `<hash>_<name>`; match the name at a class boundary.
const mod = (c: string) => `[class$="_${c}"], [class*="_${c} "]`;
const btn = (name: RegExp) => async (p: Page) => { await p.getByRole('button', { name }).first().click(); };
// The photos page opens with a welcome that asks about sound; answering it parts it over 1.6s.
const enterGallery = async (p: Page) => { await p.getByRole('button', { name: 'Enter without sound' }).click(); await p.clock.runFor(2000); };

const DIALOGS: DialogCase[] = [
  { name: 'plan-event', card: '.event-modal-card', path: '/resorts', open: btn(/Plan Your Event/) },
  { name: 'things-to-do', card: mod('ttd-modal-container'), path: '/resorts', open: btn(/Things to do/i) },
  { name: 'dining', card: '.event-modal-card', path: '/resorts', open: btn(/DISCOVER TAVARO DINING/) },
  { name: 'third-party', card: mod('ota-modal-card'), path: '/resorts', open: btn(/Check Availability/) },
  { name: 'offsite', card: mod('offsite-modal-card'), path: '/experiences', open: btn(/The Offsite Edit/i) },
  { name: 'under-the-sky', card: mod('uts-modal-card'), path: '/experiences', open: btn(/UNDER THE SKY/) },
  {
    name: 'experience-enquiry', card: mod('exp-modal-card'), path: '/resorts/things-to-do/create',
    open: async (p) => { await p.locator('[data-stage][data-active="true"] .showcase-enquire-btn').click(); },
  },
  {
    name: 'gallery-lightbox', card: mod('lightbox'), path: '/resorts/photos',
    // The first photo drifts under the see-through navbar, so open it from the keyboard.
    open: async (p) => { await enterGallery(p); await p.getByRole('button', { name: /^View photo 1 of/ }).first().focus(); await p.keyboard.press('Enter'); },
  },
  { name: 'gallery-intro', card: mod('intro-body'), path: '/resorts/photos', open: async () => {} },
];

async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(1500);
  // Lazy images below the fold never start loading on their own; force them so every run is identical.
  await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => ((i as HTMLImageElement).loading = 'eager')));
  await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 });
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
}

async function load(page: Page, path: string) {
  await page.clock.install({ time: new Date('2026-11-14T10:00:00+05:30') });
  await page.goto(path);
  await settle(page);
}

for (const vp of [{ tag: 'desktop', width: 1280, height: 800 }, { tag: 'mobile', width: 390, height: 844 }]) {
  test.describe(vp.tag, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const path of PAGES) {
      test(`page ${path}`, async ({ page }) => {
        await load(page, path);
        if (path === '/resorts/photos') await enterGallery(page);
        // Scroll through so IntersectionObserver reveals fire, then back to top.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 0)); }
          window.scrollTo(0, 0);
        });
        await settle(page);
        const slug = path === '/' ? 'home' : path.slice(1).replaceAll('/', '_');
        await expect(page).toHaveScreenshot(`${vp.tag}-page-${slug}.png`, { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.004, mask: [page.locator(mod('hero-square-tiles-canvas')), page.locator('.site-header')] });
      });
    }

    test('flow ticket-booking', async ({ page }) => {
      test.skip(!bookable, 'No event with tickets is bookable right now');
      await load(page, `/experiences/${bookable!.id}/book`);
      const shot = async (n: string) => { await settle(page); await expect(page).toHaveScreenshot(`${vp.tag}-flow-tickets-${n}.png`, { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.004, mask: [page.locator('.site-header')] }); };
      await shot('1-empty');
      await page.getByRole('button', { name: '+ Add' }).first().click();
      await shot('1-selected');
      await page.getByRole('button', { name: /Add to Cart/ }).click();
      await shot('2-cart');
      await page.getByRole('button', { name: 'Continue to Checkout' }).click();
      await shot('3-details');
      await page.getByRole('textbox', { name: 'Full Name', exact: true }).fill('Test Guest');
      await page.getByRole('textbox', { name: 'Email', exact: true }).fill('guest@example.test');
      await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('9000000000');
      await page.getByRole('textbox', { name: 'Address', exact: true }).fill('1 Test Road');
      await page.getByRole('textbox', { name: 'City', exact: true }).fill('Goa');
      await page.getByRole('textbox', { name: 'State', exact: true }).fill('Goa');
      await page.getByRole('textbox', { name: 'Postal Code', exact: true }).fill('403001');
      await page.getByRole('checkbox').check();
      await page.getByRole('button', { name: 'Continue to Payment' }).click();
      await shot('4-payment');
      await page.getByRole('button', { name: /^Pay / }).click();
      await page.waitForTimeout(500);
      await page.clock.runFor(3000);
      await shot('5-after-pay');
    });

    test('flow checkout', async ({ page }) => {
      await load(page, '/checkout');
      const shot = async (n: string) => { await settle(page); await expect(page).toHaveScreenshot(`${vp.tag}-flow-checkout-${n}.png`, { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.004, mask: [page.locator('.site-header')] }); };
      await shot('empty');
    });

    for (const d of DIALOGS) {
      test(`dialog ${d.name}`, async ({ page }) => {
        await load(page, d.path);
        await d.open(page);
        // The opening click leaves the pointer over the dialog; park it so no hover state is captured.
        await page.mouse.move(0, 0);
        await settle(page);
        // Card only: the page behind a dialog is not what this compares.
        await expect(page.locator(d.card).last()).toHaveScreenshot(`${vp.tag}-dialog-${d.name}.png`, { animations: 'disabled', maxDiffPixelRatio: 0.002 });
      });
    }
  });
}
