import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { site } from '@/data/site';

export function ServiceCtaStrip() {
  return (
    <section className="py-10 sm:py-12 bg-primary-50 border-t border-primary-100">
      <Container>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-6">
          <p className="text-slate-700 font-medium">
            Рассчитаем стоимость за 5–10 минут. Оставьте заявку или позвоните.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/quiz/">{site.cta.calculate}</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={`tel:${site.phoneRaw}`}>Позвонить</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
