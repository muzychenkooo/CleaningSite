import { RedirectClient } from '@/components/redirect-client';

export const metadata = {
  title: 'Контакты',
  description: 'Переход на страницу контактов',
};

export default function KontaktyRedirectPage() {
  return <RedirectClient to="/contacts/" />;
}
