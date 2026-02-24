export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo?: string;
};

// Базовое ядро команды — клинеры (одного убрали по просьбе заказчика)
export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Ирина Григорьева', role: 'Клинер', photo: '/assets/team/ирина.jpg' },
  { id: '2', name: 'Галина Кравченко', role: 'Клинер', photo: '/assets/team/галина.jpg' },
  { id: '3', name: 'Инга Юдина', role: 'Клинер', photo: '/assets/team/инга.jpg' },
  { id: '4', name: 'Мария Смирнова', role: 'Клинер', photo: '/assets/team/мария.jpg' },
];
