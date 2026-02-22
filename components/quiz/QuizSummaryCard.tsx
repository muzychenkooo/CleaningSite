'use client';

import { QUIZ_STEPS, QUIZ_MICROCOPY } from '@/data/quiz';
import type { QuizState } from '@/lib/quiz';
import { cn } from '@/lib/utils';

type Props = {
  state: QuizState;
  className?: string;
};

export function QuizSummaryCard({ state, className }: Props) {
  const typeStep = QUIZ_STEPS.find((s) => s.id === 'type');
  const typeOption = typeStep?.options?.find((o) => o.value === state.type);
  const areaStep = QUIZ_STEPS.find((s) => s.id === 'area');
  const urgencyStep = QUIZ_STEPS.find((s) => s.id === 'urgency');
  const urgencyOption = urgencyStep?.options?.find((o) => o.value === state.urgency);
  const extrasStep = QUIZ_STEPS.find((s) => s.id === 'extras');
  const selectedExtras = extrasStep?.options?.filter((o) => state.extras?.[o.key]) ?? [];

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50',
        'lg:sticky lg:top-28',
        className
      )}
      aria-label="Итог выбора"
    >
      <h3 className="font-display text-lg font-semibold text-slate-900">Ваш выбор</h3>
      <dl className="mt-4 space-y-3 text-sm">
        {typeOption && (
          <>
            <dt className="text-slate-500">Тип уборки</dt>
            <dd className="font-medium text-slate-800">{typeOption.shortLabel}</dd>
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
        {urgencyOption && (
          <>
            <dt className="text-slate-500">Когда</dt>
            <dd className="font-medium text-slate-800">{urgencyOption.shortLabel}</dd>
          </>
        )}
        {selectedExtras.length > 0 && (
          <>
            <dt className="text-slate-500">Доп. услуги</dt>
            <dd className="font-medium text-slate-800">{selectedExtras.map((e) => e.label).join(', ')}</dd>
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
    </div>
  );
}
