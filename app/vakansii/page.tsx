import { RedirectClient } from '@/components/redirect-client';

export const metadata = {
  title: 'Вакансии',
  description: 'Переход на страницу вакансий',
};

export default function VakansiiRedirectPage() {
  return <RedirectClient to="/vacancies/" />;
}
