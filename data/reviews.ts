export type Platform = 'yandex' | 'google' | '2gis' | 'avito' | 'profi';

export interface Review {
  id: string;
  platform: Platform;
  platformLabel: string;
  /** External link to the platform review page */
  platformUrl: string;
  authorName: string;
  /** Two-letter initials for the avatar circle */
  initials: string;
  date: string;
  rating: number;
  text: string;
}

export const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; rating: number; reviewUrl: string; leaveReviewUrl: string; color: string; bgColor: string }
> = {
  yandex: {
    label: 'Яндекс',
    rating: 5.0,
    reviewUrl:
      'https://yandex.com/profile/161532445525?intent=reviews&utm_source=qr&utm_medium=qr_image&utm_campaign=v1',
    leaveReviewUrl:
      'https://yandex.com/profile/161532445525?intent=reviews',
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
  google: {
    label: 'Google',
    rating: 5.0,
    reviewUrl:
      'https://google.ru/maps/place/%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%B0%D1%8F+%D0%A3%D0%B1%D0%BE%D1%80%D0%BA%D0%B0+%7C+%D0%9A%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D0%BE%D0%B2%D0%B0%D1%8F+%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8F/@55.6088923,37.7787591,17z/data=!4m6!3m5!1s0x414ab1e94a83c8d5:0x1c995507a5ecc417!8m2!3d55.6088893!4d37.781334!16s%2Fg%2F11tcpzr59j?entry=tts&shorturl=1',
    leaveReviewUrl:
      'https://google.ru/maps/place/%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%B0%D1%8F+%D0%A3%D0%B1%D0%BE%D1%80%D0%BA%D0%B0+%7C+%D0%9A%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D0%BE%D0%B2%D0%B0%D1%8F+%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8F/@55.6088923,37.7787591,17z/data=!4m6!3m5!1s0x414ab1e94a83c8d5:0x1c995507a5ecc417!8m2!3d55.6088893!4d37.781334!16s%2Fg%2F11tcpzr59j?entry=tts&shorturl=1',
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
  '2gis': {
    label: '2ГИС',
    rating: 5.0,
    reviewUrl:
      'https://2gis.ru/moscow/inside/4504235282784871/firm/70000001062699761/tab/reviews?m=37.788281%2C55.609149%2F15.29',
    leaveReviewUrl:
      'https://2gis.ru/moscow/inside/4504235282784871/firm/70000001062699761/tab/reviews?m=37.788281%2C55.609149%2F15.29',
    color: '#22c55e',
    bgColor: '#f0fdf4',
  },
  avito: {
    label: 'Авито',
    rating: 5.0,
    reviewUrl:
      'https://www.avito.ru/brands/i238669707/all/predlozheniya_uslug?sellerId=cc0c6151ce991c44f0bd7cb4cee1ebd4',
    leaveReviewUrl:
      'https://www.avito.ru/brands/i238669707/all/predlozheniya_uslug?sellerId=cc0c6151ce991c44f0bd7cb4cee1ebd4',
    color: '#06b6d4',
    bgColor: '#ecfeff',
  },
  profi: {
    label: 'Profi.ru',
    rating: 5.0,
    reviewUrl: 'https://profi.ru/profile/AlmayevSV/#reviews-tab',
    leaveReviewUrl: 'https://profi.ru/profile/AlmayevSV/#reviews-tab',
    color: '#f97316',
    bgColor: '#fff7ed',
  },
};

export const reviews: Review[] = [
  {
    id: '1',
    platform: 'yandex',
    platformLabel: 'Яндекс',
    platformUrl: PLATFORM_CONFIG.yandex.reviewUrl,
    authorName: 'Марина К.',
    initials: 'МК',
    date: '14 января 2026',
    rating: 5,
    text: 'Заказывала генеральную уборку трёхкомнатной квартиры после ремонта. Команда из трёх человек справилась за 5 часов — убрали пыль со всех поверхностей, отмыли окна изнутри, вычистили плитку в ванной и кухне до блеска. Отдельное спасибо за аккуратность с новой мебелью. Результат превзошёл ожидания, буду обращаться регулярно.',
  },
  {
    id: '2',
    platform: '2gis',
    platformLabel: '2ГИС',
    platformUrl: PLATFORM_CONFIG['2gis'].reviewUrl,
    authorName: 'Дмитрий Орлов',
    initials: 'ДО',
    date: '29 января 2026',
    rating: 5,
    text: 'Обратились за уборкой офиса (около 200 м²). Приехали вовремя, всё сделали чётко: вымыли полы, протёрли столы и технику, почистили санузлы. Договор, акт выполненных работ — всё по-взрослому. Работали в вечернее время, не мешали сотрудникам. Продолжаем сотрудничество.',
  },
  {
    id: '3',
    platform: 'avito',
    platformLabel: 'Авито',
    platformUrl: PLATFORM_CONFIG.avito.reviewUrl,
    authorName: 'Светлана В.',
    initials: 'СВ',
    date: '5 февраля 2026',
    rating: 5,
    text: 'Нашла компанию в интернете, решила попробовать поддерживающую уборку. Клинер Анастасия пришла строго в оговорённое время, быстро и аккуратно всё убрала. Приятно, что она спросила, как обращаться с кожаным диваном — не стала чистить абы чем. Вернула нам подарочную карту на следующий заказ.',
  },
  {
    id: '4',
    platform: 'profi',
    platformLabel: 'Profi.ru',
    platformUrl: PLATFORM_CONFIG.profi.reviewUrl,
    authorName: 'Николай Ф.',
    initials: 'НФ',
    date: '11 февраля 2026',
    rating: 5,
    text: 'Делали химчистку дивана и двух кресел. Специалист приехал с профессиональным оборудованием, объяснил, какие средства будет использовать. Через 4 часа мебель стала выглядеть как новая — пятно от кофе, которое я считал вечным, исчезло полностью. Цена полностью соответствует качеству.',
  },
  {
    id: '5',
    platform: 'google',
    platformLabel: 'Google',
    platformUrl: PLATFORM_CONFIG.google.reviewUrl,
    authorName: 'Юлия Морозова',
    initials: 'ЮМ',
    date: '18 февраля 2026',
    rating: 5,
    text: 'Заказывала мойку окон — 12 штук в доме плюс лоджия. Мастер приехал с собственной телескопической щёткой и моющим раствором, справился за два часа. Окна кристально чистые, без разводов. Давно не видела такого результата. Цена за окно вполне адекватная, рекомендую.',
  },
  {
    id: '6',
    platform: 'yandex',
    platformLabel: 'Яндекс',
    platformUrl: PLATFORM_CONFIG.yandex.reviewUrl,
    authorName: 'Алина и Павел',
    initials: 'АП',
    date: '3 марта 2026',
    rating: 5,
    text: 'Обратились перед новосельем — квартира стояла пустой несколько месяцев после сдачи дома. Пришли два человека, работали слаженно: убрали строительный мусор с подоконников, вымыли шкафы внутри, оттёрли краску со стёкол, продезинфицировали санузел. Въехали в идеально чистую квартиру.',
  },
  {
    id: '7',
    platform: 'avito',
    platformLabel: 'Авито',
    platformUrl: PLATFORM_CONFIG.avito.reviewUrl,
    authorName: 'Татьяна Воронова',
    initials: 'ТВ',
    date: '7 марта 2026',
    rating: 5,
    text: 'Брала услугу озонирования после того, как в квартире долго стоял запах сырости. Специалист объяснил весь процесс, провёл обработку, оставил помещение проветриться. На следующее утро запах ушёл полностью. Также посоветовал, как поддерживать результат. Профессиональный и вежливый подход.',
  },
  {
    id: '8',
    platform: '2gis',
    platformLabel: '2ГИС',
    platformUrl: PLATFORM_CONFIG['2gis'].reviewUrl,
    authorName: 'Игорь С.',
    initials: 'ИС',
    date: '14 марта 2026',
    rating: 5,
    text: 'Нужна была срочная уборка на следующее утро после вечеринки. Оформил заявку поздно вечером — менеджер перезвонил через 10 минут, согласовали время и объём. Клинер пришла в 9 утра, за 3 часа навела полный порядок: вымыла полы, убрала посуду, вынесла мусор. Выручили, большое спасибо.',
  },
  {
    id: '9',
    platform: 'profi',
    platformLabel: 'Profi.ru',
    platformUrl: PLATFORM_CONFIG.profi.reviewUrl,
    authorName: 'Константин Быков',
    initials: 'КБ',
    date: '21 марта 2026',
    rating: 5,
    text: 'Регулярная уборка офиса каждые две недели. Команда приходит без напоминаний, всегда в назначенное время. За полгода ни разу не было замечания по качеству. Очень рекомендую как надёжного подрядчика для корпоративных клиентов.',
  },
  {
    id: '10',
    platform: 'google',
    platformLabel: 'Google',
    platformUrl: PLATFORM_CONFIG.google.reviewUrl,
    authorName: 'Ольга Захарова',
    initials: 'ОЗ',
    date: '28 марта 2026',
    rating: 5,
    text: 'Заказала уборку перед важным мероприятием в нашем офисе. Команда из четырёх человек за три часа привела в порядок 300 м², включая конференц-зал и кухню. Всё сверкало. Гости были приятно удивлены. Оперативность и результат на высшем уровне.',
  },
];
