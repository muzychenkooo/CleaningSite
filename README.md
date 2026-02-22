# Большая Уборка — сайт клининговой компании

Современный лендинг клининговой компании (Москва и МО): услуги, расчёт стоимости, заявки, отзывы, FAQ.

## Стек

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **React Hook Form** + **Zod** для форм и валидации
- **Radix UI** (Accordion, Dialog, Tabs) для доступных компонентов

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Если появляется **ChunkLoadError** (timeout при загрузке layout), очистите кэш и перезапустите:

```bash
npm run dev:clean
```

## Деплой на GitHub Pages

1. В репозитории: **Settings → Pages → Build and deployment** — источник выберите **GitHub Actions**.
2. При пуше в ветку `main` workflow `.github/workflows/deploy.yml` соберёт статический экспорт и выложит его на GitHub Pages.
3. Сайт будет доступен по адресу: `https://<ваш-username>.github.io/KliningCompany_MVP_site/`

## Сборка и тесты

```bash
npm run build
npm test
```

## Структура и URL (sitemap)

- `app/` — страницы и layout
- `components/` — UI-компоненты и блоки главной (hero, услуги, отзывы, FAQ, формы)
- `data/` — контент и навигация: `site.ts`, `sitemap.ts` (источник правды для навигации), `service-content.ts` (детальные описания услуг: что входит, процесс, гарантии, FAQ, кросс-ссылки), отзывы, FAQ. Первичный источник текстов — папка `Наполнение/Услуги` (при извлечении из PDF заполнять `service-content.ts`).
- `lib/` — утилиты и логика расчёта стоимости (`lib/pricing`)

**URL (kebab-case, с завершающим слэшем для GitHub Pages):**

| Раздел | URL |
|--------|-----|
| Главная | `/` |
| Частные лица (лендинг) | `/private/` |
| Квартира, дом, мойка окон, химчистка | `/private/apartment/`, `/private/house/`, `/private/window-wash/`, `/private/dry-cleaning/` |
| Доп. услуги | `/services/ozonation/`, `/services/odor-removal/`, `/services/disinfection/` |
| Для бизнеса (лендинг + типы) | `/business/`, `/business/[slug]/` (офис, склад, кафе и т.д.) |
| Примеры работ, отзывы, цены | `/cases/`, `/reviews/`, `/prices/` |
| О компании, контакты | `/about/`, `/contacts/` |
| Вакансии, политика конфиденциальности | `/vacancies/`, `/privacy/` |
| 404 | страница не найдена (Next.js экспортирует 404 для GitHub Pages) |

Старые URL перенаправляются: `/ceni` → `/prices/`, `/kontakty` → `/contacts/`, `/vakansii` → `/vacancies/`, `/legal` → `/privacy/`. Навигация (шапка и подвал) берётся из `data/sitemap.ts` и `data/site.ts`.

## Конверсии

- **Заявка на обратный звонок** — форма (имя, телефон; опционально адрес, дата, тип услуги) с honeypot и успешным состоянием.
- **Рассчёт стоимости** — калькулятор по типу уборки, площади, окнам, балкону; результат выводится на странице.

SEO: мета-теги, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD (LocalBusiness). Мобильная панель с CTA внизу экрана. Для фавиконки добавьте `public/favicon.ico`.
# KliningCompany_MVP_site
