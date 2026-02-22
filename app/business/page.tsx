import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { site } from '@/data/site';
import { businessTypes } from '@/data/sitemap';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Услуги для бизнеса',
  description: 'Клининг для офисов, складов, магазинов, кафе, производств. Москва и МО.',
  openGraph: {
    title: 'Для бизнеса | ' + site.name,
    url: `${baseUrl}/business/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/business/` },
};

export default function BusinessLandingPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Для бизнеса' }]} />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Услуги для бизнеса
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Профессиональный клининг офисов, складов, торговых и производственных помещений, фасадов, парковок. Регулярное обслуживание и разовые уборки.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {businessTypes.map((t) => (
            <li key={t.slug}>
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex-1">
                  <CardTitle className="text-base">{t.label}</CardTitle>
                </CardContent>
                <CardFooter>
                  <Button asChild size="sm">
                    <Link href={`/business/${t.slug}/`}>Подробнее</Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/?open=quiz#rasschet">{site.cta.calculate}</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${site.phoneRaw}`}>Позвонить</a>
          </Button>
        </div>
      </Container>
    </div>
  );
}
