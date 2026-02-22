import Image from 'next/image';
import { Container } from '@/components/layout/container';
import { teamMembers } from '@/data/team';
import { assetUrl } from '@/lib/asset-url';

export function TeamSection() {
  return (
    <section id="komanda" className="w-full py-16 sm:py-24 scroll-mt-20 bg-slate-50">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Наша команда
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-slate-200 ring-2 ring-slate-100">
                <Image
                  src={assetUrl(member.photo)}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 font-semibold text-slate-900">{member.name}</p>
              <p className="text-sm text-slate-500">{member.role}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
