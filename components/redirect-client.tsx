'use client';

import { useEffect } from 'react';

const basePath = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BASE_PATH) || '';

type Props = { to: string };

export function RedirectClient({ to }: Props) {
  useEffect(() => {
    const url = to.startsWith('http') ? to : `${basePath}${to}`.replace(/\/+/g, '/');
    window.location.replace(url);
  }, [to]);
  return (
    <div className="grid min-h-[40vh] place-items-center text-slate-500">
      <p>Перенаправление…</p>
    </div>
  );
}
