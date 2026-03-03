'use client';

import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'cookie-consent-accepted';

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      const accepted = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY);
      if (!accepted) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = React.useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
      setVisible(false);
    } catch {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Уведомление о файлах cookie"
      className="fixed bottom-0 left-0 right-0 z-[110] border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600 sm:max-w-2xl">
          Мы используем файлы cookie для работы сайта и улучшения вашего опыта. Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookie.{' '}
          <Link href="/privacy/#cookies" className="text-primary-600 underline hover:no-underline">
            Подробнее
          </Link>
        </p>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="/privacy/#cookies">
            <Button type="button" variant="outline" size="sm" className="rounded-lg">
              Настроить файлы
            </Button>
          </Link>
          <Button type="button" size="sm" className="rounded-lg font-semibold" onClick={accept}>
            Принять
          </Button>
        </div>
      </div>
    </div>
  );
}
