import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { site } from '@/data/site';
import { privateNav } from '@/data/sitemap';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Услуги для частных лиц',
  description: 'Уборка квартир, домов, мойка окон, химчистка, озонирование. Москва и МО.',
  openGraph: {
    title: 'Частным клиентам | ' + site.name,
    url: `${baseUrl}/private/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/private/` },
};

export default function PrivateLandingPage() {
  const links = privateNav.filter((item) => item.href !== '/private/');
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Частным клиентам' }]} />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Услуги для частных лиц
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Профессиональная уборка квартир, домов и коттеджей, мойка окон, химчистка и дополнительные услуги. Москва и Московская область.
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => (
            <li key={item.href}>
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex-1">
                  <CardTitle className="text-lg">{item.label}</CardTitle>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href={item.href}>Подробнее</Link>
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
