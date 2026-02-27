'use client';

import { QUIZ_STEPS, QUIZ_MICROCOPY } from '@/data/quiz';
import type { QuizState } from '@/lib/quiz';
import { cn } from '@/lib/utils';

type Props = {
  state: QuizState;
  discount?: number;
  className?: string;
};

export function QuizSummaryCard({ state, discount = 0, className }: Props) {
  const placeStep = QUIZ_STEPS.find((s) => s.id === 'place');
  const placeOption = placeStep?.options?.find((o) => o.value === state.place);
  const placeLabel = placeOption?.shortLabel ?? state.customPlaceLabel ?? state.place;

  const typeStep = QUIZ_STEPS.find((s) => s.id === 'type');
  const typeOption = typeStep?.options?.find((o) => o.value === state.type);
  const typeLabel = typeOption?.shortLabel ?? state.customTypeLabel;
  const areaStep = QUIZ_STEPS.find((s) => s.id === 'area');
  const extrasStep = QUIZ_STEPS.find((s) => s.id === 'extras');
  const selectedExtras = extrasStep?.options?.filter((o) => state.extras?.[o.key]) ?? [];
  const allExtrasLabels = [
    ...selectedExtras.map((e) => e.label),
    ...(state.customExtrasLabel ? [state.customExtrasLabel] : []),
  ];

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50',
        'lg:sticky lg:top-28',
        className
      )}
      aria-label="Итог выбора"
    >
      <div className="rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
          Ваша скидка
        </p>
        <p className="mt-1 text-2xl font-bold text-primary-900">
          {discount.toLocaleString('ru-RU')} ₽
        </p>
        <p className="mt-1 text-xs text-primary-800">
          Точный размер скидки менеджер рассчитает после уточнения деталей.
        </p>
      </div>

      <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">Ваш выбор</h3>
      <dl className="mt-4 space-y-3 text-sm">
        {placeLabel && (
          <>
            <dt className="text-slate-500">Объект уборки</dt>
            <dd className="font-medium text-slate-800">{placeLabel}</dd>
          </>
        )}
        {typeLabel && (
          <>
            <dt className="text-slate-500">Тип уборки</dt>
            <dd className="font-medium text-slate-800">{typeLabel}</dd>
          </>
        )}
        {state.area != null && areaStep && (
          <>
            <dt className="text-slate-500">Площадь</dt>
            <dd className="font-medium text-slate-800">
              {state.area} {areaStep.unit}
            </dd>
          </>
        )}
        {state.type !== 'window' && (state.rooms != null || state.bathrooms != null) && (
          <>
            <dt className="text-slate-500">Помещения</dt>
            <dd className="font-medium text-slate-800">
              {[state.rooms != null && `${state.rooms} комн.`, state.bathrooms != null && `${state.bathrooms} с/у`]
                .filter(Boolean)
                .join(', ')}
            </dd>
          </>
        )}
        {state.date && (
          <>
            <dt className="text-slate-500">Дата уборки</dt>
            <dd className="font-medium text-slate-800">
              {new Date(state.date).toLocaleDateString('ru-RU')}
            </dd>
          </>
        )}
        {state.time && (
          <>
            <dt className="text-slate-500">Время</dt>
            <dd className="font-medium text-slate-800">{state.time}</dd>
          </>
        )}
        {state.preferredChannel && (
          <>
            <dt className="text-slate-500">Как связаться</dt>
            <dd className="font-medium text-slate-800">
              {state.preferredChannel === 'telegram' ? 'Telegram' : 'Телефон'}
            </dd>
          </>
        )}
        {allExtrasLabels.length > 0 && (
          <>
            <dt className="text-slate-500">Доп. услуги</dt>
            <dd className="font-medium text-slate-800">{allExtrasLabels.join(', ')}</dd>
          </>
        )}
      </dl>
      <ul className="mt-6 flex flex-wrap gap-2" aria-hidden>
        <li className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
          {QUIZ_MICROCOPY.trustBadge1}
        </li>
        <li className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
          {QUIZ_MICROCOPY.trustBadge2}
        </li>
        <li className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
          {QUIZ_MICROCOPY.trustBadge3}
        </li>
      </ul>

      <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-xs leading-snug text-slate-600">
          Менеджер свяжется с вами в течение 5–10 минут, уточнит детали уборки и подтвердит стоимость.
        </p>
      </div>
    </div>
  );
}
