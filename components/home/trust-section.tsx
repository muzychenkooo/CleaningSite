import { Container } from '@/components/layout/container';
import { advantages } from '@/data/trust';

export function TrustSection() {
  return (
    <section id="otlichaemsya" className="w-full py-16 sm:py-24 bg-slate-50 scroll-mt-20">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Чем мы отличаемся от других клинингов
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl text-lg">
          Команда опытных профессионалов, качество и индивидуальный подход к каждому клиенту.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 motion-reduce:translate-y-0"
            >
              <h3 className="font-display text-lg font-semibold text-slate-900">{a.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
