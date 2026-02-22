import { Container } from '@/components/layout/container';

type AnchorSection = { id: string; label: string; content?: string };

type Props = {
  title?: string;
  sections: AnchorSection[];
};

export function ServiceAnchorSections({ title = 'Виды услуг', sections }: Props) {
  if (!sections?.length) return null;
  return (
    <section className="py-8 sm:py-10 border-t border-slate-200">
      <Container>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <div className="mt-8 space-y-12">
          {sections.map((sec) => (
            <article key={sec.id} id={sec.id} className="scroll-mt-24">
              <h3 className="text-lg font-semibold text-slate-800">{sec.label}</h3>
              <p className="mt-2 text-slate-600">
                {sec.content ?? 'Подробное описание и стоимость уточняйте по телефону или через заявку.'}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
