'use client';

import { site } from '@/data/site';
import { Container } from '@/components/layout/container';

/**
 * Верхняя полоска шапки.
 * Слева: email + расписание.
 * Справа: соцсети → телефон (CTA-кнопки — в нижней полосе).
 */
export function Topbar() {
  return (
    <div className="hidden w-full border-b border-slate-100 bg-slate-50 lg:block">
      <Container className="header-container flex h-10 min-h-10 w-full min-w-0 max-w-[1536px] flex-nowrap items-center gap-4 text-sm">

        {/* Левая группа: email + расписание */}
        <div className="flex min-w-0 flex-nowrap items-center gap-3 lg:gap-4">
          <a
            href={`mailto:${site.email}`}
            className="hidden shrink-0 truncate text-slate-600 hover:text-primary-600 xl:block xl:max-w-[220px]"
            title={site.email}
          >
            {site.email}
          </a>
          <span className="shrink-0 whitespace-nowrap text-slate-500">{site.schedule}</span>
        </div>

        {/* Правая группа: Соцсети | Телефон — прижата к правому краю */}
        <div className="ml-auto flex shrink-0 flex-nowrap items-center gap-3 lg:gap-4">
          {/* Соцсети */}
          <div className="flex items-center gap-2 border-r border-slate-200 pr-3 lg:pr-4">
            <a
              href={site.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap text-slate-600 hover:text-primary-600"
              aria-label="WhatsApp"
            >
              WhatsApp
            </a>
            <a
              href={site.social.vk}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap text-slate-600 hover:text-primary-600"
              aria-label="VK"
            >
              Vk
            </a>
            <a
              href={site.social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap text-slate-600 hover:text-primary-600"
              aria-label="Telegram"
            >
              Telegram
            </a>
          </div>

          {/* Телефон */}
          <a
            href={`tel:${site.phoneRaw}`}
            className="shrink-0 font-medium text-slate-700 hover:text-primary-600 whitespace-nowrap"
          >
            {site.phoneDisplay}
          </a>
        </div>
      </Container>
    </div>
  );
}
