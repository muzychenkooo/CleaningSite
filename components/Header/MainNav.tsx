'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';
import {
  apartmentAnchors,
  houseAnchors,
  windowWashAnchors,
  dryCleaningAnchors,
  businessNav,
} from '@/data/sitemap';
import { cn } from '@/lib/utils';

/** pathname matches href exactly or (if prefix) as section (e.g. /private/, /business/). */
function isActive(pathname: string, href: string, prefixMatch = false): boolean {
  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  const base = href.endsWith('/') ? href : href + '/';
  if (prefixMatch) return path === base || path.startsWith(base);
  return path === base;
}

const linkBase =
  'shrink-0 whitespace-nowrap rounded-md px-5 py-2.5 text-base font-medium transition-colors';
const linkInactive =
  'text-slate-700 hover:bg-slate-100 hover:text-primary-600';
const linkActive =
  'bg-primary-50 text-primary-700 ring-1 ring-primary-100';

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function IndividualsMegaMenu({ pathname }: { pathname: string }) {
  const active = isActive(pathname, '/private/', true);
  const [open, setOpen] = React.useState(false);
  const closeTimeoutRef = React.useRef<number | null>(null);

  const scheduleClose = React.useCallback(() => {
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 50);
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  React.useEffect(
    () => () => {
      if (closeTimeoutRef.current != null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    },
    []
  );

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        href="/private/"
        className={cn(
          linkBase,
          'flex items-center gap-1',
          active ? linkActive : linkInactive
        )}
        aria-current={active ? 'page' : undefined}
      >
        <span>Частным клиентам</span>
        <span
          className="text-[0.6rem] text-slate-500 group-hover:text-primary-600"
          aria-hidden
        >
          ▾
        </span>
      </Link>

      {/* Мегаменю: 4 колонки, как на референсе */}
      <div
        className={cn(
          'absolute left-1/2 top-full z-40 w-[min(1040px,calc(100vw-3rem))] -translate-x-1/2 pt-3 transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        )}
      >
        <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {/* Уборка квартир */}
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-900">
                Уборка квартир
              </div>
              <ul className="space-y-1.5 text-sm">
                {apartmentAnchors.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/private/apartment/#${item.id}`}
                      className="block text-slate-700 hover:text-primary-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Уборка домов */}
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-900">
                Уборка домов
              </div>
              <ul className="space-y-1.5 text-sm">
                {houseAnchors.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/private/house/#${item.id}`}
                      className="block text-slate-700 hover:text-primary-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Дополнительно */}
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-900">
                Дополнительно
              </div>
              <ul className="space-y-1.5 text-sm">
                {windowWashAnchors.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/private/window-wash/#${item.id}`}
                      className="block text-slate-700 hover:text-primary-600"
                    >
                      Мойка окон — {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/services/ozonation/"
                    className="block text-slate-700 hover:text-primary-600"
                  >
                    Озонирование
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/odor-removal/"
                    className="block text-slate-700 hover:text-primary-600"
                  >
                    Удаление запахов
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/disinfection/"
                    className="block text-slate-700 hover:text-primary-600"
                  >
                    Дезинфекция
                  </Link>
                </li>
              </ul>
            </div>

            {/* Химчистка */}
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-900">
                Химчистка
              </div>
              <ul className="space-y-1.5 text-sm">
                {dryCleaningAnchors.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/private/dry-cleaning/#${item.id}`}
                      className="block text-slate-700 hover:text-primary-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessMegaMenu({ pathname }: { pathname: string }) {
  const active = isActive(pathname, '/business/', true);
  const columns = chunk(businessNav, 6);

  const [open, setOpen] = React.useState(false);
  const closeTimeoutRef = React.useRef<number | null>(null);

  const scheduleClose = React.useCallback(() => {
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 50);
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  React.useEffect(
    () => () => {
      if (closeTimeoutRef.current != null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    },
    []
  );

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        href="/business/"
        className={cn(
          linkBase,
          'flex items-center gap-1',
          active ? linkActive : linkInactive
        )}
        aria-current={active ? 'page' : undefined}
      >
        <span>Организациям</span>
        <span
          className="text-[0.6rem] text-slate-500 group-hover:text-primary-600"
          aria-hidden
        >
          ▾
        </span>
      </Link>

      <div
        className={cn(
          'absolute left-1/2 top-full z-40 w-[min(1040px,calc(100vw-3rem))] -translate-x-1/2 pt-3 transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        )}
      >
        <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {columns.map((col, idx) => (
              <div key={idx}>
                {idx === 0 && (
                  <div className="mb-2 text-sm font-semibold text-slate-900">
                    Уборка для организаций
                  </div>
                )}
                <ul className="space-y-1.5 text-sm">
                  {col.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-slate-700 hover:text-primary-600"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop main nav: топовые пункты + мегаменю для "Частным клиентам" и "Организациям".
 * Пункты остаются кликабельными ссылками и одновременно открывают выпадающие списки.
 */
export function MainNav() {
  const pathname = usePathname() ?? '';

  return (
    <nav
      className="relative hidden xl:flex w-full min-w-0 flex-1 flex-nowrap items-center justify-between gap-2"
      aria-label="Основное меню"
    >
      <IndividualsMegaMenu pathname={pathname} />
      <BusinessMegaMenu pathname={pathname} />

      {site.nav.main.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(linkBase, active ? linkActive : linkInactive)}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
