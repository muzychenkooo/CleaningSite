import Link from 'next/link';
import { site } from '@/data/site';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { assetUrl } from '@/lib/asset-url';

const HERO_BANNER_PATH = '/assets/banner/hero-banner.png';

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden text-white hero-full bg-[#0b1b3a]">
      {/* Фоновое изображение: мобильная и планшет — cover без пустых мест; ПК — отдельный блок */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-no-repeat bg-center lg:hidden"
        style={{ backgroundImage: `url(${assetUrl(HERO_BANNER_PATH)})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-no-repeat hidden lg:block"
        style={{
          backgroundImage: `url(${assetUrl(HERO_BANNER_PATH)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right 12%',
        }}
      />
      {/* Затемнение: сильнее слева (для текста), слабее справа (женщина остаётся видимой) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.1) 70%, transparent 100%)',
        }}
      />
      <Container className="relative flex items-center justify-center pt-6 pb-10 sm:py-24 lg:py-32 lg:justify-start">
        <div className="max-w-4xl w-full text-center lg:text-left">
          <h1 className="font-display text-3xl font-bold uppercase tracking-[0.22em] text-primary-200/95 sm:text-4xl animate-fade-in [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
            КЛИНИНГОВАЯ КОМПАНИЯ
          </h1>
          <h2 className="font-display mt-3 sm:mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight animate-slide-up text-balance leading-[1.1] [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
            БОЛЬШАЯ УБОРКА
          </h2>
          <p className="mt-3 sm:mt-6 text-lg sm:text-2xl text-slate-200 leading-relaxed max-w-3xl lg:max-w-xl lg:mx-0 mx-auto text-balance [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
            Профессиональная уборка. Для частных лиц и организаций. В Москве и Московской области.
          </p>
          <div className="mt-6 sm:mt-12 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-xl shadow-black/20 hover:shadow-2xl active:scale-[0.98] transition-all duration-200 motion-reduce:transform-none rounded-xl px-5 sm:px-8 h-11 sm:h-12 min-w-[140px] sm:min-w-[240px]"
            >
              <Link href="/#contact-questions">{site.cta.callback}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/50 text-white hover:bg-white/15 hover:border-white/70 rounded-xl px-5 sm:px-8 h-11 sm:h-12 min-w-[140px] sm:min-w-[240px] transition-all duration-200 motion-reduce:transition-none"
            >
              <Link href="/#zayavka">{site.cta.calculate}</Link>
            </Button>
          </div>
          <div className="mt-6 sm:mt-12 mb-6 sm:mb-8 text-sm sm:text-base text-slate-100/90">
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" aria-hidden />
                <span>Живые отзывы 4.9</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                <span>Физические и юридические лица</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-4">
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
