# Header QA checklist

Reference: https://bigyborka.ru/

## Structure

- **Row A (Topbar):** контакты слева (телефон, email, расписание), соцсети справа. Полная ширина, `justify-between`. Показ с `lg` (1024px).
- **Row B (Main bar):** сетка 3 колонки `[auto 1fr auto]`: логотип | MainNav | HeaderCtas (desktop) или логотип | пусто | HeaderCtas + бургер (мобильный).
- **Container:** общий `Container` (max-w 1280px, px-4 sm:px-6 lg:px-8) для обеих строк.

## Breakpoints

| Viewport   | Topbar | Main nav        | CTAs                    |
|-----------|--------|------------------|-------------------------|
| &lt;768px  | hidden | burger + drawer  | 1 CTA (sm), phone icon  |
| 768–1023px | hidden | burger + drawer  | 2 CTAs (md+)            |
| 1024–1279px | visible | burger + drawer | desktop: phone + 2 CTAs |
| ≥1280px   | visible | full nav + “Ещё” | phone + 2 CTAs          |

## Zero-overlap rules

- **Логотип:** `max-w-[200px] sm:max-w-[220px]`, `shrink-0`, `truncate` по строкам — не наезжает на нав.
- **MainNav:** обёртка с `min-w-0 overflow-x-auto`; нав внутри с `min-w-max` — при нехватке места горизонтальная прокрутка, без наложений.
- **HeaderCtas (desktop):** `shrink-0`, min-width 240px — блок не сжимается.
- Дропдауны через portal — не обрезаются; у шапки нет `overflow: hidden`.

## Dropdowns

- **Trigger:** hover + click; close delay 200 ms when leaving trigger/panel.
- **Portal:** dropdown panels rendered via `createPortal(panel, document.body)` so no parent overflow clipping.
- **z-index:** panel `z-[100]`, drawer `z-50`, overlay `z-40`.
- **Keyboard:** `Esc` closes; `Tab` moves focus; ARIA `aria-expanded`, `aria-haspopup`, `aria-controls`, `role="menu"` / `role="menuitem"`.

## Manual QA (check at each width)

- [ ] 360px: no horizontal scroll; burger opens drawer; no text overlap.
- [ ] 390px: same.
- [ ] 414px: same.
- [ ] 768px: topbar still hidden; 2 CTAs visible if design allows; burger works.
- [ ] 1024px: topbar visible; main row shows logo + CTAs + burger; drawer works.
- [ ] 1280px: full desktop nav (Частным клиентам, Юридическим лицам, О нас, Наша работа, Контакты, Ещё); no overlap; dropdowns open and stay open; click into panel works.
- [ ] 1440px: same, more space.

## Files

- `components/Header/index.tsx` — main Header
- `components/Header/Topbar.tsx` — Row A
- `components/Header/MainNav.tsx` — desktop nav + “Ещё”
- `components/Header/NavDropdown.tsx` — single dropdown (portal, delay)
- `components/Header/HeaderCtas.tsx` — phone + CTAs
- `components/Header/MobileNavDrawer.tsx` — slide-out menu
- `components/layout/header.tsx` — re-export for `@/components/layout/header`
