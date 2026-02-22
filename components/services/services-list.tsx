'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { services, serviceCategories } from '@/data/services';
import type { ServiceCategory } from '@/data/services';

export function ServicesList() {
  const searchParams = useSearchParams();
  const cat = searchParams.get('cat');
  const category = (cat === 'business' ? 'business' : 'individuals') as ServiceCategory;
  const list = cat ? services.filter((s) => s.category === category) : services;

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild variant={!cat ? 'default' : 'outline'} size="sm">
          <Link href="/uslugi">Все</Link>
        </Button>
        {serviceCategories.map((c) => (
          <Button
            key={c.id}
            asChild
            variant={cat === c.id ? 'default' : 'outline'}
            size="sm"
          >
            <Link href={`/uslugi?cat=${c.id}`}>{c.label}</Link>
          </Button>
        ))}
      </div>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <li key={s.id}>
            <Card className="h-full flex flex-col">
              <CardContent className="pt-6 flex-1">
                <CardTitle className="text-lg">{s.title}</CardTitle>
                <p className="mt-2 text-sm text-slate-600">{s.shortDesc}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/uslugi/${s.slug}`}>Подробнее и заказать</Link>
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
