'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { calculatePrice } from '@/lib/pricing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type CalcServiceType = 'apartment' | 'house' | 'office' | 'after_repair' | 'window';
const serviceTypeOptions: { value: CalcServiceType; label: string }[] = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'office', label: 'Офис' },
  { value: 'after_repair', label: 'После ремонта' },
  { value: 'window', label: 'Только мойка окон' },
];

const schema = z.object({
  serviceType: z.enum(['apartment', 'house', 'office', 'after_repair', 'window']),
  areaSqm: z.coerce.number().min(10, 'Минимум 10 м²').max(2000, 'Укажите до 2000 м²'),
  windows: z.coerce.number().min(0).max(50).optional(),
  hasBalcony: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export function PriceCalculator({ className }: { className?: string }) {
  const [result, setResult] = React.useState<ReturnType<typeof calculatePrice> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: 'apartment',
      areaSqm: 50,
      windows: 2,
      hasBalcony: false,
    },
  });

  const serviceType = watch('serviceType');
  const areaSqm = watch('areaSqm');
  const windows = watch('windows');
  const hasBalcony = watch('hasBalcony');

  // Live estimate: show approximate price as user types
  const liveEstimate = React.useMemo(() => {
    const num = Number(areaSqm);
    if (Number.isNaN(num) || num < 10 || num > 2000) return null;
    try {
      return calculatePrice({
        serviceType,
        areaSqm: num,
        windows: windows ?? 0,
        hasBalcony: hasBalcony ?? false,
      });
    } catch {
      return null;
    }
  }, [serviceType, areaSqm, windows, hasBalcony]);

  const onSubmit = (data: FormData) => {
    const price = calculatePrice({
      serviceType: data.serviceType,
      areaSqm: data.areaSqm,
      windows: data.windows,
      hasBalcony: data.hasBalcony,
    });
    setResult(price);
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 overflow-hidden',
        'transition-shadow duration-200 hover:shadow-xl motion-reduce:transition-none',
        className
      )}
    >
      <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8 sm:py-6">
        <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
          Рассчёт стоимости
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Ориентировочная стоимость. Точную цену озвучит менеджер после уточнения деталей.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6 sm:space-y-8">
        <div>
          <Label className="text-slate-700 font-medium">Тип уборки</Label>
          <div
            className="mt-3 flex flex-wrap gap-2 rounded-xl bg-slate-100 p-1.5 sm:p-2"
            role="tablist"
            aria-label="Выберите тип уборки"
          >
            {serviceTypeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={serviceType === opt.value}
                onClick={() => setValue('serviceType', opt.value)}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                  'motion-reduce:transition-none',
                  serviceType === opt.value
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="calc-area" className="text-slate-700 font-medium">
              Площадь, м²
            </Label>
            <Input
              id="calc-area"
              type="number"
              min={10}
              max={2000}
              {...register('areaSqm')}
              className={cn(
                'h-11 rounded-lg border-slate-300 text-base',
                errors.areaSqm && 'border-red-500 focus-visible:ring-red-500',
              )}
              aria-invalid={!!errors.areaSqm}
              aria-describedby={errors.areaSqm ? 'calc-area-error' : undefined}
            />
            {errors.areaSqm && (
              <p id="calc-area-error" className="text-sm text-red-600" role="alert">
                {errors.areaSqm.message}
              </p>
            )}
          </div>
          {serviceType !== 'window' && (
            <div className="space-y-2">
              <Label htmlFor="calc-windows" className="text-slate-700 font-medium">
                Количество окон
              </Label>
              <Input
                id="calc-windows"
                type="number"
                min={0}
                max={50}
                {...register('windows')}
                className="h-11 rounded-lg border-slate-300 text-base"
              />
            </div>
          )}
        </div>

        {serviceType === 'apartment' && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <input
              type="checkbox"
              id="calc-balcony"
              {...register('hasBalcony')}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              aria-describedby="calc-balcony-desc"
            />
            <Label htmlFor="calc-balcony" id="calc-balcony-desc" className="text-slate-700 cursor-pointer">
              Есть балкон / лоджия
            </Label>
          </div>
        )}

        {/* Live estimate (subtle) */}
        {liveEstimate && !result && (
          <div className="rounded-xl border border-primary-200 bg-primary-50/50 px-4 py-3 text-sm text-primary-800">
            <span className="font-medium">Ориентировочно:</span>{' '}
            {liveEstimate.totalPrice.toLocaleString('ru-RU')} ₽
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500">
            Точную цену уточнит менеджер после осмотра или по телефону.
          </p>
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto min-w-[180px] h-12 rounded-xl font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-transform motion-reduce:transform-none"
          >
            Рассчитать
          </Button>
        </div>
      </form>

      {result && (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-8 sm:py-6 animate-[fadeIn_0.3s_ease-out]">
          <p className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
            Ориентировочная стоимость: {result.totalPrice.toLocaleString('ru-RU')} ₽
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            {result.breakdown.map((b) => (
              <li key={b.label} className="flex justify-between gap-4">
                <span>{b.label}</span>
                <span className="font-medium text-slate-700 tabular-nums">{b.amount.toLocaleString('ru-RU')} ₽</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Точную цену уточнит менеджер после осмотра или по телефону.
          </p>
        </div>
      )}
    </div>
  );
}
