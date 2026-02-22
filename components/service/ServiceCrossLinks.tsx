import Link from 'next/link';
import { Container } from '@/components/layout/container';
import type { RelatedLink } from '@/data/service-content';

type Props = {
  title?: string;
  links: RelatedLink[];
};

export function ServiceCrossLinks({ title = 'С этим заказывают и полезные ссылки', links }: Props) {
  if (!links?.length) return null;
  return (
    <section className="py-8 sm:py-10 border-t border-slate-200">
      <Container>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {links.map((link, i) => (
            <li key={i}>
              <Link
                href={link.href}
                className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
