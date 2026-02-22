import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { ServiceJsonLd } from '@/app/json-ld';
import { getServiceBySlug, services } from '@/data/services';
import { site } from '@/data/site';

const baseUrl = 'https://bigyborka.ru';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: 'Услуга' };
  const url = `${baseUrl}/uslugi/${slug}`;
  return {
    title: service.title,
    description: service.shortDesc,
    openGraph: {
      title: `${service.title} | ${site.name}`,
      description: service.shortDesc,
      url,
      locale: 'ru_RU',
    },
    alternates: { canonical: url },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const serviceUrl = `${baseUrl}/uslugi/${slug}`;
  return (
    <div className="py-12 sm:py-20">
      <ServiceJsonLd name={service.title} description={service.shortDesc} url={serviceUrl} />
      <Container>
        <nav className="text-sm text-slate-500 mb-6" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-primary-600">Главная</Link>
          <span className="mx-2">/</span>
          <Link href="/uslugi" className="hover:text-primary-600">Услуги</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{service.title}</span>
        </nav>
        <article>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {service.title}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{service.shortDesc}</p>
          <p className="mt-6 text-slate-600">
            Стоимость зависит от площади, типа помещения и объёма работ. Оставьте заявку — менеджер рассчитает цену и согласует время выезда. Оплата по факту выполнения работ после вашей проверки качества.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/#zayavka">Оставить заявку</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/?open=quiz#rasschet">Рассчитать стоимость</Link>
            </Button>
          </div>
        </article>
      </Container>
    </div>
  );
}
