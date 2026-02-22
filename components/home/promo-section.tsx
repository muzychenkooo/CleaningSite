'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
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
    <section className="w-full py-16 sm:py-24 bg-primary-600 text-white">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            {promo.title}
          </h2>
          <p className="mt-2 text-primary-100">
            {promo.description}
          </p>
          {!expired ? (
            <div className="mt-6 flex items-baseline gap-4">
              <div>
                <span className="text-4xl font-bold tabular-nums">{String(minutes).padStart(2, '0')}</span>
                <span className="ml-1 text-lg text-primary-200">Минут</span>
              </div>
              <div>
                <span className="text-4xl font-bold tabular-nums">{String(seconds).padStart(2, '0')}</span>
                <span className="ml-1 text-lg text-primary-200">Секунд</span>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-xl font-semibold text-primary-100">Время вышло!</p>
          )}
          <Button
            asChild
            size="lg"
            className="mt-6 bg-white text-primary-700 hover:bg-primary-50"
          >
            <Link href="/#zayavka">{promo.cta}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
