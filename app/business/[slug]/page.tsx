import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBusinessBySlug, businessTypes } from '@/data/sitemap';
import { getBusinessServiceContent } from '@/data/service-content';
import { ServicePageTemplate } from '@/components/layout/service-page-template';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return businessTypes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) return { title: 'Услуга' };
  const url = `${baseUrl}/business/${slug}/`;
  return {
    title: business.label,
    description: `Профессиональный клининг: ${business.label}. Москва и Московская область. Договор, счёт, акты.`,
    openGraph: {
      title: `${business.label} | ${site.name}`,
      url,
      locale: 'ru_RU',
    },
    alternates: { canonical: url },
  };
}

export default async function BusinessTypePage({ params }: Props) {
  const { slug } = await params;
  const content = getBusinessServiceContent(slug);
  const business = getBusinessBySlug(slug);
  if (!content || !business) notFound();

  return (
    <ServicePageTemplate
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Для бизнеса', href: '/business/' },
        { label: business.label },
      ]}
      content={content}
      canonicalPath={`/business/${slug}/`}
    />
  );
}
