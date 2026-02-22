import { test, expect, type Page } from '@playwright/test';

/**
 * Click a Playwright Locator via DOM dispatchEvent.
 *
 * Playwright's `.click()` uses CDP-level mouse simulation which can hang on
 * chrome-headless-shell, especially with touch emulation (isMobile: true).
 * `dispatchEvent` bypasses CDP and fires directly into the React event system.
 */
async function clickEl(locator: ReturnType<Page['locator']> | ReturnType<Page['getByRole']>) {
  await locator.dispatchEvent('click');
}

// ─── Hero section ───────────────────────────────────────────────────────────

test.describe('Hero section', () => {
  test('hero renders with headline and CTA buttons', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('section.hero-gradient');
    await expect(hero).toBeVisible();
    await expect(hero.getByRole('heading', { name: /большая уборка/i })).toBeVisible();
    await expect(hero.getByRole('link', { name: /обратный звонок/i })).toBeVisible();
    await expect(hero.getByRole('link', { name: /рассчитать стоимость/i })).toBeVisible();
  });
});

// ─── Gallery carousel ───────────────────────────────────────────────────────

test.describe('Gallery photo carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#foto-video');
  });

  test('carousel renders photos', async ({ page }) => {
    const carouselViewport = page.locator('section#foto-video .overflow-hidden').first();
    await expect(carouselViewport).toBeVisible();
    const images = carouselViewport.locator('img');
    await expect(images.first()).toBeAttached();
  });

  test('next arrow advances the carousel', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: 'Следующее фото' });
    await expect(nextBtn).toBeVisible();

    const track = page.locator('section#foto-video .overflow-hidden > div').first();
    const beforeTransform = await track.evaluate((el) => (el as HTMLElement).style.transform);

    await clickEl(nextBtn);
    await page.waitForTimeout(500);

    const afterTransform = await track.evaluate((el) => (el as HTMLElement).style.transform);
    expect(afterTransform).not.toBe(beforeTransform);
  });

  test('prev arrow works after advancing', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: 'Следующее фото' });
    const prevBtn = page.getByRole('button', { name: 'Предыдущее фото' });

    await clickEl(nextBtn);
    await page.waitForTimeout(1000); // wait for 420ms transition + loop-snap margin

    await clickEl(prevBtn);
    await page.waitForTimeout(1000);

    const dot = page.locator('section#foto-video [aria-label="Фото 1"]');
    await expect(dot).toHaveAttribute('aria-current', 'true', { timeout: 5_000 });
  });

  test('dot navigation works', async ({ page }) => {
    const dot2 = page.getByRole('button', { name: 'Фото 3' });
    await clickEl(dot2);
    await page.waitForTimeout(500);
    await expect(dot2).toHaveAttribute('aria-current', 'true');
  });
});

// ─── Videos ─────────────────────────────────────────────────────────────────

test.describe('Video overlays', () => {
  test('about section video overlay renders', async ({ page }) => {
    await page.goto('/#o-nas');
    const playBtn = page.locator('button[aria-label="Запустить видео"]').first();
    await expect(playBtn).toBeVisible();
  });

  test('clicking video overlay starts video', async ({ page }) => {
    await page.goto('/#o-nas');
    // Use CSS selector (not getByRole) so the locator still resolves after
    // aria-hidden="true" is applied (which hides it from ARIA tree).
    const playBtn = page.locator('button[aria-label="Запустить видео"]').first();
    await expect(playBtn).toBeVisible();
    await clickEl(playBtn);
    await expect(playBtn).toHaveAttribute('aria-hidden', 'true', { timeout: 5_000 });
  });

  test('video reviews section renders', async ({ page }) => {
    await page.goto('/#video-otzyvy');
    const videoSection = page.locator('section#video-otzyvy');
    await expect(videoSection).toBeVisible();
    const videos = videoSection.locator('video');
    await expect(videos.first()).toBeAttached();
  });
});

// ─── Reviews carousel ───────────────────────────────────────────────────────

test.describe('Reviews carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reviews/');
  });

  test('reviews section renders cards', async ({ page }) => {
    const carousel = page.locator('[aria-label="Слайдер с отзывами"]');
    await expect(carousel).toBeVisible();
    const cards = carousel.locator('article');
    await expect(cards.first()).toBeVisible();
  });

  test('next button advances reviews', async ({ page }) => {
    const nextBtn = page.locator('button[aria-label="Следующие отзывы"]');
    const count = await nextBtn.count();
    if (count === 0) {
      test.skip(true, 'Only one page of reviews');
      return;
    }

    // Hydration guard: on mobile/tablet the responsive useEffect changes cardsPerView
    // from the SSR value (3) to 1 or 2, updating totalPages.  We wait for the dot count
    // to match the expected viewport-specific value — this confirms React has fully
    // hydrated AND all effects (cardsPerView + setCurrentPage reset) have settled.
    const viewportWidth = page.viewportSize()?.width ?? 1440;
    const expectedCardsPerView = viewportWidth >= 1024 ? 3 : viewportWidth >= 640 ? 2 : 1;
    const reviewCount = 10; // from data/reviews.ts
    const expectedTotalPages = Math.ceil(reviewCount / expectedCardsPerView);

    if (expectedTotalPages > 1) {
      await page.waitForFunction(
        (expected) => {
          const dots = document.querySelectorAll(
            '[role="group"][aria-label="Страницы отзывов"] button'
          );
          return dots.length === expected;
        },
        expectedTotalPages,
        { timeout: 15_000 }
      );
    }

    const prevBtn = page.locator('button[aria-label="Предыдущие отзывы"]');
    await expect(prevBtn).toBeDisabled({ timeout: 5_000 });

    await page.evaluate(() => {
      const btn = document.querySelector<HTMLElement>('button[aria-label="Следующие отзывы"]');
      btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });

    await expect(prevBtn).toBeEnabled({ timeout: 8_000 });
  });

  test('platform filter pills work', async ({ page }) => {
    const allPill = page.getByRole('button', { name: /все отзывы/i });
    await expect(allPill).toBeVisible();

    const yandexPill = page.getByRole('button', { name: /яндекс/i });
    const yandexCount = await yandexPill.count();
    if (yandexCount > 0) {
      await clickEl(yandexPill);
      const countLine = page.locator('p').filter({ hasText: /отзыв/i }).first();
      await expect(countLine).toBeVisible();
    }
  });
});

// ─── Quiz wizard ─────────────────────────────────────────────────────────────

/**
 * The quiz lives on the home page, revealed when ?open=quiz is in the URL.
 * /quiz/ redirects there — navigate directly to avoid the redirect round-trip.
 */
test.describe('Quiz wizard', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    // Use 'domcontentloaded'; visibility assertions below carry their own timeouts
    // so there's no need to wait for full 'load' (which can be slow with images/video).
    await page.goto('/?open=quiz#rasschet', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  });

  test('quiz page renders first step', async ({ page }) => {
    // Allow extra time on cold dev-server start (Suspense + useSearchParams hydration)
    await expect(page.getByText(/тип уборки/i)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/шаг 1/i)).toBeVisible({ timeout: 10_000 });
  });

  test('selecting a service type advances to step 2', async ({ page }) => {
    await expect(page.getByText(/шаг 1/i)).toBeVisible({ timeout: 15_000 });

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
        (b) => /квартира/i.test(b.textContent ?? '')
      );
      btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(200);
    await expect(page.getByText(/шаг 2/i)).toBeVisible({ timeout: 10_000 });
  });

  test('back button returns to previous step', async ({ page }) => {
    await expect(page.getByText(/шаг 1/i)).toBeVisible({ timeout: 15_000 });

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
        (b) => /квартира/i.test(b.textContent ?? '')
      );
      btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(200);
    await expect(page.getByText(/шаг 2/i)).toBeVisible({ timeout: 10_000 });

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
        (b) => /назад/i.test(b.textContent ?? '')
      );
      btn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(200);
    await expect(page.getByText(/шаг 1/i)).toBeVisible({ timeout: 10_000 });
  });
});

// ─── Order form ──────────────────────────────────────────────────────────────

test.describe('Order form', () => {
  test('contact form on contacts page validates required fields', async ({ page }) => {
    await page.goto('/contacts/');

    await clickEl(page.getByRole('button', { name: /отправить заявку/i }));

    const errors = page.locator('[role="alert"]');
    await expect(errors.first()).toBeVisible();
  });

  test('contact form accepts valid input', async ({ page }) => {
    test.setTimeout(30_000);
    await page.goto('/contacts/');

    await page.fill('#order-name', 'Тест');
    await page.fill('#order-phone', '+7 999 123 45 67');

    // The form has a 3-second anti-spam guard (MIN_SUBMIT_SECONDS = 3).
    await page.waitForTimeout(3500);

    await clickEl(page.getByRole('button', { name: /отправить заявку/i }));
    const success = page.getByRole('dialog', { name: /заявка принята/i });
    await expect(success).toBeVisible({ timeout: 5_000 });
  });
});
