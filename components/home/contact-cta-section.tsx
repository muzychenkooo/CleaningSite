'use client';

import { Container } from '@/components/layout/container';
import { DetailedCalculator } from '@/components/calculator/DetailedCalculator';

export function ContactCtaSection() {
  return (
    <section className="w-full py-16 sm:py-24 bg-slate-50">
      <Container>
        <h2 id="zayavka" className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl scroll-mt-24">
          Подробный калькулятор
        </h2>
        <p className="mt-2 w-full text-slate-600">
          Ответьте на вопросы и получите ориентировочную цену, а затем мы с вами свяжемся.
        </p>
        <div className="mt-8 mx-auto max-w-5xl">
          <DetailedCalculator />
        </div>
      </Container>
    </section>
  );
}
