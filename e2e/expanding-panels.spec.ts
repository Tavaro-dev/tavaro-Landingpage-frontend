import { test, expect } from "@playwright/test";

test("Expanding panels scroll sequence", async ({ page }) => {
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  await page.goto("http://localhost:3000/resorts/things-to-do/explore");
  await page.waitForTimeout(2000);

  const overflowInfo = await page.evaluate(() => {
    return {
      innerWidth: window.innerWidth,
      bodyOverflow: getComputedStyle(document.body).overflow,
      htmlOverflow: getComputedStyle(document.documentElement).overflow,
      scrollingElement: document.scrollingElement?.tagName,
      windowScrollY: window.scrollY,
    };
  });
  console.log("Overflow Info:", overflowInfo);

  const trackInfo = await page.evaluate(() => {
    const track = document.getElementById("expanding-showcase-track");
    if (!track) return null;
    const rect = track.getBoundingClientRect();
    const scrollTop = window.scrollY;
    return {
      top: rect.top + scrollTop,
      height: track.offsetHeight,
      viewportH: window.innerHeight,
    };
  });
  console.log("Track Info:", trackInfo);

  if (!trackInfo) throw new Error("Track not found");

  const headerH = 72;
  const trackStart = trackInfo.top - headerH;
  const scrollDistance = trackInfo.height - (trackInfo.viewportH - headerH);
  console.log("trackStart:", trackStart, "scrollDistance:", scrollDistance);

  // Test stage 0 (Dine)
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.1 * scrollDistance);
  await page.waitForTimeout(500);
  let activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  console.log("At 10% progress:", activeText);
  expect(activeText).toBe("Dine");

  // Test stage 1 (Unwind)
  await page.evaluate((y) => {
    window.scrollTo({ top: y, behavior: "instant" });
    window.dispatchEvent(new Event("scroll"));
  }, trackStart + 0.35 * scrollDistance);
  await page.waitForTimeout(600);
  const actualY = await page.evaluate(() => window.scrollY);
  console.log("actual scrollY at 35%:", actualY);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  console.log("At 35% progress:", activeText);
  expect(activeText).toBe("Unwind");

  // Test stage 2 (Play)
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.6 * scrollDistance);
  await page.waitForTimeout(500);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  console.log("At 60% progress:", activeText);
  expect(activeText).toBe("Play");

  // Test stage 3 (Explore)
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.85 * scrollDistance);
  await page.waitForTimeout(500);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  console.log("At 85% progress:", activeText);
  expect(activeText).toBe("Explore");

  // Test manual selection via click
  await page.click(".showcase-tab-btn:has-text('Dine')");
  await page.waitForTimeout(800);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  console.log("After clicking Dine tab:", activeText);
  expect(activeText).toBe("Dine");
});

test("Create Experience scroll sequence", async ({ page }) => {
  await page.goto("http://localhost:3000/resorts/things-to-do/create");
  await page.waitForTimeout(2000);

  const trackInfo = await page.evaluate(() => {
    const track = document.getElementById("expanding-showcase-track");
    if (!track) return null;
    const rect = track.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      height: track.offsetHeight,
      viewportH: window.innerHeight,
    };
  });
  if (!trackInfo) throw new Error("Track not found on create page");

  const headerH = 72;
  const trackStart = trackInfo.top - headerH;
  const scrollDistance = trackInfo.height - (trackInfo.viewportH - headerH);

  // Stage 0: Wellness
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.1 * scrollDistance);
  await page.waitForTimeout(500);
  let activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  expect(activeText).toBe("Wellness");

  // Stage 1: Movement
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.35 * scrollDistance);
  await page.waitForTimeout(500);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  expect(activeText).toBe("Movement");

  // Stage 2: Create
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.6 * scrollDistance);
  await page.waitForTimeout(500);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  expect(activeText).toBe("Create");

  // Stage 3: Gather
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.85 * scrollDistance);
  await page.waitForTimeout(500);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  expect(activeText).toBe("Gather");

  // Click enquiry button in active panel
  const enquireBtn = page.locator(".showcase-panel.active .showcase-enquire-btn");
  await enquireBtn.click();
  await page.waitForTimeout(600);
  const modalHeader = page.locator(".exp-modal-title");
  await expect(modalHeader).toBeVisible();
});

test("Mobile scroll-driven expanding panels sequence", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/resorts/things-to-do/explore");
  await page.waitForTimeout(2000);

  const trackInfo = await page.evaluate(() => {
    const track = document.getElementById("expanding-showcase-track");
    if (!track) return null;
    const rect = track.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      height: track.offsetHeight,
      viewportH: window.innerHeight,
    };
  });
  if (!trackInfo) throw new Error("Track not found on mobile");

  const headerH = 72;
  const trackStart = trackInfo.top - headerH;
  const scrollDistance = trackInfo.height - (trackInfo.viewportH - headerH);

  // Test stage 0 (Dine)
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.1 * scrollDistance);
  await page.waitForTimeout(500);
  let activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  expect(activeText).toBe("Dine");

  // Test stage 1 (Unwind)
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.35 * scrollDistance);
  await page.waitForTimeout(500);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  expect(activeText).toBe("Unwind");

  // Test stage 2 (Play)
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.6 * scrollDistance);
  await page.waitForTimeout(500);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  expect(activeText).toBe("Play");

  // Test stage 3 (Explore)
  await page.evaluate((y) => window.scrollTo(0, y), trackStart + 0.85 * scrollDistance);
  await page.waitForTimeout(500);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  expect(activeText).toBe("Explore");

  // Test tap on Dine tab in top controls
  await page.click(".showcase-tab-btn:has-text('Dine')");
  await page.waitForTimeout(800);
  activeText = await page.locator(".showcase-panel.active .showcase-card-title").innerText();
  expect(activeText).toBe("Dine");
});

