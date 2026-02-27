/**
 * Detailed service content (primary source: Наполнение/Услуги when extracted).
 * Structure aligned with competitor coverage; wording from project/sitemap.
 * No verbatim copy from competitors. Placeholder where PDF content to be added.
 */
import { getBusinessBySlug, businessTypes } from '@/data/sitemap';

export type ProcessStep = { title: string; description: string };
export type FaqItem = { question: string; answer: string };
export type PackageOption = { name: string; description?: string; items: string[] };
export type RelatedLink = { label: string; href: string };

export interface ServiceContent {
  /** H1 + value proposition */
  title: string;
  intro: string;
  /** "Что входит в услугу" */
  included: string[];
  /** Packages (эконом/стандарт/премиум) if applicable */
  packages?: PackageOption[];
  /** "Для кого подходит / когда нужно" — 5–8 scenarios */
  forWhom: string[];
  /** "Как мы работаем" — 4–6 steps */
  process: ProcessStep[];
  /** Price-from or note. No invented numbers. */
  priceFrom: string;
  priceNote?: string;
  /** FAQ about price (what affects cost) */
  priceFaq?: FaqItem[];
  /** Guarantees, contract, safety */
  guarantees: string[];
  /** Equipment and chemicals (4–8 items) */
  equipment: string[];
  /** 6–10 Q/A per service */
  faq: FaqItem[];
  /** "С этим заказывают", cases, reviews, prices */
  relatedLinks: RelatedLink[];
  /** Optional: anchor sections for subtypes (apartment/house/window/dry-cleaning) */
  anchorSections?: { id: string; label: string; content?: string }[];
}

const defaultProcess: ProcessStep[] = [
  { title: 'Заявка', description: 'Оставьте заявку на сайте, по телефону или в мессенджере.' },
  { title: 'Уточнение', description: 'Менеджер уточнит параметры объекта и пожелания.' },
  { title: 'Выезд / расчёт', description: 'При необходимости — бесплатный выезд для осмотра и точной сметы.' },
  { title: 'Выполнение работ', description: 'Приезд бригады в согласованное время, выполнение уборки.' },
  { title: 'Контроль качества', description: 'Проверка результата, при необходимости — доработка.' },
  { title: 'Оплата', description: 'Оплата по факту. Чек, договор — по запросу.' },
];

const defaultGuarantees = [
  'Официальный договор и чек по запросу.',
  'Безопасные средства; при необходимости — эко-химия.',
  'Ответственность за сохранность вещей и качество работ.',
];

const defaultEquipment = [
  'Профессиональные пылесосы',
  'Парогенератор и техника для химчистки',
  'Специализированная бытовая химия',
  'Стеклоочистители и швабры',
  'Расходные материалы (перчатки, салфетки)',
];

const commonRelatedLinks: RelatedLink[] = [
  { label: 'Примеры работ', href: '/cases/' },
  { label: 'Отзывы', href: '/reviews/' },
  { label: 'Цены', href: '/prices/' },
  { label: 'Контакты', href: '/contacts/' },
];

/** Private: Квартира */
export const apartmentContent: ServiceContent = {
  title: 'Уборка квартир',
  intro: 'Профессиональная уборка квартир любой площади: после ремонта, генеральная, поддерживающая, VIP. Гибкий график, безопасные средства, проверенные клинеры. Москва и Московская область.',
  included: [
    'Удаление пыли и загрязнений со всех поверхностей',
    'Мытьё полов и подоконников',
    'Чистка санузла и кухни',
    'Мытьё зеркал и стёкол',
    'Вынос мусора по договорённости',
  ],
  forWhom: [
    'После ремонта или строительства',
    'Генеральная уборка раз в сезон или перед важным событием',
    'Поддерживающая уборка по графику',
    'После потопа, пожара или переезда',
    'До или после аренды',
    'Перед праздником или после мероприятия',
    'Перед рождением ребёнка',
    'Запущенные помещения, после дезинфекции',
  ],
  process: defaultProcess,
  priceFrom: 'уточняйте по телефону',
  priceNote: 'Точный расчёт после уточнения площади, типа уборки и доп. услуг.',
  priceFaq: [
    { question: 'Что влияет на стоимость?', answer: 'Площадь, количество комнат и санузлов, тип уборки (поддерживающая, генеральная, после ремонта), дополнительные услуги (окна, балкон, холодильник и т.д.).' },
    { question: 'Есть ли минимальный заказ?', answer: 'Минимальная сумма заказа уточняется при расчёте в зависимости от объекта и региона.' },
  ],
  guarantees: defaultGuarantees,
  equipment: defaultEquipment,
  faq: [
    { question: 'Нужно ли присутствие во время уборки?', answer: 'По желанию. Можем работать в ваше отсутствие при передаче ключей или доступе.' },
    { question: 'Свои средства привозите?', answer: 'Да. Используем профессиональную химию и инвентарь. При необходимости — эко-средства.' },
    { question: 'Сколько человек приедет?', answer: 'Количество подбираем под объём работ и сроки, обычно 2–4 человека.' },
    { question: 'Уборка после ремонта — что входит?', answer: 'Удаление строительной пыли, мытьё окон, полов, радиаторов, сантехники, кухни. Детали уточняем при заявке.' },
    { question: 'Работаете в выходные?', answer: 'Да. График согласуем под вас.' },
    { question: 'Как быстро можно назначить уборку?', answer: 'В зависимости от загрузки — от того же дня до нескольких дней. Срочные заявки обсуждаем по телефону.' },
  ],
  relatedLinks: [
    { label: 'Дом/коттедж', href: '/private/house/' },
    { label: 'Мойка окон', href: '/private/window-wash/' },
    { label: 'Химчистка', href: '/private/dry-cleaning/' },
    ...commonRelatedLinks,
  ],
  anchorSections: [
    { id: 'posle-remonta', label: 'После ремонта/строительства' },
    { id: 'generalnaya', label: 'Генеральная' },
    { id: 'podderzhivayushchaya', label: 'Поддерживающая' },
    { id: 'vip', label: 'VIP' },
    { id: 'kuhnya-sanuzel', label: 'Кухня/санузел' },
    { id: 'pereezd', label: 'До/после переезда' },
    { id: 'potop', label: 'После потопа' },
    { id: 'pozhar', label: 'После пожара' },
    { id: 'arenda', label: 'До/после аренды' },
    { id: 'dezinfekciya', label: 'После дезинфекции' },
    { id: 'zapushchennye', label: 'Запущенные' },
    { id: 'posle-smerti', label: 'После смерти' },
    { id: 'prazdnik', label: 'Перед праздником' },
    { id: 'meropriyatie', label: 'После мероприятия' },
    { id: 'rozhdenie', label: 'Перед рождением' },
    { id: 'eko', label: 'Эко' },
    { id: 'dop-uslugi', label: 'Дополнительные услуги' },
  ].map((a) => ({ id: a.id, label: a.label })),
};

/** Private: Дом/коттедж */
export const houseContent: ServiceContent = {
  title: 'Уборка домов и коттеджей',
  intro: 'Комплексная уборка частных домов и коттеджей: после ремонта, генеральная, клининг бассейнов и придомовой территории. Москва и Московская область.',
  included: [
    'Уборка всех помещений',
    'Мытьё полов и окон',
    'Чистка санузлов и кухни',
    'При необходимости — придомовая территория',
    'Клининг бассейна/фонтана, мойка брусчатки по запросу',
  ],
  forWhom: [
    'После ремонта или строительства коттеджа',
    'Генеральная и поддерживающая уборка',
    'После аренды или переезда',
    'Перед праздником или после мероприятия',
    'Запущенные дома',
    'Перед рождением ребёнка',
    'Уход за бассейном и фонтаном',
    'Уборка придомовой территории, мойка брусчатки',
  ],
  process: defaultProcess,
  priceFrom: 'уточняйте по телефону',
  priceNote: 'Стоимость зависит от площади, этажности и дополнительных видов работ.',
  guarantees: defaultGuarantees,
  equipment: defaultEquipment,
  faq: [
    { question: 'Работаете в пригороде Москвы и МО?', answer: 'Да. Выезжаем по Москве и Московской области. Точную зону и условия уточняйте по телефону.' },
    { question: 'Можно убрать только бассейн или только территорию?', answer: 'Да. Оказываем отдельные услуги: клининг бассейна, фонтана, мойка брусчатки, уборка территории.' },
    { question: 'Своё оборудование для бассейна нужно?', answer: 'Привозим профессиональное оборудование и химию. Для специфичных систем возможна консультация с вашим обслуживающим персоналом.' },
    { question: 'Как считается площадь дома?', answer: 'По обмеру или по данным заказчика. Точный расчёт — после осмотра или по фото/планировке.' },
  ],
  relatedLinks: [
    { label: 'Квартира', href: '/private/apartment/' },
    { label: 'Мойка окон', href: '/private/window-wash/' },
    { label: 'Химчистка', href: '/private/dry-cleaning/' },
    ...commonRelatedLinks,
  ],
  anchorSections: [
    { id: 'posle-remonta', label: 'После ремонта/строительства' },
    { id: 'generalnaya', label: 'Генеральная' },
    { id: 'podderzhivayushchaya', label: 'Поддерживающая' },
    { id: 'vip', label: 'VIP' },
    { id: 'arenda', label: 'После аренды' },
    { id: 'pereezd', label: 'После переезда' },
    { id: 'prazdnik', label: 'Перед праздником' },
    { id: 'meropriyatie', label: 'После мероприятия' },
    { id: 'zapushchennye', label: 'Запущенные' },
    { id: 'rozhdenie', label: 'Перед рождением' },
    { id: 'eko', label: 'Эко' },
    { id: 'bassejn', label: 'Клининг бассейна' },
    { id: 'fontan', label: 'Клининг фонтана' },
    { id: 'territoriya', label: 'Уборка придомовой территории' },
    { id: 'bruschatka', label: 'Мойка брусчатки' },
    { id: 'dop-uslugi', label: 'Дополнительные услуги' },
  ].map((a) => ({ id: a.id, label: a.label })),
};

/** Private: Мойка окон */
export const windowWashContent: ServiceContent = {
  title: 'Мойка окон',
  intro: 'Профессиональная мойка окон: сезонная, после ремонта, с привлечением промышленных альпинистов для высотных работ. Москва и Московская область.',
  included: [
    'Мытьё стёкол с двух сторон',
    'Очистка рам и подоконников',
    'Удаление строительной пыли и следов',
  ],
  forWhom: [
    'Сезонная мойка (весна/осень)',
    'После ремонта (строительная пыль и следы)',
    'Высотные работы (альпинисты)',
    'Перед праздниками и важными событиями',
  ],
  process: defaultProcess,
  priceFrom: 'уточняйте по телефону',
  priceNote: 'Зависит от количества створок, этажа и необходимости альпинистов.',
  guarantees: defaultGuarantees,
  equipment: [
    'Стеклоочистители и скребки',
    'Профессиональная химия для стёкол',
    'Телескопические швабры',
    'Страховка и снаряжение для альпинистов (при высотных работах)',
  ],
  faq: [
    { question: 'Моете с двух сторон?', answer: 'Да. Стёкла моем с внутренней и внешней стороны, если доступ с улицы возможен или привлекаются альпинисты.' },
    { question: 'Работаете на высоте?', answer: 'Да. Для высотных работ привлекаем промышленных альпинистов с допусками и страховкой.' },
    { question: 'Нужно ли освобождать подоконники?', answer: 'Желательно убрать хрупкие и ценные предметы. Крупную мебель при необходимости отодвинем по возможности.' },
  ],
  relatedLinks: [
    { label: 'Квартира', href: '/private/apartment/' },
    { label: 'Дом/коттедж', href: '/private/house/' },
    { label: 'Окна/альпинизм (бизнес)', href: '/business/windows-climbing/' },
    ...commonRelatedLinks,
  ],
  anchorSections: [
    { id: 'seasonal', label: 'Сезонная' },
    { id: 'posle-remonta', label: 'После ремонта' },
    { id: 'alpinisty', label: 'Альпинистами' },
  ].map((a) => ({ id: a.id, label: a.label })),
};

/** Private: Химчистка */
export const dryCleaningContent: ServiceContent = {
  title: 'Химчистка',
  intro: 'Химчистка мягкой мебели, ковровых покрытий, штор и спального места. Профессиональное оборудование и средства. Москва и Московская область.',
  included: [
    'Чистка мягкой мебели (диваны, кресла)',
    'Химчистка ковров и ковролина',
    'Чистка штор и тюля',
    'Обработка спального места (матрас, диван-кровать)',
  ],
  forWhom: [
    'Обновление вида мебели и ковров',
    'После затопления или загрязнений',
    'Удаление запахов и пятен',
    'Перед переездом или сдачей квартиры',
    'Уход за дорогой мебелью',
  ],
  process: defaultProcess,
  priceFrom: 'уточняйте по телефону',
  priceNote: 'Стоимость зависит от вида изделия, площади и степени загрязнения.',
  guarantees: defaultGuarantees,
  equipment: [
    'Профессиональные экстракторы и парогенераторы',
    'Средства для химчистки тканей и ковров',
    'Щётки и насадки под разные поверхности',
  ],
  faq: [
    { question: 'Химчистка на дому или вы забираете?', answer: 'Работаем на объекте: мебель и ковры чистим на месте. Ковры при необходимости можем забрать на производство — уточняйте по телефону.' },
    { question: 'Не повредится обивка?', answer: 'Используем щадящие режимы и проверенные средства. Перед обработкой при необходимости делаем тест на незаметном участке.' },
    { question: 'Сколько сохнет после химчистки?', answer: 'Зависит от типа изделия и погоды. Обычно 4–12 часов. Точные рекомендации дадим после осмотра.' },
  ],
  relatedLinks: [
    { label: 'Квартира', href: '/private/apartment/' },
    { label: 'Удаление запахов', href: '/services/odor-removal/' },
    { label: 'Озонирование', href: '/services/ozonation/' },
    ...commonRelatedLinks,
  ],
  anchorSections: [
    { id: 'mebel', label: 'Мебели' },
    { id: 'kovry', label: 'Ковровых покрытий' },
    { id: 'spalnoe', label: 'Спального места' },
    { id: 'shtory', label: 'Штор' },
  ].map((a) => ({ id: a.id, label: a.label })),
};

/** Services: Озонирование */
export const ozonationContent: ServiceContent = {
  title: 'Озонирование',
  intro: 'Озонирование помещений: эффективная дезинфекция и устранение запахов без химии. Подходит для квартир, домов и коммерческих объектов. Москва и Московская область.',
  included: [
    'Обработка помещения озоном',
    'Удаление запахов и бактерий',
    'Безопасно для людей и животных после проветривания',
  ],
  forWhom: [
    'После пожара или затопления',
    'Устранение запахов табака, животных, пищи',
    'Дезинфекция после инфекций',
    'Подготовка помещения к сдаче или переезду',
  ],
  process: defaultProcess,
  priceFrom: 'уточняйте по телефону',
  guarantees: [...defaultGuarantees, 'Проветривание после обработки по инструкции.'],
  equipment: ['Озонаторы профессионального класса', 'Контроль концентрации озона'],
  faq: [
    { question: 'Нужно ли выходить из помещения?', answer: 'Да. Во время работы озонатора в помещении никого не должно быть. После сеанса — проветривание по инструкции.' },
    { question: 'Опасен ли озон для мебели и техники?', answer: 'При соблюдении режимов концентрации и времени воздействия озон не вредит отделке и технике. Рекомендации даём после осмотра.' },
  ],
  relatedLinks: [
    { label: 'Удаление запахов', href: '/services/odor-removal/' },
    { label: 'Дезинфекция', href: '/services/disinfection/' },
    { label: 'Квартира', href: '/private/apartment/' },
    ...commonRelatedLinks,
  ],
};

/** Services: Удаление запахов */
export const odorRemovalContent: ServiceContent = {
  title: 'Удаление запахов',
  intro: 'Профессиональное удаление стойких запахов: табак, животные, пожары, затопления. Безопасные методы и оборудование. Москва и Московская область.',
  included: [
    'Диагностика источника запаха',
    'Обработка поверхностей и воздуха',
    'При необходимости — озонирование или спецсредства',
  ],
  forWhom: [
    'Запахи после пожара или потопа',
    'Табачный запах',
    'Запахи животных',
    'Перед сдачей или продажей недвижимости',
  ],
  process: defaultProcess,
  priceFrom: 'уточняйте по телефону',
  guarantees: defaultGuarantees,
  equipment: ['Озонаторы', 'Профессиональные нейтрализаторы запахов', 'Распылительное оборудование'],
  faq: [
    { question: 'Насколько надолго уходит запах?', answer: 'При правильной обработке запах устраняется надолго. В сложных случаях возможна повторная обработка — обсудим по результату.' },
    { question: 'Можно совместить с уборкой?', answer: 'Да. Часто заказывают уборку и удаление запахов комплексно.' },
  ],
  relatedLinks: [
    { label: 'Озонирование', href: '/services/ozonation/' },
    { label: 'Дезинфекция', href: '/services/disinfection/' },
    { label: 'Химчистка', href: '/private/dry-cleaning/' },
    ...commonRelatedLinks,
  ],
};

/** Services: Дезинфекция */
export const disinfectionContent: ServiceContent = {
  title: 'Дезинфекция',
  intro: 'Дезинфекция помещений для частных лиц и бизнеса. Безопасные препараты и методы. Москва и Московская область.',
  included: [
    'Обработка поверхностей дезинфицирующими средствами',
    'При необходимости — обработка воздуха',
    'Рекомендации по проветриванию и режиму доступа',
  ],
  forWhom: [
    'После инфекционных заболеваний',
    'Профилактическая дезинфекция',
    'Объекты с повышенными требованиями (медицина, детские учреждения — по запросу)',
  ],
  process: defaultProcess,
  priceFrom: 'уточняйте по телефону',
  guarantees: [...defaultGuarantees, 'Используем средства, разрешённые к применению.'],
  equipment: ['Дезинфицирующие препараты', 'Распылительное оборудование', 'СИЗ'],
  faq: [
    { question: 'Нужно ли выходить из помещения?', answer: 'Зависит от метода и препарата. Инструкции по безопасности даём перед обработкой.' },
    { question: 'Подходит ли для квартиры после болезни?', answer: 'Да. Проводим дезинфекцию жилых помещений по запросу.' },
  ],
  relatedLinks: [
    { label: 'Озонирование', href: '/services/ozonation/' },
    { label: 'Удаление запахов', href: '/services/odor-removal/' },
    { label: 'Квартира', href: '/private/apartment/' },
    ...commonRelatedLinks,
  ],
};

/** Business: generic content by slug; label overridden per type */
const businessProcess: ProcessStep[] = [
  { title: 'Заявка', description: 'Заявка по сайту, телефону или мессенджеру.' },
  { title: 'Выезд и смета', description: 'Выезд на объект (при необходимости), расчёт стоимости, договор.' },
  { title: 'График и доступ', description: 'Согласование графика и доступа. Работаем в нерабочие часы при необходимости.' },
  { title: 'Выполнение работ', description: 'Разовое обслуживание по договору.' },
  { title: 'Контроль и отчётность', description: 'Контроль качества, акты выполненных работ, отчётность по запросу.' },
  { title: 'Оплата', description: 'По счёту для юрлиц. Безнал, НДС — по договорённости.' },
];

const businessGuarantees = [
  'Договор, счёт, акты выполненных работ.',
  'Работа в нерабочие часы по согласованию.',
  'Контроль качества и SLA по договору.',
  'Безопасные средства и ответственность за сохранность.',
];

const businessFaq: FaqItem[] = [
  { question: 'Работаете по договору и актам?', answer: 'Да. Заключаем договор, выставляем счёт, подписываем акты выполненных работ.' },
  { question: 'Можно уборку в выходные или ночью?', answer: 'Да. График подстраиваем под режим работы объекта.' },
  { question: 'Уборка разово или по графику?', answer: 'Объём и периодичность работ закрепляем в договоре.' },
  { question: 'Как считается стоимость?', answer: 'От площади, типа помещений, частоты и перечня работ. Точный расчёт — после осмотра или по ТЗ.' },
];

function buildBusinessContent(label: string, introSuffix: string, included: string[], forWhom: string[], related: RelatedLink[]): ServiceContent {
  return {
    title: label,
    intro: `Профессиональный клининг для объектов: ${label}. ${introSuffix} Москва и Московская область.`,
    included: included.length ? included : ['Выезд и осмотр объекта', 'Расчёт стоимости', 'Выполнение работ по договору', 'Контроль качества'],
    forWhom,
    process: businessProcess,
    priceFrom: 'уточняйте по телефону',
    priceNote: 'Стоимость зависит от площади, объёма и регулярности. Точный расчёт после осмотра.',
    guarantees: businessGuarantees,
    equipment: defaultEquipment,
    faq: businessFaq,
    relatedLinks: related,
  };
}

const businessIncludedBySlug: Record<string, string[]> = {
  office: ['Уборка офисных помещений', 'Мытьё полов и стёкол', 'Чистка санузлов и кухонных зон', 'Вынос мусора', 'По графику или разово'],
  warehouse: ['Уборка складских зон', 'Подметание и мытьё полов', 'Удаление пыли с стеллажей', 'Вынос мусора'],
  facades: ['Мойка фасадов и вывесок', 'Высотные работы альпинистами', 'Удаление загрязнений и граффити'],
  production: ['Уборка производственных и цеховых помещений', 'Мытьё полов', 'Удаление пыли и отходов'],
  'windows-climbing': ['Мойка окон и фасадов на высоте', 'Промышленный альпинизм', 'Страховка и допуски'],
  'residential-complex': ['Уборка подъездов и общих зон ЖК', 'Мытьё полов и перил', 'Чистка лифтов и тамбуров'],
  store: ['Уборка торговых залов и витрин', 'Мытьё полов', 'Чистка примерочных и санузлов'],
  cafe: ['Уборка зала и кухонной зоны', 'Мытьё полов и столешниц', 'Чистка санузлов', 'Вынос мусора'],
  parking: ['Подметание и мытьё парковок', 'Удаление пятен ГСМ', 'Уборка прилегающей территории'],
  'pool-fountain': ['Чистка бассейнов и фонтанов', 'Обработка чаш и оборудования', 'Водоподготовка по запросу'],
  school: ['Уборка классов и коридоров', 'Санузлы и раздевалки', 'Спортзалы и столовые', 'Соответствие нормам по запросу'],
  clinic: ['Уборка помещений поликлиник и больниц', 'Дезинфекция по нормам', 'Спецтребования по запросу'],
  'car-service': ['Уборка зон обслуживания и офисов автосервиса/автосалона', 'Мытьё полов', 'Чистка витрин'],
  mall: ['Уборка общих зон ТЦ/БЦ', 'Коридоры, лифты, санузлы', 'Обслуживание по графику'],
  fitness: ['Уборка залов, раздевалок, душевых', 'Обработка тренажёров и покрытий'],
  hotel: ['Уборка номеров и общих зон', 'Мытьё полов и стёкол', 'Обслуживание по стандартам отеля'],
  'dry-cleaning': ['Химчистка мебели, ковров, штор в офисах и объектах'],
  'odor-removal': ['Удаление запахов в нежилых помещениях', 'Озонирование и нейтрализация'],
  ozonation: ['Озонирование помещений для бизнеса', 'Дезинфекция и удаление запахов'],
  disinfection: ['Дезинфекция нежилых помещений', 'Обработка по нормам для организаций'],
  salon: ['Уборка салонов красоты и парикмахерских', 'Чистка рабочих зон и санузлов'],
  administrative: ['Уборка административных зданий', 'Офисные и общие зоны', 'По договору'],
  entertainment: ['Уборка развлекательных учреждений', 'Залы, санузлы, общие зоны'],
  other: ['Уборка прочих нежилых помещений', 'Индивидуальный перечень по объекту'],
};

const businessForWhomBySlug: Record<string, string[]> = {
  office: ['Офисы любой площади', 'Ежедневная или еженедельная уборка', 'После ремонта офиса'],
  warehouse: ['Склады и логистические центры', 'Разовая уборка'],
  facades: ['Фасады зданий', 'Вывески и витрины', 'Высотные работы'],
  production: ['Цеха и производственные помещения', 'График под режим работы'],
  'windows-climbing': ['Высотные здания', 'Панорамные окна', 'Фасады'],
  'residential-complex': ['ЖК и управляющие компании', 'Уборка подъездов'],
  store: ['Магазины и шоу-румы', 'Ежедневная уборка или по графику'],
  cafe: ['Кафе и рестораны', 'После закрытия или в перерывах'],
  parking: ['Подземные и открытые парковки', 'ТЦ, офисы, ЖК'],
  'pool-fountain': ['Бассейны при отелях и фитнесе', 'Фонтаны в зданиях и на территории'],
  school: ['Школы и детские сады', 'Соответствие СанПиН по запросу'],
  clinic: ['Поликлиники и больницы', 'Спецрежимы дезинфекции по запросу'],
  'car-service': ['Автосервисы и автосалоны', 'Зоны ожидания и офисы'],
  mall: ['Торговые и бизнес-центры', 'Общие зоны и коридоры'],
  fitness: ['Фитнес-клубы', 'Залы и раздевалки'],
  hotel: ['Гостиницы и отели', 'Номера и общие зоны'],
  'dry-cleaning': ['Офисная мебель и ковры в бизнес-объектах'],
  'odor-removal': ['Удаление запахов в офисах, объектах после пожара/затопления'],
  ozonation: ['Озонирование офисов и нежилых помещений'],
  disinfection: ['Дезинфекция для организаций'],
  salon: ['Салоны красоты и парикмахерские'],
  administrative: ['Административные здания', 'Офисные и общие зоны'],
  entertainment: ['Кинотеатры, боулинг, детские центры'],
  other: ['Любые нежилые помещения по запросу'],
};

/** Get business service content by slug */
export function getBusinessServiceContent(slug: string): ServiceContent | null {
  const business = getBusinessBySlug(slug);
  if (!business) return null;
  const included = businessIncludedBySlug[slug] ?? [];
  const forWhom = businessForWhomBySlug[slug] ?? ['Объекты по запросу'];
  const related: RelatedLink[] = [
    ...businessTypes.slice(0, 5).map((t) => ({ label: t.label, href: `/business/${t.slug}/` })),
    ...commonRelatedLinks,
  ];
  return buildBusinessContent(
    business.label,
    'Разовые уборки. Договор, счёт, акты.',
    included,
    forWhom,
    related
  );
}

/** Get private/service content by key */
const privateContentMap: Record<string, ServiceContent> = {
  apartment: apartmentContent,
  house: houseContent,
  'window-wash': windowWashContent,
  'dry-cleaning': dryCleaningContent,
};

const servicesContentMap: Record<string, ServiceContent> = {
  ozonation: ozonationContent,
  'odor-removal': odorRemovalContent,
  disinfection: disinfectionContent,
};

export function getPrivateServiceContent(key: 'apartment' | 'house' | 'window-wash' | 'dry-cleaning'): ServiceContent {
  return privateContentMap[key] ?? apartmentContent;
}

export function getServicesContent(key: 'ozonation' | 'odor-removal' | 'disinfection'): ServiceContent {
  return servicesContentMap[key] ?? ozonationContent;
}
