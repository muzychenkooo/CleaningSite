'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { trackFormSubmit } from '@/lib/analytics';

const schema = z.object({
  name: z.string().min(2, 'Введите имя'),
  phone: z.string().min(10, 'Введите корректный телефон'),
  address: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  serviceType: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

const MIN_SUBMIT_SECONDS = 3;

function trackConversion(formName: string) {
  trackFormSubmit(formName);
}

export function OrderForm({
  onSuccess,
  className,
  compact,
}: {
  onSuccess?: () => void;
  className?: string;
  compact?: boolean;
}) {
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const mountedAt = React.useRef<number>(Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: '' },
  });

  const onSubmit = async (data: FormData) => {
    if (data.honeypot) return;
    if (Date.now() - mountedAt.current < MIN_SUBMIT_SECONDS * 1000) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      trackConversion('order');
      reset();
      setSuccessOpen(true);
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('w-full min-w-0 space-y-4', className)}
        noValidate
      >
        <input
          type="text"
          autoComplete="off"
          tabIndex={-1}
          className="absolute -left-[9999px]"
          aria-hidden
          {...register('honeypot')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="order-name">Имя *</Label>
            <Input
              id="order-name"
              placeholder="Иван"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-red-600" role="alert">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-phone">Телефон *</Label>
            <Input
              id="order-phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-sm text-red-600" role="alert">{errors.phone.message}</p>
            )}
          </div>
        </div>
        {!compact && (
          <>
            <div className="space-y-2">
              <Label htmlFor="order-address">Адрес</Label>
              <Input id="order-address" placeholder="Город, улица, дом" {...register('address')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order-date">Желаемая дата</Label>
                <Input id="order-date" type="date" {...register('date')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-time">Время</Label>
                <Input id="order-time" type="time" {...register('time')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-service">Тип услуги</Label>
              <Input id="order-service" placeholder="Например: генеральная уборка квартиры" {...register('serviceType')} />
            </div>
          </>
        )}
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Отправка…' : 'Отправить заявку'}
        </Button>
      </form>
      {successOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            aria-hidden
            onClick={() => setSuccessOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="relative z-[101] w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Закрыть"
            >
              ×
            </button>
            <h3 id="success-title" className="text-lg font-semibold">Заявка принята</h3>
            <p className="mt-2 text-sm text-slate-500">
              Мы свяжемся с вами в ближайшее время для уточнения деталей и расчёта стоимости.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
