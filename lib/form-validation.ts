/**
 * Centralized form validation and masking utilities.
 * Used across OrderForm, QuizWizard, and all site forms.
 */

import { z } from 'zod';
import { validateAddress, parseAddressString } from '@/data/addresses';

// ─── Constants ───
export const NAME_MAX_LENGTH = 30;
export const PHONE_DIGITS_COUNT = 11; // 7 + 10 digits
export const DATE_MIN = '2026-01-01';
export const DATE_MAX = '2100-12-31';

type DateParts = { year: number; month: number; day: number };

function isLeapYear(year: number): boolean {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 0;
}

function parseISODateStrict(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (year < 2026 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  const dim = daysInMonth(year, month);
  if (day < 1 || day > dim) return null;
  return { year, month, day };
}

function compareDateParts(a: DateParts, b: DateParts): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

function getEffectiveDateMin(today = new Date()): DateParts {
  const minParts = parseISODateStrict(DATE_MIN)!; // always valid
  const maxParts = parseISODateStrict(DATE_MAX)!;

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const todayParts: DateParts = {
    year,
    month,
    day: Math.min(day, daysInMonth(year, month)),
  };

  // If today is before the global minimum, stick to DATE_MIN.
  if (compareDateParts(todayParts, minParts) < 0) {
    return minParts;
  }

  // If today is after the global maximum, clamp to DATE_MAX.
  if (compareDateParts(todayParts, maxParts) > 0) {
    return maxParts;
  }

  return todayParts;
}

// ─── Cyrillic only (буквы кириллицы + запятая) ───
const CYRILLIC_COMMA_REGEX_STRICT = /^[А-Яа-яЁё,]*$/;
export function sanitizeCyrillic(
  value: string,
  options?: { allowSpaces?: boolean; allowHyphens?: boolean; allowCommas?: boolean }
): string {
  // По умолчанию: только буквы кириллицы и запятая (как в Имя, Тип услуги)
  const allowSpaces = options?.allowSpaces ?? false;
  const allowHyphens = options?.allowHyphens ?? false;
  const allowCommas = options?.allowCommas ?? true;
  return value
    .split('')
    .filter((c) => {
      if (/[А-Яа-яЁё]/.test(c)) return true;
      if (allowSpaces && c === ' ') return true;
      if (allowHyphens && c === '-') return true;
      if (allowCommas && c === ',') return true;
      return false;
    })
    .join('');
}

export function isValidCyrillicName(value: string): boolean {
  return CYRILLIC_COMMA_REGEX_STRICT.test(value) && value.length >= 2 && value.length <= NAME_MAX_LENGTH;
}

// ─── Phone mask (RU +7) ───
const PHONE_PREFIX = '+7';
export function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '');
  if (!d || d === '7') return PHONE_PREFIX;
  const normalized = d.startsWith('7') ? d : '7' + d;
  const rest = normalized.slice(1);
  if (rest.length <= 3) return `${PHONE_PREFIX} (${rest}`;
  if (rest.length <= 6) return `${PHONE_PREFIX} (${rest.slice(0, 3)}) ${rest.slice(3)}`;
  if (rest.length <= 8) return `${PHONE_PREFIX} (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`;
  return `${PHONE_PREFIX} (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8, 10)}`;
}

export function parsePhoneToDigits(value: string): string {
  return value.replace(/\D/g, '').replace(/^8/, '7').replace(/^7?/, '7').slice(0, 11);
}

export function isPhoneValid(digits: string): boolean {
  return digits.length === PHONE_DIGITS_COUNT && digits.startsWith('7');
}

// ─── Error messages (unified) ───
export const FORM_MESSAGES = {
  nameRequired: 'Введите свое имя',
  fillField: (label: string) => `Заполните поле ${label}`,
  addressInvalid: 'Такого адреса не существует',
  dateInvalid: 'Укажите корректную дату',
  timeInvalid: 'Укажите корректное время',
  phoneInvalid: 'Введите корректный номер телефона',
} as const;

// ─── Zod schemas ───
export const nameSchema = z
  .string()
  .min(1, FORM_MESSAGES.nameRequired)
  .max(NAME_MAX_LENGTH, `Максимум ${NAME_MAX_LENGTH} символов`)
  .refine((v) => isValidCyrillicName(v), FORM_MESSAGES.nameRequired);

export const phoneSchema = z
  .string()
  .refine((v) => {
    const d = parsePhoneToDigits(v);
    if (d.length <= 1) return false;
    return isPhoneValid(d);
  }, (v) => {
    const d = parsePhoneToDigits(v);
    if (d.length <= 1) return { message: FORM_MESSAGES.fillField('телефон') };
    return { message: FORM_MESSAGES.phoneInvalid };
  });

export const serviceTypeSchema = z
  .string()
  .optional()
  .refine((v) => !v || v.trim().length === 0 || CYRILLIC_COMMA_REGEX_STRICT.test(v), 'Допустимы только кириллица и запятая')
  .transform((v) => v?.trim() || undefined);

export const dateSchema = z
  .string()
  .optional()
  .refine(
    (v) => {
      if (!v || v.trim() === '') return true;
      const parsed = parseISODateStrict(v);
      if (!parsed) return false;
      const min = getEffectiveDateMin();
      return compareDateParts(parsed, min) >= 0;
    },
    { message: FORM_MESSAGES.dateInvalid }
  );

export const timeSchema = z
  .string()
  .optional()
  .refine(
    (v) => {
      if (!v || v.trim() === '') return true;
      const match = /^(\d{2}):(\d{2})$/.exec(v);
      if (!match) return false;
      const hour = Number(match[1]);
      const minute = Number(match[2]);
      if (!Number.isInteger(hour) || !Number.isInteger(minute)) return false;
      if (hour < 0 || hour > 23) return false;
      if (minute < 0 || minute > 59) return false;
      return true;
    },
    { message: FORM_MESSAGES.timeInvalid }
  );

// ─── Address validation (optional; if filled must be valid) ───
export const addressSchema = z
  .string()
  .optional()
  .refine(
    (v) => {
      if (!v || v.trim() === '') return true;
      const parts = parseAddressString(v);
      return validateAddress(parts);
    },
    { message: FORM_MESSAGES.addressInvalid }
  );

// ─── Order form schema ───
export const orderFormSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  address: addressSchema,
  date: dateSchema,
  time: timeSchema,
  serviceType: serviceTypeSchema,
  consent: z
    .boolean()
    .refine((v) => v === true, { message: 'Необходимо согласие на обработку данных' }),
  honeypot: z.string().max(0).optional(),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
