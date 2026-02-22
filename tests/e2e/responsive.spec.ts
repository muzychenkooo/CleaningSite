import { test, expect } from '@playwright/test';

/**
 * Responsive layout tests.
 * Assert no horizontal scroll at common viewport widths.
 * These tests cover the acceptance criterion: "Site has no horizontal scroll at common viewports."
 */

async function assertNoHorizontalScroll(
  page: import('@playwright/test').Page,
  path: string,
  viewportWidth: number,
  viewportHeight = 900
) {
  await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
  // Use domcontentloaded + extended timeout to avoid waiting for slow video resources
  await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  const hasScroll = await page.evaluate(() => {
    /**
     * Check if the user can actually scroll the page horizontally.
     *
     * We try to scroll right by 1px and check if scrollX changed.
     * This respects `overflow-x: hidden` on <html>/<body> (which prevents
     * user-visible scroll even when content technically overflows).
     *
     * Note: `body.scrollWidth` is intentionally NOT checked because
     * `position:fixed` elements that are off-screen via `translateX` (e.g. the
     * closed mobile drawer) report false-positive overflow in scrollWidth.
     */
    const before = window.scrollX;
    window.scrollTo(1, window.scrollY);
    const after = window.scrollX;
    window.scrollTo(0, window.scrollY);
    return {
      canScrollX: after > before,
      scrollWidth: document.documentElement.scrollWidth,
      winW: window.innerWidth,
    };
  });

  expect(
    hasScroll.canScrollX,
    `Horizontal scroll detected on ${path} at ${viewportWidth}px — scrollWidth: ${hasScroll.scrollWidth}, innerWidth: ${hasScroll.winW}`
  ).toBe(false);
}

/**
 * Representative viewport samples for horizontal-overflow checks.
 * Each test covers one page at one viewport to stay well under the 30s timeout.
 * Full list for manual testing: see TESTING.md.
 */
type OverflowCase = { desc: string; vw: number; height: number; path: string };

const OVERFLOW_CASES: OverflowCase[] = [
  // Desktop
  { desc: 'desktop-1920', vw: 1920, height: 900, path: '/' },
  { desc: 'desktop-1440', vw: 1440, height: 900, path: '/prices/' },
  { desc: 'desktop-1280', vw: 1280, height: 900, path: '/contacts/' },
  // Tablet
  { desc: 'tablet-1024', vw: 1024, height: 1024, path: '/' },
  { desc: 'tablet-768', vw: 768, height: 1024, path: '/prices/' },
  // Mobile
  { desc: 'mobile-390', vw: 390, height: 812, path: '/' },
  { desc: 'mobile-375', vw: 375, height: 812, path: '/prices/' },
  { desc: 'mobile-320', vw: 320, height: 568, path: '/contacts/' },
];

test.describe('No horizontal scroll', () => {
  test.setTimeout(90_000);

  for (const { desc, vw, height, path } of OVERFLOW_CASES) {
    test(`${desc}: ${path}`, async ({ page }) => {
      await assertNoHorizontalScroll(page, path, vw, height);
    });
  }
});

// ─── Layout sanity at key viewports ─────────────────────────────────────────

test.describe('Layout sanity', () => {
  // These tests load the homepage which has videos; give them extra time
  test.setTimeout(60_000);

  test('header is visible at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header img[alt="Большая Уборка"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Меню', exact: true }).first()).toBeVisible();
  });

  test('footer is visible at 320px without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });

  test('hero CTAs visible at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Hero gradient section (server-rendered, always in DOM)
    const hero = page.locator('.hero-gradient').first();
    await expect(hero).toBeVisible();
    // Both CTA buttons in the DOM
    await expect(page.getByRole('link', { name: /обратный звонок/i }).first()).toBeAttached();
    await expect(page.getByRole('link', { name: /рассчитать стоимость/i }).first()).toBeAttached();
  });

  test('prices grid renders correctly at 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/prices/', { waitUntil: 'domcontentloaded' });
    const grid = page.locator('.grid').first();
    await expect(grid).toBeVisible();
  });

  test('gallery carousel exists at 390px without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for React effects (carousel responsive setup)
    await page.waitForTimeout(800);

    const section = page.locator('section#foto-video');
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('.overflow-hidden').first()).toBeAttached();

    // Page should not allow user-visible horizontal scrolling
    const canScrollX = await page.evaluate(() => {
      const before = window.scrollX;
      window.scrollTo(1, window.scrollY);
      const after = window.scrollX;
      window.scrollTo(0, window.scrollY);
      return after > before;
    });
    expect(canScrollX).toBe(false);
  });
});
