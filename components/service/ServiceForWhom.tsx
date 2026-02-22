import { Container } from '@/components/layout/container';

type Props = {
  title?: string;
  scenarios: string[];
};

export function ServiceForWhom({ title = 'Для кого подходит / когда нужно', scenarios }: Props) {
  if (!scenarios?.length) return null;
  return (
    <section className="py-8 sm:py-10 bg-slate-50/50">
      <Container>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-slate-600">
          {scenarios.map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" aria-hidden />
              {s}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
