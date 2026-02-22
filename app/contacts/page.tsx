import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { OrderForm } from '@/components/forms/order-form';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Контакты',
  description: `Связаться с ${site.name}: ${site.phone}, ${site.email}. ${site.schedule}. Москва и Московская область.`,
  openGraph: {
    title: `Контакты | ${site.name}`,
    description: `Связаться с ${site.name}: ${site.phone}, ${site.email}. ${site.schedule}.`,
    url: `${baseUrl}/contacts/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/contacts/` },
};

export default function ContactsPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]} />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Контакты
        </h1>
        <p className="mt-2 text-slate-600">
          Свяжитесь с нами любым удобным способом. Работаем {site.schedule.toLowerCase()}.
        </p>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Телефон</h2>
            <a href={`tel:${site.phoneRaw}`} className="mt-1 block text-primary-600 font-medium hover:underline">
              {site.phone}
            </a>
            <p className="mt-4 text-sm text-slate-500">{site.schedule}</p>
            <h2 className="mt-8 text-lg font-semibold text-slate-900">Email</h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-2">
              <a href={`mailto:${site.email}`} className="text-primary-600 hover:underline">
                {site.email}
              </a>
              <span className="text-sm text-slate-500">— приоритетный канал связи</span>
            </div>
            <h2 className="mt-8 text-lg font-semibold text-slate-900">Мессенджеры</h2>
            <ul className="mt-2 flex flex-wrap gap-4">
              <li>
                <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={site.social.vk} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  VK
                </a>
              </li>
              <li>
                <a href={site.social.telegram} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  Telegram
                </a>
              </li>
            </ul>
            <p className="mt-6 text-slate-600">{site.region}</p>
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-slate-900">Реквизиты</h2>
              <p className="mt-2 text-slate-600">
                Реквизиты компании для договоров и актов можно запросить по телефону или email.
              </p>
            </section>
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Сотрудничество</h2>
              <p className="mt-2 text-slate-600">
                Для юридических лиц: договор, счёт, акты. Обсудим условия по {site.phone} или {site.email}.
              </p>
            </section>
          </div>
          <div id="feedback" className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 scroll-mt-24">
            <h2 className="text-lg font-semibold text-slate-900">Обратная связь</h2>
            <p className="mt-1 text-sm text-slate-600">
              Оставьте имя и телефон — перезвоним в удобное время.
            </p>
            <div className="mt-6">
              <OrderForm compact />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
