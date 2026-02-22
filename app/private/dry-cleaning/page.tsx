import type { Metadata } from 'next';
import { ServicePageTemplate } from '@/components/layout/service-page-template';
import { getPrivateServiceContent } from '@/data/service-content';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Химчистка',
  description: 'Химчистка мебели, ковров, штор, спального места. Москва и МО.',
  openGraph: {
    title: 'Химчистка | ' + site.name,
    url: `${baseUrl}/private/dry-cleaning/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/private/dry-cleaning/` },
};

export default function PrivateDryCleaningPage() {
  const content = getPrivateServiceContent('dry-cleaning');
  return (
    <ServicePageTemplate
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Частные лица', href: '/private/' },
        { label: 'Химчистка' },
      ]}
      content={content}
      canonicalPath="/private/dry-cleaning/"
    />
  );
}
