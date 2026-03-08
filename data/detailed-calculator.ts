/**
 * Конфигурация встроенного подробного калькулятора на главной.
 *
 * Ветки:
 * - apartment_house: Q2 (тариф), Q4 (площадь), Q6 (санузлы), Q7 (доп.услуги), условно Q8/Q9/Q10, contacts
 * - non_residential: Q5 (площадь), contacts — без расчёта цены
 * - windows_facade: Q3 (площадь остекления), contacts — без расчёта цены
 * - custom: только contacts (текст «Другое» собирается на первом экране)
 *
 * Формула цены: (#2 × #4) + #6 + #7 + (1200 × #8) + (70 × #10)
 * Реализация: lib/detailed-calculator-pricing.ts
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

/** Q1: Где нужно провести клининг? */
export const CALCULATOR_PLACE_OPTIONS: {
  value: CalculatorPrimaryPlaceValue;
  label: string;
  description?: string;
}[] = [
  { value: 'apartment', label: 'В квартире' },
  { value: 'house', label: 'Дом или коттедж' },
  { value: 'non_residential', label: 'Нежилое помещение' },
  { value: 'windows_facade', label: 'Мойка окон / фасада' },
  { value: 'custom', label: 'Другое' },
];

export type CalculatorStepId =
  | 'service_type'   // Q2 — тариф (#2)
  | 'windows_facade_area' // Q3
  | 'area'           // Q4 (#4)
  | 'nonres_area'    // Q5
  | 'bathrooms'      // Q6 (#6)
  | 'extras'         // Q7 (#7), triggers Q8/Q9/Q10
  | 'windows_count'  // Q8 (#8), if "Помыть окна"
  | 'photo_upload'   // Q9, if "Химчистка"
  | 'ozone_area'     // Q10 (#10), if "Дезинфекция озонатором"
  | 'contacts';

export type CalculatorStepKind =
  | 'choice'
  | 'numeric'
  | 'multi'
  | 'slider'
  | 'textarea'
  | 'contacts'
  | 'file_upload';

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
    /** Tariff руб/м² for formula #2 */
    tariffPerSqm?: number;
  }[];
  /** Option value that shows custom text input (e.g. "custom") */
  customOptionValue?: string;
}

export interface NumericStepConfig extends BaseStepConfig {
  kind: 'numeric';
  unit?: string;
  presets?: number[];
  min?: number;
  max?: number;
  /** Max length of input (digits) */
  maxLength?: number;
  /** Stepper step (e.g. 1 or 5) */
  stepperStep?: number;
}

export interface MultiStepConfig extends BaseStepConfig {
  kind: 'multi';
  options: {
    key: string;
    label: string;
    /** Fixed price in RUB (for #7 sum) */
    price?: number;
    /** Triggers follow-up step (e.g. 'windows_count', 'photo_upload', 'ozone_area') */
    triggersStep?: CalculatorStepId;
    hasCustomInput?: boolean;
  }[];
}

export interface SliderStepConfig extends BaseStepConfig {
  kind: 'slider';
  min: number;
  max: number;
  step: number;
  marks?: { value: number; label: string }[];
}

export interface TextAreaStepConfig extends BaseStepConfig {
  kind: 'textarea';
  maxLength?: number;
}

export interface FileUploadStepConfig extends BaseStepConfig {
  kind: 'file_upload';
  accept: string;
  maxFiles: number;
  maxTotalBytes: number;
  helperText: string;
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
  | FileUploadStepConfig
  | ContactsStepConfig;

export const CALCULATOR_STEPS: Record<CalculatorStepId, CalculatorStepConfig> = {
  service_type: {
    id: 'service_type',
    kind: 'choice',
    title: 'Какую уборку хотите?',
    subtitle: 'Выберите подходящий вариант',
    customOptionValue: 'custom',
    options: [
      { value: 'after_repair', label: 'После ремонта / новостройка', tariffPerSqm: 250 },
      { value: 'general', label: 'Генеральная', tariffPerSqm: 220 },
      { value: 'support', label: 'Поддерживающая', tariffPerSqm: 180 },
      { value: 'custom', label: 'Другое', tariffPerSqm: 150 },
    ],
  },
  windows_facade_area: {
    id: 'windows_facade_area',
    kind: 'choice',
    title: 'Площадь остекления / фасада?',
    subtitle: 'Укажите площадь или выберите замеры',
    options: [
      { value: 'measure', label: 'Не знаю, надо провести замеры' },
      { value: 'input', label: 'Напишите площадь в м²' },
    ],
  },
  area: {
    id: 'area',
    kind: 'numeric',
    title: 'Какая площадь квартиры / дома / коттеджа? (примерно)',
    subtitle: 'Укажите площадь в м²',
    unit: 'м²',
    min: 0,
    max: 999999,
    maxLength: 6,
  },
  nonres_area: {
    id: 'nonres_area',
    kind: 'numeric',
    title: 'Какая площадь помещения? (примерно)',
    subtitle: 'Укажите площадь в м²',
    unit: 'м²',
    min: 0,
    max: 999999,
    maxLength: 6,
  },
  bathrooms: {
    id: 'bathrooms',
    kind: 'choice',
    title: 'Какое количество санузлов?',
    subtitle: 'Влияет на стоимость',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '0', label: 'Без санузлов' },
    ],
  },
  extras: {
    id: 'extras',
    kind: 'multi',
    title: 'Понадобится ли что-то еще?',
    subtitle: 'Отметьте нужные услуги',
    options: [
      { key: 'windows', label: 'Помыть окна', price: 0, triggersStep: 'windows_count' },
      { key: 'balcony', label: 'Убраться на балконе', price: 2500 },
      { key: 'oven_microwave', label: 'Помыть духовку или СВЧ', price: 1000 },
      { key: 'fridge', label: 'Помыть холодильник внутри', price: 1200 },
      { key: 'chandelier', label: 'Помыть люстру', price: 1000 },
      { key: 'ozone', label: 'Дезинфекция озонатором', price: 0, triggersStep: 'ozone_area' },
      { key: 'chem', label: 'Химчистка (оценивается по фото)', price: 0, triggersStep: 'photo_upload' },
      { key: 'other', label: 'Другое', price: 0, hasCustomInput: true },
    ],
  },
  windows_count: {
    id: 'windows_count',
    kind: 'numeric',
    title: 'Сколько окон требуется помыть?',
    subtitle: 'Укажите количество',
    unit: 'шт.',
    min: 0,
    max: 999,
    maxLength: 3,
    stepperStep: 1,
  },
  photo_upload: {
    id: 'photo_upload',
    kind: 'file_upload',
    title: 'Приложите фото того, для чего нужна химчистка',
    subtitle: 'До 5 фото, общий размер до 10 МБ',
    accept: 'image/*',
    maxFiles: 5,
    maxTotalBytes: 10 * 1024 * 1024,
    helperText: 'До 5 фото, общий размер до 10 МБ',
  },
  ozone_area: {
    id: 'ozone_area',
    kind: 'numeric',
    title: 'Какую площадь необходимо обработать озоном?',
    subtitle: 'Укажите площадь в м²',
    unit: 'м²',
    min: 0,
    max: 999,
    maxLength: 3,
    stepperStep: 5,
  },
  contacts: {
    id: 'contacts',
    kind: 'contacts',
    title: 'Контакты для связи',
    subtitle: 'Мы уточним детали и согласуем стоимость',
  },
};

/** Bathrooms option value → surcharge RUB (#6) */
export const BATHROOMS_SURCHARGE: Record<string, number> = {
  '1': 0,
  '2': 3000,
  '3': 5000,
  '0': 0,
};

/** Build ordered step IDs for apartment_house branch (with conditionals from extras). */
export function getApartmentHouseStepIds(extras: Record<string, boolean>): CalculatorStepId[] {
  const steps: CalculatorStepId[] = ['service_type', 'area', 'bathrooms', 'extras'];
  if (extras['windows']) steps.push('windows_count');
  if (extras['chem']) steps.push('photo_upload');
  if (extras['ozone']) steps.push('ozone_area');
  steps.push('contacts');
  return steps;
}

export const CALCULATOR_BRANCH_STEP_IDS: Record<CalculatorBranchId, CalculatorStepId[]> = {
  apartment_house: ['service_type', 'area', 'bathrooms', 'extras', 'contacts'], // base; dynamic parts added in component
  non_residential: ['nonres_area', 'contacts'],
  windows_facade: ['windows_facade_area', 'contacts'],
  custom: ['contacts'],
};
