'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { OrderForm } from '@/components/forms/order-form';
import { SocialIconLinks } from '@/components/ui/social-icon-links';
import { promo } from '@/data/promo';

export function PromoSection() {
  const [minutes, setMinutes] = React.useState(14);
  const [seconds, setSeconds] = React.useState(59);
  const [expired, setExpired] = React.useState(false);

  React.useEffect(() => {
    if (expired) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s > 0) return s - 1;
        setMinutes((m) => {
          if (m > 0) return m - 1;
          setExpired(true);
          return 0;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [expired]);

  return (
    <section className="w-full py-16 sm:py-24 bg-primary-600 text-white flex items-center min-h-[260px] sm:min-h-[300px]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-center">
          <div className="max-w-2xl self-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              {promo.title}
            </h2>
            <p className="mt-2 text-primary-100">
              Заполните заявку на уборку прямо сейчас и получите скидку{' '}
              <span className="font-semibold text-[1.15em] sm:text-[1.25em]">
                {promo.discountPercent}%
              </span>
            </p>
            {!expired ? (
              <div className="mt-6 flex items-baseline gap-4">
                <div>
                  <span className="text-5xl sm:text-6xl font-bold tabular-nums">
                    {String(minutes).padStart(2, '0')}
                  </span>
                  <span className="ml-1 text-xl text-primary-200">Минут</span>
                </div>
                <div>
                  <span className="text-5xl sm:text-6xl font-bold tabular-nums">
                    {String(seconds).padStart(2, '0')}
                  </span>
                  <span className="ml-1 text-xl text-primary-200">Секунд</span>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-xl font-semibold text-primary-100">Время вышло!</p>
            )}
          </div>

          <div id="promo-form" className="w-full rounded-2xl bg-white text-slate-900 p-6 sm:p-7 shadow-lg lg:ml-auto scroll-mt-24">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                  Успейте связаться, пока действует скидка!
                </h3>
                <p className="mt-2 text-slate-600">
                  Оставьте свои контакты и наш менеджер свяжется с вами!
                </p>
              </div>

              <div>
                <OrderForm compact submitLabel="Связаться" formName="promo-contact" />
              </div>

              <div className="mt-3 sm:-mt-6 flex items-center justify-end gap-3">
                <span className="hidden sm:inline text-xs text-slate-500">
                  Или напишите нам в мессенджер:
                </span>
                <SocialIconLinks size="sm" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
