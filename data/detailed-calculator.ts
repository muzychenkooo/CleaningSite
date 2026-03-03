/**
 * Конфигурация встроенного подробного калькулятора на главной.
 *
 * Здесь описаны:
 * - первый вопрос (тип объекта / ветка калькулятора);
 * - шаги для каждой ветки;
 * - типы шагов и тексты.
 *
 * Вся логика цены реализуется в `lib/detailed-calculator-pricing.ts`.
 */

export type CalculatorBranchId =
  | 'apartment_house'
  | 'non_residential'
  | 'windows_facade'
  | 'custom';

export type CalculatorPrimaryPlaceValue =
  | 'apartment'
  | 'house'
  | 'non_residential'
  | 'windows_facade'
  | 'custom';

export const CALCULATOR_PLACE_OPTIONS: {
  value: CalculatorPrimaryPlaceValue;
  label: string;
  description?: string;
}[] = [
  {
    value: 'apartment',
    label: 'Квартира',
  },
  {
    value: 'house',
    label: 'Дом/Коттедж',
  },
  {
    value: 'non_residential',
    label: 'Нежилое помещение',
    description: 'Офис, склад, шоурум и др.',
  },
  {
    value: 'windows_facade',
    label: 'Мойка окон / фасада',
  },
  {
    value: 'custom',
    label: 'Свой вариант',
  },
];

export type CalculatorStepId =
  | 'service_type'
  | 'area'
  | 'bathrooms'
  | 'extras'
  | 'dirtiness'
  | 'nonres_type'
  | 'nonres_area'
  | 'nonres_extras'
  | 'windows_type'
  | 'windows_numbers'
  | 'custom_description'
  | 'contacts';

export type CalculatorStepKind =
  | 'choice'
  | 'numeric'
  | 'multi'
  | 'slider'
  | 'textarea'
  | 'contacts';

export interface BaseStepConfig {
  id: CalculatorStepId;
  kind: CalculatorStepKind;
  title: string;
  subtitle?: string;
}

export interface ChoiceStepConfig extends BaseStepConfig {
  kind: 'choice';
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}

export interface NumericStepConfig extends BaseStepConfig {
  kind: 'numeric';
  unit?: string;
  presets?: number[];
  min?: number;
  max?: number;
}

export interface MultiStepConfig extends BaseStepConfig {
  kind: 'multi';
  options: {
    key: string;
    label: string;
    hasNumericValue?: boolean;
    unitLabel?: string;
  }[];
}

export interface SliderStepConfig extends BaseStepConfig {
  kind: 'slider';
  min: number;
  max: number;
  step: number;
  /** Подписи по уровням загрязненности */
  marks?: {
    value: number;
    label: string;
  }[];
}

export interface TextAreaStepConfig extends BaseStepConfig {
  kind: 'textarea';
  maxLength?: number;
}

export interface ContactsStepConfig extends BaseStepConfig {
  kind: 'contacts';
}

export type CalculatorStepConfig =
  | ChoiceStepConfig
  | NumericStepConfig
  | MultiStepConfig
  | SliderStepConfig
  | TextAreaStepConfig
  | ContactsStepConfig;

export const CALCULATOR_STEPS: Record<CalculatorStepId, CalculatorStepConfig> = {
  service_type: {
    id: 'service_type',
    kind: 'choice',
    title: 'Тип уборки',
    subtitle: 'Выберите подходящий вариант',
    options: [
      { value: 'after_repair', label: 'После ремонта / новостройка' },
      { value: 'general', label: 'Генеральная уборка' },
      { value: 'support', label: 'Поддерживающая уборка' },
      { value: 'custom', label: 'Свой вариант' },
    ],
  },
  area: {
    id: 'area',
    kind: 'numeric',
    title: 'Площадь помещения',
    subtitle: 'Укажите площадь в м²',
    unit: 'м²',
    presets: [30, 50, 75, 100, 150, 200],
    min: 10,
    max: 1000,
  },
  bathrooms: {
    id: 'bathrooms',
    kind: 'numeric',
    title: 'Количество санузлов',
    subtitle: 'Влияет на итоговую стоимость по методике из квиза',
    unit: 'шт.',
    presets: [1, 2, 3],
    min: 1,
    max: 10,
  },
  extras: {
    id: 'extras',
    kind: 'multi',
    title: 'Дополнительные услуги',
    subtitle: 'Отметьте то, что нужно добавить к уборке',
    options: [
      { key: 'windows', label: 'Мойка окон', hasNumericValue: true, unitLabel: 'шт.' },
      { key: 'balcony', label: 'Балкон / лоджия', hasNumericValue: true, unitLabel: 'м²' },
      { key: 'ozone', label: 'Озонирование', hasNumericValue: true, unitLabel: 'м²' },
      { key: 'photo_chem', label: 'Химчистка по фото' },
      { key: 'fridge', label: 'Холодильник' },
      { key: 'microwave', label: 'СВЧ' },
      { key: 'oven', label: 'Духовка' },
      { key: 'chandelier', label: 'Люстра' },
    ],
  },
  dirtiness: {
    id: 'dirtiness',
    kind: 'slider',
    title: 'Уровень загрязненности',
    subtitle: 'Оцените по шкале от 1 до 10',
    min: 1,
    max: 10,
    step: 1,
    marks: [
      { value: 1, label: 'Чисто' },
      { value: 5, label: 'Средне' },
      { value: 8, label: 'Сильно' },
      { value: 10, label: 'Очень сильно' },
    ],
  },
  nonres_type: {
    id: 'nonres_type',
    kind: 'textarea',
    title: 'Тип нежилого помещения',
    subtitle: 'Например: офис, склад, салон красоты',
    maxLength: 120,
  },
  nonres_area: {
    id: 'nonres_area',
    kind: 'numeric',
    title: 'Площадь нежилого помещения',
    subtitle: 'Укажите ориентировочную площадь',
    unit: 'м²',
    presets: [50, 100, 200, 500],
    min: 20,
    max: 5000,
  },
  nonres_extras: {
    id: 'nonres_extras',
    kind: 'multi',
    title: 'Дополнительные пожелания',
    subtitle: 'При необходимости отметьте дополнительные зоны',
    options: [
      { key: 'showcases', label: 'Витрины / стеклянные перегородки' },
      { key: 'kitchen', label: 'Кухонная зона' },
      { key: 'warehouse', label: 'Складские помещения' },
    ],
  },
  windows_type: {
    id: 'windows_type',
    kind: 'choice',
    title: 'Что нужно помыть?',
    subtitle: 'Выберите подходящий вариант',
    options: [
      { value: 'windows_only', label: 'Только окна' },
      { value: 'windows_and_facade', label: 'Окна и фасад' },
      { value: 'facade_only', label: 'Только фасад' },
    ],
  },
  windows_numbers: {
    id: 'windows_numbers',
    kind: 'numeric',
    title: 'Количество окон / площадь фасада',
    subtitle: 'Укажите примерное количество окон или площадь фасада',
    unit: 'шт. / м²',
    presets: [4, 8, 12, 20],
    min: 1,
    max: 200,
  },
  custom_description: {
    id: 'custom_description',
    kind: 'textarea',
    title: 'Опишите свой вариант',
    subtitle: 'Например: комплексная уборка нескольких объектов',
    maxLength: 200,
  },
  contacts: {
    id: 'contacts',
    kind: 'contacts',
    title: 'Контакты для связи',
    subtitle: 'Мы уточним детали и согласуем стоимость',
  },
};

export const CALCULATOR_BRANCH_STEP_IDS: Record<CalculatorBranchId, CalculatorStepId[]> = {
  apartment_house: ['service_type', 'area', 'bathrooms', 'extras', 'dirtiness', 'contacts'],
  non_residential: ['nonres_type', 'nonres_area', 'nonres_extras', 'contacts'],
  windows_facade: ['windows_type', 'windows_numbers', 'contacts'],
  custom: ['custom_description', 'contacts'],
};

