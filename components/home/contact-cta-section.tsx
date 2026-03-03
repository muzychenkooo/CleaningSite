'use client';

import { Container } from '@/components/layout/container';
import { DetailedCalculator } from '@/components/calculator/DetailedCalculator';

export function ContactCtaSection() {
  return (
    <section className="w-full py-16 sm:py-24 bg-slate-50">
      <Container>
        <h2 id="zayavka" className="font-display text-3xl font-bold text-slate-900 scroll-mt-24">
          Подробный калькулятор
        </h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Для вашего удобства мы создали подробный калькулятор. Ответьте на вопросы и получите максимально приближенную к реальности цену, а затем мы с вами свяжемся и договоримся о встрече.
        </p>
        <div className="mt-8 max-w-3xl">
          <DetailedCalculator />
        </div>
      </Container>
    </section>
  );
}
