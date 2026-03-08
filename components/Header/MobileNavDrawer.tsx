'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';
import { Button } from '@/components/ui/button';
import { SocialIconLinks } from '@/components/ui/social-icon-links';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string, prefixMatch = false): boolean {
  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  const base = href.endsWith('/') ? href : href + '/';
  if (prefixMatch) return path === base || path.startsWith(base);
  return path === base;
}

type Props = {
  open: boolean;
  onClose: () => void;
  phoneDisplay: string;
};

// Focusable selector used for focus-trap
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const navLinkBase = 'block rounded-md px-3 py-1.5 font-medium transition-colors';
const navLinkInactive = 'text-slate-700 hover:bg-slate-100 hover:text-primary-600';
const navLinkActive = 'bg-primary-50 text-primary-700 ring-1 ring-primary-100';

export function MobileNavDrawer({ open, onClose, phoneDisplay }: Props) {
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname() ?? '';
  const [mounted, setMounted] = React.useState(false);

  // Ensure we only access document in the browser
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ESC to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Body scroll lock: disable background scroll while меню открыто
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (!open) return;

    // Apply only when burger is actually visible (< 1280px, matches xl:hidden)
    if (window.innerWidth >= 1280) return;

    const { body, documentElement: html } = document;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.classList.add('mobile-menu-open');

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.classList.remove('mobile-menu-open');
    };
  }, [open]);

  // Focus trap + initial focus
  React.useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    // Move focus into the drawer dialog
    const focusables = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusables.length) focusables[0].focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [open]);

  // On server or before mount we render nothing (portal needs document)
  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'mobileMenuOverlay fixed inset-0 z-[55] bg-black/80 transition-opacity duration-200 ease-out xl:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden
      />

      {/* Modal dialog wrapper (mobile only) */}
      <div
        id="mobile-nav-drawer"
        className={cn(
          'mobileMenuModal fixed inset-0 z-[60] flex min-h-screen items-center justify-center px-4 xl:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
      >
        {/* Centered dialog */}
        <div
          ref={drawerRef}
          className={cn(
            'mobileMenuDialog relative flex max-h-[90vh] w-full max-w-[420px] flex-col rounded-2xl bg-white shadow-xl transition-transform transition-opacity duration-200 ease-out',
            open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          )}
        >
          {/* Dialog header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-2">
            <span className="font-semibold text-slate-900">Меню</span>
            <button
              type="button"
              onClick={onClose}
              className="mobileMenuClose inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="Закрыть меню"
            >
              <span aria-hidden>✕</span>
            </button>
          </div>

          {/* Scrollable nav body */}
          <div className="mobileMenuContent flex flex-1 flex-col overflow-y-auto p-2">
            {/* Primary links */}
            <Link
              href="/private/"
              className={cn(
                navLinkBase,
                'font-semibold',
                isActive(pathname, '/private/', true) ? navLinkActive : 'text-slate-900 hover:bg-slate-100 hover:text-primary-600'
              )}
              onClick={onClose}
              aria-current={isActive(pathname, '/private/', true) ? 'page' : undefined}
            >
              Частным клиентам
            </Link>
            <Link
              href="/business/"
              className={cn(
                navLinkBase,
                'font-semibold',
                isActive(pathname, '/business/', true)
                  ? navLinkActive
                  : 'text-slate-900 hover:bg-slate-100 hover:text-primary-600'
              )}
              onClick={onClose}
              aria-current={isActive(pathname, '/business/', true) ? 'page' : undefined}
            >
              Организациям
            </Link>

            <hr className="my-1 border-slate-200" />

            {/* Other nav links */}
            {site.nav.main.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    navLinkBase,
                    active ? navLinkActive : navLinkInactive
                  )}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            <hr className="my-1 border-slate-200" />

            <div className="mt-0.5 flex flex-wrap items-center justify-between gap-2 rounded-md px-3 py-1.5 hover:bg-slate-50">
              <a
                href={`tel:${site.phoneRaw}`}
                className="font-medium text-primary-600"
                onClick={onClose}
              >
                {phoneDisplay}
              </a>
              <SocialIconLinks size="sm" />
            </div>

            <div className="mt-2 grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
              <Button asChild size="lg" className="rounded-xl">
                <Link href="/#zayavka" onClick={onClose}>
                  Калькулятор
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-2">
                <Link href="/#promo-form" onClick={onClose}>
                  Обратная связь
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
