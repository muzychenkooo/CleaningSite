import { RedirectClient } from '@/components/redirect-client';

export const metadata = {
  title: 'Цены',
  description: 'Переход к разделу расчёта стоимости',
};

export default function CeniRedirectPage() {
  return <RedirectClient to="/prices/" />;
}
