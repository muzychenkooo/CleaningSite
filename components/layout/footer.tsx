import Link from 'next/link';
import { site } from '@/data/site';
import { Container } from './container';

export function Footer() {
  const halfBusiness = Math.ceil(site.nav.business.length / 2);

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50">
      <Container className="pt-14 pb-24 sm:py-16">
        {/* 4 equal columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_2fr_1fr]">

          {/* Col 1: Brand */}
          <div>
            <p className="font-semibold text-slate-900">{site.name}</p>
            <p className="mt-2 text-sm text-slate-600">{site.description}</p>
            <p className="mt-3 text-sm font-medium text-slate-700">{site.phoneDisplay}</p>
            <p className="text-sm text-slate-600">{site.schedule}</p>
          </div>

          {/* Col 2: Частным клиентам */}
          <div>
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

          {/* Col 3: Для бизнеса — 2 sub-columns inside this wider cell */}
          <div>
            <p className="font-semibold text-slate-900">Для бизнеса</p>
            <div className="mt-2 grid grid-cols-2 gap-x-6">
              <ul className="space-y-1">
                {site.nav.business.slice(0, halfBusiness).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-slate-600 hover:text-primary-600">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1">
                {site.nav.business.slice(halfBusiness).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-slate-600 hover:text-primary-600">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 4: Contacts */}
          <div>
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
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {site.legal.companyName}. {site.legal.rights}.
          </p>
          <div className="flex flex-wrap gap-5">
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
