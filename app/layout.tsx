import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StickyCta } from '@/components/layout/sticky-cta';
import { site } from '@/data/site';
import { LocalBusinessJsonLd } from './json-ld';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-display',
});
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
});

const baseUrl = 'https://bigyborka.ru';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${site.name} — ${site.tagline} | ${site.region}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ['клининг', 'уборка', 'Москва', 'Московская область', 'уборка квартир', 'уборка офисов', 'мойка окон', 'клининговая компания'],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: baseUrl,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: baseUrl + '/' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        {/* Security hardening: referrer policy */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <LocalBusinessJsonLd />
        <Header />
        <main className="flex-1 pb-20 sm:pb-0">{children}</main>
        <Footer />
        <StickyCta />
      </body>
    </html>
  );
}
