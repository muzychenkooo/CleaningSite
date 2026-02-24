import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/data/site';
import { Container } from './container';
import { assetUrl } from '@/lib/asset-url';

const FOOTER_BUSINESS_LIMIT = 7;

export function Footer() {
  const footerBusinessItems = [
    ...site.nav.business.slice(0, FOOTER_BUSINESS_LIMIT),
    { label: 'Другое', href: '/business/' },
  ];

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50">
      <Container className="pt-14 pb-24 sm:py-16">
        {/* 4 columns on desktop, 2x2 grid on mobile/tablet */}
        <div className="grid grid-cols-2 gap-10 xl:grid-cols-4">

          {/* Col 1: Brand — ограничиваем ширину контента, как у «Частным клиентам» */}
          <div className="min-w-0 max-w-[13rem] order-1 xl:order-1">
            <p className="font-semibold text-slate-900">{site.name}</p>
            <p className="mt-2 text-sm text-slate-600">{site.description}</p>
          </div>

          {/* Col 2 (mobile order 2, desktop 4): Contacts */}
          <div className="order-2 xl:order-4">
            <p className="font-semibold text-slate-900">Контакты</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                <a href={`tel:${site.phoneRaw}`} className="text-sm text-slate-600 hover:text-primary-600">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-sm text-slate-600 hover:text-primary-600">
                  {site.email}
                </a>
              </li>
              <li className="flex flex-wrap gap-3 pt-1">
                <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-primary-600" aria-label="WhatsApp">
                  WhatsApp
                </a>
                <a href={site.social.vk} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-primary-600" aria-label="VK">
                  Vk
                </a>
                <a href={site.social.telegram} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-primary-600" aria-label="Telegram">
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 (mobile order 3, desktop 2): Частным клиентам */}
          <div className="order-3 xl:order-2">
            <p className="font-semibold text-slate-900">Частным клиентам</p>
            <ul className="mt-2 space-y-1">
              {site.nav.individuals.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-600 hover:text-primary-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 (mobile order 4, desktop 3): Для бизнеса — 7 пунктов + «Другое» на /business/ */}
          <div className="order-4 xl:order-3">
            <p className="font-semibold text-slate-900">Для бизнеса</p>
            <ul className="mt-2 space-y-1">
              {footerBusinessItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-600 hover:text-primary-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} {site.legal.companyName}. {site.legal.rights}.
          </p>

          {/* Desktop-only logo in the center */}
          <div className="hidden md:flex flex-1 justify-center">
            <Link href="/" aria-label="Большая Уборка — на главную">
              <Image
                src={assetUrl('/assets/logo/new_logo.png')}
                alt={site.name}
                width={280}
                height={80}
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-5 sm:justify-end">
            <Link href="/vacancies/" className="text-sm text-slate-500 hover:text-primary-600">
              Вакансии
            </Link>
            <Link href="/contacts/" className="text-sm text-slate-500 hover:text-primary-600">
              Контакты
            </Link>
            <Link href="/privacy/" className="text-sm text-slate-500 hover:text-primary-600">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
