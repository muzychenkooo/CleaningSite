import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'О компании',
  description: `О клининговой компании ${site.name}: команда, оборудование, подход к работе.`,
  openGraph: {
    title: 'О компании | ' + site.name,
    url: `${baseUrl}/about/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/about/` },
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'О компании' }]} />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          О компании
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          {site.name} — профессиональная клининговая компания. Работаем с частными клиентами и организациями в Москве и Московской области.
        </p>
        <div className="mt-10 space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">О компании</h2>
            <p className="mt-2 text-slate-600">
              Мы предлагаем полный спектр клининговых услуг: уборка квартир и домов, офисов, помещений после ремонта, мойка окон, химчистка, дезинфекция. Используем безопасные средства и современное оборудование. Оплата по факту после проверки качества.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">Клинеры (команда)</h2>
            <p className="mt-2 text-slate-600">
              В нашей команде — опытные клинеры с необходимыми навыками и документами. Обучение и контроль качества обеспечивают стабильный результат.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">Оборудование</h2>
            <p className="mt-2 text-slate-600">
              Используем профессиональную технику и сертифицированные средства. Это позволяет выполнять уборку быстрее и качественнее.
            </p>
          </section>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/contacts/"
            className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700"
          >
            Контакты
          </Link>
          <a
            href={`tel:${site.phoneRaw}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {site.phone}
          </a>
        </div>
      </Container>
    </div>
  );
}
