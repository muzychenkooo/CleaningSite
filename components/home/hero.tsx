import Link from 'next/link';
import { site } from '@/data/site';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden hero-gradient text-white">
      <Container className="relative py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-primary-300/95 sm:text-3xl animate-fade-in">
            КЛИНИНГОВАЯ КОМПАНИЯ
          </h1>
          <h2 className="font-display mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-slide-up text-balance leading-[1.15]">
            БОЛЬШАЯ УБОРКА
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto text-balance">
            Профессиональная уборка. Для частных лиц и организаций. В Москве и Московской области.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-xl shadow-black/20 hover:shadow-2xl active:scale-[0.98] transition-all duration-200 motion-reduce:transform-none rounded-xl px-8 h-12"
            >
              <Link href="/#zayavka">{site.cta.callback}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/50 text-white hover:bg-white/15 hover:border-white/70 rounded-xl px-8 h-12 transition-all duration-200 motion-reduce:transition-none"
            >
              <Link href="/?open=quiz#rasschet">{site.cta.calculate}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
