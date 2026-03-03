import { Container } from '@/components/layout/container';
import { steps } from '@/data/trust';

export function StepsSection() {
  return (
    <section id="nasha-rabota" className="w-full py-16 sm:py-24 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Три шага к чистоте
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
                  {step.id}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              </div>
              <p className="mt-3 pl-[52px] text-slate-600 text-sm leading-relaxed">
                {step.id === '1' ? (
                  <>
                    Оставьте заявку на клининговые услуги компании «Большая Уборка», работающей в Москве и
                    Московской области в нашей{' '}
                    <a href="#contact-questions" className="font-semibold italic text-base hover:text-primary-800">
                      форме
                    </a>
                    ,{' '}
                    <a href="#rasschet" className="font-semibold italic text-base hover:text-primary-800">
                      коротком расчёте
                    </a>{' '}
                    или{' '}
                    <a href="#zayavka" className="font-semibold italic text-base hover:text-primary-800">
                      полноценном калькуляторе
                    </a>
                    . Менеджер уточнит детали, рассчитает подробнее стоимость и подберёт удобное время выезда
                    бригады.
                  </>
                ) : (
                  step.description
                )}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
