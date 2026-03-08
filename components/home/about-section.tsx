import { Container } from '@/components/layout/container';
import { VideoWithOverlay } from '@/components/ui/VideoWithOverlay';
import { assetUrl } from '@/lib/asset-url';

/** Card border/shadow tokens aligned with "Почему клиенты выбирают нас" and "Наши услуги". */
const CARD_CLASS =
  'rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 overflow-hidden';

export function AboutSection() {
  return (
    <section id="o-nas" className="w-full py-16 sm:py-24 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          О компании «Большая Уборка»
        </h2>

        <div className="mt-8 grid gap-5 sm:gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Left: text card — SEO-оптимизированный текст, равный по визуальному весу с видео */}
          <div className={`flex min-h-0 flex-col ${CARD_CLASS} p-5 sm:p-6 lg:p-7`}>
            <p className="text-slate-600 leading-relaxed">
              Клининговая компания «Большая Уборка» работает в Москве и Московской области. У нас можно заказать клининг помещений любого размера и типа, генеральную уборку и уборку после ремонта, мойку окон и фасадов, а также химчистку мебели — с выездом на объект и расчётом стоимости.
            </p>
            <ul className="mt-5 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold shrink-0">✓</span>
                Клининг для частных лиц и организаций: квартиры, коттеджи, офисы, склады в Москве и МО
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold shrink-0">✓</span>
                Профессиональное оборудование и безопасная химия, контроль качества уборки
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold shrink-0">✓</span>
                Более 8 лет на рынке клининга, чек-листы и договор с юрлицами по запросу
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold shrink-0">✓</span>
                Гибкий график выезда и подбор бригады под площадь и тип объекта
              </li>
            </ul>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Подбор клинеров, проверка результата и фиксация договорённостей. Для организаций — договор, акты и чек по запросу.
            </p>
          </div>

          {/* Right: square video без рамки; на мобильной — меньше, остаётся квадрат */}
          <div className="flex min-h-0 items-center justify-center p-4 sm:p-5">
            <div className="aspect-square w-full max-w-[280px] overflow-hidden rounded-xl bg-slate-900 sm:max-w-[380px] lg:max-w-[460px]">
              <VideoWithOverlay
                src={assetUrl('/assets/about/about-video.mp4')}
                poster={assetUrl('/assets/about/about-video-poster.png')}
                label="Видео о компании Большая Уборка"
                wrapperClassName="h-full w-full"
                videoClassName="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
