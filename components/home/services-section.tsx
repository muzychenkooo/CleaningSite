'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { getFeaturedServices } from '@/data/services';
import { cn } from '@/lib/utils';

export function ServicesSection() {
  const [activeTab, setActiveTab] = React.useState<'individuals' | 'business'>('individuals');
  const individuals = getFeaturedServices('individuals');
  const business = getFeaturedServices('business');

  return (
    <section id="uslugi" className="w-full py-16 sm:py-24 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Наши услуги
        </h2>
        <div className="mt-10">
          <div
            className="inline-flex flex-row flex-nowrap gap-1.5 rounded-xl bg-slate-100 p-1.5 text-slate-600 min-w-0 max-w-full w-full sm:w-auto"
            role="tablist"
            aria-label="Категория услуг"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'individuals'}
              onClick={() => setActiveTab('individuals')}
              className={cn(
                'inline-flex flex-1 sm:flex-none items-center justify-center rounded-lg px-3 sm:px-4 py-2 text-sm font-medium min-w-0 sm:min-w-[13rem] max-w-full text-center whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                activeTab === 'individuals'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                  : 'hover:bg-white/60',
              )}
            >
              Частные клиенты
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'business'}
              onClick={() => setActiveTab('business')}
              className={cn(
                'inline-flex flex-1 sm:flex-none items-center justify-center rounded-lg px-3 sm:px-4 py-2 text-sm font-medium min-w-0 sm:min-w-[13rem] max-w-full text-center whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                activeTab === 'business'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                  : 'hover:bg-white/60',
              )}
            >
              Организации
            </button>
          </div>
          {/* Подзаголовок под переключателем */}
          <p className="mt-4 text-sm text-slate-500">Примеры популярных услуг:</p>

          <div className="mt-6">
            {activeTab === 'individuals' && (
              <>
                <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {individuals.map((s) => (
                    <Link
                      key={s.id}
                      href={`/uslugi/${s.slug}/`}
                      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl"
                    >
                      <Card className="flex h-full flex-col rounded-2xl border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 motion-reduce:transform-none">
                        <CardContent className="pt-2 pb-5 sm:pt-5 sm:pb-6 flex-1">
                          <CardTitle className="text-base font-semibold leading-snug">{s.title}</CardTitle>
                          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{s.shortDesc}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href="/private/">Посмотреть все услуги</Link>
                  </Button>
                </div>
              </>
            )}
            {activeTab === 'business' && (
              <>
                <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {business.map((s) => (
                    <Link
                      key={s.id}
                      href={`/uslugi/${s.slug}/`}
                      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl"
                    >
                      <Card className="flex h-full flex-col rounded-2xl border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 motion-reduce:transform-none">
                        <CardContent className="pt-2 pb-5 sm:pt-5 sm:pb-6 flex-1">
                          <CardTitle className="text-base font-semibold leading-snug">{s.title}</CardTitle>
                          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{s.shortDesc}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href="/business/">Посмотреть все услуги</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
