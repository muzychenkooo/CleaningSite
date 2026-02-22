import { Container } from '@/components/layout/container';

type Props = {
  title?: string;
  items: string[];
};

export function ServiceEquipment({ title = 'Оборудование и средства', items }: Props) {
  if (!items?.length) return null;
  return (
    <section className="py-8 sm:py-10 bg-slate-50/50 border-t border-slate-200">
      <Container>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-slate-600">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-slate-400" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
