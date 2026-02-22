'use client';

import Link from 'next/link';
import { site } from '@/data/site';

/**
 * Desktop main nav: direct links only — no dropdowns.
 * gap-6 matches the outer header grid xl:gap-6 so spacing between
 * logo ↔ nav items ↔ CTA buttons feels visually equal.
 */
export function MainNav() {
  return (
    <nav
      className="hidden xl:flex w-full flex-nowrap items-center justify-start gap-4 text-sm"
      aria-label="Основное меню"
    >
      <Link
        href="/private/"
        className="shrink-0 whitespace-nowrap rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
      >
        Частным клиентам
      </Link>
      <Link
        href="/business/"
        className="shrink-0 whitespace-nowrap rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
      >
        Для бизнеса
      </Link>

      {site.nav.main.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="shrink-0 whitespace-nowrap rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
