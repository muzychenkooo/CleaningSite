import Link from 'next/link';
import { site } from '@/data/site';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { assetUrl } from '@/lib/asset-url';

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden hero-gradient text-white hero-full">
      {/* Фоновое изображение с прозрачностью поверх градиента */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage: `url(${assetUrl('/assets/gallery/1000004534.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Container className="relative flex items-center justify-center py-20 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-3xl font-bold uppercase tracking-[0.22em] text-primary-200/95 sm:text-4xl animate-fade-in">
            КЛИНИНГОВАЯ КОМПАНИЯ
          </h1>
          <h2 className="font-display mt-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-slide-up text-balance leading-[1.1]">
            БОЛЬШАЯ УБОРКА
          </h2>
          <p className="mt-6 text-xl sm:text-2xl text-slate-200 leading-relaxed max-w-3xl mx-auto text-balance">
            Профессиональная уборка. Для частных лиц и организаций. В Москве и Московской области.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-xl shadow-black/20 hover:shadow-2xl active:scale-[0.98] transition-all duration-200 motion-reduce:transform-none rounded-xl px-8 h-12 min-w-[240px]"
            >
              <Link href="/#zayavka">{site.cta.callback}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/50 text-white hover:bg-white/15 hover:border-white/70 rounded-xl px-8 h-12 min-w-[240px] transition-all duration-200 motion-reduce:transition-none"
            >
              <Link href="/?open=quiz#rasschet">{site.cta.calculate}</Link>
            </Button>
          </div>
          <div className="mt-12 mb-8 hidden text-sm sm:block sm:text-base text-slate-100/90">
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-indigo-300" aria-hidden />
                <span>2000+ довольных клиентов</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400" aria-hidden />
                <span>{site.schedule}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                <span>Физические и юридические лица</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
