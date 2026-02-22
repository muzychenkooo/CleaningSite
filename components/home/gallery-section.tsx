'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { completedReports } from '@/data/reports';
import { VideoWithOverlay } from '@/components/ui/VideoWithOverlay';
import { assetUrl } from '@/lib/asset-url';

/* ─── Gallery photos ─────────────────────────────────────────────────── */
const galleryPhotos = [
  { src: '/assets/gallery/1000004534.jpg', alt: 'Уборка — фото 1' },
  { src: '/assets/gallery/1000006679.jpg', alt: 'Уборка — фото 2' },
  { src: '/assets/gallery/posle-remonta.jpg', alt: 'После ремонта' },
  { src: '/assets/gallery/20220806.jpg', alt: 'Уборка — фото 5' },
  { src: '/assets/gallery/20250219.jpg', alt: 'Уборка — фото 6' },
  { src: '/assets/gallery/20250709.jpg', alt: 'Уборка — фото 7' },
  { src: '/assets/gallery/IMG_20230225.jpg', alt: 'Уборка — фото 8' },
  { src: '/assets/gallery/IMG_20230310.jpg', alt: 'Уборка — фото 9' },
  { src: '/assets/gallery/IMG_20230723.jpg', alt: 'Уборка — фото 10' },
  { src: '/assets/gallery/IMG_20240712.jpg', alt: 'Уборка — фото 11' },
  { src: '/assets/gallery/IMG_20241113.jpg', alt: 'Уборка — фото 12' },
];

/* ─── Carousel constants ─────────────────────────────────────────────── */
const TOTAL = galleryPhotos.length;

/**
 * Build the extended array for infinite-loop carousel.
 *   [ tail clones | originals | head clones ]
 * The clone count equals `visible` so that we always have enough
 * buffer on each side when sliding.
 */
function buildExtended(visible: number) {
  const clone = visible;
  return {
    extended: [
      ...galleryPhotos.slice(-clone),
      ...galleryPhotos,
      ...galleryPhotos.slice(0, clone),
    ],
    clone,
    initOffset: clone,
  };
}

/* ─── Component ──────────────────────────────────────────────────────── */
export function GallerySection() {
  // Responsive visible count: 1 on mobile (<640px), 2 on sm+
  // SSR-safe: default to 2 (matches most initial renders); corrected on mount.
  const [visibleCount, setVisibleCount] = React.useState(2);
  const visibleRef = React.useRef(2);

  const [offset, setOffset] = React.useState(2); // INIT_OFFSET for visible=2
  const [animated, setAnimated] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  // Keep a ref so transitionEnd handler always reads the latest offset
  const offsetRef = React.useRef(2);

  // Rebuild derived values whenever visibleCount changes
  const { extended: EXTENDED, clone: CLONE } = buildExtended(visibleCount);
  const EXT_LEN = EXTENDED.length;

  // Sync responsive visible count and reset carousel on breakpoint change
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
      // Re-enable animation after DOM settles
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
    const target = CLONE + i; // CLONE is current from closure
    if (target === offsetRef.current) return;
    setBusy(true);
    moveTo(target, true);
  };

  /**
   * After each CSS transition:
   * - If we slid into the start-clone zone (offset ≤ CLONE-1), snap to the
   *   matching real position at the tail end of the originals.
   * - If we slid into the end-clone zone (offset ≥ CLONE+TOTAL), snap back
   *   to the matching real position at the head of the originals.
   * In both cases, disable animation for the snap, then re-enable immediately
   * on the next two animation frames so the user never sees the jump.
   *
   * Uses refs for clone/total to avoid stale closure bugs on resize.
   */
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

  // Which original photo index is at the left of the visible window
  const logicalIndex = ((offset - CLONE) % TOTAL + TOTAL) % TOTAL;

  /**
   * CSS math:
   *   Track width  = (EXT_LEN / visibleCount) * 100%  of container
   *   Item width   = (1 / EXT_LEN) * 100%              of track
   *   translateX   = -(offset / EXT_LEN) * 100%        of track
   *
   * Simplifies to:
   *   Each item  = (1 / visibleCount) * 100% of container
   *   Each step  = (1 / visibleCount) * 100% of container
   */
  const trackStyle: React.CSSProperties = {
    width: `${(EXT_LEN / visibleCount) * 100}%`,
    transform: `translateX(-${(offset / EXT_LEN) * 100}%)`,
    transition: animated ? 'transform 420ms cubic-bezier(0.4,0,0.2,1)' : 'none',
  };

  return (
    <section id="foto-video" className="w-full py-16 sm:py-24 bg-slate-50 scroll-mt-20">
      <Container>

        {/* ── Фото с места ── */}
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Фото с места
        </h2>

        <div className="mt-6 flex items-center gap-3 sm:gap-4">
          {/* Prev */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={busy}
            aria-label="Предыдущее фото"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors disabled:opacity-40 text-lg select-none"
          >
            ‹
          </button>

          {/* Viewport — clips the extended track */}
          <div className="flex-1 overflow-hidden">
            <div
              style={trackStyle}
              onTransitionEnd={handleTransitionEnd}
              className="flex"
            >
              {EXTENDED.map((photo, i) => (
                <div
                  key={i}
                  style={{ width: `${(1 / EXT_LEN) * 100}%` }}
                  className="shrink-0 px-1 sm:px-2"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 shadow-sm">
                    <Image
                      src={assetUrl(photo.src)}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 639px) 95vw, 50vw"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={handleNext}
            disabled={busy}
            aria-label="Следующее фото"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors disabled:opacity-40 text-lg select-none"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-1" role="group" aria-label="Слайды">
          {galleryPhotos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDotClick(i)}
              aria-label={`Фото ${i + 1}`}
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

        {/* ── Видео с нами ── */}
        <h2 className="font-display mt-16 text-2xl font-bold text-slate-900">
          Видео с нами
        </h2>
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
          <VideoWithOverlay
            src={assetUrl('/assets/videos/video1.mp4')}
            poster={assetUrl('/assets/gallery/posle-remonta.jpg')}
            label="Видео с нами — 1"
            wrapperClassName="flex-1 rounded-xl bg-slate-900 shadow-sm"
            videoClassName="w-full aspect-video object-cover"
          />
          <VideoWithOverlay
            src={assetUrl('/assets/videos/video2.mp4')}
            poster={assetUrl('/assets/gallery/20220806.jpg')}
            label="Видео с нами — 2"
            wrapperClassName="flex-1 rounded-xl bg-slate-900 shadow-sm"
            videoClassName="w-full aspect-video object-cover"
          />
        </div>

        {/* ── Выполненные работы ── */}
        <h2 className="font-display mt-16 text-2xl font-bold text-slate-900">
          Выполненные работы
        </h2>
        <div className="mt-6 space-y-6">
          {completedReports.map((report) => (
            <div key={report.id} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative h-40 w-full sm:w-56 shrink-0 rounded-lg overflow-hidden bg-slate-200">
                  <Image
                    src={assetUrl('/assets/restaurant/restaurant.png')}
                    alt={report.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 224px"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{report.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">{report.excerpt}</p>
                  <Link
                    href={report.href}
                    className="mt-2 inline-block text-sm font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
                  >
                    Читать далее
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}
