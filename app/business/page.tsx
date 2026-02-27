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

function IconOffice() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M5 20V6.5L11.5 4 19 6.5V20M8.5 20v-4h3v4m3-4h3M7 12h3m-3-3h3m4 3h3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWarehouse() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M4 20V10l8-4 8 4v10M8 20v-5h3v5m5 0v-5h3v5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 15h4M13.5 15h4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFacade() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <rect
        x={5}
        y={4}
        width={10}
        height={16}
        rx={1.5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
      />
      <path
        d="M9 8h2m-2 3h2m-2 3h2M17 6v12l2-1.5 2 1.5V6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGear() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M4 18.5V11l3.5-2 2 2 2-2 2 2 2-2L20 11v7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 18.5V14h3v4.5m3-2.5h3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 7.5h3.5m5 0H18"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconWindowsClimbing() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <rect
        x={5}
        y={3.5}
        width={10}
        height={17}
        rx={1.4}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
      />
      <path
        d="M8 7.5l1-1m3 2 1-1m-3 4 .8-.8M17 6.5l2 4-2 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M5 20V7l6-3 8 4v12M9 20v-4h3v4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10h2m3 1h2m-7 3h2m3 0h2"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconStore() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M4 10.5 5.5 5h13L20 10.5M5 10.5h14V19H5V10.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 14h3v3H9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCafe() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M5 7h11v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7Zm11 2h1.5A2.5 2.5 0 0 1 20 11.5 2.5 2.5 0 0 1 17.5 14H16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 18.5h9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconParking() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <rect
        x={5}
        y={4}
        width={14}
        height={16}
        rx={2}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
      />
      <path
        d="M10 16V8h3a2 2 0 0 1 0 4h-3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWater() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M12 5.5 8.5 10A4.5 4.5 0 1 0 15.5 10L12 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSchool() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M4 10 12 6l8 4-8 4-8-4Zm2 3v4.5L12 19l6-1.5V13"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClinic() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <rect
        x={5}
        y={4}
        width={14}
        height={16}
        rx={2}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
      />
      <path
        d="M12 8v4m0 0H9m3 0h3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M5 16.5 6.2 11h11.6L19 16.5M6.5 16.5V18m11-1.5V18M8 18h8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={8} cy={16.5} r={1} fill="currentColor" />
      <circle cx={16} cy={16.5} r={1} fill="currentColor" />
    </svg>
  );
}

function IconMall() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M4 20V9l4-2 4 2 4-2 4 2v11M8 20v-5h3v5m4-5h3v5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFitness() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M6 9v6m12-6v6M9 8v8m6-8v8M4 11h2m12 0h2M4 13h2m12 0h2"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHotel() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M5 20V6.5L11.5 5 18 6.5V20M7.5 11h3m3 0h3M7.5 14h3m3 0h3M7 20v-3.5h10V20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
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

function IconScissors() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <circle cx={6.5} cy={16.5} r={1.7} fill="none" stroke="currentColor" strokeWidth={1.5} />
      <circle cx={17.5} cy={16.5} r={1.7} fill="none" stroke="currentColor" strokeWidth={1.5} />
      <path
        d="M7.7 15 12 9l5-3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.3 15 12 9 7 6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconColumns() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M4 9 12 5l8 4M5.5 9.5v8M9.5 8v9.5M14.5 8v9.5M18.5 9.5v8M4 19h16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <path
        d="M12 4.5 13.9 9l4.6.4-3.5 2.9 1 4.6L12 14.8 7.9 16.9l1-4.6-3.5-2.9L10.3 9 12 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconOther() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
      <circle cx={7} cy={12} r={1.4} fill="currentColor" />
      <circle cx={12} cy={12} r={1.4} fill="currentColor" />
      <circle cx={17} cy={12} r={1.4} fill="currentColor" />
    </svg>
  );
}

const businessIconBySlug: Record<string, JSX.Element> = {
  office: <IconOffice />,
  warehouse: <IconWarehouse />,
  facades: <IconFacade />,
  production: <IconGear />,
  'windows-climbing': <IconWindowsClimbing />,
  'residential-complex': <IconBuilding />,
  store: <IconStore />,
  cafe: <IconCafe />,
  parking: <IconParking />,
  'pool-fountain': <IconWater />,
  school: <IconSchool />,
  clinic: <IconClinic />,
  'car-service': <IconCar />,
  mall: <IconMall />,
  fitness: <IconFitness />,
  hotel: <IconHotel />,
  'dry-cleaning': <IconDryCleaning />,
  'odor-removal': <IconOdor />,
  ozonation: <IconOzone />,
  disinfection: <IconDisinfection />,
  salon: <IconScissors />,
  administrative: <IconColumns />,
  entertainment: <IconStar />,
  other: <IconOther />,
};

export default function BusinessLandingPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Для бизнеса' }]} />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Услуги для бизнеса
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Профессиональный клининг офисов, складов, торговых и производственных помещений, фасадов, парковок. Разовые уборки.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {businessTypes.map((t) => (
            <li key={t.slug}>
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex-1 flex items-center justify-between gap-4">
                  <CardTitle className="text-base">{t.label}</CardTitle>
                  {businessIconBySlug[t.slug] && (
                    <span className="inline-flex items-center justify-center text-slate-700 pr-1">
                      {businessIconBySlug[t.slug]}
                    </span>
                  )}
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
