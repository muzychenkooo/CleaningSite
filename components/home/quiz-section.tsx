'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { QuizWizard } from '@/components/quiz/QuizWizard';

export function QuizSection() {
  const [showWizard, setShowWizard] = React.useState(false);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get('open') === 'quiz') {
      setShowWizard(true);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('open');
        window.history.replaceState({}, '', url.pathname + '#rasschet');
      }
    }
  }, [searchParams]);

  if (showWizard) {
    return (
      <section id="rasschet" className="w-full py-16 sm:py-24 scroll-mt-24 bg-slate-50">
        <QuizWizard onSuccessClose={() => setShowWizard(false)} />
      </section>
    );
  }

  return (
    <section id="rasschet" className="w-full py-16 sm:py-24 scroll-mt-24 bg-slate-50">
      <Container className="flex flex-col items-center text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Узнайте стоимость за 2 минуты
        </h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Пройдите короткий квиз — выберите тип уборки и параметры. Мы подготовим смету и перезвоним в течение 5–10 минут.
        </p>
        <Button
          type="button"
          size="lg"
          className="mt-8 rounded-xl font-semibold shadow-lg hover:shadow-xl h-12 px-8"
          onClick={() => setShowWizard(true)}
        >
          Пройти квиз
        </Button>
      </Container>
    </section>
  );
}
