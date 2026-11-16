// Warms the image optimizer's cache for every page after a deploy, so no visitor waits while a photo is
// resized for the first time (about 1.2-1.6s per AVIF on Vercel, against 0.1s once cached).
//
//   npm run warm:images -- https://your-site.example   (default http://localhost:3000)
//
// It reads the pages from the site's sitemap.xml and opens each as six common screens (two phones, a
// tablet, a laptop, a large desktop, a retina laptop), scrolling it top to bottom, so it requests exactly
// the sizes those screens pick. On Photos & Videos it also answers the welcome and scrolls every album.
// A second run should report every photo as already cached.
// ponytail: photos that only appear after a click (lightbox, modals, tabs) are left out; add them if the
// first open of one ever feels slow.
/* eslint-disable no-console -- a command-line tool: its report is the output */
import { chromium } from "@playwright/test";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const SCREENS = [
  { name: "phone 3x", width: 390, height: 844, dpr: 3, mobile: true },
  { name: "phone 2x", width: 390, height: 844, dpr: 2, mobile: true },
  { name: "tablet", width: 820, height: 1180, dpr: 2, mobile: true },
  { name: "laptop", width: 1440, height: 900, dpr: 1, mobile: false },
  { name: "desktop", width: 1920, height: 1080, dpr: 1, mobile: false },
  { name: "retina laptop", width: 1440, height: 900, dpr: 2, mobile: false },
];

// The sitemap lists the canonical domain; only the paths are used, against the site being warmed.
const sitemap = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
const PAGES = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (!PAGES.length) throw new Error(`No pages found in ${base}/sitemap.xml`);
console.log(`warming ${PAGES.length} pages on ${SCREENS.length} screens: ${base}`);

const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const totals = { images: 0, hit: 0, miss: 0, failed: 0 };
const start = Date.now();

for (const s of SCREENS) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: s.dpr,
    isMobile: s.mobile,
    hasTouch: s.mobile,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const seen = { images: 0, hit: 0, miss: 0, failed: 0 };
  let pending = 0;
  page.on("request", (r) => r.url().includes("/_next/image") && pending++);
  page.on("requestfailed", (r) => r.url().includes("/_next/image") && (pending--, seen.failed++));
  page.on("response", async (r) => {
    if (!r.url().includes("/_next/image")) return;
    await r.finished().catch(() => {});
    pending--;
    seen.images++;
    // Next reports its own cache; a CDN in front may answer first with its own header.
    const h = r.headers();
    const cache = `${h["x-nextjs-cache"] ?? ""} ${h["x-vercel-cache"] ?? ""} ${h["cf-cache-status"] ?? ""}`;
    if (/HIT|STALE/i.test(cache)) seen.hit++;
    else seen.miss++;
    if (!r.ok()) seen.failed++;
  });
  // Wait until every requested photo has arrived (or a quiet spell passes).
  const settle = async () => {
    for (let t = 0; t < 300 && pending > 0; t++) await page.waitForTimeout(100);
    await page.waitForTimeout(150);
  };
  // A screen at a time, so lazy photos and scroll reveals come near and ask for their files.
  const scrollThrough = async (scroller) => {
    for (let more = true; more; ) {
      more = await page.evaluate((sel) => {
        const el = sel ? [...document.querySelectorAll("div")].find((d) => d.scrollHeight > d.clientHeight + 4 && getComputedStyle(d).overflowY === "auto") : document.scrollingElement;
        if (!el || el.scrollTop + el.clientHeight >= el.scrollHeight - 4) return false;
        el.scrollTop += el.clientHeight * 0.8;
        return true;
      }, scroller);
      await page.waitForTimeout(120);
      await settle();
    }
  };

  for (const path of PAGES) {
    try {
      await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
      const welcome = page.getByRole("button", { name: "Enter without sound" });
      if (await welcome.isVisible({ timeout: 1500 }).catch(() => false)) await welcome.click();
      await settle();
      await scrollThrough(null);
      // Photos & Videos: every album too.
      const albums = page.getByRole("button", { name: /^See all photos:/ });
      for (let i = 0, n = await albums.count(); i < n; i++) {
        await albums.nth(i).scrollIntoViewIfNeeded();
        await albums.nth(i).click();
        const sheet = page.locator('[aria-labelledby="gallery-album-title"]').last();
        await sheet.waitFor();
        await scrollThrough("sheet");
        await page.keyboard.press("Escape");
        await sheet.waitFor({ state: "detached" });
      }
    } catch (e) {
      seen.failed++;
      console.error(`  ${s.name} ${path}: ${String(e).split("\n")[0]}`);
    }
  }

  console.log(`${s.name.padEnd(14)} ${String(seen.images).padStart(5)} photos: ${seen.hit} already cached, ${seen.miss} resized now${seen.failed ? `, ${seen.failed} failed` : ""}`);
  for (const k of Object.keys(totals)) totals[k] += seen[k];
  await ctx.close();
}
await browser.close();
console.log(`done in ${Math.round((Date.now() - start) / 1000)}s: ${totals.images} photos, ${totals.hit} already cached, ${totals.miss} resized now${totals.failed ? `, ${totals.failed} failed` : ""}`);
process.exitCode = totals.failed ? 1 : 0;
