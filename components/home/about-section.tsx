import { Container } from '@/components/layout/container';
import { VideoWithOverlay } from '@/components/ui/VideoWithOverlay';
import { assetUrl } from '@/lib/asset-url';

export function AboutSection() {
  return (
    <section id="o-nas" className="w-full py-16 sm:py-24 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          О компании «Большая уборка»
        </h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <p className="text-slate-600 leading-relaxed">
              «Большая уборка» — клининговая компания в Москве и Московской области, которая берёт на себя
              заботу о чистоте квартир, домов, офисов и коммерческих помещений. Мы организуем профессиональную
              уборку под вашу задачу: от поддерживающей до генеральной и послеремонтной, с мойкой
              окон и химчисткой мебели.
            </p>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold">✓</span>
                Работаем с частными клиентами и организациями: квартиры, коттеджи, офисы, склады и торговые помещения
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold">✓</span>
                Профессиональное оборудование и безопасная, сертифицированная химия
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold">✓</span>
                Более 8 лет в клининге, отлаженные чек-листы и стандарты уборки
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold">✓</span>
                Разовая, генеральная уборка и клининг после ремонта по Москве и Московской области
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary-600 font-bold">✓</span>
                Гибкий график выезда и подбор команды под конкретный объект
              </li>
            </ul>
            <p className="mt-6 text-slate-600 leading-relaxed">
              Мы внимательно подбираем сотрудников, контролируем качество каждой уборки и фиксируем договорённости
              документально. Для юридических лиц заключаем договор, по запросу предоставляем чек и необходимые акты.
            </p>
          </div>

          <VideoWithOverlay
            src={assetUrl('/assets/about/about-video.mp4')}
            poster={assetUrl('/assets/gallery/1000004534.jpg')}
            label="Видео о компании Большая Уборка"
            wrapperClassName="w-full max-w-2xl mx-auto aspect-video rounded-2xl shadow-lg bg-slate-900"
            videoClassName="w-full h-full rounded-2xl object-contain"
          />
        </div>
        <p className="mt-10 text-sm font-medium text-primary-700">
          Пройдите{' '}
          <a href="#rasschet" className="font-semibold italic text-base hover:text-primary-800">
            короткий расчёт ориентировочной стоимости
          </a>{' '}
          или воспользуйтесь{' '}
          <a href="#zayavka" className="font-semibold italic text-base hover:text-primary-800">
            калькулятором
          </a>{' '}
          внизу страницы — подберём формат уборки и рассчитаем стоимость именно под ваш объект. Для уточнения
          информации и дальнейших вопросов с вами свяжется наш менеджер.
        </p>
      </Container>
    </section>
  );
}
