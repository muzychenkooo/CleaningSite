import Link from 'next/link';
import { Suspense } from 'react';
import { Container } from '@/components/layout/container';
import { ServicesList } from '@/components/services/services-list';

export const metadata = {
  title: 'Услуги',
  description: 'Профессиональная уборка квартир, офисов, после ремонта. Мойка окон, химчистка, дезинфекция. Москва и МО.',
};

function ServicesListFallback() {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      <div className="h-9 w-16 rounded-md bg-slate-200 animate-pulse" />
      <div className="h-9 w-24 rounded-md bg-slate-200 animate-pulse" />
      <div className="h-9 w-32 rounded-md bg-slate-200 animate-pulse" />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <nav className="text-sm text-slate-500 mb-6" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-primary-600">Главная</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Услуги</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Наши услуги
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Выберите категорию и вид уборки. Для каждой услуги — прозрачные условия и расчёт стоимости.
        </p>
        <Suspense fallback={<ServicesListFallback />}>
          <ServicesList />
        </Suspense>
      </Container>
    </div>
  );
}
