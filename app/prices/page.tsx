import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Цены',
  description: 'Стоимость уборки квартир, офисов, мойки окон. Москва и МО.',
  openGraph: {
    title: 'Цены | ' + site.name,
    url: `${baseUrl}/prices/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/prices/` },
};

const priceItems = [
  {
    title: 'Уборка квартиры',
    subtitle: 'Поддерживающая / генеральная / после ремонта',
    prices: [
      { label: 'Поддерживающая (до 50 м²)', value: 'от 2 500 ₽' },
      { label: 'Генеральная (до 50 м²)', value: 'от 4 500 ₽' },
      { label: 'После ремонта (до 50 м²)', value: 'от 6 000 ₽' },
    ],
    href: '/private/apartment/',
  },
  {
    title: 'Уборка дома / коттеджа',
    subtitle: 'Любой тип уборки, включая придомовую территорию',
    prices: [
      { label: 'Поддерживающая (до 100 м²)', value: 'от 5 000 ₽' },
      { label: 'Генеральная (до 100 м²)', value: 'от 9 000 ₽' },
      { label: 'После ремонта (до 100 м²)', value: 'от 12 000 ₽' },
    ],
    href: '/private/house/',
  },
  {
    title: 'Мойка окон',
    subtitle: 'Стандартные и высотные работы',
    prices: [
      { label: 'Одна створка (стандартная)', value: 'от 350 ₽' },
      { label: 'Балконный блок', value: 'от 800 ₽' },
      { label: 'Альпинистская мойка', value: 'по запросу' },
    ],
    href: '/private/window-wash/',
  },
  {
    title: 'Химчистка',
    subtitle: 'Мебель, ковры, шторы, спальные места',
    prices: [
      { label: 'Диван (2-местный)', value: 'от 2 000 ₽' },
      { label: 'Кресло', value: 'от 800 ₽' },
      { label: 'Ковёр (1 м²)', value: 'от 200 ₽' },
      { label: 'Матрас (односпальный)', value: 'от 1 500 ₽' },
    ],
    href: '/private/dry-cleaning/',
  },
  {
    title: 'Уборка офиса',
    subtitle: 'Ежедневная, еженедельная, разовая',
    prices: [
      { label: 'Разовая (до 100 м²)', value: 'от 3 500 ₽' },
      { label: 'Регулярная — месяц (до 100 м²)', value: 'от 12 000 ₽' },
    ],
    href: '/business/office/',
  },
  {
    title: 'Озонирование / удаление запахов',
    subtitle: 'Квартиры, офисы, автомобили',
    prices: [
      { label: 'До 30 м²', value: 'от 1 500 ₽' },
      { label: 'До 60 м²', value: 'от 2 500 ₽' },
    ],
    href: '/services/ozonation/',
  },
];

export default function PricesPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Цены' }]} />

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Цены на уборку
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Ориентировочная стоимость услуг. Точная цена рассчитывается индивидуально — зависит от площади, типа уборки и дополнительных работ.
        </p>

        {/* Pricing cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {priceItems.map((item) => (
            <div
              key={item.href}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {item.prices.map((p) => (
                  <li key={p.label} className="flex items-baseline justify-between gap-2">
                    <span className="text-sm text-slate-600">{p.label}</span>
                    <span className="shrink-0 font-semibold text-primary-700">{p.value}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={item.href}
                className="mt-5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
              >
                Подробнее об услуге →
              </Link>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
          Указанные цены носят ориентировочный характер. Итоговая стоимость рассчитывается после уточнения деталей: площади помещения, степени загрязнения, количества комнат и перечня дополнительных услуг.
          Узнать точную цену — по телефону{' '}
          <a href={`tel:${site.phoneRaw}`} className="font-medium text-primary-600 hover:underline">
            {site.phone}
          </a>{' '}
          или через калькулятор.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/quiz/">{site.cta.calculate}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={`tel:${site.phoneRaw}`}>Позвонить для расчёта</a>
          </Button>
        </div>
      </Container>
    </div>
  );
}
