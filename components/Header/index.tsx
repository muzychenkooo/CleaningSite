'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/data/site';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Topbar } from './Topbar';
import { MainNav } from './MainNav';
import { HeaderCtas } from './HeaderCtas';
import { MobileNavDrawer } from './MobileNavDrawer';
import { assetUrl } from '@/lib/asset-url';

/**
 * Шапка: верхняя полоса (Topbar) + основная строка (логотип | нав | CTA).
 * Сетка без наложений: логотип и CTA с фиксированной зоной, нав занимает остаток.
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Topbar />

      {/* Основная строка: логотип слева, навигация + CTA-кнопки справа. */}
      <Container className="header-container w-full min-w-0 max-w-[1536px]">
        <div className="grid h-16 min-h-16 w-full min-w-0 grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 xl:gap-4">
          {/* Логотип: изображение вместо текста */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Большая Уборка — главная"
          >
            <Image
              src={assetUrl('/assets/logo/new_logo.png')}
              alt="Большая Уборка"
              width={200}
              height={56}
              className="h-12 w-auto object-contain sm:h-14"
              priority
            />
          </Link>

          {/* Навигация: растягивается до правой границы контейнера */}
          <div className="flex min-w-0 w-full overflow-visible">
            <MainNav />
          </div>

          {/* Десктоп: кнопки CTA справа от навигации */}
          <div className="hidden xl:flex shrink-0 flex-nowrap items-center gap-2">
            <Button asChild size="sm" className="shrink-0 whitespace-nowrap">
              <Link href="/quiz/">{site.cta.calculateShort}</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="shrink-0 whitespace-nowrap">
              <Link href="/#zayavka">{site.cta.callback}</Link>
            </Button>
          </div>

          {/* Планшет/мобильный: CTA + бургер */}
          <div className="flex min-w-0 flex-nowrap items-center justify-end gap-2 xl:hidden">
            <HeaderCtas variant="mobile" phoneDisplay={phoneDisplay} />
            <button
              ref={burgerRef}
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
