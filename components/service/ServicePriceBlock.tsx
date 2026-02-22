import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { site } from '@/data/site';
import type { FaqItem } from '@/data/service-content';

type Props = {
  priceFrom: string;
  priceNote?: string;
  priceFaq?: FaqItem[];
};

export function ServicePriceBlock({ priceFrom, priceNote, priceFaq }: Props) {
  return (
    <section className="py-8 sm:py-10 bg-slate-50/50 border-t border-slate-200">
      <Container>
        <h2 className="text-xl font-semibold text-slate-900">Сколько стоит</h2>
        <p className="mt-3 text-slate-700">
          <span className="font-medium">Цена от:</span> {priceFrom}
        </p>
        {priceNote && (
          <p className="mt-2 text-sm text-slate-600">{priceNote}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/quiz/">{site.cta.calculate}</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${site.phoneRaw}`}>Позвонить для расчёта</a>
          </Button>
        </div>
        {priceFaq && priceFaq.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-slate-900">Частые вопросы про цену</h3>
            <Accordion type="single" collapsible className="mt-3">
              {priceFaq.map((item, i) => (
                <AccordionItem key={i} value={`price-faq-${i}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </Container>
    </section>
  );
}
