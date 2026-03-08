'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';
import { businessNav, privateNav } from '@/data/sitemap';
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
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

      {/* Выпадающий список ровно под «Частным клиентам», столбиком */}
      <div
        className={cn(
          'absolute left-0 top-full z-40 w-max pt-2 transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        )}
      >
        <div className="rounded-xl border border-slate-200 bg-white py-2 shadow-xl min-w-[200px]">
          <ul className="space-y-0.5 text-sm">
            {privateNav.filter((item) => item.label !== 'Услуги для частных лиц').map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-primary-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const BUSINESS_COLUMNS = 3;

function BusinessMegaMenu({ pathname }: { pathname: string }) {
  const active = isActive(pathname, '/business/', true);
  const columns = chunk(
    businessNav,
    Math.ceil(businessNav.length / BUSINESS_COLUMNS)
  );

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
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
          'absolute left-0 top-full z-40 w-max max-w-[calc(100vw-2rem)] pt-2 transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        )}
      >
        <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xl">
          <div className="grid gap-6 grid-cols-3">
            {columns.map((col, idx) => (
              <div key={idx}>
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
