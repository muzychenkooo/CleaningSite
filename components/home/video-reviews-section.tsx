'use client';

import * as React from 'react';
import { Container } from '@/components/layout/container';
import { assetUrl } from '@/lib/asset-url';

/* ─── Source of truth: only videos present in Наполнение/фото/Видеоотзывы ── */
const videoReviews = [
  { id: '1', name: 'Отзыв Людмилы',   src: assetUrl('/assets/video-reviews/lyudmila.mp4')  },
  { id: '2', name: 'Отзыв Маргариты', src: assetUrl('/assets/video-reviews/margarita.mp4') },
  { id: '3', name: 'Отзыв Ольги',     src: assetUrl('/assets/video-reviews/olga.mov')      },
  { id: '4', name: 'Отзыв Алексея',   src: assetUrl('/assets/video-reviews/aleksei.mp4')   },
];

const TOTAL = videoReviews.length;

function buildExtended(visible: number) {
  const clone = visible;
  return {
    extended: [
      ...videoReviews.slice(-clone),
      ...videoReviews,
      ...videoReviews.slice(0, clone),
    ],
    clone,
    initOffset: clone,
  };
}

/* ─── VideoCard: self-contained card with play overlay ─────────────────── */
function VideoCard({ src, name }: { src: string; name: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(true);
    videoRef.current?.play().catch(() => {});
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Video wrapper — constrained height, portrait-safe */}
      <div className="relative bg-slate-900 flex items-center justify-center">
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          playsInline
          controls={playing}
          className="block w-full object-contain"
          style={{ maxHeight: 'min(62vh, 460px)' }}
          aria-label={name}
        />

        {/* Play overlay — disappears permanently on first click */}
        {!playing && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Запустить видео"
            className="absolute inset-0 flex items-center justify-center
              bg-gradient-to-b from-black/10 via-black/40 to-black/65
              transition-all duration-200
              hover:from-black/20 hover:via-black/50 hover:to-black/75
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-primary-500 focus-visible:ring-inset"
          >
            <span
              aria-hidden
              className="flex h-16 w-16 items-center justify-center
                rounded-full bg-primary-600 text-white shadow-lg
                transition-transform duration-200
                hover:scale-110 active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <p className="px-4 py-3 text-sm font-bold text-slate-700 text-center">
        {name}
      </p>
    </div>
  );
}

/* ─── Carousel ──────────────────────────────────────────────────────────── */
export function VideoReviewsSection() {
  const [visibleCount, setVisibleCount] = React.useState(2);
  const visibleRef = React.useRef(2);

  const [offset, setOffset] = React.useState(2);
  const [animated, setAnimated] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const offsetRef = React.useRef(2);

  const { extended: EXTENDED, clone: CLONE } = buildExtended(visibleCount);
  const EXT_LEN = EXTENDED.length;

  React.useEffect(() => {
    function update() {
      const v = window.innerWidth < 640 ? 1 : 2;
      if (v === visibleRef.current) return;
      visibleRef.current = v;
      const { initOffset } = buildExtended(v);
      offsetRef.current = initOffset;
      setOffset(initOffset);
      setAnimated(false);
      setVisibleCount(v);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
    }
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const moveTo = React.useCallback((newOffset: number, withAnim: boolean) => {
    offsetRef.current = newOffset;
    setAnimated(withAnim);
    setOffset(newOffset);
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

  const handleDotClick = (i: number) => {
    if (busy) return;
    const target = CLONE + i;
    if (target === offsetRef.current) return;
    setBusy(true);
    moveTo(target, true);
  };

  const cloneRef2 = React.useRef(CLONE);
  cloneRef2.current = CLONE;

  const handleTransitionEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform') return;

      const cur = offsetRef.current;
      const cl = cloneRef2.current;

      if (cur <= cl - 1) {
        const jump = TOTAL + cur;
        moveTo(jump, false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setAnimated(true);
            setBusy(false);
          }),
        );
      } else if (cur >= cl + TOTAL) {
        const jump = cl + (cur - cl - TOTAL);
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

  const logicalIndex = ((offset - CLONE) % TOTAL + TOTAL) % TOTAL;

  const trackStyle: React.CSSProperties = {
    width: `${(EXT_LEN / visibleCount) * 100}%`,
    transform: `translateX(-${(offset / EXT_LEN) * 100}%)`,
    transition: animated ? 'transform 420ms cubic-bezier(0.4,0,0.2,1)' : 'none',
    willChange: 'transform',
  };

  return (
    <section id="video-otzyvy" className="w-full py-16 sm:py-24 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Видеоотзывы
        </h2>

        <div className="mt-6 flex items-center gap-3 sm:gap-4">
          {/* Prev */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={busy}
            aria-label="Предыдущий видеоотзыв"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors disabled:opacity-40 text-lg select-none"
          >
            ‹
          </button>

          {/* Viewport */}
          <div className="flex-1 overflow-hidden">
            <div
              style={trackStyle}
              onTransitionEnd={handleTransitionEnd}
              className="flex"
            >
              {EXTENDED.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  style={{ width: `${(1 / EXT_LEN) * 100}%` }}
                  className="shrink-0 px-1 sm:px-2"
                >
                  <VideoCard src={item.src} name={item.name} />
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={handleNext}
            disabled={busy}
            aria-label="Следующий видеоотзыв"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors disabled:opacity-40 text-lg select-none"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-1" role="group" aria-label="Слайды видеоотзывов">
          {videoReviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDotClick(i)}
              aria-label={`Видеоотзыв ${i + 1}`}
              aria-current={i === logicalIndex ? 'true' : undefined}
              className="flex h-6 w-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === logicalIndex
                    ? 'h-2 w-6 bg-primary-600'
                    : 'h-2 w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
