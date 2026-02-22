import { Container } from '@/components/layout/container';
import type { ProcessStep } from '@/data/service-content';

type Props = {
  title?: string;
  steps: ProcessStep[];
};

export function ServiceProcess({ title = 'Как мы работаем', steps }: Props) {
  if (!steps?.length) return null;
  return (
    <section className="py-8 sm:py-10 border-t border-slate-200">
      <Container>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <ol className="mt-6 space-y-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:space-y-0">
          {steps.map((step, i) => (
            <li key={i} className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {i + 1}
              </span>
              <h3 className="mt-3 font-medium text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
