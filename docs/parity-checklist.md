# Parity checklist: bigyborka.ru → SITE_MVP

Reference: https://bigyborka.ru/

## Pages

| Page | Reference URL | Status | Notes |
|------|----------------|--------|--------|
| Home | / | ✅ | Hero, Calculator, Services, About, Differentiators, Promo, Reviews, Video, Team, Steps, FAQ, Gallery+Video+Reports, Contact CTA |
| Services list | /uslugi-dlya-chastnyh-klientov | ✅ | Implemented as /uslugi?cat=individuals |
| Service: Apartments | /uborka-kvartir | ✅ | /uslugi/uborka-kvartir |
| Service: Houses | /uborka-domov-kottedzhej | ✅ | /uslugi/uborka-domov |
| Service: Windows | /mojka-okon | ✅ | /uslugi/mojka-okon |
| Service: Dry cleaning | /himchistka | ✅ | /uslugi/himchistka |
| Contacts | /kontakty | ✅ | /kontakty |
| Vacancies | /vakansii | ✅ | /vakansii |
| Legal | — | ✅ | /legal |

## Home sections (order)

1. Hero — КЛИНИНГОВАЯ КОМПАНИЯ / БОЛЬШАЯ УБОРКА, CTAs (Обратный звонок, Рассчитать стоимость) ✅
2. Рассчёт стоимости — calculator ✅
3. Наши услуги — tabs (частные/бизнес), 4 cards + «Посмотреть все услуги» ✅
4. О нас — текст + «Проиграть видео» ✅
5. Чем мы отличаемся от других клинингов — 6 cards ✅
6. Специальное предложение — 10% скидка, таймер, CTA ✅
7. Клиенты скажут вам больше — trust logos + отзывы, «Посмотреть все» → Yandex ✅
8. Видеоотзывы ✅
9. Наша команда — 5 человек ✅
10. Процесс уборки — 3 шага ✅
11. Ответы на частые вопросы — FAQ accordion ✅
12. Фото с места ✅
13. Видео с нами ✅
14. Выполненные работы — минимум 1 отчёт/ссылка ✅
15. Остались вопросы? — форма обратного звонка ✅

## Key elements

- Header: phone, email, schedule, Whatsapp/Vk/Telegram, Обратный звонок, Рассчитать цену, Menu (mobile) ✅
- Footer: контакты, навигация, правовая информация ✅
- Sticky mobile CTA ✅
- Forms: Order/Callback (zod, react-hook-form, honeypot), Calculator ✅
- SEO: metadata, OG, JSON-LD LocalBusiness, sitemap, robots ✅
- Corporate palette: blue (theme/colors.ts) ✅

## Definition of done

- [x] All sections present in same order
- [x] Blue theme applied
- [x] No placeholders for critical content
- [x] Build passes
- [x] Typography: Manrope + Inter (next/font), Cyrillic
- [x] Header: dropdown 250ms delay, click+touch, overflow-visible, Esc closes
- [x] Calculator: wider (max-w-4xl), same container alignment
- [x] SEO РФ: metadataBase, OG, canonical on all pages; Service JSON-LD on /uslugi/[slug]; sitemap, robots, 404
- [x] Redirects: /uslugi-dlya-chastnyh-klientov, /ceni, /rasschet → /#rasschet
- [x] Analytics: lib/analytics.ts (trackEvent, trackFormSubmit); no hardcoded IDs
- [x] Reference/competitor links in data/site.ts (referenceUrl, competitorUrls)
