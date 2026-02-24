'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';
import { cn } from '@/lib/utils';

/** pathname matches href exactly or (if prefix) as section (e.g. /private/, /business/). */
function isActive(pathname: string, href: string, prefixMatch = false): boolean {
  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  const base = href.endsWith('/') ? href : href + '/';
  if (prefixMatch) return path === base || path.startsWith(base);
  return path === base;
}

const linkBase =
  'shrink-0 whitespace-nowrap rounded-md px-3 py-2 font-medium transition-colors';
const linkInactive =
  'text-slate-700 hover:bg-slate-100 hover:text-primary-600';
const linkActive =
  'bg-primary-50 text-primary-700 ring-1 ring-primary-100';

/**
 * Desktop main nav: direct links only — no dropdowns.
 * Active page is highlighted with primary background and ring.
 */
export function MainNav() {
  const pathname = usePathname() ?? '';

  return (
    <nav
      className="hidden xl:flex w-full flex-nowrap items-center justify-start gap-3 text-sm"
      aria-label="Основное меню"
    >
      <Link
        href="/private/"
        className={cn(
          linkBase,
          isActive(pathname, '/private/', true) ? linkActive : linkInactive
        )}
        aria-current={isActive(pathname, '/private/', true) ? 'page' : undefined}
      >
        Частным клиентам
      </Link>
      <Link
        href="/business/"
        className={cn(
          linkBase,
          isActive(pathname, '/business/', true) ? linkActive : linkInactive
        )}
        aria-current={isActive(pathname, '/business/', true) ? 'page' : undefined}
      >
        Для бизнеса
      </Link>

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
