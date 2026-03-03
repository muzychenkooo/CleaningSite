'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/data/site';
import { Container } from '@/components/layout/container';
import { Topbar } from './Topbar';
import { MainNav } from './MainNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { assetUrl } from '@/lib/asset-url';

/**
 * Шапка: верхняя полоса (Topbar) + основная строка (логотип | навигация).
 * Логотип и пункты меню равномерно на всю ширину контейнера.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const burgerRef = React.useRef<HTMLButtonElement>(null);
  const phoneDisplay = site.phoneDisplay;

  const closeMobileNav = React.useCallback(() => {
    setMobileOpen(false);
    requestAnimationFrame(() => burgerRef.current?.focus());
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:fixed lg:left-0 lg:right-0">
      <Topbar />

      {/* Основная строка: логотип и навигация на всю ширину. */}
      <Container className="header-container w-full min-w-0 max-w-[1760px] px-4 sm:px-6 lg:px-8">
        <div className="grid h-20 min-h-20 w-full min-w-0 grid-cols-[auto_1fr] items-center gap-8 sm:h-[6rem] sm:min-h-[6rem] xl:gap-12">
          {/* Логотип */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Большая Уборка — главная"
          >
            <Image
              src={assetUrl('/assets/logo/new_logo.png')}
              alt="Большая Уборка"
              width={340}
              height={102}
              className="h-[5rem] w-auto object-contain sm:h-[6rem]"
              priority
            />
          </Link>

          {/* Навигация (десктоп) и бургер (мобильный) */}
          <div className="flex min-w-0 flex-1 items-center justify-end overflow-visible xl:min-w-0">
            <MainNav />
            <button
              ref={burgerRef}
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 xl:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Меню"
              aria-controls="mobile-nav-drawer"
            >
              <span className="sr-only">Меню</span>
              {mobileOpen ? <span aria-hidden>✕</span> : <span aria-hidden>☰</span>}
            </button>
          </div>
        </div>
      </Container>

      <MobileNavDrawer
        open={mobileOpen}
        onClose={closeMobileNav}
        phoneDisplay={phoneDisplay}
      />
    </header>
  );
}
