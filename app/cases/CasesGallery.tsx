'use client';

import * as React from 'react';
import { assetUrl } from '@/lib/asset-url';

export const cases = [
  {
    id: '1',
    title: 'Квартира после ремонта',
    area: '65 м²',
    src: '/assets/cases/квартира после ремонта.jpg',
  },
  {
    id: '2',
    title: 'Офис — генеральная уборка',
    area: '120 м²',
    src: '/assets/cases/офис генеральная уборка.png',
  },
  {
    id: '3',
    title: 'Дом после строительства',
    area: '200 м²',
    src: '/assets/cases/дом после строительства.jpg',
  },
];

export function CasesGallery() {
  const [open, setOpen] = React.useState<{ src: string; alt: string } | null>(null);

  // Lock background scroll while lightbox is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setOpen({ src: assetUrl(c.src), alt: c.title })}
            aria-label={`Открыть: ${c.title}`}
            className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {/* Fixed-height container — all cards are visually identical */}
            <div className="flex items-center justify-center bg-slate-100 p-3 h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetUrl(c.src)}
                alt={c.title}
                loading="lazy"
                className="h-full w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-slate-900">{c.title}</h2>
              <p className="text-sm text-slate-500">{c.area}</p>
              <span className="mt-1 inline-block text-xs text-slate-400">
                Нажмите, чтобы открыть
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.alt}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Закрыть"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white text-xl font-bold hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
          >
            ✕
          </button>

          {/* Image — stop propagation so clicking the image doesn't close */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={open.src}
            alt={open.alt}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
