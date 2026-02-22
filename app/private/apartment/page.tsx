import type { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/layout/service-page-template';
import { getPrivateServiceContent } from '@/data/service-content';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Уборка квартир',
  description: 'Уборка квартир: после ремонта, генеральная, поддерживающая, VIP. Москва и МО.',
  openGraph: {
    title: 'Уборка квартир | ' + site.name,
    url: `${baseUrl}/private/apartment/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/private/apartment/` },
};

export default function PrivateApartmentPage() {
  const content = getPrivateServiceContent('apartment');
  return (
    <ServicePageTemplate
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Частные лица', href: '/private/' },
        { label: 'Квартира' },
      ]}
      content={content}
      canonicalPath="/private/apartment/"
    />
  );
}
