'use client';

import { Container } from '@/components/layout/container';
import { OrderForm } from '@/components/forms/order-form';

export function ContactCtaSection() {
  return (
    <section className="w-full py-16 sm:py-24 bg-slate-50">
      <Container>
        <div className="max-w-xl">
          <h2 id="zayavka" className="font-display text-3xl font-bold text-slate-900 scroll-mt-24">
            Остались вопросы?
          </h2>
          <p className="mt-2 text-slate-600">
            Оставьте свои контакты и наш менеджер свяжется с вами!
          </p>
          <div className="mt-8">
            <OrderForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
