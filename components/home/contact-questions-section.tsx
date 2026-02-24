'use client';

import { Container } from '@/components/layout/container';
import { OrderForm } from '@/components/forms/order-form';

/**
 * Short “Остались вопросы?” block: title, subtitle, only Имя + Телефон + “Связаться”.
 * Placed immediately after FAQ on the homepage.
 */
export function ContactQuestionsSection() {
  return (
    <section className="w-full py-16 sm:py-24 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Остались вопросы?
        </h2>
        <p className="mt-2 text-slate-600">
          Оставьте свои контакты и наш менеджер свяжется с вами!
        </p>
        <div className="mt-8 max-w-xl">
          <OrderForm compact submitLabel="Связаться" formName="contact" />
        </div>
      </Container>
    </section>
  );
}
