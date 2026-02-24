import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { site } from '@/data/site';
import { CasesGallery } from './CasesGallery';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Примеры работ',
  description: 'Фото до и после уборки. Примеры работ клининговой компании.',
  openGraph: {
    title: 'Примеры работ | ' + site.name,
    url: `${baseUrl}/cases/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/cases/` },
};

export default function CasesPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Примеры работ' }]} />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Примеры работ
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Фото до и после уборки. Реальные объекты — квартиры, офисы, помещения после ремонта.
        </p>

        <CasesGallery />

        <p className="mt-8 text-slate-600">
          Больше примеров — в галерее на главной и по запросу. Оставьте заявку, чтобы обсудить ваш объект.
        </p>
        <Button asChild className="mt-6">
          <Link href="/?open=quiz#rasschet">{site.cta.calculate}</Link>
        </Button>
      </Container>
    </div>
  );
}
