import { RedirectClient } from '@/components/redirect-client';

export const metadata = {
  title: 'Рассчитать стоимость',
  description: 'Переход к разделу расчёта стоимости',
};

export default function RasschetRedirectPage() {
  return <RedirectClient to="/?open=quiz#rasschet" />;
}
