import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { SocialIconLinks } from '@/components/ui/social-icon-links';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Вакансии',
  description: `Работа в клининговой компании ${site.name}. Вакансия мобильного клинера. Москва и МО. Оформление по СМЗ или ГПХ.`,
  openGraph: {
    title: `Вакансии | ${site.name}`,
    url: `${baseUrl}/vacancies/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/vacancies/` },
};

const duties = [
  'Своевременно прибыть на объект',
  'Выполнить качественную уборку',
  'Отчитываться менеджеру/бригадиру о проделанной работе',
  'Обслуживать клининговое оборудование при необходимости',
  'Подготовить расходные материалы для следующей уборки',
];

const requirements = [
  'Официальные документы для трудоустройства (прописка/регистрация, разрешение на работу)',
  'Опыт в клининге желателен, но не обязателен — всему научим',
  'Наличие автомобиля приветствуется (ГСМ и амортизация оплачиваются дополнительно)',
  'Готовность к физически сложной работе',
  'Возможны работы на высоте (лестницы/стремянки/туры)',
  'Понимание, что объекты не всегда чистые',
  'Умение работать в команде, быть готовым прийти на помощь',
  'Вежливость к заказчику и коллегам',
];

const conditions = [
  'Оформление по СМЗ или договору ГПХ',
  'Ненормированный рабочий день',
  'График и занятость — на ваш выбор (мы не заставляем зарабатывать деньги)',
  'Оборудование, расходники и химия доставляются непосредственно на объект',
  'Своевременная оплата по договорённости (возможны ежедневные выплаты)',
  'Возможность карьерного роста: клинер → бригадир → менеджер',
];

export default function VacanciesPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Вакансии' }]} />

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Работа в Клининговой Компании «Большая Уборка»
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-800">
          Мы ищем надёжного и ответственного исполнителя на вакансию <strong>мобильный клинер</strong>.
        </p>
        <p className="mt-2 max-w-2xl text-slate-600">
          Нам требуются сотрудники для постоянной работы по графику и разовых заказов в удобное время.
        </p>
        {/* Main position card */}
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Мобильный клинер</h2>
          <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500">
            <span>📍 Москва и Московская область</span>
            <span>🕐 Гибкий / ненормированный график</span>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {/* Duties */}
            <div>
              <h3 className="font-semibold text-slate-800">Обязанности</h3>
              <ul className="mt-3 space-y-2">
                {duties.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="font-semibold text-slate-800">Требования</h3>
              <ul className="mt-3 space-y-2">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" aria-hidden />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Conditions */}
            <div>
              <h3 className="font-semibold text-slate-800">Условия</h3>
              <ul className="mt-3 space-y-2">
                {conditions.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-primary-600 shrink-0 leading-tight">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SocialIconLinks size="lg" />
            <a
              href={`tel:${site.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              📞 {site.phone}
            </a>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent('Отклик на вакансию: Мобильный клинер')}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              ✉️ {site.email}
            </a>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Оставьте заявку — мы перезвоним в ближайшее время.
          </p>
        </div>

        {/* Why us */}
        <section className="mt-10 rounded-xl border border-primary-100 bg-primary-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Почему стоит работать у нас</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              'Стабильная загрузка — объектов всегда достаточно',
              'Весь инвентарь, химия и расходники — за счёт компании',
              'Прозрачная оплата — возможны ежедневные выплаты',
              'Гибкий график: работайте в удобное для вас время',
              'Поддержка и обучение с первого дня',
              'Официальное оформление по СМЗ или ГПХ',
              'Карьерный рост: клинер → бригадир → менеджер',
              'Дружный коллектив, помогаем друг другу',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1 shrink-0 text-primary-600">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact block */}
        <section className="mt-10" id="feedback">
          <h2 className="text-xl font-semibold text-slate-900">Связаться по вопросам трудоустройства</h2>
          <p className="mt-2 text-slate-600">
            Позвоните или напишите — расскажем подробнее об условиях и запишем на собеседование.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href={`tel:${site.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-primary-600"
            >
              📞 {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-primary-600"
            >
              ✉️ {site.email}
            </a>
            <SocialIconLinks size="md" />
          </div>
        </section>
      </Container>
    </div>
  );
}
