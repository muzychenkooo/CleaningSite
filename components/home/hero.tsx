import Link from 'next/link';
import { site } from '@/data/site';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

/** Пузырьки: left %, размер (px), длительность (s), задержка (s). */
const BUBBLES = [
  [5, 38, 22, 0],
  [14, 30, 20, 2.2],
  [24, 42, 24, 4],
  [32, 34, 21, 1],
  [40, 50, 23, 5],
  [48, 28, 19, 3],
  [56, 42, 25, 0.6],
  [64, 36, 21, 2.8],
  [72, 50, 20, 4.6],
  [80, 32, 24, 1.4],
  [88, 40, 22, 3.2],
  [10, 44, 23, 5.2],
  [20, 30, 18, 1.2],
  [52, 38, 22, 3.4],
  [76, 42, 20, 0.4],
  [38, 48, 24, 4.4],
  [8, 34, 21, 2.4],
  [92, 32, 19, 4.4],
  [46, 42, 23, 0.9],
  [66, 36, 20, 3.6],
  [26, 40, 22, 1.6],
  [58, 44, 25, 5.4],
  [16, 38, 19, 2.6],
  [84, 46, 21, 0.3],
  [34, 32, 23, 4.8],
] as const;

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden hero-gradient text-white hero-full">
      {/* Анимация пузырьков вместо фонового изображения */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {BUBBLES.map(([left, size, duration, delay], i) => (
          <div
            key={i}
            className="hero-bubble absolute rounded-full"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              bottom: '-8%',
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
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
              <Link href="/#contact-questions">{site.cta.callback}</Link>
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
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" aria-hidden />
                <span>Живые отзывы 4.9</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                <span>Физические и юридические лица</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400" aria-hidden />
                <span>Любые помещения</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-indigo-300" aria-hidden />
                <span>Опыт более 8 лет</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
