'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

const CLOSE_DELAY_MS = 200;

type Item = { label: string; href: string };

type Props = {
  id: string;
  label: string;
  items: readonly Item[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  ariaControls: string;
};

/**
 * Accessible dropdown: hover + click, close delay 200ms, rendered in portal so never clipped.
 */
export function NavDropdown({
  id,
  label,
  items,
  open,
  onOpen,
  onClose,
  onScheduleClose,
  onCancelClose,
  triggerRef,
  ariaControls,
}: Props) {
  const panelRef = React.useRef<HTMLUListElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  // Position panel from trigger (for portal)
  React.useEffect(() => {
    if (!open || !triggerRef.current || typeof document === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.left });
  }, [open, triggerRef]);

  // Escape closes
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const panel = open && (
    <ul
      id={ariaControls}
      ref={panelRef}
      role="menu"
      className="fixed z-[100] w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-xl"
      style={{ top: position.top, left: position.left }}
      onMouseEnter={onCancelClose}
      onMouseLeave={onScheduleClose}
    >
      {items.map((item) => (
        <li key={item.href} role="none">
          <Link
            href={item.href}
            role="menuitem"
            className="mx-1 block rounded-lg px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600"
            onClick={onClose}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div
        className="relative shrink-0"
        onMouseEnter={onCancelClose}
        onMouseLeave={onScheduleClose}
      >
        <button
          ref={triggerRef as React.Ref<HTMLButtonElement>}
          type="button"
          className="flex items-center gap-1 whitespace-nowrap py-2 font-medium text-slate-700 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={ariaControls}
          onClick={() => (open ? onClose() : onOpen())}
        >
          {label}
          <span aria-hidden className="text-xs">▾</span>
        </button>
      </div>
      {typeof document !== 'undefined' && panel && createPortal(panel, document.body)}
    </>
  );
}

export { CLOSE_DELAY_MS };
