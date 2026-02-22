import type { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/layout/service-page-template';
import { getPrivateServiceContent } from '@/data/service-content';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Мойка окон',
  description: 'Мойка окон: сезонная, после ремонта, альпинистами. Москва и МО.',
  openGraph: {
    title: 'Мойка окон | ' + site.name,
    url: `${baseUrl}/private/window-wash/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/private/window-wash/` },
};

export default function PrivateWindowWashPage() {
  const content = getPrivateServiceContent('window-wash');
  return (
    <ServicePageTemplate
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Частные лица', href: '/private/' },
        { label: 'Мойка окон' },
      ]}
      content={content}
      canonicalPath="/private/window-wash/"
    />
  );
}
