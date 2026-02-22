import { z } from 'zod';
import type { QuizServiceType } from '@/data/quiz';

const phoneRegex = /^[\d\s()+()-]{10,20}$/;

export const quizContactsSchema = z.object({
  name: z.string().min(2, 'Укажите имя (минимум 2 символа)').max(100, 'Слишком длинное имя'),
  phone: z
    .string()
    .min(10, 'Введите номер телефона')
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Некорректный номер телефона')
    .refine((v) => phoneRegex.test(v), 'Допустимы только цифры, пробелы и скобки'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо согласие на обработку данных' }),
  }),
  /** Honeypot: must stay empty */
  website: z.string().max(0).optional(),
});

export type QuizContactsInput = z.infer<typeof quizContactsSchema>;

export interface QuizState {
  type?: QuizServiceType;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  extras?: Record<string, boolean>;
  urgency?: string;
  name?: string;
  phone?: string;
  consent?: boolean;
}

/** Convert quiz state to pricing params for optional estimate (uses existing formula). */
export function quizStateToPricingParams(state: QuizState): {
  serviceType: QuizServiceType;
  areaSqm: number;
  windows?: number;
  hasBalcony?: boolean;
} | null {
  const type = state.type ?? 'apartment';
  const area = state.area ?? 50;
  if (area < 10 || area > 2000) return null;
  const hasBalcony = state.extras?.balcony ?? false;
  const windowsCount = type === 'window' ? Math.max(1, Math.ceil(area / 15)) : (state.rooms ?? 2) * 2;
  return {
    serviceType: type,
    areaSqm: area,
    windows: type !== 'window' ? windowsCount : undefined,
    hasBalcony: type === 'apartment' ? hasBalcony : undefined,
  };
}
