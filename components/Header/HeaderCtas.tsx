'use client';

import Link from 'next/link';
import { site } from '@/data/site';
import { Button } from '@/components/ui/button';

type Props = {
  /** Desktop: show phone + both CTAs. Tablet/mobile: show icon/CTAs + burger slot. */
  variant: 'desktop' | 'mobile';
  phoneDisplay: string;
};

/**
 * CTA group: phone link + primary CTA + secondary CTA.
 * Desktop: all visible, never shrink. Mobile: phone icon + 1–2 CTAs (burger is separate).
 */
export function HeaderCtas({ variant, phoneDisplay }: Props) {
  if (variant === 'desktop') {
    return (
      <div className="flex shrink-0 flex-nowrap items-center gap-2 xl:gap-2.5" style={{ minWidth: '220px' }}>
        <a
          href={`tel:${site.phoneRaw}`}
          className="shrink-0 whitespace-nowrap text-sm font-medium text-slate-700 hover:text-primary-600"
          title={phoneDisplay}
        >
          {phoneDisplay}
        </a>
        <Button asChild size="sm" className="shrink-0 whitespace-nowrap">
          <Link href="/?open=quiz#rasschet">{site.cta.calculateShort}</Link>
        </Button>
        <Button asChild size="sm" className="shrink-0 whitespace-nowrap" variant="outline">
          <Link href="/#zayavka">{site.cta.callback}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 flex-nowrap items-center gap-2">
      <a
        href={`tel:${site.phoneRaw}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 md:hidden"
        aria-label="Позвонить"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </a>
      <Button asChild size="sm" className="hidden whitespace-nowrap sm:inline-flex">
        <Link href="/?open=quiz#rasschet">{site.cta.calculateShort}</Link>
      </Button>
      <Button asChild size="sm" className="hidden whitespace-nowrap md:inline-flex" variant="outline">
        <Link href="/#zayavka">{site.cta.callback}</Link>
      </Button>
    </div>
  );
}
