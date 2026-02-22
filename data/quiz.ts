/**
 * Конфигурация квиза (редактируемый источник шагов, вариантов и текстов).
 * Соответствует логике услуг и формулам с reference-сайта / существующего калькулятора.
 */

export type QuizServiceType = 'apartment' | 'house' | 'office' | 'after_repair' | 'window';

export const QUIZ_STEPS = [
  {
    id: 'type',
    title: 'Тип уборки',
    subtitle: 'Выберите один вариант',
    options: [
      { value: 'apartment' as const, label: 'Квартира', shortLabel: 'Квартира' },
      { value: 'house' as const, label: 'Дом / коттедж', shortLabel: 'Дом' },
      { value: 'office' as const, label: 'Офис', shortLabel: 'Офис' },
      { value: 'after_repair' as const, label: 'После ремонта', shortLabel: 'После ремонта' },
      { value: 'window' as const, label: 'Только мойка окон', shortLabel: 'Мойка окон' },
    ],
  },
  {
    id: 'area',
    title: 'Площадь помещения',
    subtitle: 'Укажите площадь в м²',
    min: 10,
    max: 2000,
    step: 5,
    presets: [30, 50, 75, 100, 150, 200],
    unit: 'м²',
  },
  {
    id: 'rooms',
    title: 'Количество комнат и санузлов',
    subtitle: 'Поможет точнее оценить объём работ',
    roomsLabel: 'Комнат',
    bathroomsLabel: 'Санузлов',
    roomsMin: 1,
    roomsMax: 20,
    bathroomsMin: 0,
    bathroomsMax: 5,
    skipFor: ['window'] as QuizServiceType[],
  },
  {
    id: 'extras',
    title: 'Дополнительные услуги',
    subtitle: 'Отметьте при необходимости',
    options: [
      { id: 'fridge', label: 'Холодильник', key: 'fridge' },
      { id: 'oven', label: 'Духовка', key: 'oven' },
      { id: 'balcony', label: 'Балкон / лоджия', key: 'balcony' },
      { id: 'windows_inside', label: 'Мойка окон изнутри', key: 'windows_inside' },
      { id: 'cabinets', label: 'Внутренние шкафы', key: 'cabinets' },
    ],
    skipFor: ['window'] as QuizServiceType[],
  },
  {
    id: 'urgency',
    title: 'Когда нужна уборка?',
    subtitle: 'Мы подстроимся под ваши сроки',
    options: [
      { value: 'asap', label: 'Как можно скорее', shortLabel: 'Срочно' },
      { value: 'this_week', label: 'На этой неделе', shortLabel: 'На неделе' },
      { value: 'next_week', label: 'На следующей неделе', shortLabel: 'След. неделя' },
      { value: 'date', label: 'Конкретная дата (уточним по телефону)', shortLabel: 'К дате' },
    ],
  },
  {
    id: 'contacts',
    title: 'Ваши контакты',
    subtitle: 'Менеджер подготовит смету и перезвонит в течение 5–10 минут',
    namePlaceholder: 'Как к вам обращаться?',
    phonePlaceholder: '+7 (___) ___-__-__',
    consentText: 'Даю согласие на обработку персональных данных и связь по указанному телефону.',
    consentLinkText: 'Политика конфиденциальности',
    consentLinkHref: '/legal/',
    submitLabel: 'Получить смету',
  },
] as const;

export const QUIZ_MICROCOPY = {
  stepLabel: (current: number, total: number) => `Шаг ${current} из ${total}`,
  back: 'Назад',
  next: 'Далее',
  resultTitle: 'Подготовим точную смету за 5–10 минут',
  resultSubtitle: 'Менеджер свяжется с вами по указанному номеру и озвучит стоимость.',
  resultCta: 'Перейти на главную',
  successTitle: 'Заявка отправлена',
  successMessage: 'Менеджер свяжется с вами в ближайшее время по указанному телефону.',
  successCta: 'На главную',
  trustBadge1: 'Без предоплаты',
  trustBadge2: 'Оплата по факту',
  trustBadge3: 'Гарантия качества',
} as const;

export type QuizStepId = (typeof QUIZ_STEPS)[number]['id'];
