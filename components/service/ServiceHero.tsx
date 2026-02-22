import Link from 'next/link';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { site } from '@/data/site';

type Props = {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  intro: string;
};

export function ServiceHero({ breadcrumbs, title, intro }: Props) {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl">{intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/quiz/">{site.cta.calculate}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#callback">{site.cta.order}</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${site.phoneRaw}`}>Позвонить</a>
          </Button>
          <Button asChild variant="outline">
            <a href={site.social.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={site.social.telegram} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
