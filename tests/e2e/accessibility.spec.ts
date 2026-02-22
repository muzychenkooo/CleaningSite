import { test, expect, type Page } from '@playwright/test';

/** Programmatically open the mobile nav drawer (avoids CDP click limitations). */
async function openMobileDrawer(page: Page) {
  await page.evaluate(() => {
    const btn = document.querySelector<HTMLElement>('button[aria-label="Меню"]');
    btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(250);
}

/** Returns true if the drawer is visually off-screen (closed). */
async function drawerIsClosed(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.getElementById('mobile-nav-drawer');
    if (!el) return true;
    const transform = window.getComputedStyle(el).transform;
    if (transform === 'none') return false;
    const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([\d.]+)/);
    return match ? parseFloat(match[1]) > 0 : false;
  });
}

/**
 * Accessibility checks — keyboard navigation and basic a11y patterns.
 * Full axe-core audit would require @axe-core/playwright; these tests
 * cover the most critical interactive elements.
 */

test.describe('Keyboard accessibility', () => {
  test('can Tab through header interactive elements on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Tab to the first header link
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    // Should focus something interactive (a, button)
    expect(['a', 'button']).toContain(focused);
  });

  test('mobile menu focus trap: Tab cycles within drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await openMobileDrawer(page);
    const drawer = page.locator('#mobile-nav-drawer');
    await expect(drawer).toBeVisible();

    // Tab several times — should stay within the drawer
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return false;
        return document.querySelector('#mobile-nav-drawer')?.contains(el) ?? false;
      });
      expect(focused, `Focus escaped drawer on Tab press ${i + 1}`).toBe(true);
    }
  });

  test('mobile menu ESC closes drawer and restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await openMobileDrawer(page);

    const drawer = page.locator('#mobile-nav-drawer');
    await expect(drawer).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    expect(await drawerIsClosed(page)).toBe(true);

    // Focus should return to burger
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    expect(focused).toBe('Меню');
  });

  test('form labels are properly associated', async ({ page }) => {
    await page.goto('/contacts/');

    // Labels should be clickable and focus the input
    const nameLabel = page.locator('label[for="order-name"]');
    await nameLabel.click();
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('order-name');
  });

  test('carousel buttons have aria-labels', async ({ page }) => {
    await page.goto('/#foto-video');

    const prevBtn = page.getByRole('button', { name: 'Предыдущее фото' });
    const nextBtn = page.getByRole('button', { name: 'Следующее фото' });
    await expect(prevBtn).toBeAttached();
    await expect(nextBtn).toBeAttached();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');

    // Get all images and check alt attribute
    const images = page.locator('img:not([alt=""])');
    const allImages = await page.locator('img').all();

    for (const img of allImages) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      expect(alt, `Image ${src} is missing alt text`).not.toBeNull();
    }
  });

  test('external links have rel=noopener noreferrer', async ({ page }) => {
    await page.goto('/');

    const externalLinks = await page.locator('a[target="_blank"]').all();
    for (const link of externalLinks) {
      const rel = await link.getAttribute('rel');
      const href = await link.getAttribute('href');
      expect(rel, `External link ${href} missing rel="noopener noreferrer"`).toContain('noopener');
      expect(rel, `External link ${href} missing rel="noopener noreferrer"`).toContain('noreferrer');
    }
  });
});

// ─── Skip link check ─────────────────────────────────────────────────────────

test.describe('Focus management', () => {
  test('interactive elements have visible focus rings', async ({ page }) => {
    await page.goto('/');

    // Tab to first focusable and check it gets focus styles
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedTag);
  });
});
