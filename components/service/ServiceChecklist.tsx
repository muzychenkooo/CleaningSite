import { Container } from '@/components/layout/container';

type Props = {
  title?: string;
  items: string[];
};

export function ServiceChecklist({ title = 'Что входит в услугу', items }: Props) {
  if (!items?.length) return null;
  return (
    <section className="py-8 sm:py-10 border-t border-slate-200">
      <Container>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <ul className="mt-3 list-disc list-inside space-y-2 text-slate-600">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
