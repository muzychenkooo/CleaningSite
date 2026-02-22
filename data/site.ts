import { mainNav, businessNav } from './sitemap';

export const site = {
  name: 'Большая Уборка',
  tagline: 'Клининговая компания',
  description: 'Профессиональная уборка для частных лиц и организаций. Москва и Московская область.',
  phone: '+7 (995) 797-99-96',
  phoneDisplay: '8 (995) 797-99-96',
  phoneRaw: '79957979996',
  email: 'biguborka@yandex.ru',
  schedule: 'Круглосуточно',
  region: 'Москва и Московская область',
  social: {
    whatsapp: 'https://wa.me/79957979996',
    vk: '#',
    telegram: '#',
  },
  nav: {
    individuals: [
      { label: 'Квартира', href: '/private/apartment/' },
      { label: 'Дом/коттедж', href: '/private/house/' },
      { label: 'Мойка окон', href: '/private/window-wash/' },
      { label: 'Химчистка', href: '/private/dry-cleaning/' },
      { label: 'Озонирование', href: '/services/ozonation/' },
      { label: 'Удаление запахов', href: '/services/odor-removal/' },
      { label: 'Дезинфекция', href: '/services/disinfection/' },
    ],
    business: businessNav,
    main: mainNav,
  },
  cta: {
    order: 'Заказать уборку',
    callback: 'Обратный звонок',
    calculate: 'Рассчитать стоимость',
    calculateShort: 'Рассчитать цену',
  },
  legal: {
    companyName: 'Большая Уборка',
    rights: 'Все права защищены',
  },
  reviewsUrl: 'https://ya.cc/t/71V-jNw93TQofZ',
  /** Reference site (parity); do not remove. */
  referenceUrl: 'https://bigyborka.ru/',
  /** Competitor inspiration (patterns only); do not remove. */
  competitorUrls: [
    'https://cleanline-spb.ru/',
    'https://cleacom.ru/',
    'https://cleanbros.ru/spb/',
    'https://cleaning-bc.ru/',
    'https://myeasyclean.ru/',
  ] as const,
} as const;
