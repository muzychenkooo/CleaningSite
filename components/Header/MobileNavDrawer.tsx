'use client';

import * as React from 'react';
import Link from 'next/link';
import { site } from '@/data/site';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onClose: () => void;
  phoneDisplay: string;
};

// Focusable selector used for focus-trap
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavDrawer({ open, onClose, phoneDisplay }: Props) {
  const drawerRef = React.useRef<HTMLDivElement>(null);

  // ESC to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Body scroll lock
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Focus trap + initial focus
  React.useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    // Move focus into the drawer
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

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/30 transition-opacity xl:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        id="mobile-nav-drawer"
        className={cn(
          'fixed right-0 top-0 z-50 flex w-80 max-w-[85vw] flex-col border-l border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-out xl:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ height: '100dvh' }}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
      >
        {/* Drawer header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="font-semibold text-slate-900">Меню</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-label="Закрыть меню"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        {/* Scrollable nav body */}
        <div className="flex flex-1 flex-col overflow-y-auto p-3">
          {/* Primary links */}
          <Link
            href="/private/"
            className="block rounded-md px-3 py-2 font-semibold text-slate-900 hover:bg-slate-100 hover:text-primary-600"
            onClick={onClose}
          >
            Частным клиентам
          </Link>
          <Link
            href="/business/"
            className="block rounded-md px-3 py-2 font-semibold text-slate-900 hover:bg-slate-100 hover:text-primary-600"
            onClick={onClose}
          >
            Для бизнеса
          </Link>

          <hr className="my-2 border-slate-200" />

          {/* Other nav links */}
          {site.nav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}

          <hr className="my-2 border-slate-200" />

          <a
            href={`tel:${site.phoneRaw}`}
            className="block rounded-md px-3 py-2 font-medium text-primary-600 hover:bg-slate-50"
          >
            {phoneDisplay}
          </a>

          <Button asChild className="mt-3">
            <Link href="/?open=quiz#rasschet" onClick={onClose}>
              {site.cta.calculate}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
