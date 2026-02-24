'use client';

import Image from 'next/image';
import * as React from 'react';
import { Container } from '@/components/layout/container';
import { teamMembers, type TeamMember } from '@/data/team';
import { assetUrl } from '@/lib/asset-url';

const TOTAL_TEAM = teamMembers.length + 3; // 4 клинера + 3 управленца

function buildExtendedTeam(all: TeamMember[], visible: number) {
  const clone = visible;
  const extended = [
    ...all.slice(-clone),
    ...all,
    ...all.slice(0, clone),
  ];
  return { extended, clone, initOffset: clone };
}

export function TeamSection() {
  // 4 клинера + 2 бригадира + 1 офис-менеджер
  const managementSlots: TeamMember[] = [
    { id: 'lead-1', name: 'Бригадир', role: 'Бригадир' },
    { id: 'lead-2', name: 'Бригадир', role: 'Бригадир' },
    { id: 'office-1', name: 'Офис-менеджер', role: 'Офис-менеджер' },
  ];

  const allMembers: TeamMember[] = React.useMemo(
    () => [...teamMembers, ...managementSlots],
    [],
  );

  // На десктопе показываем 3 карточки, на планшете 2, на мобиле 1
  const [visibleCount, setVisibleCount] = React.useState(3);
  const visibleRef = React.useRef(3);

  const [offset, setOffset] = React.useState(3);
  const [animated, setAnimated] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const offsetRef = React.useRef(3);

  const { extended: EXTENDED, clone: CLONE } = buildExtendedTeam(allMembers, visibleCount);
  const EXT_LEN = EXTENDED.length;

  const touchX = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = touchX.current - endX;
    if (Math.abs(diff) > 48) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  React.useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const v = w < 640 ? 1 : w < 1024 ? 2 : 3;
      if (v === visibleRef.current) return;
      visibleRef.current = v;
      const { initOffset } = buildExtendedTeam(allMembers, v);
      offsetRef.current = initOffset;
      setOffset(initOffset);
      setAnimated(false);
      setVisibleCount(v);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true)),
      );
    }
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, [allMembers]);

  const moveTo = React.useCallback((next: number, withAnim: boolean) => {
    offsetRef.current = next;
    setAnimated(withAnim);
    setOffset(next);
  }, []);

  const handlePrev = () => {
    if (busy) return;
    setBusy(true);
    moveTo(offsetRef.current - 1, true);
  };

  const handleNext = () => {
    if (busy) return;
    setBusy(true);
    moveTo(offsetRef.current + 1, true);
  };

  const cloneRef2 = React.useRef(CLONE);
  cloneRef2.current = CLONE;

  const handleTransitionEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform') return;

      const cur = offsetRef.current;
      const cl = cloneRef2.current;

      if (cur <= cl - 1) {
        const jump = TOTAL_TEAM + cur;
        moveTo(jump, false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setAnimated(true);
            setBusy(false);
          }),
        );
      } else if (cur >= cl + TOTAL_TEAM) {
        const jump = cl + (cur - cl - TOTAL_TEAM);
        moveTo(jump, false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setAnimated(true);
            setBusy(false);
          }),
        );
      } else {
        setBusy(false);
      }
    },
    [moveTo],
  );

  // индекс левой карточки среди оригинальных участников
  const logicalIndex = ((offset - CLONE) % TOTAL_TEAM + TOTAL_TEAM) % TOTAL_TEAM;

  const trackStyle: React.CSSProperties = {
    width: `${(EXT_LEN / visibleCount) * 100}%`,
    transform: `translateX(-${(offset / EXT_LEN) * 100}%)`,
    transition: animated ? 'transform 360ms cubic-bezier(0.4,0,0.2,1)' : 'none',
    willChange: 'transform',
  };

  return (
    <section id="komanda" className="w-full py-16 sm:py-24 scroll-mt-20 bg-slate-50">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Наша команда
        </h2>

        <div className="mt-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Предыдущие сотрудники"
              className="carousel-arrow flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors text-lg select-none"
            >
              ‹
            </button>

            <div
              className="flex-1 overflow-hidden touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                style={trackStyle}
                onTransitionEnd={handleTransitionEnd}
                className="flex"
              >
                {EXTENDED.map((member, i) => (
                  <div
                    key={`${member.id}-${i}`}
                    style={{ width: `${(1 / EXT_LEN) * 100}%` }}
                    className="shrink-0 px-1 sm:px-2"
                  >
                    <div className="h-full rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                      <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-slate-200 ring-2 ring-slate-100 flex items-center justify-center">
                        {member.photo ? (
                          <Image
                            src={assetUrl(member.photo)}
                            alt={member.name}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover object-top"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-slate-700">
                            {member.role}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 font-semibold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Следующие сотрудники"
              className="carousel-arrow flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors text-lg select-none"
            >
              ›
            </button>
          </div>

          {/* Точки */}
          <div className="mt-4 flex justify-center gap-1" role="group" aria-label="Слайды команды">
            {Array.from({ length: TOTAL_TEAM }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => moveTo(CLONE + i, true)}
                aria-label={`Слайд ${i + 1}`}
                aria-current={i === logicalIndex ? 'true' : undefined}
                className="flex h-6 w-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === logicalIndex ? 'h-2 w-6 bg-primary-600' : 'h-2 w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
