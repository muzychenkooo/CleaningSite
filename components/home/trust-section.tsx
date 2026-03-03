import { Container } from '@/components/layout/container';
import { advantages } from '@/data/trust';

export function TrustSection() {
  return (
    <section id="otlichaemsya" className="w-full py-16 sm:py-24 bg-slate-50 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Почему клиенты выбирают нас
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl text-lg">
          Мы совмещаем аккуратный клининг с понятными условиями и поддержкой как для частных клиентов, так и
          для бизнеса. Уборка квартир, домов, офисов и складов проходит прозрачно, в оговорённые сроки и без
          лишних забот для вас.
        </p>
        <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-7 sm:py-7 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 motion-reduce:translate-y-0"
            >
              <h3 className="font-display text-lg font-semibold text-slate-900 leading-snug">{a.title}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-slate-600 max-w-3xl">
          Каждый заказ сопровождается внутренним контролем качества и понятными договорённостями: при
          необходимости оперативно дорабатываем уборку и фиксируем условия в договоре и актах. Так вы
          получаете предсказуемый результат и партнёра по клинингу, на которого можно опереться надолго.
        </p>
        <p className="mt-4 text-sm font-medium text-primary-700">
          Мы заботимся о наших клиентах и всегда готовы ответить на интересующие вас вопросы.{` `}
          <a
            href="#promo-form"
            className="font-semibold italic text-base hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 rounded-sm"
          >
            Оставьте свои контактные данные в форме ниже
          </a>
          , а мы подберём формат уборки и подготовим персональное предложение для вашего дома или офиса.
        </p>
      </Container>
    </section>
  );
}
