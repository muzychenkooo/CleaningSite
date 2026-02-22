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
    <div className="py-12 sm:py-20">
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
