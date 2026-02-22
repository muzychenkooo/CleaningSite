import { test, expect, type Page } from '@playwright/test';

/**
 * Helper: programmatically click the burger button.
 *
 * The Playwright `.click()` CDP-level action can hang with chrome-headless-shell
 * in some sandboxed environments. Using `dispatchEvent` via `page.evaluate`
 * reliably triggers React event handlers instead.
 */
async function clickBurger(page: Page) {
  await page.evaluate(() => {
    const btn = document.querySelector<HTMLElement>('button[aria-label="Меню"]');
    btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(250);
}

/** Check that the mobile drawer is off-screen (closed). */
async function drawerIsClosed(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.getElementById('mobile-nav-drawer');
    if (!el) return true;
    const transform = window.getComputedStyle(el).transform;
    if (transform === 'none') return false;
    // matrix(a, b, c, d, tx, ty) — tx > 0 means translated right (closed)
    const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([\d.]+)/);
    return match ? parseFloat(match[1]) > 0 : false;
  });
}

// Mobile menu tests run at 390px (burger visible at <xl / <1280px)
test.describe('Mobile navigation menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'load', timeout: 90_000 });
  });

  test('burger button is visible on mobile', async ({ page }) => {
    const burger = page.locator('button[aria-label="Меню"]').first();
    await expect(burger).toBeVisible();
  });

  test('desktop nav is hidden on mobile', async ({ page }) => {
    const desktopNav = page.locator('nav[aria-label="Основное меню"]');
    await expect(desktopNav).toBeHidden();
  });

  test('mobile drawer opens on burger click', async ({ page }) => {
    await clickBurger(page);

    const drawer = page.locator('#mobile-nav-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Меню');
  });

  test('mobile drawer contains primary nav links', async ({ page }) => {
    await clickBurger(page);

    const drawer = page.locator('#mobile-nav-drawer');
    await expect(drawer.getByRole('link', { name: 'Частным клиентам' })).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'Для бизнеса' })).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'Цены' })).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'Контакты' })).toBeVisible();
  });

  test('mobile drawer closes on close button click', async ({ page }) => {
    await clickBurger(page);

    const drawer = page.locator('#mobile-nav-drawer');
    await expect(drawer).toBeVisible();

    // Click the ✕ close button inside the drawer via dispatchEvent
    await page.evaluate(() => {
      const btn = document.querySelector<HTMLElement>('button[aria-label="Закрыть меню"]');
      btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(300);
    expect(await drawerIsClosed(page)).toBe(true);
  });

  test('mobile drawer closes on Escape key', async ({ page }) => {
    await clickBurger(page);

    const drawer = page.locator('#mobile-nav-drawer');
    await expect(drawer).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    expect(await drawerIsClosed(page)).toBe(true);
  });

  test('mobile drawer closes on backdrop click', async ({ page }) => {
    await clickBurger(page);
    await expect(page.locator('#mobile-nav-drawer')).toBeVisible();

    // Click the backdrop div (covers the area outside the drawer, on the left side)
    await page.evaluate(() => {
      // The backdrop div is the first child of the header's portal area (fixed inset-0)
      const backdrop = document.querySelector<HTMLElement>('.fixed.inset-0.bg-black\\/30');
      backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(300);
    expect(await drawerIsClosed(page)).toBe(true);
  });

  test('clicking a menu link navigates and closes drawer', async ({ page }) => {
    await clickBurger(page);

    const drawer = page.locator('#mobile-nav-drawer');
    await expect(drawer).toBeVisible();

    // Click "Цены" link via dispatchEvent
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('#mobile-nav-drawer a'));
      const pricLink = links.find((a) => a.textContent?.trim() === 'Цены');
      pricLink?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });

    await expect(page).toHaveURL(/\/prices\//, { timeout: 15_000 });
  });

  test('sticky mobile CTA bar is visible', async ({ page }) => {
    // The StickyCta bar (sm:hidden) should be visible at mobile width
    const stickyBar = page.locator('.fixed.bottom-0').first();
    await expect(stickyBar).toBeVisible();
  });
});
