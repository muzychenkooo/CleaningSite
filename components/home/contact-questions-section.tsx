'use client';

import { Container } from '@/components/layout/container';
import { OrderForm } from '@/components/forms/order-form';
import { SocialIconLinks } from '@/components/ui/social-icon-links';
import { site } from '@/data/site';

/**
 * Short “Остались вопросы?” block разбит на две колонки:
 * слева — форма, справа — соцсети и email.
 */
export function ContactQuestionsSection() {
  return (
    <section id="contact-questions" className="w-full py-16 sm:py-24 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Бесплатная консультация
        </h2>

        <div className="mt-2 grid gap-10 lg:grid-cols-2 items-start">
          {/* Левая колонка — подзаголовок на уровне правого текста, затем форма */}
          <div className="max-w-xl">
            <p className="text-slate-600">
              Укажите имя и номер телефона. Наш менеджер свяжется с вами!
            </p>
            <div className="mt-8">
              <OrderForm compact submitLabel="Связаться" formName="contact" />
            </div>
          </div>

          {/* Правая колонка — подзаголовок на уровне левого, иконки по центру, почта */}
          <div className="min-w-0 max-w-md lg:max-w-none">
            <p className="text-slate-600 whitespace-normal lg:whitespace-nowrap">
              А также можете связаться с нами через удобный вам мессенджер:
            </p>
            <div className="mt-8 lg:mt-[3.75rem] flex justify-center min-w-0 w-full">
              <SocialIconLinks variant="buttons" className="w-full min-w-0" />
            </div>
            <p className="mt-8 text-slate-600 lg:mt-4">
              Или по почте:{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline"
              >
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
