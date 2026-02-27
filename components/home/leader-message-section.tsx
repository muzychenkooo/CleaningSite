import { Container } from '@/components/layout/container';

export function LeaderMessageSection() {
  return (
    <section
      id="obrashchenie-rukovoditelya"
      className="w-full py-16 sm:py-24 scroll-mt-20 bg-white"
    >
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Обращение руководителя
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12 items-start">
          {/* Плейсхолдер под фото: золотая середина по размеру */}
          <div
            className="relative w-full aspect-[3/4] max-w-[200px] sm:max-w-[260px] lg:max-w-sm mx-auto lg:mx-0 rounded-2xl bg-slate-200 flex items-center justify-center"
            aria-hidden
          >
            <span className="text-slate-400 text-sm">Фото</span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6 sm:p-8">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide">
              Руководитель
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              Станислав
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Дорогие друзья, приветствую Вас!
            </p>
            <div className="mt-4 space-y-4 text-slate-600 leading-relaxed">
              <p>
                Я руководитель компании по клинингу и профессиональной уборке.
                Для нас важны качество услуг, честность и забота о клиенте. Мы
                делаем генеральную уборку квартир и офисов, поддерживающую
                уборку и уборку после ремонта — и стремимся, чтобы каждая
                уборка приносила вам комфорт и порядок.
              </p>
              <p>
                Наша цель — не просто оказать услугу, а создать в вашем
                пространстве атмосферу чистоты и уюта. Мы всегда стремимся к
                лучшему результату в каждом заказе.
              </p>
              <p>
                Когда вы возвращаетесь в чистый дом или заходите в убранный
                офис — это не мелочь. Это то, ради чего мы и выходим на работу
                каждый день.
              </p>
              <p>
                Пишите, звоните. Будем рады помочь и стать вашими людьми по
                чистоте.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
