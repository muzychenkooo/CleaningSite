import type { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/layout/service-page-template';
import { getServicesContent } from '@/data/service-content';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Озонирование',
  description: 'Озонирование помещений для дезинфекции и удаления запахов. Москва и МО.',
  openGraph: {
    title: 'Озонирование | ' + site.name,
    url: `${baseUrl}/services/ozonation/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/services/ozonation/` },
};

export default function OzonationPage() {
  const content = getServicesContent('ozonation');
  return (
    <ServicePageTemplate
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Частные лица', href: '/private/' },
        { label: 'Озонирование' },
      ]}
      content={content}
      canonicalPath="/services/ozonation/"
    />
  );
}
