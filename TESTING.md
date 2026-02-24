# Testing Guide — Большая Уборка

A comprehensive manual + automated testing checklist for the site.

---

## Quick start

```bash
# Install dependencies
npm install

# Run unit tests (pricing calculator)
npm test

# Run E2E tests (requires dev server on :3000)
npm run test:e2e

# Open interactive Playwright UI
npm run test:e2e:ui

# Show last E2E HTML report
npm run test:e2e:report
```

---

## Automated E2E tests (Playwright)

Located in `tests/e2e/`. Four test suites:

| File | What it tests |
|---|---|
| `navigation.spec.ts` | All pages load (200), no console errors |
| `mobile-menu.spec.ts` | Mobile drawer open/close/navigation |
| `critical-ui.spec.ts` | Hero, carousels, videos, quiz, order form |
| `responsive.spec.ts` | No horizontal scroll at 17 viewports (desktop/tablet/mobile) |
| `accessibility.spec.ts` | Keyboard navigation, focus trap, aria-labels, alt text, rel |

### Run against local dev server

```bash
# Terminal 1: start dev server
npm run dev

# Terminal 2: run tests
npm run test:e2e
```

### Run in CI

```bash
CI=true npm run test:e2e
```

The config (`playwright.config.ts`) auto-starts `npm run dev` if no server is already running.

---

## Responsive visual checks (manual)

Use Chrome DevTools Device Toolbar (F12 → Toggle Device Toolbar) or a real device.

### Viewport coverage

| Category | Widths |
|---|---|
| Desktop | 1920, 1440, 1366, 1280 |
| Tablet | 1024, 820, 768 |
| Mobile | 430, 414, 390, 375, 360, 320 |

### Checklist (repeat at each viewport)

- [ ] No horizontal scrollbar (check `document.documentElement.scrollWidth > window.innerWidth`)
- [ ] Header is fully visible; logo not clipped
- [ ] Navigation readable (desktop nav at ≥1280px; burger at <1280px)
- [ ] Hero section: heading, subtitle, and both CTA buttons visible and not overlapping
- [ ] Services section: card grid wraps correctly (4col → 2col → 1col)
- [ ] Quiz section: quiz card not clipped; "Далее" button visible on mobile
- [ ] Reviews carousel: correct cards-per-view (3 at lg+, 2 at sm–lg, 1 at <sm)
- [ ] Gallery carousel: 2 photos per view at ≥640px, **1 photo per view at <640px**
- [ ] Video sections: `aspect-video` maintains ratio; no cropping
- [ ] Footer: all 4 columns stack cleanly at mobile
- [ ] Sticky mobile CTA bar: visible and above fold at <640px
- [ ] Form fields: full-width at mobile; no overflow

---

## Cross-browser checklist

### Chrome (Desktop)
- [ ] All sections render
- [ ] Carousels animate smoothly
- [ ] Videos play on overlay click
- [ ] Forms validate and submit (success dialog appears)
- [ ] `backdrop-filter` header blur works

### Firefox (Desktop)
- [ ] All sections render
- [ ] Carousels animate (check `translateX` transitions)
- [ ] `backdrop-filter` may not apply (graceful fallback: `bg-white/95`)
- [ ] Accordion/FAQ animation works

### Safari (Desktop + macOS)
- [ ] Fonts load correctly (Manrope, Inter via Next.js font system)
- [ ] Video overlays play
- [ ] `aspect-video` ratio maintained on Safari
- [ ] `env(safe-area-inset-bottom)` in sticky CTA bar doesn't break layout

---

## Real-device approximations

### iPhone (Safari) — simulate at 390×844 px, UA: iPhone

1. Open in Safari iOS (or DevTools → iPhone 14 emulation)
2. **Navigation:**
   - [ ] Burger menu visible; desktop nav hidden
   - [ ] Drawer opens full-height (`100dvh`)
   - [ ] Drawer slides from right; backdrop dims background
   - [ ] ESC on external keyboard closes drawer
   - [ ] Tap outside drawer closes it
3. **Scroll:**
   - [ ] No horizontal scroll on any page
   - [ ] Momentum scrolling works inside drawer
   - [ ] Body scroll locks while drawer is open
4. **Sticky CTA bar:**
   - [ ] Bar visible at bottom, above iOS home indicator
   - [ ] `pb-[max(0.75rem,env(safe-area-inset-bottom))]` provides iPhone notch clearance
   - [ ] Both buttons ("Заказать уборку" / "Рассчитать цену") have ≥44px touch targets
5. **Forms:**
   - [ ] Inputs don't cause zoom on focus (font-size ≥ 16px)
   - [ ] `type="tel"` brings up numeric keypad
   - [ ] `type="date"` / `type="time"` use native iOS pickers
6. **Media:**
   - [ ] Videos: `playsInline` attribute prevents fullscreen takeover on iOS
   - [ ] Gallery images load and fit within viewport

### Android (Chrome) — simulate at 390×844 px

1. Open in Chrome Android (or DevTools → Pixel 5 emulation)
2. **Navigation:**
   - [ ] Same drawer checks as iPhone above
3. **Bottom navigation bar:**
   - [ ] Sticky CTA bar clears Android navigation bar
4. **Touch targets:**
   - [ ] All primary buttons ≥ 44×44 px
   - [ ] Carousel arrows ≥ 44×44 px touch area
5. **Videos:**
   - [ ] `preload="metadata"` — only metadata loaded on page load (saves bandwidth)
   - [ ] `.mov` video (Ольга's review) — Chrome Android may not play `.mov` natively; verify or convert to `.mp4`

---

## Interaction checks

### CTAs
- [ ] Hero "Обратный звонок" → scrolls to `#zayavka` form
- [ ] Hero "Рассчитать стоимость" → navigates to `/quiz/`
- [ ] Header "Рассчитать цену" → navigates to `/quiz/` (desktop)
- [ ] Sticky CTA "Заказать уборку" → scrolls to `#zayavka`
- [ ] Sticky CTA "Рассчитать цену" → navigates to quiz (mobile)

### Modals / dialogs
- [ ] Order form success dialog:
  - [ ] Opens after valid form submission (~1s)
  - [ ] Closes on `×` button click
  - [ ] Closes on backdrop click
  - [ ] ESC key closes it
- [ ] Cases lightbox:
  - [ ] Opens on case card click
  - [ ] Closes on `✕` button
  - [ ] Closes on backdrop click
  - [ ] Closes on ESC key

### Forms
- [ ] Order form: name + phone are required; blank submission shows errors
- [ ] Order form: phone field uses `type="tel"` 
- [ ] Order form: honeypot field is hidden (not visible, not announced to screen readers)
- [ ] Order form: submitting too fast (<3s) is silently blocked
- [ ] Quiz contacts step: name + phone + consent required
- [ ] Quiz: local state persists if you navigate away and return (localStorage)

### Form validation (unified system)

Run at `/` (OrderForm full), `/contacts/` (OrderForm compact), and `/quiz/` (contacts step):

1. **Required fields**
   - [ ] Leave Имя empty → blocks submit, shows "Введите свое имя", red border
   - [ ] Leave Телефон as "+7" only → blocks submit, shows "Заполните поле Телефон", red border

2. **Имя (Cyrillic only)**
   - [ ] Type Latin letters (e.g. "John") → rejected/sanitized (only Cyrillic allowed)
   - [ ] Type >30 chars → truncated or blocked
   - [ ] Valid "Иван Петров" → passes

3. **Phone mask**
   - [ ] Phone shows +7 prefix (not removable)
   - [ ] Type only digits after +7; no other symbols
   - [ ] Partial phone (e.g. "+7 (999)") → blocks with "Введите корректный номер телефона"
   - [ ] Full "+7 (999) 123-45-67" → passes

4. **Address autocomplete (OrderForm full only)**
   - [ ] Type "М" → suggestions appear (Москва, Мытищи, …)
   - [ ] Select city → comma + space inserted
   - [ ] Type street prefix "Л" → street suggestions for that city
   - [ ] Select street → comma inserted
   - [ ] Enter house number
   - [ ] Invalid combination (e.g. city+street but no house) → "Такого адреса не существует"
   - [ ] Empty address → no error (optional field)

5. **Date / time (OrderForm full only)**
   - [ ] Date: invalid year <2026 or >2100 → rejected/flagged
   - [ ] Native date picker works; min="2026-01-01" max="2100-12-31"
   - [ ] Time: native time picker; valid 00–23 : 00–59

6. **Required asterisk**
   - [ ] Имя * and Телефон * show asterisk on all forms (OrderForm + Quiz contacts)

### External links
- [ ] All `target="_blank"` links open in new tab
- [ ] All `target="_blank"` links have `rel="noopener noreferrer"`
- [ ] WhatsApp link opens `wa.me/…` correctly
- [ ] Yandex/Google review links open correct platform pages

---

## Performance checks (best-effort)

Run Lighthouse in Chrome DevTools (Incognito mode, throttled 4G):

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID/INP | < 200ms |
| Performance score | ≥ 85 |

Key checks:
- [ ] Hero section has no LCP image (text + gradient = good)
- [ ] Non-critical images have `loading="lazy"`
- [ ] Videos use `preload="metadata"` (not `preload="auto"`)
- [ ] Google Fonts loaded via `next/font` with `display: swap` (avoids FOIT)
- [ ] No render-blocking scripts

---

## Security hygiene

- [ ] All `target="_blank"` links have `rel="noopener noreferrer"` ✓
- [ ] Forms include honeypot field + time-based guard ✓
- [ ] Referrer-Policy meta tag present (`strict-origin-when-cross-origin`) ✓
- [ ] No inline secrets or API keys in source code ✓
- [ ] `npm audit --omit=dev` shows 0 high/critical in runtime deps
  - **Note:** The only flagged runtime issue is in `next` itself (DoS via Image Optimizer / RSC server). These vulnerabilities **do not apply** to this project because it uses `output: 'export'` (static HTML) with `images.unoptimized: true`. No Node.js server runs in production.

---

## Known limitations / risks

1. **`olga.mov` video review** — `.mov` is a QuickTime container that may not play in Chrome Android or Firefox. Recommend re-encoding to `.mp4` (H.264+AAC). Test explicitly on Android Chrome.

2. **`output: 'export'` (static site)** — Next.js redirects don't work at runtime; legacy routes (`/ceni/`, `/rasschet/`, etc.) are served as separate pages. Verify these render correctly.

3. **No backend** — Form submissions are simulated (800ms delay + success state). In production, connect to a real backend or form service (e.g. Formspree, Netlify Forms).

4. **Next.js version** — Currently on 14.2.35 (latest 14.x). Two CVEs exist but only affect **self-hosted Next.js servers** (not static exports). No action needed for GitHub Pages deployment.

5. **VK / Telegram links** — Currently set to `#` placeholder in `data/site.ts`. Update before production launch.

6. **`prefers-reduced-motion`** — Animations and transitions are disabled for users with the setting enabled (handled in `globals.css`). Verify the carousel still functions (transitions just become instant).
