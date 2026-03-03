import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: `Политика конфиденциальности и правовая информация ${site.name}.`,
  openGraph: {
    title: 'Политика конфиденциальности | ' + site.name,
    url: `${baseUrl}/privacy/`,
    locale: 'ru_RU',
  },
  alternates: { canonical: `${baseUrl}/privacy/` },
};

export default function PrivacyPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }]} />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Политика конфиденциальности
        </h1>
        <div className="mt-8 max-w-3xl space-y-4 text-slate-600">
          <p>
            Использование сайта {site.name} означает согласие с изложенными здесь условиями.
            Компания осуществляет деятельность в соответствии с законодательством Российской Федерации.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-slate-900">Обработка персональных данных</h2>
          <p>
            Мы обрабатываем персональные данные (имя, телефон, email, адрес) только в целях связи с вами, расчёта стоимости и оказания услуг. Данные не передаём третьим лицам без вашего согласия и не используем для рассылок без подписки.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-slate-900">Условия оказания услуг</h2>
          <p>
            Стоимость услуг согласовывается до начала работ. Оплата производится по завершении уборки после проверки качества заказчиком.
            Мы принимаем наличные, банковские карты и переводы на расчётный счёт. Для юридических лиц предусмотрено заключение договора.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-slate-900">Ответственность</h2>
          <p>
            Компания несёт полную ответственность за имущество заказчика во время проведения уборки.
            Работы выполняют сотрудники с необходимым опытом и документами. Техника безопасности на объектах соблюдается.
          </p>
          <h2 id="cookies" className="mt-8 text-xl font-semibold text-slate-900">Файлы cookie</h2>
          <p>
            Сайт может использовать файлы cookie для корректной работы и аналитики. Управлять cookie можно в настройках вашего браузера:
          </p>
          <ul className="list-inside list-disc space-y-1 text-slate-600">
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Chrome</a>
            </li>
            <li>
              <a href="https://support.mozilla.org/ru/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Mozilla Firefox</a>
            </li>
            <li>
              <a href="https://support.apple.com/ru-ru/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Safari</a>
            </li>
            <li>
              <a href="https://support.microsoft.com/ru-ru/microsoft-edge/удаление-файлов-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Microsoft Edge</a>
            </li>
          </ul>
          <h2 className="mt-8 text-xl font-semibold text-slate-900">Контакты</h2>
          <p>
            По вопросам сотрудничества и претензиям: {site.phone}, {site.email}.
          </p>
        </div>
        <p className="mt-10">
          <Link href="/contacts/" className="text-primary-600 hover:underline">
            Контакты
          </Link>
        </p>
      </Container>
    </div>
  );
}
