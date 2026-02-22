'use client';

import Link from 'next/link';
import { site } from '@/data/site';
import { Button } from '@/components/ui/button';

export function StickyCta() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center gap-3 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.12)] backdrop-blur sm:hidden">
      <Button asChild className="flex-1 h-11 rounded-xl font-semibold">
        <Link href="/#zayavka">{site.cta.order}</Link>
      </Button>
      <Button asChild variant="outline" className="flex-1 h-11 rounded-xl font-semibold border-2">
        <Link href="/?open=quiz#rasschet">{site.cta.calculateShort}</Link>
      </Button>
    </div>
  );
}
