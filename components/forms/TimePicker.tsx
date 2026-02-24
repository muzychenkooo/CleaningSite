'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '10', '20', '30', '40', '50'];

export interface TimePickerProps {
  value: string; // HH:mm or ''
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  className?: string;
  id?: string;
}

function parseValue(value: string): { hour: number; minute: number } | null {
  if (!value || !/^\d{1,2}:\d{2}$/.test(value)) return null;
  const [h, m] = value.split(':').map(Number);
  if (h < 0 || h > 23 || isNaN(m)) return null;
  const minuteIndex = Math.min(5, Math.round(m / 10));
  const minute = [0, 10, 20, 30, 40, 50][minuteIndex];
  return { hour: h, minute };
}

function toValue(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// ─── Desktop: dropdown list ───
function DesktopList({
  items,
  selectedIndex,
  onSelect,
  onClose,
  label,
  className,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  label?: string;
  className?: string;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const row = el.querySelector(`[data-index="${selectedIndex}"]`);
    row?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [selectedIndex]);

  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg',
        className
      )}
      role="listbox"
    >
      {label && (
        <div className="sticky top-0 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
          {label}
        </div>
      )}
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          role="option"
          aria-selected={index === selectedIndex}
          data-index={index}
          className={cn(
            'w-full px-3 py-2.5 text-left text-sm transition-colors',
            index === selectedIndex
              ? 'bg-primary-50 font-medium text-primary-800'
              : 'text-slate-700 hover:bg-slate-50'
          )}
          onClick={() => {
            onSelect(index);
            onClose();
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

// ─── Mobile: wheel column ───
const WHEEL_ITEM_HEIGHT = 44;
const WHEEL_VISIBLE_COUNT = 5;
const WHEEL_PADDING = WHEEL_ITEM_HEIGHT * 2;

function WheelColumn({
  items,
  selectedIndex,
  onSelect,
  label,
  className,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label?: string;
  className?: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const targetScroll = selectedIndex * WHEEL_ITEM_HEIGHT;
    el.scrollTop = Math.max(0, targetScroll);
  }, [selectedIndex]);

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const index = Math.round((scrollTop + WHEEL_ITEM_HEIGHT / 2) / WHEEL_ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    onSelect(clamped);
  }, [items.length, onSelect]);

  const scrollEndTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleScrollEnd = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const index = Math.round((scrollTop + WHEEL_ITEM_HEIGHT / 2) / WHEEL_ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    const targetScroll = clamped * WHEEL_ITEM_HEIGHT;
    el.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
    onSelect(clamped);
  }, [items.length, onSelect]);

  const scheduleScrollEnd = React.useCallback(() => {
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = setTimeout(handleScrollEnd, 150);
  }, [handleScrollEnd]);

  return (
    <div className={cn('flex flex-col flex-1 min-w-0', className)}>
      {label && (
        <div className="text-center text-xs font-medium text-slate-500 mb-1">{label}</div>
      )}
      <div
        className="relative overflow-hidden"
        style={{ height: WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_COUNT }}
      >
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[44px] border-y border-slate-200 pointer-events-none z-10"
          aria-hidden
        />
        <div
          ref={scrollRef}
          className="overflow-y-auto overflow-x-hidden w-full h-full snap-y snap-mandatory overscroll-contain"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'y mandatory',
          }}
          onScroll={() => {
            handleScroll();
            scheduleScrollEnd();
          }}
          onTouchEnd={scheduleScrollEnd}
          onWheel={scheduleScrollEnd}
        >
          <div style={{ height: WHEEL_PADDING, minHeight: WHEEL_PADDING }} />
          {items.map((item, index) => (
            <div
              key={item}
              className="flex items-center justify-center text-lg font-medium text-slate-800 snap-center"
              style={{ height: WHEEL_ITEM_HEIGHT }}
              onClick={() => onSelect(index)}
            >
              {item}
            </div>
          ))}
          <div style={{ height: WHEEL_PADDING, minHeight: WHEEL_PADDING }} />
        </div>
      </div>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}

export function TimePicker({ value, onChange, onBlur, error, className, id }: TimePickerProps) {
  const parsed = React.useMemo(() => parseValue(value), [value]);
  const [hour, setHour] = React.useState(parsed?.hour ?? 0);
  const [minute, setMinute] = React.useState(parsed?.minute ?? 0);

  React.useEffect(() => {
    if (parsed) {
      setHour(parsed.hour);
      setMinute(parsed.minute);
    } else {
      setHour(0);
      setMinute(0);
    }
  }, [value, parsed?.hour, parsed?.minute]);

  const hourIndex = hour;
  const minuteIndex = MINUTES.indexOf(String(minute).padStart(2, '0'));
  const safeMinuteIndex = minuteIndex >= 0 ? minuteIndex : 0;

  const syncToValue = React.useCallback(
    (h: number, m: number) => {
      onChange(toValue(h, m));
    },
    [onChange]
  );

  const handleHourChange = React.useCallback(
    (index: number) => {
      setHour(index);
      syncToValue(index, minute);
    },
    [minute, syncToValue]
  );
  const handleMinuteChange = React.useCallback(
    (index: number) => {
      const m = [0, 10, 20, 30, 40, 50][index];
      setMinute(m);
      syncToValue(hour, m);
    },
    [hour, syncToValue]
  );

  const [openPart, setOpenPart] = React.useState<'hour' | 'minute' | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!openPart) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenPart(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openPart]);

  const isMobile = useIsMobile();

  // Lock background scroll while mobile wheel is open so picker does not "scroll away"
  React.useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    if (typeof document === 'undefined') return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prevOverflow;
    };
  }, [isMobile, mobileOpen]);

  return (
    <>
      <div ref={containerRef} className={cn('relative', className)}>
        {isMobile ? (
          <button
            type="button"
            id={id}
            onClick={() => setMobileOpen(true)}
            onBlur={onBlur}
            className={cn(
              'flex h-10 w-full min-w-0 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-left ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              error && 'border-red-500 focus-visible:ring-red-500',
              !value && 'text-slate-500'
            )}
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
          >
            {value ? toValue(hour, minute) : 'Часы · Минуты'}
          </button>
        ) : (
          <div
            id={id}
            onBlur={onBlur}
            className={cn(
              'flex h-10 w-full min-w-0 rounded-lg border border-slate-300 bg-white overflow-hidden ring-offset-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
              error && 'border-red-500 focus-within:ring-red-500'
            )}
          >
            <button
              type="button"
              className={cn(
                'flex-1 min-w-0 px-2 py-2 text-sm text-center border-r border-slate-200 hover:bg-slate-50',
                openPart === 'hour' && 'bg-primary-50 text-primary-800'
              )}
              onClick={() => setOpenPart((p) => (p === 'hour' ? null : 'hour'))}
              aria-haspopup="listbox"
              aria-expanded={openPart === 'hour'}
            >
              {value ? String(hour).padStart(2, '0') : '—'}
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 min-w-0 px-2 py-2 text-sm text-center hover:bg-slate-50',
                openPart === 'minute' && 'bg-primary-50 text-primary-800'
              )}
              onClick={() => setOpenPart((p) => (p === 'minute' ? null : 'minute'))}
              aria-haspopup="listbox"
              aria-expanded={openPart === 'minute'}
            >
              {value ? String(minute).padStart(2, '0') : '—'}
            </button>
          </div>
        )}

        {!isMobile && openPart === 'hour' && (
          <DesktopList
            items={HOURS}
            selectedIndex={hourIndex}
            onSelect={handleHourChange}
            onClose={() => setOpenPart(null)}
            label="Часы"
          />
        )}
        {!isMobile && openPart === 'minute' && (
          <DesktopList
            items={MINUTES}
            selectedIndex={safeMinuteIndex}
            onSelect={handleMinuteChange}
            onClose={() => setOpenPart(null)}
            label="Минуты"
          />
        )}
      </div>

      {isMobile && mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl border-t border-slate-200 bg-white shadow-xl safe-area-pb"
            role="dialog"
            aria-modal="true"
            aria-label="Выбор времени"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <button
                type="button"
                className="text-slate-500 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Отмена
              </button>
              <span className="font-semibold text-slate-900">Время</span>
              <button
                type="button"
                className="text-primary-600 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Готово
              </button>
            </div>
            <div className="flex gap-2 px-2 py-4" style={{ height: 260 }}>
              <WheelColumn
                items={HOURS}
                selectedIndex={hourIndex}
                onSelect={handleHourChange}
                label="Часы"
              />
              <WheelColumn
                items={MINUTES}
                selectedIndex={safeMinuteIndex}
                onSelect={handleMinuteChange}
                label="Минуты"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
