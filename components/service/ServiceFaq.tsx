'use client';

import { Container } from '@/components/layout/container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FaqItem } from '@/data/service-content';

type Props = {
  title?: string;
  items: FaqItem[];
};

export function ServiceFaq({ title = 'Частые вопросы', items }: Props) {
  if (!items?.length) return null;
  return (
    <section className="py-8 sm:py-10 border-t border-slate-200" id="faq">
      <Container>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <Accordion type="single" collapsible className="mt-4">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
