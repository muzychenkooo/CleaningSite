# Layout QA Checklist

## Breakpoints to test
- 360px (mobile narrow)
- 390px (mobile)
- 414px (mobile wide)
- 768px (tablet)
- 1024px (desktop)
- 1280px (desktop wide)
- 1440px+ (large desktop)

## Fixed issues
- [x] Header topbar wrapping at 640-1024px — reorganized layout, min widths
- [x] Mobile drawer overlay positioning — responsive `top-14 sm:top-24`
- [x] Z-index stacking (header 40, overlay 30, drawer 60, modals 100, sticky CTA 50)
- [x] Container max-width consistency
- [x] Hero gradient → deep navy blue
- [x] Typography → Manrope + Inter
- [x] Theme tokens → single source of truth

## Manual verification
- [ ] No horizontal scroll at any breakpoint
- [ ] Header never overlaps content
- [ ] Nav dropdowns do not clip
- [ ] Mobile menu opens/closes correctly
- [ ] Sticky CTA visible on mobile, hidden on desktop
- [ ] Forms validation + success states work
- [ ] All anchors scroll correctly

## Smoke test
```bash
npm run dev   # in one terminal
npm run smoke # in another (fetches localhost:3000, checks key content)
```
