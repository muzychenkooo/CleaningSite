import { Container } from '@/components/layout/container';
import { PriceCalculator } from '@/components/forms/price-calculator';

export function CalculatorSection() {
  return (
    <section id="rasschet" className="w-full py-16 sm:py-24 scroll-mt-24 bg-slate-50">
      <Container className="flex flex-col">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Расчёт стоимости
        </h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Ориентировочная стоимость. Точную цену озвучит менеджер после уточнения деталей.
        </p>
        <div className="mt-10 w-full min-w-0 max-w-4xl">
          <PriceCalculator />
        </div>
      </Container>
    </section>
  );
}
