// Warms the image optimizer's cache for the Photos & Videos page after a deploy, so no visitor waits
// while a photo is resized for the first time.
//
//   npm run warm:gallery -- https://your-site.example   (default http://localhost:3000)
//
// It opens the page as six common screens (two phones, a tablet, a laptop, a large desktop, a retina
// laptop), answers the welcome, scrolls the whole page and every album, and so requests exactly the
// sizes those screens pick. A second run should report every photo as a cache hit.
// ponytail: the full-size photos in the lightbox are left out (each opens on its own click); add them if
// the first open of a photo ever feels slow.
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

  await page.goto(`${base}/resorts/photos`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Enter without sound" }).click();
  await settle();
  // The page: a screen at a time, so each room comes near and asks for its photos.
  for (let y = 0; ; y += s.height * 0.8) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
    await settle();
    if (y > (await page.evaluate(() => document.documentElement.scrollHeight))) break;
  }
  // Every album, scrolled to its end.
  const albums = page.getByRole("button", { name: /^See all photos:/ });
  for (let i = 0, n = await albums.count(); i < n; i++) {
    await albums.nth(i).scrollIntoViewIfNeeded();
    await albums.nth(i).click();
    const sheet = page.locator('[aria-labelledby="gallery-album-title"]').last();
    await sheet.waitFor();
    for (let more = true; more; ) {
      more = await page.evaluate(() => {
        const body = [...document.querySelectorAll("div")].find((d) => d.scrollHeight > d.clientHeight + 4 && getComputedStyle(d).overflowY === "auto");
        if (!body || body.scrollTop + body.clientHeight >= body.scrollHeight - 4) return false;
        body.scrollTop += body.clientHeight * 0.8;
        return true;
      });
      await page.waitForTimeout(120);
      await settle();
    }
    await page.keyboard.press("Escape");
    await sheet.waitFor({ state: "detached" });
  }

  console.log(`${s.name.padEnd(14)} ${String(seen.images).padStart(4)} photos: ${seen.hit} already cached, ${seen.miss} resized now${seen.failed ? `, ${seen.failed} failed` : ""}`);
  for (const k of Object.keys(totals)) totals[k] += seen[k];
  await ctx.close();
}
await browser.close();
console.log(`done in ${Math.round((Date.now() - start) / 1000)}s: ${totals.images} photos, ${totals.hit} already cached, ${totals.miss} resized now${totals.failed ? `, ${totals.failed} failed` : ""}`);
process.exitCode = totals.failed ? 1 : 0;
