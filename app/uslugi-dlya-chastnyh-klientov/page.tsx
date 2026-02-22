import { RedirectClient } from '@/components/redirect-client';

export const metadata = {
  title: 'Услуги для частных клиентов',
  description: 'Услуги клининга для частных лиц',
};

export default function UslugiChastnyhRedirectPage() {
  return <RedirectClient to="/uslugi/?cat=individuals" />;
}
