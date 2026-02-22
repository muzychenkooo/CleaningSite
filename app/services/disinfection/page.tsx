import type { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/layout/service-page-template';
import { getServicesContent } from '@/data/service-content';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Дезинфекция',
  description: 'Дезинфекция помещений. Москва и МО.',
  openGraph: {
    title: 'Дезинфекция | ' + site.name,
    url: `${baseUrl}/services/disinfection/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/services/disinfection/` },
};

export default function DisinfectionPage() {
  const content = getServicesContent('disinfection');
  return (
    <ServicePageTemplate
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Частные лица', href: '/private/' },
        { label: 'Дезинфекция' },
      ]}
      content={content}
      canonicalPath="/services/disinfection/"
    />
  );
}
