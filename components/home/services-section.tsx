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
            className="inline-flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5 text-slate-600 min-w-0 max-w-full"
            role="tablist"
            aria-label="Категория услуг"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'individuals'}
              onClick={() => setActiveTab('individuals')}
              className={cn(
                'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                activeTab === 'individuals' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80' : 'hover:bg-white/60',
              )}
            >
              Для частных клиентов
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'business'}
              onClick={() => setActiveTab('business')}
              className={cn(
                'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                activeTab === 'business' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80' : 'hover:bg-white/60',
              )}
            >
              Для бизнеса
            </button>
          </div>
          {/* Подзаголовок под переключателем */}
          <p className="mt-4 text-sm text-slate-500">Примеры популярных услуг:</p>

          <div className="mt-6">
            {activeTab === 'individuals' && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {individuals.map((s) => (
                    <Card key={s.id} className="flex flex-col rounded-2xl border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 motion-reduce:transform-none">
                      <CardContent className="pt-6 flex-1">
                        <CardTitle className="text-base font-semibold">{s.title}</CardTitle>
                        <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">{s.shortDesc}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button asChild variant="ghost" size="sm" className="p-0 h-auto font-medium text-primary-600 hover:text-primary-700">
                          <Link href={`/uslugi/${s.slug}`}>Узнать больше</Link>
                        </Button>
                      </CardFooter>
                    </Card>
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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {business.map((s) => (
                    <Card key={s.id} className="flex flex-col rounded-2xl border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 motion-reduce:transform-none">
                      <CardContent className="pt-6 flex-1">
                        <CardTitle className="text-base font-semibold">{s.title}</CardTitle>
                        <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">{s.shortDesc}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button asChild variant="ghost" size="sm" className="p-0 h-auto font-medium text-primary-600 hover:text-primary-700">
                          <Link href={`/uslugi/${s.slug}`}>Узнать больше</Link>
                        </Button>
                      </CardFooter>
                    </Card>
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
