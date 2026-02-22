import { RedirectClient } from '@/components/redirect-client';

export const metadata = {
  title: 'Политика конфиденциальности',
  description: 'Переход на страницу политики конфиденциальности',
};

export default function LegalRedirectPage() {
  return <RedirectClient to="/privacy/" />;
}
