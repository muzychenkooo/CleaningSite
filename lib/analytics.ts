/**
 * Analytics abstraction for Yandex Metrica / Google Analytics.
 * Set NEXT_PUBLIC_YM_ID or add gtag/ym script in layout to enable.
 * Do not hardcode production IDs here — use env or inject via tag manager.
 */

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
    ym?: (id: number, action: string, params?: Record<string, unknown>) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (window.gtag) window.gtag('event', name, params);
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...params });
}

export function trackFormSubmit(formName: string) {
  trackEvent('form_submit', { form_name: formName });
}

export function trackCtaClick(ctaName: string, destination?: string) {
  trackEvent('cta_click', { cta_name: ctaName, destination });
}
