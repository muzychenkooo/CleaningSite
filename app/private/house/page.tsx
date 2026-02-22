import type { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/layout/service-page-template';
import { getPrivateServiceContent } from '@/data/service-content';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Уборка домов и коттеджей',
  description: 'Уборка частных домов и коттеджей: генеральная, после ремонта, придомовая территория. Москва и МО.',
  openGraph: {
    title: 'Дом/коттедж | ' + site.name,
    url: `${baseUrl}/private/house/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/private/house/` },
};

export default function PrivateHousePage() {
  const content = getPrivateServiceContent('house');
  return (
    <ServicePageTemplate
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Частные лица', href: '/private/' },
        { label: 'Дом/коттедж' },
      ]}
      content={content}
      canonicalPath="/private/house/"
    />
  );
}
