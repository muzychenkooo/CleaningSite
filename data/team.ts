export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo?: string;
};

// Базовое ядро команды — клинеры (одного убрали по просьбе заказчика)
// Фото должны лежать в public/assets/team/… чтобы корректно отдаваться Next.js
export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Ирина', role: 'Клинер', photo: '/assets/team/клинер1.png' },
  { id: '2', name: 'Галина', role: 'Клинер', photo: '/assets/team/клинер2.png' },
  { id: '3', name: 'Инга', role: 'Клинер', photo: '/assets/team/клинер3.png' },
  { id: '4', name: 'Сергей', role: 'Клинер', photo: '/assets/team/клинер4.png' },
];
