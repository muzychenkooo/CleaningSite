import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { site } from '@/data/site';
import { completedReports } from '@/data/reports';

const baseUrl = 'https://bigyborka.ru';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return completedReports.map((report) => ({ id: report.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const title = `Статья ${id}`;
  const url = `${baseUrl}/articles/${id}/`;

  return {
    title,
    description: `${title} о клининговых услугах компании ${site.name}.`,
    openGraph: {
      title: `${title} | ${site.name}`,
      description: `${title} о клининговых услугах компании ${site.name}.`,
      url,
      locale: 'ru_RU',
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const title = `Статья ${id}`;

  return (
    <div className="py-8 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: title }]} />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-slate-600">{title}</p>
      </Container>
    </div>
  );
}

