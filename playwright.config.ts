import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration.
 *
 * Run against the Next.js dev server (npm run dev).
 * Usage:
 *   npm run test:e2e          → headless, all browsers defined below
 *   npm run test:e2e:ui       → Playwright UI mode
 *   npm run test:e2e:report   → Show last HTML report
 */

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
  timeout: 30_000,

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3030',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Capture console errors for hygiene tests
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      // Mobile emulation using Chromium (not WebKit) for local runs without Safari.
      // Uses iPhone 14 viewport + UA, but runs on Chromium engine.
      name: 'chromium-mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 820, height: 1180 },
        isMobile: false,
      },
    },
  ],

  webServer: {
    command: 'npm run dev -- -p 3030',
    url: process.env.BASE_URL ?? 'http://localhost:3030',
    // Always reuse an already-running server so local dev works seamlessly.
    // In CI, set CI=true to start a fresh server instead.
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
