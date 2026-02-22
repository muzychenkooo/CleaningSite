import Link from 'next/link';
import { Container } from '@/components/layout/container';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <Container className="text-center">
        <p className="text-6xl font-display font-bold text-primary-600">404</p>
        <h1 className="mt-4 text-2xl font-display font-bold text-slate-900 sm:text-3xl">
          Страница не найдена
        </h1>
        <p className="mt-2 max-w-md mx-auto text-slate-600">
          Возможно, ссылка устарела или страница была перемещена. Вернитесь на главную или воспользуйтесь меню.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            На главную
          </Link>
          <Link
            href="/contacts/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Контакты
          </Link>
        </div>
      </Container>
    </div>
  );
}
