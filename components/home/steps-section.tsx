'use client';

import { Container } from '@/components/layout/container';
import { steps } from '@/data/trust';
import { useEffect, useRef, useState } from 'react';

export function StepsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offsets, setOffsets] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onScroll = () => {
      if (prefersReducedMotion) {
        setOffsets([0, 0, 0]);
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      const sectionCenter = rect.top + rect.height / 2;
      const progress = Math.max(0, Math.min(1, 1 - (sectionCenter - viewportHeight / 2) / viewportHeight));
      setOffsets(
        [0, 1, 2].map((i) => {
          const factor = (2 - i) * 12;
          return factor * (1 - progress);
        })
      );
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="nasha-rabota"
      ref={sectionRef}
      className="w-full py-16 sm:py-24 scroll-mt-20"
    >
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Три шага к чистоте
        </h2>
        <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="transition-transform duration-200 ease-out"
              style={{
                transform: `translateY(${offsets[index] ?? 0}px)`,
              }}
            >
              <div className="relative rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-7 sm:py-7 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 motion-reduce:translate-y-0">
              <span
                className="absolute top-4 right-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm"
                aria-hidden
              >
                {step.id}
              </span>
              <h3 className="font-display text-lg font-semibold text-slate-900 leading-snug pr-12">
                {step.title}
              </h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                {step.id === '1' ? (
                  <>
                    Оставьте заявку в нашей{' '}
                    <a
                      href="#contact-questions"
                      className="text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
                    >
                      форме
                    </a>
                    , коротком расчёте или{' '}
                    <a
                      href="#zayavka"
                      className="text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
                    >
                      подробном калькуляторе
                    </a>
                    . Менеджер уточнит детали, рассчитает точную стоимость и подберёт время выезда бригады.
                  </>
                ) : (
                  step.description
                )}
              </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
