import type { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/layout/service-page-template';
import { getServicesContent } from '@/data/service-content';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Удаление запахов',
  description: 'Профессиональное удаление стойких запахов в помещениях. Москва и МО.',
  openGraph: {
    title: 'Удаление запахов | ' + site.name,
    url: `${baseUrl}/services/odor-removal/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/services/odor-removal/` },
};

export default function OdorRemovalPage() {
  const content = getServicesContent('odor-removal');
  return (
    <ServicePageTemplate
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Частные лица', href: '/private/' },
        { label: 'Удаление запахов' },
      ]}
      content={content}
      canonicalPath="/services/odor-removal/"
    />
  );
}
