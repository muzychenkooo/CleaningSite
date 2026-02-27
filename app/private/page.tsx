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

function IconApartment() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M4 20V9.5L12 4l8 5.5V20M9 20v-6h6v6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHouse() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M5 20V11.5L12 6l7 5.5V20M9 20v-4.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 15.5V20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWindows() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <rect
        x={5}
        y={4}
        width={14}
        height={16}
        rx={1.5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
      />
      <path
        d="M12 4v16M8 8l1-1M15 10l1-1M10 13l.8-.8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDryCleaning() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M8 7a4 4 0 0 1 8 0M7 8h10l1.5 9a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2L7 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.5c.5.5 1 .75 2 .75s1.5-.25 2-.75"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconOzone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <circle cx={8} cy={12} r={3.2} fill="none" stroke="currentColor" strokeWidth={1.7} />
      <circle cx={16} cy={8} r={2.7} fill="none" stroke="currentColor" strokeWidth={1.7} />
      <circle cx={16} cy={16} r={2.7} fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path
        d="M10.6 10.7 14 9.3M10.6 13.3 14 14.7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconOdor() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M9 5c.8 1 .8 2.4 0 3.4-.8 1-.8 2.4 0 3.4M13 5c.8 1 .8 2.4 0 3.4-.8 1-.8 2.4 0 3.4M7 16c1 .8 2.5 1.2 4.5 1.2S15 16.8 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDisinfection() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M12 3 6 5.5V12c0 3.5 2.5 6.7 6 7.5 3.5-.8 6-4 6-7.5V5.5L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12H12m2.5 0H12m0 0V9.5m0 2.5V14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

const privateIconByHref: Record<string, JSX.Element> = {
  '/private/apartment/': <IconApartment />,
  '/private/house/': <IconHouse />,
  '/private/window-wash/': <IconWindows />,
  '/private/dry-cleaning/': <IconDryCleaning />,
  '/services/ozonation/': <IconOzone />,
  '/services/odor-removal/': <IconOdor />,
  '/services/disinfection/': <IconDisinfection />,
};

export default function PrivateLandingPage() {
  const links = privateNav.filter((item) => item.href !== '/private/');
  return (
    <div className="py-8 sm:py-16">
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
                <CardContent className="pt-6 flex-1 flex items-center justify-between gap-4">
                  <CardTitle className="text-lg">{item.label}</CardTitle>
                  {privateIconByHref[item.href] && (
                    <span className="inline-flex items-center justify-center text-slate-700 pr-1">
                      {privateIconByHref[item.href]}
                    </span>
                  )}
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
