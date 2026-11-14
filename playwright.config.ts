import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  timeout: 60000,
  // Fonts and anti-aliasing differ per OS, so each platform keeps its own
  // baselines. Only linux/ is committed (CI compares against it); see e2e/visual/README.md.
  snapshotPathTemplate: '{testDir}/visual/__screenshots__/{platform}/{arg}{ext}',
  use: {
    // Own port, so a running `npm run dev` on :3000 is never tested by mistake.
    baseURL: 'http://localhost:3123',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      testIgnore: /visual\//,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testMatch: /visual\/.*\.spec\.ts/,
      retries: 0,
      // Reduced motion: the home hero shows its poster, not a video frame at a random time.
      use: { ...devices['Desktop Chrome'], contextOptions: { reducedMotion: 'reduce' } },
    },
  ],

  webServer: {
    command: 'npm run start -- -p 3123',
    url: 'http://localhost:3123',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
