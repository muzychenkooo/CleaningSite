'use client';

import * as React from 'react';
import { Container } from '@/components/layout/container';
import { faqItems } from '@/data/faq';
import { cn } from '@/lib/utils';

export function FAQSection() {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <section id="faq" className="w-full py-16 sm:py-24 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Ответы на частые вопросы
        </h2>
        <div className="mt-10 max-w-3xl">
          <div className="w-full">
            {faqItems.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-4 py-5 text-left font-medium text-slate-900 transition-colors hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg -mx-1 px-1',
                    )}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}`}
                    id={`faq-trigger-${item.id}`}
                  >
                    <span className="min-w-0 flex-1 text-base">{item.question}</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={cn('shrink-0 transition-transform duration-200 motion-reduce:transition-none', isOpen && 'rotate-180')}
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    id={`faq-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    aria-hidden={!isOpen}
                    className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-5 pt-0 text-slate-600 leading-relaxed">{item.answer}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
