import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { site } from '@/data/site';
import { ReviewsCarousel } from '@/components/reviews/ReviewsCarousel';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Отзывы',
  description: 'Отзывы клиентов о клининговой компании Большая Уборка.',
  openGraph: {
    title: 'Отзывы | ' + site.name,
    url: `${baseUrl}/reviews/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/reviews/` },
};

export default function ReviewsPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Отзывы' }]} />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Отзывы клиентов
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Отзывы с Яндекс, Авито, 2GIS, Profi.ru, Google. Видео-отзывы — по запросу.
        </p>

        <div className="mt-10">
          <ReviewsCarousel />
        </div>

        <Button asChild className="mt-10">
          <Link href="/contacts/">Связаться с нами</Link>
        </Button>
      </Container>
    </div>
  );
}
