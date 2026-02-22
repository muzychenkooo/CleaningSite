import { Container } from '@/components/layout/container';
import { VideoWithOverlay } from '@/components/ui/VideoWithOverlay';
import { assetUrl } from '@/lib/asset-url';

export function AboutSection() {
  return (
    <section id="o-nas" className="w-full py-16 sm:py-24 scroll-mt-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text column */}
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              О нас
            </h2>
            <p className="mt-6 text-slate-600 leading-relaxed">
              Компания «Большая уборка» — ваш надёжный партнёр в создании чистоты и порядка.
              Мы — команда опытных профессионалов, предлагающая широкий спектр услуг по уборке.
              Наше кредо — качество, надёжность и индивидуальный подход к каждому клиенту.
              Доверьте нам заботу о вашем пространстве, и вы оцените безупречный результат!
            </p>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold">✓</span>
                Работаем в Москве и Московской области
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold">✓</span>
                Профессиональное оборудование и сертифицированная химия
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold">✓</span>
                Гарантия результата — переделаем бесплатно при претензии
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold">✓</span>
                Более 5 лет опыта, сотни довольных клиентов
              </li>
            </ul>
          </div>

          {/* Video column */}
          <VideoWithOverlay
            src={assetUrl('/assets/about/about-video.mp4')}
            poster={assetUrl('/assets/gallery/1000004534.jpg')}
            label="Видео о компании Большая Уборка"
            wrapperClassName="w-full rounded-2xl shadow-lg bg-slate-900"
            videoClassName="w-full h-auto max-h-[480px] object-cover rounded-2xl"
          />
        </div>
      </Container>
    </section>
  );
}
