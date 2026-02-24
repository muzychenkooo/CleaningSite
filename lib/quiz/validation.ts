import { z } from 'zod';
import type { QuizServiceType } from '@/data/quiz';
import { nameSchema, phoneSchema } from '@/lib/form-validation';

export const quizContactsSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
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
  /** Custom service type entered via "Другое" */
  customTypeLabel?: string;
  /** Custom extras entered via "Другое" */
  customExtrasLabel?: string;
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
