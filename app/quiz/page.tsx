import { RedirectClient } from '@/components/redirect-client';

export const metadata = {
  title: 'Рассчитать стоимость',
  description: 'Подберите тип уборки и получите ориентировочную смету. Менеджер свяжется в течение 5–10 минут.',
};

/** Квиз перенесён на главную страницу (секция #rasschet). Редирект для старых ссылок. */
export default function QuizRedirectPage() {
  return <RedirectClient to="/?open=quiz#rasschet" />;
}
