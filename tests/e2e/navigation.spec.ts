import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Attach a console error collector to a page. Returns getter for errors seen. */
function attachConsoleCollector(page: Page) {
  const errors: ConsoleMessage[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg);
  });
  return () => errors;
}

/** Assert no horizontal overflow. Returns true if page can scroll horizontally. */
async function hasHorizontalScroll(page: Page): Promise<boolean> {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
}

// ─── Navigation smoke tests ────────────────────────────────────────────────

test.describe('Navigation smoke', () => {
  const pages = [
    { label: 'Home', path: '/' },
    { label: 'Private services', path: '/private/' },
    { label: 'Business services', path: '/business/' },
    { label: 'Prices', path: '/prices/' },
    { label: 'Cases', path: '/cases/' },
    { label: 'Reviews', path: '/reviews/' },
    { label: 'About', path: '/about/' },
    { label: 'Vacancies', path: '/vacancies/' },
    { label: 'Contacts', path: '/contacts/' },
    { label: 'Quiz', path: '/quiz/' },
  ];

  for (const { label, path } of pages) {
    test(`${label} page loads without error (${path})`, async ({ page }) => {
      const getErrors = attachConsoleCollector(page);

      const response = await page.goto(path);

      // Page should return 200 (or null for client-side nav)
      if (response) {
        expect(response.status(), `${path} returned non-200`).toBeLessThan(400);
      }

      // Should have a <main> element
      await expect(page.locator('main')).toBeAttached();

      // No severe JS errors
      const errors = getErrors();
      const severeErrors = errors.filter((e) => !e.text().includes('Warning:'));
      expect(severeErrors, `Console errors on ${path}: ${severeErrors.map((e) => e.text()).join(', ')}`).toHaveLength(0);
    });
  }

  test('404 page shows not-found content', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-xyz/');
    // Static export returns 404 page HTML
    const body = await page.textContent('body');
    expect(body).toMatch(/404|не найдено|not found/i);
  });
});

// ─── Header links ───────────────────────────────────────────────────────────

test.describe('Header links (desktop)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('desktop nav contains key links', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav[aria-label="Основное меню"]');
    await expect(nav).toBeVisible();

    // Main nav items
    await expect(nav.getByRole('link', { name: 'Цены' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Отзывы' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Контакты' })).toBeVisible();
  });

  test('header CTA buttons visible on desktop', async ({ page }) => {
    await page.goto('/');
    // At xl (1440px), the desktop CTA buttons (hidden xl:flex) should be visible
    const ctas = page.locator('header').getByRole('link', { name: /рассчитать|обратный/i });
    await expect(ctas.first()).toBeVisible();
  });
});
