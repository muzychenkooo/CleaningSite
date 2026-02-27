export type Platform = 'yandex' | 'google' | '2gis' | 'avito' | 'profi';

export interface Review {
  id: string;
  platform: Platform;
  platformLabel: string;
  /** External link to the platform review page */
  platformUrl: string;
  authorName: string;
  /** Two-letter initials for the avatar circle (fallback) */
  initials: string;
  date: string;
  rating: number;
  text: string;
}

export interface PlatformReviewsGroup {
  platformId: Platform;
  platformLabel: string;
  platformIcon: string;
  /** Aggregate rating shown in pills, e.g. 5.0 */
  platformRating: number;
  /** Total review count on this platform */
  platformReviewCount: number;
  /** Listing page with all reviews on this platform */
  platformUrl: string;
  /** Direct link to leave a review on the platform */
  leaveReviewUrl: string;
  color: string;
  bgColor: string;
  reviews: Array<{
    id: string;
    authorName: string;
    date: string;
    rating: number;
    text: string;
  }>;
}

export const reviewsData: PlatformReviewsGroup[] = [
  {
    platformId: 'google',
    platformLabel: 'Google',
    platformIcon: '/assets/platforms/google.svg',
    platformRating: 5.0,
    platformReviewCount: 87,
    platformUrl:
      'https://google.ru/maps/place/%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%B0%D1%8F+%D0%A3%D0%B1%D0%BE%D1%80%D0%BA%D0%B0+%7C+%D0%9A%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D0%BE%D0%B2%D0%B0%D1%8F+%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8F/@55.6088923,37.7787591,17z/data=!4m6!3m5!1s0x414ab1e94a83c8d5:0x1c995507a5ecc417!8m2!3d55.6088893!4d37.781334!16s%2Fg%2F11tcpzr59j?entry=tts&shorturl=1',
    leaveReviewUrl:
      'https://google.ru/maps/place/%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%B0%D1%8F+%D0%A3%D0%B1%D0%BE%D1%80%D0%BA%D0%B0+%7C+%D0%9A%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D0%BE%D0%B2%D0%B0%D1%8F+%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8F/@55.6088923,37.7787591,17z/data=!4m6!3m5!1s0x414ab1e94a83c8d5:0x1c995507a5ecc417!8m2!3d55.6088893!4d37.781334!16s%2Fg%2F11tcpzr59j?entry=tts&shorturl=1',
    color: '#4285F4',
    bgColor: '#eff6ff',
    reviews: [
      {
        id: 'g1',
        authorName: 'Юлия М.',
        date: '3 дек. 2024',
        rating: 5,
        text: 'Заказывала мойку окон в загородном доме: панорамные окна и витраж на лестнице. Приехал мастер с профессиональным оборудованием, отмыл всё без разводов, аккуратно защитил подоконники и пол.',
      },
      {
        id: 'g2',
        authorName: 'Ольга З.',
        date: '21 ноя. 2024',
        rating: 5,
        text: 'Нужно было быстро привести в порядок офис перед встречей с партнёрами. Команда справилась за три часа: стеклянные перегородки, кухня, санузлы — всё блестит. Отдельно понравилось, что уточнили, какие зоны приоритетнее.',
      },
      {
        id: 'g3',
        authorName: 'Ирина П.',
        date: '13 ноя. 2024',
        rating: 5,
        text: 'Обращались за уборкой после съёмщиков. Запах еды, следы от мебели и пятна на ковролине — всё это ушло после работы клинеров. Квартира снова выглядит как новая.',
      },
      {
        id: 'g4',
        authorName: 'Станислав Р.',
        date: '3 сент. 2024',
        rating: 5,
        text: 'Заказываем уборку в шоуруме. Важно, чтобы вещи и образцы тканей оставались в идеальном состоянии. Ребята аккуратно обращаются с товаром, всё складывают на свои места.',
      },
      {
        id: 'g5',
        authorName: 'Анна Л.',
        date: '15 авг. 2024',
        rating: 5,
        text: 'Попросила сделать уборку в день обращения — нашли свободное окно вечером, клинер приехала вовремя, оперативно навела порядок. Спасли перед приездом гостей!',
      },
      {
        id: 'g6',
        authorName: 'Михаил В.',
        date: '2 июл. 2024',
        rating: 5,
        text: 'Делали послеремонтную уборку в двушке. Пыль после сверления, цементная крошка, разводы от шпаклёвки — убрали абсолютно всё. Въехали в квартиру уже готовую, даже запах ремонта ушёл.',
      },
    ],
  },
  {
    platformId: 'yandex',
    platformLabel: 'Яндекс',
    platformIcon: '/assets/platforms/yandex.svg',
    platformRating: 4.9,
    platformReviewCount: 60,
    platformUrl:
      'https://yandex.com/profile/161532445525?intent=reviews&utm_source=qr&utm_medium=qr_image&utm_campaign=v1',
    leaveReviewUrl:
      'https://yandex.com/profile/161532445525?intent=reviews',
    color: '#FC3F1D',
    bgColor: '#fef2f2',
    reviews: [
      {
        id: 'y1',
        authorName: 'Марина К.',
        date: '14 янв. 2025',
        rating: 5,
        text: 'Заказывала генеральную уборку трёхкомнатной квартиры после ремонта. Команда из трёх человек справилась за несколько часов: убрали строительную пыль, вымыли плитку и сантехнику, аккуратно протёрли всю мебель.',
      },
      {
        id: 'y2',
        authorName: 'Алина В.',
        date: '29 дек. 2024',
        rating: 5,
        text: 'Нужно было подготовить квартиру к показам покупателям. Ребята отмыли окна, кухню и санузлы так, что квартира стала заметно светлее. Покупатели несколько раз отметили чистоту.',
      },
      {
        id: 'y3',
        authorName: 'Оксана Р.',
        date: '5 дек. 2024',
        rating: 5,
        text: 'Периодически заказываю поддерживающую уборку. Каждый раз приезжают вовремя, бережно относятся к вещам и технике. Нравится, что всегда уточняют, какие зоны приоритетнее сегодня.',
      },
      {
        id: 'y4',
        authorName: 'Семья Ивановых',
        date: '18 ноя. 2024',
        rating: 5,
        text: 'После переезда просто не оставалось сил убираться. Команда «Большой уборки» сама всё организовала: убрали упаковочный мусор, вымыли полы и окна. Сэкономили нам целые выходные.',
      },
      {
        id: 'y5',
        authorName: 'Екатерина Л.',
        date: '3 ноя. 2024',
        rating: 5,
        text: 'Просила сделать уборку перед приездом родителей. Учли все просьбы: аккуратно протёрли антикварную мебель, почистили ковры, освежили шторы. Родители думали, что мы сами всё делали несколько дней подряд.',
      },
      {
        id: 'y6',
        authorName: 'Павел Г.',
        date: '14 окт. 2024',
        rating: 5,
        text: 'Заказывали химчистку дивана и двух кресел. Мастер сначала нанёс состав на маленький участок, убедился, что ткань не реагирует, и только потом начал работу. Пятна ушли полностью.',
      },
    ],
  },
  {
    platformId: '2gis',
    platformLabel: '2ГИС',
    platformIcon: '/assets/platforms/2gis.svg',
    platformRating: 4.9,
    platformReviewCount: 44,
    platformUrl:
      'https://2gis.ru/moscow/inside/4504235282784871/firm/70000001062699761/tab/reviews?m=37.788281%2C55.609149%2F15.29',
    leaveReviewUrl:
      'https://2gis.ru/moscow/inside/4504235282784871/firm/70000001062699761/tab/reviews?m=37.788281%2C55.609149%2F15.29',
    color: '#29B24A',
    bgColor: '#f0fdf4',
    reviews: [
      {
        id: 'd1',
        authorName: 'Kara T',
        date: '3 дек. 2024',
        rating: 5,
        text: 'Заказывали генеральную уборку коттеджа перед приездом гостей. Команда из двух девушек — Катя и Жанна — очень внимательно отнеслась к кухонным поверхностям, даже почистили ручки шкафчиков, которые обычно остаются без внимания. Остались очень довольны!',
      },
      {
        id: 'd2',
        authorName: 'Марина',
        date: '21 ноя. 2024',
        rating: 5,
        text: 'Фантастическая уборка! Мы заказывали уборку квартиры, и результат превзошёл все наши ожидания. Команда навела чистоту во всём доме, особенно впечатлило внимание к деталям на кухне и в ванных комнатах.',
      },
      {
        id: 'd3',
        authorName: 'Yulia Yulia',
        date: '13 ноя. 2024',
        rating: 5,
        text: 'Заказывали уборку в квартире, и остались очень довольны! Команда клининговой компании работала быстро и качественно. Все поверхности блестят, а запах свежести наполнил дом. Особенно порадовала тщательность в работе.',
      },
      {
        id: 'd4',
        authorName: 'Владимир Иванов',
        date: '3 сент. 2024',
        rating: 5,
        text: 'Отличные клининговые услуги! Заказывали уборку коттеджа — результат превзошел ожидания: всё помещение сияло чистотой, особо поразила тщательность в мягкой мебели и окнах. Очень понравилось быстрое реагирование и пунктуальность.',
      },
      {
        id: 'd5',
        authorName: 'Игорь С.',
        date: '14 окт. 2024',
        rating: 5,
        text: 'После корпоративного мероприятия заказали срочную уборку. Клинеры спокойно разобрали горы посуды, мусора и конфетти, отмыли полы и санузлы. Утром сотрудники пришли в уже чистый офис.',
      },
      {
        id: 'd6',
        authorName: 'Виктория Ж.',
        date: '5 сент. 2024',
        rating: 5,
        text: 'Очень удобно, что можно заказать уборку на раннее утро, до открытия магазина. Ребята всегда приезжают вовремя, не опаздывают и не затягивают процесс. Магазин открывается в идеальной чистоте.',
      },
    ],
  },
  {
    platformId: 'avito',
    platformLabel: 'Авито',
    platformIcon: '/assets/platforms/avito.svg',
    platformRating: 5.0,
    platformReviewCount: 46,
    platformUrl:
      'https://www.avito.ru/brands/i238669707/all/predlozheniya_uslug?sellerId=cc0c6151ce991c44f0bd7cb4cee1ebd4',
    leaveReviewUrl:
      'https://www.avito.ru/brands/i238669707/all/predlozheniya_uslug?sellerId=cc0c6151ce991c44f0bd7cb4cee1ebd4',
    color: '#065FF3',
    bgColor: '#eff6ff',
    reviews: [
      {
        id: 'a1',
        authorName: 'Покупатель',
        date: 'февраль 2025',
        rating: 5,
        text: 'Ребята очень оперативно взялись за сложный заказ и также оперативно выполнили все заявленные работы. Была уборка на 600 кв.м. в условиях монтажа, где постоянно ещё ходили люди. Сделали очень качественно, быстро, и главное с удовольствием! Ребята очень любят то, чем занимаются.',
      },
      {
        id: 'a2',
        authorName: 'Покупатель',
        date: 'февраль 2025',
        rating: 5,
        text: 'У нас переезд и только дошли руки отзыв написать! Благодаря этим ребятам мы меньше чем за полдня заселились в идеально убранный дом. Спасибо что моментально отреагировали, собрали хорошую команду и в короткий срок сделали из дома конфетку!',
      },
      {
        id: 'a3',
        authorName: 'Покупатель',
        date: 'январь 2025',
        rating: 5,
        text: 'Цену озвучили сразу, по итогу ничего не изменилось, все чётко. Приехали на следующий день после заявки. Клинер приехал вовремя, весь фронт работ выполнен, квартира сияет. Ценник адекватный, значительно ниже, чем у распиаренных компаний.',
      },
      {
        id: 'a4',
        authorName: 'Покупатель',
        date: 'декабрь 2024',
        rating: 5,
        text: 'Команда — ураган! Знают своё дело. Работают быстро. Приехали 5 человек полностью со своим инструментом и средствами. Отмыли все поверхности, включая внутренние части шкафов. Холодильники выдвинули и помыли со всех сторон. Стены и шторы отпарили!',
      },
      {
        id: 'a5',
        authorName: 'Покупатель',
        date: 'декабрь 2024',
        rating: 5,
        text: 'Рекомендую обращаться. Девушки щепетильно и тщательно произвели уборку — не надо было стоять над душой и показывать где и как. Всё о чём договаривались выполнили профессионально.',
      },
      {
        id: 'a6',
        authorName: 'Покупатель',
        date: 'ноябрь 2024',
        rating: 5,
        text: 'Сделали очень качественную уборку после нашего ремонта. Чисто, аккуратно, каждый угол убран, не придраться. Рады, что обратились — сделано всё быстро и недорого.',
      },
    ],
  },
  {
    platformId: 'profi',
    platformLabel: 'Profi.ru',
    platformIcon: '/assets/platforms/profi.png',
    platformRating: 4.9,
    platformReviewCount: 44,
    platformUrl: 'https://profi.ru/profile/AlmayevSV/#reviews-tab',
    leaveReviewUrl: 'https://profi.ru/profile/AlmayevSV/#reviews-tab',
    color: '#6929C4',
    bgColor: '#f5f3ff',
    reviews: [
      {
        id: 'p1',
        authorName: 'Николай Ф.',
        date: '11 февраля 2025',
        rating: 5,
        text: 'Заказывали химчистку дивана и ковра. Мастер подробно рассказал, какие составы будет использовать, провёл тест на незаметном участке. Пятна ушли, ткань не пострадала, запаха химии почти нет.',
      },
      {
        id: 'p2',
        authorName: 'Константин Б.',
        date: '21 января 2025',
        rating: 5,
        text: 'Компания ведёт у нас регулярную уборку офиса. Все сотрудники отмечают, что стало намного чище и приятнее работать. Никаких пропусков, всё по согласованному графику.',
      },
      {
        id: 'p3',
        authorName: 'Алёна Ч.',
        date: '29 декабря 2024',
        rating: 5,
        text: 'Обратилась через Profi для разовой уборки после праздника в частном доме. Менеджер уточнил все детали, а клинер приехала уже с полным пониманием фронта работ. Навели порядок быстро и без лишних вопросов.',
      },
      {
        id: 'p4',
        authorName: 'Сергей и Мария',
        date: '15 декабря 2024',
        rating: 5,
        text: 'Нужен был клинер на выходные, чтобы разгрузить нас по дому. Специалиста подобрали под наши задачи, учли наличие маленького ребёнка и домашних животных. Работают аккуратно, безопасные средства.',
      },
      {
        id: 'p5',
        authorName: 'Владимир К.',
        date: '3 ноября 2024',
        rating: 5,
        text: 'После первой уборки сразу договорились о регулярном графике. Видно, что компания настроена на долгосрочное сотрудничество: быстро реагируют на просьбы и замечания, помогают подобрать удобное время.',
      },
      {
        id: 'p6',
        authorName: 'Юлия Т.',
        date: '20 октября 2024',
        rating: 5,
        text: 'Генеральная уборка в магазине после ремонта прошла успешно. Предварительно на адрес приехал менеджер, всё рассказал, произвёл замеры и дал окончательную стоимость. Только здесь предложили бесплатный выезд менеджера.',
      },
    ],
  },
];

export interface PlatformConfig {
  label: string;
  rating: number;
  reviewCount: number;
  reviewUrl: string;
  leaveReviewUrl: string;
  color: string;
  bgColor: string;
  icon: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = reviewsData.reduce(
  (acc, group) => {
    acc[group.platformId] = {
      label: group.platformLabel,
      rating: group.platformRating,
      reviewCount: group.platformReviewCount,
      reviewUrl: group.platformUrl,
      leaveReviewUrl: group.leaveReviewUrl,
      color: group.color,
      bgColor: group.bgColor,
      icon: group.platformIcon,
    };
    return acc;
  },
  {} as Record<Platform, PlatformConfig>,
);

function initialsFromName(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const reviews: Review[] = reviewsData.flatMap((group) =>
  group.reviews.map((r) => ({
    id: r.id,
    platform: group.platformId,
    platformLabel: group.platformLabel,
    platformUrl: group.platformUrl,
    authorName: r.authorName,
    initials: initialsFromName(r.authorName),
    date: r.date,
    rating: r.rating,
    text: r.text,
  })),
);
